import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getEssays, getEssayById, addEssay, updateEssay,
  getPendingReviews, getCompletedReviews, submitReview,
} from '../lib/db'

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
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ studentId, data, asDraft }) => addEssay(studentId, data, asDraft),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['essays'] }),
  })
}

export function useUpdateEssay() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, updates }) => updateEssay(id, updates),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['essays'] }),
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

export function useSubmitReview() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ essayId, reviewData }) => submitReview(essayId, reviewData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['pending-reviews'] })
      qc.invalidateQueries({ queryKey: ['essays'] })
    },
  })
}
