import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase, unwrap, localDate } from "@/lib/db";
import { useAction } from "@/lib/hooks";
import { currentWeek } from "@/lib/scoring";
import { CURRICULUM_36_WEEKS } from "@/server/services/roadmap.service";
import { PageHeader, Card, Loading, ErrorBox, Empty } from "@/components/app-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Compass, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/roadmap")({
  head: () => ({ meta: [{ title: "Roadmap — CareerPilot" }, { name: "description", content: "Your editable 36-week placement roadmap." }, { property: "og:title", content: "Roadmap — CareerPilot" }, { property: "og:description", content: "Your editable 36-week placement roadmap." }] }),
  component: Roadmap,
});

type Week = { id: string; week_number: number; title: string; focus: string | null; milestone: string | null; completed: boolean; roadmap_tasks: { id: string; title: string; completed: boolean; position: number }[] };

function Roadmap() {
  const inv = [["roadmap"], ["dashboard"]];
  const q = useQuery({
    queryKey: ["roadmap"],
    queryFn: async () => {
      const r = unwrap(await supabase.from("roadmaps").select("*").eq("is_active", true).maybeSingle());
      if (!r) return null;
      const weeks = unwrap(await supabase.from("roadmap_weeks").select("id,week_number,title,focus,milestone,completed,roadmap_tasks(id,title,completed,position)").eq("roadmap_id", r.id).order("week_number")) as Week[];
      return { roadmap: r, weeks };
    },
  });
  const setStart = useAction(async (v: { id: string; start: string }) => unwrap(await supabase.from("roadmaps").update({ start_date: v.start }).eq("id", v.id)), { invalidate: inv, success: "Start date updated" });
  const addWeek = useAction(async (v: { roadmapId: string; n: number }) => {
    unwrap(await supabase.from("roadmap_weeks").insert({ roadmap_id: v.roadmapId, week_number: v.n, title: `Week ${v.n}` }));
    unwrap(await supabase.from("roadmaps").update({ total_weeks: v.n }).eq("id", v.roadmapId));
  }, { invalidate: inv, success: "Week added" });

  const initRoadmap = useAction(
    async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Please log in to initialize your roadmap.");

      const { data: rm, error: rmErr } = await supabase
        .from("roadmaps")
        .insert({
          user_id: user.id,
          title: "36-Week Placement Preparation Roadmap",
          start_date: localDate(),
          total_weeks: CURRICULUM_36_WEEKS.length,
          is_active: true,
        })
        .select()
        .single();
      if (rmErr) throw rmErr;

      const weeksData = CURRICULUM_36_WEEKS.map((w) => ({
        user_id: user.id,
        roadmap_id: rm.id,
        week_number: w.weekNumber,
        title: w.title,
        focus: w.focus,
        milestone: w.milestone,
        completed: false,
      }));

      const { error: wErr } = await supabase.from("roadmap_weeks").insert(weeksData);
      if (wErr) throw wErr;
    },
    { invalidate: inv, success: "36-Week placement roadmap initialized!" }
  );

  if (q.isLoading) return <Loading />;
  if (q.error) return <ErrorBox error={q.error} />;
  if (!q.data) {
    return (
      <div className="space-y-6">
        <PageHeader
          badge="36-Week Placement Roadmap"
          title="Placement Preparation Plan"
          subtitle="A structured 36-week engineering curriculum designed for product & service company drives."
        />
        <div className="rounded-2xl border border-[#EADBCA] bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EADBCA]/30 text-[#182232]">
            <Compass className="h-7 w-7 text-[#182232]" />
          </div>
          <h3 className="mt-4 font-display text-xl font-bold text-[#182232]">No Active Roadmap Yet</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-[#5B6577]">
            Generate your personalized 36-week curriculum covering Java, DSA, System Design, Core CS, Aptitude, and Mock Interviews directly in Supabase.
          </p>
          <Button
            className="mt-6 gap-2 bg-[#182232] px-6 text-white hover:bg-[#253245]"
            onClick={() => initRoadmap.mutate(undefined)}
            disabled={initRoadmap.isPending}
          >
            <Sparkles className="h-4 w-4" />
            {initRoadmap.isPending ? "Generating 36-Week Plan..." : "Initialize 36-Week Roadmap"}
          </Button>
        </div>
      </div>
    );
  }
  const { roadmap, weeks } = q.data;
  const cur = currentWeek(roadmap.start_date, weeks.length);
  const end = new Date(roadmap.start_date + "T00:00:00"); end.setDate(end.getDate() + weeks.length * 7);

  return (
    <div className="space-y-6">
      <PageHeader
        badge="36-Week Placement Roadmap"
        title={roadmap.title}
        subtitle={`Week ${cur} of ${weeks.length} · ${weeks.filter((w) => w.completed).length} completed milestones · Target finish ${localDate(end)}`}
        action={<label className="flex items-center gap-2 text-sm font-semibold text-[#182232]">Start Date <Input type="date" defaultValue={roadmap.start_date} className="w-auto rounded-xl border-[#EADBCA] bg-white" onBlur={(e) => e.target.value && e.target.value !== roadmap.start_date && setStart.mutate({ id: roadmap.id, start: e.target.value })} /></label>}
      />
      <div className="grid gap-3">
        {weeks.map((w) => <WeekCard key={w.id} w={w} current={w.week_number === cur} overdue={w.week_number < cur && !w.completed} />)}
      </div>
      <Button variant="outline" onClick={() => addWeek.mutate({ roadmapId: roadmap.id, n: weeks.length + 1 })}>Add week</Button>
      <WeeklyReview />
    </div>
  );
}

function WeekCard({ w, current, overdue }: { w: Week; current: boolean; overdue: boolean }) {
  const inv = [["roadmap"], ["dashboard"]];
  const [open, setOpen] = useState(current);
  const [task, setTask] = useState("");
  const [title, setTitle] = useState(w.title);
  const [milestone, setMilestone] = useState(w.milestone ?? "");
  const tasks = [...w.roadmap_tasks].sort((a, b) => a.position - b.position);
  const done = tasks.filter((t) => t.completed).length;

  const toggleWeek = useAction(async (c: boolean) => unwrap(await supabase.from("roadmap_weeks").update({ completed: c }).eq("id", w.id)), { invalidate: inv });
  const save = useAction(async () => unwrap(await supabase.from("roadmap_weeks").update({ title: title.trim() || w.title, milestone: milestone.trim() || null }).eq("id", w.id)), { invalidate: inv, success: "Week saved" });
  const addTask = useAction(async () => {
    if (!task.trim()) throw new Error("Enter a task");
    unwrap(await supabase.from("roadmap_tasks").insert({ week_id: w.id, title: task.trim().slice(0, 300), position: tasks.length }));
    setTask("");
  }, { invalidate: inv });
  const toggleTask = useAction(async (v: { id: string; c: boolean }) => unwrap(await supabase.from("roadmap_tasks").update({ completed: v.c }).eq("id", v.id)), { invalidate: inv });
  const delTask = useAction(async (id: string) => unwrap(await supabase.from("roadmap_tasks").delete().eq("id", id)), { invalidate: inv });

  return (
    <div className={cn("rounded-xl border bg-card", current && "border-accent ring-1 ring-accent", overdue && "border-destructive/40")}>
      <div className="flex items-center gap-3 p-3">
        <Checkbox checked={w.completed} onCheckedChange={(c) => toggleWeek.mutate(!!c)} aria-label={`Mark week ${w.week_number} complete`} />
        <button className="flex flex-1 items-center justify-between gap-2 text-left" onClick={() => setOpen(!open)}>
          <span><span className="mr-2 font-display text-sm text-muted-foreground">W{w.week_number}</span><span className={w.completed ? "line-through opacity-60" : "font-medium"}>{w.title}</span></span>
          <span className="text-xs text-muted-foreground">{current ? "Current · " : overdue ? "Behind · " : ""}{done}/{tasks.length}</span>
        </button>
      </div>
      {open && (
        <div className="space-y-3 border-t p-3">
          <div className="flex flex-wrap gap-2">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} className="flex-1" aria-label="Week title" maxLength={200} />
            <Input value={milestone} onChange={(e) => setMilestone(e.target.value)} placeholder="Milestone / completion criteria" className="flex-1" maxLength={300} />
            <Button size="sm" variant="outline" onClick={() => save.mutate(undefined)}>Save</Button>
          </div>
          <ul className="space-y-1">{tasks.map((t) => (
            <li key={t.id} className="flex items-center gap-2 text-sm">
              <Checkbox checked={t.completed} onCheckedChange={(c) => toggleTask.mutate({ id: t.id, c: !!c })} aria-label={`Complete ${t.title}`} />
              <span className={cn("flex-1", t.completed && "text-muted-foreground line-through")}>{t.title}</span>
              <Button size="icon" variant="ghost" onClick={() => delTask.mutate(t.id)} aria-label="Delete task"><Trash2 className="h-4 w-4" /></Button>
            </li>))}
          </ul>
          <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); addTask.mutate(undefined); }}>
            <Input value={task} onChange={(e) => setTask(e.target.value)} placeholder="Add a task for this week" maxLength={300} />
            <Button size="sm" disabled={addTask.isPending}>Add</Button>
          </form>
        </div>
      )}
    </div>
  );
}

function WeeklyReview() {
  const monday = (() => { const d = new Date(); const day = (d.getDay() + 6) % 7; d.setDate(d.getDate() - day); return localDate(d); })();
  const q = useQuery({ queryKey: ["reviews"], queryFn: async () => unwrap(await supabase.from("weekly_reviews").select("*").order("week_start", { ascending: false }).limit(8)) });
  const existing = q.data?.find((r) => r.week_start === monday);
  const [well, setWell] = useState("");
  const [improve, setImprove] = useState("");
  const [rating, setRating] = useState(3);
  const save = useAction(async () => {
    const { data: u } = await supabase.auth.getUser();
    unwrap(await supabase.from("weekly_reviews").upsert({ user_id: u.user!.id, week_start: monday, went_well: well.slice(0, 2000), improve: improve.slice(0, 2000), rating }, { onConflict: "user_id,week_start" }));
  }, { invalidate: [["reviews"]], success: "Review saved" });
  return (
    <Card title={`Weekly review · week of ${monday}`}>
      <div className="grid gap-2 md:grid-cols-2">
        <Textarea placeholder={existing?.went_well ?? "What went well?"} value={well} onChange={(e) => setWell(e.target.value)} />
        <Textarea placeholder={existing?.improve ?? "What to improve?"} value={improve} onChange={(e) => setImprove(e.target.value)} />
      </div>
      <div className="mt-2 flex items-center gap-2 text-sm">Rating
        <Input type="number" min={1} max={5} value={rating} onChange={(e) => setRating(Number(e.target.value))} className="w-16" />
        <Button size="sm" onClick={() => save.mutate(undefined)} disabled={save.isPending}>Save review</Button>
      </div>
      {!!q.data?.length && (
        <ul className="mt-4 space-y-1 text-sm text-muted-foreground">{q.data.map((r) => <li key={r.id}>{r.week_start} · {r.rating ?? "–"}/5 · {r.went_well?.slice(0, 80)}</li>)}</ul>
      )}
    </Card>
  );
}
