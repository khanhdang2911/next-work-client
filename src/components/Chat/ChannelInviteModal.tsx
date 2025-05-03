import type React from 'react'
import { useState } from 'react'
import { Modal, Button, TextInput, Alert } from 'flowbite-react'
import { HiMail, HiUserAdd, HiCheck, HiX } from 'react-icons/hi'
import { inviteUserToChannel } from '../../api/auth.api'
import { toast } from 'react-toastify'
import { ErrorMessage } from '../../config/constants'

interface ChannelInviteModalProps {
  isOpen: boolean
  onClose: () => void
  workspaceId: string
  channelId: string
  channelName: string
}

const ChannelInviteModal: React.FC<ChannelInviteModalProps> = ({
  isOpen,
  onClose,
  workspaceId,
  channelId,
  channelName
}) => {
  const [email, setEmail] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

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

    setIsSending(true)
    try {
      const response = await inviteUserToChannel(workspaceId, channelId, email)
      if (response.status === 'success') {
        setSuccess(`Invitation sent to ${email}`)
        toast.success(`Invitation sent to ${email}`)
        setEmail('')
        setTimeout(() => {
          onClose()
        }, 2000)
      }
    } catch (error: any) {
      setError(error.response?.data?.message || ErrorMessage)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Modal show={isOpen} onClose={onClose} size='md'>
      <Modal.Header>Invite to #{channelName}</Modal.Header>
      <Modal.Body>
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
          <div className='mb-4'>
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
            <p className='mt-2 text-sm text-gray-500'>
              The user will receive an email invitation to join this channel.
            </p>
          </div>

          <div className='flex justify-end'>
            <Button color='gray' onClick={onClose} className='mr-2'>
              Cancel
            </Button>
            <Button type='submit' color='blue' disabled={isSending}>
              {isSending ? (
                <>
                  <div className='h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2'></div>
                  Sending...
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
      </Modal.Body>
    </Modal>
  )
}

export default ChannelInviteModal
