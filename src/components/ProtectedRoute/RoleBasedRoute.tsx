import type React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import LoadingOverlay from '../../components/LoadingPage/Loading'

interface RoleBasedRouteProps {
  children: React.ReactNode
  requiredRoles: string[]
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ children, requiredRoles }) => {
  const { isAuthenticated, hasAnyRole, isAdmin, isWorkspaceAdmin } = useAuth()
  const navigate = useNavigate()
  const { workspaceId } = useParams<{ workspaceId: string }>()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Only check authentication and roles once on mount or when dependencies change
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    const isWorkspaceAdminRoute = window.location.pathname.includes('/admin/workspace/') && workspaceId

    if (isWorkspaceAdminRoute) {
      if (isAdmin() || isWorkspaceAdmin()) {
        setIsLoading(false)
        return
      }
    } else if (hasAnyRole(requiredRoles)) {
      setIsLoading(false)
      return
    }

    navigate('/forbidden')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, workspaceId, requiredRoles]) // Remove function dependencies

  if (!isAuthenticated || isLoading) {
    return <LoadingOverlay isLoading={true} />
  }

  return <>{children}</>
}

export default RoleBasedRoute
