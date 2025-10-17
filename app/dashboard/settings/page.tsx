import { SettingsTabs } from "@/components/settings/settings-tabs"

export default function SettingsPage() {
  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in p-4 sm:p-6">
      <div>
        <h1 className="text-xl sm:text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1 text-xs sm:text-base">Manage your account and application preferences</p>
      </div>

      <SettingsTabs />
    </div>
  )
}
