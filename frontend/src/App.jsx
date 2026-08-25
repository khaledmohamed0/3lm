import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";

import StudentDashboard from "./pages/student/StudentDashboard";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminStudents from "./pages/admin/AdminStudents";
import StudentDetails from "./pages/admin/StudentDetails";
import DashboardRedirect from "./pages/DashboardRedirect";

import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";
import ExamAnalysis from "./pages/student/ExamAnalysis";
import CourseDetails from "./pages/student/CourseDetails";
import LessonDetails from "./pages/student/LessonDetails";
import Exam from "./pages/student/Exam";
import Signup from "./pages/auth/Signup";
import StudentWallet from "./pages/student/StudentWallet";
import ManageCourse from "./pages/teacher/ManageCourse";
import CreateCourse from "./pages/teacher/CreateCourse";
import CreateLesson from "./pages/teacher/CreateLesson";
import EditLesson from "./pages/teacher/EditLesson";
import CreateExam from "./pages/teacher/CreateExam";
import ExamManagement from "./pages/teacher/ExamManagement";
import CreateExamQuestion from "./pages/teacher/CreateExamQuestion";
import EditExamQuestion from "./pages/teacher/EditExamQuestion";
import Teachers from "./pages/admin/Teachers";
import TeacherDetails from "./pages/admin/TeacherDetails";
import AdminCourseDetails from "./pages/admin/AdminCourseDetails";
import AdminCourses from "./pages/admin/AdminCourses";
import AllCourses from "./pages/student/AllCourses";
import TeacherCourseStudents from "./pages/teacher/TeacherCourseStudents";
import TeacherLayout from "./layouts/TeacherLayout";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Authentication */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        {/* Main Dashboard Redirect */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardRedirect />
            </ProtectedRoute>
          }
        />

        {/* Student */}

        <Route
          path="/student/dashboard"
          element={
            <RoleRoute allowedRoles={["STUDENT"]}>
              <StudentDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="/student/wallet"
          element={
            <RoleRoute allowedRoles={["STUDENT"]}>
              <StudentWallet />
            </RoleRoute>
          }
        />
        <Route
          path="/student/courses/:courseId/lessons/:lessonId"
          element={
            <RoleRoute allowedRoles={["STUDENT"]}>
              <LessonDetails />
            </RoleRoute>
          }
        />

        <Route
          path="/student/courses/:courseId"
          element={
            <RoleRoute allowedRoles={["STUDENT"]}>
              <CourseDetails />
            </RoleRoute>
          }
        />

        <Route
          path="/student/exams/:attemptId/analysis"
          element={
            <RoleRoute allowedRoles={["STUDENT"]}>
              <ExamAnalysis />
            </RoleRoute>
          }
        />

        <Route
          path="/student/courses/:courseId/exams/:examId"
          element={
            <RoleRoute allowedRoles={["STUDENT"]}>
              <Exam />
            </RoleRoute>
          }
        />

        <Route
            path="/student/courses"
            element={<AllCourses />}
        />


        {/* Teacher */}

        <Route
            path="/teacher/dashboard"
            element={
                <TeacherLayout>
                    <RoleRoute allowedRoles={["TEACHER"]}>
                        <TeacherDashboard />
                    </RoleRoute>
                </TeacherLayout>
            }
        />

        <Route
            path="/teacher/courses/create"
            element={
                <TeacherLayout>
                    <RoleRoute allowedRoles={["TEACHER"]}>
                        <CreateCourse />
                    </RoleRoute>
                </TeacherLayout>
            }
        />

        <Route
            path="/teacher/courses/:courseId"
            element={
                <TeacherLayout>
                    <RoleRoute allowedRoles={["TEACHER"]}>
                        <ManageCourse />
                    </RoleRoute>
                </TeacherLayout>
            }
        />

        <Route
            path="/teacher/courses/:courseId/lessons/create"
            element={
                <TeacherLayout>
                    <RoleRoute allowedRoles={["TEACHER"]}>
                        <CreateLesson />
                    </RoleRoute>
                </TeacherLayout>
            }
        />

        <Route
            path="/teacher/lessons/:lessonId/edit"
            element={
                <TeacherLayout>
                    <RoleRoute allowedRoles={["TEACHER"]}>
                        <EditLesson />
                    </RoleRoute>
                </TeacherLayout>
            }
        />

        <Route
            path="/teacher/courses/:courseId/lessons/:lessonId/exam/create"
            element={
                <TeacherLayout>
                    <RoleRoute allowedRoles={["TEACHER"]}>
                        <CreateExam />
                    </RoleRoute>
                </TeacherLayout>
            }
        />

        <Route
            path="/teacher/lessons/:lessonId/exam"
            element={
                <TeacherLayout>
                    <RoleRoute allowedRoles={["TEACHER"]}>
                        <ExamManagement />
                    </RoleRoute>
                </TeacherLayout>
            }
        />

        <Route
            path="/teacher/exams/:examId/questions/create"
            element={
                <TeacherLayout>
                    <RoleRoute allowedRoles={["TEACHER"]}>
                        <CreateExamQuestion />
                    </RoleRoute>
                </TeacherLayout>
            }
        />

        <Route
            path="/teacher/exams/:examId/questions/:questionId/edit"
            element={
                <TeacherLayout>
                    <RoleRoute allowedRoles={["TEACHER"]}>
                        <EditExamQuestion />
                    </RoleRoute>
                </TeacherLayout>
            }
        />

        <Route
            path="/teacher/courses/:courseId/students"
            element={
                <TeacherLayout>
                    <RoleRoute allowedRoles={["TEACHER"]}>
                        <TeacherCourseStudents />
                    </RoleRoute>
                </TeacherLayout>
            }
        />
        {/* Admin */}

        <Route
            path="/admin/dashboard"
            element={<AdminDashboard />}
        />
        
        <Route
            path="/admin/students"
            element={<AdminStudents />}
        />
        <Route
            path="/admin/students/:studentId"
            element={<StudentDetails />}
        />

        <Route
            path="/admin/teachers"
            element={<Teachers />}
        />

        <Route
            path="/admin/teachers/:teacherId"
            element={<TeacherDetails />}
        />
        <Route
            path="/admin/courses/:courseId"
            element={<AdminCourseDetails />}
        />
        <Route
            path="/admin/courses"
            element={<AdminCourses />}
        />

        {/* Default */}

        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;