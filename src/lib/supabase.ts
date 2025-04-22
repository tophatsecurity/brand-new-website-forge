
import { createClient } from '@supabase/supabase-js';

// Replace with your Supabase URL and anon key from your Supabase dashboard
const supabaseUrl = 'https://your-supabase-url.supabase.co';
const supabaseAnonKey = 'your-supabase-anon-key';

// Create a single supabase client for the entire app
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
