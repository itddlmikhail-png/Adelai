import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim();
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim();

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

function createSupabaseClient(): SupabaseClient {
  if (!isSupabaseConfigured) {
    // Keep static export builds green before secrets are provided.
    // Auth calls are blocked in UI via isSupabaseConfigured.
    return createClient(
      "https://placeholder.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder",
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      }
    );
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: "pkce",
      // Stable key under /Adelai on GitHub Pages
      storageKey: "adelai-auth",
    },
  });
}

export const supabase: SupabaseClient = createSupabaseClient();
