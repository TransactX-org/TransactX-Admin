"use client"

import { useState, useEffect, KeyboardEvent } from "react"
import { Bell, Search, PanelLeft, X } from "lucide-react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useSidebar } from "@/contexts/sidebar-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { MobileNav } from "./mobile-nav"
import { NotificationsSheet } from "./notifications-sheet"
import { useUnreadNotificationsCount, useNotifications, useMarkAllNotificationsAsRead, useMarkSingleNotificationAsRead } from "@/lib/api/hooks/use-notifications"
import { useLogout } from "@/lib/api/hooks/use-auth"
import { formatDistanceToNow } from "date-fns"

export function Header() {
  const router = useRouter()
  const { toggleSidebar } = useSidebar()
  const { data: unreadCountData } = useUnreadNotificationsCount()
  const { data: notificationsData } = useNotifications(1, 5)
  const markAllAsRead = useMarkAllNotificationsAsRead()
  const markAsRead = useMarkSingleNotificationAsRead()
  const logout = useLogout()

  const notificationCount = unreadCountData?.data?.count || 0
  const notifications = notificationsData?.data?.data || []

  // Get user from localStorage
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user")
      if (userStr) {
        try {
          setUser(JSON.parse(userStr))
        } catch {
          setUser({ name: "Admin User", email: "admin@transactx.com" })
        }
      } else {
        setUser({ name: "Admin User", email: "admin@transactx.com" })
      }
    }
  }, [])

  const userInitials = user?.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "AU"

  // Search functionality
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState("")

  // Sync local state with URL params
  useEffect(() => {
    setSearchQuery(searchParams.get("search") || "")
  }, [searchParams])

  const handleSearch = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()

      const term = searchQuery.trim()

      // If empty, removing search param
      if (!term) {
        if (pathname === "/dashboard/transactions" || pathname === "/dashboard/users") {
          router.push(pathname)
        }
        return
      }

      // Determine where to search
      if (pathname.includes("/dashboard/users")) {
        router.push(`/dashboard/users?search=${encodeURIComponent(term)}`)
      } else {
        // Default to transactions for all other pages (including dashboard home)
        router.push(`/dashboard/transactions?search=${encodeURIComponent(term)}`)
      }
    }
  }

  const clearSearch = () => {
    setSearchQuery("")
    if (pathname === "/dashboard/transactions" || pathname === "/dashboard/users") {
      router.push(pathname)
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <MobileNav />

          <div className="flex md:hidden items-center gap-2">
            <img src="/transactx.svg" alt="TransactX Logo" className="h-8 w-auto" />
          </div>

          {/* Sidebar Toggle - Desktop Only */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="hidden md:flex"
          >
            <PanelLeft className="h-5 w-5" />
          </Button>

          {/* Search */}
          <div className="hidden md:block max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search transactions, users..."
                className="pl-10 pr-8 border-border bg-muted/30 w-80 sleek-input sleek-focus"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3">
          {/* Notifications - Mobile Sheet */}
          <div className="md:hidden">
            <NotificationsSheet />
          </div>

          {/* Notifications - Desktop Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative hidden md:flex">
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]"
                  >
                    {notificationCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 border-border">
              <div className="flex items-center justify-between px-2 py-1.5">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                {notificationCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => markAllAsRead.mutate()}
                  >
                    Mark all as read
                  </Button>
                )}
              </div>
              <DropdownMenuSeparator />
              {notifications.length === 0 ? (
                <div className="px-2 py-4 text-center text-sm text-muted-foreground">No notifications</div>
              ) : (
                notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className="cursor-pointer"
                    onClick={() => !notification.read_at && markAsRead.mutate(notification.id)}
                  >
                    <div className="flex flex-col gap-1 w-full">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm font-medium ${notification.read_at ? "" : "font-semibold"}`}>
                          {notification.data?.title || notification.data?.message || "Notification"}
                        </p>
                        {!notification.read_at && (
                          <div className="h-2 w-2 rounded-full bg-primary mt-1 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-muted/50 transition-all duration-200">
                <Avatar className="h-10 w-10 border-2 border-border hover:border-tx-primary/50 transition-all duration-200">
                  <AvatarFallback className="tx-bg-primary text-white font-semibold">{userInitials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 border-border shadow-lg animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
            >
              <DropdownMenuLabel className="font-semibold">{user?.name || "Admin User"}</DropdownMenuLabel>
              <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">{user?.email || "admin@transactx.com"}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => router.push("/dashboard/settings")}>
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => router.push("/dashboard/settings")}>
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-destructive hover:bg-destructive/10 transition-colors" onClick={logout}>
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
