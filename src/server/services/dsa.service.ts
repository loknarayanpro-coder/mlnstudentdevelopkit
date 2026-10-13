import { localDate } from "@/lib/db";

export type Difficulty = "easy" | "medium" | "hard";
export type ProblemStatus = "todo" | "attempted" | "solved" | "revise";

export const DEFAULT_REVISION_INTERVALS = [1, 3, 7, 14, 30];

export const DIFFICULTY_WEIGHTS: Record<Difficulty, number> = {
  easy: 1.0,
  medium: 1.5,
  hard: 2.0,
};

/**
 * Calculates the next revision date using the Leitner spaced repetition interval schedule.
 */
export function computeNextRevisionDate(
  revisionCount: number,
  intervals = DEFAULT_REVISION_INTERVALS,
  baseDate = new Date(),
): string {
  const index = Math.min(Math.max(0, revisionCount), intervals.length - 1);
  const daysToAdd = intervals[index] ?? 1;

  const next = new Date(baseDate.getTime());
  next.setDate(next.getDate() + daysToAdd);
  return localDate(next);
}

/**
 * Processes an attempt on a coding problem and returns updated repetition states.
 */
export function processProblemAttempt(
  success: boolean,
  currentRevisionCount: number,
  intervals = DEFAULT_REVISION_INTERVALS,
): {
  status: ProblemStatus;
  revisionCount: number;
  nextRevision: string;
} {
  if (success) {
    const nextCount = currentRevisionCount + 1;
    return {
      status: "solved",
      revisionCount: nextCount,
      nextRevision: computeNextRevisionDate(nextCount, intervals),
    };
  } else {
    // Reset or downgrade interval on failure
    return {
      status: "revise",
      revisionCount: 0,
      nextRevision: computeNextRevisionDate(0, intervals),
    };
  }
}

/**
 * Difficulty-weighted DSA mastery calculation (0 to 100 benchmark).
 */
export function calculateDsaScore(
  solvedProblems: Array<{ difficulty: string }>,
  targetQuota = 150,
): number {
  if (solvedProblems.length === 0) return 0;

  const totalPoints = solvedProblems.reduce((sum, p) => {
    const diff = (p.difficulty?.toLowerCase() as Difficulty) || "easy";
    return sum + (DIFFICULTY_WEIGHTS[diff] ?? 1.0);
  }, 0);

  // Target weighted score normalized to 100
  const score = Math.round((totalPoints / targetQuota) * 100);
  return Math.min(100, Math.max(0, score));
}
