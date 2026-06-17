import { motion } from 'framer-motion'
import { useStudentContext } from '../../contexts/StudentContext'
import { useBadges } from '../../hooks/useStudent'
import { BADGE_DEFINITIONS } from '../../lib/points'

export default function Badges() {
  const { student } = useStudentContext()
  const { data: badges = [] } = useBadges(student?.studentId)
  const earnedTypes = new Set(badges.map(b => b.badge_type))

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-5 text-white">
        <h1 className="text-2xl font-extrabold mb-1">🏅 Badges & Achievements</h1>
        <p className="text-yellow-100 text-sm">{badges.length} of {BADGE_DEFINITIONS.length} badges earned</p>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-purple-50 shadow-sm">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">Badge Collection</span>
          <span className="text-sm font-bold text-yellow-600">{badges.length}/{BADGE_DEFINITIONS.length}</span>
        </div>
        <div className="flex gap-1">
          {BADGE_DEFINITIONS.map((b) => (
            <div key={b.type} className={`h-3 flex-1 rounded-full ${earnedTypes.has(b.type) ? 'bg-yellow-400' : 'bg-gray-200'}`} />
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-bold text-purple-900 mb-3">✨ Earned Badges</h2>
        {BADGE_DEFINITIONS.filter(b => earnedTypes.has(b.type)).length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">No badges yet — keep reading and writing! 🚀</p>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {BADGE_DEFINITIONS.filter(b => earnedTypes.has(b.type)).map((badge, i) => {
            const earned = badges.find(b2 => b2.badge_type === badge.type)
            return (
              <motion.div key={badge.type} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.08, type: 'spring' }}
                className="bg-white rounded-2xl p-5 text-center shadow-sm border-2 border-yellow-200 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-16 h-16 opacity-5 text-6xl flex items-center justify-center">⭐</div>
                <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }} className="text-5xl mb-3">
                  {badge.emoji}
                </motion.div>
                <p className="font-bold text-gray-800 text-sm mb-1">{badge.name}</p>
                <p className="text-xs text-gray-400">{badge.description}</p>
                {earned && <p className="text-xs text-yellow-600 font-semibold mt-2">{new Date(earned.earned_at).toLocaleDateString()}</p>}
                <div className="absolute top-2 right-2">
                  <span className="text-xs bg-yellow-100 text-yellow-700 font-bold px-1.5 py-0.5 rounded-full">✓</span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      <div>
        <h2 className="font-bold text-gray-500 mb-3">🔒 Locked Badges</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {BADGE_DEFINITIONS.filter(b => !earnedTypes.has(b.type)).map((badge, i) => (
            <motion.div key={badge.type} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-gray-50 rounded-2xl p-5 text-center border border-gray-200 opacity-60"
            >
              <div className="text-5xl mb-3 grayscale">{badge.emoji}</div>
              <p className="font-bold text-gray-500 text-sm mb-1">{badge.name}</p>
              <p className="text-xs text-gray-400">{badge.description}</p>
              <div className="mt-2 text-lg">🔒</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
