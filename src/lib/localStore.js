// Local data store backed by localStorage. Drop-in replacement for Supabase queries.
// All data persists across page reloads. Replace individual functions with Supabase calls later.

import { mockStudents, mockTeachers, mockReadingLogs, mockEssays, mockBadges,
  mockPointsLedger, mockNotifications, mockAssignments, mockPendingReviews, mockLeaderboard } from './mockData'

const KEYS = {
  students: 'bic_students',
  guardians: 'bic_guardians',
  teachers: 'bic_teachers',
  teacherAccounts: 'bic_teacher_accounts',
  assignments: 'bic_student_teacher_assignments',
  readingLogs: 'bic_reading_logs',
  essays: 'bic_essays',
  reviews: 'bic_reviews',
  points: 'bic_points',
  badges: 'bic_badges',
  notifications: 'bic_notifications',
  writingAssignments: 'bic_writing_assignments',
}

function read(key) {
  try { return JSON.parse(localStorage.getItem(key)) } catch { return null }
}
function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}
function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

// ─── Seed / Init ──────────────────────────────────────────────────────────────

export function initStore() {
  if (read(KEYS.students)) return // already seeded

  // Merge streak data from mockLeaderboard into student records
  const streakByAnon = Object.fromEntries(mockLeaderboard.map(e => [e.anonymous_id, e.streak]))
  write(KEYS.students, mockStudents.map(s => ({ ...s, reading_streak: streakByAnon[s.anonymous_id] ?? 0 })))

  write(KEYS.guardians, [
    { id: 'g1', student_id: '1', full_name: 'Sarah Johnson', relationship: 'Mother', phone: '425-555-0101', email: 'sjohnson@email.com', is_primary: true },
    { id: 'g2', student_id: '2', full_name: 'David Smith', relationship: 'Father', phone: '425-555-0102', email: 'dsmith@email.com', is_primary: true },
  ])

  // Teacher user accounts (email → { id, email, password, role, full_name })
  write(KEYS.teacherAccounts, [
    { id: 't1', email: 'rodriguez@bic.edu', password: 'password', role: 'teacher', full_name: 'Ms. Rodriguez', is_active: true },
    { id: 't2', email: 'chen@bic.edu', password: 'password', role: 'teacher', full_name: 'Mr. Chen', is_active: true },
    { id: 't3', email: 'patel@bic.edu', password: 'password', role: 'teacher', full_name: 'Ms. Patel', is_active: true },
    { id: 'admin1', email: 'admin@bic.edu', password: 'password', role: 'coordinator', full_name: 'Program Coordinator', is_active: true },
  ])

  write(KEYS.teachers, mockTeachers)

  // Student → teacher assignments
  write(KEYS.assignments, [
    { id: 'sta1', student_id: '1', teacher_id: 't1', assigned_at: '2026-06-01T00:00:00Z' },
    { id: 'sta2', student_id: '2', teacher_id: 't1', assigned_at: '2026-06-01T00:00:00Z' },
    { id: 'sta3', student_id: '3', teacher_id: 't2', assigned_at: '2026-06-01T00:00:00Z' },
    { id: 'sta4', student_id: '4', teacher_id: 't1', assigned_at: '2026-06-01T00:00:00Z' },
    { id: 'sta5', student_id: '5', teacher_id: 't3', assigned_at: '2026-06-01T00:00:00Z' },
    { id: 'sta6', student_id: '6', teacher_id: 't2', assigned_at: '2026-06-01T00:00:00Z' },
    { id: 'sta7', student_id: '7', teacher_id: 't3', assigned_at: '2026-06-01T00:00:00Z' },
    { id: 'sta8', student_id: '8', teacher_id: 't1', assigned_at: '2026-06-01T00:00:00Z' },
  ])

  write(KEYS.readingLogs, mockReadingLogs)

  // Merge essay reviews into essay objects for storage
  write(KEYS.essays, mockEssays)

  // Store reviews separately too
  write(KEYS.reviews, mockPendingReviews.map(r => ({
    id: 'rev_' + r.id,
    submission_id: r.id,
    teacher_id: 't1',
    essay_type: r.essay_type,
    book_title: r.book_title,
    student_name: r.student_name,
    student_anonymous_id: r.student_anonymous_id,
    assignment_type: r.assignment_type,
    submitted_at: r.submitted_at,
    essay_text: r.essay_text,
    status: r.status,
    review_start_time: null,
    review_completion_time: null,
  })))

  // Seed points ledger: use mockLeaderboard breakdown for each student
  const studentIdByAnon = Object.fromEntries(mockStudents.map(s => [s.anonymous_id, s.id]))
  const seededLedger = [...mockPointsLedger]
  let pIdx = mockPointsLedger.length + 1
  for (const entry of mockLeaderboard) {
    const sid = studentIdByAnon[entry.anonymous_id]
    if (!sid || sid === '1') continue // student 1 already has real ledger entries
    if (entry.reading_points > 0) seededLedger.push({ id: `ps${pIdx++}`, student_id: sid, points: entry.reading_points, point_type: 'reading', description: 'Reading sessions', created_at: '2026-06-01T00:00:00Z' })
    if (entry.writing_points > 0) seededLedger.push({ id: `ps${pIdx++}`, student_id: sid, points: entry.writing_points, point_type: 'writing_monthly', description: 'Writing assignments', created_at: '2026-06-01T00:00:00Z' })
  }
  write(KEYS.points, seededLedger)
  write(KEYS.badges, mockBadges)
  write(KEYS.notifications, mockNotifications)
  write(KEYS.writingAssignments, mockAssignments)
}

// ─── Students ─────────────────────────────────────────────────────────────────

export function getStudents() {
  return read(KEYS.students) || []
}

export function getStudentById(id) {
  return getStudents().find(s => s.id === id) || null
}

export function findStudentByLogin(firstName, lastName, birthYear) {
  return getStudents().find(s =>
    s.first_name.toLowerCase() === firstName.toLowerCase() &&
    s.last_name.toLowerCase() === lastName.toLowerCase() &&
    String(s.birth_year) === String(birthYear) &&
    s.is_active
  ) || null
}

export function addStudent(studentData) {
  const students = getStudents()
  const grade = parseInt(studentData.grade)
  const gradeGroup = grade <= 5 ? '1-5' : '6-8'
  const gradeStudents = students.filter(s => s.grade === grade)
  const seq = String(gradeStudents.length + 1).padStart(3, '0')
  const dob = new Date(studentData.date_of_birth)
  const newStudent = {
    id: uid(),
    first_name: studentData.first_name,
    last_name: studentData.last_name,
    date_of_birth: studentData.date_of_birth,
    birth_year: dob.getFullYear(),
    grade,
    grade_group: gradeGroup,
    school_name: studentData.school_name,
    city: studentData.city,
    state: studentData.state,
    phone: studentData.phone || null,
    email: studentData.email || null,
    bic_student_id: studentData.bic_student_id || null,
    anonymous_id: `Student G${grade}-${seq}`,
    is_active: true,
    total_points: 0,
    reading_streak: 0,
    created_at: new Date().toISOString(),
  }
  write(KEYS.students, [...students, newStudent])

  // Save guardians
  const guardians = read(KEYS.guardians) || []
  guardians.push({
    id: uid(), student_id: newStudent.id,
    full_name: studentData.guardian1_name,
    relationship: studentData.guardian1_relationship,
    phone: studentData.guardian1_phone,
    email: studentData.guardian1_email,
    is_primary: true,
  })
  if (studentData.guardian2_name) {
    guardians.push({
      id: uid(), student_id: newStudent.id,
      full_name: studentData.guardian2_name,
      relationship: studentData.guardian2_relationship || '',
      phone: studentData.guardian2_phone || '',
      email: studentData.guardian2_email || '',
      is_primary: false,
    })
  }
  write(KEYS.guardians, guardians)

  return newStudent
}

export function updateStudent(id, updates) {
  const students = getStudents().map(s => s.id === id ? { ...s, ...updates } : s)
  write(KEYS.students, students)
  return students.find(s => s.id === id)
}

export function deactivateStudent(id) {
  return updateStudent(id, { is_active: false })
}

export function getGuardiansForStudent(studentId) {
  return (read(KEYS.guardians) || []).filter(g => g.student_id === studentId)
}

// ─── Teacher Accounts (auth) ──────────────────────────────────────────────────

export function getTeacherAccounts() {
  return read(KEYS.teacherAccounts) || []
}

export function findTeacherAccount(email, password) {
  return getTeacherAccounts().find(a =>
    a.email.toLowerCase() === email.toLowerCase() &&
    a.password === password &&
    a.is_active
  ) || null
}

export function addTeacherAccount(data) {
  const accounts = getTeacherAccounts()
  const teachers = getTeachers()
  const newAccount = {
    id: uid(),
    email: data.email,
    password: data.password || 'password',
    role: data.role || 'teacher',
    full_name: data.full_name,
    is_active: true,
  }
  write(KEYS.teacherAccounts, [...accounts, newAccount])
  const newTeacher = {
    id: newAccount.id,
    email: data.email,
    full_name: data.full_name,
    is_active: true,
    student_count: 0,
    pending_reviews: 0,
  }
  write(KEYS.teachers, [...teachers, newTeacher])
  return newAccount
}

// ─── Teachers ─────────────────────────────────────────────────────────────────

export function getTeachers() {
  return read(KEYS.teachers) || []
}

export function updateTeacher(id, updates) {
  const teachers = getTeachers().map(t => t.id === id ? { ...t, ...updates } : t)
  write(KEYS.teachers, teachers)
}

export function deactivateTeacher(id) {
  updateTeacher(id, { is_active: false })
  const accounts = getTeacherAccounts().map(a => a.id === id ? { ...a, is_active: false } : a)
  write(KEYS.teacherAccounts, accounts)
}

// ─── Student-Teacher Assignments ──────────────────────────────────────────────

export function getStudentAssignments() {
  return read(KEYS.assignments) || []
}

export function getTeacherForStudent(studentId) {
  const assignment = getStudentAssignments().find(a => a.student_id === studentId)
  if (!assignment) return null
  return getTeachers().find(t => t.id === assignment.teacher_id) || null
}

export function getStudentsForTeacher(teacherId) {
  const assignedIds = getStudentAssignments()
    .filter(a => a.teacher_id === teacherId)
    .map(a => a.student_id)
  return getStudents().filter(s => assignedIds.includes(s.id))
}

export function assignStudentToTeacher(studentId, teacherId) {
  const assignments = getStudentAssignments().filter(a => a.student_id !== studentId)
  assignments.push({ id: uid(), student_id: studentId, teacher_id: teacherId, assigned_at: new Date().toISOString() })
  write(KEYS.assignments, assignments)
}

// ─── Reading Logs ─────────────────────────────────────────────────────────────

export function getReadingLogs(studentId) {
  const all = read(KEYS.readingLogs) || []
  return all.filter(l => l.student_id === studentId).sort((a, b) => b.date.localeCompare(a.date))
}

export function addReadingLog(studentId, data, grade) {
  const minMinutes = parseInt(grade) <= 5 ? 30 : 45
  const pointsEarned = data.minutes_read >= minMinutes ? 1 : 0
  const log = {
    id: uid(),
    student_id: studentId,
    date: data.date,
    book_title: data.book_title,
    author: data.author,
    minutes_read: parseInt(data.minutes_read),
    notes: data.notes || '',
    points_earned: pointsEarned,
    created_at: new Date().toISOString(),
  }
  const all = read(KEYS.readingLogs) || []
  write(KEYS.readingLogs, [log, ...all])

  if (pointsEarned > 0) {
    addPoints(studentId, 1, 'reading', `Reading log ${data.date}`)
    checkAndAwardStreakBadges(studentId)
  }

  updateStudentPoints(studentId)
  updateReadingStreak(studentId)
  return log
}

function updateReadingStreak(studentId) {
  const logs = getReadingLogs(studentId)
  const dates = [...new Set(logs.map(l => l.date))].sort().reverse()
  let streak = 0
  let prev = null
  for (const d of dates) {
    const curr = new Date(d)
    if (prev === null) {
      streak = 1
    } else {
      const diff = (prev - curr) / (1000 * 60 * 60 * 24)
      if (diff === 1) streak++
      else break
    }
    prev = curr
  }
  updateStudent(studentId, { reading_streak: streak })
}

function checkAndAwardStreakBadges(studentId) {
  const student = getStudentById(studentId)
  const streak = student?.reading_streak || 0
  const thresholds = [
    { days: 3, type: 'streak_3' },
    { days: 7, type: 'streak_7' },
    { days: 30, type: 'streak_30' },
    { days: 100, type: 'streak_100' },
  ]
  for (const t of thresholds) {
    if (streak >= t.days) awardBadgeIfNew(studentId, t.type)
  }
}

// ─── Essays ───────────────────────────────────────────────────────────────────

export function getEssays(studentId) {
  const all = read(KEYS.essays) || []
  return all.filter(e => e.student_id === studentId).sort((a, b) =>
    (b.submitted_at || b.created_at || '').localeCompare(a.submitted_at || a.created_at || '')
  )
}

export function getEssayById(id) {
  return (read(KEYS.essays) || []).find(e => e.id === id) || null
}

export function getAllEssays() {
  return read(KEYS.essays) || []
}

export function addEssay(studentId, data, asDraft = false) {
  const all = read(KEYS.essays) || []
  const essay = {
    id: uid(),
    student_id: studentId,
    assignment_type: data.assignment_type,
    essay_type: data.essay_type || null,
    book_title: data.book_title || null,
    author: data.author || null,
    essay_text: data.essay_text,
    file_url: null,
    status: asDraft ? 'draft' : 'submitted',
    submitted_at: asDraft ? null : new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    review: null,
  }
  write(KEYS.essays, [essay, ...all])

  if (!asDraft) {
    awardBadgeIfNew(studentId, 'first_essay')
    addNotificationForTeacher(studentId, essay)
    addPoints(studentId, essay.assignment_type === 'monthly' ? 2 : 1, 'writing_weekly', `${essay.assignment_type} essay submitted`)
    updateStudentPoints(studentId)
  }

  return essay
}

export function updateEssay(id, updates) {
  const all = (read(KEYS.essays) || []).map(e =>
    e.id === id ? { ...e, ...updates, updated_at: new Date().toISOString() } : e
  )
  write(KEYS.essays, all)
  return all.find(e => e.id === id)
}

export function submitEssayDraft(id) {
  return updateEssay(id, { status: 'submitted', submitted_at: new Date().toISOString() })
}

// ─── Reviews (teacher queue) ──────────────────────────────────────────────────

export function getPendingReviews(teacherId) {
  // Get all essays that are submitted/under_review for students assigned to this teacher
  const studentIds = getStudentsForTeacher(teacherId).map(s => s.id)
  const allEssays = getAllEssays()
  return allEssays
    .filter(e => studentIds.includes(e.student_id) && ['submitted', 'under_review'].includes(e.status))
    .map(e => {
      const student = getStudentById(e.student_id)
      return {
        ...e,
        student_name: student ? `${student.first_name} ${student.last_name}` : 'Unknown',
        student_anonymous_id: student?.anonymous_id || 'Unknown',
      }
    })
}

export function getCompletedReviews(teacherId) {
  const studentIds = getStudentsForTeacher(teacherId).map(s => s.id)
  const allEssays = getAllEssays()
  return allEssays
    .filter(e => studentIds.includes(e.student_id) && ['approved', 'revision_requested'].includes(e.status))
    .map(e => {
      const student = getStudentById(e.student_id)
      return {
        ...e,
        student_name: student ? `${student.first_name} ${student.last_name}` : 'Unknown',
        student_anonymous_id: student?.anonymous_id || 'Unknown',
      }
    })
}

export function startReview(essayId) {
  updateEssay(essayId, { status: 'under_review', review_start_time: new Date().toISOString() })
}

export function submitReview(essayId, reviewData) {
  const now = new Date().toISOString()
  updateEssay(essayId, {
    status: reviewData.action === 'approve' ? 'approved' : 'revision_requested',
    review_completion_time: now,
    review: {
      score_content: reviewData.score_content,
      score_organization: reviewData.score_organization,
      score_vocabulary: reviewData.score_vocabulary,
      score_grammar: reviewData.score_grammar,
      score_critical_thinking: reviewData.score_critical_thinking,
      score_creativity: reviewData.score_creativity,
      strengths_text: reviewData.strengths_text,
      growth_areas_text: reviewData.growth_areas_text,
      annotations: reviewData.annotations || [],
      reviewed_at: now,
    }
  })

  // Notify student
  const essay = getEssayById(essayId)
  if (essay) {
    const notifs = read(KEYS.notifications) || []
    notifs.unshift({
      id: uid(),
      user_type: 'student',
      user_id: essay.student_id,
      title: reviewData.action === 'approve' ? 'Essay Approved! ✅' : 'Revision Requested 📝',
      message: reviewData.action === 'approve'
        ? `Your ${essay.essay_type || 'essay'} has been approved!`
        : `Your teacher has requested revisions on your ${essay.essay_type || 'essay'}.`,
      is_read: false,
      created_at: now,
    })
    write(KEYS.notifications, notifs)
  }
}

// ─── Points ───────────────────────────────────────────────────────────────────

export function getPoints(studentId) {
  const ledger = (read(KEYS.points) || []).filter(p => p.student_id === studentId)
  const total = ledger.reduce((s, p) => s + p.points, 0)
  return { ledger, total }
}

export function addPoints(studentId, points, type, description, awardedBy = null) {
  const all = read(KEYS.points) || []
  all.unshift({
    id: uid(),
    student_id: studentId,
    points,
    point_type: type,
    description,
    awarded_by: awardedBy,
    created_at: new Date().toISOString(),
  })
  write(KEYS.points, all)
}

export function awardBonusPoints(studentId, points, description, teacherName) {
  addPoints(studentId, points, 'bonus', description, teacherName)
  updateStudentPoints(studentId)
}

function updateStudentPoints(studentId) {
  const { total } = getPoints(studentId)
  updateStudent(studentId, { total_points: total })
}

// ─── Badges ───────────────────────────────────────────────────────────────────

export function getBadges(studentId) {
  return (read(KEYS.badges) || []).filter(b => b.student_id === studentId)
}

export function awardBadgeIfNew(studentId, badgeType) {
  const existing = getBadges(studentId)
  if (existing.some(b => b.badge_type === badgeType)) return null
  const all = read(KEYS.badges) || []
  const badge = { id: uid(), student_id: studentId, badge_type: badgeType, earned_at: new Date().toISOString() }
  write(KEYS.badges, [...all, badge])

  const notifs = read(KEYS.notifications) || []
  notifs.unshift({
    id: uid(), user_type: 'student', user_id: studentId,
    title: 'New Badge Earned! 🏅',
    message: `You earned the ${badgeType.replace(/_/g, ' ')} badge!`,
    is_read: false, created_at: new Date().toISOString(),
  })
  write(KEYS.notifications, notifs)

  return badge
}

// ─── Notifications ────────────────────────────────────────────────────────────

export function getNotifications(userId, userType = 'student') {
  return (read(KEYS.notifications) || [])
    .filter(n => n.user_id === userId && n.user_type === userType)
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
}

export function markNotificationRead(id) {
  const all = (read(KEYS.notifications) || []).map(n => n.id === id ? { ...n, is_read: true } : n)
  write(KEYS.notifications, all)
}

export function markAllNotificationsRead(userId, userType) {
  const all = (read(KEYS.notifications) || []).map(n =>
    n.user_id === userId && n.user_type === userType ? { ...n, is_read: true } : n
  )
  write(KEYS.notifications, all)
}

function addNotificationForTeacher(studentId, essay) {
  const assignment = getStudentAssignments().find(a => a.student_id === studentId)
  if (!assignment) return
  const student = getStudentById(studentId)
  const notifs = read(KEYS.notifications) || []
  notifs.unshift({
    id: uid(), user_type: 'teacher', user_id: assignment.teacher_id,
    title: 'New Essay Submitted 📝',
    message: `${student?.first_name || 'A student'} submitted a ${essay.assignment_type} essay.`,
    is_read: false, created_at: new Date().toISOString(),
  })
  write(KEYS.notifications, notifs)
}

// ─── Writing Assignments ──────────────────────────────────────────────────────

export function getWritingAssignments(activeOnly = false) {
  const all = read(KEYS.writingAssignments) || []
  return activeOnly ? all.filter(a => a.is_active) : all
}

export function addWritingAssignment(data) {
  const all = getWritingAssignments()
  const assignment = {
    id: uid(),
    title: data.title,
    type: data.type,
    prompt_text: data.prompt_text,
    due_date: data.due_date,
    grade_group: data.grade_group || 'all',
    point_value: parseInt(data.point_value) || 1,
    is_active: true,
    created_by: data.created_by || 'admin',
    created_at: new Date().toISOString(),
  }
  write(KEYS.writingAssignments, [...all, assignment])
  return assignment
}

export function updateWritingAssignment(id, updates) {
  const all = getWritingAssignments().map(a => a.id === id ? { ...a, ...updates } : a)
  write(KEYS.writingAssignments, all)
}

export function deleteWritingAssignment(id) {
  write(KEYS.writingAssignments, getWritingAssignments().filter(a => a.id !== id))
}

// ─── Leaderboard ──────────────────────────────────────────────────────────────

export function getLeaderboard(gradeFilter = null, category = 'total') {
  const students = getStudents().filter(s => s.is_active)
  const allPoints = read(KEYS.points) || []
  const allLogs = read(KEYS.readingLogs) || []

  return students
    .filter(s => gradeFilter === null || s.grade === gradeFilter || s.grade_group === gradeFilter)
    .map(s => {
      const sPoints = allPoints.filter(p => p.student_id === s.id)
      const readingPts = sPoints.filter(p => p.point_type === 'reading').reduce((sum, p) => sum + p.points, 0)
      const writingPts = sPoints.filter(p => ['writing_weekly', 'writing_monthly'].includes(p.point_type)).reduce((sum, p) => sum + p.points, 0)
      const totalPts = sPoints.reduce((sum, p) => sum + p.points, 0)
      const streak = s.reading_streak || 0
      return {
        student_id: s.id,
        anonymous_id: s.anonymous_id,
        grade: s.grade,
        total_points: totalPts,
        reading_points: readingPts,
        writing_points: writingPts,
        streak,
      }
    })
    .sort((a, b) => {
      if (category === 'reading') return b.reading_points - a.reading_points
      if (category === 'writing') return b.writing_points - a.writing_points
      if (category === 'streak') return b.streak - a.streak
      return b.total_points - a.total_points
    })
    .map((s, i) => ({ ...s, rank: i + 1 }))
}

// ─── Admin Stats ──────────────────────────────────────────────────────────────

export function getProgramStats() {
  const students = getStudents()
  const essays = getAllEssays()
  const teachers = getTeachers()
  const today = new Date().toISOString().slice(0, 10)
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10)
  const logs = read(KEYS.readingLogs) || []
  const recentLogs = logs.filter(l => l.date >= weekAgo)
  const activeStudents = students.filter(s => s.is_active)

  return {
    total_students: students.length,
    active_students: activeStudents.length,
    pending_reviews: essays.filter(e => ['submitted', 'under_review'].includes(e.status)).length,
    reading_logs_this_week: recentLogs.length,
    total_essays: essays.length,
    approved_essays: essays.filter(e => e.status === 'approved').length,
    teacher_count: teachers.filter(t => t.is_active).length,
  }
}

// ─── Recognition Levels ───────────────────────────────────────────────────────

export const RECOGNITION_LEVELS = [
  { name: 'Story Explorer', minPoints: 0, maxPoints: 74, emoji: '🔍', color: 'text-amber-600', bg: 'bg-amber-50' },
  { name: 'Chapter Adventurer', minPoints: 25, maxPoints: 149, emoji: '⚔️', color: 'text-orange-600', bg: 'bg-orange-50' },
  { name: 'Book Voyager', minPoints: 75, maxPoints: 249, emoji: '⛵', color: 'text-blue-600', bg: 'bg-blue-50' },
  { name: 'Novel Navigator', minPoints: 150, maxPoints: 399, emoji: '🧭', color: 'text-purple-600', bg: 'bg-purple-50' },
  { name: 'Future Novelist', minPoints: 250, maxPoints: null, emoji: '✍️', color: 'text-emerald-600', bg: 'bg-emerald-50' },
]

export function getRecognitionLevel(totalPoints) {
  let current = RECOGNITION_LEVELS[0]
  for (const level of RECOGNITION_LEVELS) {
    if (totalPoints >= level.minPoints) current = level
  }
  const nextIdx = RECOGNITION_LEVELS.indexOf(current) + 1
  const next = RECOGNITION_LEVELS[nextIdx] || null
  const progressToNext = next
    ? Math.min(100, Math.round(((totalPoints - current.minPoints) / (next.minPoints - current.minPoints)) * 100))
    : 100
  return { current, next, progressToNext }
}

// ─── CSV Export ───────────────────────────────────────────────────────────────

export function exportCSV(type) {
  const data = {
    students: getStudents(),
    reading_logs: read(KEYS.readingLogs) || [],
    essays: getAllEssays(),
    points: read(KEYS.points) || [],
    teachers: getTeachers(),
    assignments: getWritingAssignments(),
  }[type] || []

  if (!data.length) return

  const headers = Object.keys(data[0])
  const rows = data.map(row => headers.map(h => JSON.stringify(row[h] ?? '')).join(','))
  const csv = [headers.join(','), ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `bic_${type}_${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
