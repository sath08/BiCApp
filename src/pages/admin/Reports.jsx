import { motion } from 'framer-motion'
import { useStudents } from '../../hooks/useStudent'
import { useWritingAssignments } from '../../hooks/useStudent'
import { exportCSV } from '../../lib/localStore'
import Card from '../../components/ui/Card'

const colorMap = {
  purple: 'from-purple-600 to-purple-400',
  teal: 'from-teal-600 to-teal-400',
  orange: 'from-orange-500 to-orange-400',
  yellow: 'from-yellow-500 to-yellow-400',
}

export default function Reports() {
  const { data: students = [] } = useStudents()

  const reports = [
    { title: 'Students Report', emoji: '👨‍🎓', description: `${students.length} students`, color: 'purple', type: 'students' },
    { title: 'Reading Logs Report', emoji: '📖', description: 'All reading sessions', color: 'teal', type: 'reading_logs' },
    { title: 'Essays Report', emoji: '✍️', description: 'All essay submissions', color: 'orange', type: 'essays' },
    { title: 'Points Ledger Report', emoji: '⭐', description: 'All point transactions', color: 'yellow', type: 'points' },
  ]

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-600 to-orange-400 rounded-2xl p-5 text-white">
        <h1 className="text-2xl font-extrabold mb-1">📈 Reports & Exports</h1>
        <p className="text-orange-100 text-sm">Download CSV reports for any dataset</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {reports.map((r, i) => (
          <motion.div
            key={r.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="flex items-center gap-5">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colorMap[r.color]} flex items-center justify-center text-2xl flex-shrink-0`}>
                {r.emoji}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">{r.title}</h3>
                <p className="text-sm text-gray-500">{r.description}</p>
              </div>
              <button
                onClick={() => exportCSV(r.type)}
                className="flex-shrink-0 bg-gray-100 hover:bg-purple-100 hover:text-purple-700 text-gray-700 font-semibold text-sm px-4 py-2 rounded-xl transition-colors flex items-center gap-1"
              >
                ⬇️ Export
              </button>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <h2 className="font-bold text-purple-900 mb-4">📊 Program Summary</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Students', value: students.length, emoji: '👨‍🎓' },
            { label: 'Active Students', value: students.filter(s => s.is_active).length, emoji: '✅' },
            { label: 'Award Eligible', value: students.filter(s => s.total_points >= 25).length, emoji: '🏆' },
            { label: 'Schools', value: new Set(students.map(s => s.school_name)).size, emoji: '🏫' },
          ].map(stat => (
            <div key={stat.label} className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="text-2xl mb-1">{stat.emoji}</div>
              <div className="text-2xl font-extrabold text-purple-800">{stat.value}</div>
              <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
