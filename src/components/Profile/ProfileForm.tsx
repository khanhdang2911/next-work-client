import type React from 'react'
import { useState, useRef } from 'react'
import { Button, Label, TextInput, Avatar, Select } from 'flowbite-react'
import { HiUpload } from 'react-icons/hi'
import { useSelector, useDispatch } from 'react-redux'
import { getAuthSelector } from '../../redux/selectors'
import { updateUserProfile } from '../../api/auth.api'
import authSlice from '../../redux/authSlice'
import { toast } from 'react-toastify'

const ProfileForm: React.FC = () => {
  const auth: any = useSelector(getAuthSelector)
  const dispatch = useDispatch()
  const currentUser = auth.user
  const [name, setName] = useState(currentUser.name)
  const [email, setEmail] = useState(currentUser.email)
  const [gender, setGender] = useState(currentUser.gender || 'Male')
  const [avatar, setAvatar] = useState(currentUser.avatar)
  const [status, setStatus] = useState<'Online' | 'Away'>(currentUser.status || 'Online')
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData()

      // Only add file if a new one was selected
      if (fileInputRef.current?.files && fileInputRef.current.files.length > 0) {
        formData.append('file', fileInputRef.current.files[0])
      }

      formData.append('name', name)
      formData.append('gender', gender)
      formData.append('status', status)

      const response = await updateUserProfile(formData)

      if (response.status === 'success') {
        // Only update specific fields in Redux store, not the entire user object
        dispatch(
          authSlice.actions.updateUserProfile({
            name,
            gender,
            status,
            avatar: response.data.avatar || currentUser.avatar // Use new avatar if provided, otherwise keep current
          })
        )
        toast.success('Profile updated successfully!')
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = (newStatus: 'Online' | 'Away') => {
    setStatus(newStatus)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Create a preview URL for the selected image
      const previewUrl = URL.createObjectURL(e.target.files[0])
      setAvatar(previewUrl)
    }
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className='max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md'>
      <h2 className='text-2xl font-bold mb-6'>Edit Profile</h2>

      <form onSubmit={handleSubmit}>
        <div className='mb-6 flex flex-col items-center'>
          <div className='relative cursor-pointer' onClick={handleAvatarClick}>
            <Avatar img={avatar} size='xl' rounded />
            <div className='absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 rounded-full flex items-center justify-center transition-all'>
              <HiUpload className='text-white opacity-0 hover:opacity-100 h-8 w-8' />
            </div>
          </div>
          <input type='file' ref={fileInputRef} className='hidden' accept='image/*' onChange={handleFileChange} />
          <div className='mt-4'>
            <Button color='light' size='sm' onClick={handleAvatarClick}>
              <HiUpload className='mr-2 h-4 w-4' />
              Upload New Avatar
            </Button>
          </div>
        </div>

        <div className='mb-4'>
          <Label htmlFor='name' value='Name' className='block mb-2' />
          <TextInput id='name' value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div className='mb-4'>
          <Label htmlFor='email' value='Email' className='block mb-2' />
          <TextInput id='email' type='email' value={email} onChange={(e) => setEmail(e.target.value)} disabled />
          <p className='text-xs text-gray-500 mt-1'>Email cannot be changed</p>
        </div>

        <div className='mb-4'>
          <Label htmlFor='gender' value='Gender' className='block mb-2' />
          <Select id='gender' value={gender} onChange={(e) => setGender(e.target.value)} required>
            <option value='Male'>Male</option>
            <option value='Female'>Female</option>
          </Select>
        </div>

        <div className='mb-6'>
          <Label value='Status' className='block mb-2' />
          <div className='flex space-x-2'>
            <Button
              color={status === 'Online' ? 'success' : 'light'}
              size='sm'
              onClick={() => handleStatusChange('Online')}
            >
              <span className='w-2 h-2 bg-green-500 rounded-full mr-2'></span>
              Online
            </Button>

            <Button
              color={status === 'Away' ? 'warning' : 'light'}
              size='sm'
              onClick={() => handleStatusChange('Away')}
            >
              <span className='w-2 h-2 bg-yellow-500 rounded-full mr-2'></span>
              Away
            </Button>
          </div>
        </div>

        <div className='flex justify-end'>
          <Button type='submit' color='blue' disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ProfileForm
