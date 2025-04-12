import { Button, Avatar, Dropdown } from 'flowbite-react'
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getAuthSelector } from '../../redux/selectors'
import { logout as logoutApi } from '../../api/auth.api'
import authSlice from '../../redux/authSlice'
import { useAuth0 } from '@auth0/auth0-react'
import Logo from '../../assets/icons/Logo.svg'
import { toast } from 'react-toastify'
export default function Header() {
  const auth: any = useSelector(getAuthSelector)
  const { logout } = useAuth0()
  const navigate = useNavigate()
  const dispatch = useDispatch()
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
    <header className='bg-white shadow-sm h-[8vh] flex items-center'>
      <div className='w-full flex h-14 items-center justify-between px-4'>
        <Link className='flex items-center text-blue-500' to='/'>
          <img src={Logo} alt='' className='h-8 w-8 mr-2' />
          <span className='text-xl font-semibold'>CloudTalk </span>
        </Link>

        <div className='flex items-center gap-4'>
          {auth?.isAuthenticated ? (
            <Dropdown arrowIcon={false} inline label={<Avatar alt='User settings' img={auth.user?.avatar} rounded />}>
              <Dropdown.Header>
                <span className='block text-sm'>
                  {auth.user.firstname} {auth.user.lastname}
                </span>
                <span className='block truncate text-sm font-medium'>{auth.user.email}</span>
              </Dropdown.Header>
              <Dropdown.Item icon={FaUserCircle}>Profile</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item icon={FaSignOutAlt} onClick={handleLogout}>
                Sign out
              </Dropdown.Item>
            </Dropdown>
          ) : (
            <div className='flex gap-4'>
              <Link to='/login'>
                <Button color='blue'>Login</Button>
              </Link>
              <Link to='/register' className='block'>
                <Button color='light'>Register</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
