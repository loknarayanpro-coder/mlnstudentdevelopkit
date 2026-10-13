import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase, unwrap, currentUserId, errMsg } from "@/lib/db";
import { useProfile, useAction, downloadFile } from "@/lib/hooks";
import { PageHeader, Card, Loading } from "@/components/app-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({ meta: [{ title: "Settings — CareerPilot" }, { name: "description", content: "Profile, data export and account." }, { property: "og:title", content: "Settings — CareerPilot" }, { property: "og:description", content: "Profile, data export and account." }] }),
  component: Settings,
});

const TABLES = ["profiles", "daily_tasks", "study_sessions", "roadmaps", "roadmap_weeks", "roadmap_tasks", "coding_problems", "coding_attempts", "topic_progress", "aptitude_attempts", "interview_questions", "weekly_reviews"] as const;

function Settings() {
  const p = useProfile();
  const navigate = useNavigate();
  const [f, setF] = useState({ full_name: "", branch: "CSE", semester: 5, primary_language: "Java", proficiency: "Beginner", placement_target: "", daily_hours: 2.5 });
  useEffect(() => { if (p.data) setF({ full_name: p.data.full_name ?? "", branch: p.data.branch, semester: p.data.semester, primary_language: p.data.primary_language, proficiency: p.data.proficiency, placement_target: p.data.placement_target, daily_hours: Number(p.data.daily_hours) }); }, [p.data]);
  const save = useAction(async () => {
    const uid = await currentUserId();
    unwrap(await supabase.from("profiles").update({ ...f, full_name: f.full_name.slice(0, 100), onboarded: true }).eq("id", uid));
  }, { invalidate: [["profile"]], success: "Profile saved" });

  async function exportData() {
    try {
      const out: Record<string, unknown> = {};
      for (const t of TABLES) out[t] = unwrap(await supabase.from(t).select("*").limit(5000));
      downloadFile("careerpilot-export.json", JSON.stringify(out, null, 2), "application/json");
    } catch (e) { toast.error(errMsg(e)); }
  }
  async function deleteAccount() {
    if (!confirm("Permanently delete your account and all data?")) return;
    const { error } = await supabase.rpc("delete_my_account");
    if (error) { toast.error("Couldn't delete account"); return; }
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (p.isLoading) return <Loading />;
  const field = (k: keyof typeof f, label: string, type = "text") => (
    <label className="text-sm">{label}<Input type={type} value={f[k]} onChange={(e) => setF({ ...f, [k]: type === "number" ? Number(e.target.value) : e.target.value })} /></label>
  );
  return (
    <div className="space-y-6">
      <PageHeader
        badge="Account & Profile"
        title="Student Settings"
        subtitle="Manage your academic branch, current semester, primary language, and study availability."
      />
      <Card title="Profile">
        <div className="grid gap-3 md:grid-cols-2">
          {field("full_name", "Name")}{field("branch", "Branch")}{field("semester", "Semester", "number")}{field("primary_language", "Language")}{field("proficiency", "Proficiency")}{field("placement_target", "Placement target")}{field("daily_hours", "Daily study hours", "number")}
        </div>
        <Button className="mt-4" onClick={() => save.mutate(undefined)} disabled={save.isPending}>Save profile</Button>
      </Card>
      <Card title="Your data">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={exportData}>Export my data (JSON)</Button>
          <Button variant="destructive" onClick={deleteAccount}>Delete account</Button>
        </div>
      </Card>
    </div>
  );
}
