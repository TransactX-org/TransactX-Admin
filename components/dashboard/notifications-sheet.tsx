"use client"

import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Bell } from "lucide-react"
import { useMarkAllNotificationsAsRead, useMarkSingleNotificationAsRead, useNotifications, useUnreadNotificationsCount } from "@/lib/api/hooks/use-notifications"
import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"

import { NotificationDetailsModal } from "./notification-details-modal"
import { useState } from "react"

interface NotificationsSheetProps {
    className?: string
    trigger?: React.ReactNode
}

export function NotificationsSheet({
    className,
    trigger
}: NotificationsSheetProps) {
    const { data: notificationsData, isLoading } = useNotifications(1, 10)
    const { data: unreadCountData } = useUnreadNotificationsCount()
    const markAllAsRead = useMarkAllNotificationsAsRead()
    const markAsRead = useMarkSingleNotificationAsRead()

    const [selectedNotification, setSelectedNotification] = useState<any>(null)
    const [notificationModalOpen, setNotificationModalOpen] = useState(false)

    const notifications = notificationsData?.data?.data || []
    const notificationCount = unreadCountData?.data?.count || 0

    return (
        <Drawer>
            <DrawerTrigger asChild>
                {trigger || (
                    <Button variant="ghost" size="icon" className="relative md:hidden">
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
                )}
            </DrawerTrigger>
            <DrawerContent className={className}>
                <div className="mx-auto w-full max-w-sm max-h-[85vh] flex flex-col">
                    <DrawerHeader className="text-left">
                        <div className="flex items-center justify-between">
                            <DrawerTitle>Notifications</DrawerTitle>
                            {notificationCount > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 text-xs text-primary"
                                    onClick={() => markAllAsRead.mutate()}
                                >
                                    Mark all as read
                                </Button>
                            )}
                        </div>
                        <DrawerDescription>
                            Stay updated with recent alerts and activities.
                        </DrawerDescription>
                    </DrawerHeader>

                    <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
                        {isLoading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="flex gap-4 p-4 border-b border-border/40 animate-pulse">
                                    <div className="h-2 w-2 rounded-full bg-muted" />
                                    <div className="space-y-2 flex-1">
                                        <div className="h-4 w-3/4 rounded bg-muted" />
                                        <div className="h-3 w-1/2 rounded bg-muted" />
                                    </div>
                                </div>
                            ))
                        ) : notifications.length === 0 ? (
                            <div className="py-12 text-center text-muted-foreground text-sm">
                                No new notifications
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`flex flex-col gap-1 p-3 rounded-xl transition-colors cursor-pointer ${notification.read_at ? "bg-transparent text-muted-foreground hover:bg-muted/10" : "bg-muted/30 hover:bg-muted/50"
                                        }`}
                                    onClick={() => {
                                        if (!notification.read_at) {
                                            markAsRead.mutate(notification.id)
                                        }
                                        setSelectedNotification(notification)
                                        setNotificationModalOpen(true)
                                    }}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <p className={`text-sm ${notification.read_at ? "font-normal" : "font-semibold text-foreground"}`}>
                                            {notification.data?.title || notification.data?.message || "Notification"}
                                        </p>
                                        {!notification.read_at && (
                                            <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                                        )}
                                    </div>
                                    <p className="text-xs opacity-70 line-clamp-2">
                                        {notification.data?.message}
                                    </p>
                                    <p className="text-[10px] opacity-50 pt-1">
                                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>

                    <DrawerFooter className="pt-2">
                        <DrawerClose asChild>
                            <Button variant="outline">Close</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>

            <NotificationDetailsModal
                notification={selectedNotification}
                open={notificationModalOpen}
                onOpenChange={setNotificationModalOpen}
            />
        </Drawer>
    )
}
