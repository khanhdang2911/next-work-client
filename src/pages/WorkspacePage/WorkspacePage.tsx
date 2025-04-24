import type React from 'react'
import { useParams, Navigate } from 'react-router-dom'
import WorkspaceList from '../../components/Workspace/WorkspaceList'
import WorkspaceSidebar from '../../components/Sidebar/WorkspaceSidebar'
import ChatArea from '../../components/Chat/ChatArea'
import { useState, useEffect } from 'react'
import { getChannelsByWorkspaceId } from '../../api/auth.api'
import { toast } from 'react-toastify'
import { IChannel } from '../../interfaces/Workspace'
import { ErrorMessage } from '../../config/constants'

const WorkspacePage: React.FC = () => {
  const { workspaceId, conversationId } = useParams<{
    workspaceId: string
    conversationId: string
  }>()
  const [channels, setChannels] = useState<IChannel[]>([])

  useEffect( () => {
    const fetchChannel = async () => {
      try {
        const res = await getChannelsByWorkspaceId(workspaceId!);
        if(res.status === 'success'){
          setChannels(res.data)
        } 
      } catch (error: any) {
        toast.error(error.response?.data?.message || ErrorMessage);
      }
    } 

    fetchChannel()
  }, [])

  // const workspace = getWorkspaceById(workspaceId || '')

  // if (!workspace) {
  //   return <Navigate to='/workspaces' />
  // }

  // If no channel or DM is selected, redirect to the first channel
  if (!conversationId) {
    if (channels.length > 0) {
      return <Navigate to={`/workspace/${workspaceId}/channel/${channels[0].conversationId}`} />
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
