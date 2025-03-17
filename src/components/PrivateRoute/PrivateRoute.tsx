import { useSelector } from 'react-redux'
import { getAuthSelector } from '../../redux/selectors'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth: any = useSelector(getAuthSelector)
  const navigate = useNavigate()
  useEffect(() => {
    if (auth && auth?.isAuthenticated === false) {
      navigate('/login')
    }
  }, [auth.isAuthenticated])
  if (auth.isAuthenticated === false) {
    return null
  }
  return <>{children}</>
}

export default PrivateRoute
