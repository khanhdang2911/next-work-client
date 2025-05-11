import type React from 'react'
import { useState } from 'react'
import AdminSidebar from '../../components/Admin/AdminSidebar'
import WorkspaceManagementPage from './SystemAdmin/WorkspaceManagementPage'
import UserManagementPage from './SystemAdmin/UserManagementPage'
import { Card, Button } from 'flowbite-react'
import { HiOfficeBuilding, HiUserGroup, HiChartBar } from 'react-icons/hi'
import useAuth from '../../hooks/useAuth'

const DashboardContent: React.FC<{ isSystemAdmin: boolean; onNavigate: (section: string) => void }> = ({
  isSystemAdmin,
  onNavigate
}) => {
  return (
    <div>
      <h1 className='text-2xl font-bold mb-6'>Admin Dashboard</h1>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {isSystemAdmin && (
          <>
            <Card className='hover:shadow-lg transition-shadow'>
              <div className='flex flex-col items-center'>
                <div className='p-3 bg-blue-100 rounded-full mb-4'>
                  <HiOfficeBuilding className='h-8 w-8 text-blue-600' />
                </div>
                <h2 className='text-xl font-bold mb-2'>Workspace Management</h2>
                <p className='text-gray-600 text-center mb-4'>Create, edit, and manage all workspaces in the system.</p>
                <Button color='blue' onClick={() => onNavigate('workspaces')}>
                  Manage Workspaces
                </Button>
              </div>
            </Card>

            <Card className='hover:shadow-lg transition-shadow'>
              <div className='flex flex-col items-center'>
                <div className='p-3 bg-purple-100 rounded-full mb-4'>
                  <HiUserGroup className='h-8 w-8 text-purple-600' />
                </div>
                <h2 className='text-xl font-bold mb-2'>User Management</h2>
                <p className='text-gray-600 text-center mb-4'>Manage all users, lock accounts, and reset passwords.</p>
                <Button color='purple' onClick={() => onNavigate('users')}>
                  Manage Users
                </Button>
              </div>
            </Card>

            <Card className='hover:shadow-lg transition-shadow'>
              <div className='flex flex-col items-center'>
                <div className='p-3 bg-green-100 rounded-full mb-4'>
                  <HiChartBar className='h-8 w-8 text-green-600' />
                </div>
                <h2 className='text-xl font-bold mb-2'>System Analytics</h2>
                <p className='text-gray-600 text-center mb-4'>View system usage statistics and performance metrics.</p>
                <Button color='green'>View Analytics</Button>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}

const AdminDashboardPage: React.FC = () => {
  const { isAdmin } = useAuth()
  const [currentSection, setCurrentSection] = useState('dashboard')

  // Function to handle navigation within the dashboard
  const handleNavigate = (section: string) => {
    setCurrentSection(section)
  }

  // Render the appropriate content based on the current section
  const renderContent = () => {
    switch (currentSection) {
      case 'workspaces':
        return <WorkspaceManagementPage isEmbedded={true} />
      case 'users':
        return <UserManagementPage isEmbedded={true} />
      default:
        return <DashboardContent isSystemAdmin={isAdmin()} onNavigate={handleNavigate} />
    }
  }

  return (
    <div className='flex h-screen'>
      <AdminSidebar isSystemAdmin={isAdmin()} onNavigate={handleNavigate} currentSection={currentSection} />

      <div className='flex-1 p-6 overflow-y-auto'>{renderContent()}</div>
    </div>
  )
}

export default AdminDashboardPage
