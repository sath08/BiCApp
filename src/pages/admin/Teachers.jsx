import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getTeachers, addTeacherAccount } from '../../lib/localStore'
import { useForm } from 'react-hook-form'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'

export default function AdminTeachers() {
  const qc = useQueryClient()
  const [open, setOpen] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const { data: teachers = [] } = useQuery({ queryKey: ['teachers'], queryFn: getTeachers })

  const add = useMutation({
    mutationFn: addTeacherAccount,
    onSuccess: () => { qc.invalidateQueries(['teachers']); reset(); setOpen(false) }
  })

  const inputCls = 'w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
  const labelCls = 'block text-xs font-medium text-gray-600 mb-1'

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Teachers</h1>
          <p className="text-sm text-gray-500 mt-0.5">{teachers.length} staff members</p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setOpen(true)}>Add Teacher</Button>
      </div>

      <div className="grid gap-3">
        {teachers.map(t => (
          <div key={t.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold text-sm flex-shrink-0">
              {t.first_name?.[0]}{t.last_name?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{t.first_name} {t.last_name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t.email}</p>
            </div>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${t.role === 'coordinator' ? 'bg-indigo-50 text-indigo-700' : 'bg-emerald-50 text-emerald-700'}`}>
              {t.role === 'coordinator' ? 'Admin' : 'Teacher'}
            </span>
            <div className="text-right">
              <p className="text-xs text-gray-500 dark:text-gray-400">Grades</p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{t.assigned_grades?.join(', ') || '—'}</p>
            </div>
          </div>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Add Teacher">
        <form onSubmit={handleSubmit(d => add.mutate(d))} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>First Name</label>
              <input {...register('first_name', { required: true })} className={inputCls} />
              {errors.first_name && <p className="text-xs text-red-500 mt-1">Required</p>}
            </div>
            <div>
              <label className={labelCls}>Last Name</label>
              <input {...register('last_name', { required: true })} className={inputCls} />
              {errors.last_name && <p className="text-xs text-red-500 mt-1">Required</p>}
            </div>
          </div>
          <div>
            <label className={labelCls}>Email</label>
            <input type="email" {...register('email', { required: true })} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Role</label>
            <select {...register('role')} className={inputCls}>
              <option value="teacher">Teacher</option>
              <option value="coordinator">Admin / Coordinator</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Password</label>
            <input type="password" {...register('password', { required: true })} className={inputCls} defaultValue="password" />
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" fullWidth onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" fullWidth loading={add.isPending}>Add</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
