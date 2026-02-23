import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Criamos a instância
const supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);

// Exportamos de forma explícita para não ter erro de nome
export { supabaseInstance as supabase };
