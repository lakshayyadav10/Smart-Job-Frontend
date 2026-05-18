import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute() {
  const { isAuthenticated, isAuthLoading } = useAuth()

  if (isAuthLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm font-medium text-slate-600">Loading account...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
