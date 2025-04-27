import type { ReactNode } from 'react'
import Header from '../Header/Header'

const DefaultLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className='w-full h-screen'>
      <Header />
      <div className='bg-gray-200 h-0.5 w-full'></div>
      {children}
    </div>
  )
}

export default DefaultLayout
