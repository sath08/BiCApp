import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { useStudentContext } from '../../contexts/StudentContext'
import { useStudent } from '../../hooks/useStudent'
import { useEssays } from '../../hooks/useEssays'
import { usePoints } from '../../hooks/usePoints'
import { useReadingLogs } from '../../hooks/useReadingLog'
import StatCard from '../../components/ui/StatCard'
import StreakFlame from '../../components/ui/StreakFlame'
import ProgressBar from '../../components/ui/ProgressBar'
import Card from '../../components/ui/Card'
import { StatusBadge } from '../../components/ui/Badge'
import { getRecognitionLevel } from '../../lib/localStore'

export default function StudentDashboard() {
  const { student } = useStudentContext()
  const { data: studentData } = useStudent(student?.studentId)
  const { data: essays = [] } = useEssays(student?.studentId)
  const { data: pointsData } = usePoints(student?.studentId)
  const { data: logs = [] } = useReadingLogs(student?.studentId)

  const totalPoints = pointsData?.total ?? studentData?.total_points ?? 0
  const streak = studentData?.reading_streak ?? 0
  const { current: level, next: nextLevel, progressToNext: levelPct } = getRecognitionLevel(totalPoints)

  const pendingEssays = essays.filter(e => e.status === 'revision_requested')
  const submittedEssays = essays.filter(e => e.status === 'under_review')

  // Build last 7 days chart data
  const today = new Date()
  const weeklyStats = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() - (6 - i))
    const dateStr = d.toISOString().slice(0, 10)
    const dayLogs = logs.filter(l => l.date === dateStr)
    const minutes = dayLogs.reduce((s, l) => s + l.minutes_read, 0)
    return { day: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()], minutes }
  })
  const weeklyMins = weeklyStats.reduce((s, d) => s + d.minutes, 0)

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-800 via-purple-700 to-purple-500 rounded-2xl p-6 text-white relative overflow-hidden"
      >
        <div className="absolute right-4 top-4 text-6xl opacity-20">📚</div>
        <p className="text-purple-200 font-medium mb-1">Welcome back,</p>
        <h1 className="text-2xl font-extrabold mb-4">{student?.firstName} {student?.lastName}! 👋</h1>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/20 rounded-xl p-3 text-center">
            <div className="text-2xl font-extrabold">{totalPoints}</div>
            <div className="text-xs text-purple-200">Total XP</div>
          </div>
          <div className="bg-white/20 rounded-xl p-3 text-center">
            <div className="text-2xl">{level.emoji}</div>
            <div className="text-xs text-purple-200 truncate">{level.name}</div>
          </div>
          <div className="bg-white/20 rounded-xl p-3 text-center">
            <div className="text-2xl font-extrabold text-orange-300">{streak}🔥</div>
            <div className="text-xs text-purple-200">Day Streak</div>
          </div>
        </div>
      </motion.div>

      <Card>
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{level.emoji}</span>
              <span className="font-bold text-purple-900">{level.name}</span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              {nextLevel
                ? `${nextLevel.minPoints - totalPoints} more points to ${nextLevel.name}`
                : 'Maximum level reached! 🏆'}
            </p>
          </div>
          <span className="text-lg font-bold text-purple-700">{totalPoints} XP</span>
        </div>
        <ProgressBar value={levelPct} max={100} color="purple" showPercent height="lg" />
      </Card>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-purple-50 p-4 flex flex-col items-center col-span-2 sm:col-span-1">
          <StreakFlame streak={streak} size="md" />
        </div>
        <StatCard emoji="⭐" label="Total XP" value={totalPoints} color="purple" index={1} />
        <StatCard emoji="📖" label="This Week" value={`${weeklyMins}min`} color="teal" index={2} />
        <StatCard emoji="✍️" label="Essays" value={essays.filter(e => e.status === 'approved').length} sub="approved" color="orange" index={3} />
      </div>

      {(pendingEssays.length > 0 || submittedEssays.length > 0) && (
        <div className="space-y-3">
          {pendingEssays.map(e => (
            <motion.div key={e.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">✏️</span>
                <div>
                  <p className="font-semibold text-orange-800 text-sm">Revision Requested</p>
                  <p className="text-xs text-orange-600">"{e.book_title}" — {e.essay_type}</p>
                </div>
              </div>
              <Link to={`/student/writing/${e.id}`} className="text-xs font-bold text-orange-700 bg-orange-100 px-3 py-1.5 rounded-lg hover:bg-orange-200">
                View →
              </Link>
            </motion.div>
          ))}
          {submittedEssays.map(e => (
            <div key={e.id} className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔍</span>
                <div>
                  <p className="font-semibold text-blue-800 text-sm">Under Review</p>
                  <p className="text-xs text-blue-600">"{e.book_title}" — {e.essay_type}</p>
                </div>
              </div>
              <StatusBadge status="under_review" />
            </div>
          ))}
        </div>
      )}

      <Card>
        <h3 className="font-bold text-purple-900 mb-4">📊 This Week's Reading</h3>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={weeklyStats} barSize={28}>
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip formatter={(v) => [`${v} min`, 'Minutes']} contentStyle={{ borderRadius: '12px', border: '1px solid #E9D5FF', fontSize: 12 }} />
            <Bar dataKey="minutes" fill="#6B21A8" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-xs text-gray-400 text-center mt-2">
          Grade {student?.grade}: {student?.grade <= 5 ? '30' : '45'} min/day minimum for points
        </p>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Link to="/student/reading-log">
          <motion.div whileHover={{ y: -3 }} className="bg-gradient-to-br from-purple-600 to-purple-400 rounded-2xl p-5 text-white text-center shadow-lg shadow-purple-200">
            <div className="text-4xl mb-2">📖</div>
            <div className="font-bold">Log Reading</div>
            <div className="text-xs text-purple-200 mt-1">Track today's session</div>
          </motion.div>
        </Link>
        <Link to="/student/writing">
          <motion.div whileHover={{ y: -3 }} className="bg-gradient-to-br from-orange-500 to-orange-400 rounded-2xl p-5 text-white text-center shadow-lg shadow-orange-200">
            <div className="text-4xl mb-2">✍️</div>
            <div className="font-bold">Write Essay</div>
            <div className="text-xs text-orange-100 mt-1">Submit your work</div>
          </motion.div>
        </Link>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-purple-900">📝 Recent Essays</h3>
          <Link to="/student/writing" className="text-xs text-purple-600 font-semibold hover:text-purple-800">View all →</Link>
        </div>
        <div className="space-y-3">
          {essays.slice(0, 3).map(e => (
            <Link key={e.id} to={`/student/writing/${e.id}`}>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-purple-50 transition-colors">
                <div>
                  <p className="font-semibold text-sm text-gray-800">{e.book_title}</p>
                  <p className="text-xs text-gray-500">{e.essay_type}</p>
                </div>
                <StatusBadge status={e.status} />
              </div>
            </Link>
          ))}
          {essays.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">No essays yet. Start writing! ✍️</p>
          )}
        </div>
      </Card>
    </div>
  )
}
