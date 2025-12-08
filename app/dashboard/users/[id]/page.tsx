"use client"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Activity, Loader2, Edit, Ban, Trash2, CreditCard, Link as LinkIcon, Wallet as WalletIcon } from "lucide-react"
import {
  useUser,
  useDeleteUser,
  useUserTransactions,
  useUserVirtualBankAccounts,
  useUserLinkedAccounts,
  useUserWallet,
  useUserSubscription
} from "@/lib/api/hooks/use-users"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function UserDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const userId = params.id as string

  const { data, isLoading, error } = useUser(userId)
  const deleteUserMutation = useDeleteUser()
  const user = data?.data?.user

  // Fetch additional data
  const { data: transactionsData, isLoading: transactionsLoading } = useUserTransactions(userId, 1, 10)
  const { data: virtualAccountsData, isLoading: virtualAccountsLoading } = useUserVirtualBankAccounts(userId, 1, 10)
  const { data: linkedAccountsData, isLoading: linkedAccountsLoading } = useUserLinkedAccounts(userId, 1, 10)
  const { data: walletData, isLoading: walletLoading } = useUserWallet(userId)
  const { data: subscriptionData, isLoading: subscriptionLoading } = useUserSubscription(userId)

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

  const handleDeleteUser = async () => {
    if (confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      try {
        await deleteUserMutation.mutateAsync(userId)
        toast({
          title: "User deleted",
          description: "User has been successfully deleted",
        })
        router.push("/dashboard/users")
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete user",
          variant: "destructive",
        })
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="p-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-destructive">Failed to load user details. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Users
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" size="sm">
            <Ban className="h-4 w-4 mr-2" />
            Suspend
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDeleteUser}
            disabled={deleteUserMutation.isPending}
          >
            {deleteUserMutation.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4 mr-2" />
            )}
            Delete
          </Button>
        </div>
      </div>

      {/* User Header Card */}
      <Card className="border border-border/50">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <Avatar className="h-24 w-24 bg-tx-primary/10 ring-4 ring-white shadow-lg">
              <AvatarImage src={user.avatar || undefined} />
              <AvatarFallback className="tx-bg-primary text-white text-3xl font-semibold">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
              <p className="text-muted-foreground mb-3 break-all">{user.email}</p>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                <Badge variant="outline">{user.user_type}</Badge>
                <Badge variant="outline">{user.account_type}</Badge>
                <Badge variant={getStatusBadgeVariant(user.status)}>{user.status}</Badge>
                {user.is_active && <Badge variant="default" className="bg-green-500">Active</Badge>}
                {user.email_verified_at && <Badge variant="secondary">Email Verified</Badge>}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border border-border/50">
          <CardContent className="p-6 text-center">
            <p className="text-3xl font-bold">{user.total_transactions || 0}</p>
            <p className="text-sm text-muted-foreground mt-1">Total Transactions</p>
          </CardContent>
        </Card>
        <Card className="border border-border/50">
          <CardContent className="p-6 text-center">
            <p className="text-3xl font-bold">{user.linked_accounts_count || 0}</p>
            <p className="text-sm text-muted-foreground mt-1">Linked Accounts</p>
          </CardContent>
        </Card>
        <Card className="border border-border/50">
          <CardContent className="p-6 text-center">
            <p className="text-3xl font-bold">{user.referrals_count || 0}</p>
            <p className="text-sm text-muted-foreground mt-1">Referrals</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="info">Information</TabsTrigger>
          <TabsTrigger value="wallet">Wallet</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-4 mt-4">
          <Card className="border border-border/50">
            <CardHeader>
              <CardTitle>User Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-tx-primary mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-muted-foreground mb-1">Email</p>
                    <p className="font-medium break-all">{user.email}</p>
                    {user.email_verified_at && (
                      <Badge variant="secondary" className="text-xs mt-1">Verified</Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-tx-primary mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-muted-foreground mb-1">Username</p>
                    <p className="font-medium">{user.username || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-tx-primary mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-muted-foreground mb-1">Country</p>
                    <p className="font-medium">{user.country}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-tx-primary mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-muted-foreground mb-1">Join Date</p>
                    <p className="font-medium">{formatDate(user.created_at)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Activity className="h-5 w-5 text-tx-primary mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-muted-foreground mb-1">Referral Code</p>
                    <p className="font-medium">{user.referral_code || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-tx-primary mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-muted-foreground mb-1">Last Device</p>
                    <p className="font-medium">{user.last_logged_in_device || "N/A"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wallet" className="space-y-4 mt-4">
          <Card className="border border-border/50">
            <CardHeader>
              <CardTitle>Wallet Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {walletLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : walletData?.data?.wallet || user.wallet ? (
                <>
                  <div className="text-center p-8 rounded-lg bg-gradient-to-br from-tx-primary/10 to-tx-secondary/10">
                    <p className="text-sm text-muted-foreground mb-2">Wallet Balance</p>
                    <p className="text-4xl font-bold tx-text-primary">
                      ₦{(walletData?.data?.wallet?.balance || user.wallet?.balance || 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {walletData?.data?.wallet?.currency || user.wallet?.currency || "NGN"}
                    </p>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Has Transaction PIN</p>
                      <Badge variant={user.has_transaction_pin ? "default" : "secondary"}>
                        {user.has_transaction_pin ? "Yes" : "No"}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Has Panic PIN</p>
                      <Badge variant={user.has_panic_pin ? "default" : "secondary"}>
                        {user.has_panic_pin ? "Yes" : "No"}
                      </Badge>
                    </div>
                    {walletData?.data?.wallet?.id && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Wallet ID</p>
                        <p className="font-medium text-xs break-all">{walletData.data.wallet.id}</p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">User does not have a wallet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscription" className="space-y-4 mt-4">
          <Card className="border border-border/50">
            <CardHeader>
              <CardTitle>Subscription Details</CardTitle>
            </CardHeader>
            <CardContent>
              {subscriptionLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : subscriptionData?.data?.subscription || user.subscription ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {(() => {
                    const sub = subscriptionData?.data?.subscription || user.subscription
                    return (
                      <>
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Status</p>
                          <Badge variant={sub.status === "ACTIVE" ? "default" : "secondary"}>
                            {sub.status}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Billing</p>
                          <p className="font-medium">{sub.billing}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Start Date</p>
                          <p className="font-medium">{formatDate(sub.start_date)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">End Date</p>
                          <p className="font-medium">{formatDate(sub.end_date)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Auto Renew</p>
                          <Badge variant={sub.is_auto_renew ? "default" : "secondary"}>
                            {sub.is_auto_renew ? "Yes" : "No"}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Method</p>
                          <p className="font-medium">{sub.method}</p>
                        </div>
                      </>
                    )
                  })()}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">User does not have an active subscription</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4 mt-4">
          <Card className="border border-border/50">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              {transactionsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : transactionsData?.data?.data && transactionsData.data.data.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Reference</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactionsData.data.data.map((transaction: any) => (
                        <TableRow key={transaction.id || transaction.reference}>
                          <TableCell className="font-medium text-xs">{transaction.reference}</TableCell>
                          <TableCell>{transaction.type}</TableCell>
                          <TableCell>₦{transaction.amount?.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge variant={transaction.status === "SUCCESS" ? "default" : "secondary"}>
                              {transaction.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs">{formatDate(transaction.created_at || transaction.date)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No transactions found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accounts" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Virtual Bank Accounts */}
            <Card className="border border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Virtual Bank Accounts
                </CardTitle>
              </CardHeader>
              <CardContent>
                {virtualAccountsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : virtualAccountsData?.data?.data && virtualAccountsData.data.data.length > 0 ? (
                  <div className="space-y-4">
                    {virtualAccountsData.data.data.map((account: any, index: number) => (
                      <div key={account.id || index} className="p-4 rounded-lg border border-border/50">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium">{account.bank_name}</p>
                          <Badge variant="secondary">{account.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Account Number</p>
                        <p className="font-mono font-bold text-lg">{account.account_number}</p>
                        <p className="text-xs text-muted-foreground mt-2">{account.account_name}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground">No virtual accounts found</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Linked Accounts */}
            <Card className="border border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LinkIcon className="h-5 w-5" />
                  Linked Accounts
                </CardTitle>
              </CardHeader>
              <CardContent>
                {linkedAccountsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : linkedAccountsData?.data?.data && linkedAccountsData.data.data.length > 0 ? (
                  <div className="space-y-4">
                    {linkedAccountsData.data.data.map((account: any, index: number) => (
                      <div key={account.id || index} className="p-4 rounded-lg border border-border/50">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium">{account.bank_name}</p>
                          <Badge variant="secondary">{account.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Account Number</p>
                        <p className="font-mono font-bold">{account.account_number}</p>
                        <p className="text-xs text-muted-foreground mt-2">{account.account_name}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground">No linked accounts found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
