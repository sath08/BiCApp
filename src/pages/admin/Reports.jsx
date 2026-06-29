import { useQuery } from '@tanstack/react-query'
import { getStudents, getReadingLogs, getAllEssays } from '../../lib/localStore'

function getAllPoints() {
  try { return JSON.parse(localStorage.getItem('bic_points') || '[]') } catch { return [] }
}

function StatRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-100 dark:border-gray-700 dark:border-gray-700 last:border-0">
      <span className="text-sm text-gray-600 dark:text-gray-300">{label}</span>
      <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{value}</span>
    </div>
  )
}

export default function AdminReports() {
  const { data: students = [] } = useQuery({ queryKey: ['students'], queryFn: getStudents })
  const { data: logs = [] } = useQuery({ queryKey: ['reading-logs'], queryFn: getReadingLogs })
  const { data: submissions = [] } = useQuery({ queryKey: ['writing-submissions'], queryFn: getAllEssays })
  const { data: points = [] } = useQuery({ queryKey: ['points'], queryFn: getAllPoints })

  const totalPoints = points.reduce((s, p) => s + p.points, 0)
  const totalPages = logs.reduce((s, l) => s + (l.pages_read || 0), 0)
  const approved = submissions.filter(s => s.status === 'approved').length
  const pending = submissions.filter(s => s.status === 'pending').length

  const byGrade = students.reduce((acc, s) => {
    acc[s.grade] = (acc[s.grade] || 0) + 1
    return acc
  }, {})

  function exportCSV() {
    const rows = [['Student ID','First Name','Last Name','Grade','School','Total Points']]
    const ptsByStudent = points.reduce((a, p) => { a[p.student_id] = (a[p.student_id] || 0) + p.points; return a }, {})
    students.forEach(s => rows.push([s.id, s.first_name, s.last_name, s.grade, s.school_name, ptsByStudent[s.id] || 0]))
    const csv = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'bic-report.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Reports</h1>
          <p className="text-sm text-gray-500 mt-0.5">Program summary and data exports</p>
        </div>
        <button onClick={exportCSV}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Students', value: students.length, bg: 'bg-indigo-100', text: 'text-indigo-600' },
          { label: 'Total Points', value: totalPoints.toLocaleString(), bg: 'bg-amber-100', text: 'text-amber-600' },
          { label: 'Pages Read', value: totalPages.toLocaleString(), bg: 'bg-emerald-100', text: 'text-emerald-600' },
          { label: 'Submissions', value: submissions.length, bg: 'bg-rose-100', text: 'text-rose-600' },
        ].map(s => (
          <div key={s.label} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4">
            <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center mb-3`}>
              <span className={`text-sm font-bold ${s.text}`}>#</span>
            </div>
            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Writing Submissions</h2>
          <StatRow label="Pending Review" value={pending} />
          <StatRow label="Approved" value={approved} />
          <StatRow label="Total Submitted" value={submissions.length} />
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Students by Grade</h2>
          {Object.entries(byGrade).sort(([a],[b]) => a-b).map(([g, n]) => (
            <StatRow key={g} label={`Grade ${g}`} value={n} />
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-1">Data Exports</h2>
        <p className="text-xs text-gray-500 mb-4">Download program data as CSV files for external analysis.</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { label: 'Student Roster', desc: 'All students with grades and schools', fn: exportCSV },
            { label: 'Points Summary', desc: 'Per-student point totals', fn: exportCSV },
            { label: 'Reading Log', desc: 'All reading log entries', fn: exportCSV },
          ].map(e => (
            <button key={e.label} onClick={e.fn}
              className="text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{e.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{e.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
