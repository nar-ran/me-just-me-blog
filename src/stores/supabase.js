import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VUE_APP_SUPABASE_PROJECT_URL;
const supabaseAnonKey = process.env.VUE_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function useSupabase() {
  return { supabase };
}
