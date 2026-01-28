 "use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { FadeIn } from "@/components/motion-wrapper"
import {
  Search,
  MoreVertical,
  UserCheck,
  UserX,
  Trash2,
  Mail,
  Building2,
  IdCard,
  ImageIcon,
  Loader2,
  Users
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAdminAgents, usePendingAgents } from "@/hooks/use-admin-agents"
import { useAdminUsers } from "@/hooks/use-admin-users"
import { approveAgent, deleteAgent, rejectAgent, PendingAgent } from "@/lib/admin-agents"
import { useToast } from "@/hooks/use-toast"
import { Textarea } from "@/components/ui/textarea"
import type { UserRole, UserStatus } from "@/lib/admin-users"

type StatusFilter = "all" | "ACTIVE" | "PENDING" | "SUSPENDED" | "REJECTED"
type UserStatusFilter = "all" | UserStatus
type UserRoleFilter = "all" | UserRole

export function UserManagement() {
  const { toast } = useToast()

  const { agents, isLoading, error, refresh } = useAdminAgents()
  const {
    pendingAgents,
    isLoading: isLoadingPending,
    error: pendingError,
    refresh: refreshPending,
  } = usePendingAgents()

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")

  const [userSearch, setUserSearch] = useState("")
  const [userRoleFilter, setUserRoleFilter] = useState<UserRoleFilter>("all")
  const [userStatusFilter, setUserStatusFilter] = useState<UserStatusFilter>("all")

  const [selectedPendingAgent, setSelectedPendingAgent] = useState<PendingAgent | null>(null)
  const [showKycDialog, setShowKycDialog] = useState(false)

  const [actionAgentId, setActionAgentId] = useState<string | null>(null)
  const [actionNotes, setActionNotes] = useState("")
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isActionLoading, setIsActionLoading] = useState(false)

  const {
    users,
    isLoading: isUsersLoading,
    error: usersError,
    refresh: refreshUsers,
  } = useAdminUsers()

  const filteredAgents = useMemo(() => {
    return agents.filter((agent) => {
      const matchesSearch =
        !search ||
        agent.email.toLowerCase().includes(search.toLowerCase()) ||
        agent.phone.toLowerCase().includes(search.toLowerCase())

      const matchesStatus =
        statusFilter === "all" ? true : agent.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [agents, search, statusFilter])

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        !userSearch ||
        user.email.toLowerCase().includes(userSearch.toLowerCase()) ||
        (user.phone || "").toLowerCase().includes(userSearch.toLowerCase())

      const matchesRole =
        userRoleFilter === "all" ? true : user.role === userRoleFilter

      const matchesStatus =
        userStatusFilter === "all" ? true : user.status === userStatusFilter

      return matchesSearch && matchesRole && matchesStatus
    })
  }, [users, userSearch, userRoleFilter, userStatusFilter])

  const handleOpenKycDialog = (agentId: string) => {
    const pending = pendingAgents.find((p) => p.id === agentId)
    if (!pending) {
      toast({
        title: "No KYC submission found",
        description: "This agent does not have a pending KYC submission.",
      })
      return
    }
    setSelectedPendingAgent(pending)
    setShowKycDialog(true)
  }

  const handleApprove = async () => {
    if (!actionAgentId) return
    setIsActionLoading(true)
    try {
      await approveAgent(actionAgentId, actionNotes.trim())
      toast({
        title: "Agent approved",
        description: "The agent has been approved successfully.",
      })
      setIsApproveDialogOpen(false)
      setActionAgentId(null)
      setActionNotes("")
      await Promise.all([refresh(), refreshPending()])
    } catch (err) {
      toast({
        title: "Failed to approve agent",
        description:
          err instanceof Error ? err.message : "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleReject = async () => {
    if (!actionAgentId) return
    setIsActionLoading(true)
    try {
      await rejectAgent(actionAgentId, actionNotes.trim())
      toast({
        title: "Agent rejected",
        description: "The agent has been rejected.",
      })
      setIsRejectDialogOpen(false)
      setActionAgentId(null)
      setActionNotes("")
      await Promise.all([refresh(), refreshPending()])
    } catch (err) {
      toast({
        title: "Failed to reject agent",
        description:
          err instanceof Error ? err.message : "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!actionAgentId) return
    setIsActionLoading(true)
    try {
      await deleteAgent(actionAgentId)
      toast({
        title: "Agent deleted",
        description: "The agent has been deleted from the platform.",
      })
      setIsDeleteDialogOpen(false)
      setActionAgentId(null)
      await Promise.all([refresh(), refreshPending()])
    } catch (err) {
      toast({
        title: "Failed to delete agent",
        description:
          err instanceof Error ? err.message : "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsActionLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return {
          variant: "default" as const,
          className: "bg-green-100 text-green-800 hover:bg-green-100",
        }
      case "PENDING":
        return {
          variant: "secondary" as const,
          className: "bg-amber-100 text-amber-800 hover:bg-amber-100",
        }
      case "SUSPENDED":
      case "REJECTED":
        return {
          variant: "destructive" as const,
          className: "",
        }
      default:
        return {
          variant: "outline" as const,
          className: "",
        }
    }
  }

  const isLoadingAny = isLoading || isLoadingPending

  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="pb-4 border-b">
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            User Management
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Manage agents and users on the platform.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
            <Input
              placeholder="Search by email or phone..."
              className="pl-10 h-11 border-2 focus:border-primary/50 shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(value: StatusFilter) => setStatusFilter(value)}
          >
            <SelectTrigger className="w-full sm:w-[200px] h-11 border-2">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="SUSPENDED">Suspended</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </FadeIn>

      <FadeIn delay={0.2}>
        <Tabs defaultValue="agents">
          <TabsList className="bg-muted/50 p-1 border-2">
            <TabsTrigger
              value="agents"
              className="flex-1 sm:flex-none cursor-pointer data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white font-semibold transition-all"
            >
              Agents ({filteredAgents.length})
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="flex-1 sm:flex-none cursor-pointer data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white font-semibold transition-all"
            >
              Users ({filteredUsers.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="agents" className="mt-6">
            <Card className="border-2 shadow-lg">
              <CardContent className="p-0">
                {isLoadingAny && (
                  <div className="p-8 text-center text-sm text-muted-foreground bg-muted/30">
                    Loading agents and pending KYC submissions…
                  </div>
                )}

                {!isLoadingAny && (error || pendingError) && (
                  <div className="p-6 flex items-center justify-between gap-4 bg-destructive/5 border-b-2 border-destructive/20">
                    <div className="text-sm font-medium text-destructive">
                      Failed to load agents. Please try again.
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        void refresh()
                        void refreshPending()
                      }}
                      className="border-2 hover:bg-destructive hover:text-destructive-foreground"
                    >
                      Retry
                    </Button>
                  </div>
                )}

                {!isLoadingAny && !error && filteredAgents.length === 0 && (
                  <div className="p-12 text-center bg-gradient-to-br from-muted/50 to-muted/30">
                    <div className="h-16 w-16 mx-auto rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center mb-4">
                      <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">No agents found</h3>
                    <p className="text-sm text-muted-foreground">
                      No agents found matching your filters.
                    </p>
                  </div>
                )}

                {!isLoadingAny && !error && filteredAgents.length > 0 && (
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50 hover:bg-muted/50">
                        <TableHead className="font-semibold">Agent</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold">Phone</TableHead>
                        <TableHead className="font-semibold">Created</TableHead>
                        <TableHead className="w-[70px] font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAgents.map((agent) => {
                        const badge = getStatusBadge(agent.status)
                        const pendingKyc = pendingAgents.find((p) => p.id === agent.id)
                        return (
                          <TableRow
                            key={agent.id}
                            className="hover:bg-muted/30 transition-colors border-b border-border/50"
                          >
                            <TableCell className="py-4">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-11 w-11 border-2 border-border shadow-sm">
                                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white font-semibold">
                                    {agent.email
                                      .split("@")[0]
                                      .slice(0, 2)
                                      .toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-semibold text-base">{agent.email}</p>
                                  <p className="text-xs text-muted-foreground mt-0.5">
                                    {agent.role} • {agent.id.slice(0, 8)}…
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={badge.variant}
                                className={`${badge.className} font-semibold px-2.5 py-1 border-2`}
                              >
                                {agent.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm font-medium">{agent.phone || "—"}</TableCell>
                            <TableCell className="text-xs text-muted-foreground font-medium">
                              {new Date(agent.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="hover:bg-purple-50 hover:text-purple-600 dark:hover:bg-purple-950/30"
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Mail className="h-4 w-4 mr-2" />
                                    Send Email
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Building2 className="h-4 w-4 mr-2" />
                                    View Listings
                                  </DropdownMenuItem>
                                  {pendingKyc && (
                                    <DropdownMenuItem
                                      onClick={() => handleOpenKycDialog(agent.id)}
                                    >
                                      <IdCard className="h-4 w-4 mr-2" />
                                      Review KYC
                                    </DropdownMenuItem>
                                  )}
                                  {agent.status === "PENDING" && (
                                    <>
                                      <DropdownMenuItem
                                        className="text-green-700 dark:text-green-400 font-semibold focus:bg-green-50 dark:focus:bg-green-950/30"
                                        onClick={() => {
                                          setActionAgentId(agent.id)
                                          setActionNotes("")
                                          setIsApproveDialogOpen(true)
                                        }}
                                      >
                                        <UserCheck className="h-4 w-4 mr-2" />
                                        Approve Agent
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        className="text-red-700 dark:text-red-400 font-semibold focus:bg-red-50 dark:focus:bg-red-950/30"
                                        onClick={() => {
                                          setActionAgentId(agent.id)
                                          setActionNotes("")
                                          setIsRejectDialogOpen(true)
                                        }}
                                      >
                                        <UserX className="h-4 w-4 mr-2" />
                                        Reject Agent
                                      </DropdownMenuItem>
                                    </>
                                  )}
                                  <DropdownMenuItem
                                    className="text-red-700 dark:text-red-400 font-semibold focus:bg-red-50 dark:focus:bg-red-950/30"
                                    onClick={() => {
                                      setActionAgentId(agent.id)
                                      setIsDeleteDialogOpen(true)
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Agent
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <Card className="border-2 shadow-lg">
              <CardContent className="p-0">
                <div className="p-4 sm:p-6 border-b-2 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                      <Input
                        placeholder="Search by email or phone..."
                        className="pl-10 h-11 border-2 focus:border-primary/50 shadow-sm"
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <Select
                      value={userRoleFilter}
                      onValueChange={(value: UserRoleFilter) => setUserRoleFilter(value)}
                    >
                      <SelectTrigger className="w-full sm:w-[160px] h-11 border-2">
                        <SelectValue placeholder="All roles" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All roles</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                        <SelectItem value="AGENT">Agent</SelectItem>
                        <SelectItem value="CLIENT">Client</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={userStatusFilter}
                      onValueChange={(value: UserStatusFilter) => setUserStatusFilter(value)}
                    >
                      <SelectTrigger className="w-full sm:w-[180px] h-11 border-2">
                        <SelectValue placeholder="All statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All statuses</SelectItem>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                        <SelectItem value="REJECTED">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {isUsersLoading && (
                  <div className="p-8 text-center text-sm text-muted-foreground bg-muted/30">
                    Loading users…
                  </div>
                )}

                {!isUsersLoading && usersError && (
                  <div className="p-6 flex items-center justify-between gap-4 bg-destructive/5 border-b-2 border-destructive/20">
                    <div className="text-sm font-medium text-destructive">
                      Failed to load users. Please try again.
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        void refreshUsers()
                      }}
                      className="border-2 hover:bg-destructive hover:text-destructive-foreground"
                    >
                      Retry
                    </Button>
                  </div>
                )}

                {!isUsersLoading && !usersError && filteredUsers.length === 0 && (
                  <div className="p-12 text-center bg-gradient-to-br from-muted/50 to-muted/30">
                    <div className="h-16 w-16 mx-auto rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center mb-4">
                      <Users className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">No users found</h3>
                    <p className="text-sm text-muted-foreground">
                      No users found matching your filters.
                    </p>
                  </div>
                )}

                {!isUsersLoading && !usersError && filteredUsers.length > 0 && (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50 hover:bg-muted/50">
                          <TableHead className="font-semibold">User</TableHead>
                          <TableHead className="font-semibold">Role</TableHead>
                          <TableHead className="font-semibold">Status</TableHead>
                          <TableHead className="font-semibold">Phone</TableHead>
                          <TableHead className="font-semibold">Joined</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.map((user) => {
                          const badge = getStatusBadge(user.status)
                          return (
                            <TableRow
                              key={user.id}
                              className="hover:bg-muted/30 transition-colors border-b border-border/50"
                            >
                              <TableCell className="py-4">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-11 w-11 border-2 border-border shadow-sm">
                                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-semibold">
                                      {user.email
                                        .split("@")[0]
                                        .slice(0, 2)
                                        .toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-semibold text-base break-all">{user.email}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                      ID: {user.id.slice(0, 8)}…
                                    </p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="text-xs sm:text-sm">
                                <Badge
                                  variant="outline"
                                  className="uppercase font-semibold px-2.5 py-1 border-2"
                                >
                                  {user.role}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={badge.variant}
                                  className={`${badge.className} font-semibold px-2.5 py-1 border-2`}
                                >
                                  {user.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm font-medium">
                                {user.phone && user.phone.trim() !== "" ? user.phone : "—"}
                              </TableCell>
                              <TableCell className="text-xs text-muted-foreground font-medium">
                                {new Date(user.created_at).toLocaleDateString()}
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </FadeIn>

      {/* KYC Review Dialog */}
      <Dialog
        open={showKycDialog && !!selectedPendingAgent}
        onOpenChange={(open) => {
          setShowKycDialog(open)
          if (!open) setSelectedPendingAgent(null)
        }}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedPendingAgent && (
            <>
              <DialogHeader>
                <DialogTitle>Review KYC for {selectedPendingAgent.email}</DialogTitle>
                <DialogDescription>
                  Verify the identity documents and selfie before approving or rejecting this agent.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 sm:grid-cols-2 mt-4 text-sm">
                <div className="space-y-1.5">
                  <p className="font-medium">Agent Details</p>
                  <p className="text-muted-foreground break-all">
                    <span className="font-medium text-foreground">Email:</span>{" "}
                    {selectedPendingAgent.email}
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Phone:</span>{" "}
                    {selectedPendingAgent.phone || "—"}
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Status:</span>{" "}
                    {selectedPendingAgent.status}
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Created:</span>{" "}
                    {new Date(selectedPendingAgent.created_at).toLocaleString()}
                  </p>
                </div>

                {selectedPendingAgent.kyc_submission && (
                  <div className="space-y-1.5">
                    <p className="font-medium">KYC Submission</p>
                    <p className="text-muted-foreground">
                      <span className="font-medium text-foreground">Full Name:</span>{" "}
                      {selectedPendingAgent.kyc_submission.full_name || "Unknown"}
                    </p>
                    <p className="text-muted-foreground">
                      <span className="font-medium text-foreground">Submitted:</span>{" "}
                      {selectedPendingAgent.kyc_submission.submitted_at
                        ? new Date(
                            selectedPendingAgent.kyc_submission.submitted_at
                          ).toLocaleString()
                        : "—"}
                    </p>
                  </div>
                )}
              </div>

              {selectedPendingAgent.kyc_submission ? (
                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  {[
                    {
                      label: "ID Front",
                      src: selectedPendingAgent.kyc_submission.id_front_path,
                    },
                    {
                      label: "ID Back",
                      src: selectedPendingAgent.kyc_submission.id_back_path,
                    },
                    {
                      label: "Selfie",
                      src: selectedPendingAgent.kyc_submission.selfie_path,
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-lg border bg-muted/40 overflow-hidden flex flex-col"
                    >
                      <div className="px-3 py-2 flex items-center gap-2 border-b bg-background/60">
                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs font-medium">{item.label}</span>
                      </div>
                      <div className="relative aspect-[3/4] bg-muted flex items-center justify-center">
                        {item.src ? (
                          <Image
                            src={item.src}
                            alt={`${item.label} for ${selectedPendingAgent.email}`}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <p className="text-xs text-muted-foreground text-center px-2">
                            No {item.label.toLowerCase()} uploaded
                          </p>
                        )}
                      </div>
                      {item.src && (
                        <a
                          href={item.src}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-2 text-xs text-primary hover:underline text-center border-t bg-background/60"
                        >
                          Open full image
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-5 p-4 rounded-lg bg-muted/40 text-sm text-muted-foreground flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  No KYC images have been submitted for this agent yet.
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Approve Agent Dialog */}
      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Agent</DialogTitle>
            <DialogDescription>
              Optionally add internal notes about this approval. The agent will be marked as
              active.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={actionNotes}
            onChange={(e) => setActionNotes(e.target.value)}
            placeholder="Notes for this approval (optional)"
            className="mt-2"
          />
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setIsApproveDialogOpen(false)
                setActionNotes("")
              }}
              disabled={isActionLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleApprove} disabled={isActionLoading}>
              {isActionLoading ? "Approving..." : "Approve Agent"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Agent Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Agent</DialogTitle>
            <DialogDescription>
              Provide a clear reason for rejecting this agent. This will be stored as admin
              notes.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={actionNotes}
            onChange={(e) => setActionNotes(e.target.value)}
            placeholder="Reason for rejection (required)"
            className="mt-2"
          />
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setIsRejectDialogOpen(false)
                setActionNotes("")
              }}
              disabled={isActionLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isActionLoading || !actionNotes.trim()}
            >
              {isActionLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <UserX className="h-4 w-4 mr-2" />
              )}
              {isActionLoading ? "Rejecting..." : "Reject Agent"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Agent Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Agent</DialogTitle>
            <DialogDescription>
              This will permanently remove the agent from the platform. This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isActionLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isActionLoading}
            >
              {isActionLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              {isActionLoading ? "Deleting..." : "Delete Agent"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

