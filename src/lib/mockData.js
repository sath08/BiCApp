// Mock data for development

export const mockStudents = [
  { id: '1', first_name: 'Emma', last_name: 'Johnson', birth_year: 2015, grade: 4, school_name: 'Lincoln Elementary', city: 'Bellevue', state: 'WA', anonymous_id: 'Student G4-011', is_active: true, total_points: 187 },
  { id: '2', first_name: 'Liam', last_name: 'Smith', birth_year: 2014, grade: 5, school_name: 'Roosevelt Elementary', city: 'Bellevue', state: 'WA', anonymous_id: 'Student G5-022', is_active: true, total_points: 243 },
  { id: '3', first_name: 'Sophia', last_name: 'Williams', birth_year: 2013, grade: 6, school_name: 'Bellevue Middle', city: 'Bellevue', state: 'WA', anonymous_id: 'Student G6-033', is_active: true, total_points: 312 },
  { id: '4', first_name: 'Noah', last_name: 'Brown', birth_year: 2016, grade: 3, school_name: 'Lincoln Elementary', city: 'Bellevue', state: 'WA', anonymous_id: 'Student G3-044', is_active: true, total_points: 98 },
  { id: '5', first_name: 'Ava', last_name: 'Davis', birth_year: 2012, grade: 7, school_name: 'Bellevue Middle', city: 'Bellevue', state: 'WA', anonymous_id: 'Student G7-055', is_active: true, total_points: 421 },
  { id: '6', first_name: 'Mason', last_name: 'Wilson', birth_year: 2011, grade: 8, school_name: 'Bellevue Middle', city: 'Bellevue', state: 'WA', anonymous_id: 'Student G8-066', is_active: true, total_points: 156 },
  { id: '7', first_name: 'Isabella', last_name: 'Taylor', birth_year: 2017, grade: 2, school_name: 'Roosevelt Elementary', city: 'Bellevue', state: 'WA', anonymous_id: 'Student G2-077', is_active: true, total_points: 67 },
  { id: '8', first_name: 'Ethan', last_name: 'Anderson', birth_year: 2015, grade: 4, school_name: 'Lincoln Elementary', city: 'Bellevue', state: 'WA', anonymous_id: 'Student G4-088', is_active: true, total_points: 134 },
]

export const mockCurrentStudent = {
  id: '1',
  first_name: 'Emma',
  last_name: 'Johnson',
  birth_year: 2015,
  grade: 4,
  school_name: 'Lincoln Elementary',
  city: 'Bellevue',
  state: 'WA',
  anonymous_id: 'Student G4-011',
  is_active: true,
  total_points: 187,
  reading_streak: 5,
  teacher_name: 'Ms. Rodriguez',
}

export const mockReadingLogs = [
  { id: '1', student_id: '1', date: '2026-06-15', book_title: 'Charlotte\'s Web', author: 'E.B. White', minutes_read: 45, notes: 'Finished chapter 5!', points_earned: 1 },
  { id: '2', student_id: '1', date: '2026-06-14', book_title: 'Charlotte\'s Web', author: 'E.B. White', minutes_read: 35, notes: '', points_earned: 1 },
  { id: '3', student_id: '1', date: '2026-06-13', book_title: 'The BFG', author: 'Roald Dahl', minutes_read: 60, notes: 'So funny!', points_earned: 1 },
  { id: '4', student_id: '1', date: '2026-06-12', book_title: 'The BFG', author: 'Roald Dahl', minutes_read: 30, notes: '', points_earned: 1 },
  { id: '5', student_id: '1', date: '2026-06-11', book_title: 'The BFG', author: 'Roald Dahl', minutes_read: 50, notes: 'Almost done!', points_earned: 1 },
  { id: '6', student_id: '1', date: '2026-06-10', book_title: 'Harry Potter', author: 'J.K. Rowling', minutes_read: 75, notes: '', points_earned: 1 },
  { id: '7', student_id: '1', date: '2026-06-09', book_title: 'Harry Potter', author: 'J.K. Rowling', minutes_read: 45, notes: 'Great chapter!', points_earned: 1 },
]

export const mockEssays = [
  {
    id: '1', student_id: '1', assignment_type: 'weekly', essay_type: 'Book Review',
    book_title: 'Charlotte\'s Web', author: 'E.B. White',
    essay_text: 'Charlotte\'s Web is a beautiful story about friendship and sacrifice. The main character Wilbur the pig is saved by his best friend Charlotte the spider...',
    status: 'approved', submitted_at: '2026-06-10T10:00:00Z',
    review: { strengths_text: 'Great understanding of themes', growth_areas_text: 'Work on paragraph transitions', score_content: 5, score_organization: 4, score_vocabulary: 4, score_grammar: 5, score_critical_thinking: 4, score_creativity: 3 }
  },
  {
    id: '2', student_id: '1', assignment_type: 'monthly', essay_type: 'Character Analysis',
    book_title: 'The BFG', author: 'Roald Dahl',
    essay_text: 'The BFG, or Big Friendly Giant, is one of the most unique characters in children\'s literature...',
    status: 'under_review', submitted_at: '2026-06-13T14:00:00Z',
    review: null
  },
  {
    id: '3', student_id: '1', assignment_type: 'weekly', essay_type: 'Creative Writing',
    book_title: 'Harry Potter', author: 'J.K. Rowling',
    essay_text: 'If I could go to Hogwarts, I would choose to be in Gryffindor because...',
    status: 'revision_requested', submitted_at: '2026-06-08T09:00:00Z',
    review: { strengths_text: 'Very creative ideas!', growth_areas_text: 'Needs more supporting details', score_content: 3, score_organization: 3, score_vocabulary: 4, score_grammar: 3, score_critical_thinking: 3, score_creativity: 5 }
  },
  {
    id: '4', student_id: '1', assignment_type: 'weekly', essay_type: 'Story Summary',
    book_title: 'My Brilliant Friend', author: 'Elena Ferrante',
    essay_text: 'Draft text...',
    status: 'draft', submitted_at: null,
    review: null
  },
]

export const mockBadges = [
  { id: '1', student_id: '1', badge_type: 'streak_3', earned_at: '2026-06-12T00:00:00Z' },
  { id: '2', student_id: '1', badge_type: 'first_book', earned_at: '2026-06-05T00:00:00Z' },
  { id: '3', student_id: '1', badge_type: 'first_essay', earned_at: '2026-06-08T00:00:00Z' },
  { id: '4', student_id: '1', badge_type: 'creative_writer', earned_at: '2026-06-08T00:00:00Z' },
  { id: '5', student_id: '1', badge_type: 'streak_7', earned_at: '2026-06-15T00:00:00Z' },
]

export const mockTeachers = [
  { id: 't1', email: 'rodriguez@bic.edu', full_name: 'Ms. Rodriguez', is_active: true, student_count: 12, pending_reviews: 3 },
  { id: 't2', email: 'chen@bic.edu', full_name: 'Mr. Chen', is_active: true, student_count: 10, pending_reviews: 5 },
  { id: 't3', email: 'patel@bic.edu', full_name: 'Ms. Patel', is_active: true, student_count: 8, pending_reviews: 1 },
]

export const mockAssignments = [
  { id: 'a1', title: 'Weekly Book Review', type: 'weekly', prompt_text: 'Write a review of a book you read this week. Include the title, author, and your opinion.', due_date: '2026-06-20', grade_group: 'all', point_value: 1, is_active: true },
  { id: 'a2', title: 'June Monthly Essay', type: 'monthly', prompt_text: 'Analyze the main character of your current book. How do they change throughout the story?', due_date: '2026-06-30', grade_group: 'all', point_value: 2, is_active: true },
  { id: 'a3', title: 'Creative Story', type: 'weekly', prompt_text: 'Write a creative story inspired by a book you recently read.', due_date: '2026-06-13', grade_group: '1-5', point_value: 1, is_active: false },
]

export const mockPointsLedger = [
  { id: 'p1', student_id: '1', points: 1, point_type: 'reading', description: 'Reading log 2026-06-15', created_at: '2026-06-15T20:00:00Z' },
  { id: 'p2', student_id: '1', points: 1, point_type: 'reading', description: 'Reading log 2026-06-14', created_at: '2026-06-14T20:00:00Z' },
  { id: 'p3', student_id: '1', points: 2, point_type: 'writing_monthly', description: 'Monthly essay approved', created_at: '2026-06-01T10:00:00Z' },
  { id: 'p4', student_id: '1', points: 1, point_type: 'enrollment', description: 'Monthly enrollment bonus', created_at: '2026-06-01T00:00:00Z' },
  { id: 'p5', student_id: '1', points: 5, point_type: 'bonus', description: 'Great participation!', awarded_by: 'Ms. Rodriguez', created_at: '2026-05-15T10:00:00Z' },
]

export const mockNotifications = [
  { id: 'n1', user_type: 'student', user_id: '1', title: 'Essay Feedback Ready! 📝', message: 'Ms. Rodriguez has reviewed your Character Analysis essay.', is_read: false, created_at: '2026-06-15T14:00:00Z' },
  { id: 'n2', user_type: 'student', user_id: '1', title: 'New Badge Earned! 🏅', message: 'You earned the 7-Day Reader badge!', is_read: false, created_at: '2026-06-15T00:00:00Z' },
  { id: 'n3', user_type: 'student', user_id: '1', title: 'Weekly Assignment Due Soon ⏰', message: 'Your weekly writing assignment is due Friday.', is_read: true, created_at: '2026-06-14T09:00:00Z' },
]

export const mockLeaderboard = [
  { anonymous_id: 'Student G7-055', grade: 7, total_points: 421, reading_points: 180, writing_points: 241, streak: 22, rank: 1 },
  { anonymous_id: 'Student G6-033', grade: 6, total_points: 312, reading_points: 145, writing_points: 167, streak: 15, rank: 2 },
  { anonymous_id: 'Student G5-022', grade: 5, total_points: 243, reading_points: 110, writing_points: 133, streak: 10, rank: 3 },
  { anonymous_id: 'Student G4-011', grade: 4, total_points: 187, reading_points: 95, writing_points: 92, streak: 5, rank: 4, isCurrentUser: true },
  { anonymous_id: 'Student G8-066', grade: 8, total_points: 156, reading_points: 80, writing_points: 76, streak: 8, rank: 5 },
  { anonymous_id: 'Student G4-088', grade: 4, total_points: 134, reading_points: 65, writing_points: 69, streak: 3, rank: 6 },
  { anonymous_id: 'Student G3-044', grade: 3, total_points: 98, reading_points: 55, writing_points: 43, streak: 4, rank: 7 },
  { anonymous_id: 'Student G2-077', grade: 2, total_points: 67, reading_points: 40, writing_points: 27, streak: 2, rank: 8 },
]

export const mockPendingReviews = [
  {
    id: 'r1', student_anonymous_id: 'Student G4-011', student_name: 'Emma Johnson',
    essay_type: 'Character Analysis', book_title: 'The BFG', author: 'Roald Dahl',
    assignment_type: 'monthly', submitted_at: '2026-06-13T14:00:00Z',
    essay_text: `The BFG, or Big Friendly Giant, is one of the most unique and memorable characters in all of children's literature. Created by the brilliant author Roald Dahl, the BFG stands out from other giants because of his kind heart and gentle nature.

Unlike the other giants in the story who eat children (or "human beans" as the BFG calls them), the BFG only eats disgusting snozzcumbers and drinks frobscottle. This shows his moral character right from the start - he refuses to hurt others even when it would be easier to follow the crowd.

The BFG's relationship with Sophie is the heart of the story. When he catches Sophie watching him from her bedroom window, instead of eating her, he takes her back to Giant Country to protect her secret. This act of kindness shows that the BFG values friendship over self-interest.

What makes the BFG especially interesting is his way of speaking. He uses funny mixed-up words like "whizzpopping" and "scrumdiddlyumptious." At first this seems funny, but it also shows that the BFG is self-conscious about not having gone to school. Sophie helps him by teaching him to read and write better, and the BFG grows as a character because of this.

By the end of the story, the BFG has gone from living alone and being bullied by other giants to being celebrated as a hero who helped save children's lives. His character arc shows that being different and kind is something to be proud of, not ashamed of.`,
    status: 'submitted',
  },
  {
    id: 'r2', student_anonymous_id: 'Student G5-022', student_name: 'Liam Smith',
    essay_type: 'Book Review', book_title: 'Wonder', author: 'R.J. Palacio',
    assignment_type: 'weekly', submitted_at: '2026-06-14T10:00:00Z',
    essay_text: `Wonder by R.J. Palacio is one of the most touching books I have ever read. It tells the story of August Pullman, a boy born with a facial difference who goes to school for the first time in fifth grade.

The book is told from multiple perspectives, which I thought was really clever. We get to see how different characters view August and his situation, and it helps us understand that everyone has their own struggles.

My favorite part was when August's sister Via talks about how hard it was for her growing up with a sibling who needed so much attention. It made me think about how we sometimes forget to notice the people around us who might be struggling quietly.

The message of the book is "choose kind," and I think it's a really important lesson for everyone, not just kids. The book made me think about times when I might not have been as kind as I could have been.

I would recommend this book to everyone in grades 4 and up. It's funny, sad, and hopeful all at the same time. I gave it 5 stars!`,
    status: 'submitted',
  },
]

export const mockWeeklyStats = [
  { day: 'Mon', minutes: 45 },
  { day: 'Tue', minutes: 35 },
  { day: 'Wed', minutes: 60 },
  { day: 'Thu', minutes: 30 },
  { day: 'Fri', minutes: 50 },
  { day: 'Sat', minutes: 75 },
  { day: 'Sun', minutes: 0 },
]
