'use client'

import React, { useEffect, useState } from 'react'
import { Card, TextInput, Label, Button, Checkbox } from 'flowbite-react'
import { HiMail, HiLockClosed } from 'react-icons/hi'
import { useDispatch, useSelector } from 'react-redux'
import authSlice from '../../redux/authSlice'
import { login, loginWithAuth0 } from '../../api/auth.api'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import Google from '../../assets/icons/google.svg'
import Microsoft from '../../assets/icons/microsoft.svg'
import LoadingOverlay from '../../components/LoadingPage/Loading'
import { toast, ToastContainer } from 'react-toastify'
import { getAuthSelector } from '../../redux/selectors'
export default function Login() {
  const auth: any = useSelector(getAuthSelector)
  const { loginWithRedirect, isAuthenticated, user, getAccessTokenSilently } = useAuth0()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  useEffect(() => {
    const handleLoginWithAuth0 = async () => {
      const accessToken = await getAccessTokenSilently()
      const response = await loginWithAuth0(user, accessToken)
      if (response.status == 'success') {
        dispatch(authSlice.actions.setUser(response.data))
      }
      navigate('/')
    }
    try {
      if (isAuthenticated) {
        handleLoginWithAuth0()
      }
    } catch (error) {
      toast.error('Error when login with Auth0.')
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
      if (response.status == 'success') {
        dispatch(authSlice.actions.setUser(response.data))
      }
      setIsLoading(false)
      navigate('/')
    } catch (error) {
      setIsLoading(false)
      toast.error((error as any)?.response?.data.message)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      await loginWithRedirect({
        authorizationParams: {
          connection: 'google-oauth2'
        }
      })
    } catch (error) {
      toast.error('Error when login with Google.')
    }
  }

  const handleMicrosoftLogin = async () => {
    try {
      await loginWithRedirect({
        authorizationParams: {
          connection: 'windowslive'
        }
      })
    } catch (error) {
      toast.error('Error when login with Microsoft.')
    }
  }
  if (auth.isAuthenticated) {
    navigate('/')
    return null
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <Card className='w-full max-w-[90%] sm:max-w-md'>
        <h2 className='text-2xl font-bold text-center mb-6 text-gray-800'>Welcome Back to CloudTalk </h2>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
          <div>
            <Label htmlFor='email' value='Email' className='text-sm font-medium text-gray-700' />
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
            <Label htmlFor='password' value='Password' className='text-sm font-medium text-gray-700' />
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
            <a href='#' className='text-sm text-blue-600 hover:underline'>
              Forgot password?
            </a>
          </div>
          <Button color='blue' type='submit' className='w-full'>
            Sign In
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
          <div className='mt-6 grid grid-cols-2 gap-3'>
            <Button color='light' onClick={handleGoogleLogin} className='w-full flex items-center justify-center'>
              <img className='w-4 h-4 mt-0.5 mr-1' src={Google} alt='google' />
              <p>Google</p>
            </Button>
            <Button color='light' onClick={handleMicrosoftLogin} className='w-full flex items-center justify-center'>
              <img className='w-5 h-5 mt-0.5 mr-1' src={Microsoft} alt='microsoft' />
              <p>Microsoft Account</p>
            </Button>
          </div>
        </div>
        <p className='mt-4 text-center text-sm text-gray-600'>
          Don't have an account?
          <Link to='/register' className='font-medium text-blue-600 hover:underline'>
            Sign up
          </Link>
        </p>
      </Card>
      <LoadingOverlay isLoading={isLoading} />
      <ToastContainer />
    </div>
  )
}
