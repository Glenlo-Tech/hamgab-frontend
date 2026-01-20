"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { FadeIn } from "@/components/motion-wrapper"
import {
  Upload,
  X,
  Check,
  ChevronRight,
  ChevronLeft,
  Building2,
  MapPin,
  DollarSign,
  ImageIcon,
  FileText,
  Info,
  Save,
  AlertCircle,
  CheckCircle2,
  Loader2,
  HelpCircle,
  Camera,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { useCameraCapture } from "@/hooks/use-camera-capture"
import { useGPSLocation } from "@/hooks/use-gps-location"
import { submitProperty, PropertyType, TransactionType, PricePeriod } from "@/lib/properties"
import { CameraCapture } from "@/components/camera/camera-capture"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

const steps = [
  { id: 1, title: "Basic Info", icon: Building2, description: "Property details" },
  { id: 2, title: "Location", icon: MapPin, description: "Address & area" },
  { id: 3, title: "Pricing", icon: DollarSign, description: "Price & terms" },
  { id: 4, title: "Media", icon: ImageIcon, description: "Photos & videos" },
  { id: 5, title: "Documents", icon: FileText, description: "Verification docs" },
]

const amenities = [
  "Air Conditioning",
  "Heating",
  "Washer/Dryer",
  "Dishwasher",
  "Parking",
  "Gym",
  "Pool",
  "Pet Friendly",
  "Balcony",
  "Fireplace",
  "Security System",
  "Elevator",
]

interface ImageWithPreview {
  file: File
  preview: string
}

export function PropertySubmissionForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [uploadedImages, setUploadedImages] = useState<ImageWithPreview[]>([])
  const [uploadedDocs, setUploadedDocs] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  
  // Camera capture hook
  const {
    isOpen: isCameraOpen,
    isCapturing,
    error: cameraError,
    openCamera,
    closeCamera,
    capturePhoto,
    stream,
    videoRef,
  } = useCameraCapture()

  // GPS location hook (auto-captures in background)
  const { location: gpsLocation, captureLocation } = useGPSLocation()

  // File input refs
  const imageFileInputRef = useRef<HTMLInputElement>(null)
  const documentFileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    title: "",
    type: "",
    bedrooms: "",
    bathrooms: "",
    squareFeet: "",
    description: "",
    street: "",
    postalCode: "",
    city: "",
    state: "",
    country: "Cameroon",
    neighborhood: "",
    listingType: "",
    price: "",
    pricePeriod: "",
    securityDeposit: "",
    availableFrom: "",
  })

  // Calculate progress
  const calculateProgress = () => {
    let completed = 0
    const total = steps.length

    if (formData.title && formData.type) completed++
    if (formData.street && formData.city && formData.state) completed++
    if (formData.listingType && formData.price) completed++
    if (uploadedImages.length > 0) completed++
    if (uploadedDocs.length > 0) completed++

    return Math.round((completed / total) * 100)
  }

  const progress = calculateProgress()

  // Handle form field changes
  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Handle camera capture
  const handleCameraCapture = async () => {
    await openCamera()
  }

  const handleCameraPhotoCaptured = (file: File, preview: string) => {
    setUploadedImages((prev) => [...prev, { file, preview }])
    closeCamera()
    toast({
      title: "Photo captured",
      description: "Photo added successfully",
    })
  }

  // Handle image file upload
  const handleImageFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const preview = URL.createObjectURL(file)
        setUploadedImages((prev) => [...prev, { file, preview }])
      }
    })

    // Reset input
    if (imageFileInputRef.current) {
      imageFileInputRef.current.value = ""
    }
  }

  // Handle document file upload (can be images or files)
  const handleDocumentFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      setUploadedDocs((prev) => [...prev, file])
    })

    // Reset input
    if (documentFileInputRef.current) {
      documentFileInputRef.current.value = ""
    }
  }

  const removeImage = (index: number) => {
    const image = uploadedImages[index]
    URL.revokeObjectURL(image.preview) // Clean up preview URL
    setUploadedImages(uploadedImages.filter((_, i) => i !== index))
  }

  const removeDoc = (index: number) => {
    setUploadedDocs(uploadedDocs.filter((_, i) => i !== index))
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.title && formData.type
      case 2:
        return formData.street && formData.city && formData.state && gpsLocation
      case 3:
        return formData.listingType && formData.price
      case 4:
        return uploadedImages.length > 0
      case 5:
        return uploadedDocs.length > 0
      default:
        return false
    }
  }

  const handleNext = () => {
    if (canProceed()) {
      setCurrentStep(Math.min(steps.length, currentStep + 1))
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handlePrevious = () => {
    setCurrentStep(Math.max(1, currentStep - 1))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Map form values to API enums
  const mapPropertyType = (value: string): PropertyType => {
    const mapping: Record<string, PropertyType> = {
      apartment: PropertyType.APARTMENT,
      house: PropertyType.HOUSE,
      condo: PropertyType.CONDO,
      villa: PropertyType.VILLA,
      commercial: PropertyType.COMMERCIAL,
      land: PropertyType.LAND,
      other: PropertyType.OTHER,
    }
    return mapping[value.toLowerCase()] || PropertyType.OTHER
  }

  const mapTransactionType = (value: string): TransactionType => {
    const mapping: Record<string, TransactionType> = {
      rent: TransactionType.RENT,
      sale: TransactionType.SALE,
      lease: TransactionType.LEASE,
    }
    return mapping[value.toLowerCase()] || TransactionType.SALE
  }

  const mapPricePeriod = (value: string): PricePeriod | undefined => {
    const mapping: Record<string, PricePeriod> = {
      day: PricePeriod.DAY,
      week: PricePeriod.WEEK,
      month: PricePeriod.MONTH,
      year: PricePeriod.YEAR,
    }
    return mapping[value.toLowerCase()]
  }

  // Handle form submission
  const handleSubmit = async () => {
    if (!canProceed()) {
      toast({
        title: "Validation Error",
        description: "Please complete all required fields",
        variant: "destructive",
      })
      return
    }

    // Ensure GPS location is captured
    let location = gpsLocation
    if (!location) {
      location = await captureLocation()
      if (!location) {
        toast({
          title: "Location Required",
          description: "Please enable location access to submit property",
          variant: "destructive",
        })
        return
      }
    }

    setIsSubmitting(true)

    try {
      // Prepare submission data
      const submissionData = {
        // Required fields
        title: formData.title.trim(),
        property_type: mapPropertyType(formData.type),
        transaction_type: mapTransactionType(formData.listingType),
        latitude: location.latitude,
        longitude: location.longitude,
        images: uploadedImages.map((img) => img.file),
        documents: uploadedDocs,

        // Optional fields
        gps_timestamp: location.gpsTimestamp,
        postal_code: formData.postalCode || undefined,
        price: formData.price ? parseFloat(formData.price) : undefined,
        city: formData.city || undefined,
        state: formData.state || undefined,
        address: formData.street || undefined,
        country: formData.country || undefined,
        price_period: formData.pricePeriod ? mapPricePeriod(formData.pricePeriod) : undefined,
        description: formData.description.trim() || undefined,
        security_deposit: formData.securityDeposit
          ? parseFloat(formData.securityDeposit)
          : undefined,
      }

      // Submit property
      const response = await submitProperty(submissionData)

      toast({
        title: "Success!",
        description: "Property submitted successfully",
      })

      // Redirect to listings page
      router.push("/listings")
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit property. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6 max-w-5xl mx-auto">
      {/* Header with Progress */}
      <FadeIn>
        <div className="space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">Submit New Property</h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">
                Fill in the property details to submit for approval
              </p>
            </div>
            <div className="flex items-center gap-3">
              {isSaving ? (
                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                  <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                  <span className="hidden sm:inline">Saving...</span>
                </div>
              ) : lastSaved ? (
                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                  <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-600" />
                  <span className="hidden sm:inline">
                    Saved {lastSaved.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              ) : null}
              <Button variant="outline" size="sm" className="h-8 sm:h-9" disabled>
                <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                <span className="text-xs sm:text-sm">Save Draft</span>
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{progress}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </FadeIn>

      {/* Step Indicator - Mobile Optimized */}
      <FadeIn delay={0.1}>
        <Card className="overflow-hidden">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between overflow-x-auto pb-2 scrollbar-hide">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center flex-shrink-0">
                  <button
                    onClick={() => setCurrentStep(step.id)}
                    className={cn(
                      "flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2 px-2 sm:px-3 lg:px-4 py-2 rounded-lg transition-all",
                      currentStep === step.id
                        ? "bg-primary text-primary-foreground"
                        : currentStep > step.id
                          ? "bg-muted text-foreground"
                          : "text-muted-foreground hover:bg-muted/50",
                    )}
                  >
                    <div
                      className={cn(
                        "h-7 w-7 sm:h-8 sm:w-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium flex-shrink-0",
                        currentStep === step.id
                          ? "bg-primary-foreground/20"
                          : currentStep > step.id
                            ? "bg-foreground/10"
                            : "bg-muted",
                      )}
                    >
                      {currentStep > step.id ? (
                        <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      ) : (
                        <step.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      )}
                    </div>
                    <div className="text-left sm:text-center">
                      <div className="text-[10px] sm:text-xs font-medium">{step.title}</div>
                      <div className="hidden lg:block text-[10px] text-muted-foreground/70">{step.description}</div>
                    </div>
                  </button>
                  {index < steps.length - 1 && (
                    <div className="w-4 sm:w-8 lg:w-12 h-[2px] bg-border mx-1 sm:mx-2 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Form Content */}
      <FadeIn delay={0.2}>
        <Card className="overflow-hidden">
          <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                  {(() => {
                    const StepIcon = steps[currentStep - 1].icon
                    return <StepIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  })()}
                  {steps[currentStep - 1].title}
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm mt-1.5">
                  {currentStep === 1 && "Enter the basic information about the property"}
                  {currentStep === 2 && "Provide the property location details"}
                  {currentStep === 3 && "Set the pricing and listing type"}
                  {currentStep === 4 && "Upload photos and videos of the property"}
                  {currentStep === 5 && "Upload required documents for verification"}
                </CardDescription>
              </div>
              <Badge variant="secondary" className="flex-shrink-0">
                Step {currentStep} of {steps.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-4 sm:space-y-6">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5 sm:space-y-6"
                >
                  {/* Property Title and Type - Responsive Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                    <div className="space-y-2 w-full">
                      <label className="text-sm font-medium flex items-center gap-1.5">
                        Property Title
                        <span className="text-destructive">*</span>
                        <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                      </label>
                      <Input
                        placeholder="e.g., Modern Downtown Apartment"
                        value={formData.title}
                        onChange={(e) => handleFieldChange("title", e.target.value)}
                        className="h-11 w-full"
                      />
                      <p className="text-xs text-muted-foreground">A catchy title helps attract more views</p>
                    </div>
                    <div className="space-y-2 w-full">
                      <label className="text-sm font-medium flex items-center gap-1.5">
                        Property Type
                        <span className="text-destructive">*</span>
                      </label>
                      <Select value={formData.type} onValueChange={(value) => handleFieldChange("type", value)}>
                        <SelectTrigger className="h-11 w-full">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="apartment">Apartment</SelectItem>
                          <SelectItem value="house">House</SelectItem>
                          <SelectItem value="condo">Condo</SelectItem>
                          <SelectItem value="villa">Villa</SelectItem>
                          <SelectItem value="land">Land</SelectItem>
                          <SelectItem value="commercial">Commercial</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* TO DO: Add bedrooms, bathrooms, square feet */}
                  {/* Bedrooms, Bathrooms, Square Feet - Responsive Grid */}
                  {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                    <div className="space-y-2 w-full">
                      <label className="text-sm font-medium flex items-center gap-1.5">
                        Bedrooms
                        <span className="text-destructive">*</span>
                      </label>
                      <Select
                        value={formData.bedrooms}
                        onValueChange={(value) => handleFieldChange("bedrooms", value)}
                      >
                        <SelectTrigger className="h-11 w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, "6+"].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 w-full">
                      <label className="text-sm font-medium flex items-center gap-1.5">
                        Bathrooms
                        <span className="text-destructive">*</span>
                      </label>
                      <Select
                        value={formData.bathrooms}
                        onValueChange={(value) => handleFieldChange("bathrooms", value)}
                      >
                        <SelectTrigger className="h-11 w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, "5+"].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 w-full sm:col-span-2 lg:col-span-1">
                      <label className="text-sm font-medium">Square Feet</label>
                      <Input
                        type="number"
                        placeholder="e.g., 1200"
                        value={formData.squareFeet}
                        onChange={(e) => handleFieldChange("squareFeet", e.target.value)}
                        className="h-11 w-full"
                      />
                    </div>
                  </div> */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-1.5">
                      Description
                      <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                    </label>
                    <Textarea
                      placeholder="Describe the property in detail... Include key features, number of rooms, kitchens, toilets, nearby amenities, and what makes this property special."
                      rows={8}
                      value={formData.description}
                      onChange={(e) => handleFieldChange("description", e.target.value)}
                      className="resize-none placeholder:text-xs placeholder:sm:text-sm min-h-[150px]"
                    />
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">Be detailed to attract more inquiries</p>
                      <p className="text-xs text-muted-foreground">{formData.description.length}/2000</p>
                    </div>
                  </div>

                  {/* TO DO: Add amenities */}
                  {/* <div className="space-y-3">
                    <label className="text-sm font-medium block">Amenities</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      {amenities.map((amenity) => (
                        <div key={amenity} className="flex items-center space-x-2">
                          <Checkbox id={amenity} />
                          <label htmlFor={amenity} className="text-xs sm:text-sm cursor-pointer flex-1">
                            {amenity}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div> */}
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5 sm:space-y-6"
                >
                  {/* Address - Full Width */}
                  <div className="space-y-2 w-full">
                    <label className="text-sm font-medium flex items-center gap-1.5">
                      Address
                      <span className="text-destructive">*</span>
                      <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                    </label>
                    <Input
                      placeholder="123 Main Street"
                      value={formData.street}
                      onChange={(e) => handleFieldChange("street", e.target.value)}
                      className="h-11 w-full"
                    />
                    <p className="text-xs text-muted-foreground">Enter the complete street address</p>
                  </div>

                  {/* Region and City - Responsive Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                    <div className="space-y-2 w-full">
                      <label className="text-sm font-medium flex items-center gap-1.5">
                        State/Region
                        <span className="text-destructive">*</span>
                        <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                      </label>
                      <Input
                        placeholder="e.g., South West"
                        value={formData.state}
                        onChange={(e) => handleFieldChange("state", e.target.value)}
                        className="h-11 w-full"
                      />
                      <p className="text-xs text-muted-foreground">Enter the state or region name</p>
                    </div>
                    <div className="space-y-2 w-full">
                      <label className="text-sm font-medium flex items-center gap-1.5">
                        City
                        <span className="text-destructive">*</span>
                      </label>
                      <Input
                        placeholder="e.g., Buea"
                        value={formData.city}
                        onChange={(e) => handleFieldChange("city", e.target.value)}
                        className="h-11 w-full"
                      />
                    </div>
                  </div>

                  {/* Postal Code and Neighborhood - Responsive Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                    <div className="space-y-2 w-full">
                      <label className="text-sm font-medium flex items-center gap-1.5">
                        Postal Code
                        <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                      </label>
                      <Input
                        placeholder="e.g., 230343"
                        value={formData.postalCode}
                        onChange={(e) => handleFieldChange("postalCode", e.target.value)}
                        className="h-11 w-full"
                      />
                    </div>
                    {/* <div className="space-y-2 w-full">
                      <label className="text-sm font-medium flex items-center gap-1.5">
                        Neighborhood/Area
                        <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                      </label>
                      <Input
                        placeholder="e.g., Midtown Manhattan"
                        value={formData.neighborhood}
                        onChange={(e) => handleFieldChange("neighborhood", e.target.value)}
                        className="h-11 w-full"
                      />
                    </div> */}
                  </div>

                  {/* GPS Location Status */}
                  {gpsLocation ? (
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200 dark:border-emerald-900">
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-emerald-900 dark:text-emerald-100">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                        <span>Location captured! You can now proceed to the next step.</span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-900">
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-amber-900 dark:text-amber-100">
                        <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                        <span>Capturing Real-Time Location...</span>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5 sm:space-y-6"
                >
                  {/* Listing Type - Full Width */}
                  <div className="space-y-2 w-full">
                    <label className="text-sm font-medium flex items-center gap-1.5">
                      Listing Type
                      <span className="text-destructive">*</span>
                      <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                    </label>
                    <Select
                      value={formData.listingType}
                      onValueChange={(value) => handleFieldChange("listingType", value)}
                    >
                      <SelectTrigger className="h-11 w-full">
                        <SelectValue placeholder="Select listing type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rent">For Rent</SelectItem>
                        <SelectItem value="sale">For Sale</SelectItem>
                        <SelectItem value="lease">For Lease</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">Choose whether this property is for rent or sale</p>
                  </div>

                  {/* Price and Price Period - Responsive Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                    <div className="space-y-2 w-full">
                      <label className="text-sm font-medium flex items-center gap-1.5">
                        Price
                        <span className="text-destructive">*</span>
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="number"
                          placeholder="e.g., 2500"
                          value={formData.price}
                          onChange={(e) => handleFieldChange("price", e.target.value)}
                          className="pl-9 h-11 w-full"
                        />
                      </div>
                    </div>
                    <div className="space-y-2 w-full">
                      <label className="text-sm font-medium flex items-center gap-1.5">
                        Price Period (if rent)
                        <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                      </label>
                      <Select
                        value={formData.pricePeriod}
                        onValueChange={(value) => handleFieldChange("pricePeriod", value)}
                      >
                        <SelectTrigger className="h-11 w-full">
                          <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="day">Per Day</SelectItem>
                          <SelectItem value="week">Per Week</SelectItem>
                          <SelectItem value="month">Per Month</SelectItem>
                          <SelectItem value="year">Per Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Security Deposit and Available From - Responsive Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                    <div className="space-y-2 w-full">
                      <label className="text-sm font-medium flex items-center gap-1.5">
                        Security Deposit
                        <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="number"
                          placeholder="e.g., 2500 (optional)"
                          value={formData.securityDeposit}
                          onChange={(e) => handleFieldChange("securityDeposit", e.target.value)}
                          className="pl-9 h-11 w-full"
                        />
                      </div>
                    </div>
                    {/* <div className="space-y-2 w-full">
                      <label className="text-sm font-medium flex items-center gap-1.5">
                        Available From
                        <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                      </label>
                      <Input
                        type="date"
                        value={formData.availableFrom}
                        onChange={(e) => handleFieldChange("availableFrom", e.target.value)}
                        className="h-11 w-full"
                      />
                    </div> */}
                  </div>
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5 sm:space-y-6"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium flex items-center gap-1.5">
                        Property Photos
                        <span className="text-destructive">*</span>
                      </label>
                      <Badge variant="secondary" className="text-xs">
                        {uploadedImages.length} uploaded
                      </Badge>
                    </div>
                    <div className="p-3 sm:p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
                      <div className="flex items-start gap-2">
                        <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                        <div className="text-xs sm:text-sm text-blue-900 dark:text-blue-100">
                          <p className="font-medium mb-1">Photo Guidelines:</p>
                          <ul className="list-disc list-inside space-y-0.5 text-blue-800 dark:text-blue-200">
                            <li>Capture photos using your device camera (required)</li>
                            <li>First image will be used as the cover photo</li>
                            <li>Recommended: 5-10 photos showing different rooms</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                      {uploadedImages.map((img, index) => (
                        <div
                          key={index}
                          className="relative aspect-video bg-muted rounded-lg overflow-hidden group"
                        >
                          <img src={img.preview} alt={`Property photo ${index + 1}`} className="object-cover w-full h-full" />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground"
                          >
                            <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </button>
                          {index === 0 && (
                            <Badge className="absolute bottom-2 left-2 bg-primary text-primary-foreground text-[10px] sm:text-xs">
                              Cover
                            </Badge>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={handleCameraCapture}
                        className="aspect-video border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary transition-colors bg-muted/30 hover:bg-muted/50"
                      >
                        <Camera className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
                        <span className="text-xs sm:text-sm text-muted-foreground text-center px-2">Capture Photo</span>
                      </button>
                      <button
                        onClick={() => imageFileInputRef.current?.click()}
                        className="aspect-video border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary transition-colors bg-muted/30 hover:bg-muted/50"
                      >
                        <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
                        <span className="text-xs sm:text-sm text-muted-foreground text-center px-2">Upload Photo</span>
                      </button>
                    </div>
                    <input
                      ref={imageFileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageFileSelect}
                      className="hidden"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Video Tour (Optional)</label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 sm:p-8 text-center hover:border-primary transition-colors">
                      <Upload className="h-8 w-8 sm:h-10 sm:w-10 mx-auto text-muted-foreground mb-3 sm:mb-4" />
                      <p className="text-sm text-muted-foreground mb-1">Drag and drop a video file or click to upload</p>
                      <p className="text-xs text-muted-foreground">MP4, MOV up to 100MB</p>
                      <Button variant="outline" className="mt-4 bg-transparent">
                        Choose File
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5 sm:space-y-6"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium flex items-center gap-1.5">
                        Required Documents
                        <span className="text-destructive">*</span>
                      </label>
                      <Badge variant="secondary" className="text-xs">
                        {uploadedDocs.length} uploaded
                      </Badge>
                    </div>
                    <div className="p-3 sm:p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-900">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                        <div className="text-xs sm:text-sm text-amber-900 dark:text-amber-100">
                          <p className="font-medium mb-1">Required for verification:</p>
                          <ul className="list-disc list-inside space-y-0.5 text-amber-800 dark:text-amber-200">
                            <li>Property ownership documents</li>
                            <li>Property certificates</li>
                            <li>Any relevant paperwork</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 sm:space-y-3">
                      {uploadedDocs.map((doc, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                            <span className="text-sm font-medium truncate">{doc.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {(doc.size / 1024 / 1024).toFixed(2)} MB
                            </span>
                          </div>
                          <button
                            onClick={() => removeDoc(index)}
                            className="h-8 w-8 rounded-full hover:bg-background flex items-center justify-center flex-shrink-0"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                          onClick={handleCameraCapture}
                          className="border-2 border-dashed border-border rounded-lg p-4 sm:p-6 flex flex-col items-center gap-2 hover:border-primary transition-colors bg-muted/30 hover:bg-muted/50"
                        >
                          <Camera className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Capture Document</span>
                          <span className="text-xs text-muted-foreground">Take photo of document</span>
                        </button>
                        <button
                          onClick={() => documentFileInputRef.current?.click()}
                          className="border-2 border-dashed border-border rounded-lg p-4 sm:p-6 flex flex-col items-center gap-2 hover:border-primary transition-colors bg-muted/30 hover:bg-muted/50"
                        >
                          <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Upload Document</span>
                          <span className="text-xs text-muted-foreground">PDF, DOC, JPG up to 10MB</span>
                        </button>
                      </div>
                    </div>
                    <input
                      ref={documentFileInputRef}
                      type="file"
                      accept="image/*,.pdf,.doc,.docx"
                      multiple
                      onChange={handleDocumentFileSelect}
                      className="hidden"
                    />
                  </div>
                  <div className="p-4 sm:p-6 bg-muted rounded-lg space-y-3">
                    <h4 className="font-medium text-sm sm:text-base flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
                      Submission Checklist
                    </h4>
                    <ul className="space-y-2 text-xs sm:text-sm">
                      {[
                        { label: "Basic property information", completed: !!(formData.title && formData.type) },
                        { label: "Location details", completed: !!(formData.street && formData.city && gpsLocation) },
                        { label: "Pricing information", completed: !!(formData.listingType && formData.price) },
                        { label: "At least one photo uploaded", completed: uploadedImages.length > 0 },
                        { label: "Documents uploaded", completed: uploadedDocs.length > 0 },
                      ].map((item, index) => (
                        <li key={index} className="flex items-center gap-2">
                          {item.completed ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0" />
                          )}
                          <span className={cn(item.completed ? "text-foreground" : "text-muted-foreground")}>
                            {item.label}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Navigation Buttons */}
      <FadeIn delay={0.3}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 pt-2 sm:pt-4 border-t">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="w-full sm:w-auto bg-transparent order-2 sm:order-1"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          {currentStep < steps.length ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="w-full sm:w-auto order-1 sm:order-2"
            >
              Next Step
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              className="w-full sm:w-auto order-1 sm:order-2"
              disabled={!canProceed() || isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Submit Property
                </>
              )}
            </Button>
          )}
        </div>
      </FadeIn>

      {/* Camera Capture Modal */}
      <CameraCapture
        isOpen={isCameraOpen}
        onClose={closeCamera}
        onCapture={handleCameraPhotoCaptured}
        videoRef={videoRef}
        stream={stream}
        error={cameraError}
      />
    </div>
  )
}
