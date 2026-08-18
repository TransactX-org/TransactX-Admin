"use strict";

import { useState } from "react"
import { format } from "date-fns"
import { Calendar, Clock, Mail, MessageSquare, Send, Smartphone, User, Loader2, X, AlertCircle, Eye, BarChart, Users, FlaskConical, CheckCircle2 } from "lucide-react"

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
import { useSendNewsletter } from "@/lib/api/hooks/use-newsletters"
import { Newsletter } from "@/lib/api/services/newsletter.service"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import { UserPicker } from "./user-picker"
import type { User as ApiUser } from "@/lib/api/types"
import { highlightPersonalizationTags, richTextToEmailHtml } from "@/lib/newsletter-content"

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
    const [testUsers, setTestUsers] = useState<ApiUser[]>([])
    const [isSending, setIsSending] = useState(false)
    const [isTestSending, setIsTestSending] = useState(false)
    const [testSentTo, setTestSentTo] = useState<number | null>(null)

    if (!newsletter) return null

    const audience = newsletter.target_user_type || "all"
    const customCount = newsletter.target_user_ids?.length || 0
    const audienceLabel =
        audience === "organization"
            ? "Business Accounts"
            : audience === "individual"
                ? "Individual Accounts"
                : audience === "custom"
                    ? `${customCount} Specific User${customCount === 1 ? "" : "s"}`
                    : "All Accounts"
    const audienceDescription =
        audience === "organization"
            ? "all business accounts"
            : audience === "individual"
                ? "all individual accounts"
                : audience === "custom"
                    ? `the ${customCount} user${customCount === 1 ? "" : "s"} chosen when this newsletter was created`
                    : "the entire user base"

    const tagPattern = /\{\{\s*\w+\s*\}\}/g
    const hasPersonalizationTags = tagPattern.test(newsletter.content)
    // Render through the same converter used when sending, so this preview is
    // what recipients actually get.
    const previewHtml = highlightPersonalizationTags(richTextToEmailHtml(newsletter.content))

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
        if (audience === "custom" && customCount === 0) return;

        setIsSending(true)

        sendNewsletter.mutate(
            {
                id: newsletter.id,
                data: audience === "custom"
                    ? {
                        send_to_all: false,
                        user_ids: newsletter.target_user_ids || [],
                    }
                    : {
                        send_to_all: true,
                        user_type: audience !== "all" ? audience : undefined,
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

    const handleTestSend = () => {
        if (testUsers.length === 0) return;

        setIsTestSending(true)
        setTestSentTo(null)

        sendNewsletter.mutate(
            {
                id: newsletter.id,
                data: {
                    send_to_all: false,
                    user_ids: testUsers.map((u) => u.id),
                },
            },
            {
                onSuccess: () => {
                    setIsTestSending(false)
                    setTestSentTo(testUsers.length)
                },
                onError: () => {
                    setIsTestSending(false)
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
                                <div className="rounded-xl bg-white p-5 text-[15px] text-[#1f2937] overflow-x-auto" dangerouslySetInnerHTML={{ __html: previewHtml }} />
                            ) : (
                                <p className="whitespace-pre-wrap font-medium text-lg leading-relaxed text-foreground/90">
                                    {newsletter.content.split(/(\{\{\s*\w+\s*\}\})/g).map((part, i) =>
                                        /^\{\{\s*\w+\s*\}\}$/.test(part) ? (
                                            <span key={i} className="inline-block px-2 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                                                {part.replace(/[{}]/g, "").trim().replace(/_/g, " ")}
                                            </span>
                                        ) : (
                                            part
                                        )
                                    )}
                                </p>
                            )}
                        </div>

                        {hasPersonalizationTags && (
                            <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                                <User className="h-3 w-3" />
                                The highlighted tags will be replaced with each customer&apos;s real details when this is sent.
                            </p>
                        )}
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
                                        <p className="text-sm font-black">{audienceLabel}</p>
                                    </div>
                                    <Users className="h-5 w-5 text-muted-foreground/30" />
                                </div>
                                <div className="h-1 w-full bg-muted overflow-hidden rounded-full">
                                    <div className="h-full bg-primary w-2/3" />
                                </div>
                            </div>
                        </div>

                        <Separator className="bg-border/20" />

                        {/* Test Send */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <FlaskConical className="h-4 w-4 text-amber-500" />
                                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Send a Test First</h3>
                            </div>

                            <div className="space-y-3 bg-background p-4 rounded-2xl border border-amber-500/20 shadow-sm">
                                <p className="text-[11px] text-muted-foreground leading-relaxed">
                                    Send this to yourself or a teammate to check how it looks before sending it to real customers.
                                </p>
                                <UserPicker
                                    selected={testUsers}
                                    onChange={(users) => {
                                        setTestUsers(users)
                                        setTestSentTo(null)
                                    }}
                                    placeholder="Search test recipient..."
                                    maxSelection={5}
                                />
                                {testSentTo !== null && (
                                    <p className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-600">
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                        Test sent to {testSentTo} recipient{testSentTo === 1 ? "" : "s"}. Check their inbox/device.
                                    </p>
                                )}
                                <Button
                                    variant="outline"
                                    className="w-full h-10 rounded-xl text-xs uppercase font-black tracking-widest border-amber-500/30 text-amber-600 hover:bg-amber-500/10 hover:text-amber-700"
                                    onClick={handleTestSend}
                                    disabled={isTestSending || isSending || testUsers.length === 0}
                                >
                                    {isTestSending ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending Test...
                                        </>
                                    ) : (
                                        <>
                                            <FlaskConical className="mr-2 h-4 w-4" /> Send Test
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>

                        <Separator className="bg-border/20" />

                        {/* Sending Controls */}
                        <div className="space-y-4 flex-1">
                            <div className="flex items-center gap-2">
                                <Send className="h-4 w-4 text-primary" />
                                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Launch Control</h3>
                            </div>

                            <div className="space-y-2 bg-background p-4 rounded-2xl border border-border/40 shadow-sm">
                                <p className="font-bold text-sm">Ready to send</p>
                                <p className="text-[11px] text-muted-foreground leading-relaxed">
                                    This newsletter will go to <span className="font-semibold text-foreground">{audienceDescription}</span>.
                                    To change who receives it, close this window and use <span className="font-semibold text-foreground">Edit</span> on the newsletter.
                                </p>
                            </div>
                        </div>

                        <Button
                            className="w-full h-12 rounded-xl text-xs uppercase font-black tracking-widest shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                            onClick={handleSend}
                            disabled={isSending || isTestSending || (audience === "custom" && customCount === 0)}
                        >
                            {isSending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Transmitting...
                                </>
                            ) : (
                                <>
                                    <Send className="mr-2 h-4 w-4" />
                                    {audience === "organization"
                                        ? "Send to All Businesses"
                                        : audience === "individual"
                                            ? "Send to All Individuals"
                                            : audience === "custom"
                                                ? `Send to ${customCount} User${customCount === 1 ? "" : "s"}`
                                                : "Send to All Users"}
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
