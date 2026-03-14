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

// Demo data for when Supabase is not configured
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

// GET /api/complaints - Get all complaints
export async function GET() {
  try {
    if (getSupabase()) {
      const { data, error } = await getSupabase()
        .from('complaints')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return NextResponse.json({ success: true, data });
    } else {
      // Demo mode
      return NextResponse.json({ success: true, data: demoComplaints, demo: true });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST /api/complaints - Create new complaint
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (getSupabase()) {
      // Generate complaint ID
      const year = new Date().getFullYear();
      const complaintId = `CMP-${year}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;

      const complaintData = {
        id: complaintId,
        fullname: body.fullname,
        email: body.email,
        phone: body.phone,
        ward: body.ward,
        category: body.category,
        location: body.location,
        description: body.description,
        status: 'Pending',
        priority: body.priority || 'Medium',
        progress: 0,
        funds_allocated: 0
      };

      const { data, error } = await getSupabase()
        .from('complaints')
        .insert([complaintData])
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({ success: true, data, complaintId });
    } else {
      // Demo mode
      const year = new Date().getFullYear();
      const complaintId = `CMP-${year}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;

      const newComplaint = {
        id: complaintId,
        ...body,
        status: 'Pending',
        priority: body.priority || 'Medium',
        progress: 0,
        created_at: new Date().toISOString(),
        funds_allocated: 0
      };

      return NextResponse.json({ success: true, data: newComplaint, complaintId, demo: true });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}