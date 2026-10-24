import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type Tone = 'default' | 'success' | 'warning' | 'danger' | 'neutral'

const tones: Record<Tone, string> = {
  default: 'bg-emerald-50 text-emerald-800 ring-emerald-600/15',
  success: 'bg-emerald-50 text-emerald-800 ring-emerald-600/15',
  warning: 'bg-amber-50 text-amber-800 ring-amber-600/15',
  danger: 'bg-rose-50 text-rose-800 ring-rose-600/15',
  neutral: 'bg-slate-100 text-slate-700 ring-slate-500/10',
}

export function Badge({
  className,
  tone = 'default',
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset',
        tones[tone],
        className
      )}
      {...props}
    />
  )
}
