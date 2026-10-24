import { ArrowRight, CheckCircle2, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const projects = [
  { id: '1', name: 'Villa de Luxe', city: 'Casablanca', price: '3 500 000 DH', tag: 'Villa' },
  { id: '2', name: 'Appartement Premium', city: 'Rabat', price: '2 100 000 DH', tag: 'Appartement' },
  { id: '3', name: 'Riad Traditionnel', city: 'Marrakech', price: '4 200 000 DH', tag: 'Riad' },
]

export default function Home() {
  return (
    <div className="space-y-12">
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-[linear-gradient(110deg,#1f2937,#374151)] px-10 py-16 text-white"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/35 to-transparent" />
        <h1 className="relative text-6xl font-semibold leading-tight">
          Batissons l&apos;Avenir du <span className="text-rose-400">Maroc</span>
        </h1>
        <p className="relative mt-5 max-w-3xl text-2xl text-slate-100/90">
          Cette plateforme permet d&apos;assurer un suivi centralise, securise et automatise
          des contrats de vente et des operations de recouvrement au sein d&apos;Al Omrane.
        </p>
        <div className="relative mt-9 flex flex-wrap gap-4">
          <Link to="/echeances" className="rounded-xl bg-rose-500 px-7 py-3 font-semibold shadow-lg shadow-rose-500/30 transition hover:-translate-y-0.5 hover:bg-rose-600">
            Espace Client
          </Link>
          <Link to="/login" className="rounded-xl bg-white px-7 py-3 font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:bg-slate-100">
            Tableau de bord
          </Link>
        </div>
      </motion.section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="hover-lift rounded-3xl bg-[#1F7A55] p-8 text-white shadow-lg">
          <h2 className="text-4xl font-semibold">L&apos;Expertise Al Omrane</h2>
          <p className="mt-3 text-white/90">
            Fort de son experience et de son ancrage territorial, le Groupe Al Omrane s&apos;impose
            comme acteur majeur de l&apos;habitat et de l&apos;amenagement urbain.
          </p>
          <div className="mt-6 space-y-3">
            {['Plus de 40 ans d\'experience', 'Presence nationale', 'Engagement durable'].map((item) => (
              <p key={item} className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-rose-300" />
                {item}
              </p>
            ))}
          </div>
        </div>
        <div className="hover-lift relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-200 via-slate-100 to-slate-300 shadow-lg">
          <div className="absolute inset-4 rounded-2xl border border-white/70 bg-white/40 backdrop-blur">
            <div className="grid h-full grid-cols-2 gap-3 p-4">
              <div className="rounded-xl bg-gradient-to-br from-emerald-200 to-emerald-400" />
              <div className="rounded-xl bg-gradient-to-br from-rose-200 to-rose-400" />
              <div className="rounded-xl bg-gradient-to-br from-slate-300 to-slate-500" />
              <div className="rounded-xl bg-gradient-to-br from-blue-200 to-indigo-400" />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ['126', 'Contrats actifs'],
          ['89%', 'Taux de recouvrement'],
          ['24h', 'Traitement moyen'],
          ['+18%', 'Croissance annuelle'],
        ].map(([value, label]) => (
          <motion.div
            key={label}
            whileHover={{ y: -4 }}
            className="glass-card rounded-2xl p-5"
          >
            <p className="text-3xl font-bold text-slate-800">{value}</p>
            <p className="mt-1 text-sm text-slate-500">{label}</p>
          </motion.div>
        ))}
      </section>

      <section>
        <h3 className="text-center text-5xl font-semibold text-slate-800">Projets Phares</h3>
        <div className="mx-auto mt-3 h-1 w-28 rounded-full bg-rose-400" />
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {projects.map((project) => (
            <motion.article
              key={project.id}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl border bg-white p-5 shadow-sm"
            >
              <div className="h-48 rounded-xl bg-gradient-to-r from-slate-200 to-slate-300" />
              <div className="mt-4 flex items-center justify-between">
                <h4 className="text-2xl font-semibold text-slate-800">{project.name}</h4>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">{project.tag}</span>
              </div>
              <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                <MapPin className="h-4 w-4" />
                {project.city}
              </p>
              <div className="mt-5 flex items-center justify-between border-t pt-4">
                <strong className="text-3xl text-rose-500">{project.price}</strong>
                <Link to={`/details-commande/${project.id}`} className="rounded-full border p-2 hover:bg-slate-50">
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </div>
  )
}

