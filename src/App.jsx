import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { StudentGuard, AdminGuard, UnauthenticatedGuard } from './components/Guards'
import { StudentLayout } from './components/layouts/StudentLayout'
import { AdminLayout } from './components/layouts/AdminLayout'

// Student Pages
import {
  Login, Signup, Onboarding, Discover,
  Teammates, Events, MyEvents, Matches, Profile
} from './pages/student'

// Admin Pages
import {
  AdminLogin, Dashboard, EventsManager,
  UsersList, AuditLog, Performance
} from './pages/admin'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public / Unauthenticated Routes */}
          <Route element={<UnauthenticatedGuard />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/admin/login" element={<AdminLogin />} />
          </Route>

          {/* Student Protected Routes */}
          <Route element={<StudentGuard />}>
            <Route element={<StudentLayout />}>
              <Route path="/" element={<Discover />} />
              <Route path="/teammates" element={<Teammates />} />
              <Route path="/events" element={<Events />} />
              <Route path="/my-events" element={<MyEvents />} />
              <Route path="/matches" element={<Matches />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
            {/* Onboarding outside of layout so it's full screen */}
            <Route path="/onboarding" element={<Onboarding />} />
          </Route>

          {/* Admin Protected Routes */}
          <Route element={<AdminGuard />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<Dashboard />} />
              <Route path="/admin/events" element={<EventsManager />} />
              <Route path="/admin/users" element={<UsersList />} />
              <Route path="/admin/audit" element={<AuditLog />} />
              <Route path="/admin/performance" element={<Performance />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
