import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Card, Button } from 'flowbite-react'
import { HiCheckCircle, HiXCircle, HiArrowRight, HiHome } from 'react-icons/hi'
import { acceptWorkspaceInvitation } from '../../api/auth.api'
import { useSelector } from 'react-redux'
import { getAuthSelector } from '../../redux/selectors'
import LoadingOverlay from '../../components/LoadingPage/Loading'
import { ErrorMessage } from '../../config/constants'

const AcceptInvitationPage = () => {
  const { workspaceId, token } = useParams<{ workspaceId: string; token: string }>()
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'unauthenticated'>('loading')
  const [message, setMessage] = useState('')
  const [workspaceName, setWorkspaceName] = useState('')
  const navigate = useNavigate()
  const auth: any = useSelector(getAuthSelector)
  const isAuthenticated = auth?.isAuthenticated

  useEffect(() => {
    // First check if user is authenticated
    if (!isAuthenticated) {
      setStatus('unauthenticated')
      setMessage('You need to be logged in to accept this invitation.')
      return
    }

    const verifyInvitation = async () => {
      if (!workspaceId || !token) {
        setStatus('error')
        setMessage('Invalid invitation link.')
        return
      }

      try {
        const response = await acceptWorkspaceInvitation(workspaceId, token)
        if (response.status === 'success') {
          setStatus('success')
          setMessage(response.message || 'You have successfully joined the workspace!')
          setWorkspaceName(response.data?.name || '')
        }
      } catch (error: any) {
        setStatus('error')
        setMessage(error.response?.data?.message || ErrorMessage)
      }
    }

    verifyInvitation()
  }, [workspaceId, token, isAuthenticated])

  const handleGoToWorkspace = () => {
    navigate(`/workspace/${workspaceId}`)
  }

  const handleLogin = () => {
    // Store the invitation URL in session storage to redirect back after login
    sessionStorage.setItem('invitationRedirect', window.location.pathname)
    navigate('/login')
  }

  if (status === 'loading') {
    return <LoadingOverlay isLoading={true} />
  }

  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center p-4'>
      <Card className='max-w-md w-full'>
        {status === 'success' && (
          <div className='text-center'>
            <HiCheckCircle className='mx-auto h-16 w-16 text-green-500 mb-4' />
            <h2 className='text-2xl font-bold text-gray-800 mb-2'>Invitation Accepted!</h2>
            <p className='text-gray-600 mb-6'>{message}</p>
            <p className='text-gray-700 font-medium mb-6'>
              You have successfully joined <span className='font-bold'>{workspaceName}</span>
            </p>
            <Button color='blue' onClick={handleGoToWorkspace} className='w-full'>
              <HiArrowRight className='mr-2 h-5 w-5' />
              Go to Workspace
            </Button>
          </div>
        )}

        {status === 'error' && (
          <div className='text-center'>
            <HiXCircle className='mx-auto h-16 w-16 text-red-500 mb-4' />
            <h2 className='text-2xl font-bold text-gray-800 mb-2'>Invitation Error</h2>
            <p className='text-gray-600 mb-6'>{message}</p>
            <Link to='/workspaces'>
              <Button color='gray' className='w-full'>
                <HiHome className='mr-2 h-5 w-5' />
                Go to Workspaces
              </Button>
            </Link>
          </div>
        )}

        {status === 'unauthenticated' && (
          <div className='text-center'>
            <HiXCircle className='mx-auto h-16 w-16 text-yellow-500 mb-4' />
            <h2 className='text-2xl font-bold text-gray-800 mb-2'>Authentication Required</h2>
            <p className='text-gray-600 mb-6'>{message}</p>
            <Button color='blue' onClick={handleLogin} className='w-full'>
              Log In to Accept Invitation
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}

export default AcceptInvitationPage
