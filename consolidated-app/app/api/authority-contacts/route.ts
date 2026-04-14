import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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

// Demo authority contacts
const demoContacts = [
  { id: 1, fullname: 'John Peterson', email: 'john@cpss.gov', phone: '+1234567890', department: 'Waste Management' },
  { id: 2, fullname: 'Sarah Williams', email: 'sarah@cpss.gov', phone: '+1987654321', department: 'Transportation' },
  { id: 3, fullname: 'Mike Roberts', email: 'mike@cpss.gov', phone: '+1122334455', department: 'Water & Sewage' },
];

// POST /api/authority-contacts - Add a new authority contact (Admin only)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullname, email, phone, department } = body;

    if (!fullname || !email || !department) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and department are required' },
        { status: 400 }
      );
    }

    if (getSupabase()) {
      const { data, error } = await getSupabase()
        .from('authority_contacts')
        .insert([{ fullname, email, phone, department }])
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({ success: true, data });
    } else {
      // Demo mode
      const newContact = {
        id: demoContacts.length + 1,
        fullname,
        email,
        phone,
        department,
        created_at: new Date().toISOString(),
      };

      return NextResponse.json({
        success: true,
        data: newContact,
        demo: true,
        message: 'Contact added in demo mode',
      });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// GET /api/authority-contacts - List all authority contacts
export async function GET() {
  try {
    if (getSupabase()) {
      const { data, error } = await getSupabase()
        .from('authority_contacts')
        .select('*')
        .order('department', { ascending: true });

      if (error) throw error;

      return NextResponse.json({ success: true, data });
    } else {
      return NextResponse.json({ success: true, data: demoContacts, demo: true });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
