import type React from 'react'
import { useState } from 'react'
import { Button, Label, TextInput } from 'flowbite-react'
import { HiMail, HiUserAdd } from 'react-icons/hi'
import { toast } from 'react-toastify'

const InviteForm: React.FC = () => {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast.error('Please enter an email address')
      return
    }

    // In a real app, you would make an API call here
    toast.success(`Invitation sent to ${email}`)
    setEmail('')
    setMessage('')
  }

  return (
    <div className='max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md'>
      <h2 className='text-2xl font-bold mb-6'>Invite People to Channel</h2>

      <form onSubmit={handleSubmit}>
        <div className='mb-4'>
          <Label htmlFor='email' value='Email Address' className='block mb-2' />
          <TextInput
            id='email'
            type='email'
            icon={HiMail}
            placeholder='colleague@example.com'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className='mb-6'>
          <Label htmlFor='message' value='Add a Message (Optional)' className='block mb-2' />
          <textarea
            id='message'
            rows={3}
            className='block w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500'
            placeholder='Write a welcome message...'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <div className='flex justify-end'>
          <Button type='submit' color='blue'>
            <HiUserAdd className='mr-2 h-4 w-4' />
            Send Invitation
          </Button>
        </div>
      </form>
    </div>
  )
}

export default InviteForm
