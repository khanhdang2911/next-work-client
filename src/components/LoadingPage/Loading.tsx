export default function LoadingOverlay({ isLoading }: Readonly<{ isLoading: boolean }>) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Blur overlay for underlying content */}
      <div className="absolute inset-0 backdrop-blur-md"></div>
      
      {/* Centered loading content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-600 border-t-transparent"></div>
          <p className="mt-4 text-lg font-medium text-slate-700">Loading...</p>
        </div>
      </div>
    </div>
  );
}
