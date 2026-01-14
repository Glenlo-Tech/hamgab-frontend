"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
  Shield,
  Loader2,
} from "lucide-react"
import { getAgentData, submitKYC } from "@/lib/auth"
import { useKYCStatus } from "@/hooks/use-kyc-status"
import { ApiClientError } from "@/lib/api-client"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"

export function AgentProfile() {
  const agent = getAgentData()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const { kycStatus, kycApproved, isLoading: isLoadingKYC, mutate: refreshKYCStatus } = useKYCStatus()
  const [previews, setPreviews] = useState<{
    idFront: string | null
    idBack: string | null
    selfie: string | null
  }>({
    idFront: null,
    idBack: null,
    selfie: null,
  })
  const [kycData, setKycData] = useState({
    fullName: agent?.fullName || "",
    idFront: null as File | null,
    idBack: null as File | null,
    selfie: null as File | null,
  })

  // Update form when KYC status loads
  useEffect(() => {
    if (kycStatus?.full_name && kycData.fullName === (agent?.fullName || "")) {
      setKycData((prev) => ({
        ...prev,
        fullName: kycStatus.full_name,
      }))
    }
  }, [kycStatus?.full_name, agent?.fullName, kycData.fullName])

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
    
    // Create preview URL
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviews((prev) => ({ ...prev, [field]: reader.result as string }))
      }
      reader.readAsDataURL(file)
    } else {
      setPreviews((prev) => ({ ...prev, [field]: null }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!kycData.fullName.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter your full name",
        variant: "destructive",
      })
      return
    }

    if (!kycData.idFront) {
      toast({
        title: "Validation Error",
        description: "Please upload your ID front image",
        variant: "destructive",
      })
      return
    }

    if (!kycData.idBack) {
      toast({
        title: "Validation Error",
        description: "Please upload your ID back image",
        variant: "destructive",
      })
      return
    }

    if (!kycData.selfie) {
      toast({
        title: "Validation Error",
        description: "Please upload your selfie",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await submitKYC({
        full_name: kycData.fullName.trim(),
        id_front: kycData.idFront,
        id_back: kycData.idBack,
        selfie: kycData.selfie,
      })

      // Show success modal
      setShowSuccessModal(true)
      
      // Refresh KYC status using SWR mutate (triggers revalidation)
      await refreshKYCStatus()
      
      // Reset form after successful submission
      setPreviews({ idFront: null, idBack: null, selfie: null })
      setKycData({
        fullName: agent?.fullName || kycStatus?.full_name || "",
        idFront: null,
        idBack: null,
        selfie: null,
      })
    } catch (error: unknown) {
      const errorMessage =
        error instanceof ApiClientError
          ? error.message
          : error instanceof Error
          ? error.message
          : "Failed to submit KYC documents. Please try again."
      
      toast({
        title: "Submission Failed",
        description: errorMessage,
        variant: "destructive",
      })
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
              {/* {agent.status === "PENDING" && (
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
              )} */}
            </CardContent>
          </Card>
        </FadeIn>
      )}

      {/* KYC Status Card */}
      {!isLoadingKYC && kycStatus && (
        <FadeIn delay={0.1}>
          <Card className={cn(
            "border-2",
            kycApproved
              ? "bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-800"
              : kycStatus.status === "PENDING"
              ? "bg-amber-50/50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800"
              : kycStatus.status === "REJECTED"
              ? "bg-red-50/50 dark:bg-red-900/10 border-red-200 dark:border-red-800"
              : "border-border"
          )}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className={cn(
                    "h-5 w-5",
                    kycApproved
                      ? "text-green-600 dark:text-green-400"
                      : kycStatus.status === "PENDING"
                      ? "text-amber-600 dark:text-amber-400"
                      : kycStatus.status === "REJECTED"
                      ? "text-red-600 dark:text-red-400"
                      : "text-primary"
                  )} />
                  <CardTitle className="text-base sm:text-lg">KYC Status</CardTitle>
                </div>
                <Badge className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1",
                  kycApproved
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : kycStatus.status === "PENDING"
                    ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                    : kycStatus.status === "REJECTED"
                    ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                    : ""
                )}>
                  {kycStatus.status === "PENDING" && <Clock className="h-3 w-3" />}
                  {kycStatus.status === "REJECTED" && <XCircle className="h-3 w-3" />}
                  {kycApproved && <CheckCircle2 className="h-3 w-3" />}
                  {kycStatus.status}
                </Badge>
              </div>
              <CardDescription>
                {kycApproved
                  ? "Your KYC verification has been approved."
                  : kycStatus.status === "PENDING"
                  ? "Your KYC documents are under review."
                  : kycStatus.status === "REJECTED"
                  ? "Your KYC verification was rejected. Please update and resubmit."
                  : "KYC verification status"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {kycStatus.review_notes && kycStatus.status === "REJECTED" && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-red-900 dark:text-red-200">Rejection Reason</p>
                      <p className="text-xs text-red-700 dark:text-red-300 mt-0.5">{kycStatus.review_notes}</p>
                    </div>
                  </div>
                </div>
              )}
              {kycStatus.submitted_at && (
                <div className="text-xs text-muted-foreground">
                  Submitted: {new Date(kycStatus.submitted_at).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              )}
              {kycStatus.reviewed_at && (
                <div className="text-xs text-muted-foreground">
                  Reviewed: {new Date(kycStatus.reviewed_at).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </FadeIn>
      )}

      {/* KYC Verification Card - Only show if not approved */}
      {!isLoadingKYC && !kycApproved && kycStatus?.status !== "APPROVED" && (
        <FadeIn delay={kycStatus ? 0.15 : 0.1}>
          <Card className="border-2">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle className="text-base sm:text-lg">
                {kycStatus?.status === "REJECTED" ? "Update KYC Verification" : "KYC Verification"}
              </CardTitle>
            </div>
            <CardDescription>
              {kycApproved
                ? "Your KYC is approved. You can update your documents if needed."
                : kycStatus?.status === "PENDING"
                ? "Your KYC is under review. You can update your submission if needed."
                : kycStatus?.status === "REJECTED"
                ? "Please update your documents and resubmit."
                : "Complete your KYC to activate your account"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Personal Information
                </h3>
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
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:border-primary transition-colors overflow-hidden relative"
                      >
                        {previews.idFront ? (
                          <div className="w-full h-full relative">
                            <img
                              src={previews.idFront}
                              alt="ID Front Preview"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                              <p className="text-xs text-white font-medium">Click to change</p>
                            </div>
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
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:border-primary transition-colors overflow-hidden relative"
                      >
                        {previews.idBack ? (
                          <div className="w-full h-full relative">
                            <img
                              src={previews.idBack}
                              alt="ID Back Preview"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                              <p className="text-xs text-white font-medium">Click to change</p>
                            </div>
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
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:border-primary transition-colors overflow-hidden relative"
                      >
                        {previews.selfie ? (
                          <div className="w-full h-full relative">
                            <img
                              src={previews.selfie}
                              alt="Selfie Preview"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                              <p className="text-xs text-white font-medium">Click to change</p>
                            </div>
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
                      <li>Selfie must clearly show your face and the ID document</li>
                      <li>All information must match your ID document</li>
                      <li>
                        Your submission will be reviewed, and you'll receive an email notification once the review is complete.
                      </li>
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
      )}

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <DialogTitle className="text-center text-xl">KYC Submitted Successfully!</DialogTitle>
            <DialogDescription className="text-center pt-2">
              Your KYC documents have been submitted successfully. Our team will review your submission and you'll receive an email notification once the review is complete.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button
              onClick={() => setShowSuccessModal(false)}
              className="w-full sm:w-auto"
            >
              Got it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

