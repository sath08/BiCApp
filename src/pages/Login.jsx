import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { useStudentContext } from '../contexts/StudentContext'
import { useAuth } from '../contexts/AuthContext'
import Button from '../components/ui/Button'

export default function Login() {
  const [tab, setTab] = useState('student')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { loginStudent } = useStudentContext()
  const { signIn, mockTeacherLogin } = useAuth()
  const navigate = useNavigate()

  const studentForm = useForm()
  const teacherForm = useForm()

  async function handleStudentLogin(data) {
    setLoading(true)
    setError('')
    try {
      await loginStudent(data.first_name, data.last_name, data.birth_year)
      navigate('/student/dashboard')
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleTeacherLogin(data) {
    setLoading(true)
    setError('')
    try {
      const session = signIn(data.email, data.password)
      navigate(session.role === 'coordinator' ? '/admin/dashboard' : '/teacher/dashboard')
    } catch (e) {
      setError(e.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg-lavender flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="text-purple-600 hover:text-purple-800 text-sm font-semibold mb-4 inline-block">← Back to Home</Link>
          <div className="text-5xl mb-3">📚</div>
          <h1 className="text-3xl font-extrabold text-purple-900">Welcome Back!</h1>
          <p className="text-gray-500 mt-1">Log in to continue your journey 🌟</p>
        </div>

        {/* Tab Switcher */}
        <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-1.5 flex mb-6">
          <button
            onClick={() => { setTab('student'); setError('') }}
            className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all ${tab === 'student' ? 'bg-gradient-to-r from-purple-700 to-purple-500 text-white shadow-md' : 'text-gray-500 hover:text-purple-700'}`}
          >
            👨‍🎓 Student
          </button>
          <button
            onClick={() => { setTab('staff'); setError('') }}
            className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all ${tab === 'staff' ? 'bg-gradient-to-r from-teal-600 to-teal-400 text-white shadow-md' : 'text-gray-500 hover:text-teal-700'}`}
          >
            👩‍🏫 Teacher / Admin
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-6">
          <AnimatePresence mode="wait">
            {tab === 'student' ? (
              <motion.div key="student" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                <p className="text-sm text-gray-500 mb-5 bg-purple-50 rounded-xl p-3 text-center">
                  Enter your name and birth year to log in — no password needed! 🎉
                </p>
                <form onSubmit={studentForm.handleSubmit(handleStudentLogin)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">First Name</label>
                    <input
                      {...studentForm.register('first_name', { required: 'Required' })}
                      defaultValue="Emma"
                      className="w-full border border-purple-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-400 outline-none"
                      placeholder="Your first name"
                    />
                    {studentForm.formState.errors.first_name && <p className="text-red-500 text-xs mt-1">{studentForm.formState.errors.first_name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Last Name</label>
                    <input
                      {...studentForm.register('last_name', { required: 'Required' })}
                      defaultValue="Johnson"
                      className="w-full border border-purple-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-400 outline-none"
                      placeholder="Your last name"
                    />
                    {studentForm.formState.errors.last_name && <p className="text-red-500 text-xs mt-1">{studentForm.formState.errors.last_name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Birth Year</label>
                    <input
                      type="number"
                      {...studentForm.register('birth_year', { required: 'Required', min: 2005, max: 2020 })}
                      defaultValue="2015"
                      className="w-full border border-purple-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-400 outline-none"
                      placeholder="e.g. 2015"
                    />
                    {studentForm.formState.errors.birth_year && <p className="text-red-500 text-xs mt-1">{studentForm.formState.errors.birth_year.message}</p>}
                  </div>
                  {error && <p className="text-red-500 text-sm bg-red-50 rounded-xl px-4 py-2">{error}</p>}
                  <Button type="submit" variant="primary" fullWidth loading={loading}>
                    🚀 Log In as Student
                  </Button>
                </form>
                <p className="text-center text-xs text-gray-400 mt-4">Demo: Emma Johnson, 2015</p>
              </motion.div>
            ) : (
              <motion.div key="staff" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                <p className="text-sm text-gray-500 mb-5 bg-teal-50 rounded-xl p-3 text-center">
                  Teachers and coordinators log in with their email 📧
                </p>
                <form onSubmit={teacherForm.handleSubmit(handleTeacherLogin)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      {...teacherForm.register('email', { required: 'Required' })}
                      defaultValue="rodriguez@bic.edu"
                      className="w-full border border-purple-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-400 outline-none"
                      placeholder="your@email.com"
                    />
                    {teacherForm.formState.errors.email && <p className="text-red-500 text-xs mt-1">{teacherForm.formState.errors.email.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                    <input
                      type="password"
                      {...teacherForm.register('password', { required: 'Required' })}
                      defaultValue="password"
                      className="w-full border border-purple-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-400 outline-none"
                      placeholder="Your password"
                    />
                  </div>
                  {error && <p className="text-red-500 text-sm bg-red-50 rounded-xl px-4 py-2">{error}</p>}
                  <Button type="submit" variant="teal" fullWidth loading={loading}>
                    🔐 Log In
                  </Button>
                </form>
                <div className="mt-4 p-3 bg-gray-50 rounded-xl text-xs text-gray-500">
                  <p className="font-semibold mb-1">Demo accounts:</p>
                  <p>Teacher: rodriguez@bic.edu / any password</p>
                  <p>Admin: admin@bic.edu / any password</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="text-center mt-4 text-sm text-gray-500">
          New student?{' '}
          <Link to="/register" className="text-purple-700 font-semibold hover:text-purple-900">Register here →</Link>
        </p>
      </motion.div>
    </div>
  )
}
