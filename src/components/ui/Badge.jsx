const colorMap = {
  purple: 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100',
  orange: 'bg-orange-50 text-orange-700 ring-1 ring-orange-100',
  teal:   'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100',
  yellow: 'bg-amber-50 text-amber-700 ring-1 ring-amber-100',
  green:  'bg-green-50 text-green-700 ring-1 ring-green-100',
  red:    'bg-red-50 text-red-600 ring-1 ring-red-100',
  blue:   'bg-blue-50 text-blue-700 ring-1 ring-blue-100',
  gray:   'bg-gray-100 text-gray-600 ring-1 ring-gray-200',
}

const statusMap = {
  draft:              'bg-gray-100 text-gray-500',
  submitted:          'bg-blue-50 text-blue-700 ring-1 ring-blue-100',
  under_review:       'bg-amber-50 text-amber-700 ring-1 ring-amber-100',
  revision_requested: 'bg-orange-50 text-orange-700 ring-1 ring-orange-100',
  editing:            'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100',
  approved:           'bg-green-50 text-green-700 ring-1 ring-green-100',
}

const statusLabels = {
  draft:              'Draft',
  submitted:          'Submitted',
  under_review:       'Under Review',
  revision_requested: 'Revision Needed',
  editing:            'Editing',
  approved:           '✓ Approved',
}

export default function Badge({ children, color = 'purple', className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${colorMap[color] || colorMap.gray} ${className}`}>
      {children}
    </span>
  )
}

export function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${statusMap[status] || statusMap.draft}`}>
      {statusLabels[status] || status}
    </span>
  )
}
