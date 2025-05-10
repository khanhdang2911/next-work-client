import type React from "react"
import { Link } from "react-router-dom"
import { HiOfficeBuilding, HiUserGroup, HiChartBar, HiHome } from "react-icons/hi"

interface AdminSidebarProps {
  isSystemAdmin?: boolean
  onNavigate?: (section: string) => void
  currentSection?: string
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isSystemAdmin = false,
  onNavigate,
  currentSection = "dashboard",
}) => {
  // Helper function to determine if a section is active
  const isActive = (section: string) => {
    return currentSection === section
  }

  // Handle navigation
  const handleNavigation = (section: string) => {
    if (onNavigate) {
      onNavigate(section)
    }
  }

  return (
    <div className="w-64 bg-gray-800 h-screen flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-white font-bold text-lg">{isSystemAdmin && "System Admin"}</h1>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-2 px-3">
          <li>
            <Link to="/" className="flex items-center p-2 text-gray-300 rounded-lg hover:bg-gray-700">
              <HiHome className="w-5 h-5 mr-3" />
              <span>Back to Home</span>
            </Link>
          </li>

          <li>
            <button
              onClick={() => handleNavigation("dashboard")}
              className={`flex items-center p-2 rounded-lg w-full text-left ${
                isActive("dashboard") ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-700"
              }`}
            >
              <HiChartBar className="w-5 h-5 mr-3" />
              <span>Dashboard</span>
            </button>
          </li>

          {isSystemAdmin && (
            <>
              <li>
                <button
                  onClick={() => handleNavigation("workspaces")}
                  className={`flex items-center p-2 rounded-lg w-full text-left ${
                    isActive("workspaces") ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  <HiOfficeBuilding className="w-5 h-5 mr-3" />
                  <span>Workspaces</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation("users")}
                  className={`flex items-center p-2 rounded-lg w-full text-left ${
                    isActive("users") ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  <HiUserGroup className="w-5 h-5 mr-3" />
                  <span>Users</span>
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  )
}

export default AdminSidebar
