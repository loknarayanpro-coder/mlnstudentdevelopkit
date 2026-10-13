import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Compass, Code2, Briefcase, Map } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CareerPilot — Placement prep, planned and tracked" },
      { name: "description", content: "A 36-week placement roadmap with daily planner, DSA tracker, Java & CS topics, aptitude, projects and applications." },
      { property: "og:title", content: "CareerPilot — Placement prep, planned and tracked" },
      { property: "og:description", content: "Track every step from your first year to your placement offer." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: Map, t: "36-week roadmap", d: "An editable plan from Java basics to mock interviews." },
  { icon: Code2, t: "DSA & learning", d: "Problems, spaced revision, Java, DBMS, OS, networks, aptitude." },
  { icon: Briefcase, t: "Placement pipeline", d: "Deadlines, assessments, interviews and offers in one place." },
];

function Landing() {
  return (
    <div className="min-h-screen bg-ink text-ink-foreground grid-paper">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <div className="flex items-center gap-2 font-display text-lg font-semibold">
          <Compass className="h-5 w-5 text-accent" /> CareerPilot
        </div>
        <Button asChild variant="secondary" size="sm"><Link to="/auth">Sign in</Link></Button>
      </header>
      <main className="mx-auto max-w-6xl px-5 pb-20 pt-16 md:pt-28">
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-accent">Career & placement management</p>
        <h1 className="max-w-3xl text-4xl font-semibold leading-tight md:text-6xl">
          From first year to offer letter — on a plan you can see.
        </h1>
        <p className="mt-5 max-w-xl text-lg opacity-75">
          Built for students of all years. Daily tasks, study sessions, coding practice and applications, all saved to your account and turned into honest progress numbers.
        </p>
        <div className="mt-8 flex gap-3">
          <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90"><Link to="/auth">Start your plan</Link></Button>
        </div>
        <div className="mt-20 grid gap-4 md:grid-cols-3">
          {features.map((f) => (
            <div key={f.t} className="rounded-xl border border-sidebar-border bg-sidebar-accent/60 p-5">
              <f.icon className="h-5 w-5 text-accent" />
              <h3 className="mt-3 font-semibold">{f.t}</h3>
              <p className="mt-1 text-sm opacity-70">{f.d}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
