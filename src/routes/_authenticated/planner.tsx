import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase, unwrap, localDate } from "@/lib/db";
import { useAction } from "@/lib/hooks";
import { PageHeader, Card, Empty, Loading, ErrorBox, selectCls } from "@/components/app-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowDown, ArrowUp, Trash2, CalendarClock, Play, Pause, Square } from "lucide-react";

export const Route = createFileRoute("/_authenticated/planner")({
  head: () => ({ meta: [{ title: "Daily planner — CareerPilot" }, { name: "description", content: "Plan tasks and track study sessions." }, { property: "og:title", content: "Daily planner — CareerPilot" }, { property: "og:description", content: "Plan tasks and track study sessions." }] }),
  component: Planner,
});

const CATS = ["General", "DSA", "Java", "Aptitude", "CS Fundamentals", "Projects", "Resume"];
const addDays = (d: string, n: number) => { const x = new Date(d + "T00:00:00"); x.setDate(x.getDate() + n); return localDate(x); };

function Planner() {
  const today = localDate();
  const [date, setDate] = useState(today);
  const inv = [["tasks"], ["dashboard"], ["overdue"]];

  const tasks = useQuery({
    queryKey: ["tasks", date],
    queryFn: async () => unwrap(await supabase.from("daily_tasks").select("*").eq("due_date", date).order("position").order("created_at")),
  });
  const overdue = useQuery({
    queryKey: ["overdue", today],
    queryFn: async () => unwrap(await supabase.from("daily_tasks").select("id,title,due_date").lt("due_date", today).eq("completed", false).order("due_date").limit(50)),
  });

  const [title, setTitle] = useState("");
  const [cat, setCat] = useState("DSA");
  const [prio, setPrio] = useState<"low" | "medium" | "high">("medium");
  const [mins, setMins] = useState(30);

  const add = useAction(async () => {
    const t = title.trim();
    if (!t) throw new Error("Enter a task title");
    const pos = (tasks.data?.length ?? 0);
    unwrap(await supabase.from("daily_tasks").insert({ title: t.slice(0, 300), category: cat, priority: prio, planned_minutes: Math.max(0, Math.min(1440, mins)), due_date: date, position: pos }));
    setTitle("");
  }, { invalidate: inv, success: "Task added" });
  const toggle = useAction(async (v: { id: string; completed: boolean }) => unwrap(await supabase.from("daily_tasks").update({ completed: v.completed }).eq("id", v.id)), { invalidate: inv });
  const del = useAction(async (id: string) => unwrap(await supabase.from("daily_tasks").delete().eq("id", id)), { invalidate: inv, success: "Task deleted" });
  const move = useAction(async (v: { id: string; due_date: string }) => unwrap(await supabase.from("daily_tasks").update({ due_date: v.due_date }).eq("id", v.id)), { invalidate: inv, success: "Rescheduled" });
  const reorder = useAction(async (v: { a: { id: string; position: number }; b: { id: string; position: number } }) => {
    unwrap(await supabase.from("daily_tasks").update({ position: v.b.position }).eq("id", v.a.id));
    unwrap(await supabase.from("daily_tasks").update({ position: v.a.position }).eq("id", v.b.id));
  }, { invalidate: [["tasks"]] });

  const list = tasks.data ?? [];
  const swap = (i: number, j: number) => {
    if (j < 0 || j >= list.length) return;
    const a = list[i], b = list[j]; if (!a || !b) return;
    reorder.mutate({ a: { id: a.id, position: j }, b: { id: b.id, position: i } });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Daily planner" subtitle="Tasks are saved to your account as soon as you add them." action={<Input type="date" value={date} onChange={(e) => e.target.value && setDate(e.target.value)} className="w-auto" />} />
      <StudyTimer tasks={list} />
      <Card title={`Tasks for ${date === today ? "today" : date}`}>
        <form className="mb-4 flex flex-wrap gap-2" onSubmit={(e) => { e.preventDefault(); add.mutate(undefined); }}>
          <Input placeholder="e.g. Solve 3 array problems" value={title} onChange={(e) => setTitle(e.target.value)} className="min-w-48 flex-1" maxLength={300} />
          <select className={selectCls} value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Category">{CATS.map((c) => <option key={c}>{c}</option>)}</select>
          <select className={selectCls} value={prio} onChange={(e) => setPrio(e.target.value as typeof prio)} aria-label="Priority"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select>
          <Input type="number" min={0} max={1440} value={mins} onChange={(e) => setMins(Number(e.target.value))} className="w-20" aria-label="Planned minutes" />
          <Button disabled={add.isPending}>{add.isPending ? "Adding…" : "Add"}</Button>
        </form>
        {tasks.isLoading ? <Loading /> : tasks.error ? <ErrorBox error={tasks.error} /> : list.length === 0 ? <Empty>No tasks for this day yet.</Empty> : (
          <ul className="divide-y">
            {list.map((t, i) => (
              <li key={t.id} className="flex items-center gap-3 py-2">
                <Checkbox checked={t.completed} onCheckedChange={(c) => toggle.mutate({ id: t.id, completed: !!c })} aria-label={`Complete ${t.title}`} />
                <div className="min-w-0 flex-1">
                  <div className={t.completed ? "text-muted-foreground line-through" : ""}>{t.title}</div>
                  <div className="text-xs text-muted-foreground">{t.category} · {t.priority} · {t.planned_minutes}m</div>
                </div>
                <Button size="icon" variant="ghost" onClick={() => swap(i, i - 1)} aria-label="Move up"><ArrowUp className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" onClick={() => swap(i, i + 1)} aria-label="Move down"><ArrowDown className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" onClick={() => move.mutate({ id: t.id, due_date: addDays(t.due_date, 1) })} aria-label="Move to next day"><CalendarClock className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" onClick={() => del.mutate(t.id)} aria-label="Delete"><Trash2 className="h-4 w-4" /></Button>
              </li>
            ))}
          </ul>
        )}
      </Card>
      <Card title="Rescheduling queue (unfinished past tasks)">
        {overdue.data?.length ? (
          <ul className="divide-y">{overdue.data.map((t) => (
            <li key={t.id} className="flex items-center justify-between gap-2 py-2 text-sm">
              <span>{t.title} <span className="text-muted-foreground">· {t.due_date}</span></span>
              <Button size="sm" variant="outline" onClick={() => move.mutate({ id: t.id, due_date: today })}>Move to today</Button>
            </li>))}
          </ul>
        ) : <Empty>Nothing overdue.</Empty>}
      </Card>
      <WeeklySummary />
    </div>
  );
}

function StudyTimer({ tasks }: { tasks: { id: string; title: string; category: string }[] }) {
  const inv = [["session"], ["dashboard"], ["weekly"]];
  const open = useQuery({
    queryKey: ["session", "open"],
    queryFn: async () => unwrap(await supabase.from("study_sessions").select("*").is("ended_at", null).maybeSingle()),
  });
  const [taskId, setTaskId] = useState("");
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);

  const start = useAction(async () => {
    const t = tasks.find((x) => x.id === taskId);
    unwrap(await supabase.from("study_sessions").insert({ task_id: t?.id ?? null, category: t?.category ?? "General" }));
  }, { invalidate: inv, success: "Session started" });
  const pause = useAction(async (id: string) => unwrap(await supabase.from("study_sessions").update({ paused_at: new Date().toISOString() }).eq("id", id).is("paused_at", null)), { invalidate: inv });
  const resume = useAction(async (s: { id: string; paused_at: string; paused_seconds: number }) => {
    const add = Math.max(0, Math.floor((Date.now() - new Date(s.paused_at).getTime()) / 1000));
    unwrap(await supabase.from("study_sessions").update({ paused_at: null, paused_seconds: s.paused_seconds + add }).eq("id", s.id));
  }, { invalidate: inv });
  const stop = useAction(async (id: string) => unwrap(await supabase.rpc("stop_study_session", { _id: id })), { invalidate: inv, success: "Session saved" });

  const s = open.data;
  let elapsed = 0;
  if (s) {
    const end = s.paused_at ? new Date(s.paused_at).getTime() : now;
    elapsed = Math.max(0, Math.floor((end - new Date(s.started_at).getTime()) / 1000) - s.paused_seconds);
  }
  const fmt = (x: number) => `${String(Math.floor(x / 3600)).padStart(2, "0")}:${String(Math.floor((x % 3600) / 60)).padStart(2, "0")}:${String(x % 60).padStart(2, "0")}`;
  const busy = start.isPending || stop.isPending || pause.isPending || resume.isPending;

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-xl bg-ink p-5 text-ink-foreground">
      <div className="font-display text-4xl font-semibold tabular-nums">{fmt(elapsed)}</div>
      {open.isLoading ? null : s ? (
        <div className="flex gap-2">
          {s.paused_at ? (
            <Button variant="secondary" disabled={busy} onClick={() => resume.mutate({ id: s.id, paused_at: s.paused_at!, paused_seconds: s.paused_seconds })}><Play className="mr-1 h-4 w-4" />Resume</Button>
          ) : (
            <Button variant="secondary" disabled={busy} onClick={() => pause.mutate(s.id)}><Pause className="mr-1 h-4 w-4" />Pause</Button>
          )}
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90" disabled={busy} onClick={() => stop.mutate(s.id)}><Square className="mr-1 h-4 w-4" />Stop & save</Button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          <select className={selectCls + " text-foreground"} value={taskId} onChange={(e) => setTaskId(e.target.value)} aria-label="Link to task">
            <option value="">General study</option>
            {tasks.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
          </select>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90" disabled={busy} onClick={() => start.mutate(undefined)}><Play className="mr-1 h-4 w-4" />Start session</Button>
        </div>
      )}
    </div>
  );
}

function WeeklySummary() {
  const from = (() => { const d = new Date(); d.setDate(d.getDate() - 6); d.setHours(0, 0, 0, 0); return d; })();
  const q = useQuery({
    queryKey: ["weekly", localDate()],
    queryFn: async () => unwrap(await supabase.from("study_sessions").select("started_at,duration_seconds,category").not("ended_at", "is", null).gte("started_at", from.toISOString()).limit(1000)),
  });
  const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(from); d.setDate(d.getDate() + i); return localDate(d); });
  const byDay: Record<string, number> = {};
  (q.data ?? []).forEach((s) => { const k = localDate(new Date(s.started_at)); byDay[k] = (byDay[k] ?? 0) + (s.duration_seconds ?? 0); });
  const max = Math.max(1, ...days.map((d) => byDay[d] ?? 0));
  const total = Object.values(byDay).reduce((a, b) => a + b, 0);
  return (
    <Card title={`Last 7 days · ${(total / 3600).toFixed(1)}h studied`}>
      <div className="flex h-32 items-end gap-2">
        {days.map((d) => (
          <div key={d} className="flex flex-1 flex-col items-center gap-1">
            <div className="w-full rounded-t bg-accent" style={{ height: `${((byDay[d] ?? 0) / max) * 100}%`, minHeight: 2 }} title={`${Math.round((byDay[d] ?? 0) / 60)} min`} />
            <span className="text-[10px] text-muted-foreground">{new Date(d + "T00:00:00").toLocaleDateString(undefined, { weekday: "short" })}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
