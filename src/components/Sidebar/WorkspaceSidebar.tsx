import type React from 'react'
import { useState, useMemo, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Button } from 'flowbite-react'
import { HiChevronDown, HiChevronRight, HiPlus } from 'react-icons/hi'
import ChannelItem from './ChannelItem'
import DirectMessageItem from './DirectMessageItem'
import CreateChannelModal from './CreateChannelModal'
import {
  getWorkspaceById,
  getDirectMessagesByWorkspaceId,
  getUserById,
  mockChannels
} from '../../mockData/workspaces'
import { getChannelsByWorkspaceId, getAllDmConversationsOfUser } from '../../api/auth.api'
import { toast } from 'react-toastify'
import type { IChannel, IDirectMessage } from '../../interfaces/Workspace'
import { ErrorMessage } from '../../config/constants'

const WorkspaceSidebar: React.FC = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>()
  const [channelsExpanded, setChannelsExpanded] = useState(true)
  const [directMessagesExpanded, setDirectMessagesExpanded] = useState(true)
  const [isCreateChannelModalOpen, setIsCreateChannelModalOpen] = useState(false)
  const [channels, setChannels] = useState<IChannel[]>([])
  const [alldm, setAlldm] = useState<IDirectMessage[]>([])

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const res = await getChannelsByWorkspaceId(workspaceId!);
        if(res.status === 'success'){
          setChannels(res.data)
        } 
      } catch (error: any) {
        toast.error(error.response?.data?.message || ErrorMessage );
      }
    } 

    fetchChannels()
  }, [workspaceId])
  
  useEffect(() => {
    const fetchAllDm = async () => {
      try {
        const res = await getAllDmConversationsOfUser();
        if(res.status === 'success'){
          setAlldm(res.data)
        } 
      } catch (error: any) {
        toast.error(error.response?.data?.message || ErrorMessage );
      }
    } 

    fetchAllDm()
  }, [workspaceId])
  // const workspace = useMemo(() => {
  //   return getWorkspaceById(workspaceId || '')
  // }, [workspaceId])

  // const directMessages = useMemo(() => {
  //   return getDirectMessagesByWorkspaceId(workspaceId || '')
  // }, [workspaceId])

  const handleCreateChannel = (name: string, description: string, isPrivate: boolean) => {
    // const newChannel: IChannel = {
    //   _id: `channel${Date.now()}`,
    //   name,
    //   workspaceId: workspaceId || '',
    //   description,
    //   isPrivate,
    //   createdAt: new Date().toISOString(),
    //   updatedAt: new Date().toISOString(),
    //   unreadCount: 0
    // }

    // // Add to local state
    // setChannels((prev) => [...prev, newChannel])

    // // In a real app, you would also add this to your backend
    // mockChannels.push(newChannel)
  }

  // if (!workspace) {
  //   return <div>Workspace not found</div>
  // }

  return (
    <div className='w-64 bg-gray-900 h-screen flex flex-col'>
      <div className='p-4 border-b border-gray-700'>
        <h1 className='text-white font-bold text-lg flex items-center'>
          {/* {workspace.name} */}
          Learning Reactjs
          <span className='ml-auto text-gray-400 text-xs'>Y</span>
        </h1>
      </div>

      <div className='flex-1 overflow-y-auto py-4'>
        <div className='mb-4'>
          <div
            className='flex items-center px-4 py-1 text-gray-300 cursor-pointer'
            onClick={() => setChannelsExpanded(!channelsExpanded)}
          >
            {channelsExpanded ? (
              <HiChevronDown className='h-4 w-4 mr-1' />
            ) : (
              <HiChevronRight className='h-4 w-4 mr-1' />
            )}
            <span className='text-sm font-medium'>CHANNELS</span>
            <Button
              color='gray'
              size='xs'
              pill
              className='ml-auto p-1'
              title='Add Channel'
              onClick={(e) => {
                e.stopPropagation()
                setIsCreateChannelModalOpen(true)
              }}
            >
              <HiPlus className='h-3 w-3' />
            </Button>
          </div>
          {channelsExpanded && (
            <div className='mt-2 space-y-1'>
              {channels.map((channel) => (
                <ChannelItem key={channel._id} channel={channel} />
              ))}
            </div>
          )}
        </div>

        <div>
          <div
            className='flex items-center px-4 py-1 text-gray-300 cursor-pointer'
            onClick={() => setDirectMessagesExpanded(!directMessagesExpanded)}
          >
            {directMessagesExpanded ? (
              <HiChevronDown className='h-4 w-4 mr-1' />
            ) : (
              <HiChevronRight className='h-4 w-4 mr-1' />
            )}
            <span className='text-sm font-medium'>DIRECT MESSAGES</span>
            <Button color='gray' size='xs' pill className='ml-auto p-1' title='Add Direct Message'>
              <HiPlus className='h-3 w-3' />
            </Button>
          </div>
          {directMessagesExpanded && (
            <div className='mt-2 space-y-1'>
              {alldm.map((dm) => {
                // Find the other user in the direct message
                
                return <DirectMessageItem key={dm._id} directMessage={dm}/>
              })}
            </div>
          )}
        </div>
      </div>

      <CreateChannelModal
        isOpen={isCreateChannelModalOpen}
        onClose={() => setIsCreateChannelModalOpen(false)}
        onCreateChannel={handleCreateChannel}
      />
    </div>
  )
}

export default WorkspaceSidebar
