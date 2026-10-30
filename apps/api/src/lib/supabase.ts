import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.warn(
    "Warning: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not defined in .env"
  );
}

export const supabaseAdmin = createClient(
  supabaseUrl || "https://placeholder-project.supabase.co",
  supabaseServiceRoleKey || "placeholder-service-key",
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

