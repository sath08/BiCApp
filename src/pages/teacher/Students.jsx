import { useAuth } from '../../contexts/AuthContext'
import { useStudentsForTeacher } from '../../hooks/useStudent'
import { getRecognitionLevel } from '../../lib/localStore'
import Card from '../../components/ui/Card'

export default function TeacherStudents() {
  const { user } = useAuth()
  const { data: students = [] } = useStudentsForTeacher(user?.id)

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-teal-700 to-teal-500 rounded-2xl p-5 text-white">
        <h1 className="text-2xl font-extrabold mb-1">👥 My Students</h1>
        <p className="text-teal-100 text-sm">{students.length} students assigned to you</p>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Student</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Grade</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">School</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Points</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {students.map(s => {
                const { current: level } = getRecognitionLevel(s.total_points)
                return (
                  <tr key={s.id} className="hover:bg-teal-50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-sm text-gray-800">{s.first_name} {s.last_name}</p>
                      <p className="text-xs text-gray-400">{s.anonymous_id}</p>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">Grade {s.grade}</td>
                    <td className="px-5 py-4 text-sm text-gray-600">{s.school_name}</td>
                    <td className="px-5 py-4">
                      <span className="font-bold text-purple-700">{s.total_points} XP</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm">{level.emoji} {level.name}</span>
                    </td>
                  </tr>
                )
              })}
              {students.length === 0 && (
                <tr><td colSpan={5} className="text-center py-8 text-gray-400">No students assigned yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
