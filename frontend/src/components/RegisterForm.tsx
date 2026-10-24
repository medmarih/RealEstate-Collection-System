import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { registerRequest } from '@/services/modules'
import { useAuthStore } from '@/store/auth-store'
import { getApiErrorMessage } from '@/utils/apiError'

const schema = z
  .object({
    nom: z.string().min(1, 'Nom requis'),
    prenom: z.string().min(1, 'Prénom requis'),
    email: z.string().email('Email invalide'),
    telephone: z.string().min(1, 'Téléphone requis'),
    adresse: z.string().min(1, 'Adresse requise'),
    password: z.string().min(3, 'Au moins 3 caractères'),
    confirmPassword: z.string().min(1, 'Confirmation requise'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  })

type FormValues = z.infer<typeof schema>

const inputClass =
  'h-[42px] w-full rounded-lg border border-[#e5e7eb] px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1D9E75] focus:ring-1 focus:ring-[#1D9E75]'

export function RegisterForm() {
  const navigate = useNavigate()
  const setSession = useAuthStore((s) => s.setSession)
  const [formError, setFormError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nom: '',
      prenom: '',
      email: '',
      telephone: '+212',
      adresse: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (values: FormValues) => {
    setFormError('')
    try {
      const data = await registerRequest({
        nom: values.nom.trim(),
        prenom: values.prenom.trim(),
        email: values.email.trim(),
        telephone: values.telephone.trim(),
        adresse: values.adresse.trim(),
        password: values.password,
      })
      setSession(data)
      navigate('/dashboard')
    } catch (e) {
      setFormError(getApiErrorMessage(e))
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="reg-nom" className="mb-1.5 block text-sm font-medium text-slate-700">
            Nom
          </label>
          <input id="reg-nom" className={inputClass} {...register('nom')} />
          {errors.nom ? <p className="mt-1 text-xs text-[#dc2626]">{errors.nom.message}</p> : null}
        </div>
        <div>
          <label htmlFor="reg-prenom" className="mb-1.5 block text-sm font-medium text-slate-700">
            Prénom
          </label>
          <input id="reg-prenom" className={inputClass} {...register('prenom')} />
          {errors.prenom ? <p className="mt-1 text-xs text-[#dc2626]">{errors.prenom.message}</p> : null}
        </div>
      </div>

      <div>
        <label htmlFor="reg-email" className="mb-1.5 block text-sm font-medium text-slate-700">
          Email
        </label>
        <input id="reg-email" type="email" autoComplete="email" className={inputClass} {...register('email')} />
        {errors.email ? <p className="mt-1 text-xs text-[#dc2626]">{errors.email.message}</p> : null}
      </div>

      <div>
        <label htmlFor="reg-tel" className="mb-1.5 block text-sm font-medium text-slate-700">
          Téléphone
        </label>
        <input id="reg-tel" type="tel" placeholder="+212" className={inputClass} {...register('telephone')} />
        {errors.telephone ? <p className="mt-1 text-xs text-[#dc2626]">{errors.telephone.message}</p> : null}
      </div>

      <div>
        <label htmlFor="reg-adr" className="mb-1.5 block text-sm font-medium text-slate-700">
          Adresse
        </label>
        <input id="reg-adr" className={inputClass} {...register('adresse')} />
        {errors.adresse ? <p className="mt-1 text-xs text-[#dc2626]">{errors.adresse.message}</p> : null}
      </div>

      <div>
        <label htmlFor="reg-pass" className="mb-1.5 block text-sm font-medium text-slate-700">
          Mot de passe
        </label>
        <input id="reg-pass" type="password" autoComplete="new-password" className={inputClass} {...register('password')} />
        {errors.password ? <p className="mt-1 text-xs text-[#dc2626]">{errors.password.message}</p> : null}
      </div>

      <div>
        <label htmlFor="reg-pass2" className="mb-1.5 block text-sm font-medium text-slate-700">
          Confirmer mot de passe
        </label>
        <input
          id="reg-pass2"
          type="password"
          autoComplete="new-password"
          className={inputClass}
          {...register('confirmPassword')}
        />
        {errors.confirmPassword ? (
          <p className="mt-1 text-xs text-[#dc2626]">{errors.confirmPassword.message}</p>
        ) : null}
      </div>

      {formError ? <p className="text-sm text-[#dc2626]">{formError}</p> : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex h-[48px] w-full items-center justify-center rounded-lg bg-[#085041] text-sm font-semibold text-white transition hover:bg-[#063a30] disabled:opacity-60"
      >
        {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : 'Créer mon compte'}
      </button>
    </form>
  )
}
