"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/ui/icons"
import { cn } from "@/lib/utils"
import { TimeAgo } from "@/components/ui/time"

import { PLACEHOLDER_AVATAR } from "@/lib/placeholders"
interface Notification {
  id: string
  type: "like" | "comment" | "follow" | "mention" | "share"
  user: {
    name: string
    username: string
    avatar: string
  }
  content?: string
  postContent?: string
  timestamp: Date
  isRead: boolean
}

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "like",
    user: {
      name: "Sarah Chen",
      username: "sarahc",
      avatar: PLACEHOLDER_AVATAR
    },
    postContent: "Just shipped a new feature! The responsive design looks amazing...",
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    isRead: false
  },
  {
    id: "2",
    type: "follow",
    user: {
      name: "Alex Rivera", 
      username: "alexr",
      avatar: PLACEHOLDER_AVATAR
    },
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isRead: false
  },
  {
    id: "3",
    type: "comment",
    user: {
      name: "Emily Johnson",
      username: "emilyj", 
      avatar: PLACEHOLDER_AVATAR
    },
    content: "This looks amazing! Great work on the design.",
    postContent: "Working on something exciting. Can't wait to share it...",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    isRead: true
  },
  {
    id: "4",
    type: "mention",
    user: {
      name: "Michael Brown",
      username: "mikeb",
      avatar: PLACEHOLDER_AVATAR
    },
    content: "Hey @johndoe, check out this new framework!",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    isRead: true
  },
  {
    id: "5",
    type: "share",
    user: {
      name: "Lisa Wang",
      username: "lisaw",
      avatar: PLACEHOLDER_AVATAR
    },
    postContent: "Beautiful sunset from my office window today...",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    isRead: true
  }
]

const getNotificationIcon = (type: Notification["type"]) => {
  switch (type) {
    case "like":
      return <Icons.heart className="h-4 w-4 text-red-500" />
    case "comment":
      return <Icons.messageCircle className="h-4 w-4 text-blue-500" />
    case "follow":
      return <Icons.user className="h-4 w-4 text-green-500" />
    case "mention":
      return <Icons.user className="h-4 w-4 text-purple-500" />
    case "share":
      return <Icons.share className="h-4 w-4 text-orange-500" />
  }
}

const getNotificationText = (notification: Notification) => {
  switch (notification.type) {
    case "like":
      return "liked your post"
    case "comment":
      return "commented on your post"
    case "follow":
      return "started following you"
    case "mention":
      return "mentioned you in a post"
    case "share":
      return "shared your post"
  }
}

export function NotificationsContent() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [filter, setFilter] = useState<"all" | "unread">("all")

  const filteredNotifications = notifications.filter(notification => 
    filter === "all" || !notification.isRead
  )

  const unreadCount = notifications.filter(n => !n.isRead).length

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    )
  }

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <Tabs value={filter} onValueChange={(value) => setFilter(value as "all" | "unread")}>
          <TabsList>
            <TabsTrigger value="all">
              All
            </TabsTrigger>
            <TabsTrigger value="unread" className="relative">
              Unread
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            Mark all as read
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-2">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <Icons.bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-lg font-medium text-muted-foreground">
              {filter === "unread" ? "No unread notifications" : "No notifications"}
            </p>
            <p className="text-sm text-muted-foreground">
              {filter === "unread" 
                ? "You're all caught up!" 
                : "We'll notify you when something happens"
              }
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={cn(
                "flex items-start space-x-3 p-4 rounded-lg border transition-colors hover:bg-muted/50 cursor-pointer",
                !notification.isRead && "bg-primary/5 border-primary/20"
              )}
              onClick={() => markAsRead(notification.id)}
            >
              <Avatar className="h-10 w-10 flex-shrink-0">
                <AvatarImage src={notification.user.avatar} alt={notification.user.name} />
                <AvatarFallback>
                  {notification.user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2 mb-1">
                    {getNotificationIcon(notification.type)}
                    <p className="text-sm">
                      <span className="font-medium">{notification.user.name}</span>
                      {' '}
                      <span className="text-muted-foreground">
                        {getNotificationText(notification)}
                      </span>
                    </p>
                    {!notification.isRead && (
                      <div className="h-2 w-2 bg-primary rounded-full flex-shrink-0"></div>
                    )}
                  </div>
                  <TimeAgo 
                    date={notification.timestamp}
                    className="text-xs text-muted-foreground flex-shrink-0"
                  />
                </div>

                {notification.content && (
                  <p className="text-sm text-muted-foreground mb-2">
                    "{notification.content}"
                  </p>
                )}

                {notification.postContent && (
                  <div className="text-sm text-muted-foreground bg-muted p-2 rounded border-l-2 border-muted-foreground/20">
                    {notification.postContent}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
} 