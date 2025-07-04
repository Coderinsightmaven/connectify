"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/ui/icons"
import { cn } from "@/lib/utils"

interface Notification {
  id: string
  type: 'like' | 'comment' | 'follow' | 'mention' | 'share'
  actor: {
    id: string
    name: string
    username?: string
    avatar?: string
  }
  content?: string
  post?: {
    id: string
    content: string
  }
  isRead: boolean
  createdAt: string
}

// Simple time formatting function
const formatTimeAgo = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString()
}

export function NotificationsContent() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  // Load notifications on mount
  useEffect(() => {
    const loadNotifications = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/notifications')
        const data = await response.json()
        
        if (data.success) {
          setNotifications(data.data.notifications)
        } else {
          console.error('Failed to load notifications:', data.error)
        }
      } catch (error) {
        console.error('Error loading notifications:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadNotifications()
  }, [])

  // Filter notifications by type
  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === "all") return true
    if (activeTab === "mentions") return notification.type === "mention"
    if (activeTab === "likes") return notification.type === "like"
    if (activeTab === "follows") return notification.type === "follow"
    return true
  })

  // Group notifications by read status
  const unreadNotifications = filteredNotifications.filter(n => !n.isRead)
  const readNotifications = filteredNotifications.filter(n => n.isRead)

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}/read`, { method: 'POST' })
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, isRead: true } : n
        )
      )
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await fetch('/api/notifications/mark-all-read', { method: 'POST' })
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Icons.heart className="h-4 w-4 text-red-500" />
      case 'comment':
        return <Icons.messageCircle className="h-4 w-4 text-blue-500" />
      case 'follow':
        return <Icons.user className="h-4 w-4 text-green-500" />
      case 'mention':
        return <Icons.mail className="h-4 w-4 text-purple-500" />
      case 'share':
        return <Icons.share className="h-4 w-4 text-orange-500" />
      default:
        return <Icons.bell className="h-4 w-4 text-gray-500" />
    }
  }

  const getNotificationText = (notification: Notification) => {
    switch (notification.type) {
      case 'like':
        return `${notification.actor.name} liked your post`
      case 'comment':
        return `${notification.actor.name} commented on your post`
      case 'follow':
        return `${notification.actor.name} started following you`
      case 'mention':
        return `${notification.actor.name} mentioned you in a post`
      case 'share':
        return `${notification.actor.name} shared your post`
      default:
        return `${notification.actor.name} interacted with your content`
    }
  }

  const NotificationItem = ({ notification }: { notification: Notification }) => (
    <Card 
      className={cn(
        "transition-colors hover:bg-muted/50 cursor-pointer",
        !notification.isRead && "border-primary/20 bg-primary/5"
      )}
      onClick={() => !notification.isRead && markAsRead(notification.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={notification.actor.avatar} alt={notification.actor.name} />
            <AvatarFallback>
              {notification.actor.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              {getNotificationIcon(notification.type)}
              <span className="text-sm font-medium">
                {getNotificationText(notification)}
              </span>
              {!notification.isRead && (
                <div className="h-2 w-2 bg-primary rounded-full"></div>
              )}
            </div>
            
            {notification.content && (
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                "{notification.content}"
              </p>
            )}
            
            {notification.post && (
              <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                {notification.post.content}
              </p>
            )}
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {formatTimeAgo(new Date(notification.createdAt))}
              </span>
              
              {!notification.isRead && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={(e) => {
                    e.stopPropagation()
                    markAsRead(notification.id)
                  }}
                  className="text-xs"
                >
                  Mark as read
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">
            Stay updated with your latest interactions
          </p>
        </div>
        
        {unreadNotifications.length > 0 && (
          <Button variant="outline" onClick={markAllAsRead}>
            Mark all as read ({unreadNotifications.length})
          </Button>
        )}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">
            All {notifications.length > 0 && `(${notifications.length})`}
          </TabsTrigger>
          <TabsTrigger value="mentions">
            Mentions {notifications.filter(n => n.type === 'mention').length > 0 && 
              `(${notifications.filter(n => n.type === 'mention').length})`}
          </TabsTrigger>
          <TabsTrigger value="likes">
            Likes {notifications.filter(n => n.type === 'like').length > 0 && 
              `(${notifications.filter(n => n.type === 'like').length})`}
          </TabsTrigger>
          <TabsTrigger value="follows">
            Follows {notifications.filter(n => n.type === 'follow').length > 0 && 
              `(${notifications.filter(n => n.type === 'follow').length})`}
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4 mt-6">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Icons.bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No notifications yet</p>
              <p className="text-sm">
                {activeTab === "all" 
                  ? "You'll see notifications here when people interact with your content"
                  : `No ${activeTab} notifications to show`
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Unread Notifications */}
              {unreadNotifications.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    New ({unreadNotifications.length})
                  </h3>
                  {unreadNotifications.map((notification) => (
                    <NotificationItem key={notification.id} notification={notification} />
                  ))}
                </div>
              )}

              {/* Read Notifications */}
              {readNotifications.length > 0 && (
                <div className="space-y-4">
                  {unreadNotifications.length > 0 && (
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Earlier
                    </h3>
                  )}
                  {readNotifications.map((notification) => (
                    <NotificationItem key={notification.id} notification={notification} />
                  ))}
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
} 