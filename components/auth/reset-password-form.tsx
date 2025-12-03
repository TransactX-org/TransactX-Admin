"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Loader2, CheckCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useResetPassword } from "@/lib/api/hooks/use-auth"

export function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token") || ""
  const email = searchParams.get("email") || ""

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({})

  const resetPasswordMutation = useResetPassword()
  const isLoading = resetPasswordMutation.isPending

  const validateForm = () => {
    const newErrors: { password?: string; confirmPassword?: string } = {}

    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      newErrors.password = "Password must contain uppercase, lowercase, and number"
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    if (!token || !email) {
      setErrors({ password: "Invalid reset link. Please request a new one." })
      return
    }

    resetPasswordMutation.mutate(
      {
        token,
        email,
        password,
        password_confirmation: confirmPassword,
      },
      {
        onSuccess: () => {
          setIsSuccess(true)
        },
      }
    )
  }

  if (isSuccess) {
    return (
      <Card className="border-0 shadow-none animate-slide-up">
        <CardHeader className="text-center pb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Password Updated!</CardTitle>
          <CardDescription className="text-gray-600">
            Your password has been successfully updated. You can now sign in with your new password.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            <Link href="/login">
              <Button className="w-full h-12 tx-bg-primary hover:opacity-90 transition-all duration-200 text-base font-semibold">
                Sign In to Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-none animate-slide-up">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-bold text-gray-900">Set New Password</CardTitle>
        <CardDescription className="text-gray-600">
          Create a strong password to secure your TransactX admin account
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-semibold text-gray-700">New Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your new password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setErrors({ ...errors, password: undefined })
                }}
                className={`h-12 text-base ${errors.password ? "border-destructive" : "border-gray-300 focus:border-tx-primary"}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value)
                  setErrors({ ...errors, confirmPassword: undefined })
                }}
                className={`h-12 text-base ${errors.confirmPassword ? "border-destructive" : "border-gray-300 focus:border-tx-primary"}`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Password Requirements:</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li className={`flex items-center ${password.length >= 8 ? 'text-green-600' : ''}`}>
                <span className="mr-2">•</span>
                At least 8 characters
              </li>
              <li className={`flex items-center ${/(?=.*[a-z])/.test(password) ? 'text-green-600' : ''}`}>
                <span className="mr-2">•</span>
                One lowercase letter
              </li>
              <li className={`flex items-center ${/(?=.*[A-Z])/.test(password) ? 'text-green-600' : ''}`}>
                <span className="mr-2">•</span>
                One uppercase letter
              </li>
              <li className={`flex items-center ${/(?=.*\d)/.test(password) ? 'text-green-600' : ''}`}>
                <span className="mr-2">•</span>
                One number
              </li>
            </ul>
          </div>

          <Button
            type="submit"
            className="w-full h-12 tx-bg-primary hover:opacity-90 transition-all duration-200 text-base font-semibold"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Updating Password...
              </>
            ) : (
              "Update Password"
            )}
          </Button>
          
          <div className="text-center">
            <Link href="/login">
              <Button
                variant="ghost"
                className="text-sm font-medium tx-text-primary hover:underline transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Login
              </Button>
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
