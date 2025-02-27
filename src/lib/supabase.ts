import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database tables
export type Candidate = {
  id?: number;
  name: string;
  criteria_values: Record<string, number>;
  created_at?: string;
  session_id: string;
};

export type Session = {
  id?: string;
  total_candidates: number;
  criteria: string[];
  observation_threshold: number;
  created_at?: string;
};