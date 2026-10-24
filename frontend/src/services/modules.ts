import { api } from './api'
import type {
  Article,
  Client,
  DashboardKpi,
  Echeance,
  Operation,
  Recouvrement,
  UserProfile,
} from '@/types/domain'

export interface LoginPayload {
  username: string
  password: string
}

export interface RegisterPayload {
  nom: string
  prenom: string
  email: string
  telephone: string
  adresse: string
  password: string
}

export type AuthResponse = { token: string; username: string; role: string }

export async function loginRequest(payload: LoginPayload) {
  const { data } = await api.post<AuthResponse>('/auth/login', payload)
  return data
}

export async function registerRequest(payload: RegisterPayload) {
  const { data } = await api.post<AuthResponse>('/auth/register', payload)
  return data
}

export async function fetchMe() {
  const { data } = await api.get<UserProfile>('/auth/me')
  return data
}

export async function fetchDashboardKpis() {
  const { data } = await api.get<DashboardKpi>('/recouvrements/reporting-complet')
  return data
}

export async function fetchOperations() {
  const { data } = await api.get<Operation[]>('/operations')
  return data
}

export async function fetchArticles() {
  const { data } = await api.get<Article[]>('/articles')
  return data
}

export async function fetchClients() {
  const { data } = await api.get<Client[]>('/clients')
  return data
}

export async function fetchRecouvrements() {
  const { data } = await api.get<Recouvrement[]>('/recouvrements')
  return data
}

export async function fetchEcheances() {
  const { data } = await api.get<Echeance[]>('/echeanciers')
  return data
}
