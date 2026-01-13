"use client"

import { useState } from "react"
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
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

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

export function PropertySubmissionForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    bedrooms: "",
    bathrooms: "",
    squareFeet: "",
    description: "",
    street: "",
    unit: "",
    city: "",
    state: "",
    zipCode: "",
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

  // Auto-save simulation
  const handleAutoSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setLastSaved(new Date())
    setIsSaving(false)
  }

  // Handle form field changes
  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Auto-save after 2 seconds of inactivity
    const timeoutId = setTimeout(() => {
      handleAutoSave()
    }, 2000)
    return () => clearTimeout(timeoutId)
  }

  const handleImageUpload = () => {
    setUploadedImages([
      ...uploadedImages,
      `/placeholder.svg?height=200&width=300&query=property-image-${uploadedImages.length + 1}`,
    ])
    handleAutoSave()
  }

  const handleDocUpload = () => {
    setUploadedDocs([...uploadedDocs, `document-${uploadedDocs.length + 1}.pdf`])
    handleAutoSave()
  }

  const removeImage = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index))
    handleAutoSave()
  }

  const removeDoc = (index: number) => {
    setUploadedDocs(uploadedDocs.filter((_, i) => i !== index))
    handleAutoSave()
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.title && formData.type && formData.bedrooms && formData.bathrooms
      case 2:
        return formData.street && formData.city && formData.state && formData.zipCode
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
              <Button variant="outline" size="sm" onClick={handleAutoSave} className="h-8 sm:h-9">
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
                  className="space-y-4 sm:space-y-6"
                >
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-1.5">
                        Property Title
                        <span className="text-destructive">*</span>
                        <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                      </label>
                      <Input
                        placeholder="e.g., Modern Downtown Apartment"
                        value={formData.title}
                        onChange={(e) => handleFieldChange("title", e.target.value)}
                        className="h-10 sm:h-11"
                      />
                      <p className="text-xs text-muted-foreground">A catchy title helps attract more views</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-1.5">
                        Property Type
                        <span className="text-destructive">*</span>
                      </label>
                      <Select value={formData.type} onValueChange={(value) => handleFieldChange("type", value)}>
                        <SelectTrigger className="h-10 sm:h-11">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="apartment">Apartment</SelectItem>
                          <SelectItem value="house">House</SelectItem>
                          <SelectItem value="condo">Condo</SelectItem>
                          <SelectItem value="villa">Villa</SelectItem>
                          <SelectItem value="commercial">Commercial</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-1.5">
                        Bedrooms
                        <span className="text-destructive">*</span>
                      </label>
                      <Select
                        value={formData.bedrooms}
                        onValueChange={(value) => handleFieldChange("bedrooms", value)}
                      >
                        <SelectTrigger className="h-10 sm:h-11">
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
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-1.5">
                        Bathrooms
                        <span className="text-destructive">*</span>
                      </label>
                      <Select
                        value={formData.bathrooms}
                        onValueChange={(value) => handleFieldChange("bathrooms", value)}
                      >
                        <SelectTrigger className="h-10 sm:h-11">
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
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Square Feet</label>
                      <Input
                        type="number"
                        placeholder="e.g., 1200"
                        value={formData.squareFeet}
                        onChange={(e) => handleFieldChange("squareFeet", e.target.value)}
                        className="h-10 sm:h-11"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-1.5">
                      Description
                      <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                    </label>
                    <Textarea
                      placeholder="Describe the property in detail... Include key features, nearby amenities, and what makes this property special."
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
                  <div className="space-y-3">
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
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4 sm:space-y-6"
                >
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-1.5">
                        Address
                        <span className="text-destructive">*</span>
                      </label>
                      <Input
                        placeholder="123 Main Street"
                        value={formData.street}
                        onChange={(e) => handleFieldChange("street", e.target.value)}
                        className="h-10 sm:h-11"
                      />
                    </div>
                    {/* <div className="space-y-2">
                      <label className="text-sm font-medium">Apt/Suite/Unit</label>
                      <Input
                        placeholder="Apt 4B (optional)"
                        value={formData.unit}
                        onChange={(e) => handleFieldChange("unit", e.target.value)}
                        className="h-10 sm:h-11"
                      />
                    </div> */}
                  </div>

                  <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-1.5">
                        Region
                        <span className="text-destructive">*</span>
                      </label>
                      <Select value={formData.state} onValueChange={(value) => handleFieldChange("state", value)}>
                        <SelectTrigger className="h-10 sm:h-11">
                          <SelectValue placeholder="Select Region" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SW">South West</SelectItem>
                          <SelectItem value="NW">North West</SelectItem>
                          <SelectItem value="L">Littoral</SelectItem>
                          <SelectItem value="FN">Far North</SelectItem>
                          <SelectItem value="N">North</SelectItem>
                          <SelectItem value="A">Adamawa</SelectItem>
                          <SelectItem value="C">Center</SelectItem>
                          <SelectItem value="E">East</SelectItem>
                          <SelectItem value="S">South</SelectItem>
                          <SelectItem value="W">West</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-1.5">
                        City
                        <span className="text-destructive">*</span>
                      </label>
                      <Input
                        placeholder="Buea"
                        value={formData.city}
                        onChange={(e) => handleFieldChange("city", e.target.value)}
                        className="h-10 sm:h-11"
                      />
                    </div>
                    
                    {/* <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-1.5">
                        ZIP Code
                        <span className="text-destructive">*</span>
                      </label>
                      <Input
                        placeholder="10001"
                        value={formData.zipCode}
                        onChange={(e) => handleFieldChange("zipCode", e.target.value)}
                        className="h-10 sm:h-11"
                      />
                    </div> */}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Neighborhood/Area</label>
                    <Input
                      placeholder="e.g., Midtown Manhattan"
                      value={formData.neighborhood}
                      onChange={(e) => handleFieldChange("neighborhood", e.target.value)}
                      className="h-10 sm:h-11"
                    />
                    <p className="text-xs text-muted-foreground">Help potential tenants find your property</p>
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4 sm:space-y-6"
                >
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-1.5">
                      Listing Type
                      <span className="text-destructive">*</span>
                    </label>
                    <Select
                      value={formData.listingType}
                      onValueChange={(value) => handleFieldChange("listingType", value)}
                    >
                      <SelectTrigger className="h-10 sm:h-11">
                        <SelectValue placeholder="Select listing type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rent">For Rent</SelectItem>
                        <SelectItem value="sale">For Sale</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-1.5">
                        Price
                        <span className="text-destructive">*</span>
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="number"
                          placeholder="2500"
                          value={formData.price}
                          onChange={(e) => handleFieldChange("price", e.target.value)}
                          className="pl-9 h-10 sm:h-11"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Price Period (if rent)</label>
                      <Select
                        value={formData.pricePeriod}
                        onValueChange={(value) => handleFieldChange("pricePeriod", value)}
                      >
                        <SelectTrigger className="h-10 sm:h-11">
                          <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="month">Per Month</SelectItem>
                          <SelectItem value="week">Per Week</SelectItem>
                          <SelectItem value="year">Per Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Security Deposit</label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="number"
                          placeholder="2500 (optional)"
                          value={formData.securityDeposit}
                          onChange={(e) => handleFieldChange("securityDeposit", e.target.value)}
                          className="pl-9 h-10 sm:h-11"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Available From</label>
                      <Input
                        type="date"
                        value={formData.availableFrom}
                        onChange={(e) => handleFieldChange("availableFrom", e.target.value)}
                        className="h-10 sm:h-11"
                      />
                    </div>
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
                  className="space-y-4 sm:space-y-6"
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
                            <li>Upload high-quality photos (min 1200px width)</li>
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
                          <img src={img || "/placeholder.svg"} alt="" className="object-cover w-full h-full" />
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
                        onClick={handleImageUpload}
                        className="aspect-video border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary transition-colors bg-muted/30 hover:bg-muted/50"
                      >
                        <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
                        <span className="text-xs sm:text-sm text-muted-foreground text-center px-2">Upload Photo</span>
                      </button>
                    </div>
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
                  className="space-y-4 sm:space-y-6"
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
                            <span className="text-sm font-medium truncate">{doc}</span>
                          </div>
                          <button
                            onClick={() => removeDoc(index)}
                            className="h-8 w-8 rounded-full hover:bg-background flex items-center justify-center flex-shrink-0"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={handleDocUpload}
                        className="w-full border-2 border-dashed border-border rounded-lg p-4 sm:p-6 flex flex-col items-center gap-2 hover:border-primary transition-colors bg-muted/30 hover:bg-muted/50"
                      >
                        <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Upload Document</span>
                        <span className="text-xs text-muted-foreground">PDF, DOC, JPG up to 10MB</span>
                      </button>
                    </div>
                  </div>
                  <div className="p-4 sm:p-6 bg-muted rounded-lg space-y-3">
                    <h4 className="font-medium text-sm sm:text-base flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
                      Submission Checklist
                    </h4>
                    <ul className="space-y-2 text-xs sm:text-sm">
                      {[
                        { label: "Basic property information", completed: !!(formData.title && formData.type) },
                        { label: "Location details", completed: !!(formData.street && formData.city) },
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
            <Button className="w-full sm:w-auto order-1 sm:order-2" disabled={!canProceed()}>
              <Check className="h-4 w-4 mr-2" />
              Submit Property
            </Button>
          )}
        </div>
      </FadeIn>
    </div>
  )
}
