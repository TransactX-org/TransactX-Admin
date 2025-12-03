import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getUsers, getUserStats, getUserById, createUser, updateUser, deleteUser } from "../services/user.service"
import type { CreateUserPayload } from "../types"
import { useToast } from "@/hooks/use-toast"

// Query keys
export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (filters: Record<string, any>) => [...userKeys.lists(), { filters }] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  stats: () => [...userKeys.all, "stats"] as const,
}

// Get all users
export const useUsers = (page: number = 1, perPage: number = 15) => {
  return useQuery({
    queryKey: userKeys.list({ page, perPage }),
    queryFn: () => getUsers(page, perPage),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// Get user stats
export const useUserStats = () => {
  return useQuery({
    queryKey: userKeys.stats(),
    queryFn: getUserStats,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// Get single user
export const useUser = (id: string | null) => {
  return useQuery({
    queryKey: userKeys.detail(id || ""),
    queryFn: () => getUserById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// Create user mutation
export const useCreateUser = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (payload: CreateUserPayload) => createUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
      queryClient.invalidateQueries({ queryKey: userKeys.stats() })
      toast({
        title: "Success",
        description: "User created successfully",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create user",
        variant: "destructive",
      })
    },
  })
}

// Update user mutation
export const useUpdateUser = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CreateUserPayload> }) => updateUser(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: userKeys.stats() })
      toast({
        title: "Success",
        description: "User updated successfully",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update user",
        variant: "destructive",
      })
    },
  })
}

// Delete user mutation
export const useDeleteUser = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
      queryClient.invalidateQueries({ queryKey: userKeys.stats() })
      toast({
        title: "Success",
        description: "User deleted successfully",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete user",
        variant: "destructive",
      })
    },
  })
}

