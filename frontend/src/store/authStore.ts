import { create } from 'zustand'
import { loginRequest } from '@/lib/api'
import type { AuthResponse } from '@/types'

interface AuthState {
  token: string | null
  username: string | null
  role: string | null
  isAuthenticated: boolean
  setSession: (d: AuthResponse) => void
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
}

const tokenInit = localStorage.getItem('token')
const usernameInit = localStorage.getItem('auth_username')
const roleInit = localStorage.getItem('auth_role')

export const useAuthStore = create<AuthState>((set) => ({
  token: tokenInit,
  username: usernameInit,
  role: roleInit,
  isAuthenticated: Boolean(tokenInit),
  setSession: (d) => {
    localStorage.setItem('token', d.token)
    localStorage.setItem('auth_username', d.username)
    localStorage.setItem('auth_role', d.role)
    set({
      token: d.token,
      username: d.username,
      role: d.role,
      isAuthenticated: true,
    })
  },
  login: async (username, password) => {
    try {
      const data = await loginRequest({ username, password })
      useAuthStore.getState().setSession(data)
      return true
    } catch {
      return false
    }
  },
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('auth_username')
    localStorage.removeItem('auth_role')
    set({ token: null, username: null, role: null, isAuthenticated: false })
  },
}))
