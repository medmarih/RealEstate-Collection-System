import axios from 'axios'

export function getApiErrorMessage(error: unknown, fallback = 'Une erreur est survenue'): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string; error?: string } | undefined
    if (typeof data?.message === 'string') return data.message
    if (typeof data?.error === 'string') return data.error
    if (error.response?.status === 401) return 'Session expirée ou identifiants invalides'
  }
  return fallback
}
