import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase, unwrap, currentUserId, localDate } from "@/lib/db";
import { useAction } from "@/lib/hooks";
import { accuracy } from "@/lib/scoring";
import { PageHeader, Card, Loading, ErrorBox, Empty, selectCls } from "@/components/app-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/learning")({
  head: () => ({ meta: [{ title: "Learning & aptitude — CareerPilot" }, { name: "description", content: "Java, CS fundamentals, aptitude and interview prep." }, { property: "og:title", content: "Learning & aptitude — CareerPilot" }, { property: "og:description", content: "Java, CS fundamentals, aptitude and interview prep." }] }),
  component: Learning,
});

function Learning() {
  return (
    <div>
      <PageHeader
        badge="CS Core & Aptitude"
        title="Technical Subjects & Interview Bank"
        subtitle="Master Java, DBMS, Operating Systems, Computer Networks, and Quantitative Aptitude tests."
      />
      <Tabs defaultValue="topics">
        <TabsList className="mb-4 flex-wrap"><TabsTrigger value="topics">Topics</TabsTrigger><TabsTrigger value="aptitude">Aptitude</TabsTrigger><TabsTrigger value="interview">Interview Q&A</TabsTrigger></TabsList>
        <TabsContent value="topics"><Topics /></TabsContent>
        <TabsContent value="aptitude"><Aptitude /></TabsContent>
        <TabsContent value="interview"><Interview /></TabsContent>
      </Tabs>
    </div>
  );
}

function Topics() {
  const q = useQuery({
    queryKey: ["topics"],
    queryFn: async () => {
      const [t, p] = await Promise.all([
        supabase.from("learning_topics").select("*").order("subject").order("position"),
        supabase.from("topic_progress").select("topic_id,status"),
      ]);
      return { topics: unwrap(t), progress: Object.fromEntries((unwrap(p) ?? []).map((x) => [x.topic_id, x.status])) as Record<string, string> };
    },
  });
  const set = useAction(async (v: { topic_id: string; status: string }) => {
    const uid = await currentUserId();
    unwrap(await supabase.from("topic_progress").upsert({ user_id: uid, topic_id: v.topic_id, status: v.status }, { onConflict: "user_id,topic_id" }));
  }, { invalidate: [["topics"], ["dashboard"]] });
  if (q.isLoading) return <Loading />;
  if (q.error) return <ErrorBox error={q.error} />;
  const { progress } = q.data!; const topics = q.data!.topics ?? [];
  const subjects = [...new Set(topics.map((t) => t.subject))];
  const weak = topics.filter((t) => progress[t.id] === "weak");
  return (
    <div className="space-y-4">
      {weak.length > 0 && <Card title="Revision queue — weak topics"><p className="text-sm">{weak.map((w) => `${w.subject}: ${w.name}`).join(" · ")}</p></Card>}
      <div className="grid gap-4 md:grid-cols-2">
        {subjects.map((s) => {
          const list = topics.filter((t) => t.subject === s);
          const done = list.filter((t) => progress[t.id] === "done").length;
          return (
            <Card key={s} title={`${s} · ${done}/${list.length}`}>
              <ul className="space-y-1.5">{list.map((t) => (
                <li key={t.id} className="flex items-center justify-between gap-2 text-sm">
                  <span>{t.name}</span>
                  <select className={selectCls} value={progress[t.id] ?? "not_started"} onChange={(e) => set.mutate({ topic_id: t.id, status: e.target.value })} aria-label={`Status of ${t.name}`}>
                    <option value="not_started">Not started</option><option value="learning">Learning</option><option value="done">Done</option><option value="weak">Weak</option>
                  </select>
                </li>))}
              </ul>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

const APT = ["Quantitative", "Logical reasoning", "Verbal", "Data interpretation"];
function Aptitude() {
  const inv = [["aptitude"]];
  const q = useQuery({ queryKey: ["aptitude"], queryFn: async () => unwrap(await supabase.from("aptitude_attempts").select("*").order("attempted_on", { ascending: false }).limit(100)) });
  const [f, setF] = useState({ topic: APT[0] as string, total: 20, correct: 0, minutes: 20 });
  const add = useAction(async () => {
    if (f.total < 1 || f.correct < 0 || f.correct > f.total) throw new Error("Correct must be between 0 and total");
    unwrap(await supabase.from("aptitude_attempts").insert({ topic: f.topic, total_questions: f.total, correct: f.correct, minutes: Math.max(0, f.minutes), attempted_on: localDate() }));
  }, { invalidate: inv, success: "Attempt saved" });
  const del = useAction(async (id: string) => unwrap(await supabase.from("aptitude_attempts").delete().eq("id", id)), { invalidate: inv });
  const rows = q.data ?? [];
  const byTopic = APT.map((t) => { const r = rows.filter((x) => x.topic === t); const c = r.reduce((a, b) => a + b.correct, 0); const n = r.reduce((a, b) => a + b.total_questions, 0); return { t, acc: accuracy(c, n), n }; });
  return (
    <div className="space-y-4">
      <Card title="Log a practice set">
        <form className="flex flex-wrap items-end gap-2" onSubmit={(e) => { e.preventDefault(); add.mutate(undefined); }}>
          <select className={selectCls} value={f.topic} onChange={(e) => setF({ ...f, topic: e.target.value })} aria-label="Topic">{APT.map((t) => <option key={t}>{t}</option>)}</select>
          <label className="text-xs">Total<Input type="number" min={1} value={f.total} onChange={(e) => setF({ ...f, total: Number(e.target.value) })} className="w-20" /></label>
          <label className="text-xs">Correct<Input type="number" min={0} value={f.correct} onChange={(e) => setF({ ...f, correct: Number(e.target.value) })} className="w-20" /></label>
          <label className="text-xs">Minutes<Input type="number" min={0} value={f.minutes} onChange={(e) => setF({ ...f, minutes: Number(e.target.value) })} className="w-20" /></label>
          <Button disabled={add.isPending}>Save</Button>
        </form>
      </Card>
      <div className="grid gap-3 md:grid-cols-4">{byTopic.map((b) => (
        <div key={b.t} className={"rounded-xl border bg-card p-4 " + (b.n > 0 && b.acc < 60 ? "border-destructive/50" : "")}>
          <div className="text-xs text-muted-foreground">{b.t}</div>
          <div className="font-display text-2xl font-semibold">{b.n ? `${b.acc}%` : "–"}</div>
          <div className="text-xs text-muted-foreground">{b.n} questions{b.n > 0 && b.acc < 60 ? " · weak" : ""}</div>
        </div>))}
      </div>
      <Card title="History">
        {q.isLoading ? <Loading /> : !rows.length ? <Empty>No attempts yet.</Empty> : (
          <ul className="divide-y text-sm">{rows.map((r) => (
            <li key={r.id} className="flex items-center justify-between py-2"><span>{r.attempted_on} · {r.topic} · {r.correct}/{r.total_questions} ({accuracy(r.correct, r.total_questions)}%) · {r.minutes}m</span>
              <Button size="icon" variant="ghost" onClick={() => del.mutate(r.id)} aria-label="Delete"><Trash2 className="h-4 w-4" /></Button></li>))}
          </ul>
        )}
      </Card>
    </div>
  );
}

function Interview() {
  const inv = [["iq"]];
  const q = useQuery({ queryKey: ["iq"], queryFn: async () => unwrap(await supabase.from("interview_questions").select("*").order("created_at", { ascending: false }).limit(200)) });
  const [f, setF] = useState({ subject: "Java", question: "", answer: "" });
  const add = useAction(async () => {
    if (!f.question.trim()) throw new Error("Enter a question");
    unwrap(await supabase.from("interview_questions").insert({ subject: f.subject, question: f.question.trim().slice(0, 2000), answer: f.answer.slice(0, 5000) || null }));
    setF({ ...f, question: "", answer: "" });
  }, { invalidate: inv, success: "Question saved" });
  const toggle = useAction(async (v: { id: string; c: boolean }) => unwrap(await supabase.from("interview_questions").update({ confident: v.c }).eq("id", v.id)), { invalidate: inv });
  const del = useAction(async (id: string) => unwrap(await supabase.from("interview_questions").delete().eq("id", id)), { invalidate: inv });
  return (
    <div className="space-y-4">
      <Card title="Add question">
        <form className="space-y-2" onSubmit={(e) => { e.preventDefault(); add.mutate(undefined); }}>
          <div className="flex gap-2">
            <select className={selectCls} value={f.subject} onChange={(e) => setF({ ...f, subject: e.target.value })} aria-label="Subject">{["Java", "OOP", "DBMS", "OS", "Networks", "DSA", "HR"].map((s) => <option key={s}>{s}</option>)}</select>
            <Input placeholder="Question" value={f.question} onChange={(e) => setF({ ...f, question: e.target.value })} />
          </div>
          <Textarea placeholder="Your answer (optional)" value={f.answer} onChange={(e) => setF({ ...f, answer: e.target.value })} />
          <Button disabled={add.isPending}>Save</Button>
        </form>
      </Card>
      {q.isLoading ? <Loading /> : !q.data?.length ? <Empty>No questions yet.</Empty> : (
        <div className="space-y-2">{q.data.map((r) => (
          <div key={r.id} className="rounded-xl border bg-card p-3 text-sm">
            <div className="flex items-start justify-between gap-2">
              <div><span className="text-xs text-muted-foreground">{r.subject}</span><div className="font-medium">{r.question}</div></div>
              <div className="flex gap-1">
                <Button size="sm" variant={r.confident ? "default" : "outline"} onClick={() => toggle.mutate({ id: r.id, c: !r.confident })}>{r.confident ? "Confident" : "Needs work"}</Button>
                <Button size="icon" variant="ghost" onClick={() => del.mutate(r.id)} aria-label="Delete"><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
            {r.answer && <p className="mt-2 whitespace-pre-wrap text-muted-foreground">{r.answer}</p>}
          </div>))}
        </div>
      )}
    </div>
  );
}
