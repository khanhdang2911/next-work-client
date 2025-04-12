import type React from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'flowbite-react'
import { HiArrowLeft } from 'react-icons/hi'
import UserProfile from '../../components/Profile/UserProfile'

const ViewProfilePage: React.FC = () => {
  return (
    <div className='container mx-auto p-6'>
      <div className='mb-6'>
        <Link to='/workspaces'>
          <Button color='light' size='sm'>
            <HiArrowLeft className='mr-2 h-4 w-4' />
            Back
          </Button>
        </Link>
      </div>

      <UserProfile />
    </div>
  )
}

export default ViewProfilePage
