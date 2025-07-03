"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useSettingsStore } from "@/stores"

export function PrivacySettings() {
  const { privacy, updatePrivacy } = useSettingsStore()

  const handleSave = () => {
    console.log("Privacy settings saved automatically via Zustand")
    // Settings are already persisted via Zustand persist middleware
  }

  return (
    <div className="space-y-6">
      {/* Account Privacy */}
      <Card>
        <CardHeader>
          <CardTitle>Account Privacy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-3">Profile Visibility</h4>
              <div className="space-y-2">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="profileVisibility"
                    value="public"
                    checked={privacy.profileVisibility === "public"}
                    onChange={(e) => updatePrivacy({ profileVisibility: e.target.value as "public" | "friends" | "private" })}
                    className="w-4 h-4 text-primary"
                  />
                  <div>
                    <span className="font-medium">Public</span>
                    <Badge variant="secondary" className="ml-2">Recommended</Badge>
                    <p className="text-sm text-muted-foreground">
                      Anyone can see your profile and posts
                    </p>
                  </div>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="profileVisibility"
                    value="friends"
                    checked={privacy.profileVisibility === "friends"}
                    onChange={(e) => updatePrivacy({ profileVisibility: e.target.value as "public" | "friends" | "private" })}
                    className="w-4 h-4 text-primary"
                  />
                  <div>
                    <span className="font-medium">Friends</span>
                    <p className="text-sm text-muted-foreground">
                      Only friends can see your posts
                    </p>
                  </div>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="profileVisibility"
                    value="private"
                    checked={privacy.profileVisibility === "private"}
                    onChange={(e) => updatePrivacy({ profileVisibility: e.target.value as "public" | "friends" | "private" })}
                    className="w-4 h-4 text-primary"
                  />
                  <div>
                    <span className="font-medium">Private</span>
                    <p className="text-sm text-muted-foreground">
                      Only followers can see your posts
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Show Online Status</h4>
                <p className="text-sm text-muted-foreground">
                  Let others see when you're online
                </p>
              </div>
              <Switch
                checked={privacy.showOnlineStatus}
                onCheckedChange={(checked) => updatePrivacy({ showOnlineStatus: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Show Last Seen</h4>
                <p className="text-sm text-muted-foreground">
                  Let others see when you were last active
                </p>
              </div>
              <Switch
                checked={privacy.showLastSeen}
                onCheckedChange={(checked) => updatePrivacy({ showLastSeen: checked })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Communication */}
      <Card>
        <CardHeader>
          <CardTitle>Communication</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-3">Who can message you</h4>
            <div className="space-y-2">
              {["everyone", "friends", "nobody"].map((option) => (
                <label key={option} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="messagePermissions"
                    value={option}
                    checked={privacy.messagePermissions === option}
                    onChange={(e) => updatePrivacy({ messagePermissions: e.target.value as typeof privacy.messagePermissions })}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="font-medium capitalize">{option}</span>
                </label>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data & Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Data & Analytics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Data Collection</h4>
              <p className="text-sm text-muted-foreground">
                Allow us to collect data to improve your experience
              </p>
            </div>
            <Switch
              checked={privacy.dataCollection}
              onCheckedChange={(checked) => updatePrivacy({ dataCollection: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Analytics</h4>
              <p className="text-sm text-muted-foreground">
                Help us understand how you use our platform
              </p>
            </div>
            <Switch
              checked={privacy.analytics}
              onCheckedChange={(checked) => updatePrivacy({ analytics: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Advertisements</h4>
              <p className="text-sm text-muted-foreground">
                Show personalized advertisements
              </p>
            </div>
            <Switch
              checked={privacy.advertisements}
              onCheckedChange={(checked) => updatePrivacy({ advertisements: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Download Your Data</h4>
              <p className="text-sm text-muted-foreground">
                Get a copy of all your data
              </p>
            </div>
            <Button variant="outline">
              Download
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Blocked Users</h4>
              <p className="text-sm text-muted-foreground">
                Manage users you've blocked
              </p>
            </div>
            <Button variant="outline">
              Manage
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg border-destructive/50">
            <div>
              <h4 className="font-medium text-destructive">Clear All Data</h4>
              <p className="text-sm text-muted-foreground">
                Permanently delete all your posts and data
              </p>
            </div>
            <Button variant="destructive">
              Clear Data
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