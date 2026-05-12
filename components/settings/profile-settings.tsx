"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Camera, Loader2 } from "lucide-react"
import { useCurrentUser, useUpdateProfile } from "@/lib/api/hooks/use-auth"

export function ProfileSettings() {
  const user = useCurrentUser()
  const { mutate: saveProfile, isPending } = useUpdateProfile()

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")

  useEffect(() => {
    if (!user) return
    const parts = (user.name ?? "").split(" ")
    setFirstName(user.first_name ?? parts[0] ?? "")
    setLastName(user.last_name ?? parts.slice(1).join(" ") ?? "")
    setEmail(user.email ?? "")
  }, [user])

  const initials = `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase() || "AU"

  const handleSave = () => {
    saveProfile({ first_name: firstName, last_name: lastName, email })
  }

  const handleCancel = () => {
    if (!user) return
    const parts = (user.name ?? "").split(" ")
    setFirstName(user.first_name ?? parts[0] ?? "")
    setLastName(user.last_name ?? parts.slice(1).join(" ") ?? "")
    setEmail(user.email ?? "")
  }

  return (
    <div className="space-y-6">
      <Card className="border-border/40 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-black uppercase tracking-widest text-muted-foreground/70">Profile Information</CardTitle>
          <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">Update your personal information and profile picture</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0 space-y-6">
          {/* Profile Picture */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-muted/20 border border-border/10">
            <div className="relative group">
              <Avatar className="h-24 w-24 ring-4 ring-primary/10 transition-all duration-300 group-hover:ring-primary/20">
                <AvatarFallback className="bg-primary text-white text-3xl font-black">{initials}</AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="flex-1 text-center sm:text-left space-y-3">
              <div className="space-y-1">
                <h4 className="font-black uppercase tracking-widest text-xs text-muted-foreground">Profile Picture</h4>
                <p className="text-[10px] font-bold text-muted-foreground/60">JPG, PNG or GIF. Max size 2MB.</p>
              </div>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                <Button variant="outline" size="sm" className="h-9 px-4 rounded-xl border-border/40 font-bold uppercase tracking-widest text-[10px]">
                  Change Photo
                </Button>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 ml-1">First Name</Label>
              <Input
                id="firstName"
                placeholder="John"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                className="h-11 rounded-xl bg-muted/10 border-border/40 focus:bg-background transition-all font-medium"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 ml-1">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                className="h-11 rounded-xl bg-muted/10 border-border/40 focus:bg-background transition-all font-medium"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 ml-1">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@transactx.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="h-11 rounded-xl bg-muted/10 border-border/40 focus:bg-background transition-all font-medium"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              onClick={handleSave}
              disabled={isPending}
              className="h-11 px-8 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20"
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Save Changes
            </Button>
            <Button
              variant="ghost"
              onClick={handleCancel}
              disabled={isPending}
              className="h-11 px-8 rounded-xl font-black uppercase tracking-widest text-xs text-muted-foreground underline-offset-4 hover:underline"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
