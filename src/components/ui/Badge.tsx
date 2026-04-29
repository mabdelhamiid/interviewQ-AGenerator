import type { FC, HTMLAttributes } from 'react'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  color?: string
}

const Badge: FC<BadgeProps> = ({ color, className = '', style, children, ...rest }) => (
  <span
    className={[
      'text-[10px] font-bold px-[7px] py-0.5 rounded-md flex-shrink-0 inline-flex items-center gap-1',
      color ? '' : 'bg-[var(--color-surface-2)] text-[var(--color-text-muted)]',
      className,
    ].join(' ')}
    style={color ? { '--c': color, ...style } as React.CSSProperties : style}
    {...rest}
  >
    {children}
  </span>
)

export default Badge
