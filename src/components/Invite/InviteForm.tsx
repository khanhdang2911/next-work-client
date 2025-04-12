import type React from 'react'
import { useState } from 'react'
import { Button, Label, TextInput, Checkbox } from 'flowbite-react'
import { HiMail, HiUserAdd } from 'react-icons/hi'

const InviteForm: React.FC = () => {
  const [email, setEmail] = useState('')
  const [selectedChannels, setSelectedChannels] = useState<string[]>(['general'])
  const [message, setMessage] = useState('')

  const channels = [
    { id: 'general', name: 'general' },
    { id: 'random', name: 'random' },
    { id: 'announcements', name: 'announcements' },
    { id: 'development', name: 'development' },
    { id: 'design', name: 'design' },
    { id: 'marketing', name: 'marketing' }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Invitation sent to ${email}`)
    setEmail('')
    setMessage('')
  }

  const handleChannelToggle = (channelId: string) => {
    setSelectedChannels((prev) =>
      prev.includes(channelId) ? prev.filter((id) => id !== channelId) : [...prev, channelId]
    )
  }

  return (
    <div className='max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md'>
      <h2 className='text-2xl font-bold mb-6'>Invite People to Workspace</h2>

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

        <div className='mb-4'>
          <Label value='Add to Channels' className='block mb-2' />
          <div className='grid grid-cols-2 gap-2'>
            {channels.map((channel) => (
              <div key={channel.id} className='flex items-center'>
                <Checkbox
                  id={`channel-${channel.id}`}
                  checked={selectedChannels.includes(channel.id)}
                  onChange={() => handleChannelToggle(channel.id)}
                />
                <Label htmlFor={`channel-${channel.id}`} className='ml-2'>
                  # {channel.name}
                </Label>
              </div>
            ))}
          </div>
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
