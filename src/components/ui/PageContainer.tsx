import type { FC, ReactNode } from 'react'

interface PageContainerProps {
  children  : ReactNode
  className?: string
}

const PageContainer: FC<PageContainerProps> = ({ children, className = '' }) => (
  <div className={['mx-auto w-full max-w-[1200px] px-[clamp(20px,4vw,56px)] py-8', className].join(' ')}>
    {children}
  </div>
)

export default PageContainer
