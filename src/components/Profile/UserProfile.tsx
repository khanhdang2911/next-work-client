import type React from 'react'
import { useState, useEffect } from 'react'
import { Avatar, Button, Card, Badge } from 'flowbite-react'
import { HiClock, HiOfficeBuilding, HiUserGroup } from 'react-icons/hi'
import { getStatusColor } from '../../utils/formatUtils'
import { useNavigate, useParams } from 'react-router-dom'
import { getUserById } from '../../api/auth.api'
import { useSelector } from 'react-redux'
import { getAuthSelector } from '../../redux/selectors'
import { toast } from 'react-toastify'
import { ErrorMessage } from '../../config/constants'

interface UserProfileProps {
  userId?: string
}

const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
  const params = useParams<{ userId: string }>()
  const auth: any = useSelector(getAuthSelector)
  const profileId = userId || params.userId
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true)
      try {
        // If it's the current user profile, use the data from Redux
        if (!profileId || profileId === auth?.user?._id) {
          setUser(auth.user)
        } else {
          // Fetch user data from API
          const response = await getUserById(profileId)
          if (response.status === 'success') {
            setUser(response.data)
          }
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message ?? ErrorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [profileId, auth.user._id])

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent'></div>
      </div>
    )
  }

  if (!user) {
    return <div className='text-center py-8'>User not found</div>
  }

  const statusColor = getStatusColor(user.status)

  // Format dates
  const userJoinDate = new Date(user.createdAt ?? Date.now()).toLocaleDateString()

  return (
    <div className='max-w-4xl mx-auto p-6'>
      <Card className='mb-6'>
        <div className='flex flex-col md:flex-row items-center md:items-start'>
          <div className='mb-4 md:mb-0 md:mr-6 flex-shrink-0'>
            <div className='relative'>
              <Avatar img={user.avatar} size='xl' rounded />
              <span
                className={`absolute bottom-0 right-0 w-4 h-4 rounded-full ${statusColor} border-2 border-white`}
              ></span>
            </div>
          </div>

          <div className='flex-1 text-center md:text-left'>
            <div className='flex flex-col md:flex-row md:items-center md:justify-between'>
              <div>
                <h2 className='text-2xl font-bold'>{user.name}</h2>
                <p className='text-gray-500'>{user.email}</p>
              </div>
            </div>

            <div className='mt-4 flex flex-wrap justify-center md:justify-start gap-2'>
              <Badge color='gray' className='flex items-center'>
                <HiClock className='mr-1 h-4 w-4' />
                Joined {userJoinDate}
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Card>
          <h3 className='text-lg font-semibold mb-4 flex items-center'>
            <HiOfficeBuilding className='mr-2 h-5 w-5' />
            Workspaces
          </h3>
          <div id='user-workspaces' className='space-y-3'>
            {user.workspaces && user.workspaces.length > 0 ? (
              user.workspaces.map((workspace: any) => (
                <div key={workspace._id} className='flex items-center'>
                  <div className='w-8 h-8 rounded-md flex items-center justify-center text-white font-bold text-sm bg-blue-600 mr-3'>
                    {workspace.name.charAt(0).toUpperCase()}
                  </div>
                  <div className='flex-1'>
                    <div className='font-medium'>{workspace.name}</div>
                  </div>
                  <Button size='xs' color='light' onClick={() => navigate(`/workspace/${workspace._id}`)}>
                    Open
                  </Button>
                </div>
              ))
            ) : (
              <div className='text-gray-500 text-sm'>No workspaces found</div>
            )}
          </div>
        </Card>

        <Card>
          <h3 className='text-lg font-semibold mb-4 flex items-center'>
            <HiUserGroup className='mr-2 h-5 w-5' />
            Channels
          </h3>
          <div id='user-channels' className='space-y-3'>
            {user.channels && user.channels.length > 0 ? (
              user.channels.map((channel: any) => (
                <div key={channel._id} className='flex items-center'>
                  <div className='w-8 h-8 rounded-md flex items-center justify-center text-gray-500 bg-gray-100 mr-3'>
                    #
                  </div>
                  <div className='flex-1'>
                    <div className='font-medium'>{channel.name}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className='text-gray-500 text-sm'>No channels found</div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default UserProfile
