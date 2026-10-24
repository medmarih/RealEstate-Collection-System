import { useQuery } from '@tanstack/react-query'
import { fetchArticles } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { TableSkeletonRows } from '@/components/ui/Skeleton'

export default function Articles() {
  const { data = [], isLoading } = useQuery({ queryKey: ['articles'], queryFn: fetchArticles })

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Articles</CardTitle>
        </CardHeader>
        <TableSkeletonRows rows={5} cols={5} />
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Articles immobiliers</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-100 bg-slate-50/80 text-left text-xs font-semibold uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Réf.</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Prix</th>
              <th className="px-4 py-3">Statut</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                  Aucun article
                </td>
              </tr>
            ) : (
              data.map((a, i) => (
                <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-medium">{String(a.reference ?? a.id ?? i)}</td>
                  <td className="px-4 py-3">{String(a.type ?? '—')}</td>
                  <td className="px-4 py-3">
                    {typeof a.prixCession === 'number' ? formatCurrency(a.prixCession) : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone="neutral">{String(a.statut ?? '—')}</Badge>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}
