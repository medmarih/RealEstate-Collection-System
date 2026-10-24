import { Check } from 'lucide-react'

const OFFICE_IMG =
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80'

const points = [
  "Plus de 40 ans d'expérience",
  'Présence dans toutes les régions du Maroc',
  'Engagement pour le développement durable',
]

export function ExpertiseSection() {
  return (
    <section id="expertise" className="scroll-mt-16 bg-[#1D6B3A] py-16 md:py-20">
      <div className="mx-auto grid max-w-[1200px] gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div>
          <h2 className="text-3xl font-bold text-white md:text-[32px]">L&apos;Expertise Al Omrane</h2>
          <p className="mt-4 text-base leading-relaxed text-white/90">
            Acteur majeur de l&apos;aménagement et de l&apos;habitat, le Groupe Al Omrane conçoit et
            réalise des programmes immobiliers innovants au service des citoyens et du territoire.
          </p>
          <ul className="mt-8 space-y-4">
            {points.map((text) => (
              <li key={text} className="flex items-start gap-3 text-white">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#dc2626]">
                  <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
                </span>
                <span className="text-sm font-medium leading-snug md:text-base">{text}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative">
          <div className="overflow-hidden rounded-xl shadow-lg">
            <img src={OFFICE_IMG} alt="" className="h-full min-h-[280px] w-full object-cover" loading="lazy" />
          </div>
          <div
            className="pointer-events-none absolute -bottom-2 -right-2 h-24 w-24 rounded-br-xl border-b-4 border-r-4 border-[#dc2626] md:h-32 md:w-32"
            aria-hidden
          />
        </div>
      </div>
    </section>
  )
}
