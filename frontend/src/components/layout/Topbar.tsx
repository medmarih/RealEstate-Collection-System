import { useLocation } from 'react-router-dom'
import { Menu, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/authStore'
import { useNavigate } from 'react-router-dom'

const titles: Record<string, string> = {
  '/dashboard': 'Tableau de bord',
  '/client/dashboard': 'Espace Client',
  '/recouvrements': 'Recouvrements',
  '/echeanciers': 'Échéanciers',
  '/import': 'Import',
  '/operations': 'Opérations',
  '/articles': 'Articles',
  '/clients': 'Clients',
}

function titleFromPath(path: string): string {
  if (titles[path]) return titles[path]
  const m = path.match(/^\/recouvrements\/(\d+)/)
  if (m) return `Dossier #${m[1]}`
  return 'Al Omrane'
}

export function Topbar({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const logout = useAuthStore((s) => s.logout)
  const username = useAuthStore((s) => s.username)
  const role = (useAuthStore((s) => s.role) ?? '').toUpperCase()

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-cyan-500/20 bg-slate-950/95 px-4 backdrop-blur-md md:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded-xl p-2 text-slate-300 hover:bg-slate-800 lg:hidden"
          onClick={onOpenSidebar}
          aria-label="Menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-slate-100">
            {titleFromPath(pathname)}
          </h1>
          <p className="hidden text-xs text-slate-400 sm:block">
            Dématérialisation du recouvrement — pilotage en temps réel
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {username ? (
          <span className="hidden max-w-[140px] truncate text-xs text-slate-300 sm:inline">
            {username} ({role || 'USER'})
          </span>
        ) : null}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="gap-1.5 text-slate-300"
          onClick={() => {
            logout()
            navigate('/auth')
          }}
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Déconnexion</span>
        </Button>
      </div>
    </header>
  )
}
