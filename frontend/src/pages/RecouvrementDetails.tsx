import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useEcheanciers, useRecouvrements } from '../hooks/useRecouvrementData'
import { ArrowLeft, BedDouble, Building2, House, LandPlot } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function RecouvrementDetails() {
  const { id } = useParams()
  const recouvrementId = Number(id)
  const { data: recouvrements = [], isLoading: isLoadingRec } = useRecouvrements()
  const { data: echeanciers = [], isLoading: isLoadingEch } = useEcheanciers()

  const summary = useMemo(
    () =>
      recouvrements.find((item) => item.id === recouvrementId) || {
        montantTotal: 0,
        montantPaye: 0,
        montantRestant: 0,
        statut: '-',
      },
    [recouvrements, recouvrementId]
  )

  const ratio = summary.montantTotal > 0 ? Math.round((summary.montantPaye / summary.montantTotal) * 100) : 0
  const linkedEcheanciers = echeanciers.filter(
    (item) => !item.recouvrement?.id || item.recouvrement.id === recouvrementId
  )

  return (
    <section className="space-y-6">
      <header className="rounded-3xl bg-gradient-to-r from-slate-900/80 to-slate-700/60 px-8 py-8 text-white">
        <Link to="/echeances" className="inline-flex items-center gap-2 text-sm text-white/90 hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          Retour aux echeances
        </Link>
        <h1 className="mt-3 text-5xl font-semibold tracking-tight">Villa avec piscine a Casablanca</h1>
        <p className="mt-2 text-white/90">Quartier Californie, Casablanca</p>
      </header>

      {(isLoadingRec || isLoadingEch) && <div className="h-40 animate-pulse rounded-2xl bg-muted/50" />}
      {!isLoadingRec && !isLoadingEch && <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <article className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-2xl font-semibold text-slate-800">Caracteristiques du bien</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: LandPlot, label: 'Terrain', value: '450 m²' },
              { icon: House, label: 'Habitable', value: '320 m²' },
              { icon: BedDouble, label: 'Chambres', value: '4 suites' },
              { icon: Building2, label: 'Etat', value: 'Neuf' },
            ].map((item) => (
              <div key={item.label} className="rounded-xl bg-slate-50 p-4">
                <item.icon className="h-5 w-5 text-slate-500" />
                <p className="mt-2 text-xs text-slate-500">{item.label}</p>
                <p className="text-lg font-semibold text-slate-800">{item.value}</p>
              </div>
            ))}
          </div>
          <h3 className="mt-6 text-sm font-semibold text-slate-500">Equipements inclus</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {['Piscine privee', 'Jardin paysage', 'Garage 2 places', 'Cuisine equipee'].map((tag) => (
              <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">{tag}</span>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Resume Financier</h2>
          <div className="space-y-2 text-sm">
            <p>Prix du bien: <strong>{summary.montantTotal.toLocaleString('fr-FR')} MAD</strong></p>
            <p>Paye: <strong>{summary.montantPaye.toLocaleString('fr-FR')} MAD</strong></p>
            <p>Restant: <strong>{summary.montantRestant.toLocaleString('fr-FR')} MAD</strong></p>
            <p>Statut: <strong>{summary.statut}</strong></p>
          </div>

          <div className="mt-5 space-y-2 rounded-xl bg-slate-50 p-4">
            <div className="flex items-center justify-between text-sm">
              <span>Progression du paiement</span>
              <strong>{ratio}%</strong>
            </div>
            <div className="h-3 rounded-full bg-muted">
              <div className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500" style={{ width: `${ratio}%` }} />
            </div>
          </div>
          <button className="mt-6 w-full rounded-xl bg-rose-500 py-3 font-semibold text-white hover:bg-rose-600">
            Effectuer un paiement
          </button>
        </article>

        <article className="rounded-2xl border bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold">Echeancier de paiement</h2>
          <ul className="space-y-3">
            {linkedEcheanciers.map((item) => (
              <li key={item.idEcheance} className="flex items-center justify-between rounded-xl border p-3 text-sm">
                <div>
                  <p className="font-medium">Ech-{item.idEcheance}</p>
                  <p className="text-muted-foreground">{item.dateEcheance}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{item.montant.toLocaleString('fr-FR')} MAD</p>
                  <p className={item.paye ? 'text-emerald-600' : 'text-red-600'}>{item.paye ? 'PAYE' : 'EN RETARD'}</p>
                </div>
              </li>
            ))}
          </ul>
        </article>
      </div>}
    </section>
  )
}
