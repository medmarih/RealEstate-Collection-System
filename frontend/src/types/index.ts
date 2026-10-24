/** DTO renvoyé par GET /recouvrements */
export interface RecouvrementDTO {
  id: number
  montantTotal: number
  montantPaye: number
  montantRestant: number
  statut: 'EN_COURS' | 'SOLDE' | string
}

/** GET /echeanciers — champs JSON Spring */
export interface EcheancierDTO {
  idEcheance: number
  montant: number
  dateEcheance: string
  paye: boolean
  delai: number
  recouvrement?: { id?: number }
}

export interface ReportingComplet {
  totalRecouvrements: number
  nombreSolde: number
  nombreEnCours: number
  montantTotal: number
  montantPaye: number
  montantRestant: number
  tauxRecouvrement: number
}

export interface AuthResponse {
  token: string
  username: string
  role: string
}

export interface ImportResult {
  fileName: string
  total: number
  success: number
  failed: number
  warnings: string[]
  errors: { row: number; message: string }[]
  anomalies: { row: number; flag: string; message: string }[]
  corrections: { row: number; field: string; original: string; corrected: string }[]
}

export interface ImportHistoryItem {
  id: number
  fileName: string
  importDate: string
  totalRows: number
  successRows: number
  failedRows: number
  userName?: string | null
}

export interface ImportJobStatus {
  jobId: string
  status: 'RUNNING' | 'SUCCESS' | 'FAILED' | 'NOT_FOUND' | string
  progress: number
  message?: string
  result?: ImportResult
}

export function recouvrementHasAnomaly(r: RecouvrementDTO): boolean {
  const total = r.montantTotal ?? 0
  const paye = r.montantPaye ?? 0
  const restant = r.montantRestant ?? 0
  return restant < 0 || paye > total + 0.01 || (r.statut === 'SOLDE' && restant > 0.01)
}
