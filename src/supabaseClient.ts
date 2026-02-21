import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://faszowrdyiveybppattj.supabase.co";
const SUPABASE_PUBLIC_KEY = "sb_publishable_d50qWwAqLy5Vo7obd04euw_L4mBH3tc";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
