export type RecouvrementStatus = 'EN_COURS' | 'SOLDE'

export interface DashboardKpi {
  totalRecouvre: number
  montantRestant: number
  tauxRecouvrement: number
  dossiersSoldes: number
}

export interface Operation {
  id: number
  reference: string
  ville: string
  statut: string
  montantTotal: number
}

export interface Article {
  id: number
  operationId: number
  libelle: string
  type: string
  statut: string
}

export interface Client {
  id: number
  nomComplet: string
  cin: string
  telephone: string
  nombreContrats: number
}

export interface Recouvrement {
  id: number
  client: string
  article: string
  montantTotal: number
  montantPaye: number
  montantRestant: number
  statut: RecouvrementStatus
  anomalie: boolean
}

export interface Echeance {
  id: number
  recouvrementId: number
  dateEcheance: string
  montant: number
  statut: 'PAYE' | 'A_VENIR' | 'RETARD'
}

export interface UserProfile {
  username: string
  role: string
}
