import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuthStore } from '@/store/authStore'

export function AdminRoute({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const role = (useAuthStore((s) => s.role) ?? '').toUpperCase()

  if (!isAuthenticated) return <Navigate to="/auth" replace />
  if (role !== 'ADMIN') return <Navigate to="/dashboard" replace />
  return <>{children}</>
}
