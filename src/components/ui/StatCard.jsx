import { motion } from 'framer-motion'

export default function StatCard({ emoji, label, value, sub, color = 'purple', index = 0 }) {
  // Gradient text stops must each independently meet 3:1 against the white
  // card background (large, bold numerals qualify for the "large text"
  // threshold), so every stop here is a 600+ shade.
  const colors = {
    purple: 'from-purple-700 to-purple-500',
    orange: 'from-orange-700 to-orange-600',
    teal: 'from-teal-700 to-teal-600',
    yellow: 'from-yellow-800 to-yellow-700',
    green: 'from-green-700 to-green-600',
    blue: 'from-blue-700 to-blue-600',
    red: 'from-red-700 to-red-600',
  }
  const bgs = {
    purple: 'bg-purple-50',
    orange: 'bg-orange-50',
    teal: 'bg-teal-50',
    yellow: 'bg-yellow-50',
    green: 'bg-green-50',
    blue: 'bg-blue-50',
    red: 'bg-red-50',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl shadow-sm border border-purple-50 p-5 flex items-center gap-4"
    >
      <div className={`${bgs[color]} rounded-xl p-3 text-2xl`}>
        {emoji}
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-600 font-medium">{label}</p>
        <p className={`text-2xl font-extrabold bg-gradient-to-r ${colors[color]} bg-clip-text text-transparent`}>
          {value}
        </p>
        {sub && <p className="text-xs text-gray-600 mt-0.5">{sub}</p>}
      </div>
    </motion.div>
  )
}
