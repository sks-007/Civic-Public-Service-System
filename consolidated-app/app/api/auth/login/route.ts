import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Supabase client configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase: any = null;

function getSupabase() {
  if (!supabase) {
    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project-ref')) {
      return null;
    }
    supabase = createClient(supabaseUrl, supabaseKey);
  }
  return supabase;
}

// Demo users for when Supabase is not configured
const demoUsers = [
  {
    id: 1,
    email: 'user@demo.com',
    password: 'demo123',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+1234567890',
    ward: 'Ward 1'
  },
  {
    id: 2,
    email: 'admin@cpss.gov',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    phone: '+1234567890',
    ward: 'Admin',
    role: 'admin'
  }
];

// POST /api/auth/login - User authentication
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Always allow demo credentials so local testing works even when Supabase is configured.
    const demoUser = demoUsers.find(u => u.email === email && u.password === password);
    if (demoUser) {
      const { password: _, ...userResponse } = demoUser;
      return NextResponse.json({
        success: true,
        data: userResponse,
        message: 'Login successful (demo mode)',
        demo: true
      });
    }

    if (getSupabase()) {
      // Use Supabase Auth to verify credentials
      const { data, error: authError } = await getSupabase().auth.signInWithPassword({
        email,
        password,
      });

      if (authError || !data.user) {
        return NextResponse.json(
          { success: false, error: 'Invalid email or password' },
          { status: 401 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          id: data.user.id,
          email: data.user.email,
          ...data.user.user_metadata,
        },
        message: 'Login successful'
      });

    }

    return NextResponse.json(
      { success: false, error: 'Invalid email or password' },
      { status: 401 }
    );

  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}