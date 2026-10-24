import { useState } from 'react'
import { Upload } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/button'

export default function ImportExcel() {
  const [fileName, setFileName] = useState('')

  return (
    <div className="space-y-4">
      <Card className="border-dashed">
        <label className="flex cursor-pointer flex-col items-center justify-center gap-3 py-12 text-center">
          <Upload className="h-8 w-8 text-[#1D9E75]" />
          <p className="text-sm font-medium text-slate-700">Glissez-déposez un fichier Excel ou cliquez ici</p>
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={(e) => setFileName(e.target.files?.[0]?.name ?? '')}
          />
        </label>
      </Card>

      {fileName ? (
        <Card>
          <h3 className="mb-2 font-semibold text-slate-900">Aperçu avant import</h3>
          <p className="mb-4 text-sm text-slate-600">{fileName}</p>
          <div className="overflow-auto rounded-xl border">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-left">
                <tr>
                  <th className="px-3 py-2">Client</th>
                  <th className="px-3 py-2">Article</th>
                  <th className="px-3 py-2">Montant</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="px-3 py-2">Aperçu démo</td>
                  <td className="px-3 py-2">Appartement A12</td>
                  <td className="px-3 py-2">850 000 MAD</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4">
            <Button>Confirmer l'import</Button>
          </div>
        </Card>
      ) : null}
    </div>
  )
}
