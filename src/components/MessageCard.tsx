import React from 'react'
import { User, Cpu } from 'lucide-react'

interface Message {
  id?: string
  origin: 'human' | 'ai'
  content: string
  timestamp: string
}

interface Props {
  message: Message
}

const MessageCard = ({ message }: Props) => {
  const isHuman = message.origin === 'human'
  const containerClasses = isHuman ? 'justify-end' : 'justify-start'
  const bubbleClasses = isHuman ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800'
  const icon = isHuman ? <User className="w-6 h-6" /> : <Cpu className="w-6 h-6" />

  return (
    <div className={`flex ${containerClasses} mb-2`}>
      {!isHuman && <div className="mr-2">{icon}</div>}
      <div className={`p-3 rounded-xl max-w-[70%] ${bubbleClasses}`}>
        <p className="text-sm">{message.content}</p>
        <p className="text-xs mt-1 text-right opacity-60">{new Date(message.timestamp).toLocaleTimeString()}</p>
      </div>
      {isHuman && <div className="ml-2">{icon}</div>}
    </div>
  )
}

export default MessageCard