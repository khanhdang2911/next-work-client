import type React from 'react'
import WorkspaceItem from './WorkspaceItem'
import { mockWorkspaces } from '../../mockData/workspaces'
import { Button } from 'flowbite-react'
import { HiPlus } from 'react-icons/hi'

interface WorkspaceListProps {
  activeWorkspaceId?: string
}

const WorkspaceList: React.FC<WorkspaceListProps> = ({ activeWorkspaceId }) => {
  return (
    <div className='w-16 bg-gray-800 h-screen flex flex-col items-center py-4'>
      {mockWorkspaces.map((workspace) => (
        <WorkspaceItem key={workspace.id} workspace={workspace} isActive={workspace.id === activeWorkspaceId} />
      ))}
      <Button color='gray' pill className='mt-4 w-10 h-10 flex items-center justify-center' title='Add Workspace'>
        <HiPlus className='h-5 w-5' />
      </Button>
    </div>
  )
}

export default WorkspaceList
