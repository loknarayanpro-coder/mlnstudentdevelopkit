import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase, unwrap, currentUserId, errMsg } from "./db";

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const uid = await currentUserId();
      const res = await supabase.from("profiles").select("*").eq("id", uid).maybeSingle();
      if (res.data) return res.data;

      const { data: userRes } = await supabase.auth.getUser();
      const user = userRes?.user;
      const fullName =
        user?.user_metadata?.full_name ||
        user?.user_metadata?.name ||
        (user?.email ? user.email.split("@")[0] : "Student");

      // Auto-provision profile row in Supabase
      const createRes = await supabase
        .from("profiles")
        .upsert({
          id: uid,
          full_name: fullName,
          branch: "CSE",
          semester: 5,
          primary_language: "Java",
          proficiency: "Beginner",
          placement_target: "Beginning of 7th semester",
          daily_hours: 2.5,
          backlogs: 0,
        })
        .select()
        .single();

      return unwrap(createRes);
    },
  });
}

/** Mutation that only toasts success after the server confirms, and refreshes given query keys. */
export function useAction<V>(fn: (v: V) => Promise<unknown>, opts: { invalidate: string[][]; success?: string }) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => {
      opts.invalidate.forEach((k) => qc.invalidateQueries({ queryKey: k }));
      if (opts.success) toast.success(opts.success);
    },
    onError: (e) => toast.error(errMsg(e)),
  });
}

export function useDebounced<T>(value: T, ms = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

export function downloadFile(name: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

export function toCsv(rows: Record<string, unknown>[]): string {
  if (!rows.length) return "";
  const cols = Object.keys(rows[0] ?? {});
  const esc = (v: unknown) => {
    const s = v == null ? "" : String(v);
    const safe = /^[=+\-@]/.test(s) ? "'" + s : s; // prevent CSV formula injection
    return /[",\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
  };
  return [cols.join(","), ...rows.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\n");
}
