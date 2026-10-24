import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, AlertTriangle } from 'lucide-react'
import { useRecouvrements } from '@/hooks/useRecouvrementData'
import { recouvrementHasAnomaly } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'

export default function RecouvrementDetail() {
  const { id } = useParams()
  const rid = Number(id)

  const { data: list = [], isLoading, isError } = useRecouvrements()

  const r = useMemo(() => list.find((x) => x.id === rid), [list, rid])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <Card className="border-rose-200 bg-rose-50/50 p-6 text-sm text-rose-800">
        Impossible de charger ce dossier. Vérifiez l&apos;API.
      </Card>
    )
  }

  if (!r || Number.isNaN(rid)) {
    return (
      <Card className="p-8 text-center text-slate-600">
        Dossier introuvable.
        <div className="mt-4">
          <Link to="/recouvrements">
            <Button variant="secondary">Retour à la liste</Button>
          </Link>
        </div>
      </Card>
    )
  }

  const pct = r.montantTotal > 0 ? Math.min(100, Math.round((r.montantPaye / r.montantTotal) * 100)) : 0
  const anomaly = recouvrementHasAnomaly(r)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Link to="/recouvrements">
          <Button variant="ghost" size="sm" className="gap-1.5">
            <ArrowLeft className="h-4 w-4" />
            Liste
          </Button>
        </Link>
        <Badge tone={r.statut === 'SOLDE' ? 'success' : 'warning'}>{r.statut}</Badge>
        {anomaly ? (
          <span className="inline-flex items-center gap-1 text-sm font-medium text-rose-600">
            <AlertTriangle className="h-4 w-4" />
            Anomalie détectée
          </span>
        ) : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Synthèse financière</CardTitle>
            <p className="text-xs text-slate-500">Dossier #{r.id}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-500">Montant total</p>
                <p className="mt-1 text-lg font-bold text-slate-900">{formatCurrency(r.montantTotal)}</p>
              </div>
              <div className="rounded-xl bg-emerald-50/80 p-4">
                <p className="text-xs font-medium text-emerald-800">Montant payé</p>
                <p className="mt-1 text-lg font-bold text-emerald-900">{formatCurrency(r.montantPaye)}</p>
              </div>
              <div className="rounded-xl bg-amber-50/80 p-4">
                <p className="text-xs font-medium text-amber-800">Restant</p>
                <p className="mt-1 text-lg font-bold text-amber-900">{formatCurrency(r.montantRestant)}</p>
              </div>
              <div className="rounded-xl bg-sky-50/80 p-4">
                <p className="text-xs font-medium text-sky-800">Progression</p>
                <p className="mt-1 text-lg font-bold text-sky-900">{pct} %</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Avancement du recouvrement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="mb-2 flex justify-between text-xs font-medium text-slate-600">
                <span>Payé / Total</span>
                <span>
                  {formatCurrency(r.montantPaye)} / {formatCurrency(r.montantTotal)}
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 text-sm text-slate-600">
              <p className="font-medium text-slate-800">Répartition</p>
              <ul className="mt-3 space-y-2">
                <li className="flex justify-between">
                  <span>Encaissé</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(r.montantPaye)}</span>
                </li>
                <li className="flex justify-between">
                  <span>Reste à encaisser</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(r.montantRestant)}</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
