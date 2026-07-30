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

// POST /api/officers - Add a new officer (Admin only)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, address } = body;

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: 'Name and email are required' },
        { status: 400 }
      );
    }

    if (getSupabase()) {
      const { data, error } = await getSupabase()
        .from('officers')
        .insert([{ name, email, phone, address, is_active: true }])
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({ success: true, data });
    } else {
      // Demo mode
      const newOfficer = {
        id: Date.now(),
        name,
        email,
        phone,
        address,
        is_active: true,
        created_at: new Date().toISOString(),
      };

      return NextResponse.json({
        success: true,
        data: newOfficer,
        demo: true,
        message: 'Officer added in demo mode',
      });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// GET /api/officers - List all officers (Admin only)
export async function GET() {
  try {
    if (getSupabase()) {
      const { data, error } = await getSupabase()
        .from('officers')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;

      return NextResponse.json({ success: true, data });
    } else {
      // Demo mode
      return NextResponse.json({
        success: true,
        data: [
          { id: 1, name: 'Officer Smith', email: 'smith@cpss.gov', phone: '+1234567890', address: '100 Civic Ave', is_active: true },
          { id: 2, name: 'Officer Johnson', email: 'johnson@cpss.gov', phone: '+1987654321', address: '200 Service Rd', is_active: true },
          { id: 3, name: 'Officer Davis', email: 'davis@cpss.gov', phone: '+1122334455', address: '300 Officer Lane', is_active: true },
        ],
        demo: true,
      });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
