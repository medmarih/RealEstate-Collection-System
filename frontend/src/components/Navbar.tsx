import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { LogOut, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/auth-store'
import logoMark from '@/assets/logo.svg'

const links = [
  { to: '/', label: 'Accueil', end: true },
  { to: '/dashboard', label: 'Tableau de bord' },
  { to: '/echeances', label: 'Échéances' },
  { to: '/details-commande', label: 'Détails Commande' },
] as const

const navClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'rounded-lg px-3 py-2 text-sm font-semibold transition-colors',
    isActive ? 'bg-[#dc2626] text-white' : 'text-slate-700 hover:bg-slate-100'
  )

export function Navbar() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const logout = useAuthStore((s) => s.logout)

  const onLogout = () => {
    logout()
    navigate('/')
    setOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-[#e5e7eb] bg-white shadow-sm">
      <div className="mx-auto flex h-full max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="flex shrink-0 items-center gap-2" onClick={() => setOpen(false)}>
          <img src={logoMark} alt="" className="h-9 w-9" />
          <span className="text-lg font-bold text-[#085041]">Al Omrane</span>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex">
          {links.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={navClass}>
              {item.label}
            </NavLink>
          ))}
          {isAuthenticated ? (
            <button
              type="button"
              onClick={onLogout}
              className="ml-1 flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </button>
          ) : (
            <NavLink to="/login" className={navClass}>
              Connexion
            </NavLink>
          )}
        </nav>

        <button
          type="button"
          className="rounded-lg p-2 text-slate-700 lg:hidden"
          aria-label="Menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-[#e5e7eb] bg-white px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-1">
            {links.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={navClass}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
            {isAuthenticated ? (
              <button
                type="button"
                onClick={onLogout}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                <LogOut className="h-4 w-4" />
                Déconnexion
              </button>
            ) : (
              <NavLink to="/login" className={navClass} onClick={() => setOpen(false)}>
                Connexion
              </NavLink>
            )}
          </div>
        </div>
      ) : null}
    </header>
  )
}
