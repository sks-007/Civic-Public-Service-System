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

// Demo categories
const demoCategories = [
  { id: 1, name: 'Waste Management' },
  { id: 2, name: 'Transportation' },
  { id: 3, name: 'Water & Sewage' },
  { id: 4, name: 'Parks & Recreation' },
  { id: 5, name: 'Street Lighting' },
  { id: 6, name: 'Public Safety' },
  { id: 7, name: 'Noise Complaints' }
];

// GET /api/categories - Get all categories
export async function GET() {
  try {
    if (getSupabase()) {
      const { data, error } = await getSupabase()
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;

      return NextResponse.json({ success: true, data });
    } else {
      // Demo mode
      return NextResponse.json({ success: true, data: demoCategories, demo: true });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST /api/categories - Create new category (Admin only)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Category name is required' },
        { status: 400 }
      );
    }

    if (getSupabase()) {
      const categoryData = {
        name,
        description,
        created_at: new Date().toISOString()
      };

      const { data, error } = await getSupabase()
        .from('categories')
        .insert([categoryData])
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({ success: true, data });
    } else {
      // Demo mode
      const newCategory = {
        id: demoCategories.length + 1,
        name,
        description,
        created_at: new Date().toISOString()
      };

      return NextResponse.json({
        success: true,
        data: newCategory,
        demo: true,
        message: 'Category created in demo mode'
      });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}