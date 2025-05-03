import type React from 'react'
import { useState, useEffect, useRef } from 'react'
import { Button, Tooltip, Badge, Avatar } from 'flowbite-react'
import { HiHashtag, HiLockClosed, HiUserAdd, HiSearch, HiUsers, HiX, HiUser, HiMail } from 'react-icons/hi'
import type { IChannel, IDirectMessage } from '../../interfaces/Workspace'
import { useNavigate, useParams } from 'react-router-dom'
import ChannelMembersModal from './ChannelMembersModal'
import ChannelInviteModal from './ChannelInviteModal'
import { toast } from 'react-toastify'
import { ErrorMessage } from '../../config/constants'
import { useSelector } from 'react-redux'
import { getAuthSelector } from '../../redux/selectors'
import { createDirectConversation } from '../../api/conversation.api'
import useDebounce from '../../hooks/useDebounce'
import { searchUsersInChannel } from '../../api/user.api'

// Add a new interface for search results
interface IUserSearchResult {
  _id: string
  name: string
  avatar?: string
}

interface ChatHeaderProps {
  channel?: IChannel | null
  directMessage?: IDirectMessage | null
  onlineUsers?: string[]
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ channel, directMessage, onlineUsers = [] }) => {
  const navigate = useNavigate()
  const { workspaceId } = useParams<{ workspaceId: string; conversationId: string }>()
  const [showMembersModal, setShowMembersModal] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)
  // Replace the existing search-related state variables with these more comprehensive ones
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<IUserSearchResult[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [noResultsFound, setNoResultsFound] = useState(false)
  const debouncedSearchQuery = useDebounce(searchQuery, 300) // Reduce debounce time to 300ms
  const searchRef = useRef<HTMLDivElement>(null)
  const auth: any = useSelector(getAuthSelector)
  const currentUserId = auth?.user?._id
  const [isCreatingConversation, setIsCreatingConversation] = useState(false)

  // Use the debounce hook to delay search

  // Handle click outside to close search results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Replace the useEffect for search with this improved version
  useEffect(() => {
    const searchUsers = async () => {
      if (!debouncedSearchQuery.trim() || debouncedSearchQuery.length < 2 || !channel?._id) {
        setSearchResults([])
        setNoResultsFound(false)
        return
      }

      setIsSearching(true)
      setNoResultsFound(false) // Reset no results state before searching

      try {
        const response = await searchUsersInChannel(debouncedSearchQuery, channel._id)
        if (response.status === 'success') {
          setSearchResults(response.data)
          setNoResultsFound(response.data.length === 0)
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message ?? ErrorMessage)
        setSearchResults([])
        setNoResultsFound(true)
      } finally {
        setIsSearching(false)
      }
    }

    if (debouncedSearchQuery && debouncedSearchQuery.length >= 2) {
      searchUsers()
    }
  }, [debouncedSearchQuery, channel?._id])

  // Replace the handleSearchChange function with this improved version
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)

    if (query.length >= 2) {
      setShowSearchResults(true)
      setIsSearching(true) // Show loading immediately when typing
    } else {
      setSearchResults([])
      setNoResultsFound(false)
      if (query.length === 0) {
        setShowSearchResults(false)
      }
    }
  }

  // Handle view profile
  const handleViewProfile = (userId: string) => {
    navigate(`/profile/${userId}`)
    setShowSearchResults(false)
    setSearchQuery('')
  }

  // Handle create conversation
  const handleCreateConversation = async (userId: string) => {
    if (!workspaceId || !currentUserId || isCreatingConversation) return

    setIsCreatingConversation(true)
    try {
      const response = await createDirectConversation(workspaceId, [currentUserId, userId])

      // Navigate to the new conversation
      const conversationId = response.data._id
      navigate(`/workspace/${workspaceId}/dm/${conversationId}`)
      setSearchQuery('')
      setShowSearchResults(false)
    } catch (error: any) {
      console.error('Error creating conversation:', error)

      // If the error is because the conversation already exists, try to extract the conversation ID
      if (error.response?.data?.data?.conversationId) {
        const existingConversationId = error.response.data.data.conversationId
        navigate(`/workspace/${workspaceId}/dm/${existingConversationId}`)
        setSearchQuery('')
        setShowSearchResults(false)
      } else {
        // Only show toast for unexpected errors
        toast.error(error.response?.data?.message || ErrorMessage)
      }
    } finally {
      setIsCreatingConversation(false)
    }
  }

  const handleViewMembers = () => {
    setShowMembersModal(true)
  }

  const handleInviteToChannel = () => {
    setShowInviteModal(true)
  }

  const handleInviteMembers = () => {
    navigate(`/workspace/${workspaceId}/invite`)
  }

  // Check if direct message user is online
  const isUserOnline = directMessage && onlineUsers.includes(directMessage._id)

  return (
    <div className='border-b p-3 flex items-center'>
      <div className='flex-1'>
        {channel && (
          <div className='flex items-center'>
            {channel.isPrivate ? <HiLockClosed className='mr-2 h-4 w-4' /> : <HiHashtag className='mr-2 h-4 w-4' />}
            <h2 className='font-semibold'>{channel.name}</h2>
            {channel.description && <span className='ml-2 text-gray-500 text-sm'>{channel.description}</span>}
          </div>
        )}

        {directMessage && (
          <div className='flex items-center'>
            <img
              src={directMessage.avatar || '/placeholder.svg'}
              alt={directMessage.name}
              className='w-5 h-5 rounded-full mr-2'
            />
            <h2 className='font-semibold'>{directMessage.name}</h2>
            <span className={`ml-2 w-2 h-2 rounded-full ${isUserOnline ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
            <span className='ml-1 text-gray-500 text-sm'>{isUserOnline ? 'Online' : 'Away'}</span>
          </div>
        )}
      </div>

      <div className='flex items-center space-x-2 w-[60%] ml-4'>
        {/* Search component - Now wider */}
        <div className='relative flex-grow w-full' ref={searchRef}>
          <div className='flex items-center bg-gray-100 rounded-lg px-3 py-1.5 w-full'>
            <HiSearch className='h-4 w-4 text-gray-500' />
            <input
              type='text'
              placeholder='Search users...'
              className='bg-transparent border-none focus:ring-0 text-sm w-full ml-2'
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => {
                if (searchQuery.length >= 2) {
                  setShowSearchResults(true)
                }
              }}
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('')
                  setShowSearchResults(false)
                }}
                className='text-gray-500 hover:text-gray-700'
              >
                <HiX className='h-4 w-4' />
              </button>
            )}
          </div>

          {/* Search results dropdown */}
          {showSearchResults && searchResults.length > 0 && (
            <div className='absolute top-full mt-1 right-0 w-full bg-white rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto'>
              {searchResults.map((user) => (
                <div key={user._id} className='flex items-center p-3 hover:bg-gray-50'>
                  <Avatar
                    img={user.avatar ?? '/placeholder.svg'}
                    rounded
                    size='sm'
                    className='mr-3 border border-gray-200'
                  />
                  <div className='flex-1'>
                    <div className='font-medium text-sm'>{user.name}</div>
                    <div className='text-xs text-gray-500'>
                      {onlineUsers.includes(user._id) ? (
                        <span className='flex items-center'>
                          <span className='w-2 h-2 bg-green-500 rounded-full mr-1'></span>
                          Online
                        </span>
                      ) : (
                        <span className='flex items-center'>
                          <span className='w-2 h-2 bg-yellow-500 rounded-full mr-1'></span>
                          Away
                        </span>
                      )}
                    </div>
                  </div>
                  <div className='flex space-x-2'>
                    {currentUserId !== user._id && (
                      <Button
                        color='light'
                        size='xs'
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                          e.stopPropagation()
                          handleCreateConversation(user._id)
                        }}
                        disabled={isCreatingConversation}
                      >
                        <HiMail className='h-3 w-3 mr-1' />
                        Message
                      </Button>
                    )}
                    <Button
                      color='light'
                      size='xs'
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.stopPropagation()
                        handleViewProfile(user._id)
                      }}
                    >
                      <HiUser className='h-3 w-3 mr-1' />
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Replace the "No results" section with this improved version */}
          {showSearchResults && searchQuery.length >= 2 && noResultsFound && !isSearching && (
            <div className='absolute top-full mt-1 right-0 w-full bg-white rounded-lg shadow-lg z-50 p-4 text-center'>
              <p className='text-gray-500 text-sm'>No users found matching "{searchQuery}"</p>
            </div>
          )}

          {/* Loading indicator */}
          {isSearching && (
            <div className='absolute top-full mt-1 right-0 w-full bg-white rounded-lg shadow-lg z-50 p-4 text-center'>
              <div className='flex justify-center'>
                <div className='h-5 w-5 border-2 border-t-blue-500 border-blue-200 rounded-full animate-spin'></div>
              </div>
            </div>
          )}
        </div>
        <Tooltip content='View Members'>
          <Button color='gray' pill size='sm' onClick={handleViewMembers}>
            <HiUsers className='h-4 w-4' />
            {onlineUsers.length > 0 && (
              <Badge color='success' className='ml-1'>
                {onlineUsers.length}
              </Badge>
            )}
          </Button>
        </Tooltip>

        {channel ? (
          <Tooltip content='Invite to Channel'>
            <Button color='gray' pill size='sm' onClick={handleInviteToChannel}>
              <HiUserAdd className='h-4 w-4' />
            </Button>
          </Tooltip>
        ) : (
          <Tooltip content='Invite to Workspace'>
            <Button color='gray' pill size='sm' onClick={handleInviteMembers}>
              <HiUserAdd className='h-4 w-4' />
            </Button>
          </Tooltip>
        )}
      </div>

      {channel && (
        <>
          <ChannelMembersModal
            isOpen={showMembersModal}
            onClose={() => setShowMembersModal(false)}
            channelId={channel._id}
            workspaceId={workspaceId}
            onlineUsers={onlineUsers}
          />

          <ChannelInviteModal
            isOpen={showInviteModal}
            onClose={() => setShowInviteModal(false)}
            workspaceId={workspaceId ?? ''}
            channelId={channel._id}
            channelName={channel.name}
          />
        </>
      )}
    </div>
  )
}

export default ChatHeader
