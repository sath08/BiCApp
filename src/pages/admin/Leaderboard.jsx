import { useState } from 'react'
import { motion } from 'framer-motion'
import { mockLeaderboard, mockStudents } from '../../lib/mockData'
import { getRecognitionLevel } from '../../lib/points'
import Card from '../../components/ui/Card'

const medals = ['🥇', '🥈', '🥉']
const medalColors = ['text-yellow-500 bg-yellow-50', 'text-gray-500 bg-gray-50', 'text-orange-500 bg-orange-50']

export default function AdminLeaderboard() {
  const [category, setCategory] = useState('Total')

  const fullLeaderboard = mockStudents
    .sort((a, b) => b.total_points - a.total_points)
    .map((s, i) => ({ ...s, rank: i + 1 }))

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-600 to-orange-400 rounded-2xl p-5 text-white">
        <h1 className="text-2xl font-extrabold mb-1">🏆 Full Leaderboard</h1>
        <p className="text-orange-100 text-sm">Real names visible to coordinators only</p>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-3">
        {[fullLeaderboard[1], fullLeaderboard[0], fullLeaderboard[2]].map((s, i) => {
          if (!s) return null
          const podiumHeights = ['h-24', 'h-32', 'h-20']
          return (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-2xl p-3 text-center flex flex-col items-center justify-end ${podiumHeights[i]} ${medalColors[s.rank - 1]}`}
            >
              <div className="text-3xl mb-1">{medals[s.rank - 1]}</div>
              <p className="text-xs font-bold leading-tight">{s.first_name} {s.last_name}</p>
              <p className="text-sm font-extrabold">{s.total_points} pts</p>
              <p className="text-xs opacity-70">G{s.grade}</p>
            </motion.div>
          )
        })}
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Rank', 'Student', 'Grade', 'Anonymous ID', 'Points', 'Level'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {fullLeaderboard.map((s, i) => {
                const level = getRecognitionLevel(s.total_points)
                return (
                  <motion.tr
                    key={s.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-orange-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-sm ${s.rank <= 3 ? medalColors[s.rank - 1] : 'bg-gray-100 text-gray-500'}`}>
                        {s.rank <= 3 ? medals[s.rank - 1] : s.rank}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-sm text-gray-800">{s.first_name} {s.last_name}</p>
                      <p className="text-xs text-gray-400">{s.school_name}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">G{s.grade}</td>
                    <td className="px-4 py-3 text-xs text-gray-500 font-mono">{s.anonymous_id}</td>
                    <td className="px-4 py-3"><span className="font-bold text-purple-700">{s.total_points} XP</span></td>
                    <td className="px-4 py-3 text-sm">{level.emoji} {level.name}</td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
