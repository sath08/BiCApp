import { motion } from 'framer-motion'

export default function StreakFlame({ streak = 0, size = 'md' }) {
  const sizes = {
    sm: { text: 'text-2xl', num: 'text-lg', label: 'text-xs' },
    md: { text: 'text-4xl', num: 'text-2xl', label: 'text-sm' },
    lg: { text: 'text-6xl', num: 'text-4xl', label: 'text-base' },
  }

  const isActive = streak > 0

  return (
    <div className="flex flex-col items-center">
      <motion.div
        animate={isActive ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 1.5, repeat: Infinity }}
        className={sizes[size].text}
        style={{ filter: isActive ? 'drop-shadow(0 0 8px #F97316)' : 'grayscale(1)' }}
      >
        🔥
      </motion.div>
      <span className={`font-extrabold ${sizes[size].num} ${isActive ? 'text-orange-500' : 'text-gray-300'}`}>
        {streak}
      </span>
      <span className={`${sizes[size].label} font-semibold ${isActive ? 'text-orange-400' : 'text-gray-300'}`}>
        day streak
      </span>
    </div>
  )
}
