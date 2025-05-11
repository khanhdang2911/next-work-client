import { Lock } from 'lucide-react'
import { useState } from 'react'
import { Button } from 'flowbite-react'
import { HiHome, HiOutlineLogout } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useAuth0 } from '@auth0/auth0-react'
import { logout as logoutApi } from '../../api/auth.api'
import authSlice from '../../redux/authSlice'
import { toast } from 'react-toastify'
import ToastCustom from '../../components/ToastCustom.tsx/ToastCustom'

export default function ForbiddenPage() {
  const [hover, setHover] = useState(false)
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
          <h1 className='text-xl font-bold text-blue-800'>Next-work</h1>
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

      <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-4 pt-20'>
        <div
          className='relative transition-transform duration-300'
          style={{ transform: hover ? 'translateY(-10px)' : 'none' }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <div className='relative w-full' style={{ width: '768px', height: '768px' }}>
            <div className='absolute inset-0 flex items-center justify-center -z-10'>
              <Lock className='text-black mx-auto' size={800} strokeWidth={1} />
            </div>

            <div
              className='absolute inset-0 flex flex-col items-center justify-center z-10'
              style={{ paddingTop: '240px' }}
            >
              <h1 className='text-blue-800 font-bold tracking-tighter' style={{ fontSize: '12rem', lineHeight: '1' }}>
                403
              </h1>
              <p className='text-blue-600 text-4xl font-semibold tracking-wider mt-4'>ACCESS FORBIDDEN</p>
            </div>
          </div>
        </div>
      </div>
      <ToastCustom />
    </>
  )
}
