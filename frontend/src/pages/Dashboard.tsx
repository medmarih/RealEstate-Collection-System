import { useMemo } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { TrendingUp, Wallet, PiggyBank, Percent, Layers } from 'lucide-react'
import { getApiMessage } from '@/lib/api'
import { useDashboard } from '@/hooks/useRecouvrementData'
import { formatCurrency } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { Badge } from '@/components/ui/Badge'

function KpiCard({
  label,
  value,
  sub,
  icon: Icon,
  accent,
}: {
  label: string
  value: string
  sub?: string
  icon: typeof Wallet
  accent: string
}) {
  return (
    <Card className="group overflow-hidden transition hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{value}</p>
            {sub ? <p className="mt-1 text-xs text-slate-500">{sub}</p> : null}
          </div>
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl ${accent} shadow-sm transition group-hover:scale-105`}
          >
            <Icon className="h-5 w-5 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']

export default function Dashboard() {
  const { reporting, recouvrements: recouvrementsQuery } = useDashboard()
  const reportingData = reporting.data
  const recouvrements = recouvrementsQuery.data ?? []
  const loadingRep = reporting.isPending

  const barData = useMemo(() => {
    if (!reportingData) return []
    const solde = recouvrements.filter((r) => r.statut === 'SOLDE').length
    const encours = recouvrements.filter((r) => r.statut === 'EN_COURS').length
    return [
      { name: 'SOLDE', value: solde },
      { name: 'EN_COURS', value: encours },
    ]
  }, [reportingData, recouvrements])

  const lineData = useMemo(() => {
    const paye = reportingData?.montantPaye ?? 0
    const seed = paye > 0 ? paye / 1_000_000 / 12 : 0.8
    return months.map((m, i) => ({
      mois: m,
      cumul: Math.round(seed * 100 * (i + 1) * (0.85 + (i % 4) * 0.04)) / 100,
    }))
  }, [reportingData])

  const pieStatut = useMemo(() => {
    const solde = recouvrements.filter((r) => r.statut === 'SOLDE').length
    const encours = recouvrements.filter((r) => r.statut === 'EN_COURS').length
    return [
      { name: 'Soldés', n: solde },
      { name: 'En cours', n: encours },
    ]
  }, [recouvrements])

  if (loadingRep && !reportingData) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <Skeleton className="h-80" />
      </div>
    )
  }

  if (reporting.isError || !reportingData) {
    return (
      <Card className="border-rose-200 bg-rose-50/50 p-6 text-sm text-rose-800">
        <p className="font-semibold">Impossible de charger le tableau de bord</p>
        <p className="mt-2 text-rose-700/90">{getApiMessage(reporting.error)}</p>
        <p className="mt-3 text-xs text-rose-600">
          Vérifiez que l&apos;API est joignable (ex. Spring Boot sur le port configuré) et que{' '}
          <code className="rounded bg-white/60 px-1">GET /reporting-complet</code> répond.
        </p>
      </Card>
    )
  }

  const stats = reportingData
  const recentRows = [...recouvrements].sort((a, b) => b.id - a.id).slice(0, 6)
  const hasFreshImport = Boolean(localStorage.getItem('lastImportAt'))

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Vue d&apos;ensemble</h2>
        <p className="mt-1 text-sm text-slate-500">
          Indicateurs agrégés et tendance des encaissements.
        </p>
        {hasFreshImport ? (
          <p className="mt-2 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            Nouvelles données importées et visualisées
          </p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Dossiers"
          value={String(stats.totalRecouvrements)}
          sub={`${stats.nombreSolde} soldés · ${stats.nombreEnCours} en cours`}
          icon={Layers}
          accent="bg-sky-500"
        />
        <KpiCard
          label="Montant payé"
          value={formatCurrency(stats.montantPaye)}
          icon={PiggyBank}
          accent="bg-emerald-600"
        />
        <KpiCard
          label="Montant restant"
          value={formatCurrency(stats.montantRestant)}
          icon={Wallet}
          accent="bg-amber-500"
        />
        <KpiCard
          label="Taux de recouvrement"
          value={`${stats.tauxRecouvrement.toFixed(1)} %`}
          icon={Percent}
          accent="bg-violet-600"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Distribution des statuts</CardTitle>
            <p className="text-xs text-slate-500">Nombre de dossiers par statut</p>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} />
                  <Tooltip
                    formatter={(v) => {
                      const n = typeof v === 'number' ? v : Number(v)
                      const safe = Number.isFinite(n) ? n : 0
                      return [String(safe), 'Dossiers']
                    }}
                    contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }}
                  />
                  <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              Tendance cumulée
            </CardTitle>
            <p className="text-xs text-slate-500">Projection visuelle à partir du volume payé</p>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="mois" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
                  <Line
                    type="monotone"
                    dataKey="cumul"
                    stroke="#0ea5e9"
                    strokeWidth={2.5}
                    dot={{ fill: '#0ea5e9', r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Répartition des dossiers</CardTitle>
          {recouvrementsQuery.isError ? (
            <p className="text-xs font-medium text-amber-700">
              Liste des dossiers indisponible — les totaux ci-dessus restent valides.
            </p>
          ) : null}
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-6">
            {pieStatut.map((s) => (
              <div
                key={s.name}
                className="flex flex-1 min-w-[140px] items-center justify-between rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3"
              >
                <span className="text-sm font-medium text-slate-600">{s.name}</span>
                <span className="text-xl font-bold text-slate-900">{s.n}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recouvrements récents</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-auto">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-2 py-2">Dossier</th>
                  <th className="px-2 py-2">Total</th>
                  <th className="px-2 py-2">Payé</th>
                  <th className="px-2 py-2">Restant</th>
                  <th className="px-2 py-2">Statut</th>
                </tr>
              </thead>
              <tbody>
                {recentRows.map((r) => (
                  <tr key={r.id} className="border-b border-slate-50">
                    <td className="px-2 py-2 font-mono text-xs">#{r.id}</td>
                    <td className="px-2 py-2">{formatCurrency(r.montantTotal)}</td>
                    <td className="px-2 py-2">{formatCurrency(r.montantPaye)}</td>
                    <td className="px-2 py-2">{formatCurrency(r.montantRestant)}</td>
                    <td className="px-2 py-2">
                      <Badge tone={r.statut === 'SOLDE' ? 'success' : 'warning'}>{r.statut}</Badge>
                    </td>
                  </tr>
                ))}
                {!recentRows.length ? (
                  <tr>
                    <td className="px-2 py-4 text-slate-500" colSpan={5}>
                      Aucun recouvrement récent.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
