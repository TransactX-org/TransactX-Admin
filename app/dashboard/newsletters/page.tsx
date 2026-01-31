"use client"

import { useState } from "react"
import { Plus, Search, Calendar, Mail, MessageSquare, Smartphone, MoreVertical, Eye, Edit, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { cn } from "@/lib/utils"

export default function NewslettersPage() {
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState("")
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)
    const [selectedNewsletter, setSelectedNewsletter] = useState<Newsletter | null>(null)

    const { data, isLoading } = useNewsletters(page, 100)
    const deleteNewsletter = useDeleteNewsletter()

    const newsletters = data?.data?.newsletters || []

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
        <div className="flex flex-col h-full bg-muted/5 sm:bg-background">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Newsletters</h1>
                    <p className="text-sm text-muted-foreground hidden sm:block">Manage and send marketing campaigns.</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative flex-1 sm:w-[250px]">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search..."
                            className="pl-9 h-9 bg-muted/50 border-border/50 rounded-full focus:bg-background transition-all"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Button onClick={handleCreate} size="sm" className="bg-primary text-white rounded-full px-4 shadow-sm hover:shadow-md transition-all">
                        <Plus className="h-4 w-4 sm:mr-2" /> <span className="hidden sm:inline">Create</span>
                    </Button>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : filteredNewsletters.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center p-6 bg-card rounded-2xl border border-border/50 shadow-sm">
                        <div className="rounded-full bg-primary/10 p-4 mb-4">
                            <Mail className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="font-semibold text-lg">No newsletters found</h3>
                        <p className="text-muted-foreground text-sm max-w-sm mt-1">
                            Get started by creating your first newsletter campaign.
                        </p>
                        <Button variant="link" onClick={handleCreate} className="mt-2 text-primary font-medium">
                            Create New
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredNewsletters.map((newsletter) => (
                            <div
                                key={newsletter.id}
                                className="group relative bg-card hover:bg-card/80 border border-border/50 hover:border-primary/20 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col"
                            >
                                {/* Banner / Header Visual */}
                                <div className="h-32 bg-muted/30 relative overflow-hidden">
                                    {newsletter.banner_image ? (
                                        <img
                                            src={newsletter.banner_image}
                                            alt="Banner"
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
                                            <div className="h-12 w-12 rounded-2xl bg-background/50 backdrop-blur-sm flex items-center justify-center text-primary/40">
                                                {getMediumIcon(newsletter.medium)}
                                            </div>
                                        </div>
                                    )}
                                    <div className="absolute top-3 right-3 flex gap-2">
                                        <Badge
                                            variant={newsletter.is_active ? "default" : "secondary"}
                                            className={cn(
                                                "backdrop-blur-md shadow-sm border-none",
                                                newsletter.is_active ? "bg-green-500/90 text-white" : "bg-black/50 text-white"
                                            )}
                                        >
                                            {newsletter.is_active ? "Active" : "Draft"}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4 flex-1 flex flex-col">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <div className="flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wider">
                                            {getMediumIcon(newsletter.medium)}
                                            <span>{newsletter.medium.replace("_", " ")}</span>
                                        </div>
                                        <span className="text-[10px] text-muted-foreground flex items-center gap-1 bg-muted/50 px-2 py-0.5 rounded-full">
                                            <Calendar className="h-3 w-3" />
                                            {newsletter.date || "Unscheduled"}
                                        </span>
                                    </div>

                                    <h3 className="font-semibold text-lg leading-tight mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                        {newsletter.title}
                                    </h3>

                                    <div className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                                        {newsletter.medium === 'email' ? (
                                            <span dangerouslySetInnerHTML={{ __html: newsletter.content.replace(/<[^>]+>/g, '') }} />
                                        ) : (
                                            newsletter.content
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 mt-auto pt-4 border-t border-border/50">
                                        <Button
                                            size="sm"
                                            className="flex-1 bg-muted/50 hover:bg-primary hover:text-white text-foreground rounded-lg transition-all"
                                            onClick={() => handleView(newsletter)}
                                        >
                                            View & Send
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg hover:bg-muted">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-40 rounded-xl">
                                                <DropdownMenuItem onClick={() => handleEdit(newsletter)}>
                                                    <Edit className="mr-2 h-3.5 w-3.5" /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete(newsletter.id)}>
                                                    <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

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
