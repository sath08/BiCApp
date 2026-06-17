import { motion } from 'framer-motion'
import { useStudentContext } from '../../contexts/StudentContext'
import { mockCurrentStudent, mockPointsLedger } from '../../lib/mockData'
import { getRecognitionLevel } from '../../lib/points'
import Card from '../../components/ui/Card'
import ProgressBar from '../../components/ui/ProgressBar'

export default function Profile() {
  const { student } = useStudentContext()
  const data = mockCurrentStudent
  const level = getRecognitionLevel(data.total_points)

  return (
    <div className="space-y-6 pb-20 md:pb-6 max-w-2xl mx-auto">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-800 to-purple-600 rounded-2xl p-6 text-white text-center relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10 text-9xl flex items-center justify-center">👤</div>
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
          {data.first_name[0]}{data.last_name[0]}
        </div>
        <h1 className="text-2xl font-extrabold">{data.first_name} {data.last_name}</h1>
        <p className="text-purple-300 text-sm">Grade {data.grade} • {data.school_name}</p>
        <p className="text-purple-400 text-xs mt-1">{data.anonymous_id}</p>
        <div className="flex justify-center gap-2 mt-4">
          <span className="bg-white/20 px-4 py-1.5 rounded-full text-sm font-bold">{level.emoji} {level.name}</span>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="text-center p-4">
          <div className="text-2xl font-extrabold text-purple-700">{data.total_points}</div>
          <div className="text-xs text-gray-500 mt-1">Total XP</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-extrabold text-orange-500">{data.reading_streak}🔥</div>
          <div className="text-xs text-gray-500 mt-1">Day Streak</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-extrabold text-teal-600">5</div>
          <div className="text-xs text-gray-500 mt-1">Badges</div>
        </Card>
      </div>

      {/* Info */}
      <Card>
        <h2 className="font-bold text-purple-900 mb-4">👤 Student Info</h2>
        <div className="space-y-3">
          {[
            { label: 'Full Name', value: `${data.first_name} ${data.last_name}` },
            { label: 'Grade', value: `Grade ${data.grade}` },
            { label: 'School', value: data.school_name },
            { label: 'City', value: `${data.city}, ${data.state}` },
            { label: 'Anonymous ID', value: data.anonymous_id },
            { label: 'Teacher', value: data.teacher_name },
          ].map(item => (
            <div key={item.label} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
              <span className="text-sm text-gray-500 font-medium">{item.label}</span>
              <span className="text-sm font-semibold text-gray-800">{item.value}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Points Breakdown */}
      <Card>
        <h2 className="font-bold text-purple-900 mb-4">⭐ Points History</h2>
        <div className="space-y-2">
          {mockPointsLedger.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0"
            >
              <div>
                <p className="text-sm font-medium text-gray-700">{p.description}</p>
                {p.awarded_by && <p className="text-xs text-gray-400">By {p.awarded_by}</p>}
                <p className="text-xs text-gray-400">{new Date(p.created_at).toLocaleDateString()}</p>
              </div>
              <span className="font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm">+{p.points} ⭐</span>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  )
}
