import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { AnimatePresence, motion } from 'framer-motion'
import { useStudentContext } from '../contexts/StudentContext'
import { useAuth } from '../contexts/AuthContext'
import Button from '../components/ui/Button'

export default function Login() {
  const [tab, setTab] = useState('student')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { loginStudent } = useStudentContext()
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const studentForm = useForm()
  const teacherForm = useForm()

  async function handleStudentLogin(data) {
    setLoading(true); setError('')
    try {
      await loginStudent(data.first_name, data.last_name, data.birth_year)
      navigate('/student/dashboard')
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  async function handleTeacherLogin(data) {
    setLoading(true); setError('')
    try {
      const session = signIn(data.email, data.password)
      navigate(session.role === 'coordinator' ? '/admin/dashboard' : '/teacher/dashboard')
    } catch (e) { setError(e.message || 'Invalid credentials') }
    finally { setLoading(false) }
  }

  const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow'
  const labelCls = 'block text-xs font-medium text-gray-600 mb-1'

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="h-14 bg-white border-b border-gray-200 flex items-center px-6">
        <Link to="/" className="text-sm text-gray-500 hover:text-gray-900 font-medium flex items-center gap-1.5 transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back
        </Link>
        <span className="font-semibold text-gray-900 ml-auto mr-auto -translate-x-6 text-sm">BIC Champions</span>
      </header>

      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-gray-900">Welcome back</h1>
            <p className="text-sm text-gray-500 mt-1">Log in to continue your journey</p>
          </div>

          {/* Tab switcher */}
          <div className="flex rounded-lg border border-gray-200 bg-gray-50 p-0.5 mb-5">
            <button onClick={() => { setTab('student'); setError('') }}
              className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all ${tab === 'student' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >Student</button>
            <button onClick={() => { setTab('staff'); setError('') }}
              className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all ${tab === 'staff' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >Teacher / Admin</button>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <AnimatePresence mode="wait">
              {tab === 'student' ? (
                <motion.div key="student" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }}>
                  <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2 mb-4 text-center">No password needed — just your name and birth year</p>
                  <form onSubmit={studentForm.handleSubmit(handleStudentLogin)} className="space-y-3">
                    <div>
                      <label className={labelCls}>First Name</label>
                      <input {...studentForm.register('first_name', { required: 'Required' })} defaultValue="Emma" className={inputCls} placeholder="Your first name" />
                    </div>
                    <div>
                      <label className={labelCls}>Last Name</label>
                      <input {...studentForm.register('last_name', { required: 'Required' })} defaultValue="Johnson" className={inputCls} placeholder="Your last name" />
                    </div>
                    <div>
                      <label className={labelCls}>Birth Year</label>
                      <input type="number" {...studentForm.register('birth_year', { required: 'Required' })} defaultValue="2015" className={inputCls} placeholder="e.g. 2015" />
                    </div>
                    {error && <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
                    <Button type="submit" variant="primary" fullWidth loading={loading} size="lg">Log in</Button>
                  </form>
                  <p className="text-center text-xs text-gray-400 mt-3">Demo: Emma Johnson, 2015</p>
                </motion.div>
              ) : (
                <motion.div key="staff" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }}>
                  <form onSubmit={teacherForm.handleSubmit(handleTeacherLogin)} className="space-y-3">
                    <div>
                      <label className={labelCls}>Email</label>
                      <input type="email" {...teacherForm.register('email', { required: 'Required' })} defaultValue="rodriguez@bic.edu" className={inputCls} placeholder="you@bic.edu" />
                    </div>
                    <div>
                      <label className={labelCls}>Password</label>
                      <input type="password" {...teacherForm.register('password', { required: 'Required' })} defaultValue="password" className={inputCls} placeholder="Password" />
                    </div>
                    {error && <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
                    <Button type="submit" variant="teal" fullWidth loading={loading} size="lg">Log in</Button>
                  </form>
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-500 space-y-0.5">
                    <p className="font-medium text-gray-700 mb-1">Demo accounts</p>
                    <p>Teacher: rodriguez@bic.edu / password</p>
                    <p>Admin: admin@bic.edu / password</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <p className="text-center text-xs text-gray-500 mt-4">
            New student? <Link to="/register" className="text-indigo-600 font-medium hover:underline">Register here</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
