"use strict";

import { useEffect, useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Upload, Mail, MessageSquare, Smartphone, X, Calendar, Clock, Image as ImageIcon } from "lucide-react"

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
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
import { cn } from "@/lib/utils"
import { useCreateNewsletter, useUpdateNewsletter } from "@/lib/api/hooks/use-newsletters"
import { Newsletter } from "@/lib/api/services/newsletter.service"

const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    medium: z.enum(["email", "sms", "push_notification"]),
    content: z.string().min(1, "Content is required"),
    date: z.string().min(1, "Date is required"),
    time: z.string().min(1, "Time is required"),
    is_active: z.boolean().default(true),
})

interface CreateNewsletterSheetProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    newsletter?: Newsletter | null
}

export function CreateNewsletterSheet({
    open,
    onOpenChange,
    newsletter,
}: CreateNewsletterSheetProps) {
    const [bannerImage, setBannerImage] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

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
        },
    })

    // Reset form when opening/closing or changing newsletter
    useEffect(() => {
        if (open) {
            if (newsletter) {
                form.reset({
                    title: newsletter.title,
                    medium: (newsletter.medium as "email" | "sms" | "push_notification") || "email",
                    content: newsletter.content,
                    date: newsletter.date || "",
                    time: newsletter.time || "",
                    is_active: newsletter.is_active,
                })
                setImagePreview(newsletter.banner_image || null)
            } else {
                form.reset({
                    title: "",
                    medium: "email",
                    content: "",
                    date: "",
                    time: "",
                    is_active: true,
                })
                setBannerImage(null)
                setImagePreview(null)
            }
        }
    }, [open, newsletter, form])

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

    const handleRemoveImage = () => {
        setBannerImage(null)
        setImagePreview(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        const data = {
            ...values,
            banner_image: bannerImage || undefined,
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
                onSuccess: () => {
                    onOpenChange(false)
                    form.reset()
                    setBannerImage(null)
                    setImagePreview(null)
                },
            })
        }
    }

    const isLoading = createNewsletter.isPending || updateNewsletter.isPending

    const mediumOptions = [
        { value: "email", label: "Email", icon: Mail },
        { value: "sms", label: "SMS", icon: MessageSquare },
        { value: "push_notification", label: "Push", icon: Smartphone },
    ]

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:w-[540px] p-0 flex flex-col h-full bg-background border-l border-border shadow-2xl">
                <SheetHeader className="px-6 py-4 border-b border-border bg-background z-10">
                    <SheetTitle className="text-xl font-bold tracking-tight">
                        {newsletter ? "Edit Newsletter" : "Create Newsletter"}
                    </SheetTitle>
                    <SheetDescription>
                        {newsletter
                            ? "Update your campaign details."
                            : "Design a new marketing campaign."}
                    </SheetDescription>
                </SheetHeader>

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
                                        <FormLabel className="text-sm font-medium text-foreground">Content</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Write your message here..."
                                                className="min-h-[200px] resize-y bg-muted/30 border-border focus:border-primary/50"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription className="text-xs">
                                            {form.watch("medium") === "email" ? "Supports HTML content." : "Plain text only."}
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Date & Time */}
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="date"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium text-foreground">Schedule Date <span className="text-destructive">*</span></FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        type="date"
                                                        className="pl-9 bg-muted/30"
                                                        {...field}
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
                                                <div className="relative">
                                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        type="time"
                                                        className="pl-9 bg-muted/30"
                                                        {...field}
                                                    />
                                                </div>
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
                <div className="p-6 border-t border-border bg-background mt-auto flex items-center justify-end gap-3">
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={form.handleSubmit(onSubmit)}
                        disabled={isLoading}
                        className="bg-primary text-white min-w-[120px]"
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {newsletter ? "Update" : "Create"}
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    )
}
