import { useQuery } from '@tanstack/react-query'
import { mockCurrentStudent } from '../lib/mockData'

export function useStudent(studentId) {
  return useQuery({
    queryKey: ['student', studentId],
    queryFn: async () => {
      // In production: fetch from supabase
      return mockCurrentStudent
    },
    enabled: !!studentId,
  })
}
