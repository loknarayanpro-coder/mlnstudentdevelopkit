import { preparationScore, type DashboardStats } from "@/lib/scoring";

export interface ReadinessBreakdown {
  overallScore: number;
  dsaScore: number;
  coreScore: number;
  roadmapScore: number;
  projectsScore: number;
  momentumScore: number;
  status: "Needs Focus" | "On Track" | "Placement Ready" | "Elite Candidate";
}

/**
 * Computes deep multi-pillar readiness evaluation from aggregated dashboard metrics.
 */
export function evaluateReadiness(stats: DashboardStats, dailyHours = 2.5): ReadinessBreakdown {
  const safeStats: DashboardStats = {
    ...stats,
    problems_easy: stats.problems_easy ?? 0,
    problems_medium: stats.problems_medium ?? 0,
    problems_hard: stats.problems_hard ?? 0,
  };
  const overall = preparationScore(safeStats, dailyHours);

  const dsaWeight = Math.min(100, Math.round(((stats.problems_solved || 0) / 100) * 100));
  const coreWeight = Math.min(100, Math.round(((stats.topics_done || 0) / Math.max(1, stats.topics_total || 26)) * 100));
  const roadmapWeight = Math.min(100, Math.round(((stats.weeks_done || 0) / Math.max(1, stats.weeks_total || 36)) * 100));
  const projectsWeight = Math.min(100, Math.round(((stats.project_tasks_done || 0) / Math.max(1, stats.project_tasks_total || 6)) * 100));
  const momentumWeight = Math.min(100, Math.round(((stats.tasks_today_done || 0) / Math.max(1, stats.tasks_today || 1)) * 100));

  let status: ReadinessBreakdown["status"] = "Needs Focus";
  if (overall >= 85) status = "Elite Candidate";
  else if (overall >= 70) status = "Placement Ready";
  else if (overall >= 45) status = "On Track";

  return {
    overallScore: overall,
    dsaScore: dsaWeight,
    coreScore: coreWeight,
    roadmapScore: roadmapWeight,
    projectsScore: projectsWeight,
    momentumScore: momentumWeight,
    status,
  };
}

/**
 * Computes student study momentum and consistency velocity metrics.
 */
export function computeStudyVelocity(
  studySeconds7d: number,
  targetDailyHours = 2.5,
): {
  totalHours7d: number;
  dailyAverageHours: number;
  targetWeeklyHours: number;
  pacePercentage: number;
} {
  const totalHours = Math.round((studySeconds7d / 3600) * 10) / 10;
  const dailyAvg = Math.round((totalHours / 7) * 10) / 10;
  const targetWeekly = Math.round(targetDailyHours * 7 * 10) / 10;
  const pace = Math.min(150, Math.round((totalHours / Math.max(1, targetWeekly)) * 100));

  return {
    totalHours7d: totalHours,
    dailyAverageHours: dailyAvg,
    targetWeeklyHours: targetWeekly,
    pacePercentage: pace,
  };
}
