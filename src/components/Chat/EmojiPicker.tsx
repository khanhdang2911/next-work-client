import type React from 'react'
import { useState, useEffect, useRef } from 'react'
import { Button } from 'flowbite-react'

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void
  onClose: () => void
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onEmojiSelect, onClose }) => {
  const pickerRef = useRef<HTMLDivElement>(null)

  // Common emojis
  const emojis = [
    '👍',
    '👎',
    '😀',
    '😃',
    '😄',
    '😁',
    '😆',
    '😅',
    '🤣',
    '😂',
    '🙂',
    '🙃',
    '😉',
    '😊',
    '😇',
    '🥰',
    '😍',
    '🤩',
    '😘',
    '😗',
    '😚',
    '😙',
    '😋',
    '😛',
    '😜',
    '😝',
    '🤑',
    '🤗',
    '🤭',
    '🤫',
    '🤔',
    '🤐',
    '🤨',
    '😐',
    '😑',
    '😶',
    '😏',
    '😒',
    '🙄',
    '😬',
    '🤥',
    '😌',
    '😔',
    '😪',
    '🤤',
    '😴',
    '😷',
    '🤒',
    '🤕',
    '🤢',
    '🤮',
    '🤧',
    '🥵',
    '🥶',
    '🥴',
    '😵',
    '🤯',
    '🤠',
    '🥳',
    '😎',
    '🤓',
    '🧐',
    '😕',
    '😟',
    '🙁',
    '☹️',
    '😮',
    '😯',
    '😲',
    '😳',
    '🥺',
    '😦',
    '😧',
    '😨',
    '😰',
    '😥',
    '😢',
    '😭',
    '😱',
    '😖',
    '😣',
    '😞',
    '😓',
    '😩',
    '😫',
    '🥱',
    '😤',
    '😡',
    '😠',
    '🤬',
    '👋',
    '🤚',
    '✋',
    '🖖',
    '👌',
    '🤌',
    '🤏',
    '✌️',
    '🤞',
    '🤟',
    '🤘',
    '🤙',
    '👈',
    '👉',
    '👆',
    '🖕',
    '👇',
    '☝️',
    '👍',
    '👎',
    '✊',
    '👊',
    '🤛',
    '🤜',
    '👏',
    '🙌',
    '👐',
    '🤲',
    '🤝',
    '🙏',
    '✍️',
    '💅',
    '🤳',
    '💪',
    '🦾',
    '🦿',
    '🦵',
    '🦶',
    '👂',
    '🦻',
    '👃',
    '🫀',
    '🫁',
    '🧠',
    '🦷',
    '🦴',
    '👀',
    '👁️',
    '👅',
    '👄',
    '💋',
    '🩸',
    '❤️',
    '🧡',
    '💛',
    '💚',
    '💙',
    '💜',
    '🤎',
    '🖤',
    '🤍',
    '💔',
    '❤️‍🔥',
    '❤️‍🩹',
    '❣️',
    '💕',
    '💞',
    '💓',
    '💗',
    '💖',
    '💘',
    '💝',
    '💟',
    '♥️',
    '💯',
    '💢',
    '💥',
    '💫',
    '💦',
    '💨',
    '🕳️',
    '💣',
    '💬',
    '👁️‍🗨️',
    '🗨️',
    '🗯️',
    '💭',
    '💤',
    '👋',
    '🤚'
  ]

  // Categories for organization
  const categories = [
    { name: 'Smileys & Emotion', emojis: emojis.slice(0, 40) },
    { name: 'People & Body', emojis: emojis.slice(40, 80) },
    { name: 'Symbols', emojis: emojis.slice(80, 120) },
    { name: 'Recently Used', emojis: emojis.slice(0, 10) }
  ]

  const [activeCategory, setActiveCategory] = useState(0)

  useEffect(() => {
    // Close emoji picker when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onClose])

  return (
    <div
      ref={pickerRef}
      className='absolute z-50 bg-white rounded-lg shadow-lg border border-gray-200 w-64'
      onClick={(e) => e.stopPropagation()}
    >
      <div className='p-2 border-b'>
        <div className='flex space-x-1 overflow-x-auto'>
          {categories.map((category, index) => (
            <Button
              key={category.name}
              color={activeCategory === index ? 'blue' : 'light'}
              size='xs'
              onClick={() => setActiveCategory(index)}
              className='whitespace-nowrap'
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      <div className='p-2 max-h-60 overflow-y-auto'>
        <div className='grid grid-cols-8 gap-1'>
          {categories[activeCategory].emojis.map((emoji, index) => (
            <button
              key={index}
              className='w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded'
              onClick={() => {
                onEmojiSelect(emoji)
                onClose()
              }}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default EmojiPicker
