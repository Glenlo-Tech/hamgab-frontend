"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
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
} from "lucide-react"
import { cn } from "@/lib/utils"

const steps = [
  { id: 1, title: "Basic Info", icon: Building2 },
  { id: 2, title: "Location", icon: MapPin },
  { id: 3, title: "Pricing", icon: DollarSign },
  { id: 4, title: "Media", icon: ImageIcon },
  { id: 5, title: "Documents", icon: FileText },
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

  const handleImageUpload = () => {
    setUploadedImages([
      ...uploadedImages,
      `/placeholder.svg?height=200&width=300&query=property-image-${uploadedImages.length + 1}`,
    ])
  }

  const handleDocUpload = () => {
    setUploadedDocs([...uploadedDocs, `document-${uploadedDocs.length + 1}.pdf`])
  }

  const removeImage = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index))
  }

  const removeDoc = (index: number) => {
    setUploadedDocs(uploadedDocs.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6">
      <FadeIn>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Submit New Property</h1>
          <p className="text-muted-foreground mt-1">Fill in the property details to submit for approval</p>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="flex items-center justify-between overflow-x-auto pb-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <button
                onClick={() => setCurrentStep(step.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
                  currentStep === step.id
                    ? "bg-primary text-primary-foreground"
                    : currentStep > step.id
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted",
                )}
              >
                <div
                  className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium",
                    currentStep === step.id
                      ? "bg-primary-foreground/20"
                      : currentStep > step.id
                        ? "bg-foreground/10"
                        : "bg-muted",
                  )}
                >
                  {currentStep > step.id ? <Check className="h-4 w-4" /> : step.id}
                </div>
                <span className="hidden sm:inline font-medium">{step.title}</span>
              </button>
              {index < steps.length - 1 && <div className="w-8 lg:w-16 h-[2px] bg-border mx-2" />}
            </div>
          ))}
        </div>
      </FadeIn>

      <FadeIn delay={0.2}>
        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep - 1].title}</CardTitle>
            <CardDescription>
              {currentStep === 1 && "Enter the basic information about the property"}
              {currentStep === 2 && "Provide the property location details"}
              {currentStep === 3 && "Set the pricing and listing type"}
              {currentStep === 4 && "Upload photos and videos of the property"}
              {currentStep === 5 && "Upload required documents for verification"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentStep === 1 && (
              <>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Property Title</label>
                    <Input placeholder="e.g., Modern Downtown Apartment" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Property Type</label>
                    <Select>
                      <SelectTrigger>
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
                  <div>
                    <label className="text-sm font-medium mb-2 block">Bedrooms</label>
                    <Select>
                      <SelectTrigger>
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
                  <div>
                    <label className="text-sm font-medium mb-2 block">Bathrooms</label>
                    <Select>
                      <SelectTrigger>
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
                  <div>
                    <label className="text-sm font-medium mb-2 block">Square Feet</label>
                    <Input type="number" placeholder="e.g., 1200" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <Textarea placeholder="Describe the property in detail..." rows={5} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-3 block">Amenities</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {amenities.map((amenity) => (
                      <div key={amenity} className="flex items-center space-x-2">
                        <Checkbox id={amenity} />
                        <label htmlFor={amenity} className="text-sm cursor-pointer">
                          {amenity}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Street Address</label>
                    <Input placeholder="123 Main Street" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Apt/Suite/Unit</label>
                    <Input placeholder="Apt 4B" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">City</label>
                    <Input placeholder="New York" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">State</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ny">New York</SelectItem>
                        <SelectItem value="ca">California</SelectItem>
                        <SelectItem value="tx">Texas</SelectItem>
                        <SelectItem value="fl">Florida</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">ZIP Code</label>
                    <Input placeholder="10001" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Neighborhood/Area</label>
                  <Input placeholder="e.g., Midtown Manhattan" />
                </div>
              </>
            )}

            {currentStep === 3 && (
              <>
                <div>
                  <label className="text-sm font-medium mb-2 block">Listing Type</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select listing type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rent">For Rent</SelectItem>
                      <SelectItem value="sale">For Sale</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Price</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input type="number" placeholder="2500" className="pl-9" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Price Period (if rent)</label>
                    <Select>
                      <SelectTrigger>
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
                  <div>
                    <label className="text-sm font-medium mb-2 block">Security Deposit</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input type="number" placeholder="2500" className="pl-9" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Available From</label>
                    <Input type="date" />
                  </div>
                </div>
              </>
            )}

            {currentStep === 4 && (
              <>
                <div>
                  <label className="text-sm font-medium mb-2 block">Property Photos</label>
                  <p className="text-sm text-muted-foreground mb-4">
                    Upload high-quality photos. First image will be the cover photo.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {uploadedImages.map((img, index) => (
                      <div key={index} className="relative aspect-video bg-muted rounded-lg overflow-hidden group">
                        <img src={img || "/placeholder.svg"} alt="" className="object-cover w-full h-full" />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 h-6 w-6 rounded-full bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        {index === 0 && (
                          <span className="absolute bottom-2 left-2 text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                            Cover
                          </span>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={handleImageUpload}
                      className="aspect-video border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 hover:border-foreground/50 transition-colors"
                    >
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Upload Photo</span>
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Video Tour (Optional)</label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground">Drag and drop a video file or click to upload</p>
                    <p className="text-xs text-muted-foreground mt-1">MP4, MOV up to 100MB</p>
                    <Button variant="outline" className="mt-4 bg-transparent">
                      Choose File
                    </Button>
                  </div>
                </div>
              </>
            )}

            {currentStep === 5 && (
              <>
                <div>
                  <label className="text-sm font-medium mb-2 block">Required Documents</label>
                  <p className="text-sm text-muted-foreground mb-4">
                    Upload property ownership documents, certificates, and any relevant paperwork.
                  </p>
                  <div className="space-y-3">
                    {uploadedDocs.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5" />
                          <span className="text-sm font-medium">{doc}</span>
                        </div>
                        <button
                          onClick={() => removeDoc(index)}
                          className="h-8 w-8 rounded-full hover:bg-background flex items-center justify-center"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={handleDocUpload}
                      className="w-full border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center gap-2 hover:border-foreground/50 transition-colors"
                    >
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Upload Document</span>
                      <span className="text-xs text-muted-foreground">PDF, DOC, JPG up to 10MB</span>
                    </button>
                  </div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Submission Checklist</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" /> Basic property information
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" /> Location details
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" /> Pricing information
                    </li>
                    <li className="flex items-center gap-2">
                      {uploadedImages.length > 0 ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <X className="h-4 w-4 text-red-500" />
                      )}
                      At least one photo uploaded
                    </li>
                    <li className="flex items-center gap-2">
                      {uploadedDocs.length > 0 ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <X className="h-4 w-4 text-red-500" />
                      )}
                      Documents uploaded
                    </li>
                  </ul>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </FadeIn>

      <FadeIn delay={0.3}>
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="bg-transparent"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          {currentStep < steps.length ? (
            <Button onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}>
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button>
              <Check className="h-4 w-4 mr-2" />
              Submit Property
            </Button>
          )}
        </div>
      </FadeIn>
    </div>
  )
}
