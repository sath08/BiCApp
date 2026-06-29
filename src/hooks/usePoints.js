import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getPoints, awardBonusPoints } from '../lib/db'

export function usePoints(studentId) {
  return useQuery({
    queryKey: ['points', studentId],
    queryFn: () => getPoints(studentId),
    enabled: !!studentId,
  })
}

export function useAwardBonusPoints() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ studentId, points, description, teacherName }) =>
      awardBonusPoints(studentId, points, description, teacherName),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['points'] })
      qc.invalidateQueries({ queryKey: ['students'] })
    },
  })
}
