import { describe, it, expect } from "vitest";
import {
  computeNextRevisionDate,
  processProblemAttempt,
  calculateDsaScore,
} from "../server/services/dsa.service";
import {
  calculateSessionSeconds,
  formatDuration,
  getOverdueTaskUpdates,
} from "../server/services/planner.service";
import {
  calculateCurrentWeek,
  calculateRoadmapProgress,
  CURRICULUM_36_WEEKS,
} from "../server/services/roadmap.service";
import {
  isValidStatusTransition,
  getDeadlineUrgency,
} from "../server/services/placement.service";
import {
  evaluateReadiness,
  computeStudyVelocity,
} from "../server/services/analytics.service";

describe("Backend DSA Service", () => {
  it("schedules Leitner spaced repetition revisions accurately", () => {
    const base = new Date("2026-10-15T00:00:00Z");
    const next1 = computeNextRevisionDate(0, [1, 3, 7, 14, 30], base);
    expect(next1).toBe("2026-10-16");

    const next3 = computeNextRevisionDate(2, [1, 3, 7, 14, 30], base);
    expect(next3).toBe("2026-10-22");
  });

  it("handles problem attempt progression and reset", () => {
    const solved = processProblemAttempt(true, 1, [1, 3, 7, 14, 30]);
    expect(solved.status).toBe("solved");
    expect(solved.revisionCount).toBe(2);

    const failed = processProblemAttempt(false, 3, [1, 3, 7, 14, 30]);
    expect(failed.status).toBe("revise");
    expect(failed.revisionCount).toBe(0);
  });

  it("calculates weighted DSA difficulty score", () => {
    const problems = [
      { difficulty: "easy" },
      { difficulty: "medium" },
      { difficulty: "hard" },
    ];
    // Weights: 1 + 1.5 + 2 = 4.5. With quota 150 -> 3%
    const score = calculateDsaScore(problems, 150);
    expect(score).toBe(3);
  });
});

describe("Backend Planner Service", () => {
  it("calculates session seconds considering pauses", () => {
    const start = new Date(Date.now() - 3600 * 1000).toISOString();
    const duration = calculateSessionSeconds({
      startedAt: start,
      pausedSeconds: 300,
      endedAt: new Date().toISOString(),
    });
    // ~3600 - 300 = 3300 seconds (allow +- 2s jitter)
    expect(duration).toBeGreaterThanOrEqual(3298);
    expect(duration).toBeLessThanOrEqual(3302);
  });

  it("formats seconds to timer text", () => {
    expect(formatDuration(65)).toBe("01:05");
    expect(formatDuration(3665)).toBe("1h 01m 05s");
  });

  it("identifies overdue tasks for rollover", () => {
    const tasks = [
      { id: "1", dueDate: "2026-10-10", completed: false },
      { id: "2", dueDate: "2026-10-10", completed: true },
      { id: "3", dueDate: "2026-10-14", completed: false },
    ];
    const updates = getOverdueTaskUpdates(tasks, "2026-10-13");
    expect(updates).toEqual([{ id: "1", dueDate: "2026-10-13" }]);
  });
});

describe("Backend Roadmap Service", () => {
  it("provides complete 36 weeks of curriculum", () => {
    expect(CURRICULUM_36_WEEKS).toHaveLength(36);
    expect(CURRICULUM_36_WEEKS[0].title).toBe("Java basics & syntax");
    expect(CURRICULUM_36_WEEKS[35].title).toBe("Placement readiness check");
  });

  it("calculates current week correctly", () => {
    const start = new Date("2026-10-01");
    const current = calculateCurrentWeek(start, new Date("2026-10-15"));
    // 14 days difference / 7 = 2 weeks elapsed + 1 = week 3
    expect(current).toBe(3);
  });

  it("calculates roadmap completion percentage", () => {
    expect(calculateRoadmapProgress(18, 36)).toBe(50);
    expect(calculateRoadmapProgress(36, 36)).toBe(100);
  });
});

describe("Backend Placement Service", () => {
  it("validates Kanban state transitions correctly", () => {
    expect(isValidStatusTransition("saved", "applied")).toBe(true);
    expect(isValidStatusTransition("applied", "interview")).toBe(true);
    expect(isValidStatusTransition("interview", "offer")).toBe(true);
    expect(isValidStatusTransition("offer", "applied")).toBe(false);
  });

  it("computes deadline urgency", () => {
    const now = new Date("2026-10-13T12:00:00Z");
    expect(getDeadlineUrgency("2026-10-14", now)).toBe("urgent");
    expect(getDeadlineUrgency("2026-10-18", now)).toBe("soon");
    expect(getDeadlineUrgency("2026-10-30", now)).toBe("plenty");
    expect(getDeadlineUrgency("2026-10-10", now)).toBe("expired");
  });
});

describe("Backend Analytics Service", () => {
  it("computes study velocity pace", () => {
    // 36000 seconds = 10 hours in 7 days. Target 2.5 * 7 = 17.5 hours. Pace: 10/17.5 = 57%
    const velocity = computeStudyVelocity(36000, 2.5);
    expect(velocity.totalHours7d).toBe(10);
    expect(velocity.pacePercentage).toBe(57);
  });

  it("evaluates multi-pillar readiness", () => {
    const stats = {
      problems_solved: 80,
      problems_easy: 30,
      problems_medium: 40,
      problems_hard: 10,
      topics_done: 20,
      topics_total: 26,
      weeks_done: 28,
      weeks_total: 36,
      project_tasks_done: 5,
      project_tasks_total: 6,
      tasks_today_done: 3,
      tasks_today: 3,
      study_seconds_7d: 50000,
    };
    const evalResult = evaluateReadiness(stats as any);
    expect(evalResult.status).toBe("Placement Ready");
    expect(evalResult.overallScore).toBeGreaterThanOrEqual(70);
  });
});
