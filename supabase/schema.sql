-- ============================================================
-- BiCApp Supabase Schema
-- Run this in the Supabase SQL Editor (Project > SQL Editor)
-- ============================================================

-- ─── Extensions ─────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── Helper: is_staff() ─────────────────────────────────────
create or replace function is_staff()
returns boolean language sql security definer as $$
  select exists (
    select 1 from teachers where id = auth.uid() and is_active = true
  );
$$;

-- ─── Helper: is_coordinator() ────────────────────────────────
create or replace function is_coordinator()
returns boolean language sql security definer as $$
  select exists (
    select 1 from teachers where id = auth.uid() and role = 'coordinator' and is_active = true
  );
$$;

-- ─── Teachers ───────────────────────────────────────────────
create table if not exists teachers (
  id          uuid primary key references auth.users(id) on delete cascade,
  first_name  text not null,
  last_name   text not null,
  email       text not null unique,
  role        text not null default 'teacher' check (role in ('teacher','coordinator')),
  assigned_grades integer[],
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);
alter table teachers enable row level security;
create policy "staff can read teachers" on teachers for select using (is_staff());
create policy "coordinators can insert teachers" on teachers for insert with check (is_coordinator());
create policy "coordinators can update teachers" on teachers for update using (is_coordinator());

-- ─── Students ───────────────────────────────────────────────
create table if not exists students (
  id            uuid primary key default uuid_generate_v4(),
  first_name    text not null,
  last_name     text not null,
  birth_year    integer not null,
  grade         integer,
  school_name   text,
  city          text default 'Bellevue',
  state         text default 'WA',
  anonymous_id  text unique,
  is_active     boolean not null default true,
  total_points  integer not null default 0,
  reading_streak integer not null default 0,
  created_at    timestamptz not null default now()
);
alter table students enable row level security;
create policy "staff can read all students" on students for select using (is_staff());
create policy "staff can insert students" on students for insert with check (is_staff());
create policy "staff can update students" on students for update using (is_staff());
-- Students can read themselves via anon login (looked up by name+birth_year, no auth)
create policy "public can read students for login" on students for select using (true);

-- ─── Student ↔ Teacher Assignments ──────────────────────────
create table if not exists student_teacher_assignments (
  id          uuid primary key default uuid_generate_v4(),
  student_id  uuid references students(id) on delete cascade,
  teacher_id  uuid references teachers(id) on delete cascade,
  assigned_at timestamptz not null default now(),
  unique(student_id, teacher_id)
);
alter table student_teacher_assignments enable row level security;
create policy "staff read assignments" on student_teacher_assignments for select using (is_staff());
create policy "staff insert assignments" on student_teacher_assignments for insert with check (is_staff());

-- ─── Reading Logs ────────────────────────────────────────────
create table if not exists reading_logs (
  id          uuid primary key default uuid_generate_v4(),
  student_id  uuid references students(id) on delete cascade,
  date        date not null,
  book_title  text not null,
  author      text,
  minutes_read integer not null default 0,
  pages_read  integer not null default 0,
  notes       text,
  points_earned integer not null default 1,
  created_at  timestamptz not null default now()
);
alter table reading_logs enable row level security;
create policy "public read own logs" on reading_logs for select using (true);
create policy "public insert logs" on reading_logs for insert with check (true);
create policy "staff read all logs" on reading_logs for select using (is_staff());

-- ─── Writing Assignments (prompts) ───────────────────────────
create table if not exists writing_assignments (
  id            uuid primary key default uuid_generate_v4(),
  title         text not null,
  description   text,
  type          text not null default 'writing_prompt' check (type in ('reading_goal','writing_prompt','vocabulary')),
  grade         integer,
  due_date      date,
  points_reward integer not null default 10,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now()
);
alter table writing_assignments enable row level security;
create policy "anyone reads writing_assignments" on writing_assignments for select using (true);
create policy "staff insert writing_assignments" on writing_assignments for insert with check (is_staff());
create policy "staff update writing_assignments" on writing_assignments for update using (is_staff());

-- ─── Essays ──────────────────────────────────────────────────
create table if not exists essays (
  id            uuid primary key default uuid_generate_v4(),
  student_id    uuid references students(id) on delete cascade,
  assignment_id uuid references writing_assignments(id) on delete set null,
  title         text not null,
  body          text not null,
  status        text not null default 'pending' check (status in ('draft','pending','approved','needs_revision')),
  feedback      text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
alter table essays enable row level security;
create policy "public read own essays" on essays for select using (true);
create policy "public insert essays" on essays for insert with check (true);
create policy "public update own essays" on essays for update using (true);
create policy "staff read all essays" on essays for select using (is_staff());
create policy "staff update essays" on essays for update using (is_staff());

-- ─── Reviews ─────────────────────────────────────────────────
create table if not exists reviews (
  id          uuid primary key default uuid_generate_v4(),
  essay_id    uuid references essays(id) on delete cascade,
  teacher_id  uuid references teachers(id) on delete set null,
  approved    boolean not null default false,
  feedback    text,
  points      integer not null default 1,
  created_at  timestamptz not null default now()
);
alter table reviews enable row level security;
create policy "staff manage reviews" on reviews for all using (is_staff());

-- ─── Points ──────────────────────────────────────────────────
create table if not exists points (
  id          uuid primary key default uuid_generate_v4(),
  student_id  uuid references students(id) on delete cascade,
  points      integer not null,
  point_type  text not null,
  description text,
  awarded_by  text,
  created_at  timestamptz not null default now()
);
alter table points enable row level security;
create policy "public read own points" on points for select using (true);
create policy "public insert points" on points for insert with check (true);
create policy "staff read all points" on points for select using (is_staff());
create policy "staff insert points" on points for insert with check (is_staff());

-- ─── Badges ──────────────────────────────────────────────────
create table if not exists badges (
  id          uuid primary key default uuid_generate_v4(),
  student_id  uuid references students(id) on delete cascade,
  badge_type  text not null,
  earned_at   timestamptz not null default now(),
  unique(student_id, badge_type)
);
alter table badges enable row level security;
create policy "public read own badges" on badges for select using (true);
create policy "public insert badges" on badges for insert with check (true);
create policy "staff manage badges" on badges for all using (is_staff());

-- ─── Notifications ───────────────────────────────────────────
create table if not exists notifications (
  id          uuid primary key default uuid_generate_v4(),
  user_id     text not null,
  user_type   text not null default 'student' check (user_type in ('student','teacher')),
  title       text not null,
  message     text,
  is_read     boolean not null default false,
  created_at  timestamptz not null default now()
);
alter table notifications enable row level security;
create policy "users read own notifications" on notifications for select using (true);
create policy "staff insert notifications" on notifications for insert with check (is_staff());
create policy "users update own notifications" on notifications for update using (true);
