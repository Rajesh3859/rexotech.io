import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";
  const type = searchParams.get("type");

  if (code) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error) {
        // If this was a password recovery callback, forward to password reset
        if (type === "recovery") {
          return NextResponse.redirect(`${origin}/reset-password`);
        }

        const forwardedHost = request.headers.get("x-forwarded-host");
        const isLocalEnv = process.env.NODE_ENV === "development";

        if (isLocalEnv) {
          return NextResponse.redirect(`${origin}${next}`);
        } else if (forwardedHost) {
          return NextResponse.redirect(`https://${forwardedHost}${next}`);
        } else {
          return NextResponse.redirect(`${origin}${next}`);
        }
      } else {
        console.error("Auth callback code exchange error:", error.message);
      }
    } catch (err) {
      console.error("Auth callback error:", err);
    }
  }

  // If code exchange failed or no code was provided, redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=Authentication%20failed`);
}

