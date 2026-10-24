import { useQuery } from '@tanstack/react-query'
import { fetchOperations } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { TableSkeletonRows } from '@/components/ui/Skeleton'

export default function Operations() {
  const { data = [], isLoading } = useQuery({ queryKey: ['operations'], queryFn: fetchOperations })

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Opérations</CardTitle>
        </CardHeader>
        <TableSkeletonRows rows={5} cols={4} />
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Opérations (projets)</CardTitle>
        <p className="text-xs text-slate-500">Données brutes API — structure selon votre modèle Spring.</p>
      </CardHeader>
      <CardContent className="overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-100 bg-slate-50/80 text-left text-xs font-semibold uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Libellé</th>
              <th className="px-4 py-3">Division</th>
              <th className="px-4 py-3">Site</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                  Aucune opération
                </td>
              </tr>
            ) : (
              data.map((op, i) => (
                <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-mono text-xs">{String(op.idOperation ?? op.id ?? '—')}</td>
                  <td className="px-4 py-3">{String(op.libelle ?? '—')}</td>
                  <td className="px-4 py-3">{String(op.division ?? '—')}</td>
                  <td className="px-4 py-3">{String(op.site ?? '—')}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}
