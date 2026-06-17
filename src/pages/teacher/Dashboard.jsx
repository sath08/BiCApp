import { useAuth } from '../../contexts/AuthContext'
import { useStudentsForTeacher } from '../../hooks/useStudent'
import { usePendingReviews, useCompletedReviews } from '../../hooks/useEssays'
import { Link } from 'react-router-dom'

export default function TeacherDashboard() {
  const { user } = useAuth()
  const { data: students = [] } = useStudentsForTeacher(user?.id)
  const { data: pending = [] } = usePendingReviews(user?.id)
  const { data: completed = [] } = useCompletedReviews(user?.id)

  return (
    <div className="max-w-3xl space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Welcome back, {user?.full_name}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Students', value: students.length },
          { label: 'Pending reviews', value: pending.length, alert: pending.length > 3 },
          { label: 'Completed', value: completed.length },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-card p-4 text-center">
            <p className={`text-2xl font-bold ${s.alert ? 'text-orange-500' : 'text-gray-900'}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Pending reviews */}
      {pending.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-card">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
            <p className="text-sm font-semibold text-gray-900">Needs review</p>
            <Link to="/teacher/reviews" className="text-xs text-emerald-600 hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {pending.slice(0, 5).map(r => (
              <div key={r.id} className="flex items-center justify-between px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">{r.book_title}</p>
                  <p className="text-xs text-gray-400">{r.student_anonymous_id} · {r.essay_type}</p>
                </div>
                <Link to={`/teacher/reviews/${r.id}`}
                  className="ml-3 shrink-0 text-xs font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors"
                >Review →</Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Students */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-card">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
          <p className="text-sm font-semibold text-gray-900">My students</p>
          <Link to="/teacher/students" className="text-xs text-emerald-600 hover:underline">View all</Link>
        </div>
        <div className="divide-y divide-gray-50">
          {students.slice(0, 6).map(s => (
            <div key={s.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm font-medium text-gray-900">{s.first_name} {s.last_name}</p>
                <p className="text-xs text-gray-400">Grade {s.grade} · {s.school_name}</p>
              </div>
              <span className="text-xs font-semibold text-indigo-600">{s.total_points} XP</span>
            </div>
          ))}
          {students.length === 0 && <p className="text-sm text-gray-400 text-center py-8">No students assigned yet</p>}
        </div>
      </div>
    </div>
  )
}
