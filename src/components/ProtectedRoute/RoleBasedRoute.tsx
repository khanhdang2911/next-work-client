import type React from 'react'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

interface RoleBasedRouteProps {
  children: React.ReactNode
  requiredRoles: string[]
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ children, requiredRoles }) => {
  const { isAuthenticated, hasAnyRole, isAdmin, isWorkspaceAdmin } = useAuth()
  const navigate = useNavigate()
  const { workspaceId } = useParams<{ workspaceId: string }>()

  useEffect(() => {
    // Only check authentication and roles once on mount or when dependencies change
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    const isWorkspaceAdminRoute = window.location.pathname.includes('/admin/workspace/') && workspaceId

    if (isWorkspaceAdminRoute) {
      if (isAdmin() || isWorkspaceAdmin()) {
        return
      }
    } else if (hasAnyRole(requiredRoles)) {
      return
    }

    navigate('/forbidden')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, workspaceId, requiredRoles]) // Remove function dependencies

  return <>{children}</>
}

export default RoleBasedRoute
