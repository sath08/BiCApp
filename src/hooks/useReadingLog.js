import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getReadingLogs, addReadingLog } from '../lib/db'
import { useStudentContext } from '../contexts/StudentContext'

export function useReadingLogs(studentId) {
  return useQuery({
    queryKey: ['reading-logs', studentId],
    queryFn: () => getReadingLogs(studentId),
    enabled: !!studentId,
  })
}

export function useAddReadingLog() {
  const qc = useQueryClient()
  const { student } = useStudentContext()
  return useMutation({
    mutationFn: (data) => addReadingLog(student.studentId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reading-logs'] })
      qc.invalidateQueries({ queryKey: ['points'] })
      qc.invalidateQueries({ queryKey: ['student'] })
    },
  })
}
