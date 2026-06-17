import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import { usePendingReviews } from '../../hooks/useEssays'
import Card from '../../components/ui/Card'
import { StatusBadge } from '../../components/ui/Badge'

export default function Reviews() {
  const { user } = useAuth()
  const { data: pending = [], isLoading } = usePendingReviews(user?.id)

  if (isLoading) return <div className="text-center py-16 text-gray-400">Loading...</div>

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-teal-700 to-teal-500 rounded-2xl p-5 text-white">
        <h1 className="text-2xl font-extrabold mb-1">📝 Essay Review Queue</h1>
        <p className="text-teal-100 text-sm">{pending.length} essays awaiting review</p>
      </div>

      <div className="space-y-4">
        {pending.map((r, i) => (
          <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card hover>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-gray-800">{r.student_anonymous_id}</span>
                    <StatusBadge status={r.status} />
                  </div>
                  <p className="text-purple-800 font-semibold">{r.book_title}</p>
                  <p className="text-sm text-gray-500">{r.essay_type} • {r.assignment_type}</p>
                  <p className="text-xs text-gray-400 mt-1">Submitted {new Date(r.submitted_at).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2 italic">
                    "{r.essay_text?.substring(0, 120)}..."
                  </p>
                </div>
                <Link to={`/teacher/reviews/${r.id}`}
                  className="bg-gradient-to-r from-teal-600 to-teal-400 text-white font-bold px-5 py-2.5 rounded-xl hover:from-teal-700 transition-all text-sm whitespace-nowrap shadow-md shadow-teal-200"
                >
                  ✍️ Start Review →
                </Link>
              </div>
            </Card>
          </motion.div>
        ))}
        {pending.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <div className="text-6xl mb-4">🎉</div>
            <p className="font-semibold text-lg">All caught up!</p>
            <p className="text-sm mt-1">No essays awaiting review right now.</p>
          </div>
        )}
      </div>
    </div>
  )
}
