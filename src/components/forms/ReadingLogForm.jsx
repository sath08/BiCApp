import { useForm } from 'react-hook-form'
import Button from '../ui/Button'

export default function ReadingLogForm({ onSubmit, grade = 4, loading = false }) {
  const minMinutes = grade <= 5 ? 30 : 45
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: { date: new Date().toISOString().split('T')[0] }
  })

  function handleFormSubmit(data) {
    onSubmit({ ...data, minutes_read: parseInt(data.minutes_read) })
    reset({ date: new Date().toISOString().split('T')[0] })
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Date 📅</label>
          <input
            type="date"
            {...register('date', { required: 'Date is required' })}
            max={new Date().toISOString().split('T')[0]}
            className="w-full border border-purple-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none"
          />
          {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Minutes Read ⏱️</label>
          <input
            type="number"
            {...register('minutes_read', {
              required: 'Minutes are required',
              min: { value: 1, message: 'Must be at least 1 minute' },
              max: { value: 1000, message: 'Maximum 1000 minutes' },
            })}
            placeholder={`Min ${minMinutes} for full credit`}
            className="w-full border border-purple-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none"
          />
          {errors.minutes_read && <p className="text-red-500 text-xs mt-1">{errors.minutes_read.message}</p>}
          <p className="text-xs text-gray-400 mt-1">Grade {grade}: minimum {minMinutes} min for 1 point</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Book Title 📖</label>
          <input
            type="text"
            {...register('book_title', { required: 'Book title is required' })}
            placeholder="What are you reading?"
            className="w-full border border-purple-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none"
          />
          {errors.book_title && <p className="text-red-500 text-xs mt-1">{errors.book_title.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Author ✍️</label>
          <input
            type="text"
            {...register('author', { required: 'Author is required' })}
            placeholder="Who wrote it?"
            className="w-full border border-purple-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none"
          />
          {errors.author && <p className="text-red-500 text-xs mt-1">{errors.author.message}</p>}
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Notes (Optional) 💬</label>
        <textarea
          {...register('notes')}
          rows={2}
          placeholder="What happened in today's reading? Any favorite moments?"
          className="w-full border border-purple-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none resize-none"
        />
      </div>
      <Button type="submit" variant="primary" fullWidth loading={loading}>
        📖 Log Reading Session
      </Button>
    </form>
  )
}
