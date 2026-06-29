-- ============================================================
-- BiCApp Seed Data
-- 1. Go to Authentication > Users in the Supabase dashboard
--    and create these 4 staff accounts manually, then copy
--    the UUIDs they're assigned into the teachers INSERT below.
--
-- Accounts to create:
--   rodriguez@bic.edu  / password  (role: teacher)
--   chen@bic.edu       / password  (role: teacher)
--   patel@bic.edu      / password  (role: teacher)
--   admin@bic.edu      / password  (role: coordinator)
--
-- 2. Then run this entire file in the SQL Editor.
-- ============================================================

-- ─── Teachers ── replace UUIDs after creating auth users ────
-- You MUST update these UUIDs to match the ones Supabase assigned.
-- Example: after creating rodriguez@bic.edu, copy its User UID here.

do $$
declare
  uid_rodriguez uuid;
  uid_chen      uuid;
  uid_patel     uuid;
  uid_admin     uuid;
begin
  select id into uid_rodriguez from auth.users where email = 'rodriguez@bic.edu';
  select id into uid_chen      from auth.users where email = 'chen@bic.edu';
  select id into uid_patel     from auth.users where email = 'patel@bic.edu';
  select id into uid_admin     from auth.users where email = 'admin@bic.edu';

  insert into teachers (id, first_name, last_name, email, role, assigned_grades, is_active) values
    (uid_rodriguez, 'Maria',   'Rodriguez', 'rodriguez@bic.edu', 'teacher',     '{3,4,5}', true),
    (uid_chen,      'James',   'Chen',      'chen@bic.edu',      'teacher',     '{6,7}',   true),
    (uid_patel,     'Priya',   'Patel',     'patel@bic.edu',     'teacher',     '{7,8}',   true),
    (uid_admin,     'Program', 'Admin',     'admin@bic.edu',     'coordinator', null,      true)
  on conflict (id) do nothing;
end $$;

-- ─── Students ────────────────────────────────────────────────
insert into students (id, first_name, last_name, birth_year, grade, school_name, anonymous_id, total_points, reading_streak, is_active) values
  ('11111111-0000-0000-0000-000000000001', 'Emma',     'Johnson',  2015, 4, 'Lincoln Elementary',   'Student G4-011', 187,  5, true),
  ('11111111-0000-0000-0000-000000000002', 'Liam',     'Smith',    2014, 5, 'Roosevelt Elementary', 'Student G5-022', 243,  3, true),
  ('11111111-0000-0000-0000-000000000003', 'Sophia',   'Williams', 2013, 6, 'Bellevue Middle',      'Student G6-033', 312,  7, true),
  ('11111111-0000-0000-0000-000000000004', 'Noah',     'Brown',    2016, 3, 'Lincoln Elementary',   'Student G3-044', 98,   1, true),
  ('11111111-0000-0000-0000-000000000005', 'Ava',      'Davis',    2012, 7, 'Bellevue Middle',      'Student G7-055', 421, 12, true),
  ('11111111-0000-0000-0000-000000000006', 'Mason',    'Wilson',   2011, 8, 'Bellevue Middle',      'Student G8-066', 156,  2, true),
  ('11111111-0000-0000-0000-000000000007', 'Isabella', 'Taylor',   2017, 2, 'Roosevelt Elementary', 'Student G2-077', 67,   4, true),
  ('11111111-0000-0000-0000-000000000008', 'Ethan',    'Anderson', 2015, 4, 'Lincoln Elementary',   'Student G4-088', 134,  6, true)
on conflict (id) do nothing;

-- ─── Student ↔ Teacher Assignments ──────────────────────────
do $$
declare
  uid_rodriguez uuid;
  uid_chen      uuid;
  uid_patel     uuid;
begin
  select id into uid_rodriguez from auth.users where email = 'rodriguez@bic.edu';
  select id into uid_chen      from auth.users where email = 'chen@bic.edu';
  select id into uid_patel     from auth.users where email = 'patel@bic.edu';

  insert into student_teacher_assignments (student_id, teacher_id) values
    ('11111111-0000-0000-0000-000000000001', uid_rodriguez),
    ('11111111-0000-0000-0000-000000000002', uid_rodriguez),
    ('11111111-0000-0000-0000-000000000004', uid_rodriguez),
    ('11111111-0000-0000-0000-000000000008', uid_rodriguez),
    ('11111111-0000-0000-0000-000000000003', uid_chen),
    ('11111111-0000-0000-0000-000000000006', uid_chen),
    ('11111111-0000-0000-0000-000000000005', uid_patel),
    ('11111111-0000-0000-0000-000000000007', uid_patel)
  on conflict do nothing;
end $$;

-- ─── Reading Logs (Emma - student 1) ─────────────────────────
insert into reading_logs (student_id, date, book_title, author, minutes_read, pages_read, notes, points_earned) values
  ('11111111-0000-0000-0000-000000000001', '2026-06-15', 'Charlotte''s Web',  'E.B. White',    45, 18, 'Finished chapter 5!', 1),
  ('11111111-0000-0000-0000-000000000001', '2026-06-14', 'Charlotte''s Web',  'E.B. White',    35, 14, '',                    1),
  ('11111111-0000-0000-0000-000000000001', '2026-06-13', 'The BFG',           'Roald Dahl',    60, 22, 'So funny!',           1),
  ('11111111-0000-0000-0000-000000000001', '2026-06-12', 'The BFG',           'Roald Dahl',    30, 10, '',                    1),
  ('11111111-0000-0000-0000-000000000001', '2026-06-11', 'The BFG',           'Roald Dahl',    50, 20, 'Almost done!',        1),
  ('11111111-0000-0000-0000-000000000001', '2026-06-10', 'Harry Potter',      'J.K. Rowling',  75, 30, '',                    1),
  ('11111111-0000-0000-0000-000000000001', '2026-06-09', 'Harry Potter',      'J.K. Rowling',  45, 18, 'Great chapter!',      1),
  -- Other students
  ('11111111-0000-0000-0000-000000000002', '2026-06-15', 'Percy Jackson',     'Rick Riordan',  50, 20, 'Amazing!',            1),
  ('11111111-0000-0000-0000-000000000003', '2026-06-15', 'The Giver',         'Lois Lowry',    55, 22, 'Very thought-provoking', 1),
  ('11111111-0000-0000-0000-000000000005', '2026-06-15', 'Narnia',            'C.S. Lewis',    65, 26, '',                    1)
on conflict do nothing;

-- ─── Writing Assignments ─────────────────────────────────────
insert into writing_assignments (id, title, description, type, due_date, points_reward, is_active) values
  ('aaaaaaaa-0000-0000-0000-000000000001', 'Weekly Book Review',
   'Write a review of a book you read this week. Include the title, author, and your opinion.',
   'writing_prompt', '2026-06-27', 10, true),
  ('aaaaaaaa-0000-0000-0000-000000000002', 'June Monthly Essay',
   'Analyze the main character of your current book. How do they change throughout the story?',
   'writing_prompt', '2026-06-30', 20, true),
  ('aaaaaaaa-0000-0000-0000-000000000003', 'Creative Story',
   'Write a creative story inspired by a book you recently read.',
   'writing_prompt', '2026-06-13', 10, false)
on conflict (id) do nothing;

-- ─── Essays ──────────────────────────────────────────────────
insert into essays (id, student_id, title, body, status, feedback) values
  ('bbbbbbbb-0000-0000-0000-000000000001',
   '11111111-0000-0000-0000-000000000001',
   'Charlotte''s Web Review',
   'Charlotte''s Web is a beautiful story about friendship and sacrifice. The main character Wilbur the pig is saved by his best friend Charlotte the spider who weaves messages in her web to make Wilbur seem extraordinary. I loved this book because it teaches us that true friends support each other no matter what.',
   'approved',
   'Great understanding of themes! Work on paragraph transitions next time.'),
  ('bbbbbbbb-0000-0000-0000-000000000002',
   '11111111-0000-0000-0000-000000000001',
   'The BFG Character Analysis',
   'The BFG, or Big Friendly Giant, is one of the most unique characters in children''s literature. Unlike other giants who eat humans, the BFG only eats "snozzcumbers" and collects good dreams to give to children. He shows us that being different is something to be proud of.',
   'pending',
   null),
  ('bbbbbbbb-0000-0000-0000-000000000003',
   '11111111-0000-0000-0000-000000000001',
   'My Hogwarts Adventure',
   'If I could go to Hogwarts, I would choose to be in Gryffindor because I want to be brave like Harry Potter. I would take Care of Magical Creatures and Potions classes.',
   'needs_revision',
   'Very creative ideas! Needs more supporting details and longer paragraphs.')
on conflict (id) do nothing;

-- ─── Points ──────────────────────────────────────────────────
insert into points (student_id, points, point_type, description) values
  ('11111111-0000-0000-0000-000000000001', 1, 'reading',    'Reading log 2026-06-15'),
  ('11111111-0000-0000-0000-000000000001', 1, 'reading',    'Reading log 2026-06-14'),
  ('11111111-0000-0000-0000-000000000001', 1, 'reading',    'Reading log 2026-06-13'),
  ('11111111-0000-0000-0000-000000000001', 1, 'reading',    'Reading log 2026-06-12'),
  ('11111111-0000-0000-0000-000000000001', 1, 'reading',    'Reading log 2026-06-11'),
  ('11111111-0000-0000-0000-000000000001', 1, 'reading',    'Reading log 2026-06-10'),
  ('11111111-0000-0000-0000-000000000001', 1, 'reading',    'Reading log 2026-06-09'),
  ('11111111-0000-0000-0000-000000000001', 2, 'writing',    'Essay approved'),
  ('11111111-0000-0000-0000-000000000001', 1, 'enrollment', 'Monthly enrollment bonus'),
  ('11111111-0000-0000-0000-000000000001', 5, 'bonus',      'Great participation!'),
  ('11111111-0000-0000-0000-000000000002', 1, 'reading',    'Reading log 2026-06-15'),
  ('11111111-0000-0000-0000-000000000003', 1, 'reading',    'Reading log 2026-06-15'),
  ('11111111-0000-0000-0000-000000000005', 1, 'reading',    'Reading log 2026-06-15');

-- ─── Badges ──────────────────────────────────────────────────
insert into badges (student_id, badge_type) values
  ('11111111-0000-0000-0000-000000000001', 'streak_3'),
  ('11111111-0000-0000-0000-000000000001', 'first_book'),
  ('11111111-0000-0000-0000-000000000001', 'first_essay'),
  ('11111111-0000-0000-0000-000000000001', 'creative_writer'),
  ('11111111-0000-0000-0000-000000000001', 'streak_7'),
  ('11111111-0000-0000-0000-000000000003', 'streak_7'),
  ('11111111-0000-0000-0000-000000000005', 'streak_7')
on conflict do nothing;

-- ─── Notifications ───────────────────────────────────────────
insert into notifications (user_id, user_type, title, message, is_read) values
  ('11111111-0000-0000-0000-000000000001', 'student', 'Essay Feedback Ready!',
   'Ms. Rodriguez has reviewed your Charlotte''s Web essay. Check it out!', false),
  ('11111111-0000-0000-0000-000000000001', 'student', 'Keep up the streak!',
   'You''re on a 5-day reading streak. Keep going!', true);
