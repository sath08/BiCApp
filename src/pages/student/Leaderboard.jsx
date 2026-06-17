import { useState } from 'react'
import { motion } from 'framer-motion'
import { mockLeaderboard } from '../../lib/mockData'

const GRADE_FILTERS = ['All', '1', '2', '3', '4', '5', '6', '7', '8', 'Grades 1-5', 'Grades 6-8']
const CATEGORY_FILTERS = ['Total', 'Reading', 'Writing', 'Streaks']

const medals = ['🥇', '🥈', '🥉']
const medalBgs = ['bg-gradient-to-r from-yellow-400 to-yellow-300', 'bg-gradient-to-r from-gray-300 to-gray-200', 'bg-gradient-to-r from-orange-400 to-orange-300']

export default function Leaderboard() {
  const [gradeFilter, setGradeFilter] = useState('All')
  const [category, setCategory] = useState('Total')

  function getScore(entry) {
    if (category === 'Reading') return entry.reading_points
    if (category === 'Writing') return entry.writing_points
    if (category === 'Streaks') return entry.streak
    return entry.total_points
  }

  const filtered = mockLeaderboard
    .filter(e => {
      if (gradeFilter === 'All') return true
      if (gradeFilter === 'Grades 1-5') return e.grade <= 5
      if (gradeFilter === 'Grades 6-8') return e.grade >= 6
      return e.grade === parseInt(gradeFilter)
    })
    .sort((a, b) => getScore(b) - getScore(a))
    .map((e, i) => ({ ...e, rank: i + 1 }))

  const currentUser = filtered.find(e => e.isCurrentUser)

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-5 text-white">
        <h1 className="text-2xl font-extrabold mb-1">🏆 Leaderboard</h1>
        <p className="text-yellow-100 text-sm">How do you rank among your peers?</p>
      </div>

      {/* My Rank */}
      {currentUser && (
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="bg-purple-800 text-white rounded-2xl p-4 flex items-center gap-4"
        >
          <div className="text-3xl font-extrabold text-yellow-300">#{currentUser.rank}</div>
          <div className="flex-1">
            <p className="font-bold">You ({currentUser.anonymous_id})</p>
            <p className="text-purple-300 text-xs">Grade {currentUser.grade}</p>
          </div>
          <div className="text-right">
            <p className="font-extrabold text-xl">{getScore(currentUser)}</p>
            <p className="text-purple-300 text-xs">{category === 'Streaks' ? 'days' : 'pts'}</p>
          </div>
        </motion.div>
      )}

      {/* Filters */}
      <div className="space-y-3">
        <div>
          <p className="text-xs font-semibold text-gray-500 mb-2">CATEGORY</p>
          <div className="flex gap-2 flex-wrap">
            {CATEGORY_FILTERS.map(c => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-3 py-1.5 rounded-xl text-sm font-semibold transition-all ${category === c ? 'bg-yellow-400 text-yellow-900 shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-yellow-300'}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 mb-2">GRADE</p>
          <div className="flex gap-2 flex-wrap">
            {GRADE_FILTERS.map(g => (
              <button
                key={g}
                onClick={() => setGradeFilter(g)}
                className={`px-3 py-1.5 rounded-xl text-sm font-semibold transition-all ${gradeFilter === g ? 'bg-purple-700 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-purple-300'}`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Top 3 */}
      {filtered.length >= 3 && (
        <div className="grid grid-cols-3 gap-3">
          {[filtered[1], filtered[0], filtered[2]].map((e, i) => {
            if (!e) return null
            const originalRank = e.rank
            const podiumOrder = [2, 1, 3]
            const heights = ['h-24', 'h-32', 'h-20']
            return (
              <motion.div
                key={e.anonymous_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`${medalBgs[originalRank - 1]} rounded-2xl p-3 text-center flex flex-col items-center justify-end ${heights[i]} relative`}
              >
                {e.isCurrentUser && (
                  <div className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">YOU</div>
                )}
                <div className="text-3xl mb-1">{medals[originalRank - 1]}</div>
                <p className="text-xs font-bold text-gray-800 leading-tight">{e.anonymous_id.split(' ')[1]}</p>
                <p className="text-sm font-extrabold text-gray-900">{getScore(e)}</p>
                <p className="text-xs text-gray-600">G{e.grade}</p>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Full List */}
      <div className="bg-white rounded-2xl shadow-sm border border-purple-50 overflow-hidden">
        {filtered.map((e, i) => (
          <motion.div
            key={e.anonymous_id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            className={`flex items-center gap-4 px-5 py-4 border-b border-gray-50 last:border-0 ${e.isCurrentUser ? 'bg-purple-50' : 'hover:bg-gray-50'} transition-colors`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-extrabold text-sm ${e.rank <= 3 ? medalBgs[e.rank - 1] : 'bg-gray-100 text-gray-600'}`}>
              {e.rank <= 3 ? medals[e.rank - 1] : e.rank}
            </div>
            <div className="flex-1">
              <p className={`font-semibold text-sm ${e.isCurrentUser ? 'text-purple-800' : 'text-gray-800'}`}>
                {e.anonymous_id}
                {e.isCurrentUser && <span className="ml-2 text-xs bg-purple-200 text-purple-700 px-2 py-0.5 rounded-full font-bold">YOU</span>}
              </p>
              <p className="text-xs text-gray-400">Grade {e.grade} • {e.streak}🔥 streak</p>
            </div>
            <div className="text-right">
              <p className="font-extrabold text-purple-700">{getScore(e)}</p>
              <p className="text-xs text-gray-400">{category === 'Streaks' ? 'days' : 'points'}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
