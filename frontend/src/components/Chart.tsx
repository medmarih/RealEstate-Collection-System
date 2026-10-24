import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { RecouvrementDTO, ReportingComplet } from '@/types'

interface ChartProps {
  report?: ReportingComplet
  recouvrements?: RecouvrementDTO[]
}

export default function ChartComponent({ report, recouvrements = [] }: ChartProps) {
  const barData = [
    {
      name: 'Montants',
      paye: report?.montantPaye || 0,
      restant: report?.montantRestant || 0,
      total: report?.montantTotal || 0,
    },
  ]

  const lineData = recouvrements
    .slice()
    .sort((a, b) => a.id - b.id)
    .reduce<{ label: string; taux: number; total: number; paye: number }[]>((acc, current, index) => {
      const previous = acc[index - 1]
      const total = (previous?.total || 0) + current.montantTotal
      const paye = (previous?.paye || 0) + current.montantPaye
      const taux = total > 0 ? Number(((paye / total) * 100).toFixed(2)) : 0
      acc.push({ label: `RCV-${current.id}`, taux, total, paye })
      return acc
    }, [])

  return (
    <div className="space-y-6">
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="paye" fill="#3b82f6" name="Montant Paye" radius={[6, 6, 0, 0]} />
            <Bar dataKey="restant" fill="#f59e0b" name="Montant Restant" radius={[6, 6, 0, 0]} />
            <Bar dataKey="total" fill="#6366f1" name="Montant Total" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" hide />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="taux"
              stroke="#10b981"
              strokeWidth={2.5}
              dot={{ r: 4 }}
              name="Taux recouvrement cumule (%)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

