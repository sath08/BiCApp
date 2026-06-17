import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { mockReadingLogs } from '../lib/mockData'

export function useReadingLogs(studentId) {
  return useQuery({
    queryKey: ['reading-logs', studentId],
    queryFn: async () => {
      // In production: fetch from supabase
      return mockReadingLogs
    },
    enabled: !!studentId,
  })
}

export function useAddReadingLog() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data) => {
      // In production: insert into supabase
      console.log('Adding reading log:', data)
      return { id: Date.now().toString(), ...data, points_earned: 1 }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reading-logs'] })
    },
  })
}
