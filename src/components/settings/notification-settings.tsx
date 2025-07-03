"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { useSettingsStore } from "@/stores"

export function NotificationSettings() {
  const { notifications, updateNotifications } = useSettingsStore()

  const handleSave = () => {
    console.log("Notification settings saved automatically via Zustand")
    // Settings are already persisted via Zustand persist middleware
  }

  return (
    <div className="space-y-6">
      {/* Email Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Likes</h4>
              <p className="text-sm text-muted-foreground">
                When someone likes your posts
              </p>
            </div>
            <Switch
              checked={notifications.likesEnabled}
              onCheckedChange={(checked) => updateNotifications({ likesEnabled: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Comments</h4>
              <p className="text-sm text-muted-foreground">
                When someone comments on your posts
              </p>
            </div>
            <Switch
              checked={notifications.commentsEnabled}
              onCheckedChange={(checked) => updateNotifications({ commentsEnabled: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">New Followers</h4>
              <p className="text-sm text-muted-foreground">
                When someone follows you
              </p>
            </div>
            <Switch
              checked={notifications.followsEnabled}
              onCheckedChange={(checked) => updateNotifications({ followsEnabled: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Direct Messages</h4>
              <p className="text-sm text-muted-foreground">
                When someone sends you a direct message
              </p>
            </div>
            <Switch
              checked={notifications.messagesEnabled}
              onCheckedChange={(checked) => updateNotifications({ messagesEnabled: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Marketing & Updates</h4>
              <p className="text-sm text-muted-foreground">
                Platform updates and feature announcements
              </p>
            </div>
            <Switch
              checked={notifications.marketingEnabled}
              onCheckedChange={(checked) => updateNotifications({ marketingEnabled: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Push Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Push Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Enable Push Notifications</h4>
              <p className="text-sm text-muted-foreground">
                Receive notifications on your device
              </p>
            </div>
            <Switch
              checked={notifications.pushEnabled}
              onCheckedChange={(checked) => updateNotifications({ pushEnabled: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Email Notifications</h4>
              <p className="text-sm text-muted-foreground">
                Receive notifications via email
              </p>
            </div>
            <Switch
              checked={notifications.emailEnabled}
              onCheckedChange={(checked) => updateNotifications({ emailEnabled: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Frequency */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Notification History</h4>
              <p className="text-sm text-muted-foreground">
                View your notification history
              </p>
            </div>
            <Button variant="outline">
              View History
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Quiet Hours</h4>
              <p className="text-sm text-muted-foreground">
                Set times when notifications are muted
              </p>
            </div>
            <Button variant="outline">
              Configure
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Test Notifications</h4>
              <p className="text-sm text-muted-foreground">
                Send a test notification to verify settings
              </p>
            </div>
            <Button variant="outline">
              Send Test
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave}>
          Settings Saved Automatically
        </Button>
      </div>
    </div>
  )
} 