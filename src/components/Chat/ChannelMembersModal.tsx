import type React from 'react'
import { useState, useEffect } from 'react'
import { Modal, Avatar, Badge, Button, Spinner } from 'flowbite-react'
import { getChannelMembers } from '../../api/auth.api'
import { toast } from 'react-toastify'
import type { IChannelMember } from '../../interfaces/User'
import { useNavigate } from 'react-router-dom'
import { HiPencil, HiTrash } from 'react-icons/hi'
import { useSelector } from 'react-redux'
import { getAuthSelector } from '../../redux/selectors'
import { deleteMemberChannel } from '../../api/auth.api'
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog'
import { ErrorMessage } from '../../config/constants'
import { updateRoleChannel } from '../../api/user.api'

interface ChannelMembersModalProps {
  isOpen: boolean
  onClose: () => void
  channelId?: string
  workspaceId?: string
  onlineUsers?: string[]
}

const ChannelMembersModal: React.FC<ChannelMembersModalProps> = ({ isOpen, onClose, channelId, onlineUsers = [] }) => {
  const [members, setMembers] = useState<IChannelMember[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const effectiveChannelId = channelId || ""

  const auth: any = useSelector(getAuthSelector)
  const currentUserId = auth.user?._id
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [currentUser, setCurrentUser] = useState<IChannelMember | null>(null)
  const [hasChanges, setHasChanges] = useState(false)
  const [currentUserRole, setCurrentUserRole] = useState("member")
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

  const handleDeleteClick = (userId: string) => {
    setSelectedUserId(userId)
    setShowDeleteConfirm(true)
  }

  const handleConfirmDelete = () => {
    if (selectedUserId) {
      handleDeleteMember(selectedUserId)
    }
    setShowDeleteConfirm(false)
    setSelectedUserId(null)
  }

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false)
  }

  const isCurrentUserAdmin = members.some((member) => member._id === currentUserId && member.admin)

  const handleDeleteMember = async (userId: string) => {
    if (!channelId) return

    try {
      const res = await deleteMemberChannel(channelId, userId)
      if (res.status === 'success') {
        toast.success(res.message)
        setMembers((prev) => prev.filter((member) => member._id !== userId))
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || ErrorMessage)
    }
  }

  useEffect(() => {
    const fetchMembers = async () => {
      if (!channelId || !isOpen) return

      setIsLoading(true)
      try {
        const response = await getChannelMembers(channelId)
        if (response.status === 'success') {
          setMembers(response.data)
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || ErrorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMembers()
  }, [channelId, isOpen])

  const handleViewProfile = (userId: string) => {
    onClose()
    navigate(`/profile/${userId}`)
  }

  const handleEditClick = async (user: IChannelMember) => {
      setCurrentUser(user)
      setHasChanges(false);
      setShowEditModal(true)
      setCurrentUserRole(user.admin ? "admin" : "member")
  }

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const { name, value } = e.target;
      setCurrentUserRole(value)
  
      if (currentUser) {
        const hasChangesRole = name === "role" && value !== currentUserRole;
        setHasChanges(hasChangesRole);
      }
  };

  const handleUpdateRole = async () => {
    if (!hasChanges) return
    setShowEditModal(false)
    setIsLoading(true)
    try {
      const res = await updateRoleChannel(effectiveChannelId, {
        memberId: currentUser?._id,
        role: currentUserRole,
      })

      if (res.status === "success") {
        setMembers((prevmembers) =>
          prevmembers.map((member) => {
            if (member._id === currentUser?._id) {
              return {
                ...member,
                admin: currentUserRole === "admin" ? true : false,
              }
            }
            return member
          })
        )
        setIsLoading(false)
      }

    } catch (error: any) {
      toast.error(error.response?.data?.message ?? ErrorMessage)
    }
  }


  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  return (
    <Modal show={isOpen} onClose={onClose} size='3xl'>
      <Modal.Header>Channel Members</Modal.Header>
      <Modal.Body>
        {isLoading ? (
          <div className='flex justify-center py-6'>
            <div className='h-10 w-10 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin'></div>
          </div>
        ) : (
          <div className='space-y-6'>
            {members.length === 0 ? (
              <div className='text-center py-6 text-gray-500 text-base'>No members found</div>
            ) : (
              members.map((member) => {
                const isUserOnline = onlineUsers.includes(member._id)

                return (
                  <div key={member._id} className='flex items-center p-4 hover:bg-gray-50 rounded-lg shadow-sm'>
                    <div className='relative'>
                      <Avatar img={member.avatar} rounded size='lg' />
                      <span
                        className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full ${
                          isUserOnline ? 'bg-green-500' : 'bg-yellow-500'
                        } border-2 border-white`}
                      ></span>
                    </div>
                    <div className='ml-4 flex-1'>
                      <div className='flex items-center'>
                        <div className='font-semibold text-base'>{member.name}</div>
                        {member.admin && (
                          <Badge color='blue' className='ml-3 text-xs'>
                            Admin
                          </Badge>
                        )}
                        {isUserOnline && (
                          <Badge color='success' className='ml-3 text-xs'>
                            Online
                          </Badge>
                        )}
                      </div>
                      <div className='text-sm text-gray-600'>{member.email}</div>
                      <div className='text-xs text-gray-400'>Joined {formatJoinDate(member.joinedAt)}</div>
                    </div>
                    <div className='flex items-center gap-3'>
                      <Button size='xs' color='light' onClick={() => handleViewProfile(member._id)}>
                        View
                      </Button>
                      { currentUserId !== member._id && 
                        <Button color="light" size="xs" onClick={() => handleEditClick(member)}>
                          <HiPencil className="h-4 w-4" />
                        </Button>
                      }
                      {isCurrentUserAdmin && !member.admin && (
                        <Button
                          size='xs'
                          color='failure'
                          onClick={() => handleDeleteClick(member._id)}
                          title='Delete member'
                        >
                          <HiTrash className='h-4 w-4' />
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}
      </Modal.Body>
      {/* Edit Channel Modal */}
      <Modal show={showEditModal} onClose={() => setShowEditModal(false)}>
        <Modal.Header>Edit Role Of Member</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <div>
              <label htmlFor="edit-role" className="block mb-2 text-sm font-medium text-gray-900">
                Role
              </label>
              <select
                id="edit-role"
                name="role"
                value={currentUserRole}
                onChange={handleRoleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                required
              >
                <option value="member">member</option>
                <option value="admin">admin</option>
              </select>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="blue" onClick={handleUpdateRole} disabled={isLoading || !hasChanges}>
            {isLoading ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Updating...
              </>
            ) : (
              "Update Channel"
            )}
          </Button>
          <Button color="gray" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      <ConfirmDialog
        show={showDeleteConfirm}
        title='Delete Member'
        message='Are you sure you want to delete this member?'
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </Modal>
  )
}

export default ChannelMembersModal
