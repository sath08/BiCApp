import { motion } from 'framer-motion'

export default function ProgressBar({ value, max = 100, color = 'purple', label, showPercent = false, height = 'md' }) {
  const pct = Math.min(100, Math.round((value / max) * 100))

  const colors = {
    purple: 'bg-gradient-to-r from-purple-600 to-purple-400',
    orange: 'bg-gradient-to-r from-orange-500 to-orange-300',
    teal: 'bg-gradient-to-r from-teal-700 to-teal-500',
    yellow: 'bg-gradient-to-r from-yellow-500 to-yellow-300',
    green: 'bg-gradient-to-r from-green-600 to-green-400',
  }

  const heights = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
    xl: 'h-5',
  }

  return (
    <div className="w-full">
      {(label || showPercent) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-sm font-medium text-gray-600">{label}</span>}
          {showPercent && <span className="text-sm font-bold text-purple-700">{pct}%</span>}
        </div>
      )}
      <div className={`w-full bg-purple-100 rounded-full overflow-hidden ${heights[height]}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`h-full rounded-full ${colors[color]} relative overflow-hidden`}
        >
          <div className="absolute inset-0 shimmer" />
        </motion.div>
      </div>
    </div>
  )
}
