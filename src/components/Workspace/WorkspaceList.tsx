import type React from 'react'
import WorkspaceItem from './WorkspaceItem'
import { Button } from 'flowbite-react'
import { HiPlus } from 'react-icons/hi'
import { IWorkspace } from '../../interfaces/Workspace'
import { useState, useEffect } from 'react'
import { getAllWorkspaces } from '../../api/auth.api'
import { toast } from 'react-toastify'
import { ErrorMessage } from '../../config/constants'

interface WorkspaceListProps {
  activeWorkspaceId?: string
}

const WorkspaceList: React.FC<WorkspaceListProps> = ({ activeWorkspaceId }) => {
  const [workspaces, setWorkspaces] = useState<IWorkspace[]>([])
  useEffect( () => {
    const fetchWorkspaces = async () => {
      try {
        const res = await getAllWorkspaces()
        if (res.status === 'success') {
          setWorkspaces(res.data)
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || ErrorMessage);
      }
    }
  
    fetchWorkspaces()
  }, [])

  return (
    <div className='w-16 bg-gray-800 h-screen flex flex-col items-center py-4'>
      {workspaces.map((workspace) => (
        <WorkspaceItem key={workspace._id} workspace={workspace} isActive={workspace._id === activeWorkspaceId} />
      ))}
      <Button color='gray' pill className='mt-4 w-10 h-10 flex items-center justify-center' title='Add Workspace'>
        <HiPlus className='h-5 w-5' />
      </Button>
    </div>
  )
}

export default WorkspaceList
