import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  date,
  numeric,
  jsonb,
} from "drizzle-orm/pg-core";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";

// 1. User Profiles
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  fullName: text("full_name"),
  branch: text("branch").default("CSE").notNull(),
  semester: integer("semester").default(5).notNull(),
  primaryLanguage: text("primary_language").default("Java").notNull(),
  proficiency: text("proficiency").default("Beginner").notNull(),
  placementTarget: text("placement_target").default("Beginning of 7th semester").notNull(),
  dailyHours: numeric("daily_hours", { precision: 3, scale: 1 }).default("2.5").notNull(),
  backlogs: integer("backlogs").default(0).notNull(),
  careerGoal: text("career_goal").default("Service-based and product-based software companies"),
  timezone: text("timezone").default("Asia/Kolkata").notNull(),
  onboarded: boolean("onboarded").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// 2. User Preferences
export const userPreferences = pgTable("user_preferences", {
  userId: uuid("user_id").primaryKey(),
  revisionIntervals: integer("revision_intervals").array().default([1, 3, 7, 14, 30]).notNull(),
  weekStart: integer("week_start").default(1).notNull(),
  emailReminders: boolean("email_reminders").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// 3. 36-Week Roadmaps
export const roadmaps = pgTable("roadmaps", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  title: text("title").notNull(),
  startDate: date("start_date").defaultNow().notNull(),
  totalWeeks: integer("total_weeks").default(36).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const roadmapWeeks = pgTable("roadmap_weeks", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  roadmapId: uuid("roadmap_id")
    .references(() => roadmaps.id, { onDelete: "cascade" })
    .notNull(),
  weekNumber: integer("week_number").notNull(),
  title: text("title").notNull(),
  focus: text("focus"),
  milestone: text("milestone"),
  completed: boolean("completed").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const roadmapTasks = pgTable("roadmap_tasks", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  weekId: uuid("week_id")
    .references(() => roadmapWeeks.id, { onDelete: "cascade" })
    .notNull(),
  title: text("title").notNull(),
  completed: boolean("completed").default(false).notNull(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  position: integer("position").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// 4. Daily Study Tasks & Sessions
export const dailyTasks = pgTable("daily_tasks", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  title: text("title").notNull(),
  category: text("category").default("General").notNull(),
  priority: text("priority").default("medium").notNull(), // 'low' | 'medium' | 'high'
  dueDate: date("due_date").defaultNow().notNull(),
  plannedMinutes: integer("planned_minutes").default(30).notNull(),
  notes: text("notes"),
  completed: boolean("completed").default(false).notNull(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  position: integer("position").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const studySessions = pgTable("study_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  taskId: uuid("task_id").references(() => dailyTasks.id, { onDelete: "set null" }),
  category: text("category").default("General").notNull(),
  startedAt: timestamp("started_at", { withTimezone: true }).defaultNow().notNull(),
  endedAt: timestamp("ended_at", { withTimezone: true }),
  pausedSeconds: integer("paused_seconds").default(0).notNull(),
  pausedAt: timestamp("paused_at", { withTimezone: true }),
  durationSeconds: integer("duration_seconds"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// 5. DSA Coding Problems & Spaced Repetition Attempts
export const codingProblems = pgTable("coding_problems", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  title: text("title").notNull(),
  url: text("url"),
  platform: text("platform"),
  topic: text("topic").default("Arrays").notNull(),
  difficulty: text("difficulty").default("easy").notNull(), // 'easy' | 'medium' | 'hard'
  status: text("status").default("todo").notNull(), // 'todo' | 'attempted' | 'solved' | 'revise'
  notes: text("notes"),
  approach: text("approach"),
  nextRevision: date("next_revision"),
  revisionCount: integer("revision_count").default(0).notNull(),
  solvedAt: timestamp("solved_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const codingAttempts = pgTable("coding_attempts", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  problemId: uuid("problem_id")
    .references(() => codingProblems.id, { onDelete: "cascade" })
    .notNull(),
  success: boolean("success").notNull(),
  minutes: integer("minutes").default(0).notNull(),
  attemptedAt: timestamp("attempted_at", { withTimezone: true }).defaultNow().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// 6. CS Core Subjects & Mastery Topics
export const learningTopics = pgTable("learning_topics", {
  id: uuid("id").defaultRandom().primaryKey(),
  subject: text("subject").notNull(),
  name: text("name").notNull(),
  position: integer("position").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const topicProgress = pgTable("topic_progress", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  topicId: uuid("topic_id")
    .references(() => learningTopics.id, { onDelete: "cascade" })
    .notNull(),
  status: text("status").default("not_started").notNull(), // 'not_started' | 'learning' | 'done' | 'weak'
  confidence: integer("confidence").default(0).notNull(), // 0 to 5
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// 7. Aptitude Practice
export const aptitudeAttempts = pgTable("aptitude_attempts", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  topic: text("topic").notNull(),
  totalQuestions: integer("total_questions").notNull(),
  correct: integer("correct").notNull(),
  minutes: integer("minutes").default(0).notNull(),
  attemptedOn: date("attempted_on").defaultNow().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// 8. Interview Preparation
export const interviewQuestions = pgTable("interview_questions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  subject: text("subject").notNull(),
  question: text("question").notNull(),
  answer: text("answer"),
  confident: boolean("confident").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const interviewNotes = pgTable("interview_notes", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  title: text("title").notNull(),
  body: text("body"),
  kind: text("kind").default("note").notNull(), // 'note' | 'mock'
  score: integer("score"), // 0 to 10
  heldOn: date("held_on"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// 9. Engineering Projects
export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  techStack: text("tech_stack"),
  githubUrl: text("github_url"),
  demoUrl: text("demo_url"),
  status: text("status").default("planning").notNull(), // 'planning' | 'building' | 'done'
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const projectTasks = pgTable("project_tasks", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  projectId: uuid("project_id")
    .references(() => projects.id, { onDelete: "cascade" })
    .notNull(),
  title: text("title").notNull(),
  isMilestone: boolean("is_milestone").default(false).notNull(),
  completed: boolean("completed").default(false).notNull(),
  dueDate: date("due_date"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// 10. Resumes
export const resumeVersions = pgTable("resume_versions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  label: text("label").notNull(),
  link: text("link"),
  checklist: jsonb("checklist").default({}).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// 11. Placement Pipeline Kanban
export const placementApplications = pgTable("placement_applications", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  company: text("company").notNull(),
  role: text("role").notNull(),
  companyType: text("company_type").default("service").notNull(), // 'service' | 'product' | 'startup' | 'other'
  eligibility: text("eligibility"),
  deadline: date("deadline"),
  status: text("status").default("saved").notNull(), // 'saved' | 'applied' | 'assessment' | 'interview' | 'offer' | 'rejected' | 'withdrawn'
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const applicationEvents = pgTable("application_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  applicationId: uuid("application_id")
    .references(() => placementApplications.id, { onDelete: "cascade" })
    .notNull(),
  kind: text("kind").notNull(),
  eventAt: timestamp("event_at", { withTimezone: true }).notNull(),
  result: text("result"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// 12. Weekly Reviews, Notifications & Activities
export const weeklyReviews = pgTable("weekly_reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  weekStart: date("week_start").notNull(),
  wentWell: text("went_well"),
  improve: text("improve"),
  rating: integer("rating"), // 1 to 5
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const notifications = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  title: text("title").notNull(),
  body: text("body"),
  read: boolean("read").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const userActivityEvents = pgTable("user_activity_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  event: text("event").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// Inferred TypeScript Types
export type Profile = InferSelectModel<typeof profiles>;
export type NewProfile = InferInsertModel<typeof profiles>;

export type UserPreference = InferSelectModel<typeof userPreferences>;
export type NewUserPreference = InferInsertModel<typeof userPreferences>;

export type Roadmap = InferSelectModel<typeof roadmaps>;
export type NewRoadmap = InferInsertModel<typeof roadmaps>;

export type RoadmapWeek = InferSelectModel<typeof roadmapWeeks>;
export type NewRoadmapWeek = InferInsertModel<typeof roadmapWeeks>;

export type RoadmapTask = InferSelectModel<typeof roadmapTasks>;
export type NewRoadmapTask = InferInsertModel<typeof roadmapTasks>;

export type DailyTask = InferSelectModel<typeof dailyTasks>;
export type NewDailyTask = InferInsertModel<typeof dailyTasks>;

export type StudySession = InferSelectModel<typeof studySessions>;
export type NewStudySession = InferInsertModel<typeof studySessions>;

export type CodingProblem = InferSelectModel<typeof codingProblems>;
export type NewCodingProblem = InferInsertModel<typeof codingProblems>;

export type CodingAttempt = InferSelectModel<typeof codingAttempts>;
export type NewCodingAttempt = InferInsertModel<typeof codingAttempts>;

export type LearningTopic = InferSelectModel<typeof learningTopics>;
export type NewLearningTopic = InferInsertModel<typeof learningTopics>;

export type TopicProgress = InferSelectModel<typeof topicProgress>;
export type NewTopicProgress = InferInsertModel<typeof topicProgress>;

export type PlacementApplication = InferSelectModel<typeof placementApplications>;
export type NewPlacementApplication = InferInsertModel<typeof placementApplications>;

export type ApplicationEvent = InferSelectModel<typeof applicationEvents>;
export type NewApplicationEvent = InferInsertModel<typeof applicationEvents>;
