import { useQuery } from '@tanstack/react-query'
import { fetchClients } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { TableSkeletonRows } from '@/components/ui/Skeleton'

export default function Clients() {
  const { data = [], isLoading } = useQuery({ queryKey: ['clients'], queryFn: fetchClients })

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Clients</CardTitle>
        </CardHeader>
        <TableSkeletonRows rows={5} cols={4} />
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Clients</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-100 bg-slate-50/80 text-left text-xs font-semibold uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">CIN</th>
              <th className="px-4 py-3">Téléphone</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-slate-500">
                  Aucun client
                </td>
              </tr>
            ) : (
              data.map((c, i) => (
                <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-medium">
                    {String(c.nomComplet ?? c.nom ?? '—')}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{String(c.cin ?? '—')}</td>
                  <td className="px-4 py-3">{String(c.telephone ?? '—')}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}
