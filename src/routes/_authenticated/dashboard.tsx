import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase, unwrap, localDate } from "@/lib/db";
import { useProfile } from "@/lib/hooks";
import { preparationScore, currentWeek, type DashboardStats } from "@/lib/scoring";
import { PageHeader, Stat, Card, Empty, Loading, ErrorBox } from "@/components/app-ui";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Compass,
  Code2,
  Clock,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  Briefcase,
  Layers,
  Sparkles,
  Rocket,
  Flame,
  ArrowRight,
  Plus,
  Play,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — CareerPilot" },
      { name: "description", content: "Your placement preparation flight deck at a glance." },
      { property: "og:title", content: "Dashboard — CareerPilot" },
      { property: "og:description", content: "Your placement preparation flight deck at a glance." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const today = localDate();
  const profile = useProfile();

  const stats = useQuery({
    queryKey: ["dashboard", today],
    queryFn: async () =>
      unwrap(await supabase.rpc("dashboard_stats", { _today: today })) as unknown as DashboardStats,
  });

  const tasks = useQuery({
    queryKey: ["tasks", today],
    queryFn: async () =>
      unwrap(
        await supabase
          .from("daily_tasks")
          .select("id,title,completed,category,priority,planned_minutes")
          .eq("due_date", today)
          .order("position")
          .limit(10),
      ),
  });

  const deadlines = useQuery({
    queryKey: ["apps", "upcoming", today],
    queryFn: async () =>
      unwrap(
        await supabase
          .from("placement_applications")
          .select("id,company,role,deadline,status,company_type")
          .gte("deadline", today)
          .order("deadline")
          .limit(5),
      ),
  });

  const events = useQuery({
    queryKey: ["events", "upcoming"],
    queryFn: async () =>
      unwrap(
        await supabase
          .from("application_events")
          .select("id,kind,event_at,placement_applications(company)")
          .gte("event_at", new Date().toISOString())
          .order("event_at")
          .limit(5),
      ),
  });

  if (stats.isLoading || profile.isLoading) return <Loading />;
  if (stats.error) return <ErrorBox error={stats.error} />;

  const s = stats.data!;
  const p = profile.data!;
  const score = preparationScore(s, Number(p.daily_hours));
  const week = currentWeek(s.roadmap_start, s.weeks_total);

  // Friendly greeting name
  const studentName = p.full_name ? p.full_name.split(" ")[0] : "Student";

  // Score tier
  const scoreTier =
    score >= 80
      ? "Placement Ready 🚀"
      : score >= 50
        ? "Consistent Momentum ⚡"
        : score >= 20
          ? "Foundation Building 📈"
          : "Getting Started 🌱";

  return (
    <div className="space-y-8 pb-12">
      {/* Top Welcome Flight Deck Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-[#EADBCA] p-6 sm:p-8 shadow-sm">
        {/* Warm golden ambient glow */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 rounded-full bg-[#EAA82C]/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF3D6] border border-[#F8D886] text-xs font-bold uppercase tracking-wider text-[#9A6208]">
                <Sparkles className="h-3 w-3 text-[#EAA82C]" />
                Flight Deck
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
                <Flame className="h-3.5 w-3.5 text-amber-500" />
                Active Streak: 3 Days
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#182232] tracking-tight">
              Welcome back, {studentName} 👋
            </h1>

            <p className="text-sm font-medium text-[#182232]/75 flex flex-wrap items-center gap-2">
              <span className="font-semibold text-[#182232]">{p.branch}</span>
              <span>&bull;</span>
              <span>Semester {p.semester}</span>
              <span>&bull;</span>
              <span className="bg-[#FAF7F2] px-2 py-0.5 rounded-md border border-[#EADBCA] text-xs">
                Target: {p.placement_target || "Software Engineer"}
              </span>
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            <Button
              asChild
              size="sm"
              className="rounded-full bg-[#182232] hover:bg-[#25344c] text-white px-5 py-5 font-semibold shadow-md transition-all hover:scale-105"
            >
              <Link to="/planner">
                <Plus className="mr-1.5 h-4 w-4 text-[#EAA82C]" />
                New Task
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="sm"
              className="rounded-full border-[#EADBCA] hover:bg-[#FAF7F2] text-[#182232] px-4 py-5 font-semibold transition-all"
            >
              <Link to="/dsa">
                <Code2 className="mr-1.5 h-4 w-4 text-[#2563EB]" />
                Solve DSA
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="sm"
              className="rounded-full border-[#EADBCA] hover:bg-[#FAF7F2] text-[#182232] px-4 py-5 font-semibold transition-all"
            >
              <Link to="/roadmap">
                <Compass className="mr-1.5 h-4 w-4 text-[#EAA82C]" />
                Roadmap
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Onboarding Alert Banner (if not completed) */}
      {!p.onboarded && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-[#F8D886] bg-gradient-to-r from-[#FEF3D6] via-amber-50 to-[#FEF3D6] p-5 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EAA82C] text-[#182232] shadow-sm shrink-0">
              <Rocket className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#182232]">Complete your student onboarding</h3>
              <p className="text-xs text-[#182232]/75">
                Confirm your college branch, current semester, and daily study target to personalize your
                roadmap.
              </p>
            </div>
          </div>
          <Button
            asChild
            size="sm"
            className="rounded-full bg-[#182232] hover:bg-[#25344c] text-white text-xs font-semibold px-5 py-2 shadow-sm"
          >
            <Link to="/settings">
              Complete Onboarding
              <ArrowRight className="ml-1.5 h-3.5 w-3.5 text-[#EAA82C]" />
            </Link>
          </Button>
        </div>
      )}

      {/* Hero Stats Grid */}
      <div className="grid gap-5 md:grid-cols-3">
        {/* Showcase Preparation Score Card */}
        <div className="rounded-3xl bg-[#182232] p-6 sm:p-7 text-white md:row-span-2 relative overflow-hidden shadow-xl flex flex-col justify-between group">
          {/* Ambient golden aura in background */}
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#EAA82C]/15 blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-[#EAA82C]">
                Readiness Score
              </span>
              <span className="text-xs font-semibold bg-[#233147] text-white/90 px-3 py-1 rounded-full border border-[#2A3B54]">
                {scoreTier}
              </span>
            </div>

            <div className="mt-5 flex items-baseline gap-2">
              <span className="font-display text-6xl font-black text-white tracking-tight">
                {score}
              </span>
              <span className="text-2xl font-bold text-white/50">/100</span>
            </div>

            <Progress value={score} className="mt-4 h-2.5 bg-[#233147]" />

            <div className="mt-6 space-y-2.5 text-xs text-white/80">
              <div className="flex justify-between items-center py-1 border-b border-[#2A3B54]">
                <span className="flex items-center gap-1.5">
                  <Compass className="h-3.5 w-3.5 text-[#EAA82C]" /> 36-Wk Roadmap
                </span>
                <span className="font-semibold text-white">30% weight</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#2A3B54]">
                <span className="flex items-center gap-1.5">
                  <Code2 className="h-3.5 w-3.5 text-[#2563EB]" /> DSA Solved
                </span>
                <span className="font-semibold text-white">25% weight</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#2A3B54]">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-[#10B981]" /> CS Fundamentals
                </span>
                <span className="font-semibold text-white">20% weight</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#2A3B54]">
                <span className="flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-purple-400" /> Projects & Portfolio
                </span>
                <span className="font-semibold text-white">15% weight</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-[#F97316]" /> Weekly Consistency
                </span>
                <span className="font-semibold text-white">10% weight</span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-6 border-t border-[#2A3B54] text-xs text-white/60">
            Updated live based on your study habits and solved problems.
          </div>
        </div>

        {/* Stat 1: Roadmap Week */}
        <Stat
          label="Roadmap Progression"
          value={`${week} / ${s.weeks_total}`}
          hint={`${s.weeks_done} milestones completed · On track`}
          icon={Compass}
          variant="blue"
        />

        {/* Stat 2: Study Time Today */}
        <Stat
          label="Study Today"
          value={`${Math.round(s.study_seconds_today / 60)} min`}
          hint={`Goal: ${s.planned_minutes_today || Math.round(Number(p.daily_hours) * 60)} min planned`}
          icon={Clock}
          variant="amber"
        />

        {/* Stat 3: DSA Problems Solved */}
        <Stat
          label="DSA Problems Solved"
          value={s.problems_solved}
          hint={`Easy: ${s.problems_easy} · Medium: ${s.problems_medium} · Hard: ${s.problems_hard}`}
          icon={Code2}
          variant="emerald"
        />

        {/* Stat 4: Topics Mastered */}
        <Stat
          label="Topics Mastered"
          value={`${s.topics_done} / ${s.topics_total}`}
          hint={`${s.project_tasks_done}/${s.project_tasks_total} project tasks · ${s.apps_active} active apps`}
          icon={BookOpen}
          variant="purple"
        />
      </div>

      {/* Action Columns: Daily Tasks, Deadlines, and Interviews */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Card 1: Today's Tasks */}
        <Card
          title={`Today's Tasks (${s.tasks_today_done}/${s.tasks_today})`}
          subtitle="Your daily plan to conquer placement preparation"
          action={
            <Button asChild variant="ghost" size="sm" className="h-8 text-xs font-semibold text-[#182232] hover:bg-[#FAF7F2]">
              <Link to="/planner">Go to Planner &rarr;</Link>
            </Button>
          }
        >
          {tasks.data?.length ? (
            <div className="space-y-2.5">
              {tasks.data.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF7F2] border border-[#EADBCA] text-sm"
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2
                      className={`h-4 w-4 ${t.completed ? "text-emerald-500" : "text-[#182232]/30"}`}
                    />
                    <span className={t.completed ? "line-through text-[#182232]/50 font-medium" : "font-medium text-[#182232]"}>
                      {t.title}
                    </span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white border border-[#EADBCA] text-[#182232]/70 font-semibold">
                    {t.category}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <Empty
              title="No tasks scheduled for today"
              actionText="Add Today's Tasks"
              onAction={() => (window.location.href = "/planner")}
              icon={CalendarCheck}
            >
              Add a quick coding problem, study hour, or CS topic revision to start your daily streak!
            </Empty>
          )}
        </Card>

        {/* Card 2: Upcoming Deadlines */}
        <Card
          title="Upcoming Deadlines"
          subtitle="Placement drives, exams, and applications"
          action={
            <Button asChild variant="ghost" size="sm" className="h-8 text-xs font-semibold text-[#182232] hover:bg-[#FAF7F2]">
              <Link to="/learning">View All &rarr;</Link>
            </Button>
          }
        >
          {deadlines.data?.length ? (
            <div className="space-y-2.5">
              {deadlines.data.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF7F2] border border-[#EADBCA] text-sm"
                >
                  <div>
                    <div className="font-bold text-[#182232]">{a.company}</div>
                    <div className="text-xs text-[#182232]/70">{a.role}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-amber-700 bg-[#FEF3D6] px-2 py-0.5 rounded-full border border-[#F8D886]">
                      {a.deadline}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Empty
              title="No active application deadlines"
              actionText="Explore Roadmap"
              onAction={() => (window.location.href = "/roadmap")}
              icon={Briefcase}
            >
              Track your upcoming campus drives, off-campus referrals, and coding tests in one spot.
            </Empty>
          )}
        </Card>

        {/* Card 3: Upcoming Interviews & Mock Tests */}
        <Card
          title="Interviews & Tests"
          subtitle="Scheduled rounds and assessment schedules"
          action={
            <Button asChild variant="ghost" size="sm" className="h-8 text-xs font-semibold text-[#182232] hover:bg-[#FAF7F2]">
              <Link to="/learning">Interviews &rarr;</Link>
            </Button>
          }
        >
          {events.data?.length ? (
            <div className="space-y-2.5">
              {events.data.map((e) => (
                <div
                  key={e.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF7F2] border border-[#EADBCA] text-sm"
                >
                  <div>
                    <div className="font-bold text-[#182232]">
                      {(e.placement_applications as { company: string } | null)?.company || "Company"}
                    </div>
                    <div className="text-xs text-[#182232]/70 capitalize">{e.kind}</div>
                  </div>
                  <span className="text-xs font-semibold text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                    {new Date(e.event_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <Empty
              title="No interviews scheduled yet"
              actionText="Review Q&A Bank"
              onAction={() => (window.location.href = "/learning")}
              icon={Layers}
            >
              Prepare with interview question banks for Java, DBMS, Operating Systems, and Networks!
            </Empty>
          )}
        </Card>
      </div>
    </div>
  );
}
