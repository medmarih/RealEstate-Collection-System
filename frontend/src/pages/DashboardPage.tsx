import { Briefcase, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react'
import { KPICard } from '@/components/KPICard'
import { RecouvrementChart } from '@/components/RecouvrementChart'

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[28px] font-bold text-slate-900">Tableau de bord du recouvrement</h1>
        <p className="mt-2 text-sm text-slate-500">
          Vue synthétique des indicateurs et de l&apos;évolution des recouvrements.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard
          icon={Briefcase}
          label="Recouvrements en cours"
          value="45 500 000 DH"
          iconBg="bg-sky-100"
          iconColor="text-sky-600"
        />
        <KPICard
          icon={AlertTriangle}
          label="Recouvrements en retard"
          value="18 750 000 DH"
          iconBg="bg-red-100"
          iconColor="text-red-600"
        />
        <KPICard
          icon={CheckCircle2}
          label="Recouvrements soldés"
          value="62 300 000 DH"
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
        />
        <KPICard
          icon={TrendingUp}
          label="Total des commandes"
          value="126 550 000 DH"
          iconBg="bg-violet-100"
          iconColor="text-violet-600"
        />
      </div>

      <RecouvrementChart />
    </div>
  )
}
