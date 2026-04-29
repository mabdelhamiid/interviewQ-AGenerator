import type { FC, ButtonHTMLAttributes, ReactNode } from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize    = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:  ButtonVariant
  size?:     ButtonSize
  loading?:  boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

const variantCls: Record<ButtonVariant, string> = {
  primary:   'bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary-glow)] hover:bg-[var(--color-primary-hover)] active:scale-[0.97]',
  secondary: 'bg-transparent border border-[var(--color-border)] text-[var(--color-primary)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-dim)]',
  ghost:     'bg-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-2)]',
  danger:    'bg-transparent border border-[rgba(244,63,94,0.35)] text-[var(--color-error)] hover:border-[var(--color-error)] hover:bg-[rgba(244,63,94,0.1)]',
}

const sizeCls: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs  rounded-lg  gap-1.5',
  md: 'px-5 py-2.5 text-sm  rounded-xl  gap-2',
  lg: 'px-7 py-3   text-sm  rounded-xl  gap-2',
}

const Spinner: FC = () => (
  <span
    className="inline-block w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin"
    aria-hidden="true"
  />
)

const Button: FC<ButtonProps> = ({
  variant   = 'primary',
  size      = 'md',
  loading   = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  children,
  ...rest
}) => {
  const isDisabled = disabled || loading

  return (
    <button
      disabled={isDisabled}
      aria-disabled={isDisabled}
      className={[
        'inline-flex items-center justify-center font-semibold transition-all duration-150',
        variantCls[variant],
        sizeCls[size],
        isDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer',
        className,
      ].join(' ')}
      {...rest}
    >
      {loading ? (
        <>
          <Spinner />
          {children}
        </>
      ) : (
        <>
          {leftIcon  && <span aria-hidden="true">{leftIcon}</span>}
          {children}
          {rightIcon && <span aria-hidden="true">{rightIcon}</span>}
        </>
      )}
    </button>
  )
}

export default Button
