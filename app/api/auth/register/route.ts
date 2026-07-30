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
  }
];

// POST /api/auth/register - User registration
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName, phone, ward } = body;

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (getSupabase()) {
      // Use Supabase Auth to create the user
      const { data: authData, error: authError } = await getSupabase().auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            phone,
            district: ward,
          }
        }
      });

      if (authError) throw authError;

      if (!authData.user) {
        return NextResponse.json(
          { success: false, error: 'Registration failed. Please try again.' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          id: authData.user.id,
          email: authData.user.email,
        },
        message: 'User registered successfully. Please check your email to confirm your account.'
      });

    } else {
      // Demo mode
      const existingUser = demoUsers.find(user => user.email === email);

      if (existingUser) {
        return NextResponse.json(
          { success: false, error: 'User with this email already exists' },
          { status: 400 }
        );
      }

      const newUser = {
        id: demoUsers.length + 1,
        email,
        firstName,
        lastName,
        phone,
        ward,
        created_at: new Date().toISOString()
      };

      return NextResponse.json({
        success: true,
        data: newUser,
        message: 'User registered successfully (demo mode)',
        demo: true
      });
    }

  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}