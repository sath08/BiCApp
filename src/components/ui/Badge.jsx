const colorMap = {
  purple: 'bg-purple-100 text-purple-700 border border-purple-200',
  orange: 'bg-orange-100 text-orange-700 border border-orange-200',
  teal: 'bg-teal-100 text-teal-700 border border-teal-200',
  yellow: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
  green: 'bg-green-100 text-green-700 border border-green-200',
  red: 'bg-red-100 text-red-700 border border-red-200',
  blue: 'bg-blue-100 text-blue-700 border border-blue-200',
  gray: 'bg-gray-100 text-gray-700 border border-gray-200',
}

const statusMap = {
  draft: 'bg-gray-100 text-gray-600 border border-gray-200',
  submitted: 'bg-blue-100 text-blue-700 border border-blue-200',
  under_review: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
  revision_requested: 'bg-orange-100 text-orange-700 border border-orange-200',
  editing: 'bg-purple-100 text-purple-700 border border-purple-200',
  approved: 'bg-green-100 text-green-700 border border-green-200',
}

const statusLabels = {
  draft: '📝 Draft',
  submitted: '📤 Submitted',
  under_review: '🔍 Under Review',
  revision_requested: '✏️ Revision Needed',
  editing: '✍️ Editing',
  approved: '✅ Approved',
}

export default function Badge({ children, color = 'purple', className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${colorMap[color] || colorMap.purple} ${className}`}>
      {children}
    </span>
  )
}

export function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${statusMap[status] || statusMap.draft}`}>
      {statusLabels[status] || status}
    </span>
  )
}
