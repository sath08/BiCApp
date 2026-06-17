import { createContext, useContext, useState, useEffect } from 'react'
import { getStudentSession, setStudentSession, clearStudentSession } from '../lib/auth'
import { findStudentByLogin } from '../lib/localStore'

const StudentContext = createContext(null)

export function StudentProvider({ children }) {
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const session = getStudentSession()
    if (session) setStudent(session)
    setLoading(false)
  }, [])

  function loginStudent(firstName, lastName, birthYear) {
    const found = findStudentByLogin(firstName, lastName, birthYear)
    if (!found) throw new Error('Student not found. Please check your name and birth year.')
    const session = {
      studentId: found.id,
      firstName: found.first_name,
      lastName: found.last_name,
      grade: found.grade,
      anonymousId: found.anonymous_id,
      school: found.school_name,
    }
    setStudentSession(found)
    setStudent(session)
    return session
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
