import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase, unwrap, localDate } from "@/lib/db";
import { useProfile } from "@/lib/hooks";
import { preparationScore, currentWeek, type DashboardStats } from "@/lib/scoring";
import { PageHeader, Stat, Card, Empty, Loading, ErrorBox } from "@/components/app-ui";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — CareerPilot" }, { name: "description", content: "Your placement preparation at a glance." }, { property: "og:title", content: "Dashboard — CareerPilot" }, { property: "og:description", content: "Your placement preparation at a glance." }] }),
  component: Dashboard,
});

function Dashboard() {
  const today = localDate();
  const profile = useProfile();
  const stats = useQuery({
    queryKey: ["dashboard", today],
    queryFn: async () => unwrap(await supabase.rpc("dashboard_stats", { _today: today })) as unknown as DashboardStats,
  });
  const tasks = useQuery({
    queryKey: ["tasks", today],
    queryFn: async () => unwrap(await supabase.from("daily_tasks").select("id,title,completed,category,planned_minutes").eq("due_date", today).order("position").limit(10)),
  });
  const deadlines = useQuery({
    queryKey: ["apps", "upcoming", today],
    queryFn: async () => unwrap(await supabase.from("placement_applications").select("id,company,role,deadline,status").gte("deadline", today).order("deadline").limit(5)),
  });
  const events = useQuery({
    queryKey: ["events", "upcoming"],
    queryFn: async () => unwrap(await supabase.from("application_events").select("id,kind,event_at,placement_applications(company)").gte("event_at", new Date().toISOString()).order("event_at").limit(5)),
  });

  if (stats.isLoading || profile.isLoading) return <Loading />;
  if (stats.error) return <ErrorBox error={stats.error} />;
  const s = stats.data!;
  const p = profile.data!;
  const score = preparationScore(s, Number(p.daily_hours));
  const week = currentWeek(s.roadmap_start, s.weeks_total);

  return (
    <div className="space-y-6">
      <PageHeader title={`Hi${p.full_name ? ", " + p.full_name.split(" ")[0] : ""}`} subtitle={`${p.branch} · Semester ${p.semester} · Target: ${p.placement_target}`} />
      {!p.onboarded && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-accent bg-accent/10 p-4">
          <p className="text-sm">Confirm your profile so your plan matches your branch, semester and study time.</p>
          <Button asChild size="sm"><Link to="/settings">Complete onboarding</Link></Button>
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-ink p-5 text-ink-foreground md:row-span-2">
          <div className="text-xs uppercase tracking-wider opacity-70">Preparation score</div>
          <div className="mt-2 font-display text-6xl font-semibold">{score}<span className="text-2xl opacity-60">/100</span></div>
          <Progress value={score} className="mt-4 bg-sidebar-accent" />
          <p className="mt-4 text-xs opacity-70">30% roadmap · 25% DSA · 20% topics · 15% projects · 10% weekly study consistency</p>
        </div>
        <Stat label="Roadmap week" value={`${week} / ${s.weeks_total}`} hint={`${s.weeks_done} weeks completed`} />
        <Stat label="Study today" value={`${Math.round(s.study_seconds_today / 60)}m`} hint={`Planned ${s.planned_minutes_today}m`} />
        <Stat label="DSA solved" value={s.problems_solved} hint={`E ${s.problems_easy} · M ${s.problems_medium} · H ${s.problems_hard}`} />
        <Stat label="Topics covered" value={`${s.topics_done}/${s.topics_total}`} hint={`Projects ${s.project_tasks_done}/${s.project_tasks_total} tasks · ${s.apps_active} active apps`} />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card title={`Today (${s.tasks_today_done}/${s.tasks_today})`} action={<Link to="/planner" className="text-sm underline">Planner</Link>}>
          {tasks.data?.length ? (
            <ul className="space-y-2 text-sm">{tasks.data.map((t) => <li key={t.id} className={t.completed ? "text-muted-foreground line-through" : ""}>{t.title}</li>)}</ul>
          ) : <Empty>No tasks scheduled today.</Empty>}
        </Card>
        <Card title="Upcoming deadlines">
          {deadlines.data?.length ? (
            <ul className="space-y-2 text-sm">{deadlines.data.map((a) => <li key={a.id} className="flex justify-between gap-2"><span>{a.company} · {a.role}</span><span className="text-muted-foreground">{a.deadline}</span></li>)}</ul>
          ) : <Empty>No upcoming deadlines.</Empty>}
        </Card>
        <Card title="Upcoming interviews & tests">
          {events.data?.length ? (
            <ul className="space-y-2 text-sm">{events.data.map((e) => <li key={e.id} className="flex justify-between gap-2"><span>{(e.placement_applications as { company: string } | null)?.company} · {e.kind}</span><span className="text-muted-foreground">{new Date(e.event_at).toLocaleDateString()}</span></li>)}</ul>
          ) : <Empty>Nothing scheduled.</Empty>}
        </Card>
      </div>
    </div>
  );
}
