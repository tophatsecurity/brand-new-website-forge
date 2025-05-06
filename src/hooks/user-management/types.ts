
import { User as SupabaseUser } from '@supabase/supabase-js';

export interface User {
  id: string;
  email: string;
  user_metadata: any;
  banned_until: string | null;
  createdAt: string;
  permissions: any[];
}

export interface AddUserValues {
  email: string;
  password: string;
}
