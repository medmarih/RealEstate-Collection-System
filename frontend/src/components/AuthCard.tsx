import { useSearchParams } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'

type Tab = 'connexion' | 'inscription'

export function AuthCard() {
  const [searchParams, setSearchParams] = useSearchParams()
  const tab: Tab = searchParams.get('tab') === 'inscription' ? 'inscription' : 'connexion'

  const setTab = (next: Tab) => {
    setSearchParams(next === 'connexion' ? {} : { tab: 'inscription' }, { replace: true })
  }

  return (
    <div className="w-full max-w-[420px] rounded-xl bg-white p-8 shadow-md">
      <div className="mb-6 flex border-b border-[#e5e7eb]">
        <button
          type="button"
          onClick={() => setTab('connexion')}
          className={cn(
            'flex-1 pb-3 text-center text-sm font-semibold transition-colors',
            tab === 'connexion'
              ? 'border-b-2 border-[#dc2626] text-[#dc2626]'
              : 'border-b-2 border-transparent text-gray-500 hover:text-slate-700'
          )}
        >
          Connexion
        </button>
        <button
          type="button"
          onClick={() => setTab('inscription')}
          className={cn(
            'flex-1 pb-3 text-center text-sm font-semibold transition-colors',
            tab === 'inscription'
              ? 'border-b-2 border-[#dc2626] text-[#dc2626]'
              : 'border-b-2 border-transparent text-gray-500 hover:text-slate-700'
          )}
        >
          Inscription
        </button>
      </div>

      {tab === 'connexion' ? <LoginForm /> : <RegisterForm />}
    </div>
  )
}
