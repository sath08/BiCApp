import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getEssays, getEssayById, addEssay, submitEssayDraft,
  getPendingReviews, getCompletedReviews, submitReview, startReview,
} from '../lib/localStore'

export function useEssays(studentId) {
  return useQuery({
    queryKey: ['essays', studentId],
    queryFn: () => getEssays(studentId),
    enabled: !!studentId,
  })
}

export function useEssay(id) {
  return useQuery({
    queryKey: ['essay', id],
    queryFn: () => getEssayById(id),
    enabled: !!id,
  })
}

export function useSubmitEssay() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ studentId, data, asDraft }) => addEssay(studentId, data, asDraft),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['essays'] })
      queryClient.invalidateQueries({ queryKey: ['points'] })
      queryClient.invalidateQueries({ queryKey: ['badges'] })
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

export function useSubmitDraft() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => submitEssayDraft(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['essays'] }),
  })
}

export function usePendingReviews(teacherId) {
  return useQuery({
    queryKey: ['pending-reviews', teacherId],
    queryFn: () => getPendingReviews(teacherId),
    enabled: !!teacherId,
  })
}

export function useCompletedReviews(teacherId) {
  return useQuery({
    queryKey: ['completed-reviews', teacherId],
    queryFn: () => getCompletedReviews(teacherId),
    enabled: !!teacherId,
  })
}

export function useStartReview() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (essayId) => startReview(essayId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pending-reviews'] }),
  })
}

export function useSubmitReview() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ essayId, reviewData }) => submitReview(essayId, reviewData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-reviews'] })
      queryClient.invalidateQueries({ queryKey: ['completed-reviews'] })
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}
