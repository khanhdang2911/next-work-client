import { Button } from 'flowbite-react'

import type React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import WorkspaceList from '../../components/Workspace/WorkspaceList'
import WorkspaceSidebar from '../../components/Sidebar/WorkspaceSidebar'
import ChatArea from '../../components/Chat/ChatArea'
import { useState, useEffect } from 'react'
import { getChannelsByWorkspaceId, getAllDmConversationsOfUser } from '../../api/auth.api'
import { toast } from 'react-toastify'
import type { IChannel } from '../../interfaces/Workspace'
import { ErrorMessage } from '../../config/constants'
import LoadingOverlay from '../../components/LoadingPage/Loading'

const WorkspacePage: React.FC = () => {
  const { workspaceId, conversationId } = useParams<{
    workspaceId: string
    conversationId: string
  }>()
  const [channels, setChannels] = useState<IChannel[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [shouldRedirect, setShouldRedirect] = useState(false)
  const [redirectPath, setRedirectPath] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchChannel = async () => {
      if (!workspaceId) return

      setIsLoading(true)
      try {
        const res = await getChannelsByWorkspaceId(workspaceId)
        if (res.status === 'success') {
          setChannels(res.data)

          // Only redirect if we don't have a conversationId
          if (!conversationId) {
            if (res.data.length > 0) {
              // If we have channels, redirect to the first channel
              setRedirectPath(`/workspace/${workspaceId}/channel/${res.data[0].conversationId}`)
              setShouldRedirect(true)
            } else {
              // If no channels, try to get direct messages
              try {
                const dmRes = await getAllDmConversationsOfUser()
                if (dmRes.status === 'success' && dmRes.data.length > 0) {
                  // If we have direct messages, redirect to the first one
                  setRedirectPath(`/workspace/${workspaceId}/dm/${dmRes.data[0].conversationId}`)
                  setShouldRedirect(true)
                }
              } catch (dmError) {
                console.error('Error fetching direct messages:', dmError)
              }
            }
          }
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || ErrorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    fetchChannel()
  }, [workspaceId, conversationId])

  // Use this effect for the redirect to avoid render loops
  useEffect(() => {
    if (shouldRedirect && redirectPath) {
      navigate(redirectPath)
      setShouldRedirect(false)
    }
  }, [shouldRedirect, redirectPath, navigate])

  if (isLoading) {
    return <LoadingOverlay isLoading={true} />
  }

  // Check if we're viewing a direct message (URL contains /dm/)
  const isViewingDirectMessage = window.location.pathname.includes(`/workspace/${workspaceId}/dm/`)

  // If we have a conversationId and we're viewing a direct message, always render the chat area
  if (conversationId && isViewingDirectMessage) {
    return (
      <div className='flex h-screen'>
        <WorkspaceList activeWorkspaceId={workspaceId} />
        <WorkspaceSidebar />
        <ChatArea />
      </div>
    )
  }

  // Handle case when workspace has no channels and we're not viewing a direct message
  if (channels.length === 0) {
    return (
      <div className='flex h-screen'>
        <WorkspaceList activeWorkspaceId={workspaceId} />
        <WorkspaceSidebar />
        <div className='flex-1 flex items-center justify-center'>
          <div className='text-center p-6'>
            <h2 className='text-2xl font-bold mb-2'>No Channels Found</h2>
            <p className='text-gray-600 mb-4'>This workspace doesn't have any channels yet.</p>
            <Button color='blue' onClick={() => document.getElementById('create-channel-btn')?.click()}>
              Create a Channel
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Default case: we have channels or we're viewing a channel
  return (
    <div className='flex h-screen'>
      <WorkspaceList activeWorkspaceId={workspaceId} />
      <WorkspaceSidebar />
      <ChatArea />
    </div>
  )
}

export default WorkspacePage
