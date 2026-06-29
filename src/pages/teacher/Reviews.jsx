import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { usePendingReviews } from '../../hooks/useEssays'
import { StatusBadge } from '../../components/ui/Badge'

export default function Reviews() {
  const { user } = useAuth()
  const { data: pending = [], isLoading } = usePendingReviews(user?.id)

  if (isLoading) return <div className="text-center py-16 text-sm text-gray-400">Loading...</div>

  return (
    <div className="max-w-3xl space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Review Queue</h1>
        <p className="text-sm text-gray-500 mt-0.5">{pending.length} essay{pending.length !== 1 ? 's' : ''} awaiting review</p>
      </div>

      <div className="space-y-3">
        {pending.map(r => (
          <div key={r.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-gray-900 truncate">{r.book_title}</p>
                  <StatusBadge status={r.status} />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{r.student_anonymous_id} · {r.essay_type} · {r.assignment_type}</p>
                <p className="text-xs text-gray-400 mt-0.5">Submitted {new Date(r.submitted_at).toLocaleDateString()}</p>
                <p className="text-xs text-gray-500 mt-2 line-clamp-2 italic">"{r.essay_text?.substring(0, 120)}..."</p>
              </div>
              <Link to={`/teacher/reviews/${r.id}`}
                className="shrink-0 text-xs font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
              >Start Review →</Link>
            </div>
          </div>
        ))}
        {pending.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <div className="text-4xl mb-3">✓</div>
            <p className="font-semibold text-gray-600 dark:text-gray-300">All caught up</p>
            <p className="text-sm mt-1">No essays awaiting review</p>
          </div>
        )}
      </div>
    </div>
  )
}
