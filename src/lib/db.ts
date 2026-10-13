import { supabase } from "@/lib/supabase/client";

/** Throw a user-safe error when a database call fails. */
export function unwrap<T>(res: { data: T; error: { message: string; code?: string } | null }): T {
  if (res.error) {
    const code = res.error.code;
    if (code === "42501") throw new Error("You don't have permission to do that.");
    if (code === "23505") throw new Error("That already exists.");
    if (code === "23514") throw new Error("Some values are invalid.");
    throw new Error(res.error.message || "Something went wrong. Please try again.");
  }
  return res.data;
}

export async function currentUserId(): Promise<string> {
  const { data } = await supabase.auth.getUser();
  if (!data.user) throw new Error("Please sign in again.");
  return data.user.id;
}

/** Local YYYY-MM-DD in the browser's time zone. */
export function localDate(d = new Date()): string {
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10);
}

export function errMsg(e: unknown) {
  return e instanceof Error ? e.message : "Something went wrong.";
}

export { supabase };
