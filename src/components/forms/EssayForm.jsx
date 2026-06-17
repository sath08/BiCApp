import { useForm } from 'react-hook-form'
import Button from '../ui/Button'

const ESSAY_TYPES = [
  'Book Review', 'Story Summary', 'Character Analysis', 'Creative Writing',
  'Theme Essay', 'Poetry Response', 'Compare & Contrast', 'Predictions & Reflections', 'Other'
]

export default function EssayForm({ onSubmit, onSaveDraft, loading = false }) {
  const { register, handleSubmit, formState: { errors }, watch } = useForm()
  const essayText = watch('essay_text', '')

  function handleSubmitEssay(data) {
    onSubmit({ ...data, status: 'submitted' })
  }

  function handleDraft() {
    const values = watch()
    onSaveDraft?.({ ...values, status: 'draft' })
  }

  return (
    <form onSubmit={handleSubmit(handleSubmitEssay)} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Assignment Type 📋</label>
          <select
            {...register('assignment_type', { required: 'Required' })}
            className="w-full border border-purple-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-400 outline-none bg-white"
          >
            <option value="">Select type...</option>
            <option value="weekly">Weekly Writing (1 pt)</option>
            <option value="monthly">Monthly Essay (2 pts)</option>
          </select>
          {errors.assignment_type && <p className="text-red-500 text-xs mt-1">{errors.assignment_type.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Essay Type ✍️</label>
          <select
            {...register('essay_type', { required: 'Required' })}
            className="w-full border border-purple-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-400 outline-none bg-white"
          >
            <option value="">Select type...</option>
            {ESSAY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          {errors.essay_type && <p className="text-red-500 text-xs mt-1">{errors.essay_type.message}</p>}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Book Title 📖</label>
          <input
            type="text"
            {...register('book_title', { required: 'Required' })}
            placeholder="Title of the book"
            className="w-full border border-purple-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-400 outline-none"
          />
          {errors.book_title && <p className="text-red-500 text-xs mt-1">{errors.book_title.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Author 🖊️</label>
          <input
            type="text"
            {...register('author', { required: 'Required' })}
            placeholder="Author name"
            className="w-full border border-purple-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-400 outline-none"
          />
          {errors.author && <p className="text-red-500 text-xs mt-1">{errors.author.message}</p>}
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-semibold text-gray-700">Your Essay 📝</label>
          <span className="text-xs text-gray-400">{essayText.length} characters</span>
        </div>
        <textarea
          {...register('essay_text', { required: 'Essay text is required', minLength: { value: 50, message: 'Must be at least 50 characters' } })}
          rows={10}
          placeholder="Start writing your essay here... Be creative and thoughtful! ✨"
          className="w-full border border-purple-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-400 outline-none resize-none leading-relaxed"
        />
        {errors.essay_text && <p className="text-red-500 text-xs mt-1">{errors.essay_text.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Attach File (Optional) 📎</label>
        <input
          type="file"
          {...register('file')}
          accept=".pdf,.doc,.docx"
          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200 cursor-pointer"
        />
        <p className="text-xs text-gray-400 mt-1">PDF, DOC, or DOCX files only</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button type="button" variant="outline" onClick={handleDraft} className="flex-1">
          💾 Save Draft
        </Button>
        <Button type="submit" variant="primary" loading={loading} className="flex-1 sm:flex-2">
          🚀 Submit Essay
        </Button>
      </div>
    </form>
  )
}
