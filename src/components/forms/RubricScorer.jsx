import { Controller } from 'react-hook-form'

const CRITERIA = [
  { key: 'score_content', label: 'Content Understanding', emoji: '🧠', desc: 'Comprehension of the text' },
  { key: 'score_organization', label: 'Organization', emoji: '📐', desc: 'Structure and flow' },
  { key: 'score_vocabulary', label: 'Vocabulary', emoji: '📚', desc: 'Word choice and variety' },
  { key: 'score_grammar', label: 'Grammar & Mechanics', emoji: '✅', desc: 'Spelling, punctuation, grammar' },
  { key: 'score_critical_thinking', label: 'Critical Thinking', emoji: '💡', desc: 'Analysis and insight' },
  { key: 'score_creativity', label: 'Creativity', emoji: '🎨', desc: 'Original ideas and expression' },
]

function StarScore({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className={`text-2xl transition-transform hover:scale-110 ${star <= value ? 'text-yellow-400' : 'text-gray-200'}`}
        >
          ★
        </button>
      ))}
      <span className="ml-1 text-sm font-semibold text-gray-600 self-center">{value || 0}/5</span>
    </div>
  )
}

export default function RubricScorer({ control, errors }) {
  return (
    <div className="space-y-4">
      <h3 className="font-bold text-gray-800 flex items-center gap-2">
        <span>⭐</span> Rubric Scoring
      </h3>
      {CRITERIA.map(c => (
        <div key={c.key} className="flex items-start justify-between gap-4 p-3 bg-gray-50 rounded-xl">
          <div>
            <div className="font-semibold text-sm text-gray-800">{c.emoji} {c.label}</div>
            <div className="text-xs text-gray-500">{c.desc}</div>
            {errors?.[c.key] && <p className="text-red-500 text-xs mt-1">{errors[c.key].message}</p>}
          </div>
          <Controller
            name={c.key}
            control={control}
            rules={{ required: 'Required', min: 1 }}
            render={({ field }) => (
              <StarScore value={field.value} onChange={field.onChange} />
            )}
          />
        </div>
      ))}
    </div>
  )
}
