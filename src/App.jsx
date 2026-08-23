import { Routes, Route, Navigate } from "react-router-dom";
import { useStudentContext } from "./contexts/StudentContext";
import { useAuth } from "./contexts/AuthContext";

// Public Pages
import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Login from "./pages/Login";

// Layouts
import StudentLayout from "./components/layout/StudentLayout";
import TeacherLayout from "./components/layout/TeacherLayout";
import AdminLayout from "./components/layout/AdminLayout";

// Student Pages
import StudentDashboard from "./pages/student/Dashboard";
import ReadingLog from "./pages/student/ReadingLog";
import Writing from "./pages/student/Writing";
import SubmissionDetail from "./pages/student/SubmissionDetail";
import Leaderboard from "./pages/student/Leaderboard";
import Badges from "./pages/student/Badges";
import Profile from "./pages/student/Profile";

// Teacher Pages
import TeacherDashboard from "./pages/teacher/Dashboard";
import TeacherStudents from "./pages/teacher/Students";
import Reviews from "./pages/teacher/Reviews";
import ReviewDetail from "./pages/teacher/ReviewDetail";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminStudents from "./pages/admin/Students";
import AdminTeachers from "./pages/admin/Teachers";
import Assignments from "./pages/admin/Assignments";
import AdminLeaderboard from "./pages/admin/Leaderboard";
import AdminReports from "./pages/admin/Reports";
import Awards from "./pages/admin/Awards";

function RequireStudent({ children }) {
  const { student, loading } = useStudentContext();
  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-purple-600 text-xl animate-pulse">
          📚 Loading...
        </div>
      </div>
    );
  if (!student) return <Navigate to="/login" replace />;
  return children;
}

function RequireTeacher({ children }) {
  const { user, userRole, loading } = useAuth();
  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-teal-600 text-xl animate-pulse">📚 Loading...</div>
      </div>
    );
  if (!user || (userRole !== "teacher" && userRole !== "coordinator"))
    return <Navigate to="/login" replace />;
  return children;
}

function RequireAdmin({ children }) {
  const { user, userRole, loading } = useAuth();
  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-orange-700 text-xl animate-pulse">
          📚 Loading...
        </div>
      </div>
    );
  if (!user || userRole !== "coordinator")
    return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      {/* Student */}
      <Route
        path="/student"
        element={
          <RequireStudent>
            <StudentLayout />
          </RequireStudent>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="reading-log" element={<ReadingLog />} />
        <Route path="writing" element={<Writing />} />
        <Route path="writing/:id" element={<SubmissionDetail />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="badges" element={<Badges />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Teacher */}
      <Route
        path="/teacher"
        element={
          <RequireTeacher>
            <TeacherLayout />
          </RequireTeacher>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        {/*  */}
        <Route path="dashboard" element={<TeacherDashboard />} />
        <Route path="students" element={<TeacherStudents />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="reviews/:id" element={<ReviewDetail />} />
      </Route>

      {/* Admin */}
      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <AdminLayout />
          </RequireAdmin>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="students" element={<AdminStudents />} />
        <Route path="teachers" element={<AdminTeachers />} />
        <Route path="assignments" element={<Assignments />} />
        <Route path="leaderboard" element={<AdminLeaderboard />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="awards" element={<Awards />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
