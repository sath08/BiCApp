import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getStudentById, getStudents, getStudentsForTeacher, addStudent,
  updateStudent, deactivateStudent, assignStudentToTeacher, getGuardiansForStudent,
  getBadges, getNotifications, markNotificationRead, markAllNotificationsRead,
  getLeaderboard, getProgramStats, getWritingAssignments, getTeachers,
  addTeacherAccount, deactivateTeacher,
} from '../lib/localStore'

export function useStudent(studentId) {
  return useQuery({
    queryKey: ['student', studentId],
    queryFn: () => getStudentById(studentId),
    enabled: !!studentId,
  })
}

export function useStudents() {
  return useQuery({
    queryKey: ['students'],
    queryFn: getStudents,
  })
}

export function useStudentsForTeacher(teacherId) {
  return useQuery({
    queryKey: ['teacher-students', teacherId],
    queryFn: () => getStudentsForTeacher(teacherId),
    enabled: !!teacherId,
  })
}

export function useAddStudent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: addStudent,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['students'] }),
  })
}

export function useUpdateStudent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, updates }) => updateStudent(id, updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['students'] }),
  })
}

export function useDeactivateStudent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deactivateStudent,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['students'] }),
  })
}

export function useAssignTeacher() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ studentId, teacherId }) => assignStudentToTeacher(studentId, teacherId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
      queryClient.invalidateQueries({ queryKey: ['teacher-students'] })
    },
  })
}

export function useGuardians(studentId) {
  return useQuery({
    queryKey: ['guardians', studentId],
    queryFn: () => getGuardiansForStudent(studentId),
    enabled: !!studentId,
  })
}

export function useBadges(studentId) {
  return useQuery({
    queryKey: ['badges', studentId],
    queryFn: () => getBadges(studentId),
    enabled: !!studentId,
  })
}

export function useNotifications(userId, userType = 'student') {
  return useQuery({
    queryKey: ['notifications', userId, userType],
    queryFn: () => getNotifications(userId, userType),
    enabled: !!userId,
    refetchInterval: 30000,
  })
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  })
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, userType }) => markAllNotificationsRead(userId, userType),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  })
}

export function useLeaderboard(gradeFilter = null, category = 'total') {
  return useQuery({
    queryKey: ['leaderboard', gradeFilter, category],
    queryFn: () => getLeaderboard(gradeFilter, category),
  })
}

export function useProgramStats() {
  return useQuery({
    queryKey: ['program-stats'],
    queryFn: getProgramStats,
  })
}

export function useWritingAssignments(activeOnly = false) {
  return useQuery({
    queryKey: ['writing-assignments', activeOnly],
    queryFn: () => getWritingAssignments(activeOnly),
  })
}

export function useTeachers() {
  return useQuery({
    queryKey: ['teachers'],
    queryFn: getTeachers,
  })
}

export function useAddTeacher() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: addTeacherAccount,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['teachers'] }),
  })
}

export function useDeactivateTeacher() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deactivateTeacher,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['teachers'] }),
  })
}
