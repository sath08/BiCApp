import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getStudentById, getStudents, getStudentsForTeacher, addStudent,
  updateStudent, getBadges, getNotifications, markNotificationRead,
  markAllNotificationsRead, getLeaderboard, getWritingAssignments,
  getTeachers, addTeacherAccount, getTeacherForStudent,
  getAllPoints, getAllEssays, getReadingLogs,
} from '../lib/db'

export function useStudent(studentId) {
  return useQuery({
    queryKey: ['student', studentId],
    queryFn: () => getStudentById(studentId),
    enabled: !!studentId,
  })
}

export function useStudents() {
  return useQuery({ queryKey: ['students'], queryFn: getStudents })
}

export function useStudentsForTeacher(teacherId) {
  return useQuery({
    queryKey: ['teacher-students', teacherId],
    queryFn: () => getStudentsForTeacher(teacherId),
    enabled: !!teacherId,
  })
}

export function useAddStudent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: addStudent,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['students'] }),
  })
}

export function useUpdateStudent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, updates }) => updateStudent(id, updates),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['students'] }),
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
  const qc = useQueryClient()
  return useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  })
}

export function useMarkAllNotificationsRead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, userType }) => markAllNotificationsRead(userId, userType),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  })
}

export function useLeaderboard() {
  return useQuery({ queryKey: ['leaderboard'], queryFn: getLeaderboard })
}

export function useWritingAssignments(activeOnly = false) {
  return useQuery({
    queryKey: ['writing-assignments', activeOnly],
    queryFn: () => getWritingAssignments(activeOnly),
  })
}

export function useTeachers() {
  return useQuery({ queryKey: ['teachers'], queryFn: getTeachers })
}

export function useAddTeacher() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: addTeacherAccount,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['teachers'] }),
  })
}

export function useTeacherForStudent(studentId) {
  return useQuery({
    queryKey: ['teacher-for-student', studentId],
    queryFn: () => getTeacherForStudent(studentId),
    enabled: !!studentId,
  })
}

export function useProgramStats() {
  const students = useQuery({ queryKey: ['students'], queryFn: getStudents })
  const teachers = useQuery({ queryKey: ['teachers'], queryFn: getTeachers })
  return useQuery({
    queryKey: ['program-stats'],
    queryFn: async () => {
      const [s, t, p, e] = await Promise.all([
        getStudents(), getTeachers(), getAllPoints(), getAllEssays()
      ])
      return {
        totalStudents: s.length,
        totalTeachers: t.length,
        totalPoints: p.reduce((sum, r) => sum + (r.points || 0), 0),
        pendingReviews: e.filter(x => x.status === 'pending').length,
      }
    },
    staleTime: 60_000,
  })
}

export function useDeactivateStudent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => updateStudent(id, { is_active: false }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['students'] }),
  })
}
