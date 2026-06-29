import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getLeaderboard, getStudents } from '../../lib/localStore'
import { useState } from 'react'
import Button from '../../components/ui/Button'

const DEFAULT_LEVELS = [
  { name: 'Bronze Reader', min: 0, max: 99, color: 'bg-amber-700', light: 'bg-amber-50 text-amber-800' },
  { name: 'Silver Reader', min: 100, max: 249, color: 'bg-gray-400', light: 'bg-gray-100 text-gray-700' },
  { name: 'Gold Reader', min: 250, max: 499, color: 'bg-amber-400', light: 'bg-amber-50 text-amber-700' },
  { name: 'Platinum Reader', min: 500, max: 999, color: 'bg-indigo-400', light: 'bg-indigo-50 text-indigo-700' },
  { name: 'Diamond Champion', min: 1000, max: Infinity, color: 'bg-cyan-500', light: 'bg-cyan-50 text-cyan-700' },
]

export default function Awards() {
  const qc = useQueryClient()
  const [awarding, setAwarding] = useState(null)

  const { data: lb = [] } = useQuery({ queryKey: ['leaderboard'], queryFn: getLeaderboard })
  const { data: students = [] } = useQuery({ queryKey: ['students'], queryFn: getStudents })

  const award = useMutation({
    mutationFn: ({ studentId, level }) => Promise.resolve(true),
    onSuccess: () => { setAwarding(null) }
  })

  const enriched = lb.map(e => {
    const s = students.find(st => st.anonymous_id === e.anonymous_id) || {}
    const level = DEFAULT_LEVELS.slice().reverse().find(l => e.total_points >= l.min) || DEFAULT_LEVELS[0]
    return { ...e, realName: s.first_name ? `${s.first_name} ${s.last_name}` : e.anonymous_id, studentId: s.id, grade: s.grade, level }
  }).sort((a, b) => b.total_points - a.total_points)

  const eligible = enriched.filter(e => e.total_points >= 100)

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Awards</h1>
        <p className="text-sm text-gray-500 mt-0.5">Recognition levels and award-eligible students</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {DEFAULT_LEVELS.map(l => (
          <div key={l.name} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 text-center">
            <div className={`w-8 h-8 rounded-full ${l.color} mx-auto mb-2`} />
            <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">{l.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">{l.min}–{l.max === Infinity ? '∞' : l.max} pts</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 dark:border-gray-700">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Award-Eligible Students</h2>
          <p className="text-xs text-gray-500 mt-0.5">{eligible.length} students with 100+ points</p>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-700 dark:divide-gray-700">
          {eligible.map((e, i) => (
            <div key={e.anonymous_id} className="px-5 py-3.5 flex items-center gap-3">
              <span className="text-xs text-gray-400 w-5">#{i+1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{e.realName}</p>
                {e.grade && <p className="text-xs text-gray-400">Grade {e.grade}</p>}
              </div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${e.level.light}`}>{e.level.name}</span>
              <span className="text-sm font-bold text-indigo-600 w-16 text-right">{e.total_points} pts</span>
              <Button variant="outline" size="sm" onClick={() => setAwarding(e)}>Award</Button>
            </div>
          ))}
          {eligible.length === 0 && <p className="text-sm text-gray-400 text-center py-8">No eligible students yet.</p>}
        </div>
      </div>

      {awarding && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xl w-full max-w-sm p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-1">Confirm Award</h3>
            <p className="text-sm text-gray-600 mb-4">Award <strong>{awarding.level.name}</strong> to <strong>{awarding.realName}</strong>?</p>
            <div className="flex gap-2">
              <Button variant="outline" fullWidth onClick={() => setAwarding(null)}>Cancel</Button>
              <Button variant="primary" fullWidth loading={award.isPending}
                onClick={() => award.mutate({ studentId: awarding.studentId, level: awarding.level.name })}>
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
