import React, { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getInitials } from '../../utils/formatUtils'
import type { IWorkspace } from '../../interfaces/Workspace'

interface WorkspaceItemProps {
  workspace: IWorkspace
  isActive?: boolean
}

const WorkspaceItem: React.FC<WorkspaceItemProps> = React.memo(({ workspace, isActive }) => {
  const navigate = useNavigate()

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      navigate(`/workspace/${workspace._id}`)
    },
    [workspace._id, navigate]
  )

  return (
    <div
      onClick={handleClick}
      className={`w-12 h-12 rounded-md flex items-center justify-center text-white font-bold text-lg mb-4 cursor-pointer transition-all hover:rounded-2xl ${
        isActive ? 'bg-green-600 rounded-2xl' : 'bg-gray-700'
      }`}
      title={workspace.name}
    >
      {getInitials(workspace.name)}
    </div>
  )
})

WorkspaceItem.displayName = 'WorkspaceItem'

export default WorkspaceItem
