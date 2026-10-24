import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone } from 'lucide-react'
import logoMark from '@/assets/logo.svg'

export function Footer() {
  return (
    <footer className="bg-[#1e2535] py-14 text-slate-200">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-4 sm:px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <img src={logoMark} alt="" className="h-10 w-10" />
            <span className="text-xl font-bold text-white">Al Omrane</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            Leader de l&apos;aménagement et de l&apos;habitat au Maroc. Bâtissons ensemble
            l&apos;avenir.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-[#dc2626]">Contact</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex gap-2 text-slate-300">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#dc2626]" />
              123 Avenue Hassan II, Rabat
            </li>
            <li className="flex gap-2 text-slate-300">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#dc2626]" />
              +212 537 12 34 56
            </li>
            <li className="flex gap-2 text-slate-300">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#dc2626]" />
              contact@alomrane.gov.ma
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-[#dc2626]">Liens Rapides</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <span className="cursor-pointer text-slate-300 hover:text-white">Mentions légales</span>
            </li>
            <li>
              <span className="cursor-pointer text-slate-300 hover:text-white">
                Politique de confidentialité
              </span>
            </li>
            <li>
              <span className="cursor-pointer text-slate-300 hover:text-white">
                Conditions générales de vente
              </span>
            </li>
            <li>
              <Link to="/login" className="text-slate-300 hover:text-white">
                Espace client
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-12 max-w-[1200px] border-t border-slate-600/50 px-4 pt-8 text-center text-xs text-slate-500 sm:px-6">
        © {new Date().getFullYear()} Groupe Al Omrane. Tous droits réservés.
      </div>
    </footer>
  )
}
