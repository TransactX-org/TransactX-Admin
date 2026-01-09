"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Shield, Smartphone } from "lucide-react"

export function SecuritySettings() {
  return (
    <div className="space-y-6">
      {/* Change Password */}
      <Card className="border-border/40 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-black uppercase tracking-widest text-muted-foreground/70">Change Password</CardTitle>
          <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">Update your password to keep your account secure</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 ml-1">Current Password</Label>
              <Input id="currentPassword" type="password" className="h-11 rounded-xl bg-muted/10 border-border/40 focus:bg-background transition-all font-medium" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 ml-1">New Password</Label>
              <Input id="newPassword" type="password" className="h-11 rounded-xl bg-muted/10 border-border/40 focus:bg-background transition-all font-medium" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="confirmPassword" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 ml-1">Confirm New Password</Label>
              <Input id="confirmPassword" type="password" className="h-11 rounded-xl bg-muted/10 border-border/40 focus:bg-background transition-all font-medium" />
            </div>
          </div>
          <Button className="h-11 px-8 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20 mt-2">
            Update Password
          </Button>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card className="border-border/40 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-black uppercase tracking-widest text-muted-foreground/70">Two-Factor Authentication</CardTitle>
          <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">Add an extra layer of security to your account</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0 space-y-3">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border/10 transition-colors hover:bg-muted/30">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <Smartphone className="h-5 w-5" />
              </div>
              <div>
                <p className="font-black text-xs uppercase tracking-tight">SMS Authentication</p>
                <p className="text-[10px] font-bold text-muted-foreground/60 uppercase">Receive codes via SMS</p>
              </div>
            </div>
            <Switch className="data-[state=checked]:bg-primary" />
          </div>
          <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border/10 transition-colors hover:bg-muted/30">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <p className="font-black text-xs uppercase tracking-tight">Authenticator App</p>
                <p className="text-[10px] font-bold text-muted-foreground/60 uppercase">Use an authenticator app</p>
              </div>
            </div>
            <Switch className="scale-90 data-[state=checked]:bg-primary" />
          </div>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card className="border-border/40 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-black uppercase tracking-widest text-muted-foreground/70">Active Sessions</CardTitle>
          <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">Manage your active sessions across devices</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0 space-y-3">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border/10">
            <div className="space-y-1">
              <p className="font-black text-xs uppercase tracking-tight">Windows PC - Chrome</p>
              <p className="text-[10px] font-bold text-muted-foreground/60 uppercase">Lagos, Nigeria • <span className="text-emerald-500">Active now</span></p>
            </div>
            <Button variant="ghost" size="sm" className="h-8 px-4 rounded-lg font-black uppercase tracking-widest text-[9px] text-rose-500 hover:text-rose-600 hover:bg-rose-50">
              Revoke
            </Button>
          </div>
          <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border/10 opacity-70">
            <div className="space-y-1">
              <p className="font-black text-xs uppercase tracking-tight">iPhone - Safari</p>
              <p className="text-[10px] font-bold text-muted-foreground/60 uppercase">Lagos, Nigeria • 2 hours ago</p>
            </div>
            <Button variant="ghost" size="sm" className="h-8 px-4 rounded-lg font-black uppercase tracking-widest text-[9px] text-rose-500 hover:text-rose-600 hover:bg-rose-50">
              Revoke
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
