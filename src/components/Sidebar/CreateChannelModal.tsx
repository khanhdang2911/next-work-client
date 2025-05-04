import type React from 'react'

import { useState } from 'react'
import { Button, Label, Modal, TextInput } from 'flowbite-react'
import { HiHashtag } from 'react-icons/hi'

interface CreateChannelModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateChannel: (name: string, description: string) => void
}

const CreateChannelModal: React.FC<CreateChannelModalProps> = ({ isOpen, onClose, onCreateChannel }) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      setError('Channel name is required')
      return
    }

    // Validate channel name (lowercase, no spaces, etc.)
    const channelNameRegex = /^[a-z0-9_-]+$/
    if (!channelNameRegex.test(name)) {
      setError('Channel name can only contain lowercase letters, numbers, hyphens, and underscores')
      return
    }

    onCreateChannel(name, description)

    // Reset form
    setName('')
    setDescription('')
    setError('')
    onClose()
  }

  return (
    <Modal show={isOpen} onClose={onClose} size='md'>
      <Modal.Header>Create New Channel</Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <Label htmlFor='channel-name' value='Channel Name' />
            <TextInput
              id='channel-name'
              placeholder='general'
              value={name}
              onChange={(e) => setName(e.target.value.toLowerCase())}
              required
              icon={HiHashtag}
              helperText='Lowercase letters, numbers, hyphens and underscores only'
            />
            {error && <p className='text-red-500 text-sm mt-1'>{error}</p>}
          </div>

          <div>
            <Label htmlFor='channel-description' value='Description (Optional)' />
            <TextInput
              id='channel-description'
              placeholder='This channel is for team-wide communication'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
          />
          </div>

          <div className='flex justify-end space-x-2'>
            <Button color='gray' onClick={onClose}>
              Cancel
            </Button>
            <Button type='submit' color='blue'>
              Create Channel
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  )
}

export default CreateChannelModal
