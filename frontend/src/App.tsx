import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { AdminRoute } from '@/components/auth/AdminRoute'
import { ClientRoute } from '@/components/auth/ClientRoute'
import { useAuthStore } from '@/store/authStore'
import Auth from '@/pages/Auth'
import Dashboard from '@/pages/Dashboard'
import ClientDashboard from '@/pages/ClientDashboard'
import Recouvrements from '@/pages/Recouvrements'
import RecouvrementDetail from '@/pages/RecouvrementDetail'
import Echeanciers from '@/pages/Echeanciers'
import Import from '@/pages/Import'
import Operations from '@/pages/Operations'
import Articles from '@/pages/Articles'
import Clients from '@/pages/Clients'

function ProtectedShell() {
  return (
    <ProtectedRoute>
      <AppShell />
    </ProtectedRoute>
  )
}

function RoleHome() {
  const role = (useAuthStore((s) => s.role) ?? '').toUpperCase()
  return <Navigate to={role === 'ADMIN' ? '/dashboard' : '/client/dashboard'} replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />

      <Route element={<ProtectedShell />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/client/dashboard"
          element={
            <ClientRoute>
              <ClientDashboard />
            </ClientRoute>
          }
        />
        <Route path="/recouvrements" element={<Recouvrements />} />
        <Route path="/recouvrements/:id" element={<RecouvrementDetail />} />
        <Route path="/echeanciers" element={<Echeanciers />} />
        <Route
          path="/import"
          element={
            <AdminRoute>
              <Import />
            </AdminRoute>
          }
        />
        <Route
          path="/operations"
          element={
            <AdminRoute>
              <Operations />
            </AdminRoute>
          }
        />
        <Route
          path="/articles"
          element={
            <AdminRoute>
              <Articles />
            </AdminRoute>
          }
        />
        <Route
          path="/clients"
          element={
            <AdminRoute>
              <Clients />
            </AdminRoute>
          }
        />
      </Route>

      <Route path="/" element={<RoleHome />} />
      <Route path="/login" element={<Navigate to="/auth" replace />} />

      <Route path="*" element={<RoleHome />} />
    </Routes>
  )
}
