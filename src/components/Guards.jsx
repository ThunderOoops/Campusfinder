import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export const StudentGuard = () => {
  const { user, profile, loading } = useAuth()
  const location = useLocation()

  if (loading) return <div className="min-h-screen flex items-center justify-center text-zinc-400">Loading...</div>
  
  if (!user || profile?.role !== 'student') {
    return <Navigate to="/login" replace />
  }
  
  if (!profile.onboarding_done && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />
  }

  if (profile.onboarding_done && location.pathname === '/onboarding') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export const AdminGuard = () => {
  const { user, profile, loading } = useAuth()

  if (loading) return <div className="min-h-screen flex items-center justify-center text-zinc-400">Loading...</div>
  
  if (!user || profile?.role !== 'admin') {
    return <Navigate to="/admin/login" replace />
  }

  return <Outlet />
}

export const UnauthenticatedGuard = ({ role = 'student' }) => {
  const { user, profile, loading } = useAuth()

  if (loading) return <div className="min-h-screen flex items-center justify-center text-zinc-400">Loading...</div>

  if (user && profile) {
    if (profile.role === 'admin') return <Navigate to="/admin" replace />
    if (profile.role === 'student') return <Navigate to="/" replace />
  }

  return <Outlet />
}
