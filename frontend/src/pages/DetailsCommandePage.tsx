import RecouvrementsTable from '@/pages/Recouvrements'

export default function DetailsCommandePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[28px] font-bold text-slate-900">Détails Commande</h1>
        <p className="mt-2 text-sm text-slate-500">
          Liste des dossiers de recouvrement et statuts associés.
        </p>
      </div>
      <RecouvrementsTable />
    </div>
  )
}
