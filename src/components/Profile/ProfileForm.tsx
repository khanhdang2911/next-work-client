import type React from 'react'
import { useState } from 'react'
import { Button, Label, TextInput, Avatar } from 'flowbite-react'
import { HiUpload } from 'react-icons/hi'
import { useSelector } from 'react-redux'
import { getAuthSelector } from '../../redux/selectors'

const ProfileForm: React.FC = () => {
  const auth: any = useSelector(getAuthSelector)
  const currentUser = auth.user
  const [name, setName] = useState('Name of user')
  const [email, setEmail] = useState(currentUser.email)
  const [avatar, setAvatar] = useState(currentUser.avatar)
  const [status, setStatus] = useState<'online' | 'away' | 'busy' | 'offline'>(currentUser.status)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would update the user profile
    alert('Profile updated successfully!')
  }

  const handleStatusChange = (newStatus: 'online' | 'away' | 'busy' | 'offline') => {
    setStatus(newStatus)
  }

  return (
    <div className='max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md'>
      <h2 className='text-2xl font-bold mb-6'>Edit Profile</h2>

      <form onSubmit={handleSubmit}>
        <div className='mb-6 flex flex-col items-center'>
          <Avatar img={avatar} size='xl' rounded />
          <div className='mt-4'>
            <Button color='light' size='sm'>
              <HiUpload className='mr-2 h-4 w-4' />
              Upload New Avatar
            </Button>
          </div>
        </div>

        <div className='mb-4'>
          <Label htmlFor='name' value='Name' className='block mb-2' />
          <TextInput id='name' value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div className='mb-4'>
          <Label htmlFor='email' value='Email' className='block mb-2' />
          <TextInput id='email' type='email' value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className='mb-6'>
          <Label value='Status' className='block mb-2' />
          <div className='flex space-x-2'>
            <Button
              color={status === 'online' ? 'success' : 'light'}
              size='sm'
              onClick={() => handleStatusChange('online')}
            >
              <span className='w-2 h-2 bg-green-500 rounded-full mr-2'></span>
              Online
            </Button>

            <Button
              color={status === 'away' ? 'warning' : 'light'}
              size='sm'
              onClick={() => handleStatusChange('away')}
            >
              <span className='w-2 h-2 bg-yellow-500 rounded-full mr-2'></span>
              Away
            </Button>

            <Button
              color={status === 'busy' ? 'failure' : 'light'}
              size='sm'
              onClick={() => handleStatusChange('busy')}
            >
              <span className='w-2 h-2 bg-red-500 rounded-full mr-2'></span>
              Do Not Disturb
            </Button>

            <Button
              color={status === 'offline' ? 'gray' : 'light'}
              size='sm'
              onClick={() => handleStatusChange('offline')}
            >
              <span className='w-2 h-2 bg-gray-500 rounded-full mr-2'></span>
              Offline
            </Button>
          </div>
        </div>

        <div className='flex justify-end'>
          <Button type='submit' color='blue'>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ProfileForm
