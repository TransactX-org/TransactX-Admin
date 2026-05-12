"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Shield, Smartphone, Loader2 } from "lucide-react"
import { useChangePassword } from "@/lib/api/hooks/use-auth"

export function SecuritySettings() {
  const { mutate: changePassword, isPending } = useChangePassword()

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [mismatch, setMismatch] = useState(false)

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      setMismatch(true)
      return
    }
    setMismatch(false)
    changePassword(
      { current_password: currentPassword, password: newPassword, password_confirmation: confirmPassword },
      {
        onSuccess: () => {
          setCurrentPassword("")
          setNewPassword("")
          setConfirmPassword("")
        },
      }
    )
  }

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
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                className="h-11 rounded-xl bg-muted/10 border-border/40 focus:bg-background transition-all font-medium"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 ml-1">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={e => { setNewPassword(e.target.value); setMismatch(false) }}
                className="h-11 rounded-xl bg-muted/10 border-border/40 focus:bg-background transition-all font-medium"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="confirmPassword" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 ml-1">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={e => { setConfirmPassword(e.target.value); setMismatch(false) }}
                className={`h-11 rounded-xl bg-muted/10 border-border/40 focus:bg-background transition-all font-medium ${mismatch ? "border-rose-500" : ""}`}
              />
              {mismatch && <p className="text-[10px] font-bold text-rose-500 ml-1">Passwords do not match</p>}
            </div>
          </div>
          <Button
            onClick={handleChangePassword}
            disabled={isPending || !currentPassword || !newPassword || !confirmPassword}
            className="h-11 px-8 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20 mt-2"
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
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
    </div>
  )
}
