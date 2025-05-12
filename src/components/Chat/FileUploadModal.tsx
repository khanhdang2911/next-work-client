import type React from 'react'
import { useState, useRef } from 'react'
import { Button, Modal, Progress } from 'flowbite-react'
import { HiUpload, HiX, HiDocumentText } from 'react-icons/hi'

interface FileUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onFileUpload: (file: File) => void
  maxFileSize?: number
}

const FileUploadModal: React.FC<FileUploadModalProps> = ({ 
  isOpen, 
  onClose, 
  onFileUpload, 
  maxFileSize = 40 * 1024 * 1024
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      
      if (file.size > maxFileSize) {
        setError(`File size exceeds the limit of ${formatFileSize(maxFileSize)}`)
        return
      }
      
      setSelectedFile(file)
    }
  }

  const handleUpload = () => {
    if (!selectedFile) return

    if (selectedFile.size > maxFileSize) {
      setError(`File size exceeds the limit of ${formatFileSize(maxFileSize)}`)
      return
    }

    setIsUploading(true)
    setError(null)

    // Simulate upload progress
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setUploadProgress(progress)

      if (progress >= 100) {
        clearInterval(interval)
        setIsUploading(false)
        onFileUpload(selectedFile)
        resetForm()
        onClose()
      }
    }, 100)
  }

  const resetForm = () => {
    setSelectedFile(null)
    setUploadProgress(0)
    setIsUploading(false)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <Modal show={isOpen} onClose={handleClose} size='md'>
      <Modal.Header>Upload File</Modal.Header>
      <Modal.Body>
        <div className='space-y-4'>
          {!selectedFile ? (
            <div
              className='border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50'
              onClick={() => fileInputRef.current?.click()}
            >
              <HiUpload className='mx-auto h-12 w-12 text-gray-400' />
              <p className='mt-2 text-sm text-gray-600'>Click to upload</p>
              <p className='text-xs text-gray-500'>
                PDF, DOC, XLS, JPG, PNG,... (Max: {formatFileSize(maxFileSize)})
              </p>
              <input 
                ref={fileInputRef} 
                type='file' 
                className='hidden' 
                onChange={handleFileChange} 
              />
            </div>
          ) : (
            <div className='border rounded-lg p-4'>
              <div className='flex items-center'>
                <HiDocumentText className='h-8 w-8 text-blue-500 mr-3' />
                <div className='flex-1'>
                  <div className='flex items-center justify-between'>
                    <p className='font-medium truncate' title={selectedFile.name}>
                      {selectedFile.name}
                    </p>
                    <Button color='gray' size='xs' pill onClick={resetForm} disabled={isUploading}>
                      <HiX className='h-3 w-3' />
                    </Button>
                  </div>
                  <p className='text-xs text-gray-500'>{formatFileSize(selectedFile.size)}</p>

                  {isUploading && (
                    <div className='mt-2'>
                      <Progress
                        progress={uploadProgress}
                        size='sm'
                        color='blue'
                        labelText
                        textLabelPosition='outside'
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className='text-red-600 text-sm mt-2'>
              {error}
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button color='gray' onClick={handleClose}>
          Cancel
        </Button>
        <Button 
          color='blue' 
          onClick={handleUpload} 
          disabled={!selectedFile || isUploading || !!error}
        >
          {isUploading ? 'Uploading...' : 'Upload'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default FileUploadModal
