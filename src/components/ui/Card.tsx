import type { FC, HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  active?: boolean
  padding?: 'sm' | 'md' | 'none'
}

const paddingCls = { sm: 'p-4', md: 'p-6', none: '' }

const Card: FC<CardProps> = ({
  hover   = false,
  active  = false,
  padding = 'md',
  className = '',
  children,
  ...rest
}) => (
  <div
    className={[
      'bg-gradient-to-br from-navy-800 to-navy-900 border rounded-xl',
      active  ? 'border-blue-700/50 shadow-md shadow-blue-900/30' : 'border-navy-600',
      hover   ? 'hover:border-navy-500 hover:shadow-lg hover:shadow-blue-950/50 transition-all cursor-pointer' : '',
      paddingCls[padding],
      className,
    ].join(' ')}
    {...rest}
  >
    {children}
  </div>
)

export default Card
