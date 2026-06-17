import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { addStudent } from '../lib/localStore'
import { useStudentContext } from '../contexts/StudentContext'
import Button from '../components/ui/Button'

export default function Register() {
  const navigate = useNavigate()
  const { loginStudent } = useStudentContext()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()

  async function onSubmit(data) {
    setLoading(true); setError('')
    try {
      addStudent({
        first_name: data.first_name,
        last_name: data.last_name,
        grade: parseInt(data.grade),
        school_name: data.school,
        birth_year: parseInt(data.birth_year),
      })
      await loginStudent(data.first_name, data.last_name, parseInt(data.birth_year))
      navigate('/student/dashboard')
    } catch (e) {
      setError(e.message || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow'
  const labelCls = 'block text-xs font-medium text-gray-600 mb-1'

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col">
      <header className="h-14 bg-white border-b border-gray-100 flex items-center px-6">
        <Link to="/" className="text-sm text-gray-500 hover:text-gray-900 font-medium flex items-center gap-1.5 transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back
        </Link>
        <span className="font-semibold text-gray-900 ml-auto mr-auto -translate-x-6 text-sm">BIC Champions</span>
      </header>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-gray-900">Create your account</h1>
            <p className="text-sm text-gray-500 mt-1">Join the reading challenge</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-card p-5">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>First Name</label>
                  <input {...register('first_name', { required: 'Required' })} className={inputCls} placeholder="First" />
                  {errors.first_name && <p className="text-xs text-red-500 mt-1">{errors.first_name.message}</p>}
                </div>
                <div>
                  <label className={labelCls}>Last Name</label>
                  <input {...register('last_name', { required: 'Required' })} className={inputCls} placeholder="Last" />
                  {errors.last_name && <p className="text-xs text-red-500 mt-1">{errors.last_name.message}</p>}
                </div>
              </div>
              <div>
                <label className={labelCls}>Birth Year</label>
                <input type="number" {...register('birth_year', { required: 'Required', min: 2010, max: 2020 })}
                  className={inputCls} placeholder="e.g. 2015" />
                {errors.birth_year && <p className="text-xs text-red-500 mt-1">Enter a valid birth year (2010–2020)</p>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Grade</label>
                  <select {...register('grade', { required: true })} className={inputCls}>
                    {[3,4,5,6,7,8].map(g => <option key={g} value={g}>Grade {g}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>School</label>
                  <input {...register('school', { required: 'Required' })} className={inputCls} placeholder="School name" />
                </div>
              </div>

              {error && <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
              <Button type="submit" variant="primary" fullWidth loading={loading} size="lg">Create Account</Button>
            </form>
          </div>

          <p className="text-center text-xs text-gray-500 mt-4">
            Already registered? <Link to="/login" className="text-indigo-600 font-medium hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
