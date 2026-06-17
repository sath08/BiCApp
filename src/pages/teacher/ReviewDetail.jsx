import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../contexts/AuthContext'
import { useEssay, useSubmitReview } from '../../hooks/useEssays'
import { usePendingReviews } from '../../hooks/useEssays'
import RubricScorer from '../../components/forms/RubricScorer'
import Button from '../../components/ui/Button'
import CelebrationOverlay from '../../components/ui/CelebrationOverlay'

export default function ReviewDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const submitReviewMutation = useSubmitReview()
  const [action, setAction] = useState(null)
  const [success, setSuccess] = useState(false)

  // Look up essay by id from the pending reviews list (has student name attached)
  const { data: pending = [] } = usePendingReviews(user?.id)
  const { data: essay } = useEssay(id)

  const review = pending.find(r => r.id === id) || essay

  const { register, handleSubmit, control, formState: { errors } } = useForm()

  if (!review) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Essay not found.</p>
        <Link to="/teacher/reviews" className="text-teal-600 font-semibold mt-4 inline-block">← Back to Reviews</Link>
      </div>
    )
  }

  async function onSubmit(data) {
    if (!action) return
    await submitReviewMutation.mutateAsync({ essayId: id, reviewData: { ...data, action } })
    setSuccess(true)
  }

  return (
    <div className="space-y-4 pb-6">
      <CelebrationOverlay
        show={success}
        title={action === 'approve' ? 'Essay Approved! 🎉' : 'Revision Requested ✏️'}
        message={action === 'approve' ? 'Great feedback! The student will be notified.' : 'The student will be asked to revise their essay.'}
        emoji={action === 'approve' ? '✅' : '✏️'}
        onClose={() => navigate('/teacher/reviews')}
      />

      <Link to="/teacher/reviews" className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-800 font-semibold text-sm">
        ← Back to Reviews
      </Link>

      <div className="bg-gradient-to-r from-teal-700 to-teal-500 rounded-2xl p-5 text-white">
        <h1 className="text-xl font-extrabold">{review.book_title}</h1>
        <p className="text-teal-100 text-sm">
          {review.student_anonymous_id} • {review.essay_type} • {review.assignment_type}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-purple-50 shadow-sm p-5">
              <h2 className="font-bold text-purple-900 mb-4">📖 Essay</h2>
              <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed max-h-[500px] overflow-y-auto whitespace-pre-wrap">
                {review.essay_text}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-purple-50 shadow-sm p-5">
              <RubricScorer control={control} errors={errors} />
            </div>

            <div className="bg-white rounded-2xl border border-purple-50 shadow-sm p-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">💪 Strengths</label>
                <textarea
                  {...register('strengths_text', { required: 'Required' })}
                  rows={3}
                  placeholder="What did the student do well?"
                  className="w-full border border-purple-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-400 outline-none resize-none"
                />
                {errors.strengths_text && <p className="text-red-500 text-xs mt-1">{errors.strengths_text.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">📈 Areas for Growth</label>
                <textarea
                  {...register('growth_areas_text', { required: 'Required' })}
                  rows={3}
                  placeholder="What can the student improve?"
                  className="w-full border border-purple-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-400 outline-none resize-none"
                />
                {errors.growth_areas_text && <p className="text-red-500 text-xs mt-1">{errors.growth_areas_text.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">💬 General Feedback (Optional)</label>
                <textarea
                  {...register('feedback_text')}
                  rows={2}
                  placeholder="Any additional comments..."
                  className="w-full border border-purple-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-400 outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="submit" variant="danger" className="flex-1"
                loading={submitReviewMutation.isPending && action === 'revision'}
                onClick={() => setAction('revision')}
              >✏️ Request Revision</Button>
              <Button type="submit" variant="teal" className="flex-1"
                loading={submitReviewMutation.isPending && action === 'approve'}
                onClick={() => setAction('approve')}
              >✅ Approve Essay</Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
