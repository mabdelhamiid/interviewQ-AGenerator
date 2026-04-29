import type { FC } from 'react'

interface LoadingSpinnerProps {
  size?  : 'sm' | 'md' | 'lg'
  color? : string
  className?: string
}

const sizeCls = {
  sm: 'w-3  h-3  border-2',
  md: 'w-5  h-5  border-2',
  lg: 'w-8  h-8  border-[3px]',
}

const LoadingSpinner: FC<LoadingSpinnerProps> = ({ size = 'md', color = '#60A5FA', className = '' }) => (
  <span
    className={['inline-block rounded-full border-transparent animate-spin flex-shrink-0', sizeCls[size], className].join(' ')}
    style={{ borderTopColor: color }}
  />
)

export default LoadingSpinner
