import Echeanciers from '@/pages/Echeanciers'

/** Page Échéances — réutilise la table existante (données API). */
export default function EcheancesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[28px] font-bold text-slate-900">Échéances</h1>
        <p className="mt-2 text-sm text-slate-500">
          Calendrier et suivi des échéances par dossier de recouvrement.
        </p>
      </div>
      <Echeanciers />
    </div>
  )
}
