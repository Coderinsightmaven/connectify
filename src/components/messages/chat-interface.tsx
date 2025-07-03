"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Icons } from "@/components/ui/icons"
import { cn } from "@/lib/utils"
import { TimeAgo } from "@/components/ui/time"

import { PLACEHOLDER_AVATAR } from "@/lib/placeholders"
interface Message {
  id: string
  senderId: string
  content: string
  timestamp: Date
  type: "text" | "image"
}

interface ChatUser {
  id: string
  name: string
  username: string
  avatar: string
  isOnline: boolean
}

// Mock data for selected conversation
const mockUsers: Record<string, ChatUser> = {
  "1": {
    id: "1",
    name: "Sarah Chen",
    username: "sarahc",
    avatar: PLACEHOLDER_AVATAR,
    isOnline: true
  }
}

const mockMessages: Record<string, Message[]> = {
  "1": [
    {
      id: "1",
      senderId: "1",
      content: "Hey! How's the new project going?",
      timestamp: new Date(Date.now() - 35 * 60 * 1000),
      type: "text"
    },
    {
      id: "2", 
      senderId: "current-user",
      content: "It's going really well! We just finished the main features and are now working on the UI polish.",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      type: "text"
    },
    {
      id: "3",
      senderId: "1", 
      content: "That's awesome! I'd love to see it when you're ready to share.",
      timestamp: new Date(Date.now() - 25 * 60 * 1000),
      type: "text"
    },
    {
      id: "4",
      senderId: "current-user",
      content: "Definitely! I'll send you a preview link once we deploy the staging version.",
      timestamp: new Date(Date.now() - 20 * 60 * 1000),
      type: "text"
    },
    {
      id: "5",
      senderId: "1",
      content: "Perfect! Looking forward to it 🚀",
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      type: "text"
    }
  ]
}

interface ChatInterfaceProps {
  conversationId: string | null
}

export function ChatInterface({ conversationId }: ChatInterfaceProps) {
  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>(
    conversationId ? mockMessages[conversationId] || [] : []
  )

  const user = conversationId ? mockUsers[conversationId] : null

  const handleSendMessage = () => {
    if (!newMessage.trim() || !conversationId) return

    const message: Message = {
      id: Date.now().toString(),
      senderId: "current-user",
      content: newMessage.trim(),
      timestamp: new Date(),
      type: "text"
    }

    setMessages(prev => [...prev, message])
    setNewMessage("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!conversationId) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-muted-foreground">
          <Icons.messageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium mb-2">Select a conversation</p>
          <p className="text-sm">Choose a conversation from the list to start messaging</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-muted-foreground">
          <p>Conversation not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>
                {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {user.isOnline && (
              <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-background"></div>
            )}
          </div>
          <div>
            <h3 className="font-medium">{user.name}</h3>
            <p className="text-sm text-muted-foreground">
              {user.isOnline ? "Active now" : `@${user.username}`}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon">
            <Icons.user className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Icons.moreHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isCurrentUser = message.senderId === "current-user"
          return (
            <div
              key={message.id}
              className={cn(
                "flex",
                isCurrentUser ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[70%] rounded-lg px-3 py-2",
                  isCurrentUser
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                <p className="text-sm">{message.content}</p>
                <TimeAgo
                  date={message.timestamp}
                  className={cn(
                    "text-xs mt-1",
                    isCurrentUser
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  )}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pr-12"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
            >
              <Icons.user className="h-4 w-4" />
            </Button>
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            size="icon"
          >
            <Icons.user className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
} 