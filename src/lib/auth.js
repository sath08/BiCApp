// Student session helpers using localStorage
const STUDENT_SESSION_KEY = 'bic_student_session'

export function getStudentSession() {
  try {
    const raw = localStorage.getItem(STUDENT_SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setStudentSession(student) {
  localStorage.setItem(STUDENT_SESSION_KEY, JSON.stringify({
    studentId: student.id,
    firstName: student.first_name,
    lastName: student.last_name,
    grade: student.grade,
    anonymousId: student.anonymous_id,
    school: student.school_name,
  }))
}

export function clearStudentSession() {
  localStorage.removeItem(STUDENT_SESSION_KEY)
}

export function isStudentLoggedIn() {
  return getStudentSession() !== null
}
