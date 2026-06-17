import { motion } from 'framer-motion'

export default function StatCard({ emoji, label, value, sub, color = 'purple', index = 0 }) {
  const colors = {
    purple: 'from-purple-600 to-purple-400',
    orange: 'from-orange-500 to-orange-400',
    teal: 'from-teal-600 to-teal-400',
    yellow: 'from-yellow-500 to-yellow-400',
    green: 'from-green-600 to-green-400',
    blue: 'from-blue-600 to-blue-400',
    red: 'from-red-500 to-red-400',
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
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className={`text-2xl font-extrabold bg-gradient-to-r ${colors[color]} bg-clip-text text-transparent`}>
          {value}
        </p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </motion.div>
  )
}
