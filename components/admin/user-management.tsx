"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { FadeIn } from "@/components/motion-wrapper"
import { Search, MoreVertical, UserCheck, UserX, Mail, Building2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState } from "react"

const users = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Owner",
    status: "Active",
    properties: 3,
    joined: "Jan 15, 2025",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "Tenant",
    status: "Active",
    properties: 1,
    joined: "Feb 20, 2025",
  },
  {
    id: 3,
    name: "Bob Wilson",
    email: "bob@example.com",
    role: "Owner",
    status: "Suspended",
    properties: 0,
    joined: "Mar 10, 2025",
  },
]

const agents = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah@hamgab.com",
    status: "Active",
    listings: 24,
    approved: 19,
    pending: 5,
    earnings: "$12,450",
    joined: "Nov 10, 2024",
  },
  {
    id: 2,
    name: "Mike Chen",
    email: "mike@hamgab.com",
    status: "Active",
    listings: 18,
    approved: 15,
    pending: 3,
    earnings: "$9,800",
    joined: "Dec 5, 2024",
  },
  {
    id: 3,
    name: "Emily Davis",
    email: "emily@hamgab.com",
    status: "Pending",
    listings: 5,
    approved: 3,
    pending: 2,
    earnings: "$2,100",
    joined: "Jan 8, 2026",
  },
]

export function UserManagement() {
  const [selectedUser, setSelectedUser] = useState<(typeof users)[0] | (typeof agents)[0] | null>(null)
  const [showSuspendDialog, setShowSuspendDialog] = useState(false)

  return (
    <div className="space-y-6">
      <FadeIn>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground mt-1">Manage users and agents on the platform</p>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by name or email..." className="pl-9" />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </FadeIn>

      <FadeIn delay={0.2}>
        <Tabs defaultValue="users">
          <TabsList>
            <TabsTrigger value="users">Users ({users.length})</TabsTrigger>
            <TabsTrigger value="agents">Agents ({agents.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-6">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Properties</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarFallback>
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{user.role}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={user.status === "Active" ? "default" : "destructive"}
                            className={user.status === "Active" ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.properties}</TableCell>
                        <TableCell>{user.joined}</TableCell>
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
                                View Properties
                              </DropdownMenuItem>
                              {user.status === "Active" ? (
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => {
                                    setSelectedUser(user)
                                    setShowSuspendDialog(true)
                                  }}
                                >
                                  <UserX className="h-4 w-4 mr-2" />
                                  Suspend User
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem className="text-green-600">
                                  <UserCheck className="h-4 w-4 mr-2" />
                                  Activate User
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="agents" className="mt-6">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Agent</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Listings</TableHead>
                      <TableHead>Approved</TableHead>
                      <TableHead>Earnings</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {agents.map((agent) => (
                      <TableRow key={agent.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarFallback>
                                {agent.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{agent.name}</p>
                              <p className="text-sm text-muted-foreground">{agent.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={agent.status === "Active" ? "default" : "secondary"}
                            className={
                              agent.status === "Active"
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : "bg-amber-100 text-amber-800 hover:bg-amber-100"
                            }
                          >
                            {agent.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{agent.listings}</TableCell>
                        <TableCell>{agent.approved}</TableCell>
                        <TableCell className="font-semibold">{agent.earnings}</TableCell>
                        <TableCell>{agent.joined}</TableCell>
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
                              {agent.status === "Pending" && (
                                <DropdownMenuItem className="text-green-600">
                                  <UserCheck className="h-4 w-4 mr-2" />
                                  Approve Agent
                                </DropdownMenuItem>
                              )}
                              {agent.status === "Active" && (
                                <DropdownMenuItem className="text-destructive">
                                  <UserX className="h-4 w-4 mr-2" />
                                  Suspend Agent
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </FadeIn>

      <Dialog open={showSuspendDialog} onOpenChange={setShowSuspendDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suspend User</DialogTitle>
            <DialogDescription>
              Are you sure you want to suspend this user? They will lose access to their account.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-medium">{selectedUser.name}</p>
              <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSuspendDialog(false)} className="bg-transparent">
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => setShowSuspendDialog(false)}>
              Suspend User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
