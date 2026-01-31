"use strict";

import { useState } from "react"
import { format } from "date-fns"
import { Calendar, Clock, Mail, MessageSquare, Send, Smartphone, User, Loader2, X, AlertCircle, Eye, BarChart, Users } from "lucide-react"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useSendNewsletter } from "@/lib/api/hooks/use-newsletters"
import { Newsletter } from "@/lib/api/services/newsletter.service"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"

interface NewsletterDetailsProps {
    newsletter: Newsletter | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function NewsletterDetails({
    newsletter,
    open,
    onOpenChange,
}: NewsletterDetailsProps) {
    const sendNewsletter = useSendNewsletter()
    const [sendToAll, setSendToAll] = useState(true)
    const [userIds, setUserIds] = useState("")
    const [isSending, setIsSending] = useState(false)

    if (!newsletter) return null

    const getMediumIcon = (medium: string) => {
        switch (medium) {
            case "email":
                return <Mail className="h-5 w-5" />
            case "sms":
                return <MessageSquare className="h-5 w-5" />
            case "push_notification":
                return <Smartphone className="h-5 w-5" />
            default:
                return <Mail className="h-5 w-5" />
        }
    }

    const getMediumColor = (medium: string) => {
        switch (medium) {
            case "email":
                return "text-blue-500 bg-blue-500/10"
            case "sms":
                return "text-green-500 bg-green-500/10"
            case "push_notification":
                return "text-purple-500 bg-purple-500/10"
            default:
                return "text-primary bg-primary/10"
        }
    }

    const handleSend = () => {
        if (!sendToAll && !userIds) return;

        setIsSending(true)
        const userIdsArray = userIds.split(",").map((id) => id.trim()).filter(Boolean)

        sendNewsletter.mutate(
            {
                id: newsletter.id,
                data: {
                    send_to_all: sendToAll,
                    user_ids: !sendToAll ? userIdsArray : undefined,
                },
            },
            {
                onSuccess: () => {
                    setIsSending(false)
                    // onOpenChange(false) // Optionally keep open to show success state
                },
                onError: () => {
                    setIsSending(false)
                }
            }
        )
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0 rounded-3xl border-border/40 bg-card/95 backdrop-blur-xl">
                {/* Header Section */}
                <DialogHeader className="p-6 pb-0 border-b border-border/10">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center shrink-0", getMediumColor(newsletter.medium))}>
                                {getMediumIcon(newsletter.medium)}
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-black tracking-tight">{newsletter.title}</DialogTitle>
                                <DialogDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1 flex items-center gap-2">
                                    <span>CAMPAIGN #{newsletter.id.substring(0, 8)}</span>
                                    <span className="h-1 w-1 rounded-full bg-border" />
                                    <span className="text-primary">{newsletter.medium.replace("_", " ")}</span>
                                </DialogDescription>
                            </div>
                        </div>
                        <div className="text-right hidden sm:block">
                            <Badge variant={newsletter.is_active ? "default" : "secondary"} className="uppercase font-black tracking-widest text-[9px]">
                                {newsletter.is_active ? "Active" : "Draft"}
                            </Badge>
                            <p className="text-[10px] font-mono text-muted-foreground mt-2">
                                {newsletter.date || "Unscheduled"}
                            </p>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto flex flex-col md:flex-row">
                    {/* Left Column: Content Preview */}
                    <div className="flex-1 p-6 space-y-6 border-r border-border/20">
                        <div className="flex items-center gap-2 mb-2">
                            <Eye className="h-4 w-4 text-primary" />
                            <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Campaign Content</h3>
                        </div>

                        {newsletter.banner_image && (
                            <div className="rounded-2xl overflow-hidden border border-border/20 shadow-sm relative group">
                                <img
                                    src={newsletter.banner_image}
                                    alt="Banner"
                                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60" />
                            </div>
                        )}

                        <div className="bg-muted/20 border border-border/20 rounded-2xl p-6 min-h-[200px] shadow-inner">
                            {newsletter.medium === 'email' ? (
                                <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-bold prose-p:text-muted-foreground" dangerouslySetInnerHTML={{ __html: newsletter.content }} />
                            ) : (
                                <p className="whitespace-pre-wrap font-medium text-lg leading-relaxed text-foreground/90">{newsletter.content}</p>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Analytics & Actions */}
                    <div className="w-full md:w-[350px] p-6 bg-muted/5 flex flex-col gap-6">

                        {/* Status/Analytics (Mock for now, looking futuristic) */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <BarChart className="h-4 w-4 text-primary" />
                                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Targeting</h3>
                            </div>
                            <div className="bg-background rounded-2xl p-4 border border-border/40 space-y-4 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <p className="text-[10px] font-bold uppercase text-muted-foreground">Audience</p>
                                        <p className="text-sm font-black">{sendToAll ? "All Accounts" : "Custom List"}</p>
                                    </div>
                                    <Users className="h-5 w-5 text-muted-foreground/30" />
                                </div>
                                <div className="h-1 w-full bg-muted overflow-hidden rounded-full">
                                    <div className="h-full bg-primary w-2/3" />
                                </div>
                            </div>
                        </div>

                        <Separator className="bg-border/20" />

                        {/* Sending Controls */}
                        <div className="space-y-4 flex-1">
                            <div className="flex items-center gap-2">
                                <Send className="h-4 w-4 text-primary" />
                                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Launch Control</h3>
                            </div>

                            <div className="space-y-4 bg-background p-4 rounded-2xl border border-border/40 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="send-all" className="flex flex-col gap-0.5 cursor-pointer">
                                        <span className="font-bold text-sm">Broadcast Mode</span>
                                        <span className="text-[10px] text-muted-foreground font-medium">Send to entire user base</span>
                                    </Label>
                                    <Switch
                                        id="send-all"
                                        checked={sendToAll}
                                        onCheckedChange={setSendToAll}
                                    />
                                </div>

                                {!sendToAll && (
                                    <div className="space-y-2 pt-2 animate-in slide-in-from-top-2 fade-in">
                                        <Label htmlFor="user-ids" className="text-xs font-bold uppercase text-muted-foreground">Target User UUIDs</Label>
                                        <textarea
                                            id="user-ids"
                                            placeholder="Enter IDs separated by comma..."
                                            value={userIds}
                                            onChange={(e) => setUserIds(e.target.value)}
                                            className="w-full text-xs font-mono h-24 p-3 rounded-xl bg-muted/20 border-border/40 resize-none focus:ring-1 focus:ring-primary focus:border-primary/50 outline-none transition-all placeholder:text-muted-foreground/30"
                                        />
                                        <p className="text-[10px] text-right font-mono text-muted-foreground">
                                            {userIds.split(",").filter(Boolean).length} RECIPIENTS SELECTED
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <Button
                            className="w-full h-12 rounded-xl text-xs uppercase font-black tracking-widest shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                            onClick={handleSend}
                            disabled={isSending || (!sendToAll && !userIds)}
                        >
                            {isSending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Transmitting...
                                </>
                            ) : (
                                <>
                                    <Send className="mr-2 h-4 w-4" /> Execute Campaign
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
