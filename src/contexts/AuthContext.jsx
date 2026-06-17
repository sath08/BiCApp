import { createContext, useContext, useState, useEffect } from 'react'
import { findTeacherAccount } from '../lib/localStore'

const SESSION_KEY = 'bic_staff_session'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY)
      if (raw) {
        const session = JSON.parse(raw)
        setUser(session.user)
        setUserRole(session.role)
      }
    } catch { /* ignore */ }
    setLoading(false)
  }, [])

  function signIn(email, password) {
    const account = findTeacherAccount(email, password)
    if (!account) throw new Error('Invalid email or password.')
    const session = { user: { id: account.id, email: account.email, full_name: account.full_name }, role: account.role }
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    setUser(session.user)
    setUserRole(session.role)
    return session
  }

  function signOut() {
    localStorage.removeItem(SESSION_KEY)
    setUser(null)
    setUserRole(null)
  }

  // Kept for backward compat with Login.jsx (no-op since signIn now handles it)
  function mockTeacherLogin(role = 'teacher') {
    const email = role === 'coordinator' ? 'admin@bic.edu' : 'rodriguez@bic.edu'
    signIn(email, 'password')
  }

  const value = { user, userRole, loading, signIn, signOut, mockTeacherLogin }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
