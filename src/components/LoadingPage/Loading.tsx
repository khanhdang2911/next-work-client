export interface LoadingProps {
  size?: "sm" | "md" | "lg"
  fullPage?: boolean
  text?: string
}

export default function LoadingIndicator({ size = "md", fullPage = false, text }: LoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-4",
    lg: "h-12 w-12 border-4",
  }

  const spinner = (
    <div className={`${sizeClasses[size]} border-t-blue-500 border-blue-200 rounded-full animate-spin`}></div>
  )

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 flex justify-center items-center z-50">
        <div className="text-center">
          {spinner}
          {text && <p className="mt-2 text-gray-600">{text}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-center items-center p-4">
      {spinner}
      {text && <p className="ml-2 text-gray-600">{text}</p>}
    </div>
  )
}
