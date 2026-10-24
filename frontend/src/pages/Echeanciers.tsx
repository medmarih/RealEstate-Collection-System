import { useMemo } from 'react'
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react'
import { useEcheanciers } from '@/hooks/useRecouvrementData'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { TableSkeletonRows } from '@/components/ui/Skeleton'

function statusIcon(paye: boolean, dateStr: string) {
  if (paye) return { Icon: CheckCircle2, tone: 'success' as const, label: 'Payé' }
  const d = new Date(dateStr)
  const late = !Number.isNaN(d.getTime()) && d < new Date() && !paye
  if (late) return { Icon: AlertCircle, tone: 'danger' as const, label: 'Retard' }
  return { Icon: Clock, tone: 'neutral' as const, label: 'À venir' }
}

export default function Echeanciers() {
  const { data: rows = [], isLoading, isError } = useEcheanciers()

  const byRec = useMemo(() => {
    const m = new Map<number, typeof rows>()
    for (const e of rows) {
      const rid = e.recouvrement?.id ?? 0
      if (!m.has(rid)) m.set(rid, [])
      m.get(rid)!.push(e)
    }
    return m
  }, [rows])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Échéanciers</CardTitle>
        </CardHeader>
        <TableSkeletonRows rows={6} cols={4} />
      </Card>
    )
  }

  if (isError) {
    return (
      <Card className="border-rose-200 bg-rose-50/50 p-6 text-sm text-rose-800">
        Impossible de charger les échéances.
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Échéanciers & calendrier de paiement</CardTitle>
          <p className="text-xs text-slate-500">
            Visualisation par dossier — statut payé, à venir ou en retard.
          </p>
        </CardHeader>
        <CardContent className="space-y-10">
          {rows.length === 0 ? (
            <p className="text-center text-sm text-slate-500">Aucune échéance en base.</p>
          ) : (
            Array.from(byRec.entries()).map(([recId, items]) => (
              <div key={recId || 'na'}>
                <h3 className="mb-4 text-sm font-semibold text-slate-800">
                  Dossier {recId ? `#${recId}` : '—'}
                </h3>
                <div className="relative space-y-0 border-l-2 border-slate-200 pl-6">
                  {items
                    .slice()
                    .sort((a, b) => a.dateEcheance.localeCompare(b.dateEcheance))
                    .map((e, idx) => {
                      const st = statusIcon(e.paye, e.dateEcheance)
                      return (
                        <div key={e.idEcheance} className="relative pb-8 last:pb-0">
                          <span
                            className="absolute -left-[25px] top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-white ring-2 ring-slate-200"
                            aria-hidden
                          />
                          <div className="flex flex-col gap-2 rounded-xl border border-slate-100 bg-slate-50/50 p-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <p className="text-xs text-slate-500">Échéance {idx + 1}</p>
                              <p className="font-semibold text-slate-900">{formatDate(e.dateEcheance)}</p>
                              <p className="text-sm text-slate-600">{formatCurrency(e.montant)}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge tone={st.tone} className="gap-1">
                                <st.Icon className="h-3 w-3" />
                                {st.label}
                              </Badge>
                              {e.delai ? (
                                <span className="text-xs text-slate-400">Délai {e.delai} j</span>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
