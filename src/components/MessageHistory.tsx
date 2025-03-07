import React from 'react'
import MessageCard from './MessageCard'

interface Message {
  id?: string
  origin: 'human' | 'ai'
  content: string
  timestamp: string
}

interface Props {
  messages: Message[]
}

const MessageHistory = ({ messages }: Props) => {
  const sortedMessages = [...messages].sort(
    (a, b) =>
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  )

  return (
    <div className="space-y-4">
      {sortedMessages.map((msg, index) => (
        <MessageCard key={msg.id || index} message={msg} />
      ))}
    </div>
  )
}

export default MessageHistory
