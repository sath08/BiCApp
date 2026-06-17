import { useState } from 'react'
import { motion } from 'framer-motion'
import { useStudents } from '../../hooks/useStudent'
import Card from '../../components/ui/Card'

const awardLevels = [
  { name: 'Story Explorer', emoji: '🌱', minPts: 25, color: 'from-green-400 to-emerald-500', bg: 'bg-green-50 border-green-200' },
  { name: 'Chapter Adventurer', emoji: '⚔️', minPts: 75, color: 'from-blue-400 to-blue-600', bg: 'bg-blue-50 border-blue-200' },
  { name: 'Book Voyager', emoji: '🚀', minPts: 150, color: 'from-purple-400 to-purple-600', bg: 'bg-purple-50 border-purple-200' },
  { name: 'Novel Navigator', emoji: '🧭', minPts: 250, color: 'from-yellow-400 to-orange-500', bg: 'bg-yellow-50 border-yellow-200' },
  { name: 'Future Novelist', emoji: '🏆', minPts: 400, color: 'from-red-400 to-pink-600', bg: 'bg-red-50 border-red-200' },
]

export default function Awards() {
  const [selectedLevel, setSelectedLevel] = useState(null)
  const { data: students = [] } = useStudents()

  const eligibleStudents = selectedLevel
    ? students.filter(s => s.total_points >= selectedLevel.minPts && s.total_points < (awardLevels[awardLevels.indexOf(selectedLevel) + 1]?.minPts ?? Infinity))
    : []

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-600 to-orange-400 rounded-2xl p-5 text-white">
        <h1 className="text-2xl font-extrabold mb-1">🥇 Awards & Recognition</h1>
        <p className="text-orange-100 text-sm">Configure levels and view eligible students</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {awardLevels.map((level, i) => {
          const eligible = students.filter(s =>
            s.total_points >= level.minPts &&
            s.total_points < (awardLevels[i + 1]?.minPts ?? Infinity)
          )
          return (
            <motion.button
              key={level.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -3 }}
              onClick={() => setSelectedLevel(selectedLevel?.name === level.name ? null : level)}
              className={`text-left p-5 rounded-2xl border-2 transition-all ${level.bg} ${selectedLevel?.name === level.name ? 'ring-2 ring-offset-2 ring-orange-400' : ''}`}
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${level.color} flex items-center justify-center text-3xl mb-3`}>
                {level.emoji}
              </div>
              <h3 className="font-bold text-gray-900">{level.name}</h3>
              <p className="text-sm text-gray-500 mt-1">≥ {level.minPts} points</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-2xl font-extrabold text-gray-800">{eligible.length}</span>
                <span className="text-sm text-gray-500">eligible students</span>
              </div>
            </motion.button>
          )
        })}
      </div>

      {selectedLevel && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{selectedLevel.emoji}</span>
              <div>
                <h2 className="font-bold text-purple-900">{selectedLevel.name} Recipients</h2>
                <p className="text-sm text-gray-500">{eligibleStudents.length} students eligible</p>
              </div>
            </div>
            {eligibleStudents.length === 0 ? (
              <p className="text-gray-400 text-center py-6">No students at this level yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {eligibleStudents.map(s => (
                  <div key={s.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-semibold text-sm text-gray-800">{s.first_name} {s.last_name}</p>
                      <p className="text-xs text-gray-400">Grade {s.grade} • {s.school_name}</p>
                    </div>
                    <span className="font-bold text-purple-700">{s.total_points} XP</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>
      )}
    </div>
  )
}
