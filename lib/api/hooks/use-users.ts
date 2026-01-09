import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getUsers,
  getUserStats,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserTransactions,
  getUserVirtualBankAccounts,
  getUserLinkedAccounts,
  getUserWallet,
  getUserSubscription
} from "../services/user.service"
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
  transactions: (id: string) => [...userKeys.detail(id), "transactions"] as const,
  virtualBankAccounts: (id: string) => [...userKeys.detail(id), "virtual-bank-accounts"] as const,
  linkedAccounts: (id: string) => [...userKeys.detail(id), "linked-accounts"] as const,
  wallet: (id: string) => [...userKeys.detail(id), "wallet"] as const,
  subscription: (id: string) => [...userKeys.detail(id), "subscription"] as const,
}

// Get all users
export const useUsers = (
  page: number = 1,
  perPage: number = 15,
  filters?: {
    search?: string
    status?: string
    kyc_status?: string
    kyb_status?: string
    user_type?: string
    account_type?: string
    is_active?: string | number | boolean
    country?: string
    email_verified?: string | number | boolean
    start_date?: string
    end_date?: string
  }
) => {
  return useQuery({
    queryKey: userKeys.list({ page, perPage, ...filters }),
    queryFn: () => getUsers(page, perPage, filters),
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

// Get user transactions
export const useUserTransactions = (id: string | null, page: number = 1, perPage: number = 15) => {
  return useQuery({
    queryKey: [...userKeys.transactions(id || ""), { page, perPage }],
    queryFn: () => getUserTransactions(id!, page, perPage),
    enabled: !!id,
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

// Get user virtual bank accounts
export const useUserVirtualBankAccounts = (id: string | null, page: number = 1, perPage: number = 15) => {
  return useQuery({
    queryKey: [...userKeys.virtualBankAccounts(id || ""), { page, perPage }],
    queryFn: () => getUserVirtualBankAccounts(id!, page, perPage),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// Get user linked accounts
export const useUserLinkedAccounts = (id: string | null, page: number = 1, perPage: number = 15) => {
  return useQuery({
    queryKey: [...userKeys.linkedAccounts(id || ""), { page, perPage }],
    queryFn: () => getUserLinkedAccounts(id!, page, perPage),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// Get user wallet
export const useUserWallet = (id: string | null) => {
  return useQuery({
    queryKey: userKeys.wallet(id || ""),
    queryFn: () => getUserWallet(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

// Get user subscription
export const useUserSubscription = (id: string | null) => {
  return useQuery({
    queryKey: userKeys.subscription(id || ""),
    queryFn: () => getUserSubscription(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

