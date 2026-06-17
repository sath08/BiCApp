import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useStudentContext } from '../../contexts/StudentContext'
import { useEssays, useSubmitEssay } from '../../hooks/useEssays'
import EssayForm from '../../components/forms/EssayForm'
import Card from '../../components/ui/Card'
import { StatusBadge } from '../../components/ui/Badge'
import CelebrationOverlay from '../../components/ui/CelebrationOverlay'
import { mockEssays } from '../../lib/mockData'

export default function Writing() {
  const { student } = useStudentContext()
  const { data: essays = mockEssays } = useEssays(student?.studentId)
  const submitEssay = useSubmitEssay()
  const [showForm, setShowForm] = useState(false)
  const [celebration, setCelebration] = useState(false)

  async function handleSubmit(data) {
    await submitEssay.mutateAsync({ ...data, student_id: student?.studentId })
    setShowForm(false)
    setCelebration(true)
  }

  const approved = essays.filter(e => e.status === 'approved').length
  const pending = essays.filter(e => ['submitted', 'under_review'].includes(e.status)).length
  const needsRevision = essays.filter(e => e.status === 'revision_requested').length

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      <CelebrationOverlay
        show={celebration}
        title="Essay Submitted! 🎉"
        message="Your essay is now under review. Great work!"
        emoji="✍️"
        onClose={() => setCelebration(false)}
      />

      <div className="bg-gradient-to-r from-orange-600 to-orange-400 rounded-2xl p-5 text-white">
        <h1 className="text-2xl font-extrabold mb-1">✍️ Writing Hub</h1>
        <p className="text-orange-100 text-sm">Submit your essays and get expert feedback</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-purple-50">
          <div className="text-2xl font-extrabold text-green-600">{approved}</div>
          <div className="text-xs text-gray-500 mt-1">✅ Approved</div>
        </div>
        <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-purple-50">
          <div className="text-2xl font-extrabold text-blue-600">{pending}</div>
          <div className="text-xs text-gray-500 mt-1">🔍 In Review</div>
        </div>
        <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-purple-50">
          <div className="text-2xl font-extrabold text-orange-600">{needsRevision}</div>
          <div className="text-xs text-gray-500 mt-1">✏️ Needs Revision</div>
        </div>
      </div>

      {showForm ? (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-purple-900">📝 New Essay</h2>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-red-500 font-bold text-xl">×</button>
          </div>
          <EssayForm onSubmit={handleSubmit} loading={submitEssay.isPending} />
        </Card>
      ) : (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowForm(true)}
          className="w-full bg-gradient-to-r from-orange-500 to-orange-400 text-white font-bold py-4 rounded-2xl shadow-lg shadow-orange-200 flex items-center justify-center gap-2 text-lg"
        >
          ✍️ Write a New Essay
        </motion.button>
      )}

      <Card>
        <h2 className="font-bold text-purple-900 mb-4">📋 My Essays</h2>
        {essays.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <div className="text-5xl mb-3">📝</div>
            <p>No essays yet. Write your first one!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {essays.map((essay, i) => (
              <motion.div
                key={essay.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link to={`/student/writing/${essay.id}`}>
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-purple-50 transition-colors group">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-gray-800 text-sm">{essay.book_title}</p>
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full capitalize">{essay.assignment_type}</span>
                      </div>
                      <p className="text-xs text-gray-500">{essay.essay_type} • by {essay.author}</p>
                      {essay.submitted_at && (
                        <p className="text-xs text-gray-400 mt-1">
                          Submitted {new Date(essay.submitted_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <StatusBadge status={essay.status} />
                      <span className="text-xs text-purple-500 group-hover:text-purple-700 font-semibold">View →</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
