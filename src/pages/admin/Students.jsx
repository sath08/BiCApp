import { useState } from 'react'
import { useStudents, useDeactivateStudent } from '../../hooks/useStudent'
import { getRecognitionLevel } from '../../lib/localStore'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import { useForm } from 'react-hook-form'
import { addStudent } from '../../lib/localStore'
import { useQueryClient } from '@tanstack/react-query'

export default function AdminStudents() {
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const { data: students = [] } = useStudents()
  const deactivate = useDeactivateStudent()
  const queryClient = useQueryClient()
  const { register, handleSubmit, reset } = useForm()

  const filtered = students.filter(s =>
    `${s.first_name} ${s.last_name} ${s.school_name} ${s.anonymous_id}`.toLowerCase().includes(search.toLowerCase())
  )

  function handleAdd(data) {
    addStudent({ ...data, guardian1_name: 'Admin Added', guardian1_relationship: 'Other', guardian1_phone: 'N/A', guardian1_email: 'N/A' })
    queryClient.invalidateQueries({ queryKey: ['students'] })
    setShowAdd(false); reset()
  }

  const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow'
  const labelCls = 'block text-xs font-medium text-gray-600 mb-1'

  return (
    <div className="max-w-5xl space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Students</h1>
          <p className="text-sm text-gray-500 mt-0.5">{students.length} registered</p>
        </div>
        <Button onClick={() => setShowAdd(true)} size="md">Add Student</Button>
      </div>

      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students..."
        className={inputCls} />

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                {['Student', 'Grade', 'School', 'Points', 'Level', 'Status', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700 dark:divide-gray-700">
              {filtered.map(s => {
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
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-medium ${s.is_active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                        {s.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {s.is_active && (
                        <button onClick={() => deactivate.mutate(s.id)} className="text-xs text-red-500 hover:text-red-700 font-medium">Deactivate</button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Student">
        <form onSubmit={handleSubmit(handleAdd)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><label className={labelCls}>First Name</label><input {...register('first_name', { required: true })} className={inputCls} /></div>
            <div><label className={labelCls}>Last Name</label><input {...register('last_name', { required: true })} className={inputCls} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Grade</label>
              <select {...register('grade', { required: true })} className={inputCls + ' bg-white'}>
                {[1,2,3,4,5,6,7,8].map(g => <option key={g} value={g}>Grade {g}</option>)}
              </select>
            </div>
            <div><label className={labelCls}>Date of Birth</label><input type="date" {...register('date_of_birth', { required: true })} className={inputCls} /></div>
          </div>
          <div><label className={labelCls}>School</label><input {...register('school_name', { required: true })} className={inputCls} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className={labelCls}>City</label><input {...register('city')} defaultValue="Bellevue" className={inputCls} /></div>
            <div><label className={labelCls}>State</label><input {...register('state')} defaultValue="WA" className={inputCls} /></div>
          </div>
          <Button type="submit" variant="primary" fullWidth>Add Student</Button>
        </form>
      </Modal>
    </div>
  )
}
