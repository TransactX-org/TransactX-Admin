"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Bell, Calendar, Clock, Globe, Laptop, Shield, User } from "lucide-react"
import { format } from "date-fns"

interface NotificationDetailsModalProps {
    notification: any | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function NotificationDetailsModal({
    notification,
    open,
    onOpenChange
}: NotificationDetailsModalProps) {
    if (!notification) return null

    // Extract nested data safely
    const title = notification.data?.title || "Notification"
    const message = notification.data?.message
    const metaData = notification.data?.data || {}

    // Format dates
    const createdAt = notification.created_at ? format(new Date(notification.created_at), "PPP p") : null
    const eventAt = metaData.event_at || createdAt

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md max-h-[90vh] overflow-hidden flex flex-col p-0 rounded-3xl border-border/40 bg-card/95 backdrop-blur-xl">
                <DialogHeader className="p-6 pb-2">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                            <Bell className="h-5 w-5" />
                        </div>
                        <div>
                            <DialogTitle className="text-lg font-bold leading-tight">{title}</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-muted-foreground mt-1">
                                {format(new Date(notification.created_at), "PPP")}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 custom-scrollbar">
                    {/* Main Message */}
                    <div className="bg-muted/30 p-4 rounded-2xl border border-border/20">
                        <p className="text-sm leading-relaxed text-foreground/90">
                            {message}
                        </p>
                    </div>

                    {/* Technical Details Grid */}
                    {(metaData.ip_address || metaData.user_agent || metaData.email) && (
                        <div className="space-y-3">
                            <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">
                                Signal Metadata
                            </h3>
                            <div className="grid grid-cols-1 gap-3">
                                {metaData.email && (
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border/40 shadow-sm">
                                        <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                                            <User className="h-4 w-4" />
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-[10px] font-bold uppercase text-muted-foreground">User Identity</p>
                                            <p className="text-xs font-semibold truncate">{metaData.email}</p>
                                        </div>
                                    </div>
                                )}

                                {metaData.ip_address && (
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border/40 shadow-sm">
                                        <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500 shrink-0">
                                            <Globe className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold uppercase text-muted-foreground">IP Address</p>
                                            <p className="text-xs font-mono font-semibold">{metaData.ip_address}</p>
                                        </div>
                                    </div>
                                )}

                                {metaData.user_agent && (
                                    <div className="flex items-start gap-3 p-3 rounded-xl bg-card border border-border/40 shadow-sm">
                                        <div className="h-8 w-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500 shrink-0">
                                            <Laptop className="h-4 w-4" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-bold uppercase text-muted-foreground">Device Fingerprint</p>
                                            <p className="text-[10px] font-medium leading-normal text-muted-foreground break-words mt-0.5">
                                                {metaData.user_agent}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {eventAt && (
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border/40 shadow-sm">
                                        <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                                            <Clock className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold uppercase text-muted-foreground">Timestamp</p>
                                            <p className="text-xs font-semibold">{eventAt}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Raw Data (if needed for debugging, collapsed by default or small) */}
                    <div className="pt-2">
                        <p className="text-[9px] font-mono text-center text-muted-foreground/30 uppercase tracking-widest">
                            ID: {notification.id}
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
