import { forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={id} className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            'w-full rounded-xl border bg-[#0d1117]/80 backdrop-blur-md px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 transition-all duration-200',
            'focus:outline-none focus:bg-[#0d1117] focus:ring-2',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error
              ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
              : 'border-white/10 hover:border-white/20 focus:border-blue-500/50 focus:ring-blue-500/20',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-400 font-medium">{error}</p>}
        {hint && !error && <p className="text-xs text-zinc-500">{hint}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'
