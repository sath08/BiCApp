import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import Button from '../components/ui/Button'

const US_STATES = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY']

export default function Register() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showGuardian2, setShowGuardian2] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm()

  async function onSubmit(data) {
    setLoading(true)
    try {
      // In production: insert into supabase
      console.log('Registering student:', data)
      await new Promise(r => setTimeout(r, 1000))
      setSuccess(true)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-bg-lavender flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-10 text-center max-w-md w-full shadow-xl"
        >
          <div className="text-7xl mb-4">🎉</div>
          <h2 className="text-2xl font-extrabold text-purple-900 mb-3">Registration Complete!</h2>
          <p className="text-gray-500 mb-6">Welcome to Bellevue Reading & Writing Champions! Your account is being reviewed by our coordinators.</p>
          <Link to="/login" className="inline-block bg-gradient-to-r from-purple-700 to-purple-500 text-white font-bold px-8 py-3 rounded-xl hover:from-purple-800 transition-all">
            Log In Now →
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-lavender py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Link to="/" className="text-purple-600 hover:text-purple-800 text-sm font-semibold mb-4 inline-block">← Back to Home</Link>
          <div className="text-4xl mb-3">📚</div>
          <h1 className="text-3xl font-extrabold text-purple-900">Join BIC Champions!</h1>
          <p className="text-gray-500 mt-2">Register to start your reading journey 🌟</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Student Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-50">
            <h2 className="font-bold text-purple-900 mb-4 flex items-center gap-2 text-lg">
              <span>👨‍🎓</span> Student Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">First Name *</label>
                <input
                  {...register('first_name', { required: 'Required' })}
                  className="w-full border border-purple-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-400 outline-none"
                  placeholder="First name"
                />
                {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Last Name *</label>
                <input
                  {...register('last_name', { required: 'Required' })}
                  className="w-full border border-purple-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-400 outline-none"
                  placeholder="Last name"
                />
                {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Date of Birth *</label>
                <input
                  type="date"
                  {...register('date_of_birth', { required: 'Required' })}
                  className="w-full border border-purple-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-400 outline-none"
                />
                {errors.date_of_birth && <p className="text-red-500 text-xs mt-1">{errors.date_of_birth.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Grade *</label>
                <select
                  {...register('grade', { required: 'Required' })}
                  className="w-full border border-purple-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-400 outline-none bg-white"
                >
                  <option value="">Select grade</option>
                  {[1,2,3,4,5,6,7,8].map(g => <option key={g} value={g}>Grade {g}</option>)}
                </select>
                {errors.grade && <p className="text-red-500 text-xs mt-1">{errors.grade.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">School Name *</label>
                <input
                  {...register('school_name', { required: 'Required' })}
                  className="w-full border border-purple-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-400 outline-none"
                  placeholder="Your school"
                />
                {errors.school_name && <p className="text-red-500 text-xs mt-1">{errors.school_name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">City *</label>
                <input
                  {...register('city', { required: 'Required' })}
                  defaultValue="Bellevue"
                  className="w-full border border-purple-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-400 outline-none"
                />
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">State *</label>
                <select
                  {...register('state', { required: 'Required' })}
                  className="w-full border border-purple-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-400 outline-none bg-white"
                >
                  <option value="">Select state</option>
                  {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone (Optional)</label>
                <input
                  {...register('phone')}
                  className="w-full border border-purple-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-400 outline-none"
                  placeholder="Phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email (Optional)</label>
                <input
                  type="email"
                  {...register('email')}
                  className="w-full border border-purple-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-400 outline-none"
                  placeholder="Student email"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">BIC Student ID (Optional)</label>
                <input
                  {...register('bic_student_id')}
                  className="w-full border border-purple-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-400 outline-none"
                  placeholder="If assigned"
                />
              </div>
            </div>
          </div>

          {/* Guardian 1 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-50">
            <h2 className="font-bold text-purple-900 mb-4 flex items-center gap-2 text-lg">
              <span>👨‍👩‍👧</span> Parent/Guardian 1 (Required)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name *</label>
                <input
                  {...register('guardian1_name', { required: 'Required' })}
                  className="w-full border border-purple-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-400 outline-none"
                  placeholder="Parent or guardian full name"
                />
                {errors.guardian1_name && <p className="text-red-500 text-xs mt-1">{errors.guardian1_name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Relationship *</label>
                <select
                  {...register('guardian1_relationship', { required: 'Required' })}
                  className="w-full border border-purple-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-400 outline-none bg-white"
                >
                  <option value="">Select...</option>
                  {['Mother', 'Father', 'Grandmother', 'Grandfather', 'Aunt', 'Uncle', 'Legal Guardian', 'Other'].map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                {errors.guardian1_relationship && <p className="text-red-500 text-xs mt-1">{errors.guardian1_relationship.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone *</label>
                <input
                  {...register('guardian1_phone', { required: 'Required' })}
                  className="w-full border border-purple-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-400 outline-none"
                  placeholder="Phone number"
                />
                {errors.guardian1_phone && <p className="text-red-500 text-xs mt-1">{errors.guardian1_phone.message}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  {...register('guardian1_email', { required: 'Required' })}
                  className="w-full border border-purple-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-400 outline-none"
                  placeholder="Email address"
                />
                {errors.guardian1_email && <p className="text-red-500 text-xs mt-1">{errors.guardian1_email.message}</p>}
              </div>
            </div>
          </div>

          {/* Guardian 2 */}
          {!showGuardian2 ? (
            <button
              type="button"
              onClick={() => setShowGuardian2(true)}
              className="w-full border-2 border-dashed border-purple-200 rounded-2xl p-4 text-purple-600 font-semibold hover:border-purple-400 hover:bg-purple-50 transition-all text-sm"
            >
              + Add Second Parent/Guardian (Optional)
            </button>
          ) : (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-50">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-purple-900 flex items-center gap-2 text-lg">
                  <span>👨‍👩‍👧</span> Parent/Guardian 2 (Optional)
                </h2>
                <button type="button" onClick={() => setShowGuardian2(false)} className="text-gray-400 hover:text-red-500 text-sm">Remove</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                  <input {...register('guardian2_name')} className="w-full border border-purple-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-400 outline-none" placeholder="Full name" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Relationship</label>
                  <select {...register('guardian2_relationship')} className="w-full border border-purple-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-400 outline-none bg-white">
                    <option value="">Select...</option>
                    {['Mother', 'Father', 'Grandmother', 'Grandfather', 'Aunt', 'Uncle', 'Legal Guardian', 'Other'].map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
                  <input {...register('guardian2_phone')} className="w-full border border-purple-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-400 outline-none" placeholder="Phone" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                  <input type="email" {...register('guardian2_email')} className="w-full border border-purple-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-400 outline-none" placeholder="Email" />
                </div>
              </div>
            </div>
          )}

          <Button type="submit" variant="primary" fullWidth size="xl" loading={loading}>
            🚀 Register for BIC Champions!
          </Button>

          <p className="text-center text-sm text-gray-500">
            Already registered?{' '}
            <Link to="/login" className="text-purple-700 font-semibold hover:text-purple-900">Log In →</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
