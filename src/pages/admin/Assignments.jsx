import { useState } from 'react'
import { mockAssignments } from '../../lib/mockData'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import { useForm } from 'react-hook-form'

export default function Assignments() {
  const [showAdd, setShowAdd] = useState(false)
  const [filter, setFilter] = useState('all')
  const { register, handleSubmit, reset } = useForm()

  const filtered = mockAssignments.filter(a => filter === 'all' || a.type === filter)

  function handleAdd(data) {
    console.log('Adding assignment:', data)
    setShowAdd(false)
    reset()
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-600 to-orange-400 rounded-2xl p-5 text-white flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold mb-1">📋 Assignment Management</h1>
          <p className="text-orange-100 text-sm">{mockAssignments.length} assignments created</p>
        </div>
        <Button variant="yellow" onClick={() => setShowAdd(true)}>+ Create Assignment</Button>
      </div>

      <div className="flex gap-2">
        {['all', 'weekly', 'monthly'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${filter === f ? 'bg-orange-500 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300'}`}
          >
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((a, i) => (
          <Card key={a.id}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${a.type === 'monthly' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                    {a.type === 'monthly' ? '📅 Monthly' : '📆 Weekly'}
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${a.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {a.is_active ? 'Active' : 'Inactive'}
                  </span>
                  <span className="text-xs bg-yellow-100 text-yellow-700 font-bold px-2.5 py-1 rounded-full">+{a.point_value} pt</span>
                </div>
                <h3 className="font-bold text-gray-900">{a.title}</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{a.prompt_text}</p>
                <div className="flex gap-4 mt-2 text-xs text-gray-400">
                  <span>Due: {new Date(a.due_date).toLocaleDateString()}</span>
                  <span>Grades: {a.grade_group}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="text-sm border border-gray-200 rounded-xl px-4 py-2 font-semibold text-gray-600 hover:border-orange-300 hover:text-orange-500 transition-colors">Edit</button>
                <button className="text-sm border border-gray-200 rounded-xl px-4 py-2 font-semibold text-gray-600 hover:border-red-300 hover:text-red-500 transition-colors">
                  {a.is_active ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Create Assignment" size="lg">
        <form onSubmit={handleSubmit(handleAdd)} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
            <input {...register('title', { required: true })} className="w-full border border-purple-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-400 outline-none" placeholder="Assignment title" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Type</label>
              <select {...register('type', { required: true })} className="w-full border border-purple-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-400 outline-none bg-white">
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Grade Group</label>
              <select {...register('grade_group', { required: true })} className="w-full border border-purple-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-400 outline-none bg-white">
                <option value="all">All Grades</option>
                <option value="1-5">Grades 1-5</option>
                <option value="6-8">Grades 6-8</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Due Date</label>
              <input type="date" {...register('due_date', { required: true })} className="w-full border border-purple-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-400 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Point Value</label>
              <input type="number" {...register('point_value', { required: true })} defaultValue={1} className="w-full border border-purple-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-400 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Prompt Text</label>
            <textarea {...register('prompt_text', { required: true })} rows={4} className="w-full border border-purple-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-400 outline-none resize-none" placeholder="Write the assignment prompt..." />
          </div>
          <Button type="submit" variant="primary" fullWidth>Create Assignment</Button>
        </form>
      </Modal>
    </div>
  )
}
