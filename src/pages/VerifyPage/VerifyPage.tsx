import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Loader, CheckCircle, XCircle } from 'lucide-react'
import { verifyAccount } from '../../api/mail.api'
import { useDispatch } from 'react-redux'
import authSlice from '../../redux/authSlice'

const VerifyPage = () => {
  const { token, email } = useParams<{ token: string; email: string }>()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [count, setCount] = useState(3)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  useEffect(() => {
    let timer: NodeJS.Timeout
    const verifyInfo = async () => {
      try {
        const response = await verifyAccount(token as string, email as string)
        setStatus('success')
        setMessage('Verify account successfully')
        dispatch(authSlice.actions.setUser(response.data))
        timer = setTimeout(() => {
          navigate('/')
        }, 3000)
      } catch (error) {
        setStatus('error')
        setMessage("Can't verify account. Please login to send verify mail and try again.")
      }
    }
    if (token && email) {
      verifyInfo()
    }
    return () => clearTimeout(timer)
  }, [token, email])
  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  })
  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <div className='bg-white shadow-lg rounded-xl p-6 text-center w-96'>
        {status === 'loading' && (
          <div>
            <Loader className='animate-spin mx-auto text-blue-500' size={48} />
            <h2 className='text-lg font-semibold mt-4'>Verifying...</h2>
          </div>
        )}

        {status === 'success' && (
          <div>
            <CheckCircle className='text-green-500 mx-auto' size={48} />
            <h2 className='text-lg font-semibold mt-4 text-green-600'>
              {message}. Redirect to login page in {count} seconds
            </h2>
          </div>
        )}

        {status === 'error' && (
          <div>
            <XCircle className='text-red-500 mx-auto' size={48} />
            <h2 className='text-lg font-semibold mt-4 text-red-600'>{message}</h2>
          </div>
        )}
      </div>
    </div>
  )
}

export default VerifyPage
