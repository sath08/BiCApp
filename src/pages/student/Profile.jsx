import { useStudentContext } from '../../contexts/StudentContext'
import { useStudent, useBadges } from '../../hooks/useStudent'
import { usePoints } from '../../hooks/usePoints'
import { getRecognitionLevel } from '../../lib/db'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/ui/Button'

export default function Profile() {
  const { student: ctx, logoutStudent } = useStudentContext()
  const { data: profile } = useStudent(ctx?.studentId)
  const { data: points } = usePoints(ctx?.studentId)
  const { data: badges = [] } = useBadges(ctx?.studentId)
  const navigate = useNavigate()

  const totalPts = points?.total ?? 0
  const { current: level, next: nextLevel, progressToNext } = getRecognitionLevel(totalPts)

  function handleLogout() { logoutStudent(); navigate('/') }

  return (
    <div className="max-w-lg space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Profile</h1>
      </div>

      {/* Identity card */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg">
            {ctx?.firstName?.[0]}{ctx?.lastName?.[0]}
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-gray-100">{ctx?.firstName} {ctx?.lastName}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Grade {ctx?.grade} · {ctx?.school}</p>
            <p className="text-xs text-gray-400 mt-0.5 font-mono">{ctx?.anonymousId}</p>
          </div>
        </div>
      </div>

      {/* Level progress */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{level.emoji}</span>
            <div>
              <p className="font-semibold text-gray-900 text-sm">{level.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{totalPts} XP earned</p>
            </div>
          </div>
          {nextLevel && <p className="text-xs text-indigo-600 font-medium">{nextLevel.minPoints - totalPts} XP to {nextLevel.name}</p>}
        </div>
        {nextLevel && (
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${progressToNext}%` }} />
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total XP', value: totalPts },
          { label: 'Badges', value: badges.filter(b => b.earned).length },
          { label: 'Points log', value: points?.ledger?.length ?? 0 },
        ].map(s => (
          <div key={s.label} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-3.5 text-center">
            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <Button variant="outline" onClick={handleLogout} fullWidth>Log out</Button>
    </div>
  )
}
