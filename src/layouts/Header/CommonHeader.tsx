import { Button } from 'flowbite-react'
import { HiHome, HiOutlineLogout } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useAuth0 } from '@auth0/auth0-react'
import { logout as logoutApi } from '../../api/auth.api'
import authSlice from '../../redux/authSlice'
import { toast } from 'react-toastify'
import { useState } from 'react'
const Logo = '/favicon.svg'

interface CommonHeaderProps {
  showBackToHome?: boolean
  showLogout?: boolean
}

export default function CommonHeader({ showBackToHome = true, showLogout = true }: CommonHeaderProps) {
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
    <div className='fixed top-0 left-0 right-0 bg-white shadow-md p-4 z-50'>
      <div className='container mx-auto flex justify-between items-center'>
        <div className='flex items-center text-blue-500'>
          <img src={Logo || '/placeholder.svg'} alt='' className='h-8 w-8 mr-2' />
          <span className='text-xl font-semibold'>Next-work</span>
        </div>
        <div className='flex space-x-4'>
          {showBackToHome && (
            <Button color='light' onClick={handleGoHome}>
              <HiHome className='mr-2 h-5 w-5' />
              Home
            </Button>
          )}
          {showLogout && (
            <Button color='red' onClick={handleLogout} disabled={isLoggingOut}>
              <HiOutlineLogout className='mr-2 h-5 w-5' />
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
