import type React from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button } from 'flowbite-react'
import { HiArrowLeft } from 'react-icons/hi'
import InviteForm from '../../components/Invite/InviteForm'

const InvitePage: React.FC = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>()

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

      <InviteForm />
    </div>
  )
}

export default InvitePage
