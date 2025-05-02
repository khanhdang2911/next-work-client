import type React from 'react'
import { useState, useEffect, useRef } from 'react'
import { Button } from 'flowbite-react'

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void
  onClose: () => void
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onEmojiSelect, onClose }) => {
  const pickerRef = useRef<HTMLDivElement>(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Common emojis grouped by category
  const emojiCategories = [
    {
      name: 'Smileys',
      emojis: [
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
        '😙'
      ]
    },
    {
      name: 'Gestures',
      emojis: [
        '👍',
        '👎',
        '👌',
        '✌️',
        '🤞',
        '🤟',
        '🤘',
        '🤙',
        '👈',
        '👉',
        '👆',
        '👇',
        '☝️',
        '👋',
        '🤚',
        '🖐️',
        '✋',
        '🖖',
        '👏',
        '🙌'
      ]
    },
    {
      name: 'Faces',
      emojis: [
        '😏',
        '😒',
        '😞',
        '😔',
        '😟',
        '😕',
        '🙁',
        '☹️',
        '😣',
        '😖',
        '😫',
        '😩',
        '🥺',
        '😢',
        '😭',
        '😤',
        '😠',
        '😡',
        '🤬',
        '🤯'
      ]
    },
    {
      name: 'Animals',
      emojis: [
        '🐶',
        '🐱',
        '🐭',
        '🐹',
        '🐰',
        '🦊',
        '🐻',
        '🐼',
        '🐨',
        '🐯',
        '🦁',
        '🐮',
        '🐷',
        '🐸',
        '🐵',
        '🙈',
        '🙉',
        '🙊',
        '🐒',
        '🦆'
      ]
    },
    {
      name: 'Food',
      emojis: [
        '🍎',
        '🍐',
        '🍊',
        '🍋',
        '🍌',
        '🍉',
        '🍇',
        '🍓',
        '🍈',
        '🍒',
        '🍑',
        '🥭',
        '🍍',
        '🥥',
        '🥝',
        '🍅',
        '🍆',
        '🥑',
        '🥦',
        '🥬'
      ]
    },
    {
      name: 'Objects',
      emojis: [
        '❤️',
        '🧡',
        '💛',
        '💚',
        '💙',
        '💜',
        '🖤',
        '💔',
        '💕',
        '💞',
        '💓',
        '💗',
        '💖',
        '💘',
        '💝',
        '💟',
        '🌟',
        '⭐',
        '🔥',
        '💯'
      ]
    }
  ]

  const [activeCategory, setActiveCategory] = useState(0)
  const [filteredEmojis, setFilteredEmojis] = useState<string[]>(emojiCategories[0].emojis)

  // Filter emojis based on search term
  useEffect(() => {
    if (searchTerm) {
      // Flatten all emojis and filter
      const allEmojis = emojiCategories.flatMap((category) => category.emojis)
      setFilteredEmojis(allEmojis)
    } else {
      setFilteredEmojis(emojiCategories[activeCategory].emojis)
    }
  }, [searchTerm, activeCategory])

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

  const handleCategoryChange = (index: number) => {
    setActiveCategory(index)
    setSearchTerm('')
    setFilteredEmojis(emojiCategories[index].emojis)
  }

  return (
    <div
      ref={pickerRef}
      className='absolute bottom-16 z-50 bg-white rounded-lg shadow-lg border border-gray-200 w-72'
      onClick={(e) => e.stopPropagation()}
    >
      <div className='p-2 border-b'>
        <input
          type='text'
          placeholder='Search emojis...'
          className='w-full p-2 text-sm border rounded-md'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className='p-2 border-b'>
        <div className='flex space-x-1 overflow-x-auto'>
          {emojiCategories.map((category, index) => (
            <Button
              key={category.name}
              color={activeCategory === index ? 'blue' : 'light'}
              size='xs'
              onClick={() => handleCategoryChange(index)}
              className='whitespace-nowrap'
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      <div className='p-2 max-h-60 overflow-y-auto'>
        <div className='grid grid-cols-8 gap-1'>
          {filteredEmojis.map((emoji, index) => (
            <button
              key={index}
              className='w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded text-lg'
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
