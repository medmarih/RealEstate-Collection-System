import { useCallback, useEffect, useState } from 'react'
import { Upload, FileSpreadsheet, CheckCircle2, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { getApiMessage } from '@/lib/api'
import { getImportJobStatus, useImportFile, useImportsHistory } from '@/hooks/useRecouvrementData'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import type { ImportResult } from '@/types'
import { TableSkeletonRows } from '@/components/ui/Skeleton'
import * as XLSX from 'xlsx'

export default function Import() {
  const [file, setFile] = useState<File | null>(null)
  const [drag, setDrag] = useState(false)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [previewRows, setPreviewRows] = useState<Record<string, unknown>[]>([])
  const [jobId, setJobId] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const mutation = useImportFile()
  const importsHistory = useImportsHistory()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const forceGoRecouvrements = useCallback(() => {
    navigate('/recouvrements', { replace: true })
    setTimeout(() => {
      if (window.location.pathname !== '/recouvrements') {
        window.location.href = '/recouvrements'
      }
    }, 150)
  }, [navigate])

  const handleFile = useCallback((selected: File | null) => {
    setFile(selected)
    setImportResult(null)
    setPreviewRows([])
    if (!selected) return

    const reader = new FileReader()
    reader.onload = (evt) => {
      try {
        const data = evt.target?.result
        if (!data) return
        const workbook = XLSX.read(data, { type: 'array' })
        const sheet = workbook.Sheets[workbook.SheetNames[0]]
        const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' })
        setPreviewRows(rows.slice(0, 5))
      } catch {
        toast.error('Impossible de lire le fichier pour le preview')
      }
    }
    reader.readAsArrayBuffer(selected)
  }, [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDrag(false)
    const f = e.dataTransfer.files?.[0]
    if (f) handleFile(f)
  }, [handleFile])

  useEffect(() => {
    if (!jobId) return
    const timer = setInterval(async () => {
      try {
        const status = await getImportJobStatus(jobId)
        setProgress(status.progress ?? 0)
        if (status.status === 'SUCCESS') {
          setImportResult(status.result ?? null)
          toast.success('Import terminé avec succès')
          setJobId(null)
          setFile(null)
          queryClient.invalidateQueries({ queryKey: ['recouvrements'] })
          queryClient.invalidateQueries({ queryKey: ['reporting-complet'] })
          queryClient.invalidateQueries({ queryKey: ['dashboardData'] })
          queryClient.invalidateQueries({ queryKey: ['echeanciers'] })
          importsHistory.refetch()
          localStorage.setItem('lastImportAt', new Date().toISOString())
          forceGoRecouvrements()
        } else if (status.status === 'FAILED') {
          toast.error(status.message || 'Échec import')
          setJobId(null)
        }
      } catch {
        toast.error('Erreur suivi import')
        setJobId(null)
      }
    }, 1200)
    return () => clearInterval(timer)
  }, [forceGoRecouvrements, jobId, importsHistory, queryClient])

  return (
    <div className="mx-auto max-w-2xl space-y-6 text-slate-100">
      <Card>
        <CardHeader>
          <CardTitle>Import CSV Pro</CardTitle>
          <p className="text-xs text-slate-400">
            Déposez un fichier .xlsx ou .xls — envoi vers{' '}
            <code className="rounded bg-slate-800 px-1">POST /import</code>
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setDrag(true)
            }}
            onDragLeave={() => setDrag(false)}
            onDrop={onDrop}
            className={`rounded-2xl border-2 border-dashed p-12 text-center transition ${
              drag ? 'border-emerald-400 bg-emerald-500/10' : 'border-slate-700 bg-slate-900/60'
            }`}
          >
            <FileSpreadsheet className="mx-auto h-12 w-12 text-emerald-600" />
            <p className="mt-4 text-sm font-medium text-slate-200">
              Glissez-déposez votre fichier ici
            </p>
            <p className="mt-1 text-xs text-slate-400">ou sélectionnez depuis votre ordinateur</p>
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              className="mt-6 block w-full text-sm text-slate-600"
              onChange={(e) => handleFile(e.target.files?.[0] || null)}
            />
          </div>

          {file ? (
            <div className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm">
              <span className="truncate font-medium text-slate-100">{file.name}</span>
              <Upload className="h-4 w-4 shrink-0 text-slate-500" />
            </div>
          ) : null}

          <Button
            className="w-full"
            disabled={!file || mutation.isPending}
            onClick={() => {
              if (!file) return
              const fd = new FormData()
              fd.append('file', file)
              mutation.mutate(fd, {
                onSuccess: (data) => {
                  const payload = data as { jobId?: string; status?: string; result?: ImportResult }
                  if (payload.status === 'SUCCESS') {
                    setImportResult(payload.result ?? null)
                    localStorage.setItem('lastImportAt', new Date().toISOString())
                    toast.success('Import terminé avec succès')
                    forceGoRecouvrements()
                    return
                  }
                  setJobId(payload.jobId ?? null)
                  setProgress(10)
                  toast.success('Import lancé en arrière-plan')
                },
                onError: (e) => toast.error(getApiMessage(e)),
              })
            }}
          >
            {mutation.isPending ? 'Import en cours…' : 'Lancer l’import'}
          </Button>

          {jobId ? (
            <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-xs text-blue-800">
              Import asynchrone en cours... progression: {progress}%
            </div>
          ) : null}

          {mutation.isSuccess ? (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              Fichier traité côté serveur.
            </div>
          ) : null}
          {importResult ? (
            <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-700">
              <p className="font-semibold">Résumé import: {importResult.fileName}</p>
              <p>Total lignes: {importResult.total}</p>
              <p>Succès: {importResult.success}</p>
              <p>Échecs: {importResult.failed}</p>
              {importResult.warnings?.length ? (
                <p className="text-amber-700">Avertissements: {importResult.warnings.length}</p>
              ) : null}
              {importResult.errors?.length ? (
                <div className="rounded border border-rose-200 bg-rose-50 p-2 text-rose-700">
                  <p className="font-semibold">Erreurs ({importResult.errors.length})</p>
                  {importResult.errors.slice(0, 5).map((err, idx) => (
                    <p key={idx}>Ligne {err.row}: {err.message}</p>
                  ))}
                </div>
              ) : null}
              {importResult.anomalies?.length ? (
                <div className="rounded border border-amber-200 bg-amber-50 p-2 text-amber-800">
                  <p className="font-semibold">Anomalies ({importResult.anomalies.length})</p>
                  {importResult.anomalies.slice(0, 5).map((a, idx) => (
                    <p key={idx}>Ligne {a.row} - {a.flag}: {a.message}</p>
                  ))}
                </div>
              ) : null}
              {importResult.corrections?.length ? (
                <div className="rounded border border-sky-200 bg-sky-50 p-2 text-sky-800">
                  <p className="font-semibold">Corrections ({importResult.corrections.length})</p>
                  {importResult.corrections.slice(0, 5).map((c, idx) => (
                    <p key={idx}>
                      Ligne {c.row} - {c.field}: "{c.original}" {'->'} "{c.corrected}"
                    </p>
                  ))}
                </div>
              ) : null}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Button size="sm" onClick={forceGoRecouvrements}>
                  Voir les recouvrements
                </Button>
              </div>
            </div>
          ) : null}
          {mutation.isError ? (
            <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
              <XCircle className="h-4 w-4 shrink-0" />
              {getApiMessage(mutation.error)}
            </div>
          ) : null}

          {previewRows.length ? (
            <div className="rounded-xl border border-slate-200 p-3 text-xs">
              <p className="mb-2 font-semibold text-slate-700">Aperçu (5 premières lignes)</p>
              <div className="space-y-2">
                {previewRows.map((row, idx) => (
                  <pre key={idx} className="overflow-auto rounded bg-slate-50 p-2 text-slate-700">
                    {JSON.stringify(row, null, 2)}
                  </pre>
                ))}
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historique des imports</CardTitle>
        </CardHeader>
        <CardContent>
          {importsHistory.isPending ? (
            <TableSkeletonRows rows={4} cols={4} />
          ) : (
            <div className="space-y-2 text-sm">
              {(importsHistory.data ?? []).slice(0, 8).map((item) => (
                <div key={item.id} className="rounded-lg border border-slate-200 px-3 py-2">
                  <p className="font-medium text-slate-700">{item.fileName}</p>
                  <p className="text-xs text-slate-500">
                    Total {item.totalRows} | Succès {item.successRows} | Échecs {item.failedRows}
                  </p>
                </div>
              ))}
              {!importsHistory.data?.length ? (
                <p className="text-xs text-slate-500">Aucun import enregistré.</p>
              ) : null}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
