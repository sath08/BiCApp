import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { AnimatePresence, motion } from 'framer-motion'
import { useStudentContext } from '../contexts/StudentContext'
import { useAuth } from '../contexts/AuthContext'
import { useLang } from '../contexts/LanguageContext'
import { supabase } from '../lib/supabase'
import Button from '../components/ui/Button'
import HeaderControls from '../components/ui/HeaderControls'

export default function Login() {
  const [tab, setTab] = useState('student')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { loginStudent } = useStudentContext()
  const { signIn } = useAuth()
  const { t } = useLang()
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
      const { data: authData } = await signIn(data.email, data.password)
      const userId = authData?.user?.id
      let role = 'teacher'
      if (userId) {
        const { data: t } = await supabase.from('teachers').select('role').eq('id', userId).single()
        if (t) role = t.role
      }
      navigate(role === 'coordinator' ? '/admin/dashboard' : '/teacher/dashboard')
    } catch (e) { setError(e.message || 'Invalid credentials') }
    finally { setLoading(false) }
  }

  const inputCls = 'w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow'
  const labelCls = 'block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1'

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex flex-col">
      <header className="h-14 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center px-6" role="banner">
        <Link to="/" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 font-medium flex items-center gap-1.5 transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          {t('back')}
        </Link>
        <span className="font-semibold text-gray-900 dark:text-gray-100 ml-auto mr-auto -translate-x-6 text-sm">BIC Champions</span>
        <HeaderControls />
      </header>

      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }} className="w-full max-w-sm">
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t('welcomeBack')}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('loginSubtitle')}</p>
          </div>

          {/* Tab switcher */}
          <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-0.5 mb-5" role="tablist">
            {[{ key: 'student', label: t('student') }, { key: 'staff', label: t('teacherAdmin') }].map(tab_ => (
              <button
                key={tab_.key}
                role="tab"
                aria-selected={tab === tab_.key}
                aria-controls={`panel-${tab_.key}`}
                onClick={() => { setTab(tab_.key); setError('') }}
                className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all ${tab === tab_.key ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
              >
                {tab_.label}
              </button>
            ))}
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
            <AnimatePresence mode="wait">
              {tab === 'student' ? (
                <motion.div key="student" id="panel-student" role="tabpanel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }}>
                  <p className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2 mb-4 text-center">{t('noPassword')}</p>
                  <form onSubmit={studentForm.handleSubmit(handleStudentLogin)} className="space-y-3" noValidate>
                    <div>
                      <label htmlFor="s-first" className={labelCls}>{t('firstName')}</label>
                      <input id="s-first" {...studentForm.register('first_name', { required: t('required') })} defaultValue="Emma" className={inputCls} placeholder={t('firstName')} autoComplete="given-name" />
                      {studentForm.formState.errors.first_name && <p role="alert" className="text-xs text-red-600 mt-1">{studentForm.formState.errors.first_name.message}</p>}
                    </div>
                    <div>
                      <label htmlFor="s-last" className={labelCls}>{t('lastName')}</label>
                      <input id="s-last" {...studentForm.register('last_name', { required: t('required') })} defaultValue="Johnson" className={inputCls} placeholder={t('lastName')} autoComplete="family-name" />
                    </div>
                    <div>
                      <label htmlFor="s-year" className={labelCls}>{t('birthYear')}</label>
                      <input id="s-year" type="number" {...studentForm.register('birth_year', { required: t('required') })} defaultValue="2015" className={inputCls} placeholder="e.g. 2015" />
                    </div>
                    {error && <p role="alert" aria-live="polite" className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 rounded-lg px-3 py-2">{error}</p>}
                    <Button type="submit" variant="primary" fullWidth loading={loading} size="lg">{t('logIn')}</Button>
                  </form>
                  <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-3">Demo: Emma Johnson, 2015</p>
                </motion.div>
              ) : (
                <motion.div key="staff" id="panel-staff" role="tabpanel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }}>
                  <form onSubmit={teacherForm.handleSubmit(handleTeacherLogin)} className="space-y-3" noValidate>
                    <div>
                      <label htmlFor="t-email" className={labelCls}>{t('email')}</label>
                      <input id="t-email" type="email" {...teacherForm.register('email', { required: t('required') })} defaultValue="rodriguez@bic.edu" className={inputCls} placeholder="you@bic.edu" autoComplete="email" />
                    </div>
                    <div>
                      <label htmlFor="t-pass" className={labelCls}>{t('password')}</label>
                      <input id="t-pass" type="password" {...teacherForm.register('password', { required: t('required') })} defaultValue="password" className={inputCls} placeholder={t('password')} autoComplete="current-password" />
                    </div>
                    {error && <p role="alert" aria-live="polite" className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 rounded-lg px-3 py-2">{error}</p>}
                    <Button type="submit" variant="teal" fullWidth loading={loading} size="lg">{t('logIn')}</Button>
                  </form>
                  <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-xs text-gray-500 dark:text-gray-400 space-y-0.5">
                    <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">{t('demoAccounts')}</p>
                    <p>Teacher: rodriguez@bic.edu / password</p>
                    <p>Admin: admin@bic.edu / password</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
            {t('newStudent')} <Link to="/register" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">{t('registerHere')}</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
