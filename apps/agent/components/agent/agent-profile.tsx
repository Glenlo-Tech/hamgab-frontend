"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FadeIn } from "@/components/motion-wrapper"
import { motion } from "framer-motion"
import {
  Building2,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  User,
  FileText,
  Upload,
  Camera,
  MapPin,
  CreditCard,
  Shield,
  Loader2,
} from "lucide-react"
import { getAgentData } from "@/lib/auth"
import { cn } from "@/lib/utils"

export function AgentProfile() {
  const agent = getAgentData()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [kycData, setKycData] = useState({
    fullName: agent?.fullName || "",
    dateOfBirth: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    idType: "",
    idNumber: "",
    idFront: null as File | null,
    idBack: null as File | null,
    selfie: null as File | null,
  })

  const getStatusBadge = () => {
    if (!agent?.status) return null

    const status = agent.status.toUpperCase()
    const statusConfig = {
      PENDING: { label: "Pending", color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400", icon: Clock },
      ACTIVE: { label: "Active", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400", icon: CheckCircle2 },
      APPROVED: { label: "Approved", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400", icon: CheckCircle2 },
      REJECTED: { label: "Rejected", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400", icon: XCircle },
      SUSPENDED: { label: "Suspended", color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400", icon: AlertCircle },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING
    const Icon = config.icon

    return (
      <Badge className={cn("flex items-center gap-1.5 px-2.5 py-1", config.color)}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const handleFileChange = (field: "idFront" | "idBack" | "selfie", file: File | null) => {
    setKycData((prev) => ({ ...prev, [field]: file }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // TODO: Implement KYC submission to backend
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      // Handle success
    } catch (error) {
      // Handle error
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Header */}
      <FadeIn>
        <div className="flex flex-col gap-3 sm:gap-4">
          <div>
            <motion.h1
              className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Agent Profile
            </motion.h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">Manage your profile and complete KYC verification.</p>
          </div>
        </div>
      </FadeIn>

      {/* Profile Information Card */}
      {agent && (
        <FadeIn delay={0.05}>
          <Card className="border-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base sm:text-lg">Profile Information</CardTitle>
                {getStatusBadge()}
              </div>
              <CardDescription>Your account details and verification status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {agent.email && (
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                      <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground mb-0.5">Email</p>
                      <p className="text-sm font-medium truncate">{agent.email}</p>
                    </div>
                  </div>
                )}
                {agent.phone && (
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                      <Phone className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground mb-0.5">Phone</p>
                      <p className="text-sm font-medium truncate">{agent.phone}</p>
                    </div>
                  </div>
                )}
                {agent.role && (
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                      <Building2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground mb-0.5">Role</p>
                      <p className="text-sm font-medium">{agent.role}</p>
                    </div>
                  </div>
                )}
                {agent.created_at && (
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground mb-0.5">Member Since</p>
                      <p className="text-sm font-medium">
                        {new Date(agent.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              {agent.status === "PENDING" && (
                <div className="mt-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-amber-900 dark:text-amber-200">Account Pending Approval</p>
                      <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                        Complete your KYC verification below to get your account approved.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </FadeIn>
      )}

      {/* KYC Verification Card */}
      <FadeIn delay={0.1}>
        <Card className="border-2">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle className="text-base sm:text-lg">KYC Verification</CardTitle>
            </div>
            <CardDescription>Complete your KYC to activate your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={kycData.fullName}
                      onChange={(e) => setKycData((prev) => ({ ...prev, fullName: e.target.value }))}
                      placeholder="Enter your full name as it appears on your ID"
                      required
                      className="placeholder:text-muted-foreground placeholder:text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={kycData.dateOfBirth}
                      onChange={(e) => setKycData((prev) => ({ ...prev, dateOfBirth: e.target.value }))}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Address Information
                </h3>
                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    value={kycData.address}
                    onChange={(e) => setKycData((prev) => ({ ...prev, address: e.target.value }))}
                    placeholder="Enter your address"
                    required
                    className="placeholder:text-muted-foreground placeholder:text-sm"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={kycData.city}
                      onChange={(e) => setKycData((prev) => ({ ...prev, city: e.target.value }))}
                      placeholder="City"
                      required
                      className="placeholder:text-muted-foreground placeholder:text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">Region *</Label>
                    <Input
                      id="state"
                      value={kycData.state}
                      onChange={(e) => setKycData((prev) => ({ ...prev, state: e.target.value }))}
                      placeholder="Region"
                      required
                      className="placeholder:text-muted-foreground placeholder:text-sm"
                    />
                  </div>
                  
                </div>
               
              </div>

              {/* Identity Verification */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Identity Verification
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="idType">ID Type *</Label>
                    <select
                      id="idType"
                      value={kycData.idType}
                      onChange={(e) => setKycData((prev) => ({ ...prev, idType: e.target.value }))}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      required
                    >
                      <option value="">Select ID Type</option>
                      <option value="passport">Passport</option>
                      <option value="national_id">National ID</option>
                      <option value="drivers_license">Driver's License</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="idNumber">ID Number *</Label>
                    <Input
                      id="idNumber"
                      value={kycData.idNumber}
                      onChange={(e) => setKycData((prev) => ({ ...prev, idNumber: e.target.value }))}
                      placeholder="Enter your ID number"
                      required
                      className="placeholder:text-muted-foreground placeholder:text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Document Upload */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Document Upload
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* ID Front */}
                  <div className="space-y-2">
                    <Label>ID Front *</Label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange("idFront", e.target.files?.[0] || null)}
                        className="hidden"
                        id="idFront"
                        required
                      />
                      <label
                        htmlFor="idFront"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:border-primary transition-colors"
                      >
                        {kycData.idFront ? (
                          <div className="flex flex-col items-center gap-2 p-4">
                            <FileText className="h-8 w-8 text-primary" />
                            <p className="text-xs text-center font-medium">{kycData.idFront.name}</p>
                            <p className="text-xs text-muted-foreground">Click to change</p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2 p-4">
                            <Upload className="h-8 w-8 text-muted-foreground" />
                            <p className="text-xs text-center font-medium">Upload ID Front</p>
                            <p className="text-xs text-muted-foreground">JPG, PNG (Max 5MB)</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* ID Back */}
                  <div className="space-y-2">
                    <Label>ID Back *</Label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange("idBack", e.target.files?.[0] || null)}
                        className="hidden"
                        id="idBack"
                        required
                      />
                      <label
                        htmlFor="idBack"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:border-primary transition-colors"
                      >
                        {kycData.idBack ? (
                          <div className="flex flex-col items-center gap-2 p-4">
                            <FileText className="h-8 w-8 text-primary" />
                            <p className="text-xs text-center font-medium">{kycData.idBack.name}</p>
                            <p className="text-xs text-muted-foreground">Click to change</p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2 p-4">
                            <Upload className="h-8 w-8 text-muted-foreground" />
                            <p className="text-xs text-center font-medium">Upload ID Back</p>
                            <p className="text-xs text-muted-foreground">JPG, PNG (Max 5MB)</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Selfie */}
                  <div className="space-y-2">
                    <Label>Selfie with ID *</Label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange("selfie", e.target.files?.[0] || null)}
                        className="hidden"
                        id="selfie"
                        required
                      />
                      <label
                        htmlFor="selfie"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:border-primary transition-colors"
                      >
                        {kycData.selfie ? (
                          <div className="flex flex-col items-center gap-2 p-4">
                            <Camera className="h-8 w-8 text-primary" />
                            <p className="text-xs text-center font-medium">{kycData.selfie.name}</p>
                            <p className="text-xs text-muted-foreground">Click to change</p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2 p-4">
                            <Camera className="h-8 w-8 text-muted-foreground" />
                            <p className="text-xs text-center font-medium">Upload Selfie</p>
                            <p className="text-xs text-muted-foreground">JPG, PNG (Max 5MB)</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-blue-900 dark:text-blue-200">KYC Verification Guidelines</p>
                    <ul className="text-xs text-blue-700 dark:text-blue-300 mt-1.5 space-y-1 list-disc list-inside">
                      <li>Ensure all documents are clear and readable</li>
                      <li>Documents must be valid and not expired</li>
                      <li>Selfie must clearly show your face and the ID document</li>
                      <li>All information must match your ID document</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-11 text-base font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Submit KYC Verification
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  )
}

