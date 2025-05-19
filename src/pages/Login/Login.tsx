import type React from 'react'
import { useEffect, useState } from 'react'
import { Card, TextInput, Label, Button, Checkbox } from 'flowbite-react'
import { HiMail, HiLockClosed } from 'react-icons/hi'
import { useDispatch, useSelector } from 'react-redux'
import authSlice from '../../redux/authSlice'
import { login, loginWithAuth0 } from '../../api/auth.api'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import Google from '../../assets/icons/google.svg'
import { toast } from 'react-toastify'
import { getAuthSelector } from '../../redux/selectors'

export default function Login() {
  const auth: any = useSelector(getAuthSelector)
  const { loginWithRedirect, isAuthenticated, user, getAccessTokenSilently } = useAuth0()
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { logout } = useAuth0()

  // Check if there's a pending invitation redirect
  const invitationRedirect = sessionStorage.getItem('invitationRedirect')

  useEffect(() => {
    const handleLoginWithAuth0 = async () => {
      try {
        setIsGoogleLoading(true)
        const accessToken = await getAccessTokenSilently()
        const response = await loginWithAuth0(user, accessToken)
        if (response.status === 'success') {
          dispatch(authSlice.actions.setUser(response.data))
        }

        // Check if there's a pending invitation redirect
        const redirectPath = sessionStorage.getItem('invitationRedirect')
        if (redirectPath) {
          sessionStorage.removeItem('invitationRedirect')
          navigate(redirectPath)
        } else {
          navigate('/')
        }
      } catch (error: any) {
        toast.error(error?.response?.data?.message ?? 'Login failed. Please try again.')
        // delete token and logout
        // logout google
        await logout({ logoutParams: { returnTo: `${window.location.origin}/login` } })
        navigate('/login')
      } finally {
        setIsGoogleLoading(false)
      }
    }

    if (isAuthenticated) {
      handleLoginWithAuth0()
    }
  }, [isAuthenticated])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Please enter both email and password.')
      return
    }

    try {
      setIsLoading(true)
      const response = await login({ email, password })
      if (response.status === 'success') {
        dispatch(authSlice.actions.setUser(response.data))
      }
      setIsLoading(false)

      // Check if there's a pending invitation redirect
      if (invitationRedirect) {
        sessionStorage.removeItem('invitationRedirect')
        navigate(invitationRedirect)
      } else {
        navigate('/')
      }
    } catch (error: any) {
      setIsLoading(false)
      // Improved error handling
      const errorMessage = error?.response?.data?.message ?? 'Login failed. Please try again.'
      toast.error(errorMessage)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true)
      await loginWithRedirect({
        authorizationParams: {
          connection: 'google-oauth2',
          prompt: 'select_account' // Force account selection popup
        }
      })
    } catch (error) {
      toast.error('Error when login with Google.')
      setIsGoogleLoading(false)
    }
  }

  if (auth.isAuthenticated) {
    // Check if there's a pending invitation redirect
    if (invitationRedirect) {
      sessionStorage.removeItem('invitationRedirect')
      navigate(invitationRedirect)
      return null
    }

    navigate('/')
    return null
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <Card className='w-full max-w-md'>
        <h2 className='text-2xl font-bold text-center mb-6 text-gray-800'>Welcome Back</h2>
        {invitationRedirect && (
          <div className='mb-4 p-3 bg-blue-50 text-blue-800 rounded-lg'>
            Please log in to accept the workspace invitation
          </div>
        )}
        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
          <div>
            <Label htmlFor='email' className='text-sm font-medium text-gray-700'>
              Email
            </Label>
            <TextInput
              id='email'
              type='email'
              icon={HiMail}
              placeholder='name@example.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='mt-1'
            />
          </div>
          <div>
            <Label htmlFor='password' className='text-sm font-medium text-gray-700'>
              Password
            </Label>
            <TextInput
              id='password'
              type='password'
              icon={HiLockClosed}
              placeholder='••••••••'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='mt-1'
            />
          </div>
          <div className='flex items-center justify-between'>
            <div className='flex items-center'>
              <Checkbox id='remember' checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
              <Label htmlFor='remember' className='ml-2 text-sm text-gray-600'>
                Remember me
              </Label>
            </div>
            <div className='text-sm text-blue-600 hover:underline'>Forgot password?</div>
          </div>
          <Button color='blue' type='submit' className='w-full' disabled={isLoading}>
            {isLoading ? (
                <>
                  <div className='h-4 w-4 border-2 border-t-transparent border-blue-600 rounded-full animate-spin mr-2'></div>
                  <span>Checking Login</span>
                </>
              ) : (
                <>
                  <p>Sign In</p>
                </>
              )}
          </Button>
        </form>

        <div className='mt-4'>
          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-gray-300'></div>
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className='px-2 bg-white text-gray-500'>Or continue with</span>
            </div>
          </div>
          <div className='mt-6'>
            <Button
              onClick={handleGoogleLogin}
              color='light'
              className='w-full flex items-center justify-center'
              disabled={isGoogleLoading}
            >
              {isGoogleLoading ? (
                <>
                  <div className='h-4 w-4 border-2 border-t-transparent border-blue-600 rounded-full animate-spin mr-2'></div>
                  <span>Connecting to Google...</span>
                </>
              ) : (
                <>
                  <img className='w-4 h-4 mt-0.5 mr-1' src={Google || '/placeholder.svg'} alt='google' />
                  <p>Google</p>
                </>
              )}
            </Button>
          </div>
        </div>

        <p className='mt-4 text-center text-sm text-gray-600'>
          Don&apos;t have an account?
          <Link to='/register' className='font-medium text-blue-600 hover:underline ml-1'>
            Sign up
          </Link>
        </p>
      </Card>
    </div>
  )
}
