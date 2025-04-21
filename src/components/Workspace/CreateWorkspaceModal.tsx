import type React from 'react'

import { useState } from 'react'
import { Button, Label, Modal, TextInput } from 'flowbite-react'
import { HiOfficeBuilding } from 'react-icons/hi'

interface CreateWorkspaceModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateWorkspace: (name: string, icon: string) => void
}

const CreateWorkspaceModal: React.FC<CreateWorkspaceModalProps> = ({ isOpen, onClose, onCreateWorkspace }) => {
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      setError('Workspace name is required')
      return
    }

    // Generate icon from name if not provided
    const finalIcon = icon.trim() || name.charAt(0).toUpperCase()

    onCreateWorkspace(name, finalIcon)

    // Reset form
    setName('')
    setIcon('')
    setError('')
    onClose()
  }

  return (
    <Modal show={isOpen} onClose={onClose} size='md'>
      <Modal.Header>Create New Workspace</Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <Label htmlFor='workspace-name' value='Workspace Name' />
            <TextInput
              id='workspace-name'
              placeholder='Acme Inc'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              icon={HiOfficeBuilding}
            />
            {error && <p className='text-red-500 text-sm mt-1'>{error}</p>}
          </div>

          <div>
            <Label htmlFor='workspace-icon' value='Workspace description' />
            <TextInput
              id='workspace-icon'
              placeholder='Company'
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              maxLength={1}
              helperText='Enter a single character to use as the workspace icon'
            />
          </div>

          <div className='flex justify-end space-x-2'>
            <Button color='gray' onClick={onClose}>
              Cancel
            </Button>
            <Button type='submit' color='blue'>
              Create Workspace
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  )
}

export default CreateWorkspaceModal
