import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../contexts/AuthContext'
import { useEssay, useSubmitReview, usePendingReviews } from '../../hooks/useEssays'
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

  const { data: pending = [] } = usePendingReviews(user?.id)
  const { data: essay } = useEssay(id)
  const review = pending.find(r => r.id === id) || essay

  const { register, handleSubmit, control, formState: { errors } } = useForm()

  if (!review) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-sm">Essay not found.</p>
        <Link to="/teacher/reviews" className="text-emerald-600 text-sm font-medium mt-4 inline-block">← Back to Reviews</Link>
      </div>
    )
  }

  async function onSubmit(data) {
    if (!action) return
    await submitReviewMutation.mutateAsync({ essayId: id, reviewData: { ...data, action } })
    setSuccess(true)
  }

  const textareaCls = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none transition-shadow'
  const labelCls = 'block text-xs font-medium text-gray-600 mb-1'

  return (
    <div className="space-y-4 pb-6 max-w-5xl">
      <CelebrationOverlay
        show={success}
        title={action === 'approve' ? 'Essay Approved!' : 'Revision Requested'}
        message={action === 'approve' ? 'The student will be notified.' : 'The student will revise and resubmit.'}
        emoji={action === 'approve' ? '✅' : '✏️'}
        onClose={() => navigate('/teacher/reviews')}
      />

      <div className="flex items-center justify-between">
        <Link to="/teacher/reviews" className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1.5 font-medium transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Reviews
        </Link>
      </div>

      <div>
        <h1 className="text-xl font-bold text-gray-900">{review.book_title}</h1>
        <p className="text-sm text-gray-500 mt-0.5">{review.student_anonymous_id} · {review.essay_type} · {review.assignment_type}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Essay text */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <p className="text-sm font-semibold text-gray-900 mb-3">Essay</p>
            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 leading-relaxed max-h-[500px] overflow-y-auto whitespace-pre-wrap">
              {review.essay_text}
            </div>
          </div>

          {/* Review form */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <RubricScorer control={control} errors={errors} />
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-4">
              <div>
                <label className={labelCls}>Strengths</label>
                <textarea {...register('strengths_text', { required: 'Required' })} rows={3}
                  placeholder="What did the student do well?" className={textareaCls} />
                {errors.strengths_text && <p className="text-xs text-red-500 mt-1">{errors.strengths_text.message}</p>}
              </div>
              <div>
                <label className={labelCls}>Areas for Growth</label>
                <textarea {...register('growth_areas_text', { required: 'Required' })} rows={3}
                  placeholder="What can the student improve?" className={textareaCls} />
                {errors.growth_areas_text && <p className="text-xs text-red-500 mt-1">{errors.growth_areas_text.message}</p>}
              </div>
              <div>
                <label className={labelCls}>General Feedback <span className="text-gray-400">(optional)</span></label>
                <textarea {...register('feedback_text')} rows={2}
                  placeholder="Any additional comments..." className={textareaCls} />
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="submit" variant="outline" className="flex-1"
                loading={submitReviewMutation.isPending && action === 'revision'}
                onClick={() => setAction('revision')}
              >Request Revision</Button>
              <Button type="submit" variant="teal" className="flex-1"
                loading={submitReviewMutation.isPending && action === 'approve'}
                onClick={() => setAction('approve')}
              >Approve Essay</Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
