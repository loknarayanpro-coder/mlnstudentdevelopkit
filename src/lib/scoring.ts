export type DashboardStats = {
  tasks_today: number;
  tasks_today_done: number;
  planned_minutes_today: number;
  study_seconds_today: number;
  study_seconds_7d: number;
  problems_total: number;
  problems_solved: number;
  problems_easy: number;
  problems_medium: number;
  problems_hard: number;
  topics_total: number;
  topics_done: number;
  weeks_total: number;
  weeks_done: number;
  roadmap_start: string | null;
  project_tasks_total: number;
  project_tasks_done: number;
  apps_active: number;
  offers: number;
};

const ratio = (a: number, b: number) => (b > 0 ? Math.min(1, a / b) : 0);

/**
 * Preparation score (0–100), each component counted once:
 *  30% roadmap weeks completed
 *  25% DSA: solved problems vs target of 150 (medium/hard weighted 1.5x/2x)
 *  20% learning topics marked done
 *  15% project tasks completed
 *  10% consistency: study hours in last 7 days vs (daily_hours * 7)
 */
export function preparationScore(s: DashboardStats, dailyHours: number): number {
  const dsaPoints = s.problems_easy + s.problems_medium * 1.5 + s.problems_hard * 2;
  const score =
    30 * ratio(s.weeks_done, s.weeks_total) +
    25 * ratio(dsaPoints, 150) +
    20 * ratio(s.topics_done, s.topics_total) +
    15 * ratio(s.project_tasks_done, s.project_tasks_total) +
    10 * ratio(s.study_seconds_7d / 3600, dailyHours * 7);
  return Math.round(score);
}

/** Current roadmap week (1-based, clamped) from start date. */
export function currentWeek(startDate: string | null, totalWeeks: number, today = new Date()): number {
  if (!startDate || totalWeeks <= 0) return 1;
  const start = new Date(startDate + "T00:00:00");
  const days = Math.floor((today.getTime() - start.getTime()) / 86400000);
  return Math.max(1, Math.min(totalWeeks, Math.floor(days / 7) + 1));
}

/** Next spaced-revision date given revision count and intervals (days). */
export function nextRevision(fromDate: string, revisionCount: number, intervals = [1, 3, 7, 14, 30]): string {
  const d = new Date(fromDate + "T00:00:00Z");
  const gap = intervals[Math.min(revisionCount, intervals.length - 1)] ?? 1;
  d.setUTCDate(d.getUTCDate() + gap);
  return d.toISOString().slice(0, 10);
}

export function accuracy(correct: number, total: number): number {
  return total > 0 ? Math.round((correct / total) * 100) : 0;
}
