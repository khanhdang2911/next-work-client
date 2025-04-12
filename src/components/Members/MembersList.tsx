import type React from 'react'
import { useState } from 'react'
import { Avatar, Button, TextInput, Badge } from 'flowbite-react'
import { HiSearch, HiUserAdd, HiMail, HiX } from 'react-icons/hi'
import { mockUsers } from '../../mockData/workspaces'
import { getStatusColor } from '../../utils/formatUtils'
import { useNavigate, useParams } from 'react-router-dom'

const MembersList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const navigate = useNavigate()
  const { workspaceId } = useParams<{ workspaceId: string }>()

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleToggleSelect = (userId: string) => {
    setSelectedMembers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  const handleInviteSelected = () => {
    navigate(`/workspace/${workspaceId}/invite`)
  }

  const handleViewProfile = (userId: string) => {
    if (userId === 'user1') {
      navigate('/profile')
    } else {
      navigate(`/profile/${userId}`)
    }
  }

  return (
    <div className='max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-2xl font-bold'>Workspace Members</h2>
        <div className='flex space-x-2'>
          <Button color='blue' onClick={handleInviteSelected} disabled={selectedMembers.length === 0}>
            <HiMail className='mr-2 h-4 w-4' />
            Invite Selected ({selectedMembers.length})
          </Button>
          <Button color='blue' onClick={() => navigate(`/workspace/${workspaceId}/invite`)}>
            <HiUserAdd className='mr-2 h-4 w-4' />
            Invite New Members
          </Button>
        </div>
      </div>

      <div className='mb-6'>
        <TextInput
          id='search'
          type='search'
          icon={HiSearch}
          placeholder='Search members by name or email'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {selectedMembers.length > 0 && (
        <div className='mb-4 flex flex-wrap gap-2'>
          {selectedMembers.map((userId) => {
            const user = mockUsers.find((u) => u.id === userId)
            if (!user) return null
            return (
              <Badge key={userId} color='blue' className='flex items-center'>
                {user.name}
                <button className='ml-2 text-blue-100 hover:text-white' onClick={() => handleToggleSelect(userId)}>
                  <HiX className='h-3 w-3' />
                </button>
              </Badge>
            )
          })}
        </div>
      )}

      <div className='space-y-4'>
        {filteredUsers.map((user) => {
          const statusColor = getStatusColor(user.status)
          const isSelected = selectedMembers.includes(user.id)

          return (
            <div
              key={user.id}
              className={`flex items-center p-3 rounded-lg border ${
                isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className='flex-shrink-0 cursor-pointer' onClick={() => handleViewProfile(user.id)}>
                <div className='relative'>
                  <Avatar img={user.avatar} rounded size='md' />
                  <span
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${statusColor} border-2 border-white`}
                  ></span>
                </div>
              </div>

              <div className='ml-4 flex-1 cursor-pointer' onClick={() => handleViewProfile(user.id)}>
                <div className='font-medium'>{user.name}</div>
                <div className='text-sm text-gray-500'>{user.email}</div>
              </div>

              <div className='flex items-center space-x-2'>
                <Button color={isSelected ? 'blue' : 'light'} size='xs' onClick={() => handleToggleSelect(user.id)}>
                  {isSelected ? 'Selected' : 'Select'}
                </Button>
                <Button color='light' size='xs' onClick={() => handleViewProfile(user.id)}>
                  View Profile
                </Button>
              </div>
            </div>
          )
        })}

        {filteredUsers.length === 0 && (
          <div className='text-center py-8 text-gray-500'>No members found matching your search.</div>
        )}
      </div>
    </div>
  )
}

export default MembersList
