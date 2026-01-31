"use strict";

import { useState } from "react"
import { format } from "date-fns"
import { Calendar, Clock, Mail, MessageSquare, Send, Smartphone, User, Loader2 } from "lucide-react"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useSendNewsletter } from "@/lib/api/hooks/use-newsletters"
import { Newsletter } from "@/lib/api/services/newsletter.service"

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
                return <Mail className="h-4 w-4" />
            case "sms":
                return <MessageSquare className="h-4 w-4" />
            case "push_notification":
                return <Smartphone className="h-4 w-4" />
            default:
                return <Mail className="h-4 w-4" />
        }
    }

    const handleSend = () => {
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
                    // Optional: Close modal or just show success state?
                },
                onError: () => {
                    setIsSending(false)
                }
            }
        )
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0 gap-0">
                <DialogHeader className="p-6 pb-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <Badge variant="outline" className="flex items-center gap-1">
                                {getMediumIcon(newsletter.medium)}
                                <span className="capitalize">{newsletter.medium.replace("_", " ")}</span>
                            </Badge>
                            {newsletter.is_active ? (
                                <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Active</Badge>
                            ) : (
                                <Badge variant="secondary">Inactive</Badge>
                            )}
                        </div>
                        {newsletter.created_at && (
                            <span className="text-xs text-muted-foreground">
                                Created {format(new Date(newsletter.created_at), "PPP")}
                            </span>
                        )}
                    </div>
                    <DialogTitle className="text-2xl font-bold">{newsletter.title}</DialogTitle>
                </DialogHeader>

                <Separator />

                <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
                    {/* Content Preview */}
                    <ScrollArea className="flex-1 p-6 h-[50vh] md:h-[60vh]">
                        <div className="space-y-4">
                            {newsletter.banner_image && (
                                <div className="relative w-full h-48 rounded-lg overflow-hidden border border-border">
                                    <img
                                        src={newsletter.banner_image}
                                        alt="Banner"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            <div className="space-y-2">
                                <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Content Preview</h4>
                                <div className="p-4 border border-border rounded-lg bg-muted/10 min-h-[200px] prose dark:prose-invert max-w-none">
                                    {newsletter.medium === 'email' ? (
                                        <div dangerouslySetInnerHTML={{ __html: newsletter.content }} />
                                    ) : (
                                        <p className="whitespace-pre-wrap">{newsletter.content}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    <span>Scheduled Date: {newsletter.date || "Not set"}</span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Clock className="h-4 w-4" />
                                    <span>Scheduled Time: {newsletter.time || "Not set"}</span>
                                </div>
                            </div>
                        </div>
                    </ScrollArea>

                    <Separator orientation="vertical" className="hidden md:block" />

                    {/* Send Actions */}
                    <div className="w-full md:w-80 p-6 bg-muted/10 flex flex-col gap-6">
                        <div>
                            <h3 className="font-semibold mb-4 flex items-center gap-2">
                                <Send className="h-4 w-4" /> Send Newsletter
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="send-all" className="flex flex-col gap-1 cursor-pointer">
                                        <span>Send to All Users</span>
                                        <span className="text-xs font-normal text-muted-foreground">Blast to entire database</span>
                                    </Label>
                                    <Switch
                                        id="send-all"
                                        checked={sendToAll}
                                        onCheckedChange={setSendToAll}
                                    />
                                </div>

                                {!sendToAll && (
                                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                        <Label htmlFor="user-ids">User IDs</Label>
                                        <Input
                                            id="user-ids"
                                            placeholder="uuid1, uuid2, uuid3..."
                                            value={userIds}
                                            onChange={(e) => setUserIds(e.target.value)}
                                            className="text-xs"
                                        />
                                        <p className="text-[10px] text-muted-foreground">Comma separated User IDs</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-auto">
                            <Button
                                className="w-full bg-primary text-white"
                                onClick={handleSend}
                                disabled={isSending || (!sendToAll && !userIds)}
                            >
                                {isSending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                                    </>
                                ) : (
                                    <>
                                        Send Now
                                    </>
                                )}
                            </Button>
                            <p className="text-[10px] text-center text-muted-foreground mt-2">
                                This action cannot be undone.
                            </p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
