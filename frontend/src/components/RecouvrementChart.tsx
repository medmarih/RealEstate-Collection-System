import { useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const monthly = [
  { mois: 'Jan', montant: 8 },
  { mois: 'Fév', montant: 12 },
  { mois: 'Mar', montant: 9 },
  { mois: 'Avr', montant: 15 },
  { mois: 'Mai', montant: 11 },
  { mois: 'Juin', montant: 14 },
  { mois: 'Juil', montant: 10 },
  { mois: 'Août', montant: 13 },
  { mois: 'Sep', montant: 16 },
  { mois: 'Oct', montant: 12 },
  { mois: 'Nov', montant: 18 },
  { mois: 'Déc', montant: 20 },
]

export function RecouvrementChart() {
  const [period, setPeriod] = useState('Cette année')

  return (
    <div className="rounded-xl bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-bold text-slate-900">Évolution des Recouvrements</h3>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="h-10 rounded-lg border border-[#e5e7eb] bg-white px-3 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-[#1D6B3A]/30"
        >
          <option>Cette année</option>
          <option>Année précédente</option>
        </select>
      </div>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthly} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="mois" tick={{ fontSize: 12, fill: '#64748b' }} />
            <YAxis
              tick={{ fontSize: 12, fill: '#64748b' }}
              label={{ value: 'Millions DH', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 12 }}
            />
            <Tooltip
              formatter={(v: number) => [`${v} M DH`, 'Montant']}
              contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb' }}
            />
            <Bar dataKey="montant" fill="#1D6B3A" radius={[8, 8, 0, 0]} name="Montant (M DH)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
