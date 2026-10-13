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
    <div className="grid min-h-screen md:grid-cols-2">
      <div className="hidden bg-ink p-10 text-ink-foreground grid-paper md:flex md:flex-col md:justify-between">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold">
          <Compass className="h-5 w-5 text-accent" /> CareerPilot
        </Link>
        <p className="max-w-sm font-display text-3xl font-semibold leading-snug">Small daily steps. A visible path to placements.</p>
      </div>
      <div className="flex items-center justify-center p-6">
        <form onSubmit={submit} className="w-full max-w-sm space-y-4">
          <h1 className="text-2xl font-semibold">
            {mode === "signin" ? "Welcome back" : mode === "signup" ? "Create your account" : "Reset password"}
          </h1>
          {mode === "signup" && (
            <div className="space-y-1.5"><Label htmlFor="name">Name</Label><Input id="name" value={name} onChange={(e) => setName(e.target.value)} maxLength={100} /></div>
          )}
          <div className="space-y-1.5"><Label htmlFor="email">Email</Label><Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
          {mode !== "forgot" && (
            <div className="space-y-1.5"><Label htmlFor="password">Password</Label><Input id="password" type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
          )}
          {info && <p className="rounded-md bg-muted p-3 text-sm">{info}</p>}
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "Please wait…" : mode === "signin" ? "Sign in" : mode === "signup" ? "Create account" : "Send reset link"}
          </Button>
          <div className="flex justify-between text-sm text-muted-foreground">
            {mode === "signin" ? (
              <>
                <button type="button" className="underline" onClick={() => setMode("signup")}>Create account</button>
                <button type="button" className="underline" onClick={() => setMode("forgot")}>Forgot password?</button>
              </>
            ) : (
              <button type="button" className="underline" onClick={() => setMode("signin")}>Back to sign in</button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
