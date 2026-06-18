import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getLeaderboard, getStudents } from '../../lib/localStore'

const CATEGORIES = ['overall', 'reading', 'writing']
const GRADES = ['all', 3, 4, 5, 6, 7, 8]

export default function AdminLeaderboard() {
  const [category, setCategory] = useState('overall')
  const [grade, setGrade] = useState('all')

  const { data: lb = [] } = useQuery({ queryKey: ['leaderboard'], queryFn: getLeaderboard })
  const { data: students = [] } = useQuery({ queryKey: ['students'], queryFn: getStudents })

  const studentById = Object.fromEntries(students.map(s => [s.id, s]))

  const enriched = lb.map(e => {
    const s = students.find(st => st.anonymous_id === e.anonymous_id) || {}
    return { ...e, realName: s.first_name ? `${s.first_name} ${s.last_name}` : e.anonymous_id, grade: s.grade, school: s.school_name }
  })

  const filtered = enriched
    .filter(e => grade === 'all' || e.grade === grade)
    .sort((a, b) => {
      const pts = x => category === 'reading' ? x.reading_points : category === 'writing' ? x.writing_points : x.total_points
      return pts(b) - pts(a)
    })

  const pts = e => category === 'reading' ? e.reading_points : category === 'writing' ? e.writing_points : e.total_points

  const medals = ['🥇', '🥈', '🥉']

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Leaderboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Full rankings with student names (admin view)</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCategory(c)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors capitalize ${category === c ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {c}
          </button>
        ))}
        <div className="w-px bg-gray-200 mx-1" />
        {GRADES.map(g => (
          <button key={g} onClick={() => setGrade(g)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${grade === g ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {g === 'all' ? 'All Grades' : `Gr ${g}`}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((e, i) => (
          <div key={e.anonymous_id} className={`bg-white rounded-xl border shadow-sm p-3.5 flex items-center gap-3 ${i < 3 ? 'border-amber-100' : 'border-gray-200'}`}>
            <div className="w-8 text-center">
              {i < 3 ? <span className="text-lg">{medals[i]}</span> : <span className="text-sm font-semibold text-gray-400">#{i+1}</span>}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">{e.realName}</p>
              <p className="text-xs text-gray-400">{e.school || '—'} {e.grade ? `· Grade ${e.grade}` : ''}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-indigo-600">{pts(e).toLocaleString()}</p>
              <p className="text-xs text-gray-400">pts</p>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-sm text-gray-400 text-center py-8">No data.</p>}
      </div>
    </div>
  )
}
