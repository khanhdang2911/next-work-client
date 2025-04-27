import type React from 'react'
import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button, Card, TextInput, Checkbox, Alert } from 'flowbite-react'
import { HiArrowLeft, HiMail, HiUserAdd, HiCheck, HiX } from 'react-icons/hi'
import { getChannelsByWorkspaceId, inviteUserToWorkspace, getAllWorkspaces } from '../../api/auth.api'
import { toast } from 'react-toastify'
import type { IChannel, IWorkspace } from '../../interfaces/Workspace'
import LoadingOverlay from '../../components/LoadingPage/Loading'
import { useSelector } from 'react-redux'
import { getAuthSelector } from '../../redux/selectors'

const WorkspaceInvitePage: React.FC = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>()
  const auth: any = useSelector(getAuthSelector)
  const currentUserId = auth.user?._id

  const [email, setEmail] = useState('')
  const [channels, setChannels] = useState<IChannel[]>([])
  const [selectedChannels, setSelectedChannels] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [workspace, setWorkspace] = useState<IWorkspace | null>(null)

  useEffect(() => {
    const fetchWorkspaceAndCheckAdmin = async () => {
      if (!workspaceId || !currentUserId) return

      setIsLoading(true)
      try {
        const res = await getAllWorkspaces()
        if (res.status === 'success') {
          const currentWorkspace = res.data.find((ws: IWorkspace) => ws._id === workspaceId)

          if (currentWorkspace) {
            setWorkspace(currentWorkspace)
            // Check if current user is the admin of this workspace
            setIsAdmin(currentWorkspace.admin === currentUserId)

            if (currentWorkspace.admin === currentUserId) {
              fetchChannels()
            } else {
              setError("You don't have admin permissions for this workspace")
              setIsLoading(false)
            }
          } else {
            setError('Workspace not found')
            setIsLoading(false)
          }
        } else {
          setError('Failed to fetch workspace details')
          setIsLoading(false)
        }
      } catch (error: any) {
        console.error('Error fetching workspace:', error)
        setError('An error occurred while fetching workspace details')
        setIsLoading(false)
      }
    }

    fetchWorkspaceAndCheckAdmin()
  }, [workspaceId, currentUserId])

  const fetchChannels = async () => {
    if (!workspaceId) return

    try {
      const res = await getChannelsByWorkspaceId(workspaceId)
      if (res.status === 'success') {
        setChannels(res.data)
      } else {
        setError('Failed to fetch channels')
      }
    } catch (error: any) {
      console.error('Error fetching channels:', error)
      setError('An error occurred while fetching channels')
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleChannel = (channelId: string) => {
    setSelectedChannels((prev) =>
      prev.includes(channelId) ? prev.filter((id) => id !== channelId) : [...prev, channelId]
    )
  }

  const handleSelectAll = () => {
    if (selectedChannels.length === channels.length) {
      setSelectedChannels([])
    } else {
      setSelectedChannels(channels.map((channel) => channel._id))
    }
  }

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!email) {
      setError('Please enter an email address')
      return
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    if (selectedChannels.length === 0) {
      setError('Please select at least one channel')
      return
    }

    if (!workspaceId) {
      setError('Workspace ID is missing')
      return
    }

    setIsSending(true)
    try {
      const response = await inviteUserToWorkspace(workspaceId, email, selectedChannels)
      if (response.status === 'success') {
        setSuccess(`Invitation sent to ${email}`)
        setEmail('')
        setSelectedChannels([])
        toast.success(`Invitation sent to ${email}`)
      } else {
        setError('Failed to send invitation')
      }
    } catch (error: any) {
      console.error('Error sending invitation:', error)
      setError(error.response?.data?.message || 'An error occurred while sending the invitation')
    } finally {
      setIsSending(false)
    }
  }

  if (isLoading) {
    return <LoadingOverlay isLoading={true} />
  }

  if (!isAdmin) {
    return (
      <div className='container mx-auto p-6'>
        <div className='mb-6'>
          <Link to={`/workspace/${workspaceId}`}>
            <Button color='light' size='sm'>
              <HiArrowLeft className='mr-2 h-4 w-4' />
              Back to Workspace
            </Button>
          </Link>
        </div>

        <Card className='max-w-2xl mx-auto'>
          <Alert color='failure' icon={HiX}>
            <h3 className='text-lg font-medium'>Access Denied</h3>
            <p>You don't have admin permissions to invite users to this workspace.</p>
          </Alert>
        </Card>
      </div>
    )
  }

  return (
    <div className='container mx-auto p-6'>
      <div className='mb-6'>
        <Link to={`/workspace/${workspaceId}`}>
          <Button color='light' size='sm'>
            <HiArrowLeft className='mr-2 h-4 w-4' />
            Back to Workspace
          </Button>
        </Link>
      </div>

      <Card className='max-w-2xl mx-auto'>
        <h2 className='text-2xl font-bold mb-6 flex items-center'>
          <HiUserAdd className='mr-2 h-6 w-6 text-blue-600' />
          Invite People to {workspace?.name || 'Workspace'}
        </h2>

        {error && (
          <Alert color='failure' className='mb-4' icon={HiX}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert color='success' className='mb-4' icon={HiCheck}>
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <div className='mb-6'>
            <label htmlFor='email' className='block mb-2 text-sm font-medium text-gray-700'>
              Email Address
            </label>
            <TextInput
              id='email'
              type='email'
              icon={HiMail}
              placeholder='colleague@example.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className='mb-6'>
            <div className='flex justify-between items-center mb-2'>
              <label className='block text-sm font-medium text-gray-700'>Select Channels</label>
              <Button color='light' size='xs' onClick={handleSelectAll}>
                {selectedChannels.length === channels.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>

            <div className='border rounded-lg p-4 max-h-60 overflow-y-auto'>
              {channels.length > 0 ? (
                channels.map((channel) => (
                  <div key={channel._id} className='flex items-center mb-2 last:mb-0'>
                    <Checkbox
                      id={`channel-${channel._id}`}
                      checked={selectedChannels.includes(channel._id)}
                      onChange={() => handleToggleChannel(channel._id)}
                    />
                    <label
                      htmlFor={`channel-${channel._id}`}
                      className='ml-2 text-sm font-medium text-gray-900 cursor-pointer'
                    >
                      {channel.isPrivate ? '🔒 ' : '# '}
                      {channel.name}
                      {channel.description && <span className='text-gray-500 text-xs ml-2'>{channel.description}</span>}
                    </label>
                  </div>
                ))
              ) : (
                <p className='text-gray-500 text-sm'>No channels available in this workspace.</p>
              )}
            </div>
          </div>

          <div className='flex justify-end'>
            <Button type='submit' color='blue' disabled={isSending}>
              {isSending ? (
                <>
                  <div className='h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2'></div>
                  Sending Invitation...
                </>
              ) : (
                <>
                  <HiUserAdd className='mr-2 h-4 w-4' />
                  Send Invitation
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default WorkspaceInvitePage
