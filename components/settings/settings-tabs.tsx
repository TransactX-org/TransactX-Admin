"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileSettings } from "./profile-settings"
import { SecuritySettings } from "./security-settings"
import { NotificationSettings } from "./notification-settings"
import { AppearanceSettings } from "./appearance-settings"

export function SettingsTabs() {
  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
        <TabsTrigger value="profile" className="text-xs sm:text-sm py-2 sm:py-3">Profile</TabsTrigger>
        <TabsTrigger value="security" className="text-xs sm:text-sm py-2 sm:py-3">Security</TabsTrigger>
        <TabsTrigger value="notifications" className="text-xs sm:text-sm py-2 sm:py-3">Notifications</TabsTrigger>
        <TabsTrigger value="appearance" className="text-xs sm:text-sm py-2 sm:py-3">Appearance</TabsTrigger>
      </TabsList>

      <TabsContent value="profile" className="mt-4 sm:mt-6">
        <ProfileSettings />
      </TabsContent>

      <TabsContent value="security" className="mt-4 sm:mt-6">
        <SecuritySettings />
      </TabsContent>

      <TabsContent value="notifications" className="mt-4 sm:mt-6">
        <NotificationSettings />
      </TabsContent>

      <TabsContent value="appearance" className="mt-4 sm:mt-6">
        <AppearanceSettings />
      </TabsContent>
    </Tabs>
  )
}
