import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { login, forgotPassword, resetPassword, logout, updateProfile, changePassword } from "../services/auth.service"
import type { LoginPayload, ForgotPasswordPayload, ResetPasswordPayload, UpdateProfilePayload, ChangePasswordPayload } from "../services/auth.service"
import { useToast } from "@/hooks/use-toast"
import { useState, useEffect } from "react"

// Login mutation
export const useLogin = () => {
  const router = useRouter()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: (response) => {
      // Check if the response indicates success
      if (!response.success) {
        toast({
          title: "Login failed",
          description: response.message || "Invalid email or password",
          variant: "destructive",
        })
        return
      }

      const token = response.data.token
      const user = {
        id: response.data.id || "",
        name: response.data.name,
        email: response.data.email,
        role: response.data.role,
        is_super_admin: response.data.is_super_admin,
        // Captured so the UI can hide features the admin cannot access.
        // Safe if the API omits it (undefined -> gating degrades to show-all).
        permissions: response.data.permissions ?? [],
      }

      // Store token and user
      if (typeof window !== "undefined") {
        localStorage.setItem("auth_token", token)
        localStorage.setItem("user", JSON.stringify(user))
      }

      // Invalidate all queries to refetch with new auth
      queryClient.invalidateQueries()

      toast({
        title: "Login successful",
        description: `Welcome back, ${user.name}!`,
      })

      router.push("/dashboard")
    },
    onError: (error: any) => {
      toast({
        title: "Login failed",
        description: error.response?.data?.message || "Invalid email or password",
        variant: "destructive",
      })
    },
  })
}

// Forgot password mutation
export const useForgotPassword = () => {
  const { toast } = useToast()

  return useMutation({
    mutationFn: (payload: ForgotPasswordPayload) => forgotPassword(payload),
    onSuccess: () => {
      toast({
        title: "Reset link sent",
        description: "Check your email for password reset instructions",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to send reset link",
        variant: "destructive",
      })
    },
  })
}

// Reset password mutation
export const useResetPassword = () => {
  const router = useRouter()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) => resetPassword(payload),
    onSuccess: () => {
      toast({
        title: "Password reset successful",
        description: "Your password has been reset. Please login with your new password.",
      })
      router.push("/login")
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to reset password",
        variant: "destructive",
      })
    },
  })
}

// Logout function
export const useLogout = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return () => {
    logout()
    queryClient.clear()
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    })
    router.push("/login")
  }
}

export const useCurrentUser = () => {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser))
        } catch (e) {
          console.error("Failed to parse user from local storage", e)
        }
      }
    }
  }, [])

  return user
}

// Update profile mutation
export const useUpdateProfile = () => {
  const { toast } = useToast()

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => updateProfile(payload),
    onSuccess: (response) => {
      const admin = response.data?.admin
      if (admin && typeof window !== "undefined") {
        const stored = localStorage.getItem("user")
        const current = stored ? JSON.parse(stored) : {}
        localStorage.setItem("user", JSON.stringify({
          ...current,
          name: `${admin.first_name ?? current.first_name} ${admin.last_name ?? current.last_name}`.trim(),
          email: admin.email ?? current.email,
        }))
      }
      toast({ title: "Profile updated", description: "Your profile has been saved." })
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error.response?.data?.message || "Failed to update profile",
        variant: "destructive",
      })
    },
  })
}

// Change password mutation
export const useChangePassword = () => {
  const { toast } = useToast()

  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => changePassword(payload),
    onSuccess: () => {
      toast({ title: "Password changed", description: "Your password has been updated." })
    },
    onError: (error: any) => {
      toast({
        title: "Change failed",
        description: error.response?.data?.message || "Failed to change password",
        variant: "destructive",
      })
    },
  })
}
