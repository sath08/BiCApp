import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { useStudents, useTeachers, useProgramStats } from '../../hooks/useStudent'
import { getRecognitionLevel } from '../../lib/localStore'

const monthlyData = [
  { month: 'Jan', students: 45, essays: 120 },
  { month: 'Feb', students: 72, essays: 198 },
  { month: 'Mar', students: 98, essays: 267 },
  { month: 'Apr', students: 130, essays: 345 },
  { month: 'May', students: 165, essays: 421 },
  { month: 'Jun', students: 200, essays: 512 },
]

export default function AdminDashboard() {
  const { data: students = [] } = useStudents()
  const { data: teachers = [] } = useTeachers()
  const { data: stats } = useProgramStats()

  const awardEligible = students.filter(s => s.total_points >= 25)

  return (
    <div className="max-w-5xl space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Program Overview</h1>
        <p className="text-sm text-gray-500 mt-0.5">Bellevue Reading & Writing Champions — Summer 2026</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Students', value: stats?.total_students ?? students.length },
          { label: 'Teachers', value: stats?.teacher_count ?? teachers.length },
          { label: 'Pending Reviews', value: stats?.pending_reviews ?? 0, alert: true },
          { label: 'Award Eligible', value: awardEligible.length },
        ].map(s => (
          <div key={s.label} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 text-center">
            <p className={`text-2xl font-bold ${s.alert && s.value > 3 ? 'text-orange-500' : 'text-gray-900'}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Growth chart */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
        <p className="text-sm font-semibold text-gray-900 mb-4">Program Growth</p>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #F3F4F6', fontSize: 12 }} />
            <Line type="monotone" dataKey="students" stroke="#4F46E5" strokeWidth={2} dot={false} name="Students" />
            <Line type="monotone" dataKey="essays" stroke="#F97316" strokeWidth={2} dot={false} name="Essays" />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-2">
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-indigo-600" /><span className="text-xs text-gray-500 dark:text-gray-400">Students</span></div>
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-orange-500" /><span className="text-xs text-gray-500 dark:text-gray-400">Essays</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Teachers */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <p className="text-sm font-semibold text-gray-900 px-4 py-3 border-b border-gray-100 dark:border-gray-700 dark:border-gray-700">Teachers</p>
          <div className="divide-y divide-gray-100 dark:divide-gray-700 dark:divide-gray-700">
            {teachers.filter(t => t.is_active).map(t => (
              <div key={t.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{t.full_name}</p>
                  <p className="text-xs text-gray-400">{t.student_count} students</p>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${(t.pending_reviews || 0) > 3 ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'}`}>
                  {t.pending_reviews || 0} pending
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Award eligible */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <p className="text-sm font-semibold text-gray-900 px-4 py-3 border-b border-gray-100 dark:border-gray-700 dark:border-gray-700">Award Eligible</p>
          <div className="divide-y divide-gray-100 dark:divide-gray-700 dark:divide-gray-700">
            {awardEligible.slice(0, 5).map(s => {
              const { current: level } = getRecognitionLevel(s.total_points)
              return (
                <div key={s.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{s.first_name} {s.last_name}</p>
                    <p className="text-xs text-gray-400">Grade {s.grade}</p>
                  </div>
                  <span className="text-sm font-semibold text-indigo-600">{level.emoji} {s.total_points}</span>
                </div>
              )
            })}
            {awardEligible.length === 0 && <p className="text-sm text-gray-400 text-center py-8">No eligible students yet</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
