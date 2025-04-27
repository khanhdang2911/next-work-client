import type React from 'react'
import { useState, useEffect } from 'react'
import { Modal, Avatar, Badge, Button } from 'flowbite-react'
import { getChannelMembers } from '../../api/auth.api'
import { toast } from 'react-toastify'
import type { IChannelMember } from '../../interfaces/User'
import { useNavigate } from 'react-router-dom'
import { HiUserAdd, HiMail } from 'react-icons/hi'

interface ChannelMembersModalProps {
  isOpen: boolean
  onClose: () => void
  channelId?: string
  workspaceId?: string
}

const ChannelMembersModal: React.FC<ChannelMembersModalProps> = ({ isOpen, onClose, channelId, workspaceId }) => {
  const [members, setMembers] = useState<IChannelMember[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchMembers = async () => {
      if (!channelId || !isOpen) return

      setIsLoading(true)
      try {
        const response = await getChannelMembers(channelId)
        if (response.status === 'success') {
          setMembers(response.data)
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMembers()
  }, [channelId, isOpen])

  const handleViewProfile = (userId: string) => {
    onClose()
    navigate(`/profile/${userId}`)
  }

  const handleInviteMembers = () => {
    onClose()
    navigate(`/workspace/${workspaceId}/invite`)
  }

  const getStatusColor = (status: string) => {
    return status === 'Online' ? 'bg-green-500' : 'bg-yellow-500'
  }

  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  return (
    <Modal show={isOpen} onClose={onClose} size='3xl'>
      <Modal.Header>Channel Members</Modal.Header>
      <Modal.Body>
        {isLoading ? (
          <div className='flex justify-center py-6'>
            <div className='h-10 w-10 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin'></div>
          </div>
        ) : (
          <div className='space-y-6'>
            <div className='flex justify-end mb-2'>
              <Button color='blue' size='sm' onClick={handleInviteMembers}>
                <HiUserAdd className='mr-2 h-5 w-5' />
                Invite Members
              </Button>
            </div>

            {members.length === 0 ? (
              <div className='text-center py-6 text-gray-500 text-base'>No members found</div>
            ) : (
              members.map((member) => (
                <div key={member._id} className='flex items-center p-4 hover:bg-gray-50 rounded-lg shadow-sm'>
                  <div className='relative'>
                    <Avatar img={member.avatar} rounded size='lg' />
                    <span
                      className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full ${getStatusColor(
                        member.status
                      )} border-2 border-white`}
                    ></span>
                  </div>
                  <div className='ml-4 flex-1'>
                    <div className='flex items-center'>
                      <div className='font-semibold text-base'>{member.name}</div>
                      {member.admin && (
                        <Badge color='blue' className='ml-3 text-xs'>
                          Admin
                        </Badge>
                      )}
                    </div>
                    <div className='text-sm text-gray-600'>{member.email}</div>
                    <div className='text-xs text-gray-400'>Joined {formatJoinDate(member.joinedAt)}</div>
                  </div>
                  <div className='flex items-center gap-3'>
                    <Button size='xs' color='light' onClick={() => handleViewProfile(member._id)}>
                      View
                    </Button>
                    <Button size='xs' color='light'>
                      <HiMail className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </Modal.Body>
    </Modal>
  )
}

export default ChannelMembersModal
