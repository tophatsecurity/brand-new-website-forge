
import { createClient } from '@supabase/supabase-js';

// Use the correct Supabase URL and anon key for your project
const supabaseUrl = 'https://saveabkhpaemynlfcgcy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhdmVhYmtocGFlbXlubGZjZ2N5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzNDg3MTEsImV4cCI6MjA2MDkyNDcxMX0.j_tE4-DSjls0uq1_LFd92Dpl3JwfrnGa1KlIhR9yzw0';

// Create a single supabase client for the entire app
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
