import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, ArrowUpDown, Eye, Wrench, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'
import { getApiMessage } from '@/lib/api'
import { useCorrigerRecouvrement, useRecouvrements } from '@/hooks/useRecouvrementData'
import type { RecouvrementDTO } from '@/types'
import { recouvrementHasAnomaly } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { TableSkeletonRows } from '@/components/ui/Skeleton'

type SortKey = 'id' | 'montantTotal' | 'montantPaye' | 'montantRestant' | 'statut'
type StatutFilter = 'ALL' | 'EN_COURS' | 'SOLDE'

const PAGE_SIZE = 8

export default function Recouvrements() {
  const [search, setSearch] = useState('')
  const [statut, setStatut] = useState<StatutFilter>('ALL')
  const [sortKey, setSortKey] = useState<SortKey>('id')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [page, setPage] = useState(1)

  const { data: rows = [], isLoading, isError } = useRecouvrements()
  const corrigerMutation = useCorrigerRecouvrement()

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const q = search.trim().toLowerCase()
      const matchSearch = !q || String(r.id).includes(q) || (r.statut || '').toLowerCase().includes(q)
      const matchStatut = statut === 'ALL' || r.statut === statut
      return matchSearch && matchStatut
    })
  }, [rows, search, statut])

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const va = a[sortKey] as number | string
      const vb = b[sortKey] as number | string
      if (typeof va === 'number' && typeof vb === 'number') {
        return sortDir === 'asc' ? va - vb : vb - va
      }
      return sortDir === 'asc'
        ? String(va).localeCompare(String(vb))
        : String(vb).localeCompare(String(va))
    })
  }, [filtered, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const pageSafe = Math.min(page, totalPages)
  const pageRows = sorted.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE)

  const toggleSort = (key: SortKey) => {
    setPage(1)
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recouvrements</CardTitle>
        </CardHeader>
        <TableSkeletonRows rows={8} cols={6} />
      </Card>
    )
  }

  if (isError) {
    return (
      <Card className="border-rose-200 bg-rose-50/50 p-6 text-sm text-rose-800">
        Impossible de charger les recouvrements. Vérifiez l&apos;API.
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {localStorage.getItem('lastImportAt') ? (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
          Dernier import appliqué avec succès. Les recouvrements affichés sont à jour.
        </div>
      ) : null}
      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Dossiers de recouvrement</CardTitle>
            <p className="mt-1 text-xs text-slate-400">
              Recherche, filtres, tri — actions correctives sur le statut.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[200px] flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <Input
                className="pl-9"
                placeholder="Rechercher par n° dossier ou statut…"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
              />
            </div>
            <select
              className="h-10 rounded-xl border border-slate-700 bg-slate-900 px-3 text-sm text-slate-100"
              value={statut}
              onChange={(e) => {
                setStatut(e.target.value as StatutFilter)
                setPage(1)
              }}
            >
              <option value="ALL">Tous les statuts</option>
              <option value="EN_COURS">En cours</option>
              <option value="SOLDE">Soldé</option>
            </select>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                <th className="px-4 py-3">
                  <button type="button" className="inline-flex items-center gap-1" onClick={() => toggleSort('id')}>
                    Dossier
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-4 py-3">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1"
                    onClick={() => toggleSort('montantTotal')}
                  >
                    Total
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-4 py-3">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1"
                    onClick={() => toggleSort('montantPaye')}
                  >
                    Payé
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-4 py-3">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1"
                    onClick={() => toggleSort('montantRestant')}
                  >
                    Restant
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3">Anomalie</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-500">
                    Aucun dossier ne correspond à vos critères.
                  </td>
                </tr>
              ) : (
                pageRows.map((r) => (
                  <Row
                    key={r.id}
                    r={r}
                    onCorriger={() =>
                      corrigerMutation.mutate(r.id, {
                        onSuccess: () => toast.success('Dossier recalculé'),
                        onError: (e) => toast.error(getApiMessage(e)),
                      })
                    }
                    loading={corrigerMutation.isPending}
                  />
                ))
              )}
            </tbody>
          </table>
        </CardContent>
        <div className="flex items-center justify-between border-t border-slate-800 px-4 py-3 text-xs text-slate-400">
          <span>
            Page {pageSafe} / {totalPages} · {sorted.length} dossier(s)
          </span>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={pageSafe <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Précédent
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={pageSafe >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Suivant
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

function Row({
  r,
  onCorriger,
  loading,
}: {
  r: RecouvrementDTO
  onCorriger: () => void
  loading: boolean
}) {
  const anomaly = recouvrementHasAnomaly(r)
  return (
    <tr className="border-b border-slate-800 transition hover:bg-slate-800/40">
      <td className="px-4 py-3 font-mono text-xs font-medium text-slate-100">#{r.id}</td>
      <td className="px-4 py-3 font-medium text-slate-200">{formatCurrency(r.montantTotal)}</td>
      <td className="px-4 py-3 text-slate-300">{formatCurrency(r.montantPaye)}</td>
      <td className="px-4 py-3 font-medium text-slate-100">{formatCurrency(r.montantRestant)}</td>
      <td className="px-4 py-3">
        <Badge tone={r.statut === 'SOLDE' ? 'success' : 'warning'}>{r.statut}</Badge>
      </td>
      <td className="px-4 py-3">
        {anomaly ? (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600">
            <AlertTriangle className="h-3.5 w-3.5" />
            Oui
          </span>
        ) : (
          <span className="text-slate-600">—</span>
        )}
      </td>
      <td className="px-4 py-3 text-right">
        <div className="flex justify-end gap-1">
          <Link to={`/recouvrements/${r.id}`}>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Voir">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-emerald-700"
            title="Recalculer statut"
            disabled={loading}
            onClick={onCorriger}
          >
            <Wrench className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  )
}
