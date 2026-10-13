import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Compass } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — CareerPilot" },
      { name: "description", content: "Sign in or create your CareerPilot account." },
      { property: "og:title", content: "Sign in — CareerPilot" },
      { property: "og:description", content: "Access your placement preparation dashboard." },
    ],
  }),
  component: AuthPage,
});

const schema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(8, "At least 8 characters").max(72),
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/dashboard", replace: true });
    });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setInfo(null);
    setBusy(true);
    try {
      if (mode === "forgot") {
        const em = z.string().trim().email().safeParse(email);
        if (!em.success) throw new Error("Enter a valid email");
        const { error } = await supabase.auth.resetPasswordForEmail(em.data, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setInfo("If that email has an account, a reset link is on its way.");
        return;
      }
      const parsed = schema.safeParse({ email, password });
      if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid input");
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          ...parsed.data,
          options: { emailRedirectTo: window.location.origin + "/dashboard", data: { full_name: name.trim().slice(0, 100) } },
        });
        if (error) throw error;
        if (!data.session) setInfo("Check your email to confirm your account, then sign in.");
        else navigate({ to: "/dashboard" });
      } else {
        const { error } = await supabase.auth.signInWithPassword(parsed.data);
        if (error) throw error;
        navigate({ to: "/dashboard" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-screen md:grid-cols-12 bg-[#FAF7F2] relative overflow-hidden">
      {/* Decorative ambient background curves on the right */}
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#F8D886]/30 blur-3xl pointer-events-none -z-0" />
      <div className="absolute top-12 right-1/4 w-72 h-72 rounded-full bg-amber-100/40 blur-3xl pointer-events-none -z-0" />

      {/* Left Column: Visual Showcase with 4K illustration, glowing aura, and doodle effects */}
      <div className="hidden md:flex md:col-span-7 bg-[#182232] p-8 lg:p-12 text-white flex-col justify-between relative overflow-hidden z-10">
        {/* Ambient background lighting */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#EAA82C]/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 right-0 w-80 h-80 rounded-full bg-[#2563EB]/15 blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="flex items-center justify-between relative z-10">
          <Link to="/" className="group flex flex-col items-start cursor-pointer">
            <div className="flex items-center gap-2.5 font-display text-xl font-bold tracking-tight text-white">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EAA82C] text-[#182232] shadow-sm">
                <Compass className="h-5 w-5" />
              </div>
              <span>CAREERPILOT</span>
            </div>
            <div className="h-0.5 w-full bg-[#EAA82C] rounded-full mt-1 transform origin-left transition-transform group-hover:scale-x-110" />
          </Link>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAA82C]/20 text-[#EAA82C] text-xs font-bold tracking-wider uppercase">
            Learn Today, Build Tomorrow
          </span>
        </div>

        {/* Center: The 4K Illustration with floating doodle badges and glow */}
        <div className="my-auto py-6 relative z-10 space-y-6">
          <div className="space-y-2">
            <h2 className="font-display text-3xl lg:text-4xl font-extrabold leading-tight">
              Small daily steps.<br />
              <span className="text-[#EAA82C]">A visible path to placement offers.</span>
            </h2>
            <p className="text-sm text-white/75 leading-relaxed max-w-lg">
              Roadmaps, DSA practice, core computer science subjects, and placement pipeline tracking — built for engineering students across all college years.
            </p>
          </div>

          {/* 4K Illustration Card */}
          <div className="relative rounded-2xl overflow-hidden border border-[#2A3B54] bg-[#1F2C3F] shadow-2xl group">
            <img
              src="/hero-illustration.jpg"
              alt="Students learning and coding together"
              className="w-full h-auto max-h-[320px] object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
            />

            {/* Floating micro doodle badges */}
            <div className="absolute top-3 left-3 flex items-center gap-2 bg-[#182232]/90 backdrop-blur-md px-3 py-1 rounded-full border border-[#2A3B54] text-xs font-semibold text-white shadow-lg">
              <span className="text-[#2563EB] font-mono font-bold">&lt;/&gt;</span>
              <span>Code · Practice · Improve</span>
            </div>

            <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-[#EAA82C] text-[#182232] px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              <span>Better Skills, Bigger Dreams ✨</span>
            </div>

            <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-[#182232]/90 backdrop-blur-md px-3 py-1 rounded-full border border-[#2A3B54] text-xs font-semibold text-[#EAA82C] shadow-lg">
              <span className="flex h-2 w-2 rounded-full bg-[#EAA82C] animate-pulse" />
              <span>DSA · Aptitude · System Design</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between text-xs text-white/50 pt-2 border-t border-[#2A3B54] relative z-10">
          <span>&copy; {new Date().getFullYear()} CareerPilot. All rights reserved.</span>
          <span className="text-[#EAA82C]/80">Plan · Prepare · Place</span>
        </div>
      </div>

      {/* Right Column: Sign In / Sign Up Form */}
      <div className="md:col-span-5 flex items-center justify-center p-6 sm:p-10 relative z-10">
        <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl border border-[#EADBCA] shadow-xl relative overflow-hidden">
          {/* Top golden accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#EAA82C] via-amber-400 to-[#182232]" />

          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1">
              <div className="inline-flex md:hidden items-center gap-2 font-display text-lg font-bold text-[#182232] mb-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EAA82C] text-[#182232]">
                  <Compass className="h-4 w-4" />
                </div>
                <span>CareerPilot</span>
              </div>
              <h1 className="font-display text-2xl font-bold text-[#182232]">
                {mode === "signin" ? "Welcome back" : mode === "signup" ? "Create your account" : "Reset password"}
              </h1>
              <p className="text-xs text-[#182232]/70">
                {mode === "signin" ? "Sign in to access your placement dashboard" : mode === "signup" ? "Start planning your tech journey today" : "Enter your email to receive a password reset link"}
              </p>
            </div>

            {mode === "signup" && (
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-semibold text-[#182232]">Full Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} maxLength={100} placeholder="e.g. Alex Sharma" className="rounded-xl border-[#EADBCA] focus:border-[#EAA82C] focus:ring-[#EAA82C]" />
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-[#182232]">Email Address</Label>
              <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="name@college.edu" className="rounded-xl border-[#EADBCA] focus:border-[#EAA82C] focus:ring-[#EAA82C]" />
            </div>

            {mode !== "forgot" && (
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-semibold text-[#182232]">Password</Label>
                <Input id="password" type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" className="rounded-xl border-[#EADBCA] focus:border-[#EAA82C] focus:ring-[#EAA82C]" />
              </div>
            )}

            {info && <p className="rounded-xl bg-[#FEF3D6] border border-[#F8D886] p-3 text-xs text-[#9A6208]">{info}</p>}

            <Button type="submit" className="w-full rounded-full bg-[#182232] hover:bg-[#25344c] text-white py-6 font-semibold shadow-md transition-all hover:scale-[1.02]" disabled={busy}>
              {busy ? "Please wait…" : mode === "signin" ? "Sign In →" : mode === "signup" ? "Create Account →" : "Send Reset Link"}
            </Button>

            {/* Quick Demo Credentials Autofill Helper */}
            {mode === "signin" && (
              <button
                type="button"
                onClick={() => {
                  setEmail("student@careerpilot.com");
                  setPassword("CareerPilot#2026!Demo");
                }}
                className="w-full py-2 px-3 rounded-xl bg-[#FAF7F2] hover:bg-[#F2EDE4] border border-dashed border-[#EADBCA] text-xs text-[#182232]/80 font-medium flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>⚡ Fill Trial Account:</span>
                <span className="font-mono text-[#EAA82C] font-semibold">student@careerpilot.com</span>
              </button>
            )}

            <div className="flex items-center justify-between pt-2 text-xs font-medium text-[#182232]/70">
              {mode === "signin" ? (
                <>
                  <button type="button" className="text-[#182232] hover:text-[#EAA82C] underline decoration-[#EAA82C]" onClick={() => setMode("signup")}>Create an account</button>
                  <button type="button" className="text-[#182232]/70 hover:text-[#182232] underline" onClick={() => setMode("forgot")}>Forgot password?</button>
                </>
              ) : (
                <button type="button" className="text-[#182232] hover:text-[#EAA82C] underline decoration-[#EAA82C]" onClick={() => setMode("signin")}>&larr; Back to sign in</button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
