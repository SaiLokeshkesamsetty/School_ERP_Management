
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AttendanceMarking from './pages/teacher/AttendanceMarking';
import TeacherTimetable from './pages/teacher/TeacherTimetable';
import AttendanceView from './pages/student/AttendanceView';
import StudentTimetable from './pages/student/StudentTimetable';
import ResultView from './pages/student/ResultView';
import ExamSchedule from './pages/admin/ExamSchedule';
import Announcements from './pages/Announcements';
import Messages from './pages/Messages';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import UserManagement from './pages/admin/UserManagement';
import StudentManagement from './pages/admin/StudentManagement';
import TeacherManagement from './pages/admin/TeacherManagement';
import ParentManagement from './pages/admin/ParentManagement';
import ClassManagement from './pages/admin/ClassManagement';
import AttendanceManagement from './pages/admin/AttendanceManagement';

import PlaceholderPage from './components/PlaceholderPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes with Sidebar Layout */}
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
                <Sidebar />
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                  <Navbar />
                  <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/announcements" element={<Announcements />} />
                      <Route path="/communication" element={<Announcements />} /> {/* Alias */}
                      <Route path="/messages" element={<Messages />} />

                      {/* Admin Modules */}
                      <Route path="/admin/users" element={<UserManagement />} />
                      <Route path="/admin/exams" element={<ExamSchedule />} />
                      <Route path="/students" element={<StudentManagement />} />
                      <Route path="/teachers" element={<TeacherManagement />} />
                      <Route path="/parents" element={<ParentManagement />} />
                      <Route path="/classes" element={<ClassManagement />} />
                      <Route path="/admin/attendance" element={<AttendanceManagement />} />
                      <Route path="/admin/results" element={<PlaceholderPage title="Results & Analytics" />} />
                      <Route path="/settings" element={<PlaceholderPage title="System Settings" />} />

                      {/* Teacher Modules */}
                      <Route path="/teacher/attendance" element={<AttendanceMarking />} />
                      <Route path="/teacher/timetable" element={<TeacherTimetable />} />

                      {/* Student Modules */}
                      <Route path="/student/attendance" element={<AttendanceView />} />
                      <Route path="/student/timetable" element={<StudentTimetable />} />
                      <Route path="/student/results" element={<ResultView />} />
                    </Routes>
                  </div>
                </div>
              </div>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
