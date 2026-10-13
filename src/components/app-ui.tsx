import type { ReactNode } from "react";
import { Loader2, Sparkles, Inbox, Plus, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function PageHeader({
  badge,
  title,
  subtitle,
  action,
}: {
  badge?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4 bg-white/60 backdrop-blur-sm p-6 rounded-3xl border border-[#EADBCA] shadow-sm">
      <div className="space-y-1">
        {badge && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF3D6] border border-[#F8D886] text-xs font-bold uppercase tracking-wider text-[#9A6208]">
            <Sparkles className="h-3 w-3 text-[#EAA82C]" />
            <span>{badge}</span>
          </div>
        )}
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#182232] tracking-tight">
          {title}
        </h1>
        {subtitle && <p className="text-sm text-[#182232]/75 font-medium">{subtitle}</p>}
      </div>
      {action && <div className="flex items-center gap-2.5 flex-wrap">{action}</div>}
    </div>
  );
}

export function Stat({
  label,
  value,
  hint,
  icon: Icon,
  variant = "default",
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: React.ComponentType<{ className?: string }>;
  variant?: "default" | "amber" | "blue" | "emerald" | "purple";
}) {
  const iconVariants = {
    default: "bg-[#182232]/5 text-[#182232]",
    amber: "bg-[#EAA82C]/15 text-[#B47408]",
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    purple: "bg-purple-50 text-purple-600",
  };

  const borderVariants = {
    default: "border-[#EADBCA]",
    amber: "border-[#F8D886]/70",
    blue: "border-blue-200/80",
    emerald: "border-emerald-200/80",
    purple: "border-purple-200/80",
  };

  return (
    <div
      className={cn(
        "rounded-2xl border bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 relative overflow-hidden group",
        borderVariants[variant],
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#182232]/65">
          {label}
        </span>
        {Icon && (
          <div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-xl transition-transform group-hover:scale-110",
              iconVariants[variant],
            )}
          >
            <Icon className="h-4.5 w-4.5" />
          </div>
        )}
      </div>

      <div className="mt-3 font-display text-3xl font-extrabold text-[#182232] tracking-tight">
        {value}
      </div>

      {hint && (
        <div className="mt-2 text-xs font-medium text-[#182232]/70 flex items-center gap-1.5">
          {hint}
        </div>
      )}
    </div>
  );
}

export function Empty({
  title = "Nothing here yet",
  children,
  actionText,
  onAction,
  icon: Icon = Inbox,
}: {
  title?: string;
  children: ReactNode;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-[#EADBCA] bg-[#FAF7F2]/50 p-8 text-center flex flex-col items-center justify-center space-y-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAA82C]/15 text-[#B47408] shadow-sm">
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <h4 className="text-sm font-bold text-[#182232]">{title}</h4>
        <p className="mt-1 text-xs text-[#182232]/70 max-w-xs">{children}</p>
      </div>
      {actionText && onAction && (
        <Button
          onClick={onAction}
          size="sm"
          className="rounded-full bg-[#182232] text-white hover:bg-[#24334a] text-xs font-medium px-4 shadow-sm"
        >
          <Plus className="mr-1 h-3.5 w-3.5" />
          {actionText}
        </Button>
      )}
    </div>
  );
}

export function Loading() {
  return (
    <div className="flex flex-col items-center justify-center p-16 text-[#182232]/70 space-y-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAA82C]/20 text-[#EAA82C]">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
      <p className="text-xs font-semibold tracking-wider uppercase text-[#182232]/60">
        Loading Flight Deck...
      </p>
    </div>
  );
}

export function ErrorBox({ error }: { error: unknown }) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50/80 p-5 text-sm text-red-700 shadow-sm flex items-start gap-3">
      <div className="p-1 rounded-lg bg-red-100 text-red-600 font-bold shrink-0">!</div>
      <div>
        <div className="font-bold">Unable to load data</div>
        <div className="mt-0.5 text-xs text-red-600">
          {error instanceof Error ? error.message : "Couldn't load this. Check your connection and retry."}
        </div>
      </div>
    </div>
  );
}

export function Card({
  title,
  subtitle,
  children,
  action,
  className,
}: {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-3xl border border-[#EADBCA] bg-white p-6 shadow-sm hover:shadow-md transition-all",
        className,
      )}
    >
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-3 border-b border-[#F2EDE4] pb-3.5">
          <div>
            {title && (
              <h2 className="font-display text-base sm:text-lg font-bold text-[#182232] flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-[#EAA82C]" />
                {title}
              </h2>
            )}
            {subtitle && <p className="text-xs text-[#182232]/60 mt-0.5">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export const selectCls =
  "h-10 rounded-xl border border-[#EADBCA] bg-white px-3 text-sm text-[#182232] font-medium focus:outline-none focus:ring-2 focus:ring-[#EAA82C] focus:border-transparent transition-all";
