# Track Your Tech Journey

MASTER BUILD PROMPT — CareerPilot Production-Ready Full-Stack Career Tracker

Act as a senior full-stack software architect, backend engineer, database engineer, security engineer, QA engineer, and UI/UX designer.

Build a complete, working, production-oriented web application named CareerPilot — Career & Placement Management System.

This must be a genuine full-stack application, NOT a static website, frontend-only prototype, Figma design, or UI mockup.

The application must support at least 50 authenticated users actively using it at the same time, with separate accounts, isolated personal data, persistent storage, and reliable server-side operations.

Do not claim the application is production-ready until its functionality, database integration, security, and concurrent-user capacity have been tested.

1. Core objective

CareerPilot helps engineering students plan and track their career preparation, coding practice, aptitude, technical subjects, projects, resumes, and placement applications.

Default student profile:

- Branch: CSE.

- Current semester: 5th semester.

- Programming language: Java.

- Coding proficiency: Beginner.

- Placement target: Beginning of 7th semester.

- Daily study availability: 2–3 hours.

- Backlogs: None.

- Career goal: Prepare for service-based and product-based software companies.

- Initial roadmap: Editable 36-week placement preparation plan.

Support students with different branches, semesters, skills, study schedules, and placement targets.

2. Mandatory full-stack architecture

Use the following production-oriented architecture:

Frontend:

- React.

- TypeScript.

- Vite or the app builder's supported framework.

- Tailwind CSS.

- Accessible, reusable UI components.

- Responsive mobile-first design.

Backend:

- Supabase Auth for authentication.

- Supabase PostgreSQL for persistent data.

- PostgreSQL Row Level Security (RLS) for tenant and user data isolation.

- Server-side Edge Functions or a secure backend API for privileged operations.

- Database migrations and version-controlled schema.

- Scheduled jobs or a supported notification service for background tasks when required.

Hosting:

- Deploy the frontend on Vercel, Cloudflare Pages, or an equivalent production platform.

- Use managed Supabase infrastructure or an equivalent managed PostgreSQL backend.

- Configure custom domains, HTTPS, environment variables, and production settings.

Do not implement privileged database operations in the browser.

Never expose service-role keys, database passwords, private API keys, or other secrets in frontend code.

Use the technology stack supported by the chosen builder if necessary, but maintain the same security, persistence, and functional requirements.

3. Mandatory real functionality

Every visible feature must work end to end.

Implement:

- Registration, login, logout, password recovery, and session persistence.

- Onboarding and editable user profiles.

- Create, read, update, and delete operations for user-owned records.

- Persistent daily tasks and study sessions.

- Editable roadmaps and weekly milestones.

- DSA and coding problem tracking.

- Java learning progress.

- Aptitude practice tracking.

- CS fundamentals and interview preparation.

- Project management.

- Resume readiness.

- Placement application tracking.

- Analytics derived from saved records.

- Search, filtering, sorting, pagination where appropriate.

- Data export and account deletion.

- Responsive layouts and functional mobile navigation.

A button must never display a success message unless its operation has actually succeeded.

Handle loading states, validation errors, server errors, network failures, empty data, and permission failures.

No placeholder buttons, fake progress, hardcoded analytics, or mock success responses in production mode.

4. Multi-user authentication and data isolation

The application must support at least 50 independent student accounts using the system concurrently.

Implement:

- Unique authenticated user IDs.

- Server-verified identity for protected operations.

- User-specific database records.

- RLS policies for SELECT, INSERT, UPDATE, and DELETE.

- Policies that prevent users from accessing, modifying, or deleting another user's private data.

- Ownership validation for nested resources and related records.

- Server-side validation of every sensitive operation.

- Secure session handling.

- Rate limiting for authentication-sensitive and expensive operations.

- Protection against unauthorized access, IDOR, and privilege escalation.

Never trust a user ID supplied by the browser as proof of ownership.

Never expose another student's personal information, CGPA, resume, projects, tasks, applications, or analytics.

If administrative roles are implemented, enforce permissions on the server and in database policies.

5. Database design

Create real PostgreSQL tables with appropriate relationships, constraints, timestamps, indexes, and migration scripts.

Include at least these entities:

1. profiles

2. user_preferences

3. roadmaps

4. roadmap_weeks

5. roadmap_tasks

6. daily_tasks

7. study_sessions

8. coding_problems

9. coding_attempts

10. learning_topics

11. topic_progress

12. aptitude_attempts

13. interview_questions

14. interview_notes

15. projects

16. project_tasks

17. resume_versions

18. placement_applications

19. application_events

20. weekly_reviews

21. notifications

22. user_activity_events, if needed for auditing

Every private record must have an explicit ownership relationship or an equally strong authorization mechanism.

Use foreign keys, NOT NULL constraints, sensible uniqueness rules, and indexes on frequently filtered columns.

Use transactions for multi-step operations that must succeed or fail together.

Use database timestamps consistently and handle user time zones correctly.

Keep the schema maintainable and avoid storing all application data inside a single JSON field.

Provide SQL migration files and an explanation of the relationships between tables.

6. Real-time persistence and data integrity

When a user creates, edits, completes, or deletes a task:

- Validate the request.

- Check ownership and permissions.

- Persist the change to PostgreSQL.

- Return the actual operation result.

- Update the UI only after the result is confirmed, or use an optimistic update with proper rollback.

- Reconcile the UI with server state after errors or reconnection.

Progress must survive:

- Page refresh.

- Logout and login.

- Browser closure.

- Device changes.

- Network interruptions, once successfully synced.

Do not use localStorage as the primary database.

Local storage may be used for non-sensitive preferences or an explicitly designed offline cache, but the server database must remain authoritative.

If offline mode is supported, queue changes safely, reconcile conflicts, and clearly distinguish unsynced data from saved data.

7. Complete application modules

Implement the following as real functional modules.

A. Dashboard

- Actual overall preparation score.

- Today's scheduled tasks.

- Planned versus actual study time.

- Current roadmap week.

- DSA problem statistics.

- Learning topic coverage.

- Project progress.

- Upcoming application deadlines.

- Upcoming interviews.

- Weekly and monthly trends.

Compute metrics from actual database records. Document the scoring formula and avoid double-counting completed tasks.

B. Roadmap

- Editable 36-week roadmap.

- Week and task completion.

- Target date calculations.

- Rescheduling and overdue task handling.

- Completion criteria and milestones.

- Weekly review and progress history.

- Ability to change placement goals without destroying previous progress.

C. Daily planner

- Create, edit, reorder, reschedule, and delete tasks.

- Categories, deadlines, priorities, notes, and duration.

- Start, pause, resume, and stop study sessions.

- Record actual study time.

- Prevent invalid or duplicate session submissions.

- Carry unfinished work into a rescheduling queue.

- Weekly study summaries.

D. DSA tracker

- Topics and difficulty levels.

- Problem URLs and platform names.

- Attempts and solving status.

- Notes, hints, and solution approach.

- Time taken and revision dates.

- Topic coverage and accuracy statistics.

- Configurable spaced revision.

E. Learning and aptitude

- Java topic checklist.

- DBMS, operating systems, and networking.

- OOP and interview questions.

- Aptitude attempts, accuracy, and timing.

- Weak-topic identification and revision queues.

F. Projects and resumes

- Project CRUD operations.

- Milestones, tasks, GitHub links, and demo URLs.

- Resume versions and readiness checklist.

- Project descriptions generated only from user-provided facts.

- No fabricated achievements or experience.

G. Placement pipeline

- Company and role details.

- Eligibility requirements.

- Application deadlines.

- Applied, assessment, interview, offer, rejection, and withdrawn statuses.

- Interview event dates.

- Preparation notes and results.

- Search, filters, reminders, and exports.

H. Weekly analytics

- Completed versus planned tasks.

- Study hours.

- Coding performance.

- Topic progress.

- Project milestones.

- Mock interview results.

- Placement pipeline statistics.

Every chart must use real saved data and have appropriate empty states.

8. Multi-user scalability and concurrency requirements

Design and validate the application for a minimum of 50 concurrent active users.

Define concurrent active users as 50 authenticated sessions performing normal application activities, rather than 50 registered accounts sitting idle.

Test representative workloads including:

- 50 simultaneous authenticated sessions.

- Concurrent task creation and completion.

- Simultaneous dashboard and analytics requests.

- Concurrent study-session writes.

- Multiple users editing their own data.

- Simultaneous reads and writes to shared reference data.

- Expired sessions and unauthorized requests.

- Temporary database or network failures.

Use a load-testing tool such as k6 or an equivalent tool.

Create reproducible load-test scripts and test data generation scripts.

Measure:

- Successful request rate.

- Error rate.

- Median and p95 response latency.

- Database connection usage.

- CPU and memory where observable.

- Database query performance.

- Rate-limit behaviour.

- Data integrity under concurrent writes.

Initial acceptance targets under the declared test environment:

- At least 50 authenticated virtual users.

- At least 99% successful requests for the defined normal-operation workload.

- p95 response time below 1 second for ordinary API and database operations under the test workload, excluding external third-party latency.

- No cross-user data leakage.

- No lost or duplicated task completions due to concurrent updates.

- No unhandled server exceptions during the successful test run.

These are targets to validate, not assumed results. Document the hardware, hosting tier, dataset, workload, and actual measurements. If the targets fail, identify and fix the bottleneck, then rerun the tests.

Do not use one browser tab as evidence that 50-user concurrency works.

9. Performance and database optimisation

Implement:

- Pagination for large collections.

- Appropriate database indexes.

- Query limits.

- Avoidance of N+1 queries.

- Efficient dashboard aggregation.

- Server-side filtering and sorting where appropriate.

- Caching only where safe and useful.

- Request debouncing for search.

- Connection pooling or the provider's recommended connection management.

- Transaction-safe state changes.

Avoid fetching every record merely to calculate dashboard statistics.

Use aggregate SQL queries or appropriate summary tables if profiling demonstrates the need.

Do not introduce unnecessary microservices, Kubernetes, or distributed infrastructure for this initial scale.

10. Security and privacy

Implement:

- HTTPS in deployment.

- Strict RLS and backend authorization.

- Validated request schemas.

- Safe error responses that do not leak secrets.

- Secure handling of environment variables.

- Input sanitisation where applicable.

- Protection against common web vulnerabilities.

- Appropriate rate limits.

- Audit logging for security-sensitive events without recording passwords, tokens, or unnecessary personal information.

- Data export and account deletion.

- Minimal collection of personal data.

- Dependency checks and security configuration review.

Never store plaintext passwords or authentication tokens in application tables.

Do not put sensitive student data into public URLs or analytics events.

11. Testing requirements

Write and run:

- Unit tests for calculations and validation.

- Integration tests for database operations.

- Authentication tests.

- Authorization and cross-user isolation tests.

- CRUD tests for each major module.

- End-to-end tests for critical student workflows.

- Mobile responsive and navigation tests.

- Concurrent-user load tests.

Important end-to-end scenario:

1. Student A creates an account.

2. Student A completes onboarding.

3. Student A creates a study task.

4. Student A completes a coding problem.

5. Student A records a study session.

6. The dashboard updates using saved database records.

7. Student A logs out and logs back in.

8. All saved progress remains intact.

9. Student B logs in and sees only Student B's data.

10. Student B cannot access Student A's records by changing request IDs or URLs.

11. Both users can create and complete tasks simultaneously without corrupting data.

Do not report tests as passing unless they have actually been executed. Clearly distinguish implemented, tested, and unverified features.

12. Deployment and operations

Provide:

- Production environment configuration template.

- Database migration instructions.

- Supabase project setup.

- Authentication provider setup.

- Deployment steps.

- Custom domain and HTTPS guidance.

- Health-check endpoint where supported.

- Structured error logging.

- Database backup and restore plan.

- Recovery instructions.

- Dependency update guidance.

- Usage and quota monitoring.

- Cost and scaling considerations.

- A README with local development and production setup.

Keep development, testing, and production environments separate.

Never commit actual secrets to source control.

Document any manual steps that require the owner's account or credentials.

13. Required deliverables

Deliver the actual runnable project containing:

- Complete frontend source code.

- Backend functions or API source code.

- Database schema and migrations.

- RLS policies.

- Authentication implementation.

- Automated tests.

- Load-testing scripts.

- Seed/demo data.

- Environment variable template.

- Deployment configuration.

- README documentation.

Include a feature status report that categorises each feature as:

- Implemented.

- Tested successfully.

- Requires external configuration.

- Not implemented.

Provide actual load-test results, not invented claims.

14. Build order

Work in the following order:

Milestone 1: Create the architecture, database schema, migrations, authentication, and RLS policies.

Milestone 2: Implement onboarding, user settings, daily tasks, and persistent study sessions.

Milestone 3: Implement the roadmap and real dashboard calculations.

Milestone 4: Implement DSA, Java, aptitude, and CS fundamentals.

Milestone 5: Implement projects, resume management, and the placement pipeline.

Milestone 6: Implement analytics, exports, reminders, and error handling.

Milestone 7: Run security tests, cross-user isolation tests, integration tests, and mobile tests.

Milestone 8: Run a 50-user load test, fix bottlenecks, and document the measured results.

Do not stop after generating the design or completing the first frontend page. Continue implementing the backend and testing until the required deliverables are complete or a genuine blocker is encountered.

If external credentials, hosting accounts, or paid services are required, identify exactly what must be configured and provide setup instructions instead of pretending that configuration has been completed.

Final acceptance condition: The application must be a genuinely usable, secure, database-backed career tracker that supports independent student accounts, survives refreshes and logins, correctly isolates data, and has documented test evidence for its 50-concurrent-user target.


## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
