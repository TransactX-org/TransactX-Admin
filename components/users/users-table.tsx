"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Edit, Ban, Trash2 } from "lucide-react"
import { UserDetailsModal } from "./user-details-modal"

const mockUsers = [
  {
    id: "USR001",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "User",
    status: "active",
    joinDate: "2025-01-15",
    transactions: 45,
  },
  {
    id: "USR002",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "Admin",
    status: "active",
    joinDate: "2024-12-20",
    transactions: 128,
  },
  {
    id: "USR003",
    name: "Mike Johnson",
    email: "mike.j@example.com",
    role: "User",
    status: "active",
    joinDate: "2025-02-10",
    transactions: 23,
  },
  {
    id: "USR004",
    name: "Sarah Williams",
    email: "sarah.w@example.com",
    role: "Moderator",
    status: "active",
    joinDate: "2025-03-05",
    transactions: 67,
  },
  {
    id: "USR005",
    name: "David Brown",
    email: "david.b@example.com",
    role: "User",
    status: "suspended",
    joinDate: "2024-11-30",
    transactions: 12,
  },
  {
    id: "USR006",
    name: "Emily Davis",
    email: "emily.d@example.com",
    role: "User",
    status: "active",
    joinDate: "2025-04-12",
    transactions: 89,
  },
]

export function UsersTable() {
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [selectedUser, setSelectedUser] = useState<string | null>(null)

  const toggleRowSelection = (id: string) => {
    setSelectedRows((prev) => (prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]))
  }

  const toggleAllRows = () => {
    setSelectedRows((prev) => (prev.length === mockUsers.length ? [] : mockUsers.map((u) => u.id)))
  }

  return (
    <>
      <Card className="border-2">
        <CardHeader className="pb-3 sm:pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <CardTitle className="text-lg sm:text-xl">All Users</CardTitle>
            {selectedRows.length > 0 && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <span className="text-xs sm:text-sm text-muted-foreground">{selectedRows.length} selected</span>
                <Button variant="outline" size="sm" className="w-full sm:w-auto">
                  Bulk Actions
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-6 sm:w-12">
                    <Checkbox 
                      checked={selectedRows.length === mockUsers.length} 
                      onCheckedChange={toggleAllRows}
                      className="h-3 w-3 sm:h-4 sm:w-4"
                    />
                  </TableHead>
                  <TableHead className="text-xs sm:text-sm">User</TableHead>
                  <TableHead className="text-xs sm:text-sm">Email</TableHead>
                  <TableHead className="text-xs sm:text-sm">Role</TableHead>
                  <TableHead className="text-xs sm:text-sm">Status</TableHead>
                  <TableHead className="text-xs sm:text-sm">Transactions</TableHead>
                  <TableHead className="text-xs sm:text-sm">Join Date</TableHead>
                  <TableHead className="text-right text-xs sm:text-sm">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-accent transition-colors cursor-pointer">
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.includes(user.id)}
                        onCheckedChange={() => toggleRowSelection(user.id)}
                        className="h-3 w-3 sm:h-4 sm:w-4"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                          <AvatarImage src={`/placeholder-32px.png?height=32&width=32`} />
                          <AvatarFallback className="text-xs sm:text-sm">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-xs sm:text-sm truncate">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs sm:text-sm truncate">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">{user.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.status === "active"
                            ? "default"
                            : user.status === "suspended"
                              ? "destructive"
                              : "secondary"
                        }
                        className="text-xs"
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium text-xs sm:text-sm">{user.transactions}</TableCell>
                    <TableCell className="text-xs sm:text-sm text-muted-foreground">{user.joinDate}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6 sm:h-8 sm:w-8">
                            <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedUser(user.id)}>
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Ban className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                            Suspend
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-3 sm:gap-4">
            <p className="text-xs sm:text-sm text-muted-foreground">Showing 1 to {mockUsers.length} of 156 users</p>
            <div className="flex items-center gap-1 sm:gap-2">
              <Button variant="outline" size="sm" disabled className="text-xs sm:text-sm">
                Previous
              </Button>
              <Button variant="outline" size="sm" className="tx-bg-primary text-white bg-transparent text-xs sm:text-sm">
                1
              </Button>
              <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                2
              </Button>
              <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                3
              </Button>
              <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <UserDetailsModal userId={selectedUser} onClose={() => setSelectedUser(null)} />
    </>
  )
}
