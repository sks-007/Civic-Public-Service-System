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

// Demo data (same as in route.ts - could be moved to shared file)
const demoComplaints = [
  {
    id: 'CMP-2026-0001',
    fullname: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    ward: 'Ward 1',
    category: 'Street Lighting',
    location: '123 Main Street',
    description: 'Street light has been out for 3 days near the intersection.',
    status: 'Pending',
    priority: 'Medium',
    progress: 25,
    created_at: '2026-03-10T10:00:00Z',
    officer: 'Officer Smith',
    officer_designation: 'Field Inspector',
    funds_allocated: 500
  },
  {
    id: 'CMP-2026-0002',
    fullname: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+1987654321',
    ward: 'Ward 2',
    category: 'Waste Management',
    location: '456 Oak Avenue',
    description: 'Garbage not collected for a week in the residential area.',
    status: 'In Progress',
    priority: 'High',
    progress: 60,
    created_at: '2026-03-09T14:30:00Z',
    officer: 'Officer Johnson',
    officer_designation: 'Sanitation Lead',
    funds_allocated: 200
  },
  {
    id: 'CMP-2026-0003',
    fullname: 'Bob Wilson',
    email: 'bob@example.com',
    phone: '+1122334455',
    ward: 'Ward 3',
    category: 'Transportation',
    location: '789 Pine Road',
    description: 'Large pothole causing traffic issues and vehicle damage.',
    status: 'Resolved',
    priority: 'Critical',
    progress: 100,
    created_at: '2026-03-08T09:15:00Z',
    officer: 'Officer Davis',
    officer_designation: 'Road Maintenance',
    funds_allocated: 1500
  }
];

// GET /api/complaints/[id] - Get single complaint by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (getSupabase()) {
      const { data, error } = await getSupabase()
        .from('complaints')
        .select('*')
        .or(`id.eq.${id},id.ilike.%${id}%`)
        .single();

      if (error) throw error;

      return NextResponse.json({ success: true, data });
    } else {
      // Demo mode
      const complaint = demoComplaints.find(c => c.id === id);
      if (complaint) {
        return NextResponse.json({ success: true, data: complaint, demo: true });
      } else {
        return NextResponse.json(
          { success: false, error: 'Complaint not found' },
          { status: 404 }
        );
      }
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// PUT /api/complaints/[id] - Update complaint
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (getSupabase()) {
      const { data, error } = await getSupabase()
        .from('complaints')
        .update(body)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({ success: true, data });
    } else {
      // Demo mode
      return NextResponse.json({
        success: true,
        data: { id, ...body },
        demo: true,
        message: 'Complaint updated in demo mode'
      });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// DELETE /api/complaints/[id] - Delete complaint
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (getSupabase()) {
      const { error } = await getSupabase()
        .from('complaints')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return NextResponse.json({ success: true, message: 'Complaint deleted' });
    } else {
      // Demo mode
      return NextResponse.json({
        success: true,
        message: 'Complaint deleted in demo mode',
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