export default function NotFoundPage() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="relative">
        <div className="relative flex items-center">
          <span className="text-gray-300 text-[500px] font-bold leading-none">4</span>
          <div className="relative">
            <span className="text-gray-300 text-[500px] font-bold leading-none">0</span>
          </div>
          <span className="text-gray-300 text-[500px] font-bold leading-none">4</span>
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-gray-600 text-6xl font-bold whitespace-nowrap">PAGE NOT FOUND</p>
        </div>
      </div>
    </div>
  );
}
