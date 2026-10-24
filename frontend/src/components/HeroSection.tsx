import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const HERO_IMG =
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1920&q=80'

export function HeroSection() {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] w-full">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${HERO_IMG}')` }}
      />
      <div className="absolute inset-0 bg-black/[0.45]" />
      <div className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-16 text-center">
        <h1 className="max-w-4xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-[52px]">
          Bâtissons l&apos;Avenir du{' '}
          <span className="text-[#dc2626]">Maroc</span>
        </h1>
        <p className="mx-auto mt-6 max-w-[520px] text-base leading-relaxed text-white/90">
          Al Omrane accompagne le développement urbain et l&apos;habitat au Maroc avec des projets
          d&apos;envergure, un engagement durable et un service client à la hauteur de vos attentes.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#projets-phares"
            className="inline-flex items-center gap-2 rounded-lg bg-[#dc2626] px-7 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#b91c1c]"
          >
            Espace Client
            <ArrowRight className="h-4 w-4" />
          </a>
          <Link
            to="/login"
            className="inline-flex items-center justify-center rounded-lg border-2 border-white bg-white px-7 py-3.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-white/95"
          >
            Se Connecter
          </Link>
        </div>
      </div>
    </section>
  )
}
