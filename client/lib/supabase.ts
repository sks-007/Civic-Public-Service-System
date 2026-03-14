import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

const isConfigured = supabaseUrl && !supabaseUrl.includes('your-project-ref')

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (null as any)

export const isSupabaseConfigured = Boolean(isConfigured)
