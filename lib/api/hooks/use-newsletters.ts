import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
    getNewsletters,
    getNewsletter,
    createNewsletter,
    updateNewsletter,
    sendNewsletter,
    deleteNewsletter,
    CreateNewsletterDTO,
    UpdateNewsletterDTO,
    SendNewsletterDTO
} from "../services/newsletter.service"
import { useToast } from "@/hooks/use-toast"

// Query keys
export const newsletterKeys = {
    all: ["newsletters"] as const,
    lists: () => [...newsletterKeys.all, "list"] as const,
    list: (page: number, perPage: number) => [...newsletterKeys.lists(), { page, perPage }] as const,
    details: () => [...newsletterKeys.all, "detail"] as const,
    detail: (id: string) => [...newsletterKeys.details(), id] as const,
}

// Get all newsletters
export const useNewsletters = (page: number = 1, perPage: number = 15) => {
    return useQuery({
        queryKey: newsletterKeys.list(page, perPage),
        queryFn: () => getNewsletters(page, perPage),
        staleTime: 1000 * 60 * 5, // 5 minutes
    })
}

// Get single newsletter
export const useNewsletter = (id: string) => {
    return useQuery({
        queryKey: newsletterKeys.detail(id),
        queryFn: () => getNewsletter(id),
        enabled: !!id,
    })
}

// Create newsletter
export const useCreateNewsletter = () => {
    const queryClient = useQueryClient()
    const { toast } = useToast()

    return useMutation({
        mutationFn: (data: CreateNewsletterDTO) => createNewsletter(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: newsletterKeys.lists() })
            toast({
                title: "Success",
                description: "Newsletter created successfully",
            })
        },
        onError: (error: any) => {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.response?.data?.message || "Failed to create newsletter",
            })
        },
    })
}

// Update newsletter
export const useUpdateNewsletter = () => {
    const queryClient = useQueryClient()
    const { toast } = useToast()

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateNewsletterDTO }) => updateNewsletter(id, data),
        onSuccess: (response, { id }) => {
            queryClient.invalidateQueries({ queryKey: newsletterKeys.lists() })
            queryClient.invalidateQueries({ queryKey: newsletterKeys.detail(id) })
            toast({
                title: "Success",
                description: "Newsletter updated successfully",
            })
        },
        onError: (error: any) => {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.response?.data?.message || "Failed to update newsletter",
            })
        },
    })
}

// Send newsletter
export const useSendNewsletter = () => {
    const { toast } = useToast()

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: SendNewsletterDTO }) => sendNewsletter(id, data),
        onSuccess: () => {
            toast({
                title: "Success",
                description: "Newsletter sent successfully",
            })
        },
        onError: (error: any) => {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.response?.data?.message || "Failed to send newsletter",
            })
        },
    })
}

// Delete newsletter
export const useDeleteNewsletter = () => {
    const queryClient = useQueryClient()
    const { toast } = useToast()

    return useMutation({
        mutationFn: (id: string) => deleteNewsletter(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: newsletterKeys.lists() })
            toast({
                title: "Success",
                description: "Newsletter deleted successfully",
            })
        },
        onError: (error: any) => {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.response?.data?.message || "Failed to delete newsletter",
            })
        },
    })
}
