"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useTheme } from "next-themes"
import { useSidebar } from "@/contexts/sidebar-context"
import { Sun, Moon, Monitor } from "lucide-react"

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme()
  const { isCollapsed, setCollapsed } = useSidebar()

  // Ensure we have a valid theme value, defaulting to 'light'
  const currentTheme = theme || 'light'

  return (
    <div className="space-y-6">
      <Card className="border-border/40 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-black uppercase tracking-widest text-muted-foreground/70">Theme</CardTitle>
          <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">Choose your preferred theme</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <RadioGroup value={currentTheme} onValueChange={setTheme} className="grid grid-cols-3 gap-3">
            <div>
              <RadioGroupItem value="light" id="light" className="peer sr-only" />
              <Label
                htmlFor="light"
                className="flex flex-col items-center justify-between rounded-2xl border-border/40 bg-muted/20 p-4 hover:bg-muted/30 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer sleek-transition h-full"
              >
                <div className="p-2 rounded-xl bg-background/50 mb-3 shadow-sm">
                  <Sun className="h-6 w-6 text-amber-500" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">Light</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
              <Label
                htmlFor="dark"
                className="flex flex-col items-center justify-between rounded-2xl border-border/40 bg-muted/20 p-4 hover:bg-muted/30 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer sleek-transition h-full"
              >
                <div className="p-2 rounded-xl bg-background/50 mb-3 shadow-sm">
                  <Moon className="h-6 w-6 text-primary" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">Dark</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="system" id="system" className="peer sr-only" />
              <Label
                htmlFor="system"
                className="flex flex-col items-center justify-between rounded-2xl border-border/40 bg-muted/20 p-4 hover:bg-muted/30 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer sleek-transition h-full"
              >
                <div className="p-2 rounded-xl bg-background/50 mb-3 shadow-sm">
                  <Monitor className="h-6 w-6 text-muted-foreground" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">System</span>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card className="border-border/40 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-black uppercase tracking-widest text-muted-foreground/70">Display</CardTitle>
          <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">Customize how content is displayed</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
          <div className="p-4 rounded-2xl bg-muted/20 border border-border/10">
            <Label className="font-black text-xs uppercase tracking-tight block mb-4">Sidebar Layout</Label>
            <RadioGroup value={isCollapsed ? "collapsed" : "expanded"} onValueChange={(value) => setCollapsed(value === "collapsed")} className="flex gap-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="expanded" id="expanded" className="data-[state=checked]:bg-primary" />
                <Label htmlFor="expanded" className="text-[10px] font-bold uppercase tracking-widest cursor-pointer">Expanded</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="collapsed" id="collapsed" className="data-[state=checked]:bg-primary" />
                <Label htmlFor="collapsed" className="text-[10px] font-bold uppercase tracking-widest cursor-pointer">Collapsed</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
