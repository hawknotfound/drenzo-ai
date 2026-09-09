import { forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#090b10] disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]',
          {
            'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/20 focus:ring-blue-500/50':
              variant === 'primary',
            'bg-white/5 text-zinc-200 hover:bg-white/10 border border-white/10 hover:border-white/20 focus:ring-white/20':
              variant === 'secondary',
            'bg-transparent text-zinc-400 hover:text-white hover:bg-white/5 focus:ring-white/20':
              variant === 'ghost',
            'bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-400 hover:to-rose-500 shadow-lg shadow-red-500/20 focus:ring-red-500/50':
              variant === 'danger',
          },
          {
            'px-3 py-1.5 text-xs gap-1.5': size === 'sm',
            'px-4 py-2.5 text-sm gap-2': size === 'md',
            'px-6 py-3 text-base gap-2': size === 'lg',
          },
          loading && 'cursor-wait',
          className
        )}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'
