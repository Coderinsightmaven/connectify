"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AccountSettings } from "./account-settings"
import { NotificationSettings } from "./notification-settings"
import { PrivacySettings } from "./privacy-settings"
import { AppearanceSettings } from "./appearance-settings"

export function SettingsContent() {
  return (
    <Tabs defaultValue="account" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="privacy">Privacy</TabsTrigger>
        <TabsTrigger value="appearance">Appearance</TabsTrigger>
      </TabsList>
      
      <TabsContent value="account" className="space-y-6">
        <AccountSettings />
      </TabsContent>
      
      <TabsContent value="notifications" className="space-y-6">
        <NotificationSettings />
      </TabsContent>
      
      <TabsContent value="privacy" className="space-y-6">
        <PrivacySettings />
      </TabsContent>
      
      <TabsContent value="appearance" className="space-y-6">
        <AppearanceSettings />
      </TabsContent>
    </Tabs>
  )
} 