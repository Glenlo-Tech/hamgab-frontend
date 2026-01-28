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
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage agents and users on the platform.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by email or phone..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(value: StatusFilter) => setStatusFilter(value)}
          >
            <SelectTrigger className="w-full sm:w-[200px]">
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
          <TabsList className="">
            <TabsTrigger value="agents" className="flex-1 sm:flex-none cursor-pointer">
              Agents ({filteredAgents.length})
            </TabsTrigger>
            <TabsTrigger value="users" className="flex-1 sm:flex-none cursor-pointer">
              Users ({filteredUsers.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="agents" className="mt-6">
            <Card>
              <CardContent className="p-0">
                {isLoadingAny && (
                  <div className="p-6 text-sm text-muted-foreground">
                    Loading agents and pending KYC submissions…
                  </div>
                )}

                {!isLoadingAny && (error || pendingError) && (
                  <div className="p-6 flex items-center justify-between gap-4">
                    <div className="text-sm text-destructive">
                      Failed to load agents. Please try again.
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        void refresh()
                        void refreshPending()
                      }}
                    >
                      Retry
                    </Button>
                  </div>
                )}

                {!isLoadingAny && !error && filteredAgents.length === 0 && (
                  <div className="p-8 text-center text-sm text-muted-foreground">
                    No agents found matching your filters.
                  </div>
                )}

                {!isLoadingAny && !error && filteredAgents.length > 0 && (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Agent</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="w-[70px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAgents.map((agent) => {
                        const badge = getStatusBadge(agent.status)
                        const pendingKyc = pendingAgents.find((p) => p.id === agent.id)
                        return (
                          <TableRow key={agent.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9">
                                  <AvatarFallback>
                                    {agent.email
                                      .split("@")[0]
                                      .slice(0, 2)
                                      .toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{agent.email}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {agent.role} • {agent.id.slice(0, 8)}…
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={badge.variant} className={badge.className}>
                                {agent.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm">{agent.phone || "—"}</TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {new Date(agent.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
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
                                        className="text-green-600"
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
                                        className="text-destructive"
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
                                    className="text-destructive"
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
            <Card>
              <CardContent className="p-0">
                <div className="p-4 sm:p-6 border-b flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by email or phone..."
                        className="pl-9"
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
                      <SelectTrigger className="w-full sm:w-[160px]">
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
                      <SelectTrigger className="w-full sm:w-[180px]">
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
                  <div className="p-6 text-sm text-muted-foreground">
                    Loading users…
                  </div>
                )}

                {!isUsersLoading && usersError && (
                  <div className="p-6 flex items-center justify-between gap-4">
                    <div className="text-sm text-destructive">
                      Failed to load users. Please try again.
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        void refreshUsers()
                      }}
                    >
                      Retry
                    </Button>
                  </div>
                )}

                {!isUsersLoading && !usersError && filteredUsers.length === 0 && (
                  <div className="p-8 text-center text-sm text-muted-foreground">
                    No users found matching your filters.
                  </div>
                )}

                {!isUsersLoading && !usersError && filteredUsers.length > 0 && (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Joined</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.map((user) => {
                          const badge = getStatusBadge(user.status)
                          return (
                            <TableRow key={user.id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-9 w-9">
                                    <AvatarFallback>
                                      {user.email
                                        .split("@")[0]
                                        .slice(0, 2)
                                        .toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium break-all">{user.email}</p>
                                    <p className="text-xs text-muted-foreground">
                                      ID: {user.id.slice(0, 8)}…
                                    </p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="text-xs sm:text-sm">
                                <Badge variant="outline" className="uppercase">
                                  {user.role}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant={badge.variant} className={badge.className}>
                                  {user.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm">
                                {user.phone && user.phone.trim() !== "" ? user.phone : "—"}
                              </TableCell>
                              <TableCell className="text-xs text-muted-foreground">
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

