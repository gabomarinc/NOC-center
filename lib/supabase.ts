
import { createClient } from '@supabase/supabase-js';

// Configuration
// We use the credentials provided for the NOC Center demo project
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://qnoirbhotkqoytljrccu.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'sb_publishable_CYf7pwWZEYznVLumKYqSZg_9y5UPrGx';

export const isSupabaseConfigured = () => {
  return supabaseUrl && supabaseAnonKey && supabaseAnonKey.length > 0;
};

// Create a single supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
