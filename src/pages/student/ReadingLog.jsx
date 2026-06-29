import { useForm } from 'react-hook-form'
import { useStudentContext } from '../../contexts/StudentContext'
import { useReadingLogs, useAddReadingLog } from '../../hooks/useReadingLog'
import Button from '../../components/ui/Button'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

export default function ReadingLog() {
  const { student } = useStudentContext()
  const { data: logs = [] } = useReadingLogs(student?.studentId)
  const addLog = useAddReadingLog()
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { date: new Date().toISOString().slice(0, 10) }
  })
  const [success, setSuccess] = useState(false)

  async function onSubmit(data) {
    await addLog.mutateAsync(data)
    setSuccess(true)
    reset({ date: new Date().toISOString().slice(0, 10) })
    setTimeout(() => setSuccess(false), 3000)
  }

  const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow'
  const labelCls = 'block text-xs font-medium text-gray-600 mb-1'

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Reading Log</h1>
        <p className="text-sm text-gray-500 mt-0.5">Log your daily reading session to earn points and keep your streak</p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
        <AnimatePresence>
          {success && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mb-4 px-4 py-3 bg-green-50 border border-green-100 rounded-lg text-sm text-green-700 font-medium"
            >
              ✓ Reading session logged! +1 point earned
            </motion.div>
          )}
        </AnimatePresence>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className={labelCls}>Book Title</label>
              <input {...register('book_title', { required: 'Required' })} className={inputCls} placeholder="Enter book title" />
              {errors.book_title && <p className="text-xs text-red-500 mt-1">{errors.book_title.message}</p>}
            </div>
            <div>
              <label className={labelCls}>Author</label>
              <input {...register('author', { required: 'Required' })} className={inputCls} placeholder="Author name" />
            </div>
            <div>
              <label className={labelCls}>Date</label>
              <input type="date" {...register('date', { required: 'Required' })} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Minutes Read</label>
              <input type="number" {...register('minutes_read', { required: 'Required', min: 1 })} className={inputCls} placeholder="e.g. 30" />
            </div>
            <div>
              <label className={labelCls}>Pages Read</label>
              <input type="number" {...register('pages_read')} className={inputCls} placeholder="optional" />
            </div>
          </div>
          <div>
            <label className={labelCls}>Notes (optional)</label>
            <textarea {...register('notes')} rows={2} className={inputCls + ' resize-none'} placeholder="What happened in today's reading?" />
          </div>
          <Button type="submit" variant="primary" loading={addLog.isPending} size="lg">Log reading session</Button>
        </form>
      </div>

      {/* History */}
      {logs.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 dark:border-gray-700">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">History</p>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700 dark:divide-gray-700">
            {logs.map(log => (
              <div key={log.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{log.book_title}</p>
                  <p className="text-xs text-gray-400">{log.author} · {new Date(log.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700">{log.minutes_read}m</p>
                  {log.points_earned > 0 && <p className="text-xs text-indigo-600">+{log.points_earned} pt</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
