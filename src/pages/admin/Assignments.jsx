import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getWritingAssignments, addWritingAssignment } from '../../lib/localStore'
import { useForm } from 'react-hook-form'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'

const TYPES = ['reading_goal', 'writing_prompt', 'vocabulary']
const TYPE_LABELS = { reading_goal: 'Reading Goal', writing_prompt: 'Writing Prompt', vocabulary: 'Vocabulary' }
const TYPE_COLOR = { reading_goal: 'bg-indigo-50 text-indigo-700', writing_prompt: 'bg-amber-50 text-amber-700', vocabulary: 'bg-emerald-50 text-emerald-700' }

export default function Assignments() {
  const qc = useQueryClient()
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState('all')
  const { register, handleSubmit, reset } = useForm()
  const { data: assignments = [] } = useQuery({ queryKey: ['assignments'], queryFn: getWritingAssignments })

  const add = useMutation({
    mutationFn: addWritingAssignment,
    onSuccess: () => { qc.invalidateQueries(['assignments']); reset(); setOpen(false) }
  })

  const shown = filter === 'all' ? assignments : assignments.filter(a => a.type === filter)

  const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
  const labelCls = 'block text-xs font-medium text-gray-600 mb-1'

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Assignments</h1>
          <p className="text-sm text-gray-500 mt-0.5">{assignments.length} total</p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setOpen(true)}>New Assignment</Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['all', ...TYPES].map(t => (
          <button key={t} onClick={() => setFilter(t)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filter === t ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {t === 'all' ? 'All' : TYPE_LABELS[t]}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {shown.length === 0 && <p className="text-sm text-gray-400 text-center py-8">No assignments found.</p>}
        {shown.map(a => (
          <div key={a.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${TYPE_COLOR[a.type] || 'bg-gray-100 text-gray-600'}`}>{TYPE_LABELS[a.type] || a.type}</span>
                  {a.grade && <span className="text-xs text-gray-400">Grade {a.grade}</span>}
                </div>
                <p className="text-sm font-semibold text-gray-900">{a.title}</p>
                {a.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{a.description}</p>}
              </div>
              <div className="text-right flex-shrink-0">
                {a.due_date && <p className="text-xs text-gray-500">Due {new Date(a.due_date).toLocaleDateString()}</p>}
                <p className="text-xs font-medium text-indigo-600 mt-0.5">{a.points_reward ?? 0} pts</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="New Assignment">
        <form onSubmit={handleSubmit(d => add.mutate(d))} className="space-y-3">
          <div>
            <label className={labelCls}>Title</label>
            <input {...register('title', { required: true })} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Type</label>
            <select {...register('type')} className={inputCls}>
              {TYPES.map(t => <option key={t} value={t}>{TYPE_LABELS[t]}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Grade</label>
              <select {...register('grade')} className={inputCls}>
                <option value="">All grades</option>
                {[3,4,5,6,7,8].map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Points Reward</label>
              <input type="number" {...register('points_reward')} defaultValue={10} className={inputCls} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Due Date</label>
            <input type="date" {...register('due_date')} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Description</label>
            <textarea {...register('description')} rows={3} className={inputCls} />
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" fullWidth onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" fullWidth loading={add.isPending}>Create</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
