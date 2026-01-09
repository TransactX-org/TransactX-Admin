"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function NotificationSettings() {
  return (
    <div className="space-y-6">
      <Card className="border-border/40 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-black uppercase tracking-widest text-muted-foreground/70">Email Notifications</CardTitle>
          <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">Manage your email notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0 space-y-3">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border/10 transition-colors hover:bg-muted/30">
            <div className="space-y-1">
              <Label className="font-black text-xs uppercase tracking-tight">Transaction Alerts</Label>
              <p className="text-[10px] font-bold text-muted-foreground/60 uppercase">Get notified about new transactions</p>
            </div>
            <Switch defaultChecked className="data-[state=checked]:bg-primary" />
          </div>
          <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border/10 transition-colors hover:bg-muted/30">
            <div className="space-y-1">
              <Label className="font-black text-xs uppercase tracking-tight">User Activity</Label>
              <p className="text-[10px] font-bold text-muted-foreground/60 uppercase">Notifications about user registrations and activity</p>
            </div>
            <Switch defaultChecked className="data-[state=checked]:bg-primary" />
          </div>
          <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border/10 transition-colors hover:bg-muted/30">
            <div className="space-y-1">
              <Label className="font-black text-xs uppercase tracking-tight">System Updates</Label>
              <p className="text-[10px] font-bold text-muted-foreground/60 uppercase">Important system updates and maintenance</p>
            </div>
            <Switch defaultChecked className="data-[state=checked]:bg-primary" />
          </div>
          <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border/10 transition-colors hover:bg-muted/30 opacity-70">
            <div className="space-y-1">
              <Label className="font-black text-xs uppercase tracking-tight">Weekly Reports</Label>
              <p className="text-[10px] font-bold text-muted-foreground/60 uppercase">Receive weekly summary reports</p>
            </div>
            <Switch className="data-[state=checked]:bg-primary" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/40 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-black uppercase tracking-widest text-muted-foreground/70">Push Notifications</CardTitle>
          <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">Manage your push notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0 space-y-3">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border/10 transition-colors hover:bg-muted/30">
            <div className="space-y-1">
              <Label className="font-black text-xs uppercase tracking-tight">Desktop Notifications</Label>
              <p className="text-[10px] font-bold text-muted-foreground/60 uppercase">Show notifications on desktop</p>
            </div>
            <Switch defaultChecked className="data-[state=checked]:bg-primary" />
          </div>
          <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border/10 transition-colors hover:bg-muted/30">
            <div className="space-y-1">
              <Label className="font-black text-xs uppercase tracking-tight">Mobile Notifications</Label>
              <p className="text-[10px] font-bold text-muted-foreground/60 uppercase">Show notifications on mobile devices</p>
            </div>
            <Switch defaultChecked className="data-[state=checked]:bg-primary" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
