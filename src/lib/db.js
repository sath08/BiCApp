// Supabase data layer — async replacement for localStore.js
import { supabase } from './supabase'

// ─── Auth helpers ─────────────────────────────────────────────────────────────

export async function signInStaff(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw new Error(error.message)
  return data
}

export async function signOutStaff() {
  await supabase.auth.signOut()
}

export async function getStaffSession() {
  const { data } = await supabase.auth.getSession()
  return data.session
}

// ─── Students ─────────────────────────────────────────────────────────────────

export async function getStudents() {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('is_active', true)
    .order('last_name')
  if (error) throw error
  return data
}

export async function getStudentById(id) {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function findStudentByLogin(firstName, lastName, birthYear) {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .ilike('first_name', firstName.trim())
    .ilike('last_name', lastName.trim())
    .eq('birth_year', parseInt(birthYear))
    .eq('is_active', true)
    .maybeSingle()
  if (error) throw error
  return data
}

export async function addStudent(studentData) {
  const { data, error } = await supabase
    .from('students')
    .insert([{ ...studentData, is_active: true }])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateStudent(id, updates) {
  const { error } = await supabase
    .from('students')
    .update(updates)
    .eq('id', id)
  if (error) throw error
}

// ─── Teachers ─────────────────────────────────────────────────────────────────

export async function getTeachers() {
  const { data, error } = await supabase
    .from('teachers')
    .select('*')
    .order('last_name')
  if (error) throw error
  return data
}

export async function addTeacherAccount(data) {
  // Create auth user then teacher profile row
  const { data: authData, error: authError } = await supabase.auth.admin
    ? supabase.auth.admin.createUser({ email: data.email, password: data.password, email_confirm: true })
    : { data: null, error: new Error('Use Supabase dashboard to create auth users') }
  if (authError) throw authError

  const { error } = await supabase
    .from('teachers')
    .insert([{
      id: authData?.user?.id,
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      role: data.role || 'teacher',
      is_active: true,
    }])
  if (error) throw error
}

export async function getStudentsForTeacher(teacherId) {
  const { data, error } = await supabase
    .from('student_teacher_assignments')
    .select('student_id, students(*)')
    .eq('teacher_id', teacherId)
  if (error) throw error
  return data.map(r => r.students)
}

export async function getTeacherForStudent(studentId) {
  const { data, error } = await supabase
    .from('student_teacher_assignments')
    .select('teacher_id, teachers(*)')
    .eq('student_id', studentId)
    .maybeSingle()
  if (error) throw error
  return data?.teachers || null
}

// ─── Reading Logs ─────────────────────────────────────────────────────────────

export async function getReadingLogs(studentId) {
  const { data, error } = await supabase
    .from('reading_logs')
    .select('*')
    .eq('student_id', studentId)
    .order('date', { ascending: false })
  if (error) throw error
  return data
}

export async function addReadingLog(studentId, logData) {
  const { data, error } = await supabase
    .from('reading_logs')
    .insert([{ student_id: studentId, ...logData }])
    .select()
    .single()
  if (error) throw error

  // Award 1 point per reading log
  await addPoints(studentId, 1, 'reading', `Reading log ${logData.date}`)

  return data
}

// ─── Essays / Writing ─────────────────────────────────────────────────────────

export async function getEssays(studentId) {
  const { data, error } = await supabase
    .from('essays')
    .select('*')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getEssayById(id) {
  const { data, error } = await supabase
    .from('essays')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function getAllEssays() {
  const { data, error } = await supabase
    .from('essays')
    .select('*, students(first_name, last_name, anonymous_id, grade)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function addEssay(studentId, essayData, asDraft = false) {
  const { data, error } = await supabase
    .from('essays')
    .insert([{
      student_id: studentId,
      title: essayData.title,
      body: essayData.body,
      assignment_id: essayData.assignment_id || null,
      status: asDraft ? 'draft' : 'pending',
    }])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateEssay(id, updates) {
  const { error } = await supabase
    .from('essays')
    .update(updates)
    .eq('id', id)
  if (error) throw error
}

export async function submitReview(essayId, reviewData) {
  // Update essay status
  const status = reviewData.approved ? 'approved' : 'needs_revision'
  const { error: essayError } = await supabase
    .from('essays')
    .update({ status, feedback: reviewData.feedback })
    .eq('id', essayId)
  if (essayError) throw essayError

  // Award points if approved
  if (reviewData.approved && reviewData.student_id) {
    await addPoints(reviewData.student_id, reviewData.points || 1, 'writing', 'Essay approved')
  }

  const { error } = await supabase
    .from('reviews')
    .insert([{ essay_id: essayId, ...reviewData }])
  if (error) throw error
}

export async function getPendingReviews(teacherId) {
  const { data, error } = await supabase
    .from('essays')
    .select('*, students(first_name, last_name, anonymous_id, grade)')
    .eq('status', 'pending')
  if (error) throw error
  return data
}

// ─── Points ───────────────────────────────────────────────────────────────────

export async function getPoints(studentId) {
  const { data, error } = await supabase
    .from('points')
    .select('*')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getAllPoints() {
  const { data, error } = await supabase
    .from('points')
    .select('*')
  if (error) throw error
  return data
}

export async function addPoints(studentId, points, type, description, awardedBy = null) {
  const { error: insertError } = await supabase
    .from('points')
    .insert([{ student_id: studentId, points, point_type: type, description, awarded_by: awardedBy }])
  if (insertError) throw insertError

  // Update cached total on students row
  const { data: student } = await supabase
    .from('students')
    .select('total_points')
    .eq('id', studentId)
    .single()
  if (student) {
    await supabase
      .from('students')
      .update({ total_points: (student.total_points || 0) + points })
      .eq('id', studentId)
  }
}

export async function awardBonusPoints(studentId, points, description, teacherName) {
  return addPoints(studentId, points, 'bonus', description, teacherName)
}

// ─── Badges ───────────────────────────────────────────────────────────────────

export async function getBadges(studentId) {
  const { data, error } = await supabase
    .from('badges')
    .select('*')
    .eq('student_id', studentId)
  if (error) throw error
  return data
}

export async function awardBadgeIfNew(studentId, badgeType) {
  const { data: existing } = await supabase
    .from('badges')
    .select('id')
    .eq('student_id', studentId)
    .eq('badge_type', badgeType)
    .maybeSingle()
  if (existing) return null

  const { data, error } = await supabase
    .from('badges')
    .insert([{ student_id: studentId, badge_type: badgeType }])
    .select()
    .single()
  if (error) throw error
  return data
}

// ─── Leaderboard ──────────────────────────────────────────────────────────────

export async function getLeaderboard() {
  const { data, error } = await supabase
    .from('students')
    .select('id, anonymous_id, total_points, reading_streak')
    .eq('is_active', true)
    .order('total_points', { ascending: false })
    .limit(50)
  if (error) throw error
  return data.map(s => ({ ...s, anonymous_id: s.anonymous_id, total_points: s.total_points || 0 }))
}

// ─── Writing Assignments ──────────────────────────────────────────────────────

export async function getWritingAssignments(activeOnly = false) {
  let q = supabase.from('writing_assignments').select('*').order('created_at', { ascending: false })
  if (activeOnly) q = q.eq('is_active', true)
  const { data, error } = await q
  if (error) throw error
  return data
}

export async function addWritingAssignment(assignmentData) {
  const { data, error } = await supabase
    .from('writing_assignments')
    .insert([{ ...assignmentData, is_active: true }])
    .select()
    .single()
  if (error) throw error
  return data
}

// ─── Notifications ────────────────────────────────────────────────────────────

export async function getNotifications(userId, userType = 'student') {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .eq('user_type', userType)
    .order('created_at', { ascending: false })
    .limit(20)
  if (error) throw error
  return data
}

export async function markNotificationRead(id) {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', id)
  if (error) throw error
}

export async function markAllNotificationsRead(userId, userType = 'student') {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId)
    .eq('user_type', userType)
    .eq('is_read', false)
  if (error) throw error
}

// ─── Recognition / Level Utilities (pure, no async) ──────────────────────────

export const RECOGNITION_LEVELS = [
  { name: 'Story Explorer',      minPoints: 0,   emoji: '🔍', color: 'text-amber-600',   bg: 'bg-amber-50' },
  { name: 'Chapter Adventurer',  minPoints: 25,  emoji: '⚔️', color: 'text-orange-600',  bg: 'bg-orange-50' },
  { name: 'Book Voyager',        minPoints: 75,  emoji: '⛵', color: 'text-blue-600',    bg: 'bg-blue-50' },
  { name: 'Novel Navigator',     minPoints: 150, emoji: '🧭', color: 'text-purple-600',  bg: 'bg-purple-50' },
  { name: 'Future Novelist',     minPoints: 250, emoji: '✍️', color: 'text-emerald-600', bg: 'bg-emerald-50' },
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

export async function getCompletedReviews(teacherId) {
  const { data, error } = await supabase
    .from('essays')
    .select('*, students(first_name, last_name, anonymous_id, grade)')
    .in('status', ['approved', 'needs_revision'])
    .order('updated_at', { ascending: false })
  if (error) throw error
  return data
}
