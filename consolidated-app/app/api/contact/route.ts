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

// POST /api/contact - Submit contact form
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (getSupabase()) {
      const contactData = {
        name,
        email,
        subject,
        message,
        created_at: new Date().toISOString()
      };

      const { data, error } = await getSupabase()
        .from('contacts')
        .insert([contactData])
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({
        success: true,
        data,
        message: 'Contact form submitted successfully'
      });
    } else {
      // Demo mode - just accept the submission
      console.log('Contact form submission (demo mode):', body);

      return NextResponse.json({
        success: true,
        message: 'Message received successfully (demo mode)',
        demo: true,
        data: {
          id: Math.floor(Math.random() * 10000),
          ...body,
          created_at: new Date().toISOString()
        }
      });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// GET /api/contact - Get all contact submissions (Admin only)
export async function GET() {
  try {
    if (getSupabase()) {
      const { data, error } = await getSupabase()
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return NextResponse.json({ success: true, data });
    } else {
      // Demo mode - return empty list
      return NextResponse.json({
        success: true,
        data: [],
        demo: true,
        message: 'No contact submissions in demo mode'
      });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}