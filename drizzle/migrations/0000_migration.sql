
-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  branch text not null default 'CSE',
  semester int not null default 5 check (semester between 1 and 10),
  primary_language text not null default 'Java',
  proficiency text not null default 'Beginner',
  placement_target text not null default 'Beginning of 7th semester',
  daily_hours numeric(3,1) not null default 2.5 check (daily_hours >= 0 and daily_hours <= 16),
  backlogs int not null default 0 check (backlogs >= 0),
  career_goal text default 'Service-based and product-based software companies',
  timezone text not null default 'Asia/Kolkata',
  onboarded boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "own profile select" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "own profile insert" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "own profile update" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
create policy "own profile delete" on public.profiles for delete to authenticated using (auth.uid() = id);

create or replace function public.set_updated_at() returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end $$;

-- Generic user-owned tables
create table public.user_preferences (user_id uuid primary key default auth.uid(), revision_intervals int[] not null default '{1,3,7,14,30}', week_start int not null default 1, email_reminders boolean not null default false, created_at timestamptz not null default now(), updated_at timestamptz not null default now());

create table public.roadmaps (id uuid primary key default gen_random_uuid(), user_id uuid not null default auth.uid(), title text not null check (char_length(title) between 1 and 200), start_date date not null default current_date, total_weeks int not null default 36 check (total_weeks between 1 and 104), is_active boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create unique index roadmaps_one_active on public.roadmaps(user_id) where is_active;

create table public.roadmap_weeks (id uuid primary key default gen_random_uuid(), user_id uuid not null default auth.uid(), roadmap_id uuid not null references public.roadmaps(id) on delete cascade, week_number int not null check (week_number >= 1), title text not null, focus text, milestone text, completed boolean not null default false, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique (roadmap_id, week_number));

create table public.roadmap_tasks (id uuid primary key default gen_random_uuid(), user_id uuid not null default auth.uid(), week_id uuid not null references public.roadmap_weeks(id) on delete cascade, title text not null check (char_length(title) between 1 and 300), completed boolean not null default false, completed_at timestamptz, position int not null default 0, created_at timestamptz not null default now(), updated_at timestamptz not null default now());

create table public.daily_tasks (id uuid primary key default gen_random_uuid(), user_id uuid not null default auth.uid(), title text not null check (char_length(title) between 1 and 300), category text not null default 'General', priority text not null default 'medium' check (priority in ('low','medium','high')), due_date date not null default current_date, planned_minutes int not null default 30 check (planned_minutes between 0 and 1440), notes text check (char_length(notes) <= 5000), completed boolean not null default false, completed_at timestamptz, position int not null default 0, created_at timestamptz not null default now(), updated_at timestamptz not null default now());

create table public.study_sessions (id uuid primary key default gen_random_uuid(), user_id uuid not null default auth.uid(), task_id uuid references public.daily_tasks(id) on delete set null, category text not null default 'General', started_at timestamptz not null default now(), ended_at timestamptz, paused_seconds int not null default 0 check (paused_seconds >= 0), paused_at timestamptz, duration_seconds int check (duration_seconds >= 0), notes text, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create unique index study_sessions_one_open on public.study_sessions(user_id) where ended_at is null;

create table public.coding_problems (id uuid primary key default gen_random_uuid(), user_id uuid not null default auth.uid(), title text not null check (char_length(title) between 1 and 300), url text check (url is null or url ~* '^https?://'), platform text, topic text not null default 'Arrays', difficulty text not null default 'easy' check (difficulty in ('easy','medium','hard')), status text not null default 'todo' check (status in ('todo','attempted','solved','revise')), notes text, approach text, next_revision date, revision_count int not null default 0, solved_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now());

create table public.coding_attempts (id uuid primary key default gen_random_uuid(), user_id uuid not null default auth.uid(), problem_id uuid not null references public.coding_problems(id) on delete cascade, success boolean not null, minutes int not null default 0 check (minutes between 0 and 1440), attempted_at timestamptz not null default now(), created_at timestamptz not null default now(), updated_at timestamptz not null default now());

-- learning_topics is shared reference data
create table public.learning_topics (id uuid primary key default gen_random_uuid(), subject text not null, name text not null, position int not null default 0, created_at timestamptz not null default now(), unique(subject, name));
grant select on public.learning_topics to authenticated;
grant all on public.learning_topics to service_role;
alter table public.learning_topics enable row level security;
create policy "topics readable" on public.learning_topics for select to authenticated using (true);

create table public.topic_progress (id uuid primary key default gen_random_uuid(), user_id uuid not null default auth.uid(), topic_id uuid not null references public.learning_topics(id) on delete cascade, status text not null default 'not_started' check (status in ('not_started','learning','done','weak')), confidence int not null default 0 check (confidence between 0 and 5), created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(user_id, topic_id));

create table public.aptitude_attempts (id uuid primary key default gen_random_uuid(), user_id uuid not null default auth.uid(), topic text not null, total_questions int not null check (total_questions between 1 and 500), correct int not null check (correct >= 0), minutes int not null default 0 check (minutes >= 0), attempted_on date not null default current_date, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), check (correct <= total_questions));

create table public.interview_questions (id uuid primary key default gen_random_uuid(), user_id uuid not null default auth.uid(), subject text not null, question text not null check (char_length(question) between 1 and 2000), answer text, confident boolean not null default false, created_at timestamptz not null default now(), updated_at timestamptz not null default now());

create table public.interview_notes (id uuid primary key default gen_random_uuid(), user_id uuid not null default auth.uid(), title text not null, body text, kind text not null default 'note' check (kind in ('note','mock')), score int check (score between 0 and 10), held_on date, created_at timestamptz not null default now(), updated_at timestamptz not null default now());

create table public.projects (id uuid primary key default gen_random_uuid(), user_id uuid not null default auth.uid(), name text not null check (char_length(name) between 1 and 200), description text, tech_stack text, github_url text check (github_url is null or github_url ~* '^https?://'), demo_url text check (demo_url is null or demo_url ~* '^https?://'), status text not null default 'planning' check (status in ('planning','building','done')), created_at timestamptz not null default now(), updated_at timestamptz not null default now());

create table public.project_tasks (id uuid primary key default gen_random_uuid(), user_id uuid not null default auth.uid(), project_id uuid not null references public.projects(id) on delete cascade, title text not null, is_milestone boolean not null default false, completed boolean not null default false, due_date date, created_at timestamptz not null default now(), updated_at timestamptz not null default now());

create table public.resume_versions (id uuid primary key default gen_random_uuid(), user_id uuid not null default auth.uid(), label text not null, link text check (link is null or link ~* '^https?://'), checklist jsonb not null default '{}'::jsonb, notes text, created_at timestamptz not null default now(), updated_at timestamptz not null default now());

create table public.placement_applications (id uuid primary key default gen_random_uuid(), user_id uuid not null default auth.uid(), company text not null check (char_length(company) between 1 and 200), role text not null check (char_length(role) between 1 and 200), company_type text not null default 'service' check (company_type in ('service','product','startup','other')), eligibility text, deadline date, status text not null default 'saved' check (status in ('saved','applied','assessment','interview','offer','rejected','withdrawn')), notes text, created_at timestamptz not null default now(), updated_at timestamptz not null default now());

create table public.application_events (id uuid primary key default gen_random_uuid(), user_id uuid not null default auth.uid(), application_id uuid not null references public.placement_applications(id) on delete cascade, kind text not null, event_at timestamptz not null, result text, notes text, created_at timestamptz not null default now(), updated_at timestamptz not null default now());

create table public.weekly_reviews (id uuid primary key default gen_random_uuid(), user_id uuid not null default auth.uid(), week_start date not null, went_well text, improve text, rating int check (rating between 1 and 5), created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(user_id, week_start));

create table public.notifications (id uuid primary key default gen_random_uuid(), user_id uuid not null default auth.uid(), title text not null, body text, read boolean not null default false, created_at timestamptz not null default now(), updated_at timestamptz not null default now());

create table public.user_activity_events (id uuid primary key default gen_random_uuid(), user_id uuid not null default auth.uid(), event text not null, created_at timestamptz not null default now(), updated_at timestamptz not null default now());

-- Grants, RLS, owner policies, updated_at triggers, indexes for all owned tables
do $$
declare t text;
begin
  foreach t in array array['user_preferences','roadmaps','roadmap_weeks','roadmap_tasks','daily_tasks','study_sessions','coding_problems','coding_attempts','topic_progress','aptitude_attempts','interview_questions','interview_notes','projects','project_tasks','resume_versions','placement_applications','application_events','weekly_reviews','notifications','user_activity_events'] loop
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
    execute format('grant all on public.%I to service_role', t);
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy "own select" on public.%I for select to authenticated using (auth.uid() = user_id)', t);
    execute format('create policy "own insert" on public.%I for insert to authenticated with check (auth.uid() = user_id)', t);
    execute format('create policy "own update" on public.%I for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id)', t);
    execute format('create policy "own delete" on public.%I for delete to authenticated using (auth.uid() = user_id)', t);
    execute format('create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at()', t);
    if t <> 'user_preferences' then
      execute format('create index %I on public.%I(user_id, created_at desc)', t || '_user_idx', t);
    end if;
  end loop;
end $$;
create trigger set_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create index daily_tasks_due on public.daily_tasks(user_id, due_date);
create index apps_deadline on public.placement_applications(user_id, deadline);
create index events_at on public.application_events(user_id, event_at);
create index problems_status on public.coding_problems(user_id, status);

-- Nested ownership: child rows must reference parents owned by same user
create or replace function public.check_parent_owner() returns trigger language plpgsql security definer set search_path = public as $$
declare owner uuid;
begin
  if tg_table_name = 'roadmap_weeks' then select user_id into owner from roadmaps where id = new.roadmap_id;
  elsif tg_table_name = 'roadmap_tasks' then select user_id into owner from roadmap_weeks where id = new.week_id;
  elsif tg_table_name = 'coding_attempts' then select user_id into owner from coding_problems where id = new.problem_id;
  elsif tg_table_name = 'project_tasks' then select user_id into owner from projects where id = new.project_id;
  elsif tg_table_name = 'application_events' then select user_id into owner from placement_applications where id = new.application_id;
  elsif tg_table_name = 'study_sessions' then
    if new.task_id is null then return new; end if;
    select user_id into owner from daily_tasks where id = new.task_id;
  end if;
  if owner is null or owner <> new.user_id then raise exception 'Parent record not found' using errcode = '42501'; end if;
  return new;
end $$;
do $$ declare t text; begin
  foreach t in array array['roadmap_weeks','roadmap_tasks','coding_attempts','project_tasks','application_events','study_sessions'] loop
    execute format('create trigger check_parent_owner before insert or update on public.%I for each row execute function public.check_parent_owner()', t);
  end loop;
end $$;

-- Completion timestamps maintained server-side (no double counting)
create or replace function public.stamp_completed() returns trigger language plpgsql set search_path = public as $$
begin
  if new.completed and (tg_op = 'INSERT' or not old.completed) then new.completed_at = now();
  elsif not new.completed then new.completed_at = null; end if;
  return new;
end $$;
create trigger stamp_completed before insert or update on public.daily_tasks for each row execute function public.stamp_completed();
create trigger stamp_completed before insert or update on public.roadmap_tasks for each row execute function public.stamp_completed();

-- Atomic study session stop
create or replace function public.stop_study_session(_id uuid) returns public.study_sessions language plpgsql security invoker set search_path = public as $$
declare s public.study_sessions;
begin
  update study_sessions set
    paused_seconds = paused_seconds + case when paused_at is not null then extract(epoch from now() - paused_at)::int else 0 end,
    paused_at = null,
    ended_at = now(),
    duration_seconds = greatest(0, extract(epoch from now() - started_at)::int - paused_seconds - case when paused_at is not null then extract(epoch from now() - paused_at)::int else 0 end)
  where id = _id and user_id = auth.uid() and ended_at is null
  returning * into s;
  if s.id is null then raise exception 'No active session' using errcode = 'P0002'; end if;
  return s;
end $$;

-- New user: profile + preferences + 36-week roadmap in one transaction
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
declare rid uuid; i int;
  titles text[] := array['Java basics & syntax','Control flow & methods','Arrays & strings','OOP I: classes, objects','OOP II: inheritance, polymorphism','Collections framework','Exceptions & file I/O','Recursion','Searching & sorting','Linked lists','Stacks & queues','Hashing','Trees I','Trees II: BST','Heaps & priority queues','Graphs I: BFS/DFS','Graphs II: shortest paths','Greedy algorithms','Dynamic programming I','Dynamic programming II','DBMS & SQL','Operating systems','Computer networks','OOP & design interview prep','Project 1 build','Project 1 polish & deploy','Project 2 build','Project 2 polish & deploy','Resume & LinkedIn','Aptitude: quantitative','Aptitude: logical & verbal','Mock tests: service companies','Mock tests: product companies','Mock interviews','Revision sprint','Placement readiness check'];
begin
  insert into profiles(id, full_name) values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'));
  insert into user_preferences(user_id) values (new.id);
  insert into roadmaps(user_id, title) values (new.id, '36-week placement plan') returning id into rid;
  for i in 1..36 loop
    insert into roadmap_weeks(user_id, roadmap_id, week_number, title) values (new.id, rid, i, titles[i]);
  end loop;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- Aggregated dashboard stats (single round-trip)
create or replace function public.dashboard_stats(_today date) returns jsonb language sql stable security invoker set search_path = public as $$
  select jsonb_build_object(
    'tasks_today', (select count(*) from daily_tasks where user_id = auth.uid() and due_date = _today),
    'tasks_today_done', (select count(*) from daily_tasks where user_id = auth.uid() and due_date = _today and completed),
    'planned_minutes_today', (select coalesce(sum(planned_minutes),0) from daily_tasks where user_id = auth.uid() and due_date = _today),
    'study_seconds_today', (select coalesce(sum(duration_seconds),0) from study_sessions where user_id = auth.uid() and ended_at is not null and started_at::date = _today),
    'study_seconds_7d', (select coalesce(sum(duration_seconds),0) from study_sessions where user_id = auth.uid() and ended_at is not null and started_at >= _today - 6),
    'problems_total', (select count(*) from coding_problems where user_id = auth.uid()),
    'problems_solved', (select count(*) from coding_problems where user_id = auth.uid() and status = 'solved'),
    'problems_easy', (select count(*) from coding_problems where user_id = auth.uid() and status = 'solved' and difficulty='easy'),
    'problems_medium', (select count(*) from coding_problems where user_id = auth.uid() and status = 'solved' and difficulty='medium'),
    'problems_hard', (select count(*) from coding_problems where user_id = auth.uid() and status = 'solved' and difficulty='hard'),
    'topics_total', (select count(*) from learning_topics),
    'topics_done', (select count(*) from topic_progress where user_id = auth.uid() and status = 'done'),
    'weeks_total', (select count(*) from roadmap_weeks w join roadmaps r on r.id = w.roadmap_id where r.user_id = auth.uid() and r.is_active),
    'weeks_done', (select count(*) from roadmap_weeks w join roadmaps r on r.id = w.roadmap_id where r.user_id = auth.uid() and r.is_active and w.completed),
    'roadmap_start', (select start_date from roadmaps where user_id = auth.uid() and is_active),
    'project_tasks_total', (select count(*) from project_tasks where user_id = auth.uid()),
    'project_tasks_done', (select count(*) from project_tasks where user_id = auth.uid() and completed),
    'apps_active', (select count(*) from placement_applications where user_id = auth.uid() and status in ('applied','assessment','interview')),
    'offers', (select count(*) from placement_applications where user_id = auth.uid() and status = 'offer')
  );
$$;
grant execute on function public.dashboard_stats(date) to authenticated;
grant execute on function public.stop_study_session(uuid) to authenticated;

-- Account deletion (self only)
create or replace function public.delete_my_account() returns void language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); t text;
begin
  if uid is null then raise exception 'Not authenticated'; end if;
  foreach t in array array['user_activity_events','notifications','weekly_reviews','application_events','placement_applications','resume_versions','project_tasks','projects','interview_notes','interview_questions','aptitude_attempts','topic_progress','coding_attempts','coding_problems','study_sessions','daily_tasks','roadmap_tasks','roadmap_weeks','roadmaps','user_preferences'] loop
    execute format('delete from public.%I where user_id = $1', t) using uid;
  end loop;
  delete from auth.users where id = uid;
end $$;
revoke execute on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.check_parent_owner() from public, anon, authenticated;

-- Reference topics
insert into public.learning_topics(subject, name, position) values
('Java','Variables & data types',1),('Java','Operators & control flow',2),('Java','Methods & recursion',3),('Java','Arrays & Strings',4),('Java','Classes & objects',5),('Java','Inheritance & polymorphism',6),('Java','Abstraction & interfaces',7),('Java','Exception handling',8),('Java','Collections framework',9),('Java','Generics',10),('Java','Streams & lambdas',11),('Java','Multithreading basics',12),
('DBMS','ER model',1),('DBMS','Normalization',2),('DBMS','SQL queries & joins',3),('DBMS','Transactions & ACID',4),('DBMS','Indexing',5),
('OS','Processes & threads',1),('OS','CPU scheduling',2),('OS','Deadlocks',3),('OS','Memory management & paging',4),('OS','Synchronization',5),
('Networks','OSI & TCP/IP models',1),('Networks','TCP vs UDP',2),('Networks','HTTP/HTTPS & DNS',3),('Networks','IP addressing & subnetting',4),
('OOP','Four pillars of OOP',1),('OOP','SOLID principles',2),('OOP','Common design patterns',3);
