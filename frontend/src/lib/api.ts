import axios, { type AxiosError } from 'axios'
import type {
  AuthResponse,
  EcheancierDTO,
  ImportHistoryItem,
  ImportJobStatus,
  ImportResult,
  RecouvrementDTO,
  ReportingComplet,
} from '@/types'

/**
 * Base URL API Spring Boot.
 * - Dev (Vite) : laisser vide → utilise le proxy `/api` → http://localhost:8080
 * - Prod ou appel direct : `VITE_API_URL=http://localhost:8080`
 */
function resolveBaseURL(): string {
  const fromEnv = import.meta.env.VITE_API_URL as string | undefined
  if (fromEnv?.trim()) {
    const cleaned = fromEnv.trim().replace(/\/$/, '')
    return cleaned.endsWith('/api') ? cleaned : `${cleaned}/api`
  }
  if (import.meta.env.DEV) return '/api'
  return 'http://localhost:8080/api'
}

export const api = axios.create({
  baseURL: resolveBaseURL(),
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (r) => r,
  (error: AxiosError) => {
    console.error('[API]', error.config?.method?.toUpperCase(), error.config?.url, {
      status: error.response?.status,
      data: error.response?.data,
    })
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/auth'
    }
    return Promise.reject(error)
  }
)

function num(v: unknown, fallback = 0): number {
  const n = Number(v)
  return Number.isFinite(n) ? n : fallback
}

function normalizeReporting(data: Record<string, unknown>): ReportingComplet {
  return {
    totalRecouvrements: num(data.totalRecouvrements),
    nombreSolde: num(data.nombreSolde),
    nombreEnCours: num(data.nombreEnCours),
    montantTotal: num(data.montantTotal),
    montantPaye: num(data.montantPaye),
    montantRestant: num(data.montantRestant),
    tauxRecouvrement: num(data.tauxRecouvrement),
  }
}

/** GET /reporting-complet */
export async function fetchReportingComplet(): Promise<ReportingComplet> {
  const { data } = await api.get<Record<string, unknown>>('/reporting-complet')
  return normalizeReporting(data)
}

/** GET /recouvrements */
export async function fetchRecouvrements(): Promise<RecouvrementDTO[]> {
  const { data } = await api.get<RecouvrementDTO[]>('/recouvrements')
  return Array.isArray(data) ? data : []
}

/** GET /echeanciers */
export async function fetchEcheanciers(): Promise<EcheancierDTO[]> {
  const { data } = await api.get<EcheancierDTO[]>('/echeanciers')
  return Array.isArray(data) ? data : []
}

/** PUT /recouvrements/{id}/corriger */
export async function corrigerRecouvrement(id: number): Promise<void> {
  await api.put(`/recouvrements/${id}/corriger`)
}

/** POST /recouvrements/{articleId} */
export async function createRecouvrement(articleId: number): Promise<unknown> {
  const { data } = await api.post<unknown>(`/recouvrements/${articleId}`)
  return data
}

export async function loginRequest(body: { username: string; password: string }): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/login', body)
  return data
}

export async function registerRequest(body: {
  nom: string
  prenom: string
  email: string
  telephone: string
  adresse: string
  password: string
}): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/register', body)
  return data
}

/** POST /import (multipart, champ file) */
export async function postImportExcel(formData: FormData): Promise<ImportResult> {
  const { data } = await api.post<ImportResult>('/import', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function startImportExcelAsync(formData: FormData): Promise<ImportJobStatus> {
  const { data } = await api.post<ImportJobStatus>('/import/async', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function fetchImportStatus(jobId: string): Promise<ImportJobStatus> {
  const { data } = await api.get<ImportJobStatus>(`/import/status/${jobId}`)
  return data
}

export function getApiMessage(error: unknown): string {
  console.error('[API] getApiMessage', error)
  if (axios.isAxiosError(error)) {
    const d = error.response?.data as Record<string, unknown> | undefined
    if (typeof d?.message === 'string') return d.message
    if (typeof d?.error === 'string') return d.error
    if (error.message) return error.message
  }
  if (error instanceof Error) return error.message
  return 'Une erreur est survenue'
}

export async function fetchOperations(): Promise<Record<string, unknown>[]> {
  const { data } = await api.get<Record<string, unknown>[]>('/operations')
  return Array.isArray(data) ? data : []
}

export async function fetchArticles(): Promise<Record<string, unknown>[]> {
  const { data } = await api.get<Record<string, unknown>[]>('/articles')
  return Array.isArray(data) ? data : []
}

export async function fetchClients(): Promise<Record<string, unknown>[]> {
  const { data } = await api.get<Record<string, unknown>[]>('/clients')
  return Array.isArray(data) ? data : []
}

export async function fetchImports(): Promise<ImportHistoryItem[]> {
  const { data } = await api.get<ImportHistoryItem[]>('/imports')
  return Array.isArray(data) ? data : []
}
