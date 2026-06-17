import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getReadingLogs, addReadingLog as storeAddLog } from '../lib/localStore'
import { useStudentContext } from '../contexts/StudentContext'

export function useReadingLogs(studentId) {
  return useQuery({
    queryKey: ['reading-logs', studentId],
    queryFn: () => getReadingLogs(studentId),
    enabled: !!studentId,
  })
}

export function useAddReadingLog() {
  const queryClient = useQueryClient()
  const { student } = useStudentContext()
  return useMutation({
    mutationFn: (data) => storeAddLog(student.studentId, data, student.grade),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reading-logs'] })
      queryClient.invalidateQueries({ queryKey: ['points'] })
      queryClient.invalidateQueries({ queryKey: ['student'] })
      queryClient.invalidateQueries({ queryKey: ['badges'] })
    },
  })
}
