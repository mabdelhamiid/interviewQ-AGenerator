import type { FC, ReactNode } from 'react'

interface PageContainerProps {
  children  : ReactNode
  className?: string
}

const PageContainer: FC<PageContainerProps> = ({ children, className = '' }) => (
  <div className={['max-w-[1280px] mx-auto px-6 pb-16 w-full', className].join(' ')}>
    {children}
  </div>
)

export default PageContainer
