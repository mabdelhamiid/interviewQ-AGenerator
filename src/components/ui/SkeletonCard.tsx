import type { FC } from 'react'

interface SkeletonCardProps {
  count?: number
}

const SkeletonLine: FC<{ width?: string }> = ({ width = 'w-full' }) => (
  <div className={`h-3 rounded-md bg-[var(--color-surface-3)] animate-pulse-dim ${width}`} />
)

const SkeletonCard: FC = () => (
  <div className="border border-[var(--color-border)] rounded-xl p-4 bg-[var(--color-surface)] mb-2">
    {/* Badge row */}
    <div className="flex items-center gap-2 mb-3">
      <div className="h-5 w-10 rounded-md bg-[var(--color-surface-3)] animate-pulse-dim" />
      <div className="h-5 w-12 rounded-md bg-[var(--color-surface-3)] animate-pulse-dim" />
      <div className="h-5 w-16 rounded-md bg-[var(--color-surface-3)] animate-pulse-dim" />
    </div>
    {/* Question text */}
    <div className="flex flex-col gap-2">
      <SkeletonLine />
      <SkeletonLine width="w-3/4" />
    </div>
  </div>
)

const SkeletonList: FC<SkeletonCardProps> = ({ count = 5 }) => (
  <div className="animate-fade-in">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
)

export default SkeletonList
