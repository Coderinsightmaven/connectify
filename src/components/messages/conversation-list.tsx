"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/ui/icons"
import { cn } from "@/lib/utils"
import { TimeAgo } from "@/components/ui/time"
import { type Conversation } from "./messages-content"

import { PLACEHOLDER_AVATAR } from "@/lib/placeholders"
// Mock conversations data
const mockConversations: Conversation[] = [
  {
    id: "1",
    name: "Sarah Chen",
    username: "sarahc",
    avatar: PLACEHOLDER_AVATAR,
    lastMessage: "Hey! How's the new project going?",
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    unreadCount: 2,
    isOnline: true
  },
  {
    id: "2",
    name: "Alex Rivera",
    username: "alexr",
    avatar: PLACEHOLDER_AVATAR,
    lastMessage: "Thanks for the help earlier!",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    unreadCount: 0,
    isOnline: false
  },
  {
    id: "3",
    name: "Emily Johnson",
    username: "emilyj",
    avatar: PLACEHOLDER_AVATAR,
    lastMessage: "Can we schedule a meeting for tomorrow?",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    unreadCount: 1,
    isOnline: true
  },
  {
    id: "4",
    name: "Michael Brown",
    username: "mikeb",
    avatar: PLACEHOLDER_AVATAR,
    lastMessage: "The design looks great! 🎨",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    unreadCount: 0,
    isOnline: false
  },
  {
    id: "5",
    name: "Lisa Wang",
    username: "lisaw",
    avatar: PLACEHOLDER_AVATAR,
    lastMessage: "I'll send over the files in a bit",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    unreadCount: 0,
    isOnline: false
  }
]

interface ConversationListProps {
  selectedConversation: string | null
  onSelectConversation: (id: string) => void
}

export function ConversationList({ selectedConversation, onSelectConversation }: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [conversations, setConversations] = useState(mockConversations)

  const filteredConversations = conversations.filter(conversation =>
    conversation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conversation.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Messages</h2>
          <Button size="icon" variant="ghost">
            <Icons.user className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Icons.search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            {searchQuery ? "No conversations found" : "No messages yet"}
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {filteredConversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
                className={cn(
                  "w-full p-3 rounded-lg text-left hover:bg-muted/50 transition-colors",
                  selectedConversation === conversation.id && "bg-muted"
                )}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={conversation.avatar} alt={conversation.name} />
                      <AvatarFallback>
                        {conversation.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {conversation.isOnline && (
                      <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-background"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium truncate">{conversation.name}</h3>
                      <div className="flex items-center space-x-2">
                        {conversation.unreadCount > 0 && (
                          <Badge variant="default" className="text-xs">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                        <TimeAgo 
                          date={conversation.timestamp}
                          className="text-xs text-muted-foreground"
                        />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {conversation.lastMessage}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 