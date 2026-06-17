import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getPoints, awardBonusPoints } from '../lib/localStore'

export function usePoints(studentId) {
  return useQuery({
    queryKey: ['points', studentId],
    queryFn: () => getPoints(studentId),
    enabled: !!studentId,
  })
}

export function useAwardBonusPoints() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ studentId, points, description, teacherName }) =>
      awardBonusPoints(studentId, points, description, teacherName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['points'] })
      queryClient.invalidateQueries({ queryKey: ['student'] })
    },
  })
}
