// Create a new file with reusable skeleton components

export const SkeletonText = ({ width = "w-full", height = "h-4", className = "" }: { width?: string; height?: string; className?: string }) => (
  <div className={`${width} ${height} ${className} bg-gray-200 rounded-md animate-pulse`}></div>
)

export const SkeletonAvatar = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  }

  return <div className={`${sizeClasses[size]} bg-gray-200 rounded-full animate-pulse`}></div>
}

export const SkeletonButton = ({ width = "w-20" }: { width?: string }) => (
  <div className={`${width} h-9 bg-gray-200 rounded-md animate-pulse`}></div>
)

export const SkeletonCard = ({ rows = 3 }: { rows?: number }) => (
  <div className="border rounded-lg p-4 w-full">
    <div className="flex items-center mb-4">
      <SkeletonAvatar />
      <div className="ml-3 flex-1">
        <SkeletonText width="w-1/3" />
        <SkeletonText width="w-1/4" height="h-3" className="mt-2" />
      </div>
    </div>
    <div className="space-y-2">
      {Array(rows)
        .fill(0)
        .map((_, i) => (
          <SkeletonText key={i} />
        ))}
    </div>
  </div>
)

export const SkeletonTable = ({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) => (
  <div className="w-full">
    <div className="flex mb-4">
      {Array(cols)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="flex-1 h-8 bg-gray-200 rounded-md mx-1 animate-pulse"></div>
        ))}
    </div>
    <div className="space-y-4">
      {Array(rows)
        .fill(0)
        .map((_, rowIndex) => (
          <div key={rowIndex} className="flex">
            {Array(cols)
              .fill(0)
              .map((_, colIndex) => (
                <div key={colIndex} className="flex-1 h-12 bg-gray-200 rounded-md mx-1 animate-pulse"></div>
              ))}
          </div>
        ))}
    </div>
  </div>
)

export const SkeletonWorkspaceItem = () => <div className="w-12 h-12 rounded-md bg-gray-700 mb-4 animate-pulse"></div>

export const SkeletonChannelItem = () => (
  <div className="px-4 py-1.5 rounded-md">
    <div className="flex items-center">
      <div className="h-4 w-4 bg-gray-700 rounded-full mr-2 animate-pulse"></div>
      <div className="h-4 w-24 bg-gray-700 rounded-md animate-pulse"></div>
    </div>
  </div>
)

export const SkeletonChatMessage = () => (
  <div className="flex mb-4 px-4">
    <SkeletonAvatar />
    <div className="flex-1 ml-3">
      <div className="flex">
        <SkeletonText width="w-32" className="mb-2" />
        <SkeletonText width="w-20" height="h-3" className="ml-2" />
      </div>
      <SkeletonText height="h-16" />
    </div>
  </div>
)

export const SkeletonChatHeader = () => (
  <div className="border-b p-3 flex items-center">
    <div className="flex-1">
      <div className="h-6 bg-gray-200 rounded-md w-32 animate-pulse"></div>
    </div>
    <div className="flex space-x-2">
      {Array(4)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
        ))}
    </div>
  </div>
)

export const SkeletonChatInput = () => (
  <div className="border-t p-3">
    <div className="h-10 bg-gray-200 rounded-md animate-pulse"></div>
  </div>
)
