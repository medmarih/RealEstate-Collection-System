import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

const variants = {
  default:
    'bg-emerald-500 text-slate-900 shadow-md shadow-emerald-900/20 hover:bg-emerald-400 active:scale-[0.98]',
  secondary: 'bg-slate-800 text-slate-100 hover:bg-slate-700 active:scale-[0.98]',
  ghost: 'bg-transparent text-slate-300 hover:bg-slate-800',
}

const sizes = {
  default: 'h-10 rounded-xl px-4 text-sm font-semibold',
  sm: 'h-8 rounded-lg px-3 text-xs font-semibold',
}

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 transition duration-150 disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  )
)
Button.displayName = 'Button'
