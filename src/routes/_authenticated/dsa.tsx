import { createFileRoute } from "@tanstack/react-router";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useState } from "react";
import { supabase, unwrap, localDate } from "@/lib/db";
import { useAction, useDebounced } from "@/lib/hooks";
import { nextRevision } from "@/lib/scoring";
import { PageHeader, Card, Loading, ErrorBox, Empty, selectCls } from "@/components/app-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dsa")({
  head: () => ({ meta: [{ title: "DSA tracker — CareerPilot" }, { name: "description", content: "Track coding problems, attempts and revisions." }, { property: "og:title", content: "DSA tracker — CareerPilot" }, { property: "og:description", content: "Track coding problems, attempts and revisions." }] }),
  component: Dsa,
});

const TOPICS = ["Arrays", "Strings", "Hashing", "Two pointers", "Sliding window", "Recursion", "Sorting", "Binary search", "Linked list", "Stack", "Queue", "Trees", "BST", "Heap", "Graphs", "Greedy", "DP", "Bit manipulation"];
const PAGE = 20;
const inv = [["problems"], ["dashboard"], ["revise"]];

function Dsa() {
  const today = localDate();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [diff, setDiff] = useState("");
  const [topic, setTopic] = useState("");
  const [page, setPage] = useState(0);
  const s = useDebounced(search);

  const q = useQuery({
    queryKey: ["problems", s, status, diff, topic, page],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      let qb = supabase.from("coding_problems").select("*", { count: "exact" }).order("created_at", { ascending: false }).range(page * PAGE, page * PAGE + PAGE - 1);
      if (s) qb = qb.ilike("title", `%${s.replace(/[%_]/g, "")}%`);
      if (status) qb = qb.eq("status", status);
      if (diff) qb = qb.eq("difficulty", diff);
      if (topic) qb = qb.eq("topic", topic);
      const res = await qb;
      return { rows: unwrap(res), count: res.count ?? 0 };
    },
  });
  const revise = useQuery({
    queryKey: ["revise", today],
    queryFn: async () => unwrap(await supabase.from("coding_problems").select("id,title,topic,next_revision,revision_count").lte("next_revision", today).order("next_revision").limit(20)),
  });

  const [f, setF] = useState({ title: "", url: "", platform: "LeetCode", topic: "Arrays", difficulty: "easy" });
  const add = useAction(async () => {
    if (!f.title.trim()) throw new Error("Enter a problem title");
    if (f.url && !/^https?:\/\//i.test(f.url)) throw new Error("URL must start with http(s)://");
    unwrap(await supabase.from("coding_problems").insert({ title: f.title.trim().slice(0, 300), url: f.url || null, platform: f.platform || null, topic: f.topic, difficulty: f.difficulty }));
    setF({ ...f, title: "", url: "" });
  }, { invalidate: inv, success: "Problem added" });
  const del = useAction(async (id: string) => unwrap(await supabase.from("coding_problems").delete().eq("id", id)), { invalidate: inv, success: "Deleted" });
  const attempt = useAction(async (v: { id: string; success: boolean; minutes: number; revision_count: number }) => {
    unwrap(await supabase.from("coding_attempts").insert({ problem_id: v.id, success: v.success, minutes: Math.max(0, Math.min(1440, v.minutes || 0)) }));
    unwrap(await supabase.from("coding_problems").update(v.success
      ? { status: "solved", solved_at: new Date().toISOString(), next_revision: nextRevision(today, v.revision_count), revision_count: v.revision_count + 1 }
      : { status: "attempted" }).eq("id", v.id));
  }, { invalidate: inv, success: "Attempt logged" });

  const pages = Math.max(1, Math.ceil((q.data?.count ?? 0) / PAGE));

  return (
    <div className="space-y-6">
      <PageHeader
        badge="DSA Repository"
        title="Coding Problems & Spaced Revision"
        subtitle="Track LeetCode, Codeforces & GeeksforGeeks problems with automatic revision intervals (1, 3, 7, 14, 30 days)."
      />
      <Card title="Add problem">
        <form className="flex flex-wrap gap-2" onSubmit={(e) => { e.preventDefault(); add.mutate(undefined); }}>
          <Input placeholder="Title" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} className="min-w-48 flex-1" maxLength={300} />
          <Input placeholder="https://…" value={f.url} onChange={(e) => setF({ ...f, url: e.target.value })} className="min-w-40 flex-1" maxLength={500} />
          <Input placeholder="Platform" value={f.platform} onChange={(e) => setF({ ...f, platform: e.target.value })} className="w-28" maxLength={50} />
          <select className={selectCls} value={f.topic} onChange={(e) => setF({ ...f, topic: e.target.value })} aria-label="Topic">{TOPICS.map((t) => <option key={t}>{t}</option>)}</select>
          <select className={selectCls} value={f.difficulty} onChange={(e) => setF({ ...f, difficulty: e.target.value })} aria-label="Difficulty"><option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option></select>
          <Button disabled={add.isPending}>Add</Button>
        </form>
      </Card>
      {!!revise.data?.length && (
        <Card title={`Due for revision (${revise.data.length})`}>
          <ul className="space-y-1 text-sm">{revise.data.map((r) => <li key={r.id}>{r.title} <span className="text-muted-foreground">· {r.topic} · due {r.next_revision}</span></li>)}</ul>
        </Card>
      )}
      <Card title={`Problems (${q.data?.count ?? 0})`}>
        <div className="mb-3 flex flex-wrap gap-2">
          <Input placeholder="Search…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} className="w-48" />
          <select className={selectCls} value={status} onChange={(e) => { setStatus(e.target.value); setPage(0); }} aria-label="Status filter"><option value="">All statuses</option><option value="todo">To do</option><option value="attempted">Attempted</option><option value="solved">Solved</option><option value="revise">Revise</option></select>
          <select className={selectCls} value={diff} onChange={(e) => { setDiff(e.target.value); setPage(0); }} aria-label="Difficulty filter"><option value="">All levels</option><option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option></select>
          <select className={selectCls} value={topic} onChange={(e) => { setTopic(e.target.value); setPage(0); }} aria-label="Topic filter"><option value="">All topics</option>{TOPICS.map((t) => <option key={t}>{t}</option>)}</select>
        </div>
        {q.isLoading ? <Loading /> : q.error ? <ErrorBox error={q.error} /> : !q.data?.rows?.length ? <Empty>No problems yet.</Empty> : (
          <ul className="divide-y">{q.data.rows.map((p) => <ProblemRow key={p.id} p={p} onAttempt={(success, minutes) => attempt.mutate({ id: p.id, success, minutes, revision_count: p.revision_count })} onDelete={() => del.mutate(p.id)} />)}</ul>
        )}
        <div className="mt-3 flex items-center justify-end gap-2 text-sm">
          <Button size="sm" variant="outline" disabled={page === 0} onClick={() => setPage(page - 1)}>Prev</Button>
          <span>{page + 1} / {pages}</span>
          <Button size="sm" variant="outline" disabled={page + 1 >= pages} onClick={() => setPage(page + 1)}>Next</Button>
        </div>
      </Card>
    </div>
  );
}

function ProblemRow({ p, onAttempt, onDelete }: { p: { id: string; title: string; url: string | null; platform: string | null; topic: string; difficulty: string; status: string; next_revision: string | null }; onAttempt: (s: boolean, m: number) => void; onDelete: () => void }) {
  const [mins, setMins] = useState(20);
  return (
    <li className="flex flex-wrap items-center gap-2 py-2">
      <div className="min-w-48 flex-1">
        <div className="flex items-center gap-1 font-medium">{p.title}{p.url && <a href={p.url} target="_blank" rel="noopener noreferrer" aria-label="Open problem"><ExternalLink className="h-3.5 w-3.5" /></a>}</div>
        <div className="text-xs text-muted-foreground">{p.platform} · {p.topic} · {p.difficulty} · <span className="font-medium">{p.status}</span>{p.next_revision && ` · revise ${p.next_revision}`}</div>
      </div>
      <Input type="number" min={0} value={mins} onChange={(e) => setMins(Number(e.target.value))} className="w-16" aria-label="Minutes taken" />
      <Button size="sm" variant="outline" onClick={() => onAttempt(true, mins)}>Solved</Button>
      <Button size="sm" variant="ghost" onClick={() => onAttempt(false, mins)}>Failed</Button>
      <Button size="icon" variant="ghost" onClick={onDelete} aria-label="Delete"><Trash2 className="h-4 w-4" /></Button>
    </li>
  );
}
