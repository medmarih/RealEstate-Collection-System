import { Home, LayoutDashboard, Calendar, ReceiptText, LogOut, LogIn } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { cn } from '../lib/utils'

const navItems = [
  { name: 'Accueil', href: '/accueil' },
  { name: 'Tableau de bord', href: '/dashboard' },
  { name: 'Echeances', href: '/echeances' },
  { name: 'Details Commande', href: '/details-commande/1' },
]

function navIsActive(pathname: string, href: string) {
  if (href === '/accueil') return pathname === '/accueil' || pathname === '/'
  if (href.startsWith('/details-commande')) return pathname.startsWith('/details-commande')
  return pathname === href || pathname.startsWith(`${href}/`)
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const { logout, isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen bg-[#f6f7fb]">
      <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white">
        <div className="mx-auto max-w-[1300px] px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-[72px]">
            <Link to="/accueil" className="group flex items-center gap-3">
              <img
                src="/logo-alomrane.png"
                alt="Al Omrane"
                className="h-11 w-auto object-contain"
              />
              <div className="text-[26px] font-semibold tracking-tight text-slate-800">
                Al Omrane
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-2">
              {navItems.map((item) => (
                <motion.div key={item.href} whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'rounded-xl px-4 py-2 text-sm font-semibold transition-colors',
                    navIsActive(location.pathname, item.href)
                      ? 'bg-[#E63946] text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100'
                  )}
                >
                  {item.name}
                </Link>
                </motion.div>
              ))}
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Déconnexion
                </button>
              ) : (
                <Link
                  to="/login"
                  className="rounded-xl bg-[#E63946] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#d62f3c]"
                >
                  Connexion
                </Link>
              )}
            </div>

            <div className="md:hidden flex gap-1">
              {[
                { href: '/accueil', icon: Home },
                { href: '/dashboard', icon: LayoutDashboard },
                { href: '/echeances', icon: Calendar },
                { href: '/details-commande/1', icon: ReceiptText },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      'rounded-lg p-2',
                      navIsActive(location.pathname, item.href) ? 'bg-[#E63946] text-white' : 'text-slate-600'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </Link>
                )
              })}
              {isAuthenticated ? (
                <button type="button" onClick={logout} className="rounded-lg p-2 text-slate-600">
                  <LogOut className="h-4 w-4" />
                </button>
              ) : (
                <Link to="/login" className="rounded-lg bg-[#E63946] p-2 text-white">
                  <LogIn className="h-4 w-4" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-[1300px] p-4 md:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="mt-10 bg-slate-800 py-10 text-slate-200">
        <div className="mx-auto grid max-w-[1300px] gap-6 px-4 md:grid-cols-3 md:px-8">
          <div>
            <div className="mb-3 text-xl font-semibold">Al Omrane</div>
            <p className="text-sm text-slate-300">
              Leader de l&apos;amenagement et de l&apos;habitat au Maroc.
            </p>
          </div>
          <div>
            <h3 className="mb-2 font-semibold text-rose-400">Contact</h3>
            <p className="text-sm">123 Avenue Hassan II, Rabat</p>
            <p className="text-sm">+212 537 12 34 56</p>
            <p className="text-sm">contact@alomrane.gov.ma</p>
          </div>
          <div>
            <h3 className="mb-2 font-semibold text-rose-400">Liens Rapides</h3>
            <p className="text-sm">Mentions legales</p>
            <p className="text-sm">Politique de confidentialite</p>
            <p className="text-sm">Conditions generales de vente</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

