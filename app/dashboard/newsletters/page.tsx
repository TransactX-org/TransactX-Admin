"use client"

import { useState } from "react"
import { Plus, Search, Calendar, Mail, MessageSquare, Smartphone, MoreVertical, Eye, Edit, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { CreateNewsletterSheet } from "@/components/newsletters/create-newsletter-sheet"
import { NewsletterDetails } from "@/components/newsletters/newsletter-details"
import { useNewsletters, useDeleteNewsletter } from "@/lib/api/hooks/use-newsletters"
import { Newsletter } from "@/lib/api/services/newsletter.service"

export default function NewslettersPage() {
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState("")
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)
    const [selectedNewsletter, setSelectedNewsletter] = useState<Newsletter | null>(null)

    const { data, isLoading } = useNewsletters(page, 100) // Increased limit for now
    const deleteNewsletter = useDeleteNewsletter()

    const newsletters = data?.data?.data || []

    // Basic client-side filtering since API search wasn't explicitly requested/confirmed
    const filteredNewsletters = newsletters.filter(n =>
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.content.toLowerCase().includes(search.toLowerCase())
    )

    const handleEdit = (newsletter: Newsletter) => {
        setSelectedNewsletter(newsletter)
        setIsCreateOpen(true)
    }

    const handleView = (newsletter: Newsletter) => {
        setSelectedNewsletter(newsletter)
        setIsDetailsOpen(true)
    }

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this newsletter?")) {
            deleteNewsletter.mutate(id)
        }
    }

    const handleCreate = () => {
        setSelectedNewsletter(null)
        setIsCreateOpen(true)
    }

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

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Newsletters</h1>
                    <p className="text-muted-foreground">Manage and send marketing campaigns to your users.</p>
                </div>
                <Button onClick={handleCreate} className="bg-primary text-white">
                    <Plus className="mr-2 h-4 w-4" /> Create Newsletter
                </Button>
            </div>

            <Card>
                <CardHeader className="p-4">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search newsletters..."
                            className="pl-8 sm:w-[300px]"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : filteredNewsletters.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-center p-6">
                            <div className="rounded-full bg-muted/30 p-4 mb-4">
                                <Mail className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="font-semibold text-lg">No newsletters found</h3>
                            <p className="text-muted-foreground text-sm max-w-sm mt-1">
                                Get started by creating your first newsletter campaign.
                            </p>
                            <Button variant="link" onClick={handleCreate} className="mt-2 text-primary">
                                Create New
                            </Button>
                        </div>
                    ) : (
                        <div className="divide-y divide-border">
                            {filteredNewsletters.map((newsletter) => (
                                <div key={newsletter.id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                                    <div className="flex items-start gap-4 flex-1 min-w-0">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                                            {getMediumIcon(newsletter.medium)}
                                        </div>
                                        <div className="space-y-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-semibold truncate">{newsletter.title}</h4>
                                                {!newsletter.is_active && (
                                                    <Badge variant="secondary" className="text-[10px] h-5">Inactive</Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {newsletter.date || "No date set"}
                                                </span>
                                                <span className="capitalize">{newsletter.medium.replace("_", " ")}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button size="sm" variant="outline" onClick={() => handleView(newsletter)} className="hidden sm:flex">
                                            View & Send
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button size="icon" variant="ghost">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => handleView(newsletter)}>
                                                    <Eye className="mr-2 h-4 w-4" /> View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleEdit(newsletter)}>
                                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete(newsletter.id)}>
                                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <CreateNewsletterSheet
                open={isCreateOpen}
                onOpenChange={setIsCreateOpen}
                newsletter={selectedNewsletter}
            />

            <NewsletterDetails
                open={isDetailsOpen}
                onOpenChange={setIsDetailsOpen}
                newsletter={selectedNewsletter}
            />
        </div>
    )
}
