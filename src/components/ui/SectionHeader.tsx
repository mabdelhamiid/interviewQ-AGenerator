import type { FC, ReactNode } from 'react'

interface SectionHeaderProps {
  title     : ReactNode
  subtitle? : ReactNode
  action?   : ReactNode
  className?: string
}

const SectionHeader: FC<SectionHeaderProps> = ({ title, subtitle, action, className = '' }) => (
  <div className={['flex items-start justify-between gap-4 mb-5', className].join(' ')}>
    <div>
      {typeof title === 'string' ? (
        <h2 className="text-base font-bold text-[var(--color-text)]">{title}</h2>
      ) : (
        <div className="text-base font-bold text-[var(--color-text)]">{title}</div>
      )}
      {subtitle && <p className="text-xs text-[var(--color-text-subtle)] mt-1">{subtitle}</p>}
    </div>
    {action && <div className="flex-shrink-0">{action}</div>}
  </div>
)

export default SectionHeader
