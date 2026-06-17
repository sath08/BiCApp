import { useState } from 'react'
import { useTeachers, useAddTeacher, useDeactivateTeacher } from '../../hooks/useStudent'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import { useForm } from 'react-hook-form'

export default function AdminTeachers() {
  const [showAdd, setShowAdd] = useState(false)
  const { data: teachers = [] } = useTeachers()
  const addTeacher = useAddTeacher()
  const deactivate = useDeactivateTeacher()
  const { register, handleSubmit, reset } = useForm()

  function handleAdd(data) {
    addTeacher.mutate(data)
    setShowAdd(false)
    reset()
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-600 to-orange-400 rounded-2xl p-5 text-white flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold mb-1">👩‍🏫 Teacher Management</h1>
          <p className="text-orange-100 text-sm">{teachers.length} teachers</p>
        </div>
        <Button variant="yellow" onClick={() => setShowAdd(true)}>+ Add Teacher</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {teachers.map(t => (
          <Card key={t.id} className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="w-14 h-14 bg-gradient-to-br from-teal-600 to-teal-400 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                {t.full_name.split(' ').map(n => n[0]).join('')}
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${t.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {t.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div>
              <p className="font-bold text-gray-900">{t.full_name}</p>
              <p className="text-sm text-gray-500">{t.email}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
              <div className="text-center">
                <p className="font-extrabold text-purple-700 text-xl">{t.student_count ?? 0}</p>
                <p className="text-xs text-gray-400">Students</p>
              </div>
              <div className="text-center">
                <p className={`font-extrabold text-xl ${(t.pending_reviews ?? 0) > 3 ? 'text-red-500' : 'text-green-500'}`}>{t.pending_reviews ?? 0}</p>
                <p className="text-xs text-gray-400">Pending</p>
              </div>
            </div>
            <div className="flex gap-2">
              {t.is_active && (
                <button
                  onClick={() => deactivate.mutate(t.id)}
                  className="flex-1 text-xs border border-gray-200 rounded-xl py-2 font-semibold text-gray-600 hover:border-red-300 hover:text-red-500 transition-colors"
                >Deactivate</button>
              )}
            </div>
          </Card>
        ))}
      </div>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add New Teacher">
        <form onSubmit={handleSubmit(handleAdd)} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
            <input {...register('full_name', { required: true })} className="w-full border border-purple-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-400 outline-none" placeholder="e.g. Ms. Johnson" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input type="email" {...register('email', { required: true })} className="w-full border border-purple-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-400 outline-none" placeholder="teacher@bic.edu" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input type="password" {...register('password', { required: true })} className="w-full border border-purple-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-400 outline-none" placeholder="Set initial password" />
          </div>
          <Button type="submit" variant="primary" fullWidth loading={addTeacher.isPending}>Add Teacher</Button>
        </form>
      </Modal>
    </div>
  )
}
