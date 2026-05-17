import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { EmailOtpType } from "@supabase/supabase-js";

async function getDestination(origin: string, next: string, supabase: Awaited<ReturnType<typeof createClient>>) {
  if (next !== "/dashboard") return next;

  const { data } = await supabase.auth.getUser();
  const u = data.user;
  if (!u) return "/onboard";

  const metaName = (u.user_metadata?.full_name ?? u.user_metadata?.name ?? "").trim();
  const metaGender = u.user_metadata?.gender as string | undefined;

  // Returning user with complete profile → skip onboarding
  if (metaName && metaGender) return "/dashboard";

  return "/onboard";
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/dashboard";

  const supabase = await createClient();

  // Google OAuth (PKCE flow)
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const destination = await getDestination(origin, next, supabase);
      return NextResponse.redirect(`${origin}${destination}`);
    }
  }

  // Magic link / email OTP flow
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash, type });
    if (!error) {
      const destination = await getDestination(origin, next, supabase);
      return NextResponse.redirect(`${origin}${destination}`);
    }
  }

  return NextResponse.redirect(`${origin}/sign-in?error=auth_failed`);
}
