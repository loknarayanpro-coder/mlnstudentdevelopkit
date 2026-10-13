import { localDate } from "@/lib/db";

export interface StudySessionState {
  startedAt: string | Date;
  pausedAt?: string | Date | null;
  pausedSeconds: number;
  endedAt?: string | Date | null;
}

/**
 * Calculates current live elapsed seconds for an active or completed study session.
 */
export function calculateSessionSeconds(
  session: StudySessionState,
  now = new Date(),
): number {
  const start = new Date(session.startedAt).getTime();
  const end = session.endedAt ? new Date(session.endedAt).getTime() : now.getTime();

  let pauseSec = session.pausedSeconds || 0;
  if (session.pausedAt && !session.endedAt) {
    const ongoingPause = Math.max(0, Math.floor((now.getTime() - new Date(session.pausedAt).getTime()) / 1000));
    pauseSec += ongoingPause;
  }

  const rawDuration = Math.floor((end - start) / 1000) - pauseSec;
  return Math.max(0, rawDuration);
}

/**
 * Formats seconds into human-readable HH:MM:SS or MM:SS.
 */
export function formatDuration(totalSeconds: number): string {
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  const pad = (n: number) => n.toString().padStart(2, "0");
  if (hrs > 0) {
    return `${hrs}h ${pad(mins)}m ${pad(secs)}s`;
  }
  return `${pad(mins)}:${pad(secs)}`;
}

/**
 * Helper to roll over overdue tasks into today's backlog.
 */
export function getOverdueTaskUpdates(
  tasks: Array<{ id: string; dueDate: string; completed: boolean }>,
  targetDate = localDate(),
): Array<{ id: string; dueDate: string }> {
  return tasks
    .filter((t) => !t.completed && t.dueDate < targetDate)
    .map((t) => ({ id: t.id, dueDate: targetDate }));
}
