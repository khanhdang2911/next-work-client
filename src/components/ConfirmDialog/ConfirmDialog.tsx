import React from 'react'
import { Button, Modal } from 'flowbite-react'

interface ConfirmDialogProps {
  show: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  show,
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal show={show} onClose={onCancel}>
      <Modal.Header>{title}</Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          <p className="text-base leading-relaxed text-gray-500">
            {message}
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-2">
        <Button color="gray" onClick={onCancel}>
          Cancel
        </Button>
        <Button color="failure" onClick={onConfirm}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ConfirmDialog
