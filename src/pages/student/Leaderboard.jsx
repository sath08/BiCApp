import { useState } from 'react'
import { useLeaderboard } from '../../hooks/useStudent'
import { useStudentContext } from '../../contexts/StudentContext'

const CATEGORIES = ['Total', 'Reading', 'Writing', 'Streaks']
const GRADES = ['All', '1', '2', '3', '4', '5', '6', '7', '8', '1-5', '6-8']

export default function Leaderboard() {
  const { student } = useStudentContext()
  const [category, setCategory] = useState('Total')
  const [gradeFilter, setGradeFilter] = useState('All')

  const gradeArg = gradeFilter === 'All' ? null : isNaN(Number(gradeFilter)) ? gradeFilter : Number(gradeFilter)
  const { data: board = [] } = useLeaderboard(gradeArg, category === 'Streaks' ? 'streak' : category.toLowerCase())

  function getScore(e) {
    if (category === 'Reading') return `${e.reading_points} pts`
    if (category === 'Writing') return `${e.writing_points} pts`
    if (category === 'Streaks') return `${e.streak}d`
    return `${e.total_points} pts`
  }

  const currentUser = board.find(e => e.anonymous_id === student?.anonymousId)
  const medals = ['🥇', '🥈', '🥉']

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Leaderboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Anonymous rankings — your identity is protected</p>
      </div>

      {/* Current user banner */}
      {currentUser && (
        <div className="bg-indigo-600 text-white rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-indigo-200 mb-0.5">Your ranking</p>
            <p className="font-semibold text-sm">{currentUser.anonymous_id}</p>
            <p className="text-xs text-indigo-200">Grade {currentUser.grade}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">#{currentUser.rank}</p>
            <p className="text-sm text-indigo-200">{getScore(currentUser)}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="space-y-2">
        <div className="flex gap-1.5 flex-wrap">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${category === c ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >{c}</button>
          ))}
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {GRADES.map(g => (
            <button key={g} onClick={() => setGradeFilter(g)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${gradeFilter === g ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >{g === 'All' ? 'All grades' : g === '1-5' ? 'Gr. 1–5' : g === '6-8' ? 'Gr. 6–8' : `Gr. ${g}`}</button>
          ))}
        </div>
      </div>

      {/* Board */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-card divide-y divide-gray-50">
        {board.map((e, i) => {
          const isMe = e.anonymous_id === student?.anonymousId
          return (
            <div key={e.student_id} className={`flex items-center gap-4 px-4 py-3 ${isMe ? 'bg-indigo-50' : ''}`}>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${i < 3 ? 'bg-amber-50 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>
                {i < 3 ? medals[i] : e.rank}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${isMe ? 'text-indigo-700' : 'text-gray-900'}`}>
                  {e.anonymous_id} {isMe && <span className="text-xs font-normal">(you)</span>}
                </p>
                <p className="text-xs text-gray-400">Grade {e.grade} · {e.streak}🔥</p>
              </div>
              <p className="text-sm font-semibold text-gray-700 shrink-0">{getScore(e)}</p>
            </div>
          )
        })}
        {board.length === 0 && (
          <div className="py-10 text-center text-sm text-gray-400">No data for this filter</div>
        )}
      </div>
    </div>
  )
}
