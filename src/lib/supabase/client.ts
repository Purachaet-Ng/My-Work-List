import { createBrowserClient } from "@supabase/ssr";

// Same pattern as Thunder_Core src/utils/supabase/client.ts: one browser client, anon key only.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY — see .env.example");
}

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
