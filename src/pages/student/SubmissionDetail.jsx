import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useEssay } from '../../hooks/useEssays'
import Card from '../../components/ui/Card'
import { StatusBadge } from '../../components/ui/Badge'

const CRITERIA = [
  { key: 'score_content', label: 'Content Understanding', emoji: '🧠' },
  { key: 'score_organization', label: 'Organization', emoji: '📐' },
  { key: 'score_vocabulary', label: 'Vocabulary', emoji: '📚' },
  { key: 'score_grammar', label: 'Grammar & Mechanics', emoji: '✅' },
  { key: 'score_critical_thinking', label: 'Critical Thinking', emoji: '💡' },
  { key: 'score_creativity', label: 'Creativity', emoji: '🎨' },
]

function Stars({ score }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <span key={s} className={`text-lg ${s <= score ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
      ))}
    </div>
  )
}

export default function SubmissionDetail() {
  const { id } = useParams()
  const { data: essay, isLoading } = useEssay(id)

  if (isLoading) {
    return <div className="flex items-center justify-center h-64 text-purple-600 font-semibold animate-pulse">Loading...</div>
  }

  if (!essay) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-3">📭</div>
        <p className="text-gray-600">Essay not found.</p>
        <Link to="/student/writing" className="text-purple-600 hover:text-purple-800 font-semibold mt-4 inline-block">← Back to Writing</Link>
      </div>
    )
  }

  const review = essay.review
  const totalScore = review ? Object.values(review).filter(v => typeof v === 'number').reduce((s, v) => s + v, 0) : 0
  const maxScore = 30

  return (
    <div className="space-y-6 pb-20 md:pb-6 max-w-3xl mx-auto">
      <Link to="/student/writing" className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 font-semibold text-sm">
        ← Back to Writing
      </Link>

      <Card>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-extrabold text-purple-900 mb-1">{essay.book_title}</h1>
            <p className="text-gray-600 text-sm">by {essay.author}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="text-xs bg-purple-100 text-purple-700 font-semibold px-2.5 py-1 rounded-full">{essay.essay_type}</span>
              <span className="text-xs bg-gray-100 text-gray-600 font-semibold px-2.5 py-1 rounded-full capitalize">{essay.assignment_type}</span>
              <StatusBadge status={essay.status} />
            </div>
          </div>
          {essay.submitted_at && (
            <div className="text-sm text-gray-600">
              Submitted {new Date(essay.submitted_at).toLocaleDateString()}
            </div>
          )}
        </div>
      </Card>

      {/* Essay Text */}
      <Card>
        <h2 className="font-bold text-purple-900 mb-4">📝 Your Essay</h2>
        <div className="bg-gray-50 rounded-xl p-5 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
          {essay.essay_text}
        </div>
      </Card>

      {/* Review / Feedback */}
      {review ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {/* Total Score */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-purple-900">📊 Teacher's Review</h2>
              <div className="text-right">
                <div className="text-2xl font-extrabold text-purple-700">{totalScore}/{maxScore}</div>
                <div className="text-xs text-gray-600">Total Score</div>
              </div>
            </div>
            <div className="space-y-3">
              {CRITERIA.map(c => (
                <div key={c.key} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{c.emoji} {c.label}</span>
                  <Stars score={review[c.key] || 0} />
                </div>
              ))}
            </div>
          </Card>

          {/* Strengths */}
          {review.strengths_text && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
              <h3 className="font-bold text-green-800 mb-2 flex items-center gap-2">
                <span>💪</span> Strengths
              </h3>
              <p className="text-green-700 text-sm leading-relaxed">{review.strengths_text}</p>
            </div>
          )}

          {/* Growth Areas */}
          {review.growth_areas_text && (
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5">
              <h3 className="font-bold text-orange-800 mb-2 flex items-center gap-2">
                <span>📈</span> Areas for Growth
              </h3>
              <p className="text-orange-700 text-sm leading-relaxed">{review.growth_areas_text}</p>
            </div>
          )}
        </motion.div>
      ) : (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center">
          <div className="text-4xl mb-3">⏳</div>
          <h3 className="font-bold text-blue-800 mb-1">Review Pending</h3>
          <p className="text-blue-600 text-sm">Your teacher will review your essay soon. Keep writing!</p>
        </div>
      )}
    </div>
  )
}
