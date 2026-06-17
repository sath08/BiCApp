import { motion } from 'framer-motion'
import { mockStudents, mockReadingLogs, mockEssays, mockPointsLedger } from '../../lib/mockData'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'

function csvExport(filename, data, columns) {
  const header = columns.map(c => c.label).join(',')
  const rows = data.map(row => columns.map(c => `"${row[c.key] ?? ''}"`).join(','))
  const csv = [header, ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

const reports = [
  {
    title: 'Students Report',
    emoji: '👨‍🎓',
    description: `${mockStudents.length} students`,
    color: 'purple',
    onClick: () => csvExport('students.csv', mockStudents, [
      { key: 'first_name', label: 'First Name' },
      { key: 'last_name', label: 'Last Name' },
      { key: 'grade', label: 'Grade' },
      { key: 'school_name', label: 'School' },
      { key: 'anonymous_id', label: 'Anonymous ID' },
      { key: 'total_points', label: 'Total Points' },
      { key: 'is_active', label: 'Active' },
    ]),
  },
  {
    title: 'Reading Logs Report',
    emoji: '📖',
    description: `${mockReadingLogs.length} entries`,
    color: 'teal',
    onClick: () => csvExport('reading_logs.csv', mockReadingLogs, [
      { key: 'date', label: 'Date' },
      { key: 'student_id', label: 'Student ID' },
      { key: 'book_title', label: 'Book Title' },
      { key: 'author', label: 'Author' },
      { key: 'minutes_read', label: 'Minutes Read' },
      { key: 'points_earned', label: 'Points Earned' },
    ]),
  },
  {
    title: 'Essays Report',
    emoji: '✍️',
    description: `${mockEssays.length} submissions`,
    color: 'orange',
    onClick: () => csvExport('essays.csv', mockEssays, [
      { key: 'id', label: 'ID' },
      { key: 'student_id', label: 'Student ID' },
      { key: 'essay_type', label: 'Essay Type' },
      { key: 'book_title', label: 'Book Title' },
      { key: 'status', label: 'Status' },
      { key: 'submitted_at', label: 'Submitted At' },
    ]),
  },
  {
    title: 'Points Ledger Report',
    emoji: '⭐',
    description: `${mockPointsLedger.length} transactions`,
    color: 'yellow',
    onClick: () => csvExport('points.csv', mockPointsLedger, [
      { key: 'student_id', label: 'Student ID' },
      { key: 'points', label: 'Points' },
      { key: 'point_type', label: 'Type' },
      { key: 'description', label: 'Description' },
      { key: 'created_at', label: 'Date' },
    ]),
  },
]

const colorMap = {
  purple: 'from-purple-600 to-purple-400',
  teal: 'from-teal-600 to-teal-400',
  orange: 'from-orange-500 to-orange-400',
  yellow: 'from-yellow-500 to-yellow-400',
  green: 'from-green-600 to-green-400',
}

export default function Reports() {
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
                onClick={r.onClick}
                className="flex-shrink-0 bg-gray-100 hover:bg-purple-100 hover:text-purple-700 text-gray-700 font-semibold text-sm px-4 py-2 rounded-xl transition-colors flex items-center gap-1"
              >
                ⬇️ Export
              </button>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Summary Stats */}
      <Card>
        <h2 className="font-bold text-purple-900 mb-4">📊 Program Summary</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Students', value: mockStudents.length, emoji: '👨‍🎓' },
            { label: 'Active Students', value: mockStudents.filter(s => s.is_active).length, emoji: '✅' },
            { label: 'Reading Sessions', value: mockReadingLogs.length, emoji: '📖' },
            { label: 'Essays Submitted', value: mockEssays.filter(e => e.status !== 'draft').length, emoji: '✍️' },
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
