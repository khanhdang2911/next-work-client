import type React from 'react'
import { Modal, Avatar, Badge } from 'flowbite-react'

interface ChannelMembersModalProps {
  isOpen: boolean
  onClose: () => void
}

// Hardcoded members data for now
const mockMembers = [
  {
    id: 'user1',
    name: 'You',
    email: 'you@example.com',
    avatar: '/placeholder.svg?height=40&width=40',
    status: 'online',
    role: 'admin'
  },
  {
    id: 'user2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    avatar: '/placeholder.svg?height=40&width=40',
    status: 'online',
    role: 'member'
  },
  {
    id: 'user3',
    name: 'Michael Chen',
    email: 'michael@example.com',
    avatar: '/placeholder.svg?height=40&width=40',
    status: 'offline',
    role: 'member'
  },
  {
    id: 'user4',
    name: 'Alex Rodriguez',
    email: 'alex@example.com',
    avatar: '/placeholder.svg?height=40&width=40',
    status: 'away',
    role: 'member'
  },
  {
    id: 'user5',
    name: 'Emily Davis',
    email: 'emily@example.com',
    avatar: '/placeholder.svg?height=40&width=40',
    status: 'busy',
    role: 'member'
  }
]

const ChannelMembersModal: React.FC<ChannelMembersModalProps> = ({ isOpen, onClose }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500'
      case 'offline':
        return 'bg-gray-400'
      case 'away':
        return 'bg-yellow-500'
      case 'busy':
        return 'bg-red-500'
      default:
        return 'bg-gray-400'
    }
  }

  return (
    <Modal show={isOpen} onClose={onClose} size='md'>
      <Modal.Header>Channel Members</Modal.Header>
      <Modal.Body>
        <div className='space-y-4'>
          {mockMembers.map((member) => (
            <div key={member.id} className='flex items-center p-2 hover:bg-gray-50 rounded-lg'>
              <div className='relative'>
                <Avatar img={member.avatar} rounded size='md' />
                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${getStatusColor(
                    member.status
                  )} border-2 border-white`}
                ></span>
              </div>
              <div className='ml-3 flex-1'>
                <div className='flex items-center'>
                  <div className='font-medium'>{member.name}</div>
                  {member.role === 'admin' && (
                    <Badge color='blue' className='ml-2'>
                      Admin
                    </Badge>
                  )}
                </div>
                <div className='text-sm text-gray-500'>{member.email}</div>
              </div>
              <div className='text-sm text-gray-500 capitalize'>{member.status}</div>
            </div>
          ))}
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default ChannelMembersModal
