import type { ReactNode } from 'react'
import Header from '../Header/Header'
import ToastCustom from '../../components/ToastCustom.tsx/ToastCustom'

const DefaultLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className='w-full h-screen'>
      <Header />
      <div className='bg-gray-200 h-0.5 w-full'></div>
      {children}
      <ToastCustom />
    </div>
  )
}

export default DefaultLayout
