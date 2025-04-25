import type React from 'react'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card, Button } from 'flowbite-react'
import { HiPlus, HiOutlineLogout, HiUserCircle } from 'react-icons/hi'
import { getInitials } from '../../utils/formatUtils'
import CreateWorkspaceModal from '../../components/Workspace/CreateWorkspaceModal'
import type { IWorkspace } from '../../interfaces/Workspace'
import { useAuth0 } from '@auth0/auth0-react'
import { createWorkspaces, getAllWorkspaces, logout as logoutApi } from '../../api/auth.api'
import authSlice from '../../redux/authSlice'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { store } from '../../redux/store'
import { ErrorMessage } from '../../config/constants'

const WorkspacesPage: React.FC = () => {
  const [workspaces, setWorkspaces] = useState<IWorkspace[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const { logout } = useAuth0()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  useEffect( () => {
    const fetchWorkspaces = async () => {
      try {
        const res = await getAllWorkspaces()
        if (res.status === 'success') {
          setWorkspaces(res.data)
        } else {
          toast.error('Error when fetching all workspaces')
        }
      } catch (error) {
        toast.error('Something went wrong')
        console.error(error)
      }
    }
  
    fetchWorkspaces()
  }, [])
  const handleCreateWorkspace = async (name: string, description: string) => {
    const newWorkspace = {
      name,
      description,
    }
    try {
      const res = await createWorkspaces(newWorkspace);
  
      if (res.status === 'success') {
        const workspace_new: IWorkspace = res.data;
        setWorkspaces((prev) => [...prev, workspace_new]);
        setIsCreateModalOpen(false);
        toast.success("Create workspace succeeded");
      } 
    } catch (error: any) {
      toast.error(error.response?.data?.message || ErrorMessage );
    }
  }
  const handleLogout = async () => {
    try {
      //logout auth0
      await logout({ logoutParams: { returnTo: `${window.location.origin}/login` } })
      //logout backend
      await logoutApi()
      dispatch(authSlice.actions.logout())
      navigate('/login')
    } catch (error) {
      toast.error('Error when logging out.')
      dispatch(authSlice.actions.logout())
      navigate('/login')
    }
  }

  return (
    <div className='container mx-auto p-6'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Your Workspaces</h1>
        <div className='flex gap-2'>
          <Button onClick={() => setIsCreateModalOpen(true)} color='blue'>
            <HiPlus className='mr-2 h-4 w-4' />
            Create Workspace
          </Button>
          <Link to='/profile'>
            <Button color='gray'>
              <HiUserCircle className='mr-2 h-5 w-5' />
              Profile
            </Button>
          </Link>
          <Button color='red' onClick={handleLogout}>
            <HiOutlineLogout className='mr-2 h-5 w-5' />
            Logout
          </Button>
        </div>
      </div>

      {workspaces.length === 0 ? (
        <div className='text-center text-gray-500'>
          <p className='text-lg mb-2'>You don't have any workspaces yet.</p>
          <p className='text-sm'>Click the "Create Workspace" button to get started!</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {workspaces.map((workspace) => (
            <Card key={workspace._id} className='hover:shadow-lg transition-shadow'>
              <div className='flex items-center'>
                <div className='w-12 h-12 rounded-md flex items-center justify-center text-white font-bold text-lg bg-blue-600 mr-4'>
                  {getInitials(workspace.name)}
                </div>
                <div>
                  <h2 className='text-xl font-bold'>{workspace.name}</h2>
                  <p className='text-gray-500 text-sm'>Created {new Date(workspace.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className='mt-4'>
                <Link to={`/workspace/${workspace._id}`}>
                  <Button color='blue' className='w-full'>
                    Open Workspace
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}

      <CreateWorkspaceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateWorkspace={handleCreateWorkspace}
      />
    </div>
  )
}

export default WorkspacesPage
