import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
    getAdmins,
    getAdminStats,
    getAdmin,
    createAdmin,
    updateAdminRole,
    deleteAdmin,
    getAdminRoles
} from "../services/admin-management.service"
import type { UpdateAdminRolePayload, CreateAdminPayload } from "../types"
import { useToast } from "@/hooks/use-toast"

// Query keys
export const adminKeys = {
    all: ["admins"] as const,
    lists: () => [...adminKeys.all, "list"] as const,
    list: (params: any) => [...adminKeys.lists(), params] as const,
    stats: () => [...adminKeys.all, "stats"] as const,
    details: () => [...adminKeys.all, "detail"] as const,
    detail: (id: string) => [...adminKeys.details(), id] as const,
    roles: () => [...adminKeys.all, "roles"] as const,
}

/**
 * Hook to get all admin roles
 */
export const useAdminRoles = () => {
    return useQuery({
        queryKey: adminKeys.roles(),
        queryFn: getAdminRoles,
        staleTime: 1000 * 60 * 60, // 1 hour
    })
}

/**
 * Hook to get a paginated list of admins
 */
export const useAdmins = (page: number = 1, perPage: number = 15) => {
    return useQuery({
        queryKey: adminKeys.list({ page, perPage }),
        queryFn: () => getAdmins(page, perPage),
        staleTime: 1000 * 60 * 5,
    })
}

/**
 * Hook to get admin statistics
 */
export const useAdminStats = () => {
    return useQuery({
        queryKey: adminKeys.stats(),
        queryFn: getAdminStats,
        staleTime: 1000 * 60 * 5,
    })
}

/**
 * Hook to get details for a specific admin
 */
export const useAdmin = (id: string | null) => {
    return useQuery({
        queryKey: adminKeys.detail(id || ""),
        queryFn: () => getAdmin(id!),
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
    })
}

/**
 * Hook to create a new admin
 */
export const useCreateAdmin = () => {
    const queryClient = useQueryClient()
    const { toast } = useToast()

    return useMutation({
        mutationFn: (payload: CreateAdminPayload) => createAdmin(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: adminKeys.lists() })
            queryClient.invalidateQueries({ queryKey: adminKeys.stats() })
            toast({
                title: "Success",
                description: "Admin created successfully",
            })
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to create admin",
                variant: "destructive",
            })
        },
    })
}

/**
 * Hook to update an admin's role and permissions
 */
export const useUpdateAdminRole = () => {
    const queryClient = useQueryClient()
    const { toast } = useToast()

    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: UpdateAdminRolePayload }) =>
            updateAdminRole(id, payload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: adminKeys.detail(variables.id) })
            queryClient.invalidateQueries({ queryKey: adminKeys.lists() })
            toast({
                title: "Success",
                description: "Admin role and permissions updated successfully",
            })
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to update admin role",
                variant: "destructive",
            })
        },
    })
}

/**
 * Hook to delete an admin
 */
export const useDeleteAdmin = () => {
    const queryClient = useQueryClient()
    const { toast } = useToast()

    return useMutation({
        mutationFn: (id: string) => deleteAdmin(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: adminKeys.lists() })
            queryClient.invalidateQueries({ queryKey: adminKeys.stats() })
            toast({
                title: "Success",
                description: "Admin deleted successfully",
            })
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to delete admin",
                variant: "destructive",
            })
        },
    })
}
