import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const StudentContext = createContext(null)
const SESSION_KEY = 'bic_student_session'

export function StudentProvider({ children }) {
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY)
      if (raw) setStudent(JSON.parse(raw))
    } catch { /* ignore */ }
    setLoading(false)
  }, [])

  async function loginStudent(firstName, lastName, birthYear) {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .ilike('first_name', firstName.trim())
      .ilike('last_name', lastName.trim())
      .eq('birth_year', parseInt(birthYear))
      .eq('is_active', true)
      .maybeSingle()

    if (error) throw new Error(error.message)
    if (!data) throw new Error('Student not found. Please check your name and birth year.')

    const session = {
      studentId: data.id,
      firstName: data.first_name,
      lastName: data.last_name,
      grade: data.grade,
      anonymousId: data.anonymous_id,
      school: data.school_name,
      totalPoints: data.total_points,
      readingStreak: data.reading_streak,
    }
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
    setStudent(session)
    return session
  }

  function logoutStudent() {
    sessionStorage.removeItem(SESSION_KEY)
    setStudent(null)
  }

  const value = { student, loading, loginStudent, logoutStudent }
  return <StudentContext.Provider value={value}>{children}</StudentContext.Provider>
}

export function useStudentContext() {
  const ctx = useContext(StudentContext)
  if (!ctx) throw new Error('useStudentContext must be used within StudentProvider')
  return ctx
}
