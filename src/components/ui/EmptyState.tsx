import type { FC, ReactNode } from 'react'

interface EmptyStateProps {
  icon?     : ReactNode
  title     : string
  desc?     : string
  action?   : ReactNode
  className?: string
}

const EmptyState: FC<EmptyStateProps> = ({ icon, title, desc, action, className = '' }) => (
  <div className={['flex flex-col items-center justify-center gap-3 py-16 px-5 text-center', className].join(' ')}>
    {icon && (
      <div className="text-5xl mb-1 opacity-60 select-none" aria-hidden="true">{icon}</div>
    )}
    <p className="text-sm font-medium text-[var(--color-text-muted)]">{title}</p>
    {desc   && <p className="text-xs text-[var(--color-text-subtle)] max-w-xs">{desc}</p>}
    {action && <div className="mt-3">{action}</div>}
  </div>
)

export default EmptyState
