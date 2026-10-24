import { Outlet } from 'react-router-dom'
import { Navbar } from '@/components/Navbar'

export function AppLayout() {
  return (
    <div className="min-h-screen bg-[#f3f4f6] font-sans">
      <Navbar />
      <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6">
        <Outlet />
      </main>
    </div>
  )
}
