import { useState } from 'react'
import { motion } from 'framer-motion'
import { useStudentContext } from '../../contexts/StudentContext'
import { useReadingLogs, useAddReadingLog } from '../../hooks/useReadingLog'
import ReadingLogForm from '../../components/forms/ReadingLogForm'
import Card from '../../components/ui/Card'
import StatCard from '../../components/ui/StatCard'
import CelebrationOverlay from '../../components/ui/CelebrationOverlay'
import { mockCurrentStudent } from '../../lib/mockData'

export default function ReadingLog() {
  const { student } = useStudentContext()
  const grade = student?.grade || mockCurrentStudent.grade
  const { data: logs = [] } = useReadingLogs(student?.studentId)
  const addLog = useAddReadingLog()
  const [celebration, setCelebration] = useState(null)

  async function handleSubmit(data) {
    const minMinutes = grade <= 5 ? 30 : 45
    const pts = data.minutes_read >= minMinutes ? 1 : 0
    await addLog.mutateAsync({ ...data, student_id: student?.studentId, points_earned: pts })
    if (pts > 0) {
      setCelebration({ title: 'Reading Point Earned! 🔥', message: `You read ${data.minutes_read} minutes today. Keep that streak going!`, emoji: '📖' })
    }
  }

  const totalMins = logs.reduce((s, l) => s + l.minutes_read, 0)
  const weeklyMins = logs.slice(0, 7).reduce((s, l) => s + l.minutes_read, 0)
  const uniqueBooks = [...new Set(logs.map(l => l.book_title))].length
  const totalPts = logs.reduce((s, l) => s + (l.points_earned || 0), 0)

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      <CelebrationOverlay
        show={!!celebration}
        title={celebration?.title}
        message={celebration?.message}
        emoji={celebration?.emoji}
        onClose={() => setCelebration(null)}
      />

      <div className="bg-gradient-to-r from-teal-700 to-teal-500 rounded-2xl p-5 text-white">
        <h1 className="text-2xl font-extrabold mb-1">📖 Reading Log</h1>
        <p className="text-teal-100 text-sm">Track your reading sessions and earn points!</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard emoji="⏱️" label="Total Minutes" value={totalMins} color="teal" index={0} />
        <StatCard emoji="📅" label="This Week" value={`${weeklyMins}min`} color="purple" index={1} />
        <StatCard emoji="📚" label="Books" value={uniqueBooks} color="orange" index={2} />
        <StatCard emoji="⭐" label="Points Earned" value={totalPts} color="yellow" index={3} />
      </div>

      {/* Log Form */}
      <Card>
        <h2 className="font-bold text-purple-900 mb-4 flex items-center gap-2">
          <span>➕</span> Log Today's Reading
        </h2>
        <ReadingLogForm onSubmit={handleSubmit} grade={grade} loading={addLog.isPending} />
      </Card>

      {/* Reading History */}
      <Card>
        <h2 className="font-bold text-purple-900 mb-4">📋 Reading History</h2>
        {logs.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <div className="text-5xl mb-3">📭</div>
            <p>No reading logs yet. Start by logging your first session!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map((log, i) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-purple-50 transition-colors"
              >
                <div className="text-center min-w-[52px]">
                  <div className="text-xs text-gray-400 font-medium">
                    {new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 text-sm">{log.book_title}</p>
                  <p className="text-xs text-gray-500">{log.author}</p>
                  {log.notes && <p className="text-xs text-gray-400 mt-1 italic">"{log.notes}"</p>}
                </div>
                <div className="text-right">
                  <p className="font-bold text-purple-700">{log.minutes_read}<span className="font-normal text-gray-400 text-xs">min</span></p>
                  {log.points_earned > 0 && (
                    <span className="text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full">+{log.points_earned}pt ⭐</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
