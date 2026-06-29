import { useStudentContext } from '../../contexts/StudentContext'
import { useStudent, useBadges } from '../../hooks/useStudent'
import { useEssays } from '../../hooks/useEssays'
import { usePoints } from '../../hooks/usePoints'
import { useReadingLogs } from '../../hooks/useReadingLog'
import { getRecognitionLevel } from '../../lib/localStore'
import { useLang } from '../../contexts/LanguageContext'
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const stagger = { animate: { transition: { staggerChildren: 0.06 } } }
const fadeUp = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.2 } }

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function StudentDashboard() {
  const { student: ctx } = useStudentContext()
  const { t } = useLang()
  const { data: profile } = useStudent(ctx?.studentId)
  const { data: essays = [] } = useEssays(ctx?.studentId)
  const { data: points } = usePoints(ctx?.studentId)
  const { data: logs = [] } = useReadingLogs(ctx?.studentId)
  const { data: badges = [] } = useBadges(ctx?.studentId)

  const totalPts = points?.total ?? 0
  const { current: level, next: nextLevel, progressToNext } = getRecognitionLevel(totalPts)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? t('goodMorning') : hour < 17 ? t('goodAfternoon') : t('goodEvening')

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
    <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-5 max-w-3xl">
      {/* Greeting */}
      <motion.div variants={fadeUp}>
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{greeting}, {ctx?.firstName} 👋</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          {t('readingStreak')}: {ctx?.readingStreak || profile?.reading_streak || 5} {t('days')} 🔥
        </p>
      </motion.div>

      {/* Level progress */}
      <motion.div variants={fadeUp} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl" aria-hidden="true">{level.emoji}</span>
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{level.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{totalPts} XP total</p>
            </div>
          </div>
          {nextLevel && (
            <div className="text-right">
              <p className="text-xs text-gray-400 dark:text-gray-500">{nextLevel.name}</p>
              <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400">{nextLevel.minPoints - totalPts} XP to go</p>
            </div>
          )}
        </div>
        {nextLevel && (
          <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden" role="progressbar" aria-valuenow={progressToNext} aria-valuemin={0} aria-valuemax={100} aria-label={`Level progress: ${Math.round(progressToNext)}%`}>
            <motion.div
              className="h-full bg-indigo-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressToNext}%` }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            />
          </div>
        )}
      </motion.div>

      {/* Stats row */}
      <motion.div variants={fadeUp} className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total XP', value: totalPts, sub: 'points earned' },
          { label: 'Streak', value: `${ctx?.readingStreak || profile?.reading_streak || 5}d`, sub: 'days reading' },
          { label: 'Badges', value: badges.filter(b => b.earned).length, sub: 'unlocked' },
        ].map(s => (
          <div key={s.label} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-3.5 text-center">
            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{s.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </motion.div>

      {/* Activity chart */}
      <motion.div variants={fadeUp} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">{t('weeklyReading')}</p>
        <ResponsiveContainer width="100%" height={100}>
          <BarChart data={chartData} barSize={20}>
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
            <Tooltip
              contentStyle={{ borderRadius: 8, border: '1px solid #374151', fontSize: 12, backgroundColor: '#1F2937', color: '#F9FAFB' }}
              cursor={{ fill: 'rgba(99,102,241,0.08)' }}
            />
            <Bar dataKey="minutes" fill="#4F46E5" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Quick actions */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 gap-3">
        <Link to="/student/reading-log"
          className="bg-indigo-600 dark:bg-indigo-700 text-white rounded-xl p-4 hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2">
          <p className="text-lg mb-1" aria-hidden="true">📖</p>
          <p className="font-semibold text-sm">{t('logReading')}</p>
          <p className="text-xs text-indigo-200 mt-0.5">Add today's session</p>
        </Link>
        <Link to="/student/writing"
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm text-gray-900 dark:text-gray-100 rounded-xl p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2">
          <p className="text-lg mb-1" aria-hidden="true">✍️</p>
          <p className="font-semibold text-sm">{t('writeEssay')}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{pendingEssays.length} pending review</p>
        </Link>
      </motion.div>

      {/* Recent logs */}
      {recentLogs.length > 0 && (
        <motion.div variants={fadeUp} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{t('recentReading')}</p>
            <Link to="/student/reading-log" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {recentLogs.map(log => (
              <div key={log.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{log.book_title}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{log.author} · {formatDate(log.date)}</p>
                </div>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{log.minutes_read}m</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
