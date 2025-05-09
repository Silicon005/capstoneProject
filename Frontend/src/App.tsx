import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "./components/mode-toggle";
import { AuthProvider } from './hooks/AuthContext';
import ProtectedRoute from './components/protectedRoute';
import NotFound from "./components/404.tsx";
import { lazy, Suspense } from 'react';
import StudentDashboard from "./pages/StudentDashboard";
import Dashboard from "./pages/student/Dashboard";
import SiteHome from "./pages/student/SiteHome";
import Contact from "./pages/student/Contact";
import Courses from "./pages/student/Courses";
import StudentCourse from "./pages/student/courses/Course";
// import Notifications from "./pages/student/Notifications";
import TeacherNotification from "./pages/teachers/TeacherNotification";
import UserProfile from "./pages/UserProfile";
import Test from "./pages/student/courses/Test";
import TestPage from "./pages/student/Test/TestPage";
import Department from "./pages/student/sitehhome/Department";
import TeacherDashboardLayout from "./pages/teachers/teacher-sidebar.tsx";
import TeacherSitehome from "./pages/teachers/SiteHome";
import TeacherCourses from "./pages/teachers/ListCourses";
import QuestionBank from "./pages/teachers/question-bank";
import GenerateQuestion from "./pages/teachers/generate-question";
import CreateTestManually from "./pages/teachers/CreateTestManually";
import TestPreview from "./pages/teachers/TestPreview.tsx";
import TeacherDashboard from "./pages/teachers/TeacherDashboard.tsx";
const Course = lazy(() => import("./pages/teachers/Courses/Course"));
const CreateCourseForm = lazy(() => import("./pages/teachers/CreateCourse"));
const CreateTest = lazy(() => import("./pages/teachers/CreateTest"));
const CourseSettings = lazy(() => import("./pages/teachers/CourseSettings"));
const RegistrationForm = lazy(() => import("./pages/register"));
const LoginPage = lazy(() => import('./pages/Authentication/LoginPage'));
const SignUp = lazy(() => import('./pages/Authentication/SignUp'));
const AdminDashboard = lazy(() => import("./pages/Admin/adminDashboard"));
const AdminPanel = lazy(() => import("./pages/Admin/LiveUsers"));
const AdminSchools = lazy(() => import("./pages/Admin/adminSchools"));
const ViewAllCourses = lazy(() => import("./pages/teachers/ViewAllCourses"));

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Router>
        <AuthProvider>
          <div className="fixed right-4 z-50 p-2 top-[6px]">
            <ModeToggle />
          </div>

          <Suspense fallback={ <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 dark:border-neutral-100 border-stone-950"></div>
      </div>}>
            <Routes>
              <Route path="/register" element={<RegistrationForm />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/page-not-found" element={<NotFound />} />
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="*" element={<NotFound />} />

              <Route path="/teacher" element={<TeacherDashboardLayout />}>
                <Route path="teacherdashboard/:teacherId" element={<TeacherDashboard/>}/>
                <Route path="site-home" element={<TeacherSitehome />} />
                <Route path="courses" element={<TeacherCourses />} />
                <Route path="create-course/:teacherId" element={<CreateCourseForm />} />
                <Route path="create-test" element={<CreateTest />} />
                <Route path="courses/:courseId" element={<Course />} />
                <Route path="course-settings/:courseId" element={<CourseSettings />} />                <Route path="question-bank" element={<QuestionBank />} />
                <Route path="generate-question" element={<GenerateQuestion />} />
                <Route path="create-test-manually" element={<CreateTestManually />} />
                <Route path="view-all-courses/:teacherId" element={<ProtectedRoute><ViewAllCourses /></ProtectedRoute>} />
                <Route path="user/profile" element={<UserProfile />} />
                <Route path="notifications" element={<TeacherNotification />} />
                <Route path="test/:testId" element={<TestPreview />} />
                
              </Route>
              <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="/manage-users" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
              <Route path="/manage-schools" element={<ProtectedRoute><AdminSchools /></ProtectedRoute>} />
              <Route path="student" element={<StudentDashboard />}>
                <Route index element={<Dashboard />} />
                <Route path="sitehome" element={<SiteHome />} />
                <Route path="school/:schoolId" element={<Department />} />
                <Route path="courses/:progress" element={<Courses />} />
                <Route path="courses/:progress/:courseid" element={<StudentCourse />} />
                {/* <Route path="notifications" element={<Notifications />} /> */}
                <Route path="help" element={<Contact />} />
                <Route path="user/profile" element={<UserProfile />} />
                <Route path="course/test" element={<Test />} />
                

              </Route>

              <Route path="/exam/test/:testID" element={<TestPage/>}/>
            </Routes>
          </Suspense>
          </AuthProvider>
        </Router>
    </ThemeProvider>
  );
}
