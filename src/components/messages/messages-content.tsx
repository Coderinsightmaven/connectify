"use client"

import { useState } from "react"
import { ConversationList } from "./conversation-list"
import { ChatInterface } from "./chat-interface"

export interface Conversation {
  id: string
  name: string
  username: string
  avatar: string
  lastMessage: string
  timestamp: Date
  unreadCount: number
  isOnline: boolean
}

export function MessagesContent() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)

  return (
    <div className="flex h-full border rounded-lg overflow-hidden">
      <div className="w-80 border-r">
        <ConversationList
          selectedConversation={selectedConversation}
          onSelectConversation={setSelectedConversation}
        />
      </div>
      <div className="flex-1">
        <ChatInterface conversationId={selectedConversation} />
      </div>
    </div>
  )
} 