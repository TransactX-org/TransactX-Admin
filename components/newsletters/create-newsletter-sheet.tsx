"use strict";

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Upload } from "lucide-react"

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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useCreateNewsletter, useUpdateNewsletter } from "@/lib/api/hooks/use-newsletters"
import { Newsletter } from "@/lib/api/services/newsletter.service"

const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    medium: z.enum(["email", "sms", "push_notification"]),
    content: z.string().min(1, "Content is required"),
    date: z.string().optional(),
    time: z.string().optional(),
    is_active: z.boolean().default(true),
    // Banner image is handled separately as it's a file
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
            }
        }
    }, [open, newsletter, form])

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
                    },
                }
            )
        } else {
            createNewsletter.mutate(data, {
                onSuccess: () => {
                    onOpenChange(false)
                    form.reset()
                    setBannerImage(null)
                },
            })
        }
    }

    const isLoading = createNewsletter.isPending || updateNewsletter.isPending

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>{newsletter ? "Edit Newsletter" : "Create Newsletter"}</SheetTitle>
                    <SheetDescription>
                        {newsletter
                            ? "Update the newsletter details below."
                            : "Fill in the details to create a new newsletter."}
                    </SheetDescription>
                </SheetHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Newsletter Title" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="medium"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Medium</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select medium" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="email">Email</SelectItem>
                                            <SelectItem value="sms">SMS</SelectItem>
                                            <SelectItem value="push_notification">Push Notification</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Content</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Enter newsletter content..."
                                            className="min-h-[200px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        For Email, you can paste HTML content here.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormItem>
                            <FormLabel>Banner Image (Optional)</FormLabel>
                            <FormControl>
                                <div className="flex items-center gap-4">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0]
                                            if (file) setBannerImage(file)
                                        }}
                                        className="cursor-pointer"
                                    />
                                </div>
                            </FormControl>
                            {newsletter?.banner_image && !bannerImage && (
                                <p className="text-xs text-muted-foreground mt-1">Current: {newsletter.banner_image}</p>
                            )}
                        </FormItem>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Date (Optional)</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
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
                                        <FormLabel>Time (Optional)</FormLabel>
                                        <FormControl>
                                            <Input type="time" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="is_active"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">Active</FormLabel>
                                        <FormDescription>
                                            Enable or disable this newsletter.
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

                        <div className="flex justify-end gap-3 pt-4">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading} className="bg-primary text-white">
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {newsletter ? "Update Changes" : "Create Newsletter"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </SheetContent>
        </Sheet>
    )
}
