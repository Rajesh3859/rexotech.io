"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Mail,
  ArrowRight,
  AlertCircle,
  Loader2,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successSent, setSuccessSent] = useState(false);

  const supabase = createClient();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        throw new Error(
          "Supabase environment variables are missing. Configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
        );
      }

      const redirectUrl = `${window.location.origin}/auth/callback?type=recovery`;

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) throw error;

      setSuccessSent(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to send reset link. Please check your email.";
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-[#f1f3f7] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative selection:bg-purple-600 selection:text-white">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/3 w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[130px]" />
      </div>

      {/* Top back navigation */}
      <div className="absolute top-6 left-6 z-10">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors px-3 py-1.5 rounded-full hover:bg-white/5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Sign In</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Brand Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-600/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white">
              captions<span className="text-purple-500">.</span>ai
            </span>
          </Link>
          <h1 className="mt-6 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Reset your password
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Enter your registered email and we&apos;ll send you a password recovery link
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#12141c] border border-white/10 rounded-3xl p-7 sm:p-8 shadow-2xl backdrop-blur-xl">
          {successSent ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-white">Password reset email sent</h2>
              <p className="text-sm text-zinc-400 leading-relaxed">
                If an account exists for <span className="text-white font-semibold">{email}</span>, you will receive an email shortly with instructions to reset your password.
              </p>
              <div className="pt-4">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center py-3 px-6 rounded-2xl bg-white/10 hover:bg-white/15 text-white text-sm font-semibold transition-colors"
                >
                  Return to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <>
              {errorMsg && (
                <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#171923] border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3.5 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending link...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Recovery Link</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-white/[0.08] text-center text-xs text-zinc-400">
                Remember your password?{" "}
                <Link href="/login" className="font-semibold text-purple-400 hover:text-purple-300 transition-colors">
                  Sign In
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

