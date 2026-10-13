import { describe, it, expect } from "vitest";
import { preparationScore, currentWeek, nextRevision, accuracy, type DashboardStats } from "./scoring";

const empty: DashboardStats = {
  tasks_today: 0, tasks_today_done: 0, planned_minutes_today: 0, study_seconds_today: 0, study_seconds_7d: 0,
  problems_total: 0, problems_solved: 0, problems_easy: 0, problems_medium: 0, problems_hard: 0,
  topics_total: 0, topics_done: 0, weeks_total: 36, weeks_done: 0, roadmap_start: null,
  project_tasks_total: 0, project_tasks_done: 0, apps_active: 0, offers: 0,
};

describe("preparationScore", () => {
  it("is 0 with no progress", () => expect(preparationScore(empty, 2.5)).toBe(0));
  it("gives 30 for a fully completed roadmap only", () =>
    expect(preparationScore({ ...empty, weeks_done: 36 }, 2.5)).toBe(30));
  it("caps DSA at 25 points", () =>
    expect(preparationScore({ ...empty, problems_hard: 500 }, 2.5)).toBe(25));
  it("is 100 when everything is complete", () =>
    expect(
      preparationScore(
        { ...empty, weeks_done: 36, problems_easy: 150, topics_total: 10, topics_done: 10, project_tasks_total: 4, project_tasks_done: 4, study_seconds_7d: 2.5 * 7 * 3600 },
        2.5,
      ),
    ).toBe(100));
});

describe("currentWeek", () => {
  it("is week 1 on start day", () => expect(currentWeek("2026-01-01", 36, new Date("2026-01-01T10:00:00"))).toBe(1));
  it("is week 2 after 7 days", () => expect(currentWeek("2026-01-01", 36, new Date("2026-01-08T10:00:00"))).toBe(2));
  it("clamps to total weeks", () => expect(currentWeek("2020-01-01", 36, new Date("2026-01-01T10:00:00"))).toBe(36));
});

describe("nextRevision", () => {
  it("first revision is 1 day later", () => expect(nextRevision("2026-03-10", 0)).toBe("2026-03-11"));
  it("third revision is 7 days later", () => expect(nextRevision("2026-03-10", 2)).toBe("2026-03-17"));
});

describe("accuracy", () => {
  it("rounds percentage", () => expect(accuracy(2, 3)).toBe(67));
  it("handles zero", () => expect(accuracy(0, 0)).toBe(0));
});
