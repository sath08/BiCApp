import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { mockEssays, mockPendingReviews } from '../lib/mockData'

export function useEssays(studentId) {
  return useQuery({
    queryKey: ['essays', studentId],
    queryFn: async () => mockEssays,
    enabled: !!studentId,
  })
}

export function useEssay(id) {
  return useQuery({
    queryKey: ['essay', id],
    queryFn: async () => mockEssays.find(e => e.id === id) || null,
    enabled: !!id,
  })
}

export function useSubmitEssay() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data) => {
      console.log('Submitting essay:', data)
      return { id: Date.now().toString(), ...data, status: 'submitted', submitted_at: new Date().toISOString() }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['essays'] })
    },
  })
}

export function usePendingReviews(teacherId) {
  return useQuery({
    queryKey: ['pending-reviews', teacherId],
    queryFn: async () => mockPendingReviews,
    enabled: !!teacherId,
  })
}

export function useSubmitReview() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data) => {
      console.log('Submitting review:', data)
      return { id: Date.now().toString(), ...data }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-reviews'] })
    },
  })
}
