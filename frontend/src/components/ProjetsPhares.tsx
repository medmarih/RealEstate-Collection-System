import { MapPin, ArrowRight } from 'lucide-react'

const projects = [
  {
    type: 'Villa',
    name: 'Villa de Luxe',
    location: 'Casablanca',
    price: '3 500 000 DH',
    image:
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
  },
  {
    type: 'Appartement',
    name: 'Appartement Premium',
    location: 'Rabat',
    price: '2 100 000 DH',
    image:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
  },
  {
    type: 'Riad',
    name: 'Riad Traditionnel',
    location: 'Marrakech',
    price: '4 200 000 DH',
    image:
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
  },
]

export function ProjetsPhares() {
  return (
    <section id="projets-phares" className="scroll-mt-16 bg-white py-16 md:py-20">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">Projets Phares</h2>
          <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-[#dc2626]" aria-hidden />
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <article
              key={p.name}
              className="group overflow-hidden rounded-xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08)] transition-transform duration-300 hover:scale-[1.02]"
            >
              <div className="relative h-[240px] overflow-hidden rounded-t-xl">
                <img
                  src={p.image}
                  alt=""
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <span className="absolute right-3 top-3 rounded-md bg-[#1D6B3A] px-3 py-1 text-xs font-semibold text-white">
                  {p.type}
                </span>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-slate-900">{p.name}</h3>
                <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-600">
                  <MapPin className="h-4 w-4 shrink-0 text-[#dc2626]" />
                  {p.location}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-bold text-[#dc2626]">{p.price}</span>
                  <span className="text-[#1D6B3A] transition group-hover:translate-x-1" aria-hidden>
                    <ArrowRight className="h-5 w-5" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
