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
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    // Special case for workspace admin routes
    const isWorkspaceAdminRoute = window.location.pathname.includes('/admin/workspace/') && workspaceId

    if (isWorkspaceAdminRoute) {
      // Allow access if user is either system admin or workspace admin
      if (isAdmin() || isWorkspaceAdmin()) {
        return
      }
    } else if (hasAnyRole(requiredRoles)) {
      // For non-workspace routes, check against required roles
      return
    }

    // If we get here, user doesn't have required permissions
    navigate('/forbidden')
  }, [isAuthenticated, hasAnyRole, isAdmin, isWorkspaceAdmin, navigate, requiredRoles, workspaceId])

  if (!isAuthenticated) {
    return null
  }

  // Special handling for workspace admin routes
  const isWorkspaceAdminRoute = window.location.pathname.includes('/admin/workspace/') && workspaceId

  if (isWorkspaceAdminRoute) {
    if (isAdmin() || isWorkspaceAdmin()) {
      return <>{children}</>
    }
    return null
  }

  // For regular admin routes
  if (!hasAnyRole(requiredRoles)) {
    return null
  }

  return <>{children}</>
}

export default RoleBasedRoute
