import { useBadges } from '../../hooks/useStudent'
import { useStudentContext } from '../../contexts/StudentContext'

export default function Badges() {
  const { student } = useStudentContext()
  const { data: badges = [] } = useBadges(student?.studentId)

  const earned = badges.filter(b => b.earned)
  const locked = badges.filter(b => !b.earned)

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Badges</h1>
        <p className="text-sm text-gray-500 mt-0.5">{earned.length} of {badges.length} badges unlocked</p>
      </div>

      {earned.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Earned</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {earned.map(b => (
              <div key={b.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 text-center">
                <span className="text-3xl block mb-2">{b.emoji}</span>
                <p className="text-sm font-semibold text-gray-900">{b.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{b.description}</p>
                {b.earned_at && <p className="text-xs text-indigo-500 mt-1">{new Date(b.earned_at).toLocaleDateString()}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {locked.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Locked</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {locked.map(b => (
              <div key={b.id} className="bg-white rounded-xl border border-gray-200 p-4 text-center opacity-50">
                <span className="text-3xl block mb-2 grayscale">{b.emoji}</span>
                <p className="text-sm font-semibold text-gray-700">{b.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
