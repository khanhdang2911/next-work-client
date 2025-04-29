import type React from 'react'
import { Button } from 'flowbite-react'
import { HiArrowLeft } from 'react-icons/hi'
import ProfileForm from '../../components/Profile/ProfileForm'
import { useNavigate } from 'react-router-dom'

const ProfilePage: React.FC = () => {
  const navigate = useNavigate()
  return (
    <div className='container mx-auto p-6'>
      <div className='mb-6'>
        <Button color='light' size='sm' onClick={() => navigate(-1)}>
          <HiArrowLeft className='mr-2 h-4 w-4' />
          Back
        </Button>
      </div>

      <ProfileForm />
    </div>
  )
}

export default ProfilePage
