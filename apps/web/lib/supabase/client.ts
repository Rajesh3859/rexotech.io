import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  if (!supabaseUrl || !supabaseAnonKey) {
    // Return dummy or warning client if env vars are missing so the page renders gracefully
    console.warn(
      "Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY) are not set. Auth calls will fail until configured in .env.local"
    );
  }

  return createBrowserClient(
    supabaseUrl || "https://placeholder-project.supabase.co",
    supabaseAnonKey || "placeholder-anon-key"
  );
}

