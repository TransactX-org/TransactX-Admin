"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileSettings } from "./profile-settings"
import { SecuritySettings } from "./security-settings"
import { NotificationSettings } from "./notification-settings"
import { AppearanceSettings } from "./appearance-settings"

export function SettingsTabs() {
  return (
    <Tabs defaultValue="profile" className="w-full">
      <div className="flex sm:justify-center mb-6 overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
        <TabsList className="inline-flex w-max sm:w-auto p-1 bg-muted/50 backdrop-blur-sm rounded-2xl h-auto">
          <TabsTrigger
            value="profile"
            className="text-[10px] sm:text-xs font-black uppercase tracking-widest px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-300 flex-shrink-0"
          >
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="text-[10px] sm:text-xs font-black uppercase tracking-widest px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-300 flex-shrink-0"
          >
            Security
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="text-[10px] sm:text-xs font-black uppercase tracking-widest px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-300 flex-shrink-0"
          >
            Notifications
          </TabsTrigger>
          <TabsTrigger
            value="appearance"
            className="text-[10px] sm:text-xs font-black uppercase tracking-widest px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-300 flex-shrink-0"
          >
            Appearance
          </TabsTrigger>
        </TabsList>
      </div>

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
