"use client"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Activity, Loader2, Edit, Ban, Trash2, CreditCard, Link as LinkIcon, Wallet as WalletIcon, MoreHorizontal, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"
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
    <div className="space-y-6 p-4 sm:p-6 animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Button variant="ghost" onClick={() => router.back()} className="h-9 w-fit px-0 hover:bg-transparent text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Users
        </Button>

        <div className="flex items-center gap-2">
          {/* Desktop Actions */}
          <div className="hidden sm:flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9 rounded-xl border-border/40 hover:bg-muted/50">
              <Edit className="h-4 w-4 mr-2 text-muted-foreground" />
              Edit Profile
            </Button>
            <Button variant="outline" size="sm" className="h-9 rounded-xl border-border/40 hover:bg-muted/50">
              <Ban className="h-4 w-4 mr-2 text-muted-foreground" />
              Suspend
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="h-9 rounded-xl px-4"
              onClick={handleDeleteUser}
              disabled={deleteUserMutation.isPending}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete User
            </Button>
          </div>

          {/* Mobile Actions Dropdown */}
          <div className="sm:hidden flex-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full h-10 rounded-xl border-border/40 justify-between px-4">
                  <span className="font-semibold">Manage Account</span>
                  <MoreHorizontal className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[calc(100vw-32px)] rounded-2xl border-border/40 shadow-xl p-2 mt-2">
                <DropdownMenuItem className="rounded-xl py-3 gap-3">
                  <Edit className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Edit Details</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-xl py-3 gap-3">
                  <Ban className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Suspend Access</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1 bg-border/40" />
                <DropdownMenuItem
                  className="rounded-xl py-3 gap-3 text-destructive focus:text-destructive focus:bg-destructive/5"
                  onClick={handleDeleteUser}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="font-medium">Delete Permanently</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* User Header Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="border-border/40 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
                <div className="relative">
                  <Avatar className="h-28 w-28 sm:h-32 sm:w-32 ring-4 ring-background border-4 border-border/10 shadow-xl">
                    <AvatarImage src={user.avatar || undefined} />
                    <AvatarFallback className="tx-bg-primary text-white text-4xl font-bold">
                      {user.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {user.is_active && (
                    <div className="absolute bottom-1 right-1 h-6 w-6 rounded-full bg-emerald-500 border-4 border-background" title="Active Now" />
                  )}
                </div>
                <div className="flex-1 text-center sm:text-left space-y-4">
                  <div>
                    <h1 className="text-2xl sm:text-4xl font-black tracking-tight">{user.name}</h1>
                    <p className="text-sm sm:text-base text-muted-foreground font-medium mt-1">@{user.username || "username"}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                    <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-muted border border-border/40 text-muted-foreground uppercase tracking-widest">
                      {user.user_type}
                    </span>
                    <Badge variant={getStatusBadgeVariant(user.status)} className="font-bold text-[10px] px-3 py-1 rounded-full border shadow-none">
                      {user.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-4 text-xs font-bold text-muted-foreground uppercase tracking-tighter">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      Joined {formatDate(user.created_at)}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
          <Card className="border-border/40 bg-card/30 backdrop-blur-sm rounded-3xl p-6 flex flex-col items-center justify-center text-center">
            <p className="text-3xl sm:text-4xl font-black tx-text-primary tracking-tighter">{user.total_transactions || 0}</p>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mt-2">Transactions</p>
          </Card>
          <Card className="border-border/40 bg-card/30 backdrop-blur-sm rounded-3xl p-6 flex flex-col items-center justify-center text-center">
            <p className="text-3xl sm:text-4xl font-black text-foreground tracking-tighter">{user.linked_accounts_count || 0}</p>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mt-2">Accounts</p>
          </Card>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="info" className="w-full">
        <div className="overflow-x-auto pb-4 -mx-4 px-4 sm:px-0 sm:pb-0 scrollbar-hide">
          <TabsList className="flex items-center gap-1.5 w-fit sm:w-full min-w-full sm:grid sm:grid-cols-5 p-1 bg-muted/30 rounded-2xl border border-border/40">
            <TabsTrigger value="info" className="rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none transition-all">Info</TabsTrigger>
            <TabsTrigger value="wallet" className="rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none transition-all">Wallet</TabsTrigger>
            <TabsTrigger value="subscription" className="rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none transition-all">Sub</TabsTrigger>
            <TabsTrigger value="transactions" className="rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none transition-all">History</TabsTrigger>
            <TabsTrigger value="accounts" className="rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none transition-all">Banks</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="info" className="space-y-4 mt-6">
          <Card className="border-border/40 bg-card/30 backdrop-blur-sm rounded-3xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-black uppercase tracking-widest text-muted-foreground/70">Personal Details</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Full Name</p>
                  <p className="text-base font-bold">{user.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Email Address</p>
                  <p className="text-base font-bold break-all">{user.email}</p>
                  {user.email_verified_at && (
                    <div className="flex items-center gap-1.5 text-emerald-500 mt-1">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span className="text-[10px] font-black uppercase">Verified</span>
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Phone Number</p>
                  <p className="text-base font-bold">{user.phone || "Not Provided"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Country</p>
                  <p className="text-base font-bold">{user.country || "N/A"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Account Type</p>
                  <p className="text-base font-bold">{user.account_type || "Standard"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Last Login Device</p>
                  <p className="text-base font-bold truncate">{user.last_logged_in_device || "Unknown"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wallet" className="space-y-4 mt-6">
          <Card className="border-border/40 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-black uppercase tracking-widest text-muted-foreground/70">Wallet Account</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {walletLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : walletData?.data?.wallet || user.wallet ? (
                <div className="space-y-8">
                  <div className="relative overflow-hidden p-8 rounded-2xl bg-gradient-to-br from-tx-primary to-tx-primary/80 text-white shadow-xl">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                      <WalletIcon className="h-32 w-32" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-2">Available Balance</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold opacity-60">₦</span>
                      <p className="text-5xl font-black tracking-tighter">
                        {(walletData?.data?.wallet?.balance || user.wallet?.balance || 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="mt-8 flex items-center gap-4">
                      <div className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-md">
                        <p className="text-[10px] font-bold uppercase tracking-widest">{walletData?.data?.wallet?.currency || user.wallet?.currency || "NGN"}</p>
                      </div>
                      <Badge variant="outline" className="border-white/30 text-white font-bold text-[10px]">
                        {user.has_transaction_pin ? "PIN SECURED" : "PIN NOT SET"}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="p-4 rounded-xl border border-border/40 bg-muted/20">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Has Panic PIN</p>
                      <p className="text-sm font-bold">{user.has_panic_pin ? "ENABLED" : "NOT CONFIGURED"}</p>
                    </div>
                    {walletData?.data?.wallet?.id && (
                      <div className="p-4 rounded-xl border border-border/40 bg-muted/20">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Internal wallet Id</p>
                        <p className="text-[10px] font-mono font-bold break-all opacity-70">{walletData.data.wallet.id}</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 border border-dashed border-border/40 rounded-2xl">
                  <p className="text-sm text-muted-foreground font-medium">No wallet found for this user</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscription" className="space-y-4 mt-6">
          <Card className="border-border/40 bg-card/30 backdrop-blur-sm rounded-3xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-black uppercase tracking-widest text-muted-foreground/70">Subscription Plan</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {subscriptionLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : subscriptionData?.data?.subscription || user.subscription ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(() => {
                    const sub = subscriptionData?.data?.subscription || user.subscription
                    return (
                      <>
                        <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Status</p>
                          <Badge variant={sub.status === "ACTIVE" ? "default" : "secondary"} className="font-bold">
                            {sub.status}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Billing Cycle</p>
                          <p className="text-base font-bold">{sub.billing}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Payment Method</p>
                          <p className="text-base font-bold truncate">{sub.method}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Period Start</p>
                          <p className="text-base font-bold">{formatDate(sub.start_date)}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Next renewal</p>
                          <p className="text-base font-bold text-tx-primary">{formatDate(sub.end_date)}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Auto-Renew</p>
                          <p className="text-base font-bold">{sub.is_auto_renew ? "ENABLED" : "OFF"}</p>
                        </div>
                      </>
                    )
                  })()}
                </div>
              ) : (
                <div className="text-center py-12 border border-dashed border-border/40 rounded-2xl">
                  <p className="text-sm text-muted-foreground font-medium">No active subscription</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4 mt-6">
          <Card className="border-border/40 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-black uppercase tracking-widest text-muted-foreground/70">Recent History</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {transactionsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : transactionsData?.data?.data && transactionsData.data.data.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow className="border-none">
                        <TableHead className="text-[10px] font-black uppercase tracking-widest py-4">Reference</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest py-4">Type</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest py-4">Amount</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest py-4">Status</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest py-4">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactionsData.data.data.map((transaction: any) => (
                        <TableRow key={transaction.id || transaction.reference} className="border-b-border/40 hover:bg-muted/20">
                          <TableCell className="font-mono text-[10px] font-bold py-4">#{transaction.reference?.slice(0, 8)}...</TableCell>
                          <TableCell>
                            <span className="text-[10px] font-bold px-2 py-1 rounded bg-muted border border-border/40 uppercase">
                              {transaction.type}
                            </span>
                          </TableCell>
                          <TableCell className="font-bold">₦{transaction.amount?.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge variant={transaction.status === "SUCCESS" ? "default" : "secondary"} className="text-[10px] font-bold">
                              {transaction.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-[10px] font-bold text-muted-foreground">{formatDate(transaction.created_at || transaction.date)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-sm text-muted-foreground font-medium">No transaction history found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accounts" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Virtual Bank Accounts */}
            <Card className="border-border/40 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg font-black uppercase tracking-widest text-muted-foreground/70">
                  <CreditCard className="h-5 w-5 opacity-60" />
                  Virtual Accounts
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {virtualAccountsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : virtualAccountsData?.data?.data && virtualAccountsData.data.data.length > 0 ? (
                  <div className="space-y-4">
                    {virtualAccountsData.data.data.map((account: any, index: number) => (
                      <div key={account.id || index} className="p-5 rounded-2xl border border-border/40 bg-muted/10 group hover:bg-muted/20 transition-all">
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-sm font-black uppercase tracking-tight">{account.bank_name}</p>
                          <Badge variant="outline" className="text-[10px] font-bold border-border/40 bg-background/50">
                            {account.status}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Account Number</p>
                          <p className="font-mono font-black text-xl tracking-tighter tx-text-primary">{account.account_number}</p>
                        </div>
                        <p className="text-[10px] font-bold text-muted-foreground mt-3 uppercase tracking-tighter opacity-80">{account.account_name}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border border-dashed border-border/40 rounded-2xl">
                    <p className="text-sm text-muted-foreground font-medium">No virtual accounts</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Linked Accounts */}
            <Card className="border-border/40 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg font-black uppercase tracking-widest text-muted-foreground/70">
                  <LinkIcon className="h-5 w-5 opacity-60" />
                  Linked Accounts
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {linkedAccountsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : linkedAccountsData?.data?.data && linkedAccountsData.data.data.length > 0 ? (
                  <div className="space-y-4">
                    {linkedAccountsData.data.data.map((account: any, index: number) => (
                      <div key={account.id || index} className="p-5 rounded-2xl border border-border/40 bg-muted/10 group hover:bg-muted/20 transition-all">
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-sm font-black uppercase tracking-tight">{account.bank_name}</p>
                          <Badge variant="outline" className="text-[10px] font-bold border-border/40 bg-background/50">
                            {account.status}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Account Number</p>
                          <p className="font-mono font-black text-xl tracking-tighter text-foreground">{account.account_number}</p>
                        </div>
                        <p className="text-[10px] font-bold text-muted-foreground mt-3 uppercase tracking-tighter opacity-80">{account.account_name}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border border-dashed border-border/40 rounded-2xl">
                    <p className="text-sm text-muted-foreground font-medium">No linked accounts</p>
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
