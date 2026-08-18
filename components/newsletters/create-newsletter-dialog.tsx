"use strict";

import { useEffect, useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Mail, MessageSquare, Smartphone, X, Calendar, Image as ImageIcon, Users, User, Briefcase, UserCheck, Bold, Italic, Heading2, List, ListOrdered, Link2, Eye, Pencil } from "lucide-react"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { TimePicker } from "@/components/ui/time-picker"
import { cn } from "@/lib/utils"
import { useCreateNewsletter, useUpdateNewsletter } from "@/lib/api/hooks/use-newsletters"
import { Newsletter } from "@/lib/api/services/newsletter.service"
import { getUserById } from "@/lib/api/services/user.service"
import { UserPicker } from "./user-picker"
import type { User as ApiUser } from "@/lib/api/types"
import {
    highlightPersonalizationTags,
    newsletterContentToEditorText,
    prepareNewsletterContent,
    richTextToEmailHtml,
} from "@/lib/newsletter-content"

// Tags the backend replaces with each user's real details at send time.
const personalizationTags = [
    { token: "first_name", label: "First Name" },
    { token: "last_name", label: "Last Name" },
    { token: "name", label: "Full Name" },
    { token: "email", label: "Email Address" },
    { token: "username", label: "Username" },
    { token: "phone", label: "Phone Number" },
]

const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    medium: z.enum(["email", "sms", "push_notification"]),
    content: z.string().min(1, "Content is required"),
    date: z.string().min(1, "Date is required"),
    time: z.string().min(1, "Time is required"),
    is_active: z.boolean().default(true),
    target_user_type: z.enum(["all", "individual", "organization", "custom"]).default("all"),
})

interface CreateNewsletterDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    newsletter?: Newsletter | null
    onCreated?: (newsletter: Newsletter) => void
}

export function CreateNewsletterDialog({
    open,
    onOpenChange,
    newsletter,
    onCreated,
}: CreateNewsletterDialogProps) {
    const [bannerImage, setBannerImage] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const contentRef = useRef<HTMLTextAreaElement | null>(null)
    const [selectedUsers, setSelectedUsers] = useState<ApiUser[]>([])
    const [showPreview, setShowPreview] = useState(false)
    // Which create button was clicked: save quietly, or continue into Review & Send
    const submitActionRef = useRef<"draft" | "continue">("continue")

    const createNewsletter = useCreateNewsletter()
    const updateNewsletter = useUpdateNewsletter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            medium: "email",
            content: "",
            date: "",
            time: "",
            is_active: true,
            target_user_type: "all",
        },
    })

    // Reset form when opening/closing or changing newsletter
    useEffect(() => {
        if (open) {
            setShowPreview(false)
            if (newsletter) {
                const medium = (newsletter.medium as "email" | "sms" | "push_notification") || "email"
                form.reset({
                    title: newsletter.title,
                    medium,
                    // Saved email content is HTML — show it back as editable text.
                    content: newsletterContentToEditorText(newsletter.content, medium),
                    date: newsletter.date || "",
                    time: newsletter.time || "",
                    is_active: newsletter.is_active,
                    target_user_type: newsletter.target_user_type || "all",
                })
                setImagePreview(newsletter.banner_image || null)
                setSelectedUsers([])
            } else {
                form.reset({
                    title: "",
                    medium: "email",
                    content: "",
                    date: "",
                    time: "",
                    is_active: true,
                    target_user_type: "all",
                })
                setBannerImage(null)
                setImagePreview(null)
                setSelectedUsers([])
            }
        }
    }, [open, newsletter, form])

    // When editing a newsletter targeted at specific users, load their details
    // so the picker shows names instead of raw IDs.
    useEffect(() => {
        let cancelled = false
        if (open && newsletter?.target_user_type === "custom" && newsletter.target_user_ids?.length) {
            Promise.all(
                newsletter.target_user_ids.map((id) =>
                    getUserById(id).then((res) => res.data?.user).catch(() => null)
                )
            ).then((users) => {
                if (!cancelled) {
                    setSelectedUsers(users.filter((u): u is ApiUser => Boolean(u)))
                }
            })
        }
        return () => {
            cancelled = true
        }
    }, [open, newsletter])

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setBannerImage(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    // Writes new content and puts the caret back where the writer expects it.
    const commitContent = (next: string, selectionStart: number, selectionEnd: number) => {
        form.setValue("content", next, { shouldDirty: true, shouldValidate: true })
        requestAnimationFrame(() => {
            const el = contentRef.current
            if (!el) return
            el.focus()
            el.setSelectionRange(selectionStart, selectionEnd)
        })
    }

    const getSelection = () => {
        const current = form.getValues("content") || ""
        const el = contentRef.current
        const start = el?.selectionStart ?? current.length
        const end = el?.selectionEnd ?? start
        return { current, start, end }
    }

    const insertPersonalizationTag = (token: string) => {
        const placeholder = `{{${token}}}`
        const { current, start, end } = getSelection()
        const next = current.slice(0, start) + placeholder + current.slice(end)
        const pos = start + placeholder.length
        commitContent(next, pos, pos)
    }

    // Bold/italic/strike: wrap the selection, or drop in sample text to edit over.
    const wrapSelection = (marker: string, sample: string) => {
        const { current, start, end } = getSelection()
        const selected = current.slice(start, end) || sample
        const next = current.slice(0, start) + marker + selected + marker + current.slice(end)
        commitContent(next, start + marker.length, start + marker.length + selected.length)
    }

    // Headings and lists: prefix every line the selection touches.
    const applyLinePrefix = (makePrefix: (index: number) => string) => {
        const { current, start, end } = getSelection()
        const lineStart = current.lastIndexOf("\n", start - 1) + 1
        const lineEnd = current.indexOf("\n", end) === -1 ? current.length : current.indexOf("\n", end)

        const prefixed = current
            .slice(lineStart, lineEnd)
            .split("\n")
            .map((line, index) => {
                if (!line.trim()) return line
                // Drop any prefix already there so buttons toggle cleanly.
                const stripped = line.replace(/^(\s*)(?:[-*•]\s+|\d+[.)]\s+|#{1,3}\s+)?/, "$1")
                const indent = stripped.match(/^\s*/)?.[0] || ""
                return indent + makePrefix(index) + stripped.slice(indent.length)
            })
            .join("\n")

        const next = current.slice(0, lineStart) + prefixed + current.slice(lineEnd)
        commitContent(next, lineStart, lineStart + prefixed.length)
    }

    const insertLink = () => {
        const { current, start, end } = getSelection()
        const label = current.slice(start, end) || "link text"
        const snippet = `[${label}](https://)`
        const next = current.slice(0, start) + snippet + current.slice(end)
        // Land the caret inside the URL so it can be pasted straight in.
        const urlStart = start + label.length + 3
        commitContent(next, urlStart + 8, urlStart + 8)
    }

    const formattingTools = [
        { icon: Bold, label: "Bold", onClick: () => wrapSelection("**", "bold text") },
        { icon: Italic, label: "Italic", onClick: () => wrapSelection("_", "italic text") },
        { icon: Heading2, label: "Heading", onClick: () => applyLinePrefix(() => "## ") },
        { icon: List, label: "Bullet list", onClick: () => applyLinePrefix(() => "- ") },
        { icon: ListOrdered, label: "Numbered list", onClick: () => applyLinePrefix((i) => `${i + 1}. `) },
        { icon: Link2, label: "Link", onClick: insertLink },
    ]

    const handleRemoveImage = () => {
        setBannerImage(null)
        setImagePreview(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        if (values.target_user_type === "custom" && selectedUsers.length === 0) {
            form.setError("target_user_type", { message: "Add at least one user, or pick a different audience" })
            return
        }

        const data = {
            ...values,
            // Email is delivered as HTML, so send HTML — otherwise the line breaks
            // and *markers* the writer used arrive as one flat blob.
            content: prepareNewsletterContent(values.content, values.medium),
            banner_image: bannerImage || undefined,
            target_user_ids: values.target_user_type === "custom" ? selectedUsers.map((u) => u.id) : undefined,
        }

        if (newsletter) {
            updateNewsletter.mutate(
                { id: newsletter.id, data },
                {
                    onSuccess: () => {
                        onOpenChange(false)
                        form.reset()
                        setBannerImage(null)
                        setImagePreview(null)
                    },
                }
            )
        } else {
            createNewsletter.mutate(data, {
                onSuccess: (response) => {
                    onOpenChange(false)
                    form.reset()
                    setBannerImage(null)
                    setImagePreview(null)
                    const created = response.data?.newsletter
                    if (submitActionRef.current === "continue" && created) {
                        onCreated?.(created)
                    }
                },
            })
        }
    }

    const handleCreateClick = (action: "draft" | "continue") => {
        submitActionRef.current = action
        form.handleSubmit(onSubmit)()
    }

    const isLoading = createNewsletter.isPending || updateNewsletter.isPending
    const isEmail = form.watch("medium") === "email"

    const mediumOptions = [
        { value: "email", label: "Email", icon: Mail },
        { value: "sms", label: "SMS", icon: MessageSquare },
        { value: "push_notification", label: "Push", icon: Smartphone },
    ]

    const audienceOptions = [
        { value: "all", label: "Everyone", icon: Users },
        { value: "individual", label: "Individuals", icon: User },
        { value: "organization", label: "Businesses", icon: Briefcase },
        { value: "custom", label: "Specific Users", icon: UserCheck },
    ]

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl w-[calc(100vw-2rem)] max-h-[90vh] p-0 flex flex-col overflow-hidden bg-background rounded-2xl border-border shadow-2xl">
                <DialogHeader className="px-6 py-4 border-b border-border bg-background z-10 text-left shrink-0">
                    <DialogTitle className="text-xl font-bold tracking-tight">
                        {newsletter ? "Edit Newsletter" : "Create Newsletter"}
                    </DialogTitle>
                    <DialogDescription>
                        {newsletter
                            ? "Update your campaign details."
                            : "Design a new marketing campaign."}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto px-6 py-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                            {/* Title Section */}
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-foreground">Campaign Title</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g. Monthly Rewards Update"
                                                {...field}
                                                className="h-11 bg-muted/30 border-border focus:border-primary/50 transition-all font-medium"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Medium Selection */}
                            <FormField
                                control={form.control}
                                name="medium"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-foreground">Delivery Method</FormLabel>
                                        <div className="grid grid-cols-3 gap-3">
                                            {mediumOptions.map((option) => {
                                                const Icon = option.icon
                                                const isSelected = field.value === option.value
                                                return (
                                                    <div
                                                        key={option.value}
                                                        onClick={() => field.onChange(option.value)}
                                                        className={cn(
                                                            "cursor-pointer flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all duration-200",
                                                            isSelected
                                                                ? "border-primary bg-primary/5 text-primary ring-1 ring-primary/20"
                                                                : "border-border hover:border-primary/30 hover:bg-muted/30 text-muted-foreground"
                                                        )}
                                                    >
                                                        <Icon className={cn("h-5 w-5", isSelected ? "text-primary" : "text-muted-foreground")} />
                                                        <span className="text-xs font-medium">{option.label}</span>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Audience Selection */}
                            <FormField
                                control={form.control}
                                name="target_user_type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-foreground">Who Should Receive This?</FormLabel>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                            {audienceOptions.map((option) => {
                                                const Icon = option.icon
                                                const isSelected = field.value === option.value
                                                return (
                                                    <div
                                                        key={option.value}
                                                        onClick={() => field.onChange(option.value)}
                                                        className={cn(
                                                            "cursor-pointer flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all duration-200",
                                                            isSelected
                                                                ? "border-primary bg-primary/5 text-primary ring-1 ring-primary/20"
                                                                : "border-border hover:border-primary/30 hover:bg-muted/30 text-muted-foreground"
                                                        )}
                                                    >
                                                        <Icon className={cn("h-5 w-5", isSelected ? "text-primary" : "text-muted-foreground")} />
                                                        <span className="text-xs font-medium">{option.label}</span>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                        <FormDescription className="text-xs">
                                            {field.value === "all"
                                                ? "Every user gets this newsletter."
                                                : field.value === "organization"
                                                    ? "Only business accounts get this newsletter."
                                                    : field.value === "individual"
                                                        ? "Only individual (personal) accounts get this newsletter."
                                                        : "Only the users you pick below get this newsletter."}
                                        </FormDescription>
                                        {field.value === "custom" && (
                                            <div className="pt-2 animate-in slide-in-from-top-2 fade-in">
                                                <UserPicker
                                                    selected={selectedUsers}
                                                    onChange={(users) => {
                                                        setSelectedUsers(users)
                                                        if (users.length > 0) form.clearErrors("target_user_type")
                                                    }}
                                                    placeholder="Search users to add..."
                                                />
                                            </div>
                                        )}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Banner Image Dropzone */}
                            <FormItem>
                                <FormLabel className="text-sm font-medium text-foreground">Banner Image</FormLabel>
                                <div
                                    className={cn(
                                        "relative group cursor-pointer border-2 border-dashed border-border rounded-xl overflow-hidden transition-all duration-200 hover:border-primary/50 hover:bg-muted/20",
                                        imagePreview ? "border-none" : "h-32 flex items-center justify-center bg-muted/10"
                                    )}
                                    onClick={() => !imagePreview && fileInputRef.current?.click()}
                                >
                                    {imagePreview ? (
                                        <div className="relative w-full h-[200px]">
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        fileInputRef.current?.click()
                                                    }}
                                                >
                                                    Replace
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="destructive"
                                                    className="h-8 w-8"
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleRemoveImage()
                                                    }}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                            <ImageIcon className="h-8 w-8 opacity-50" />
                                            <span className="text-xs font-medium">Click to upload banner</span>
                                        </div>
                                    )}
                                    <Input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageSelect}
                                    />
                                </div>
                            </FormItem>

                            {/* Content Editor */}
                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex items-center justify-between gap-2">
                                            <FormLabel className="text-sm font-medium text-foreground">Content</FormLabel>
                                            {isEmail && (
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPreview((value) => !value)}
                                                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors"
                                                >
                                                    {showPreview ? <Pencil className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                                                    {showPreview ? "Back to editing" : "Preview"}
                                                </button>
                                            )}
                                        </div>

                                        {isEmail && !showPreview && (
                                            <div className="flex flex-wrap items-center gap-1 rounded-lg border border-border bg-muted/20 p-1">
                                                {formattingTools.map((tool) => {
                                                    const Icon = tool.icon
                                                    return (
                                                        <button
                                                            key={tool.label}
                                                            type="button"
                                                            title={tool.label}
                                                            aria-label={tool.label}
                                                            onClick={tool.onClick}
                                                            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-background hover:text-primary transition-colors"
                                                        >
                                                            <Icon className="h-4 w-4" />
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        )}

                                        {isEmail && showPreview ? (
                                            <div className="min-h-[200px] rounded-xl border border-border bg-white p-6 text-[15px] text-[#1f2937] overflow-x-auto">
                                                {field.value?.trim() ? (
                                                    <div
                                                        dangerouslySetInnerHTML={{
                                                            __html: highlightPersonalizationTags(richTextToEmailHtml(field.value)),
                                                        }}
                                                    />
                                                ) : (
                                                    <p className="text-sm text-muted-foreground">Nothing to preview yet.</p>
                                                )}
                                            </div>
                                        ) : (
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Write your message here..."
                                                    className="min-h-[200px] resize-y bg-muted/30 border-border focus:border-primary/50"
                                                    {...field}
                                                    ref={(el) => {
                                                        field.ref(el)
                                                        contentRef.current = el
                                                    }}
                                                />
                                            </FormControl>
                                        )}
                                        <div className={cn("rounded-xl border border-border/50 bg-muted/20 p-3 space-y-2", isEmail && showPreview && "hidden")}>
                                            <p className="text-xs font-semibold text-foreground">Add customer details</p>
                                            <p className="text-[11px] text-muted-foreground leading-relaxed">
                                                Click a button below to drop it into your message. When the newsletter is sent,
                                                it is automatically swapped with each customer&apos;s real details — e.g.{" "}
                                                <span className="font-mono">{"{{first_name}}"}</span> becomes &ldquo;Ada&rdquo;.
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {personalizationTags.map((tag) => (
                                                    <button
                                                        key={tag.token}
                                                        type="button"
                                                        onClick={() => insertPersonalizationTag(tag.token)}
                                                        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-colors"
                                                    >
                                                        {tag.label}
                                                        <span className="font-mono text-[10px] text-muted-foreground">{`{{${tag.token}}}`}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <FormDescription className="text-xs leading-relaxed">
                                            {isEmail ? (
                                                <>
                                                    Blank lines start a new paragraph and are kept when the email is sent. Use{" "}
                                                    <span className="font-mono">*bold*</span>,{" "}
                                                    <span className="font-mono">_italic_</span>,{" "}
                                                    <span className="font-mono">## heading</span>,{" "}
                                                    <span className="font-mono">- bullet</span> — or the buttons above. Check{" "}
                                                    <span className="font-medium">Preview</span> to see exactly how it will land.
                                                </>
                                            ) : (
                                                "Plain text only — bold and headings are not supported here."
                                            )}
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Date & Time */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                                <FormField
                                    control={form.control}
                                    name="date"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium text-foreground">Schedule Date <span className="text-destructive">*</span></FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                                                    <Input
                                                        type="date"
                                                        className="pl-9 bg-muted/30 cursor-pointer"
                                                        {...field}
                                                        // Open the calendar wherever the box is clicked, not just on the tiny icon.
                                                        onClick={(event) => {
                                                            try {
                                                                event.currentTarget.showPicker?.()
                                                            } catch {
                                                                // Browser blocked it (or doesn't support it) — the field still works.
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="time"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium text-foreground">Schedule Time <span className="text-destructive">*</span></FormLabel>
                                            <FormControl>
                                                <TimePicker
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    className="bg-muted/30"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Active Status */}
                            <FormField
                                control={form.control}
                                name="is_active"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-xl border border-border bg-muted/10 p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base font-medium">Active Status</FormLabel>
                                            <FormDescription className="text-xs">
                                                Publish this newsletter immediately?
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                        </form>
                    </Form>
                </div>

                {/* Footer Actions */}
                <div className="px-6 py-4 border-t border-border bg-background mt-auto flex items-center justify-end gap-3 shrink-0">
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    {newsletter ? (
                        <Button
                            onClick={form.handleSubmit(onSubmit)}
                            disabled={isLoading}
                            className="bg-primary text-white min-w-[120px]"
                        >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Update
                        </Button>
                    ) : (
                        <>
                            <Button
                                variant="outline"
                                onClick={() => handleCreateClick("draft")}
                                disabled={isLoading}
                            >
                                {isLoading && submitActionRef.current === "draft" && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Save as Draft
                            </Button>
                            <Button
                                onClick={() => handleCreateClick("continue")}
                                disabled={isLoading}
                                className="bg-primary text-white min-w-[150px]"
                            >
                                {isLoading && submitActionRef.current === "continue" && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Create &amp; Continue
                            </Button>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
