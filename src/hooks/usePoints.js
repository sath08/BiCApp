import { useQuery } from '@tanstack/react-query'
import { mockPointsLedger } from '../lib/mockData'

export function usePoints(studentId) {
  return useQuery({
    queryKey: ['points', studentId],
    queryFn: async () => {
      return {
        ledger: mockPointsLedger,
        total: mockPointsLedger.reduce((sum, p) => sum + p.points, 0),
      }
    },
    enabled: !!studentId,
  })
}
