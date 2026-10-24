import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  corrigerRecouvrement,
  createRecouvrement,
  fetchEcheanciers,
  fetchImportStatus,
  fetchOperations,
  fetchImports,
  fetchRecouvrements,
  fetchReportingComplet,
  startImportExcelAsync,
} from '@/lib/api'
import type { EcheancierDTO, RecouvrementDTO, ReportingComplet } from '@/types'

/** @deprecated Utilisez RecouvrementDTO depuis @/types */
export type RecouvrementRow = RecouvrementDTO
/** @deprecated Utilisez EcheancierDTO depuis @/types */
export type EcheancierRow = EcheancierDTO

export function useRecouvrements() {
  return useQuery({
    queryKey: ['recouvrements'],
    queryFn: fetchRecouvrements,
  })
}

export function useEcheanciers() {
  return useQuery({
    queryKey: ['echeanciers'],
    queryFn: fetchEcheanciers,
  })
}

/** Tableau de bord : reporting + liste dossiers (cache partagé avec les autres écrans). */
export function useDashboard() {
  const reporting = useQuery({
    queryKey: ['reporting-complet'],
    queryFn: fetchReportingComplet,
  })
  const recouvrements = useQuery({
    queryKey: ['recouvrements'],
    queryFn: fetchRecouvrements,
  })
  return {
    reporting,
    recouvrements,
    isLoading: reporting.isPending || recouvrements.isPending,
    isError: reporting.isError || recouvrements.isError,
    error: reporting.error ?? recouvrements.error,
  }
}

export function useCreateRecouvrement() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (articleId: number) => createRecouvrement(articleId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['recouvrements'] })
      qc.invalidateQueries({ queryKey: ['reporting-complet'] })
    },
  })
}

export function useCorrigerRecouvrement() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => corrigerRecouvrement(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['recouvrements'] })
      qc.invalidateQueries({ queryKey: ['reporting-complet'] })
      qc.invalidateQueries({ queryKey: ['echeanciers'] })
    },
  })
}

export function useImportFile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (formData: FormData) => startImportExcelAsync(formData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['recouvrements'] })
      qc.invalidateQueries({ queryKey: ['echeanciers'] })
      qc.invalidateQueries({ queryKey: ['reporting-complet'] })
    },
  })
}

export async function getImportJobStatus(jobId: string) {
  return fetchImportStatus(jobId)
}

/** @deprecated Préférez useDashboard().reporting */
export function useReportingComplet() {
  return useQuery({
    queryKey: ['reporting-complet'],
    queryFn: fetchReportingComplet,
  })
}

export function useOperations() {
  return useQuery({
    queryKey: ['operations'],
    queryFn: fetchOperations,
  })
}

export function useImportsHistory() {
  return useQuery({
    queryKey: ['imports-history'],
    queryFn: fetchImports,
  })
}

export type { ReportingComplet }
