import { motion } from 'framer-motion'
import { useStudentContext } from '../../contexts/StudentContext'
import { useStudent, useBadges } from '../../hooks/useStudent'
import { usePoints } from '../../hooks/usePoints'
import { getRecognitionLevel } from '../../lib/localStore'
import Card from '../../components/ui/Card'
import ProgressBar from '../../components/ui/ProgressBar'

export default function Profile() {
  const { student, logoutStudent } = useStudentContext()
  const { data: studentData } = useStudent(student?.studentId)
  const { data: pointsData } = usePoints(student?.studentId)
  const { data: badges = [] } = useBadges(student?.studentId)

  const totalPoints = pointsData?.total ?? studentData?.total_points ?? 0
  const streak = studentData?.reading_streak ?? 0
  const { current: level } = getRecognitionLevel(totalPoints)

  return (
    <div className="space-y-6 pb-20 md:pb-6 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-800 to-purple-600 rounded-2xl p-6 text-white text-center relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10 text-9xl flex items-center justify-center">👤</div>
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-extrabold">
          {student?.firstName?.[0]}{student?.lastName?.[0]}
        </div>
        <h1 className="text-2xl font-extrabold">{student?.firstName} {student?.lastName}</h1>
        <p className="text-white/90 text-sm">Grade {student?.grade} • {student?.school}</p>
        <p className="text-white/80 text-xs mt-1">{student?.anonymousId}</p>
        <div className="flex justify-center gap-2 mt-4">
          <span className="bg-white/20 px-4 py-1.5 rounded-full text-sm font-bold">{level.emoji} {level.name}</span>
        </div>
      </motion.div>

      <div className="grid grid-cols-3 gap-3">
        <Card className="text-center p-4">
          <div className="text-2xl font-extrabold text-purple-700">{totalPoints}</div>
          <div className="text-xs text-gray-600 mt-1">Total XP</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-extrabold text-orange-700">{streak}🔥</div>
          <div className="text-xs text-gray-600 mt-1">Day Streak</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-extrabold text-teal-600">{badges.length}</div>
          <div className="text-xs text-gray-600 mt-1">Badges</div>
        </Card>
      </div>

      <Card>
        <h2 className="font-bold text-purple-900 mb-4">👤 Student Info</h2>
        <div className="space-y-3">
          {[
            { label: 'Full Name', value: `${student?.firstName} ${student?.lastName}` },
            { label: 'Grade', value: `Grade ${student?.grade}` },
            { label: 'School', value: student?.school },
            { label: 'Anonymous ID', value: student?.anonymousId },
          ].map(item => (
            <div key={item.label} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
              <span className="text-sm text-gray-600 font-medium">{item.label}</span>
              <span className="text-sm font-semibold text-gray-800">{item.value}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="font-bold text-purple-900 mb-4">⭐ Points History</h2>
        <div className="space-y-2">
          {(pointsData?.ledger || []).map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0"
            >
              <div>
                <p className="text-sm font-medium text-gray-700">{p.description}</p>
                {p.awarded_by && <p className="text-xs text-gray-600">By {p.awarded_by}</p>}
                <p className="text-xs text-gray-600">{new Date(p.created_at).toLocaleDateString()}</p>
              </div>
              <span className="font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm">+{p.points} ⭐</span>
            </motion.div>
          ))}
          {(!pointsData?.ledger || pointsData.ledger.length === 0) && (
            <p className="text-sm text-gray-600 text-center py-4">No points yet. Start reading! 📖</p>
          )}
        </div>
      </Card>

      <button onClick={logoutStudent}
        className="w-full bg-red-50 text-red-700 font-bold py-3 rounded-xl border border-red-200 hover:bg-red-100 transition-colors"
      >
        🚪 Log Out
      </button>
    </div>
  )
}
