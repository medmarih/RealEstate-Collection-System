import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { getApiMessage, loginRequest, registerRequest } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/Button'
import { Input, Label } from '@/components/ui/Input'
import { cn } from '@/lib/utils'

const loginSchema = z.object({
  email: z.string().min(1, 'Email ou username requis'),
  password: z.string().min(1, 'Mot de passe requis'),
})

const registerSchema = z
  .object({
    nom: z.string().min(1, 'Nom requis'),
    prenom: z.string().min(1, 'Prénom requis'),
    email: z.string().email('Email invalide'),
    telephone: z.string().min(1, 'Téléphone requis'),
    adresse: z.string().min(1, 'Adresse requise'),
    password: z.string().min(3, 'Mot de passe trop court'),
    confirm: z.string().min(1, 'Confirmation requise'),
  })
  .refine((d) => d.password === d.confirm, { message: 'Mots de passe différents', path: ['confirm'] })

const HERO =
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1400&q=80'

export default function Auth() {
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const navigate = useNavigate()
  const setSession = useAuthStore((s) => s.setSession)

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const regForm = useForm<z.infer<typeof registerSchema>>({
    defaultValues: {
      nom: '',
      prenom: '',
      email: '',
      telephone: '+212',
      adresse: '',
      password: '',
      confirm: '',
    },
  })

  const onLogin = loginForm.handleSubmit(async (v) => {
    try {
      const data = await loginRequest({ username: v.email.trim(), password: v.password })
      setSession(data)
      toast.success('Bienvenue')
      navigate((data.role || '').toUpperCase() === 'ADMIN' ? '/dashboard' : '/client/dashboard')
    } catch (e) {
      toast.error(getApiMessage(e))
    }
  })

  const onRegister = regForm.handleSubmit(
    async (v) => {
      try {
        const payload = {
          nom: String(v.nom ?? '').trim(),
          prenom: String(v.prenom ?? '').trim(),
          email: String(v.email ?? '').trim(),
          telephone: String(v.telephone ?? '').trim(),
          adresse: String(v.adresse ?? '').trim(),
          password: String(v.password ?? ''),
          confirm: String(v.confirm ?? ''),
        }

        if (!payload.nom || !payload.prenom || !payload.email || !payload.telephone || !payload.adresse) {
          toast.error('Veuillez remplir tous les champs obligatoires')
          return
        }
        if (!payload.email.includes('@')) {
          toast.error('Email invalide')
          return
        }
        if (payload.password.length < 3) {
          toast.error('Mot de passe trop court')
          return
        }
        if (payload.password !== payload.confirm) {
          toast.error('Mots de passe différents')
          return
        }

        const data = await registerRequest({
          nom: payload.nom,
          prenom: payload.prenom,
          email: payload.email,
          telephone: payload.telephone,
          adresse: payload.adresse,
          password: payload.password,
        })
        setSession(data)
        toast.success('Compte créé')
        navigate('/client/dashboard')
      } catch (e) {
        toast.error(getApiMessage(e))
      }
    },
    (errors) => {
      const first = Object.values(errors)[0]
      toast.error(first?.message || 'Veuillez corriger le formulaire')
    }
  )

  return (
    <div className="grid min-h-screen font-sans md:grid-cols-2">
      <div className="relative hidden md:block">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${HERO}')` }} />
        <div className="absolute inset-0 bg-slate-900/50" />
        <div className="relative flex h-full flex-col justify-end p-12 text-white">
          <h1 className="text-4xl font-bold tracking-tight">Al Omrane Recouvrement</h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/90">
            Plateforme SaaS de pilotage des dossiers, échéances et imports — sécurisée et prête pour la
            production.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md rounded-2xl border border-slate-200/80 bg-white p-8 shadow-xl shadow-slate-900/[0.06]">
          <div className="mb-8 flex rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              className={cn(
                'flex-1 rounded-lg py-2.5 text-sm font-semibold transition',
                tab === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
              )}
              onClick={() => setTab('login')}
            >
              Connexion
            </button>
            <button
              type="button"
              className={cn(
                'flex-1 rounded-lg py-2.5 text-sm font-semibold transition',
                tab === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
              )}
              onClick={() => setTab('register')}
            >
              Inscription
            </button>
          </div>

          {tab === 'login' ? (
            <form onSubmit={onLogin} className="space-y-4">
              <div>
                <Label htmlFor="em">Email / Username</Label>
                <Input id="em" type="text" autoComplete="username" {...loginForm.register('email')} />
                {loginForm.formState.errors.email ? (
                  <p className="mt-1 text-xs text-rose-600">{loginForm.formState.errors.email.message}</p>
                ) : null}
              </div>
              <div>
                <Label htmlFor="pw">Mot de passe</Label>
                <Input
                  id="pw"
                  type="password"
                  autoComplete="current-password"
                  {...loginForm.register('password')}
                />
                {loginForm.formState.errors.password ? (
                  <p className="mt-1 text-xs text-rose-600">{loginForm.formState.errors.password.message}</p>
                ) : null}
              </div>
              <Button type="submit" className="w-full" disabled={loginForm.formState.isSubmitting}>
                {loginForm.formState.isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  'Se connecter'
                )}
              </Button>
              <p className="text-center text-xs text-slate-500">Démo : admin / admin</p>
            </form>
          ) : (
            <form onSubmit={onRegister} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Nom</Label>
                  <Input {...regForm.register('nom')} />
                  {regForm.formState.errors.nom ? (
                    <p className="mt-1 text-xs text-rose-600">{regForm.formState.errors.nom.message}</p>
                  ) : null}
                </div>
                <div>
                  <Label>Prénom</Label>
                  <Input {...regForm.register('prenom')} />
                  {regForm.formState.errors.prenom ? (
                    <p className="mt-1 text-xs text-rose-600">{regForm.formState.errors.prenom.message}</p>
                  ) : null}
                </div>
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" {...regForm.register('email')} />
                {regForm.formState.errors.email ? (
                  <p className="mt-1 text-xs text-rose-600">{regForm.formState.errors.email.message}</p>
                ) : null}
              </div>
              <div>
                <Label>Téléphone</Label>
                <Input {...regForm.register('telephone')} />
                {regForm.formState.errors.telephone ? (
                  <p className="mt-1 text-xs text-rose-600">{regForm.formState.errors.telephone.message}</p>
                ) : null}
              </div>
              <div>
                <Label>Adresse</Label>
                <Input {...regForm.register('adresse')} />
                {regForm.formState.errors.adresse ? (
                  <p className="mt-1 text-xs text-rose-600">{regForm.formState.errors.adresse.message}</p>
                ) : null}
              </div>
              <div>
                <Label>Mot de passe</Label>
                <Input type="password" {...regForm.register('password')} />
                {regForm.formState.errors.password ? (
                  <p className="mt-1 text-xs text-rose-600">{regForm.formState.errors.password.message}</p>
                ) : null}
              </div>
              <div>
                <Label>Confirmation</Label>
                <Input type="password" {...regForm.register('confirm')} />
                {regForm.formState.errors.confirm ? (
                  <p className="mt-1 text-xs text-rose-600">{regForm.formState.errors.confirm.message}</p>
                ) : null}
              </div>
              <Button type="submit" className="w-full" disabled={regForm.formState.isSubmitting}>
                {regForm.formState.isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  'Créer un compte'
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
