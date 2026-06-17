import { createContext, useContext, useState, useEffect } from 'react'
import { getStudentSession, setStudentSession, clearStudentSession } from '../lib/auth'
import { mockCurrentStudent } from '../lib/mockData'

const StudentContext = createContext(null)

export function StudentProvider({ children }) {
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const session = getStudentSession()
    if (session) {
      setStudent(session)
    }
    setLoading(false)
  }, [])

  async function loginStudent(firstName, lastName, birthYear) {
    // In production: query supabase students table
    // For demo: match against mock data
    const mockMatch = mockCurrentStudent
    if (
      mockMatch.first_name.toLowerCase() === firstName.toLowerCase() &&
      mockMatch.last_name.toLowerCase() === lastName.toLowerCase() &&
      mockMatch.birth_year === parseInt(birthYear)
    ) {
      const session = {
        studentId: mockMatch.id,
        firstName: mockMatch.first_name,
        lastName: mockMatch.last_name,
        grade: mockMatch.grade,
        anonymousId: mockMatch.anonymous_id,
        school: mockMatch.school_name,
        totalPoints: mockMatch.total_points,
        readingStreak: mockMatch.reading_streak,
      }
      setStudentSession(mockMatch)
      setStudent(session)
      return session
    }
    throw new Error('Student not found. Please check your name and birth year.')
  }

  function logoutStudent() {
    clearStudentSession()
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
