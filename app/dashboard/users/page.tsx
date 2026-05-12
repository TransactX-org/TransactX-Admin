"use client"

import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { UsersTable } from "@/components/users/users-table"
import { UsersFilters } from "@/components/users/users-filters"
import { UserStats } from "@/components/users/user-stats"
import { Button } from "@/components/ui/button"
import { UserPlus } from "lucide-react"
import { CreateUserDialog } from "@/components/users/create-user-dialog"

export default function UsersPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [openCreateDialog, setOpenCreateDialog] = useState(false)

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    status: searchParams.get("status") || "",
    kyc_status: searchParams.get("kyc_status") || "",
    kyb_status: searchParams.get("kyb_status") || "",
    user_type: searchParams.get("user_type") || "",
    account_type: searchParams.get("account_type") || "",
    is_active: searchParams.get("is_active") || "",
    country: searchParams.get("country") || "",
    email_verified: searchParams.get("email_verified") || "",
    start_date: searchParams.get("start_date") || "",
    end_date: searchParams.get("end_date") || "",
  })

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    const updated = { ...filters, ...newFilters }
    setFilters(updated)
    const params = new URLSearchParams()
    Object.entries(updated).forEach(([key, value]) => {
      if (value) params.set(key, value)
    })
    const query = params.toString()
    router.replace(query ? `?${query}` : "?", { scroll: false })
  }

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground mt-1 text-xs sm:text-base">Manage user accounts and permissions</p>
        </div>
        <Button
          className="tx-bg-primary hover:opacity-90 w-full sm:w-auto"
          onClick={() => setOpenCreateDialog(true)}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add New User
        </Button>
      </div>

      <CreateUserDialog
        open={openCreateDialog}
        onOpenChange={setOpenCreateDialog}
      />

      <UserStats />
      <UsersFilters
        filters={filters}
        onFilterChange={handleFilterChange}
      />
      <UsersTable
        filters={filters}
      />
    </div>
  )
}
