import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getAuthSelector } from '../redux/selectors'
import { jwtDecode } from 'jwt-decode'
import { useEffect, useState } from 'react'

interface DecodedToken {
  exp: number
  iat: number
  id: string
  roles: string[]
  email: string
}

export const useAuth = () => {
  const auth: any = useSelector(getAuthSelector)
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null)

  useEffect(() => {
    if (auth?.user?.accessToken) {
      try {
        const decoded = jwtDecode<DecodedToken>(auth.user.accessToken)
        setDecodedToken(decoded)
      } catch (error) {
        console.error('Error decoding token:', error)
      }
    }
    setIsLoading(false)
  }, [auth?.user?.accessToken])

  // Check if user is authenticated
  const isAuthenticated = auth?.isAuthenticated

  // Decode token to get user roles
  const getDecodedToken = (): DecodedToken | null => {
    if (!auth?.user?.accessToken) return null

    try {
      if (auth?.user?.accessToken) {
        const decoded = jwtDecode<DecodedToken>(auth.user.accessToken)
        return decoded
      }
      return null
    } catch (error) {
      console.error('Error decoding token:', error)
      return null
    }
  }

  // Get user roles from decoded token
  const getUserRoles = (): string[] => {
    const decoded = getDecodedToken()
    return decoded?.roles || []
  }

  // Check if user has a specific role
  const hasRole = (role: string): boolean => {
    const roles = getUserRoles()
    return roles.includes(role)
  }

  // Check if user has any of the specified roles
  const hasAnyRole = (roles: string[]): boolean => {
    const userRoles = getUserRoles()
    return roles.some((role) => userRoles.includes(role))
  }

  // Check if user has all of the specified roles
  const hasAllRoles = (roles: string[]): boolean => {
    const userRoles = getUserRoles()
    return roles.every((role) => userRoles.includes(role))
  }

  // Check if user is admin
  const isAdmin = (): boolean => {
    return hasRole('admin')
  }

  // Check if user is workspace admin
  const isWorkspaceAdmin = (): boolean => {
    return hasRole('workspace_admin')
  }

  // Redirect to forbidden page if not authorized
  const requireAdmin = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return false
    }

    if (!isAdmin()) {
      navigate('/forbidden')
      return false
    }

    return true
  }

  // Check if user can access workspace admin features
  // const canAccessWorkspaceAdmin = (): boolean => {
  //   return isAdmin() || isWorkspaceAdmin()
  // }

  const checkAccess = (requiredRoles: string[] = []): boolean => {
    if (!isAuthenticated) return false
    if (requiredRoles.length === 0) return true
    return hasAnyRole(requiredRoles)
  }

  const requireAuth = (requiredRoles: string[] = []) => {
    if (!isAuthenticated) {
      navigate('/login')
      return false
    }

    if (requiredRoles.length > 0 && !hasAnyRole(requiredRoles)) {
      navigate('/forbidden')
      return false
    }

    return true
  }

  return {
    isAuthenticated,
    getDecodedToken,
    getUserRoles,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    isAdmin,
    isWorkspaceAdmin,
    requireAdmin,
    // canAccessWorkspaceAdmin,
    user: auth?.user,
    checkAccess,
    requireAuth,
    isLoading,
    roles: decodedToken?.roles || []
  }
}

export default useAuth
