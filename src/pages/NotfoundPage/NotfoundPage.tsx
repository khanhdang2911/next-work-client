import { Button } from 'flowbite-react'
import { HiHome, HiOutlineLogout } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useAuth0 } from '@auth0/auth0-react'
import { logout as logoutApi } from '../../api/auth.api'
import authSlice from '../../redux/authSlice'
import { toast } from 'react-toastify'
import ToastCustom from '../../components/ToastCustom.tsx/ToastCustom'
import { useState } from 'react'

export default function NotFoundPage() {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { logout } = useAuth0()

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      // Logout from auth0
      await logout({ logoutParams: { returnTo: `${window.location.origin}/login` } })
      // Logout from backend
      await logoutApi()
      dispatch(authSlice.actions.logout())
      navigate('/login')
    } catch (error) {
      toast.error('Error when logging out.')
      // Even if there's an error, we should still clear local state
      dispatch(authSlice.actions.logout())
      navigate('/login')
    } finally {
      setIsLoggingOut(false)
    }
  }

  const handleGoHome = () => {
    navigate('/')
  }

  return (
    <>
      {/* Header with navigation options */}
      <div className='fixed top-0 left-0 right-0 bg-white shadow-md p-4 z-50'>
        <div className='container mx-auto flex justify-between items-center'>
          <h1 className='text-xl font-bold text-blue-800'>CloudTalk</h1>
          <div className='flex space-x-4'>
            <Button color='light' onClick={handleGoHome}>
              <HiHome className='mr-2 h-5 w-5' />
              Home
            </Button>
            <Button color='red' onClick={handleLogout} disabled={isLoggingOut}>
              <HiOutlineLogout className='mr-2 h-5 w-5' />
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </Button>
          </div>
        </div>
      </div>

      <div className='flex items-center justify-center h-screen bg-gray-50 pt-20'>
        <div className='relative'>
          <div className='relative flex items-center'>
            <span className='text-gray-300 text-[500px] font-bold leading-none'>4</span>
            <div className='relative'>
              <span className='text-gray-300 text-[500px] font-bold leading-none'>0</span>
            </div>
            <span className='text-gray-300 text-[500px] font-bold leading-none'>4</span>
          </div>

          <div className='absolute inset-0 flex flex-col items-center justify-center'>
            <p className='text-gray-600 text-6xl font-bold whitespace-nowrap'>PAGE NOT FOUND</p>
            <p className='text-gray-500 mt-8 max-w-md text-center'>
              The page you're looking for doesn't exist or you don't have permission to access it. Please try navigating
              to the home page or logging out and back in.
            </p>
          </div>
        </div>
      </div>
      <ToastCustom />
    </>
  )
}
