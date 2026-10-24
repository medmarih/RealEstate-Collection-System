import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Wallet,
  CalendarClock,
  Upload,
  Building2,
  Home,
  Users,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import logoMark from '@/assets/logo.svg'
import { useAuthStore } from '@/store/authStore'

const mainNav = [
  { to: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { to: '/recouvrements', label: 'Recouvrements', icon: Wallet },
  { to: '/echeanciers', label: 'Échéanciers', icon: CalendarClock },
  { to: '/import', label: 'Import Excel', icon: Upload },
] as const

const dataNav = [
  { to: '/operations', label: 'Opérations', icon: Building2 },
  { to: '/articles', label: 'Articles', icon: Home },
  { to: '/clients', label: 'Clients', icon: Users },
] as const

const linkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
    isActive
      ? 'bg-emerald-500 text-slate-900 shadow-md shadow-emerald-900/30'
      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
  )

interface SidebarProps {
  mobileOpen: boolean
  onClose: () => void
}

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const role = (useAuthStore((s) => s.role) ?? '').toUpperCase()
  const isAdmin = role === 'ADMIN'
  const mainItems = isAdmin
    ? mainNav
    : mainNav
        .filter((item) => item.to !== '/import')
        .map((item) =>
          item.to === '/dashboard' ? { ...item, to: '/client/dashboard', label: 'Mon espace' } : item
        )

  return (
    <>
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-800 bg-slate-900 shadow-xl shadow-black/30 transition-transform duration-300 ease-out lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex h-16 items-center justify-between gap-2 border-b border-slate-800 px-4">
          <div className="flex items-center gap-2">
            <img src={logoMark} alt="" className="h-9 w-9" />
            <div>
              <p className="text-sm font-bold text-slate-100">Al Omrane</p>
              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                Recouvrement
              </p>
            </div>
          </div>
          <button
            type="button"
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 lg:hidden"
            onClick={onClose}
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto p-3">
          <div>
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Principal
            </p>
            <div className="space-y-0.5">
              {mainItems.map((item) => (
                <NavLink key={item.to} to={item.to} className={linkClass} onClick={onClose}>
                  <item.icon className="h-4 w-4 shrink-0 opacity-90" />
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
          {isAdmin ? (
            <div>
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Données
              </p>
              <div className="space-y-0.5">
                {dataNav.map((item) => (
                  <NavLink key={item.to} to={item.to} className={linkClass} onClick={onClose}>
                    <item.icon className="h-4 w-4 shrink-0 opacity-90" />
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          ) : null}
        </nav>

        <div className="border-t border-slate-800 p-3 text-[10px] text-slate-500">
          Workflow : Opération → Article → Client → Recouvrement → Échéancier
        </div>
      </aside>
    </>
  )
}
