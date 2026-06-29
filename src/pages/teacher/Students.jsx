import { useAuth } from '../../contexts/AuthContext'
import { useStudentsForTeacher } from '../../hooks/useStudent'
import { getRecognitionLevel } from '../../lib/localStore'

export default function TeacherStudents() {
  const { user } = useAuth()
  const { data: students = [] } = useStudentsForTeacher(user?.id)

  return (
    <div className="max-w-3xl space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">My Students</h1>
        <p className="text-sm text-gray-500 mt-0.5">{students.length} students assigned to you</p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                {['Student', 'Grade', 'School', 'Points', 'Level'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700 dark:divide-gray-700">
              {students.map(s => {
                const { current: level } = getRecognitionLevel(s.total_points)
                return (
                  <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900 dark:text-gray-100">{s.first_name} {s.last_name}</p>
                      <p className="text-xs text-gray-400 font-mono">{s.anonymous_id}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">G{s.grade}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{s.school_name}</td>
                    <td className="px-4 py-3 font-semibold text-indigo-600">{s.total_points}</td>
                    <td className="px-4 py-3 text-gray-700">{level.emoji} {level.name}</td>
                  </tr>
                )
              })}
              {students.length === 0 && (
                <tr><td colSpan={5} className="text-center py-10 text-gray-400 text-sm">No students assigned yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
