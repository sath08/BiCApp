-- Bellevue Reading & Writing Champions - Database Schema
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- STUDENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE,
  birth_year INTEGER NOT NULL,
  grade INTEGER NOT NULL CHECK (grade BETWEEN 1 AND 8),
  school_name TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Bellevue',
  state TEXT NOT NULL DEFAULT 'WA',
  phone TEXT,
  email TEXT,
  bic_student_id TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  anonymous_id TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- GUARDIANS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS guardians (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  relationship TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- USERS TABLE (teachers and coordinators)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY, -- matches Supabase Auth uid
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('teacher', 'coordinator')),
  full_name TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- STUDENT-TEACHER ASSIGNMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS student_teacher_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(student_id, teacher_id)
);

-- ============================================================
-- READING LOGS
-- ============================================================
CREATE TABLE IF NOT EXISTS reading_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  book_title TEXT NOT NULL,
  author TEXT NOT NULL,
  minutes_read INTEGER NOT NULL CHECK (minutes_read BETWEEN 1 AND 1000),
  notes TEXT,
  points_earned INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(student_id, date) -- one log per day per student
);

-- ============================================================
-- WRITING ASSIGNMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS writing_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('weekly', 'monthly')),
  prompt_text TEXT NOT NULL,
  due_date DATE,
  grade_group TEXT NOT NULL DEFAULT 'all' CHECK (grade_group IN ('1-5', '6-8', 'all')),
  point_value INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ESSAY SUBMISSIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS essay_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  assignment_id UUID REFERENCES writing_assignments(id),
  assignment_type TEXT NOT NULL CHECK (assignment_type IN ('weekly', 'monthly')),
  essay_type TEXT NOT NULL,
  book_title TEXT NOT NULL,
  author TEXT NOT NULL,
  essay_text TEXT NOT NULL,
  file_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'under_review', 'revision_requested', 'editing', 'approved')),
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ESSAY REVIEWS
-- ============================================================
CREATE TABLE IF NOT EXISTS essay_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id UUID NOT NULL REFERENCES essay_submissions(id) ON DELETE CASCADE UNIQUE,
  teacher_id UUID NOT NULL REFERENCES users(id),
  score_content INTEGER CHECK (score_content BETWEEN 1 AND 5),
  score_organization INTEGER CHECK (score_organization BETWEEN 1 AND 5),
  score_vocabulary INTEGER CHECK (score_vocabulary BETWEEN 1 AND 5),
  score_grammar INTEGER CHECK (score_grammar BETWEEN 1 AND 5),
  score_critical_thinking INTEGER CHECK (score_critical_thinking BETWEEN 1 AND 5),
  score_creativity INTEGER CHECK (score_creativity BETWEEN 1 AND 5),
  strengths_text TEXT,
  growth_areas_text TEXT,
  feedback_text TEXT,
  annotations JSONB DEFAULT '[]',
  review_start_time TIMESTAMPTZ,
  review_completion_time TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- POINTS LEDGER
-- ============================================================
CREATE TABLE IF NOT EXISTS points_ledger (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  points INTEGER NOT NULL,
  point_type TEXT NOT NULL CHECK (point_type IN ('reading', 'writing_weekly', 'writing_monthly', 'enrollment', 'bonus')),
  description TEXT NOT NULL,
  awarded_by UUID REFERENCES users(id),
  source_id UUID, -- FK to reading_log or essay_submission
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- BADGES
-- ============================================================
CREATE TABLE IF NOT EXISTS badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  badge_type TEXT NOT NULL,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(student_id, badge_type)
);

-- ============================================================
-- RECOGNITION THRESHOLDS
-- ============================================================
CREATE TABLE IF NOT EXISTS recognition_thresholds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  level_name TEXT NOT NULL UNIQUE,
  min_points INTEGER NOT NULL,
  max_points INTEGER,
  display_order INTEGER NOT NULL
);

INSERT INTO recognition_thresholds (level_name, min_points, max_points, display_order) VALUES
  ('Story Explorer', 25, 74, 1),
  ('Chapter Adventurer', 75, 149, 2),
  ('Book Voyager', 150, 249, 3),
  ('Novel Navigator', 250, 399, 4),
  ('Future Novelist', 400, NULL, 5)
ON CONFLICT (level_name) DO NOTHING;

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_type TEXT NOT NULL CHECK (user_type IN ('student', 'teacher', 'coordinator')),
  user_id UUID NOT NULL, -- student id or user id
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- MONTHLY ESSAY PROMPTS
-- ============================================================
CREATE TABLE IF NOT EXISTS monthly_essay_prompts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  prompt_text TEXT NOT NULL,
  month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
  year INTEGER NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_teacher_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE writing_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE essay_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE essay_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE points_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_essay_prompts ENABLE ROW LEVEL SECURITY;

-- Users can read their own record
CREATE POLICY "Users can view own record" ON users
  FOR SELECT USING (auth.uid() = id);

-- Coordinators can do everything on users
CREATE POLICY "Coordinators manage users" ON users
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'coordinator')
  );

-- Students: coordinators and assigned teachers can view
CREATE POLICY "Staff can view students" ON students
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Coordinators manage students" ON students
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'coordinator')
  );

-- Reading logs: anyone logged in can insert their own (custom auth); staff can view
CREATE POLICY "Staff can view reading logs" ON reading_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Coordinators manage reading logs" ON reading_logs
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'coordinator')
  );

-- Essay submissions: teachers can view their assigned students; coordinators see all
CREATE POLICY "Teachers can view assigned student essays" ON essay_submissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users u
      JOIN student_teacher_assignments sta ON sta.teacher_id = u.id
      WHERE u.id = auth.uid() AND sta.student_id = essay_submissions.student_id
    ) OR
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'coordinator')
  );

-- Essay reviews: teachers manage their own reviews
CREATE POLICY "Teachers manage own reviews" ON essay_reviews
  FOR ALL USING (
    teacher_id = auth.uid() OR
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'coordinator')
  );

-- Points ledger: staff can view all
CREATE POLICY "Staff view points" ON points_ledger
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Coordinators manage points" ON points_ledger
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'coordinator')
  );

-- Writing assignments: all staff can view; coordinators manage
CREATE POLICY "Staff view assignments" ON writing_assignments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Coordinators manage assignments" ON writing_assignments
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'coordinator')
  );

-- Notifications: users see their own
CREATE POLICY "Users see own notifications" ON notifications
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'coordinator')
  );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_reading_logs_student ON reading_logs(student_id);
CREATE INDEX IF NOT EXISTS idx_reading_logs_date ON reading_logs(date);
CREATE INDEX IF NOT EXISTS idx_essays_student ON essay_submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_essays_status ON essay_submissions(status);
CREATE INDEX IF NOT EXISTS idx_points_student ON points_ledger(student_id);
CREATE INDEX IF NOT EXISTS idx_badges_student ON badges(student_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_assignments_teacher ON student_teacher_assignments(teacher_id);
