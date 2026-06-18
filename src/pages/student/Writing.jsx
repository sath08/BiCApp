import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useStudentContext } from '../../contexts/StudentContext'
import { getEssays, addEssay, getWritingAssignments } from '../../lib/localStore'
import { Link } from 'react-router-dom'
import Button from '../../components/ui/Button'

const STATUS_STYLE = {
  pending:  'bg-amber-50 text-amber-700',
  approved: 'bg-emerald-50 text-emerald-700',
  needs_revision: 'bg-rose-50 text-rose-700',
}

export default function Writing() {
  const { student } = useStudentContext()
  const qc = useQueryClient()
  const [mode, setMode] = useState('list')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [assignmentId, setAssignmentId] = useState('')
  const [success, setSuccess] = useState(false)

  const { data: submissions = [] } = useQuery({
    queryKey: ['essays', student.studentId],
    queryFn: () => getEssays(student.studentId)
  })
  const { data: writingAssignments = [] } = useQuery({ queryKey: ['writing-assignments'], queryFn: () => getWritingAssignments(true) })

  const submit = useMutation({
    mutationFn: () => addEssay(student.studentId, { title, body, assignment_id: assignmentId || null }),
    onSuccess: () => {
      qc.invalidateQueries(['essays'])
      setMode('list'); setTitle(''); setBody(''); setAssignmentId(''); setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }
  })

  const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent'

  if (mode === 'write') return (
    <div className="p-6 max-w-2xl mx-auto space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={() => setMode('list')} className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back
        </button>
        <h1 className="text-xl font-bold text-gray-900">New Submission</h1>
      </div>

      {writingAssignments.length > 0 && (
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Prompt (optional)</label>
          <select value={assignmentId} onChange={e => setAssignmentId(e.target.value)} className={inputCls}>
            <option value="">Free write</option>
            {writingAssignments.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
          </select>
        </div>
      )}

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
        <input value={title} onChange={e => setTitle(e.target.value)} className={inputCls} placeholder="Give your piece a title" />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Your Writing</label>
        <textarea value={body} onChange={e => setBody(e.target.value)} rows={12} className={inputCls}
          placeholder="Write your essay, story, or reflection here..." />
        <p className="text-xs text-gray-400 mt-1">{body.split(/\s+/).filter(Boolean).length} words</p>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={() => setMode('list')}>Cancel</Button>
        <Button variant="primary" loading={submit.isPending} disabled={!title.trim() || !body.trim()} onClick={() => submit.mutate()}>
          Submit for Review
        </Button>
      </div>
    </div>
  )

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Writing</h1>
          <p className="text-sm text-gray-500 mt-0.5">{submissions.length} submissions</p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setMode('write')}>New Submission</Button>
      </div>

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 text-sm text-emerald-700">
          Submitted for review! Your teacher will provide feedback soon.
        </div>
      )}

      {writingAssignments.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Active Prompts</h2>
          <div className="space-y-2">
            {writingAssignments.map(a => (
              <div key={a.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm text-gray-900">{a.title}</p>
                  {a.description && <p className="text-xs text-gray-500 mt-0.5">{a.description}</p>}
                </div>
                <span className="text-xs font-medium text-indigo-600">{a.points_reward} pts</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        {submissions.length === 0 && (
          <div className="text-center py-12 text-sm text-gray-400">
            No submissions yet. Start writing!
          </div>
        )}
        {submissions.map(s => (
          <Link key={s.id} to={`/student/writing/${s.id}`}
            className="block bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900">{s.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{new Date(s.created_at).toLocaleDateString()}</p>
                <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">{s.body}</p>
              </div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${STATUS_STYLE[s.status] || 'bg-gray-100 text-gray-600'}`}>
                {s.status === 'needs_revision' ? 'Revision' : s.status.charAt(0).toUpperCase() + s.status.slice(1)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
