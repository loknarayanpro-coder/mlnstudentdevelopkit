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
    <div className="grid min-h-screen md:grid-cols-2 bg-[#FAF7F2]">
      <div className="hidden bg-[#182232] p-12 text-white md:flex md:flex-col md:justify-between relative overflow-hidden">
        <div className="absolute -bottom-16 -right-16 w-80 h-80 rounded-full bg-[#EAA82C]/15 blur-3xl pointer-events-none" />
        <Link to="/" className="flex items-center gap-2.5 font-display text-xl font-bold tracking-tight">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EAA82C] text-[#182232] shadow-sm">
            <Compass className="h-5 w-5" />
          </div>
          <span>CAREERPILOT</span>
        </Link>
        <div className="space-y-4 my-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAA82C]/20 text-[#EAA82C] text-xs font-bold tracking-wider uppercase">
            Learn Today, Build Tomorrow
          </span>
          <h2 className="font-display text-4xl font-extrabold leading-tight">
            Small daily steps.<br />
            <span className="text-[#EAA82C]">A visible path to placement offers.</span>
          </h2>
          <p className="text-sm text-white/75 leading-relaxed max-w-sm">
            Your all-in-one platform for roadmaps, DSA practice, CS subjects, and company pipelines — for students of all years.
          </p>
        </div>
        <p className="text-xs text-white/50">&copy; {new Date().getFullYear()} CareerPilot. All rights reserved.</p>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-[#EADBCA] shadow-xl">
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1">
              <h1 className="font-display text-2xl font-bold text-[#182232]">
                {mode === "signin" ? "Welcome back" : mode === "signup" ? "Create your account" : "Reset password"}
              </h1>
              <p className="text-xs text-[#182232]/70">
                {mode === "signin" ? "Sign in to access your preparation plan" : mode === "signup" ? "Start planning your tech journey today" : "Enter your email to receive a password reset link"}
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
