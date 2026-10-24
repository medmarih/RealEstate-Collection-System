import { Wallet, Clock3, CheckCircle2 } from 'lucide-react'
import { useRecouvrements } from '@/hooks/useRecouvrementData'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { formatCurrency } from '@/lib/utils'

function StatCard({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Wallet }) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
          <p className="mt-1 text-xl font-semibold text-slate-900">{value}</p>
        </div>
        <div className="rounded-xl bg-emerald-600 p-2.5 text-white">
          <Icon className="h-4 w-4" />
        </div>
      </CardContent>
    </Card>
  )
}

export default function ClientDashboard() {
  const { data = [], isLoading } = useRecouvrements()

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-52" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
      </div>
    )
  }

  const total = data.reduce((s, r) => s + (r.montantTotal ?? 0), 0)
  const restant = data.reduce((s, r) => s + (r.montantRestant ?? 0), 0)
  const soldes = data.filter((r) => r.statut === 'SOLDE').length

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Espace Client</h2>
        <p className="text-sm text-slate-500">Suivi de vos dossiers et de vos échéances.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Montant total" value={formatCurrency(total)} icon={Wallet} />
        <StatCard label="Montant restant" value={formatCurrency(restant)} icon={Clock3} />
        <StatCard label="Dossiers soldés" value={String(soldes)} icon={CheckCircle2} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Accès client</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-600">
          Votre profil ne peut pas accéder aux fonctions d&apos;administration (import, gestion référentiels).
        </CardContent>
      </Card>
    </div>
  )
}
