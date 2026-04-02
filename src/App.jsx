import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Placeholders for Pages
import LoginPage from './pages/LoginPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import NoticeBoard from './pages/NoticeBoard';
import AssignmentsPage from './pages/AssignmentsPage';
import AttendancePage from './pages/AttendancePage';
import SubjectsPage from './pages/SubjectsPage';
import StudyMaterialsPage from './pages/StudyMaterialsPage';



function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>;

  return (
    <Routes>
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
      <Route path="/change-password" element={user && user.firstLogin ? <ChangePasswordPage /> : <Navigate to="/" />} />

      {/* Protected Routes inside Layout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/subjects" element={<SubjectsPage />} />
          </Route>

          {/* Teacher Routes */}
          <Route element={<ProtectedRoute allowedRoles={['TEACHER']} />}>
            <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
          </Route>

          {/* Student Routes */}
          <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
            <Route path="/student-dashboard" element={<StudentDashboard />} />
          </Route>

          {/* Shared Routes */}
          <Route path="/notices" element={<NoticeBoard />} />
          <Route path="/assignments" element={<AssignmentsPage />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/materials" element={<StudyMaterialsPage />} />

          {/* Default Route */}
          <Route
            path="/"
            element={
              user?.role === 'ADMIN' ? <Navigate to="/admin-dashboard" replace /> :
                user?.role === 'TEACHER' ? <Navigate to="/teacher-dashboard" replace /> :
                  <Navigate to="/student-dashboard" replace />
            }
          />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
