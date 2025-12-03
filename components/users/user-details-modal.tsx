"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Phone, MapPin, Calendar, Activity, Loader2 } from "lucide-react"
import { useUser } from "@/lib/api/hooks/use-users"
import { format } from "date-fns"

interface UserDetailsModalProps {
  userId: string | null
  onClose: () => void
}

export function UserDetailsModal({ userId, onClose }: UserDetailsModalProps) {
  const { data, isLoading, error } = useUser(userId)
  const user = data?.data?.user

  if (!userId) return null

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "default"
      case "SUSPENDED":
      case "INACTIVE":
        return "destructive"
      case "NEW":
        return "secondary"
      default:
        return "outline"
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy 'at' HH:mm")
    } catch {
      return dateString
    }
  }

  return (
    <Dialog open={!!userId} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>Complete information about this user</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-destructive">Failed to load user details. Please try again.</p>
          </div>
        ) : !user ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">User not found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* User Header */}
            <div className="flex items-start gap-4">
              <Avatar className="h-20 w-20 bg-tx-primary/10">
                <AvatarImage src={user.avatar || undefined} />
                <AvatarFallback className="tx-bg-primary text-white text-2xl font-semibold">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-2xl font-bold">{user.name}</h3>
                <p className="text-muted-foreground">{user.email}</p>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline">{user.user_type}</Badge>
                  <Badge variant={getStatusBadgeVariant(user.status)}>{user.status}</Badge>
                </div>
              </div>
            </div>

            <Separator />

            {/* Tabs */}
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="info">Information</TabsTrigger>
                <TabsTrigger value="wallet">Wallet</TabsTrigger>
                <TabsTrigger value="subscription">Subscription</TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="space-y-4">
                <Card className="border border-border/50">
                  <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="font-medium">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Phone</p>
                          <p className="font-medium">{user.phone_number || "N/A"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Country</p>
                          <p className="font-medium">{user.country}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Join Date</p>
                          <p className="font-medium">{formatDate(user.created_at)}</p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold">{user.total_transactions || 0}</p>
                        <p className="text-sm text-muted-foreground">Transactions</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{user.linked_accounts_count || 0}</p>
                        <p className="text-sm text-muted-foreground">Linked Accounts</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{user.referrals_count || 0}</p>
                        <p className="text-sm text-muted-foreground">Referrals</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="wallet" className="space-y-4">
                <Card className="border border-border/50">
                  <CardContent className="p-6 space-y-4">
                    {user.has_wallet ? (
                      <>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Wallet Balance</p>
                          <p className="text-3xl font-bold">₦{user.wallet_balance?.toLocaleString() || "0.00"}</p>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Has Transaction PIN</p>
                            <p className="font-medium">{user.has_transaction_pin ? "Yes" : "No"}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Has Panic PIN</p>
                            <p className="font-medium">{user.has_panic_pin ? "Yes" : "No"}</p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-muted-foreground">User does not have a wallet</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="subscription" className="space-y-4">
                {user.subscription ? (
                  <Card className="border border-border/50">
                    <CardContent className="p-6 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Status</p>
                          <Badge variant={user.subscription.status === "ACTIVE" ? "default" : "secondary"}>
                            {user.subscription.status}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Billing</p>
                          <p className="font-medium">{user.subscription.billing}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Start Date</p>
                          <p className="font-medium">{formatDate(user.subscription.start_date)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">End Date</p>
                          <p className="font-medium">{formatDate(user.subscription.end_date)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Auto Renew</p>
                          <p className="font-medium">{user.subscription.is_auto_renew ? "Yes" : "No"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Method</p>
                          <p className="font-medium">{user.subscription.method}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">User does not have an active subscription</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            {/* Actions */}
            <div className="flex gap-2">
              <Button className="flex-1 tx-bg-primary hover:opacity-90">Edit User</Button>
              <Button variant="outline" className="flex-1 bg-transparent">
                Suspend Account
              </Button>
              <Button variant="destructive" className="flex-1">
                Delete User
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
