import ToastCustom from '../../components/ToastCustom.tsx/ToastCustom'
import CommonHeader from '../../layouts/Header/CommonHeader'

export default function NotFoundPage() {
  return (
    <>
      <CommonHeader />

      <div className='flex items-center justify-center h-screen bg-gray-50 pt-20'>
        <div className='relative'>
          <div className='relative flex items-center'>
            <span className='text-gray-300 text-[500px] font-bold leading-none'>4</span>
            <div className='relative'>
              <span className='text-gray-300 text-[500px] font-bold leading-none'>0</span>
            </div>
            <span className='text-gray-300 text-[500px] font-bold leading-none'>4</span>
          </div>

          <div className='absolute inset-0 flex flex-col items-center justify-center'>
            <p className='text-gray-600 text-6xl font-bold whitespace-nowrap'>PAGE NOT FOUND</p>
            <p className='text-gray-500 mt-8 max-w-md text-center'>
              The page you're looking for doesn't exist or you don't have permission to access it. Please try navigating
              to the home page or logging out and back in.
            </p>
          </div>
        </div>
      </div>
      <ToastCustom />
    </>
  )
}
