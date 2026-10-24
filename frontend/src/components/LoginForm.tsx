import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { loginRequest } from '@/services/modules'
import { useAuthStore } from '@/store/auth-store'
import { getApiErrorMessage } from '@/utils/apiError'

const schema = z.object({
  email: z.string().min(1, 'Email ou username requis'),
  password: z.string().min(1, 'Mot de passe requis'),
})

type FormValues = z.infer<typeof schema>

const inputClass =
  'h-[42px] w-full rounded-lg border border-[#e5e7eb] px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1D9E75] focus:ring-1 focus:ring-[#1D9E75]'

export function LoginForm() {
  const navigate = useNavigate()
  const setSession = useAuthStore((s) => s.setSession)
  const [formError, setFormError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (values: FormValues) => {
    setFormError('')
    try {
      const data = await loginRequest({ username: values.email.trim(), password: values.password })
      setSession(data)
      navigate('/dashboard')
    } catch (e) {
      setFormError(getApiErrorMessage(e, 'Identifiants invalides'))
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="login-email" className="mb-1.5 block text-sm font-medium text-slate-700">
          Email / Username
        </label>
        <input id="login-email" type="text" autoComplete="username" className={inputClass} {...register('email')} />
        {errors.email ? <p className="mt-1 text-xs text-[#dc2626]">{errors.email.message}</p> : null}
      </div>

      <div>
        <label htmlFor="login-password" className="mb-1.5 block text-sm font-medium text-slate-700">
          Mot de passe
        </label>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          className={inputClass}
          {...register('password')}
        />
        {errors.password ? <p className="mt-1 text-xs text-[#dc2626]">{errors.password.message}</p> : null}
      </div>

      {formError ? <p className="text-sm text-[#dc2626]">{formError}</p> : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex h-[48px] w-full items-center justify-center rounded-lg bg-[#085041] text-sm font-semibold text-white transition hover:bg-[#063a30] disabled:opacity-60"
      >
        {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : 'Se connecter'}
      </button>
    </form>
  )
}
