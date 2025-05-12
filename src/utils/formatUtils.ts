import moment from 'moment'
export const formatTime = (dateString: string) => {
  return moment(dateString).format("dddd, DD/MM/YYYY")
}

export const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

export const formatMessageContent = (content: string) => {
  // Replace **text** with <strong>text</strong>
  let formattedContent = content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")

  // Replace *text* or _text_ with <em>text</em>
  formattedContent = formattedContent.replace(/(\*|_)(.*?)\1/g, "<em>$2</em>")

  // Replace URLs with links
  formattedContent = formattedContent.replace(
    /(https?:\/\/[^\s]+)/g,
    '<a href="$1" class="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>',
  )

  return formattedContent
}
export const getInitials = (name: string) => {
  const parts = name.split(" ")
  return parts.length > 1 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() : parts[0][0].toUpperCase()
}

// Update the getStatusColor function to only handle 'online' and 'away'
export const getStatusColor = (status: string) => {
  switch (status) {
    case "Online":
      return "bg-green-500"
    case "Away":
      return "bg-yellow-500"
    default:
      return "bg-red-400"
  }
}

// Add a function to check if a file is a video
export const isVideoFile = (type: string) => {
  return type.startsWith("video/")
}

// Add a function to format code blocks
export const formatCodeBlock = (content: string) => {
  // Replace \`\`\`code\`\`\` with <pre><code>code</code></pre>
  return content.replace(
    /```([\s\S]*?)```/g,
    '<pre class="bg-gray-100 p-3 rounded-lg overflow-x-auto"><code>$1</code></pre>',
  )
}
