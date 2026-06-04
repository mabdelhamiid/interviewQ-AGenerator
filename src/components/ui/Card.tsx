import type { FC, HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  active?: boolean
  padding?: 'sm' | 'md' | 'none'
}

const paddingMap = { sm: '1rem', md: '1.5rem', none: '0' }

const Card: FC<CardProps> = ({
  hover   = false,
  active  = false,
  padding = 'md',
  className = '',
  style,
  children,
  ...rest
}) => (
  <div
    className={className}
    style={{
      background: 'var(--color-surface, #111118)',
      border: `1px solid ${active ? 'rgba(99,102,241,0.40)' : 'rgba(255,255,255,0.07)'}`,
      borderRadius: 14,
      padding: paddingMap[padding],
      boxShadow: active ? '0 0 0 1px rgba(99,102,241,0.20), var(--shadow-glass)' : 'var(--shadow-glass)',
      transition: hover ? 'border-color var(--transition-fast), box-shadow var(--transition-fast)' : undefined,
      cursor: hover ? 'pointer' : undefined,
      ...style,
    }}
    onMouseEnter={hover ? e => {
      const el = e.currentTarget as HTMLElement
      el.style.borderColor = 'rgba(99,102,241,0.35)'
      el.style.boxShadow   = '0 4px 24px rgba(99,102,241,0.12), var(--shadow-glass)'
    } : undefined}
    onMouseLeave={hover ? e => {
      const el = e.currentTarget as HTMLElement
      el.style.borderColor = active ? 'rgba(99,102,241,0.40)' : 'rgba(255,255,255,0.07)'
      el.style.boxShadow   = active ? '0 0 0 1px rgba(99,102,241,0.20), var(--shadow-glass)' : 'var(--shadow-glass)'
    } : undefined}
    {...rest}
  >
    {children}
  </div>
)

export default Card
