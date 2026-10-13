import { createFileRoute, redirect, Outlet, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Compass, LayoutDashboard, CalendarCheck, Map, Code2, BookOpen, FolderGit2, Briefcase, BarChart3, Settings, LogOut, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/auth" });
    return { user: data.user };
  },
  component: Shell,
});

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/planner", label: "Planner", icon: CalendarCheck },
  { to: "/roadmap", label: "Roadmap", icon: Map },
  { to: "/dsa", label: "DSA", icon: Code2 },
  { to: "/learning", label: "Learning", icon: BookOpen },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

function Shell() {
  const [open, setOpen] = useState(false);
  const qc = useQueryClient();
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const links = (
    <nav className="flex flex-col gap-1">
      {nav.map((n) => (
        <Link
          key={n.to}
          to={n.to}
          onClick={() => setOpen(false)}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent",
            path.startsWith(n.to) && "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary",
          )}
        >
          <n.icon className="h-4 w-4" /> {n.label}
        </Link>
      ))}
      <button onClick={signOut} className="mt-4 flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium hover:bg-sidebar-accent">
        <LogOut className="h-4 w-4" /> Sign out
      </button>
    </nav>
  );

  return (
    <div className="min-h-screen md:flex">
      <aside className="hidden w-60 shrink-0 bg-sidebar p-4 text-sidebar-foreground md:block">
        <div className="sticky top-4">
          <div className="mb-6 flex items-center gap-2 px-2 font-display text-lg font-semibold">
            <Compass className="h-5 w-5 text-sidebar-primary" /> CareerPilot
          </div>
          {links}
        </div>
      </aside>
      <header className="sticky top-0 z-30 flex items-center justify-between bg-sidebar px-4 py-3 text-sidebar-foreground md:hidden">
        <div className="flex items-center gap-2 font-display font-semibold"><Compass className="h-5 w-5 text-sidebar-primary" /> CareerPilot</div>
        <button aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      </header>
      {open && <div className="fixed inset-x-0 top-12 z-20 bg-sidebar p-4 text-sidebar-foreground md:hidden">{links}</div>}
      <main className="mx-auto w-full max-w-6xl flex-1 p-4 md:p-8"><Outlet /></main>
    </div>
  );
}
