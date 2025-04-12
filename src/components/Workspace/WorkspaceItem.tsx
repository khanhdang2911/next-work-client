import React from 'react'
import { Link } from 'react-router-dom'
import { getInitials } from '../../utils/formatUtils'
import type { IWorkspace } from '../../interfaces/Workspace'

interface WorkspaceItemProps {
  workspace: IWorkspace
  isActive?: boolean
}

const WorkspaceItem: React.FC<WorkspaceItemProps> = React.memo(({ workspace, isActive }) => {
  return (
    <Link to={`/workspace/${workspace.id}`}>
      <div
        className={`w-12 h-12 rounded-md flex items-center justify-center text-white font-bold text-lg mb-4 cursor-pointer transition-all hover:rounded-2xl ${
          isActive ? 'bg-green-600 rounded-2xl' : 'bg-gray-700'
        }`}
        title={workspace.name}
      >
        {workspace.icon || getInitials(workspace.name)}
      </div>
    </Link>
  )
})

WorkspaceItem.displayName = 'WorkspaceItem'

export default WorkspaceItem
