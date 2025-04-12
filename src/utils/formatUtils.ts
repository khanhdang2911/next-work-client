export const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

export const formatMessageContent = (content: string) => {
  // Replace **text** with <strong>text</strong>
  let formattedContent = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')

  // Replace *text* or _text_ with <em>text</em>
  formattedContent = formattedContent.replace(/(\*|_)(.*?)\1/g, '<em>$2</em>')

  // Replace URLs with links
  formattedContent = formattedContent.replace(
    /(https?:\/\/[^\s]+)/g,
    '<a href="$1" class="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>'
  )

  return formattedContent
}

export const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'online':
      return 'bg-green-500'
    case 'offline':
      return 'bg-gray-400'
    case 'away':
      return 'bg-yellow-500'
    case 'busy':
      return 'bg-red-500'
    default:
      return 'bg-gray-400'
  }
}
