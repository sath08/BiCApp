import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { useAuth } from '../../contexts/AuthContext'
import { useStudentsForTeacher } from '../../hooks/useStudent'
import { usePendingReviews, useCompletedReviews } from '../../hooks/useEssays'
import StatCard from '../../components/ui/StatCard'
import Card from '../../components/ui/Card'

export default function TeacherDashboard() {
  const { user } = useAuth()
  const { data: myStudents = [] } = useStudentsForTeacher(user?.id)
  const { data: pending = [] } = usePendingReviews(user?.id)
  const { data: completed = [] } = useCompletedReviews(user?.id)

  const approved = completed.filter(e => e.status === 'approved').length
  const revisions = completed.filter(e => e.status === 'revision_requested').length

  const pieData = [
    { name: 'Approved', value: approved, color: '#10B981' },
    { name: 'Under Review', value: pending.length, color: '#3B82F6' },
    { name: 'Revision', value: revisions, color: '#F59E0B' },
  ].filter(d => d.value > 0)

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-teal-700 to-teal-600 rounded-2xl p-6 text-white">
        <p className="text-white/90 font-medium mb-1">Welcome back,</p>
        <h1 className="text-2xl font-extrabold">{user?.full_name || 'Teacher'} 👩‍🏫</h1>
        <p className="text-white/90 text-sm mt-1">Bellevue Reading & Writing Champions</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard emoji="👥" label="My Students" value={myStudents.length} color="teal" index={0} />
        <StatCard emoji="📝" label="Pending Reviews" value={pending.length} color="orange" index={1} />
        <StatCard emoji="✅" label="Completed" value={completed.length} color="green" index={2} />
        <StatCard emoji="📚" label="Total Essays" value={pending.length + completed.length} color="purple" index={3} />
      </div>

      {pending.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-orange-800 flex items-center gap-2">
              <span>⚠️</span> Essays Awaiting Review
            </h2>
            <Link to="/teacher/reviews" className="text-xs font-bold text-orange-700 bg-orange-100 px-3 py-1.5 rounded-lg hover:bg-orange-200">
              View All →
            </Link>
          </div>
          <div className="space-y-2">
            {pending.slice(0, 3).map(r => (
              <div key={r.id} className="flex items-center justify-between bg-white rounded-xl p-3">
                <div>
                  <p className="font-semibold text-sm text-gray-800">{r.student_anonymous_id}</p>
                  <p className="text-xs text-gray-600">{r.essay_type} — {r.book_title}</p>
                </div>
                <Link to={`/teacher/reviews/${r.id}`} className="text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1.5 rounded-lg hover:bg-teal-100">
                  Review →
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {pieData.length > 0 && (
          <Card>
            <h3 className="font-bold text-purple-900 mb-4">📊 Review Status</h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2">
              {pieData.map(p => (
                <div key={p.name} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ background: p.color }} />
                  <span className="text-xs text-gray-600">{p.name} ({p.value})</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-purple-900">👥 My Students</h3>
            <Link to="/teacher/students" className="text-xs text-teal-600 font-semibold hover:text-teal-800">View all →</Link>
          </div>
          <div className="space-y-2">
            {myStudents.slice(0, 5).map(s => (
              <div key={s.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="font-semibold text-sm text-gray-800">{s.first_name} {s.last_name}</p>
                  <p className="text-xs text-gray-600">Grade {s.grade} • {s.anonymous_id}</p>
                </div>
                <span className="font-bold text-purple-700 text-sm">{s.total_points} XP</span>
              </div>
            ))}
            {myStudents.length === 0 && <p className="text-sm text-gray-600 text-center py-4">No students assigned yet.</p>}
          </div>
        </Card>
      </div>
    </div>
  )
}
