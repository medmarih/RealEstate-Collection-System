import { useEcheanciers } from '../hooks/useRecouvrementData'
import { DataTable } from '../components/ui/DataTable'
import { Link } from 'react-router-dom'

export default function Echeancier() {
  const { data: echeances = [], isLoading, isError } = useEcheanciers()

  return (
    <section className="space-y-6">
      <header className="flex items-start justify-between">
        <div>
        <h1 className="text-5xl font-semibold tracking-tight text-slate-800">Echeances de paiement</h1>
        <p className="text-base text-slate-500">Suivi detaille des paiements par propriete et par ville.</p>
        </div>
        <div className="flex gap-2">
          <button className="rounded-lg border px-4 py-2 text-sm font-medium">Filtrer</button>
          <button className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-semibold text-white">Exporter CSV</button>
        </div>
      </header>

      {isLoading && <div className="h-40 animate-pulse rounded-2xl bg-muted/50" />}
      {isError && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">Impossible de charger les échéanciers.</div>}
      {!isLoading && !isError && (
        <DataTable
          data={echeances}
          pageSize={8}
          columns={[
            { key: 'id', header: 'Echeance', render: (item) => `ECH-${item.idEcheance}`, sortValue: (item) => item.idEcheance },
            {
              key: 'rec',
              header: 'Recouvrement',
              render: (item) => (item.recouvrement?.id ? `RCV-${item.recouvrement.id}` : 'N/A'),
              sortValue: (item) => item.recouvrement?.id || 0,
            },
            { key: 'date', header: 'Date', render: (item) => item.dateEcheance || '-', sortValue: (item) => item.dateEcheance || '' },
            { key: 'montant', header: 'Montant', render: (item) => `${item.montant.toLocaleString('fr-FR')} MAD`, sortValue: (item) => item.montant },
            {
              key: 'statut',
              header: 'Statut',
              render: (item) => (
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                    item.paye
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                  }`}
                >
                  {item.paye ? 'PAYE' : 'EN RETARD'}
                </span>
              ),
              sortValue: (item) => (item.paye ? 1 : 0),
            },
            {
              key: 'action',
              header: 'Action',
              render: (item) => (
                <Link
                  to={`/details-commande/${item.recouvrement?.id || 1}`}
                  className="rounded-xl border px-4 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  Details
                </Link>
              ),
            },
          ]}
        />
      )}
    </section>
  )
}
