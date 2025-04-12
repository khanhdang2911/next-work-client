import type React from 'react'
import { useParams, Navigate } from 'react-router-dom'
import WorkspaceList from '../../components/Workspace/WorkspaceList'
import WorkspaceSidebar from '../../components/Sidebar/WorkspaceSidebar'
import ChatArea from '../../components/Chat/ChatArea'
import { getWorkspaceById, getChannelsByWorkspaceId } from '../../mockData/workspaces'

const WorkspacePage: React.FC = () => {
  const { workspaceId, channelId, directMessageId } = useParams<{
    workspaceId: string
    channelId: string
    directMessageId: string
  }>()

  const workspace = getWorkspaceById(workspaceId || '')

  if (!workspace) {
    return <Navigate to='/workspaces' />
  }

  // If no channel or DM is selected, redirect to the first channel
  if (!channelId && !directMessageId) {
    const channels = getChannelsByWorkspaceId(workspaceId || '')
    if (channels.length > 0) {
      return <Navigate to={`/workspace/${workspaceId}/channel/${channels[0].id}`} />
    }
  }

  return (
    <div className='flex h-screen'>
      <WorkspaceList activeWorkspaceId={workspaceId} />
      <WorkspaceSidebar />
      <ChatArea />
    </div>
  )
}

export default WorkspacePage
