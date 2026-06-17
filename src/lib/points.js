// Point calculation helpers

export const RECOGNITION_LEVELS = [
  { name: 'Story Explorer', emoji: '🌱', minPoints: 0, maxPoints: 24, color: '#10B981', bgColor: '#D1FAE5' },
  { name: 'Story Explorer', emoji: '🌱', minPoints: 25, maxPoints: 74, color: '#10B981', bgColor: '#D1FAE5' },
  { name: 'Chapter Adventurer', emoji: '⚔️', minPoints: 75, maxPoints: 149, color: '#3B82F6', bgColor: '#DBEAFE' },
  { name: 'Book Voyager', emoji: '🚀', minPoints: 150, maxPoints: 249, color: '#8B5CF6', bgColor: '#EDE9FE' },
  { name: 'Novel Navigator', emoji: '🧭', minPoints: 250, maxPoints: 399, color: '#F59E0B', bgColor: '#FEF3C7' },
  { name: 'Future Novelist', emoji: '🏆', minPoints: 400, maxPoints: null, color: '#EF4444', bgColor: '#FEE2E2' },
]

export function getRecognitionLevel(points) {
  if (points >= 400) return RECOGNITION_LEVELS[5]
  if (points >= 250) return RECOGNITION_LEVELS[4]
  if (points >= 150) return RECOGNITION_LEVELS[3]
  if (points >= 75) return RECOGNITION_LEVELS[2]
  if (points >= 25) return RECOGNITION_LEVELS[1]
  return RECOGNITION_LEVELS[0]
}

export function getNextLevel(points) {
  if (points >= 400) return null
  if (points >= 250) return { name: 'Future Novelist', threshold: 400 }
  if (points >= 150) return { name: 'Novel Navigator', threshold: 250 }
  if (points >= 75) return { name: 'Book Voyager', threshold: 150 }
  if (points >= 25) return { name: 'Chapter Adventurer', threshold: 75 }
  return { name: 'Story Explorer', threshold: 25 }
}

export function getLevelProgress(points) {
  const current = getRecognitionLevel(points)
  const next = getNextLevel(points)
  if (!next) return 100
  const range = next.threshold - current.minPoints
  const progress = points - current.minPoints
  return Math.min(100, Math.round((progress / range) * 100))
}

export function calculateReadingPoints(minutesRead, grade) {
  const minimum = grade <= 5 ? 30 : 45
  return minutesRead >= minimum ? 1 : 0
}

export const BADGE_DEFINITIONS = [
  { type: 'streak_3', name: '3-Day Reader', emoji: '🔥', description: 'Read 3 days in a row', color: '#F97316' },
  { type: 'streak_7', name: '7-Day Reader', emoji: '🔥🔥', description: 'Read 7 days in a row', color: '#EF4444' },
  { type: 'streak_30', name: '30-Day Reader', emoji: '⚡', description: 'Read 30 days in a row', color: '#8B5CF6' },
  { type: 'streak_100', name: '100-Day Reader', emoji: '💎', description: 'Read 100 days in a row', color: '#EAB308' },
  { type: 'first_book', name: 'First Book Completed', emoji: '📚', description: 'Completed your first book', color: '#10B981' },
  { type: 'streak_master', name: 'Reading Streak Master', emoji: '🏅', description: 'Achieved a 7-day streak', color: '#F59E0B' },
  { type: 'book_collector', name: 'Book Collector', emoji: '🗂️', description: 'Logged 10 different books', color: '#3B82F6' },
  { type: 'first_essay', name: 'First Essay Submitted', emoji: '✍️', description: 'Submitted your first essay', color: '#6B21A8' },
  { type: 'creative_writer', name: 'Creative Writer', emoji: '🎨', description: 'Submitted a Creative Writing essay', color: '#EC4899' },
  { type: 'essay_explorer', name: 'Essay Explorer', emoji: '🔍', description: 'Submitted 5 different essay types', color: '#0D9488' },
  { type: 'writing_champion', name: 'Writing Champion', emoji: '🏆', description: 'Had 10 essays approved', color: '#EAB308' },
]

export function getBadgeDefinition(type) {
  return BADGE_DEFINITIONS.find(b => b.type === type) || null
}
