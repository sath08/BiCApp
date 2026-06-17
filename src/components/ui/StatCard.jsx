const colorMap = {
  purple: { icon: 'bg-indigo-50 text-indigo-600', value: 'text-indigo-600' },
  orange: { icon: 'bg-orange-50 text-orange-500', value: 'text-orange-500' },
  teal:   { icon: 'bg-emerald-50 text-emerald-600', value: 'text-emerald-600' },
  yellow: { icon: 'bg-amber-50 text-amber-600', value: 'text-amber-600' },
  green:  { icon: 'bg-green-50 text-green-600', value: 'text-green-600' },
  blue:   { icon: 'bg-blue-50 text-blue-600', value: 'text-blue-600' },
  red:    { icon: 'bg-red-50 text-red-500', value: 'text-red-500' },
}

export default function StatCard({ emoji, label, value, sub, color = 'purple', index = 0 }) {
  const c = colorMap[color] || colorMap.purple
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-card p-4 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0 ${c.icon}`}>
        {emoji}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 font-medium truncate">{label}</p>
        <p className={`text-xl font-bold leading-tight ${c.value}`}>{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}
