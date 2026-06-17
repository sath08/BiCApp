import { useState } from 'react'
import { motion } from 'framer-motion'
import { useStudents, useTeachers, useDeactivateStudent, useAssignTeacher } from '../../hooks/useStudent'
import { getRecognitionLevel, getTeacherForStudent } from '../../lib/localStore'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import { useForm } from 'react-hook-form'
import { addStudent } from '../../lib/localStore'
import { useQueryClient } from '@tanstack/react-query'

export default function AdminStudents() {
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const { data: students = [] } = useStudents()
  const { data: teachers = [] } = useTeachers()
  const deactivate = useDeactivateStudent()
  const assignTeacher = useAssignTeacher()
  const queryClient = useQueryClient()
  const { register, handleSubmit, reset } = useForm()

  const filtered = students.filter(s =>
    `${s.first_name} ${s.last_name} ${s.school_name} ${s.anonymous_id}`.toLowerCase().includes(search.toLowerCase())
  )

  function handleAdd(data) {
    addStudent({ ...data, guardian1_name: 'Admin Added', guardian1_relationship: 'Other', guardian1_phone: 'N/A', guardian1_email: 'N/A' })
    queryClient.invalidateQueries({ queryKey: ['students'] })
    setShowAdd(false)
    reset()
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-600 to-orange-400 rounded-2xl p-5 text-white flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold mb-1">👨‍🎓 Student Management</h1>
          <p className="text-orange-100 text-sm">{students.length} registered students</p>
        </div>
        <Button variant="yellow" onClick={() => setShowAdd(true)}>+ Add Student</Button>
      </div>

      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students..."
          className="w-full bg-white border border-purple-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-400 outline-none shadow-sm"
        />
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Student', 'Grade', 'School', 'Points', 'Level', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((s, i) => {
                const { current: level } = getRecognitionLevel(s.total_points)
                return (
                  <motion.tr key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                    className="hover:bg-orange-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <p className="font-semibold text-sm text-gray-800">{s.first_name} {s.last_name}</p>
                      <p className="text-xs text-gray-400">{s.anonymous_id}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">G{s.grade}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{s.school_name}</td>
                    <td className="px-4 py-3"><span className="font-bold text-purple-700">{s.total_points}</span></td>
                    <td className="px-4 py-3 text-sm">{level.emoji} {level.name}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${s.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {s.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {s.is_active && (
                          <button onClick={() => deactivate.mutate(s.id)}
                            className="text-xs text-red-500 hover:text-red-700 font-semibold"
                          >Deactivate</button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add New Student">
        <form onSubmit={handleSubmit(handleAdd)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">First Name</label>
              <input {...register('first_name', { required: true })} className="w-full border border-purple-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-purple-400 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Last Name</label>
              <input {...register('last_name', { required: true })} className="w-full border border-purple-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-purple-400 outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Grade</label>
              <select {...register('grade', { required: true })} className="w-full border border-purple-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-purple-400 outline-none bg-white">
                {[1,2,3,4,5,6,7,8].map(g => <option key={g} value={g}>Grade {g}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Date of Birth</label>
              <input type="date" {...register('date_of_birth', { required: true })} className="w-full border border-purple-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-purple-400 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">School</label>
            <input {...register('school_name', { required: true })} className="w-full border border-purple-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-purple-400 outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">City</label>
              <input {...register('city')} defaultValue="Bellevue" className="w-full border border-purple-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-purple-400 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">State</label>
              <input {...register('state')} defaultValue="WA" className="w-full border border-purple-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-purple-400 outline-none" />
            </div>
          </div>
          <Button type="submit" variant="primary" fullWidth>Add Student</Button>
        </form>
      </Modal>
    </div>
  )
}
