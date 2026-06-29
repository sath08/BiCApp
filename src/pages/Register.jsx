import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { addStudent } from '../lib/localStore'
import { useStudentContext } from '../contexts/StudentContext'
import { useLang } from '../contexts/LanguageContext'
import Button from '../components/ui/Button'
import HeaderControls from '../components/ui/HeaderControls'

export default function Register() {
  const navigate = useNavigate()
  const { loginStudent } = useStudentContext()
  const { t } = useLang()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()

  async function onSubmit(data) {
    setLoading(true); setError('')
    try {
      addStudent({ first_name: data.first_name, last_name: data.last_name, grade: parseInt(data.grade), school_name: data.school, birth_year: parseInt(data.birth_year) })
      await loginStudent(data.first_name, data.last_name, parseInt(data.birth_year))
      navigate('/student/dashboard')
    } catch (e) { setError(e.message || 'Registration failed.') }
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
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t('createAccount')}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('joinChallenge')}</p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="r-first" className={labelCls}>{t('firstName')}</label>
                  <input id="r-first" {...register('first_name', { required: t('required') })} className={inputCls} placeholder="First" autoComplete="given-name" />
                  {errors.first_name && <p role="alert" className="text-xs text-red-500 mt-1">{errors.first_name.message}</p>}
                </div>
                <div>
                  <label htmlFor="r-last" className={labelCls}>{t('lastName')}</label>
                  <input id="r-last" {...register('last_name', { required: t('required') })} className={inputCls} placeholder="Last" autoComplete="family-name" />
                  {errors.last_name && <p role="alert" className="text-xs text-red-500 mt-1">{errors.last_name.message}</p>}
                </div>
              </div>
              <div>
                <label htmlFor="r-year" className={labelCls}>{t('birthYear')}</label>
                <input id="r-year" type="number" {...register('birth_year', { required: t('required'), min: 2010, max: 2020 })} className={inputCls} placeholder="e.g. 2015" />
                {errors.birth_year && <p role="alert" className="text-xs text-red-500 mt-1">Enter a valid birth year (2010–2020)</p>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="r-grade" className={labelCls}>{t('grade')}</label>
                  <select id="r-grade" {...register('grade', { required: true })} className={inputCls}>
                    {[3,4,5,6,7,8].map(g => <option key={g} value={g}>Grade {g}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="r-school" className={labelCls}>{t('school')}</label>
                  <input id="r-school" {...register('school', { required: t('required') })} className={inputCls} placeholder="School name" />
                </div>
              </div>
              {error && <p role="alert" aria-live="polite" className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 rounded-lg px-3 py-2">{error}</p>}
              <Button type="submit" variant="primary" fullWidth loading={loading} size="lg">{t('createAccount')}</Button>
            </form>
          </div>

          <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
            {t('alreadyRegistered')} <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">{t('logIn')}</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
