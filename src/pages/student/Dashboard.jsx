import { useStudentContext } from '../../contexts/StudentContext'
import { useStudent, useBadges } from '../../hooks/useStudent'
import { useEssays } from '../../hooks/useEssays'
import { usePoints } from '../../hooks/usePoints'
import { useReadingLogs } from '../../hooks/useReadingLog'
import { getRecognitionLevel } from '../../lib/localStore'
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Link } from 'react-router-dom'

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function StudentDashboard() {
  const { student: ctx } = useStudentContext()
  const { data: profile } = useStudent(ctx?.studentId)
  const { data: essays = [] } = useEssays(ctx?.studentId)
  const { data: points } = usePoints(ctx?.studentId)
  const { data: logs = [] } = useReadingLogs(ctx?.studentId)
  const { data: badges = [] } = useBadges(ctx?.studentId)

  const totalPts = points?.total ?? 0
  const { current: level, next: nextLevel, progressToNext } = getRecognitionLevel(totalPts)

  // Last 7 days chart
  const today = new Date()
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today); d.setDate(today.getDate() - (6 - i))
    const key = d.toISOString().slice(0, 10)
    const dayLogs = logs.filter(l => l.date === key)
    return { day: ['S','M','T','W','T','F','S'][d.getDay()], minutes: dayLogs.reduce((s, l) => s + l.minutes_read, 0) }
  })

  const recentLogs = logs.slice(0, 3)
  const pendingEssays = essays.filter(e => e.status !== 'approved' && e.status !== 'draft')

  return (
    <div className="space-y-5 max-w-3xl">
      {/* Greeting */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {ctx?.firstName} 👋</h1>
        <p className="text-sm text-gray-500 mt-0.5">Keep up the great work — you're on a {ctx?.readingStreak || profile?.reading_streak || 5} day streak 🔥</p>
      </div>

      {/* Level progress */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{level.emoji}</span>
            <div>
              <p className="font-semibold text-gray-900 text-sm">{level.name}</p>
              <p className="text-xs text-gray-500">{totalPts} XP total</p>
            </div>
          </div>
          {nextLevel && (
            <div className="text-right">
              <p className="text-xs text-gray-400">{nextLevel.name}</p>
              <p className="text-xs font-medium text-indigo-600">{nextLevel.minPoints - totalPts} XP to go</p>
            </div>
          )}
        </div>
        {nextLevel && (
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full transition-all duration-700" style={{ width: `${progressToNext}%` }} />
          </div>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total XP', value: totalPts, sub: 'points earned' },
          { label: 'Streak', value: `${ctx?.readingStreak || profile?.reading_streak || 5}d`, sub: 'days reading' },
          { label: 'Badges', value: badges.filter(b => b.earned).length, sub: 'unlocked' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 shadow-sm p-3.5 text-center">
            <p className="text-xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Activity chart */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <p className="text-sm font-semibold text-gray-900 mb-3">Reading this week</p>
        <ResponsiveContainer width="100%" height={100}>
          <BarChart data={chartData} barSize={20}>
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
            <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #F3F4F6', fontSize: 12 }} cursor={{ fill: '#F3F4F6' }} />
            <Bar dataKey="minutes" fill="#4F46E5" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        <Link to="/student/reading-log" className="bg-indigo-600 text-white rounded-xl p-4 hover:bg-indigo-700 transition-colors group">
          <p className="text-lg mb-1">📖</p>
          <p className="font-semibold text-sm">Log reading</p>
          <p className="text-xs text-indigo-200 mt-0.5">Add today's session</p>
        </Link>
        <Link to="/student/writing" className="bg-white border border-gray-200 shadow-sm text-gray-900 rounded-xl p-4 hover:bg-gray-50 transition-colors">
          <p className="text-lg mb-1">✍️</p>
          <p className="font-semibold text-sm">Write an essay</p>
          <p className="text-xs text-gray-400 mt-0.5">{pendingEssays.length} pending review</p>
        </Link>
      </div>

      {/* Recent logs */}
      {recentLogs.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
            <p className="text-sm font-semibold text-gray-900">Recent reading</p>
            <Link to="/student/reading-log" className="text-xs text-indigo-600 hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentLogs.map(log => (
              <div key={log.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{log.book_title}</p>
                  <p className="text-xs text-gray-400">{log.author} · {formatDate(log.date)}</p>
                </div>
                <span className="text-xs font-medium text-gray-500">{log.minutes_read}m</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
