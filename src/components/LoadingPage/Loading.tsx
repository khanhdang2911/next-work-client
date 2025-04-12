export default function LoadingOverlay({ isLoading }: Readonly<{ isLoading: boolean }>) {
  if (!isLoading) return null

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50'>
      <div className='flex flex-col items-center'>
        <div className='h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent'></div>
        <p className='mt-4 text-lg font-medium text-white'>Loading...</p>
      </div>
    </div>
  )
}
