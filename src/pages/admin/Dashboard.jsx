import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import StatCard from '../../components/ui/StatCard'
import Card from '../../components/ui/Card'
import { mockStudents, mockTeachers } from '../../lib/mockData'
import { getRecognitionLevel } from '../../lib/points'

const monthlyData = [
  { month: 'Jan', students: 45, essays: 120 },
  { month: 'Feb', students: 72, essays: 198 },
  { month: 'Mar', students: 98, essays: 267 },
  { month: 'Apr', students: 130, essays: 345 },
  { month: 'May', students: 165, essays: 421 },
  { month: 'Jun', students: 200, essays: 512 },
]

export default function AdminDashboard() {
  const awardEligible = mockStudents.filter(s => s.total_points >= 25)
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-600 to-orange-400 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-extrabold mb-1">📊 Program Overview</h1>
        <p className="text-orange-100 text-sm">Bellevue Reading & Writing Champions — Summer 2026</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard emoji="👨‍🎓" label="Total Students" value={mockStudents.length} color="purple" index={0} />
        <StatCard emoji="👩‍🏫" label="Teachers" value={mockTeachers.length} color="teal" index={1} />
        <StatCard emoji="📝" label="Pending Reviews" value={9} color="orange" index={2} />
        <StatCard emoji="🏆" label="Award Eligible" value={awardEligible.length} color="yellow" index={3} />
      </div>

      {/* Growth Chart */}
      <Card>
        <h3 className="font-bold text-purple-900 mb-4">📈 Program Growth</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3E8FF" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E9D5FF', fontSize: 12 }} />
            <Line type="monotone" dataKey="students" stroke="#6B21A8" strokeWidth={2} dot={{ fill: '#6B21A8', r: 4 }} name="Students" />
            <Line type="monotone" dataKey="essays" stroke="#F97316" strokeWidth={2} dot={{ fill: '#F97316', r: 4 }} name="Essays" />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-6 mt-2">
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-purple-700" /><span className="text-xs text-gray-500">Students</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-orange-500" /><span className="text-xs text-gray-500">Essays</span></div>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Teacher Performance */}
        <Card>
          <h3 className="font-bold text-purple-900 mb-4">👩‍🏫 Teacher Performance</h3>
          <div className="space-y-3">
            {mockTeachers.map(t => (
              <div key={t.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="font-semibold text-sm text-gray-800">{t.full_name}</p>
                  <p className="text-xs text-gray-400">{t.student_count} students</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${t.pending_reviews > 3 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {t.pending_reviews} pending
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Award Eligible */}
        <Card>
          <h3 className="font-bold text-purple-900 mb-4">🏆 Award Eligible Students</h3>
          <div className="space-y-2">
            {awardEligible.slice(0, 5).map(s => {
              const level = getRecognitionLevel(s.total_points)
              return (
                <div key={s.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="font-semibold text-sm text-gray-800">{s.first_name} {s.last_name}</p>
                    <p className="text-xs text-gray-400">Grade {s.grade}</p>
                  </div>
                  <span className="text-sm">{level.emoji} {s.total_points} pts</span>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}
