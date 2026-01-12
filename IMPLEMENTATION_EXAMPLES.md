# Practical Implementation Examples
## Applying Architecture Principles to PropFlow

---

## Example 1: Optimized Property List Component

### Before (Current Implementation)
```tsx
// components/listings/listings-grid.tsx (Current)
"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"

const properties = [/* hardcoded data */]

export function ListingsGrid() {
  const [filteredProperties, setFilteredProperties] = useState(properties)
  
  // Inefficient: Re-filters on every render
  const handleFilter = (filters) => {
    const filtered = properties.filter(/* ... */)
    setFilteredProperties(filtered)
  }
  
  return (
    <div className="grid gap-4">
      {filteredProperties.map(property => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  )
}
```

### After (Optimized Implementation)
```tsx
// components/listings/listings-grid.tsx (Optimized)
"use client"

import { useMemo, memo } from "react"
import { useSWR } from "swr"
import { useVirtualizer } from "@tanstack/react-virtual"
import { PropertyCard } from "./property-card"
import { PropertyCardSkeleton } from "./property-card-skeleton"
import { usePropertyFilters } from "@/hooks/use-property-filters"
import { EmptyState } from "@/components/ui/empty"

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json()
}

interface ListingsGridProps {
  initialFilters?: Filters
}

export function ListingsGrid({ initialFilters }: ListingsGridProps) {
  const { debouncedFilters } = usePropertyFilters(initialFilters || {})
  
  // Data fetching with SWR
  const { data, error, isLoading } = useSWR(
    ['/api/properties', debouncedFilters],
    ([url, filters]) => fetcher(`${url}?${new URLSearchParams(filters)}`),
    {
      revalidateOnFocus: false,
      dedupingInterval: 2000,
    }
  )
  
  // Memoized filtered results
  const filteredProperties = useMemo(() => {
    if (!data?.properties) return []
    // Additional client-side filtering if needed
    return data.properties
  }, [data])
  
  // Virtual scrolling for performance
  const parentRef = useRef<HTMLDivElement>(null)
  const virtualizer = useVirtualizer({
    count: filteredProperties.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 320,
    overscan: 5,
  })
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <PropertyCardSkeleton key={i} />
        ))}
      </div>
    )
  }
  
  if (error) {
    return <ErrorState error={error} />
  }
  
  if (filteredProperties.length === 0) {
    return <EmptyState message="No properties found" />
  }
  
  return (
    <div
      ref={parentRef}
      className="h-[800px] overflow-auto"
      style={{ contain: 'strict' }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const property = filteredProperties[virtualItem.index]
          return (
            <div
              key={virtualItem.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <PropertyCard property={property} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Memoized card component
const PropertyCard = memo(({ property }: { property: Property }) => {
  return (
    <Card className="h-full">
      {/* Card content */}
    </Card>
  )
}, (prev, next) => prev.property.id === next.property.id)

PropertyCard.displayName = 'PropertyCard'
```

---

## Example 2: Optimized Property Verification Component

### Before (Current)
```tsx
// components/admin/property-verification.tsx (Current)
const pendingProperties = [/* hardcoded */]

export function PropertyVerification() {
  const [selectedProperty, setSelectedProperty] = useState(null)
  
  const handleApprove = () => {
    setSelectedProperty(null) // No actual API call
  }
  
  return (/* JSX */)
}
```

### After (Optimized with API Integration Ready)
```tsx
// components/admin/property-verification.tsx (Optimized)
"use client"

import { useState, useCallback, useMemo } from "react"
import { useSWR, useSWRConfig } from "swr"
import { toast } from "sonner"
import { PropertyVerificationCard } from "./property-verification-card"
import { PropertyVerificationDialog } from "./property-verification-dialog"
import { usePropertyVerification } from "@/hooks/use-property-verification"
import { ErrorBoundary } from "@/components/error-boundary"

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    const error = new Error('Failed to fetch properties')
    error.cause = res.status
    throw error
  }
  return res.json()
}

export function PropertyVerification() {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/admin/properties/pending',
    fetcher,
    {
      refreshInterval: 30000, // Poll every 30s
      revalidateOnFocus: true,
    }
  )
  
  const { approveProperty, rejectProperty } = usePropertyVerification()
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  
  // Memoized pending properties
  const pendingProperties = useMemo(() => {
    return data?.properties || []
  }, [data])
  
  // Optimistic approve handler
  const handleApprove = useCallback(async (property: Property) => {
    // Optimistic update
    mutate(
      {
        properties: pendingProperties.filter(p => p.id !== property.id)
      },
      false
    )
    
    try {
      await approveProperty(property.id)
      toast.success('Property approved successfully')
      mutate() // Revalidate
    } catch (error) {
      // Rollback
      mutate()
      toast.error('Failed to approve property')
      throw error
    }
  }, [approveProperty, mutate, pendingProperties])
  
  // Reject handler with error handling
  const handleReject = useCallback(async (
    property: Property,
    reason: string,
    notes?: string
  ) => {
    try {
      await rejectProperty(property.id, reason, notes)
      toast.success('Property rejected')
      mutate() // Revalidate
      setShowRejectDialog(false)
    } catch (error) {
      toast.error('Failed to reject property')
      throw error
    }
  }, [rejectProperty, mutate])
  
  if (isLoading) {
    return <PropertyVerificationSkeleton />
  }
  
  if (error) {
    return <ErrorState error={error} onRetry={() => mutate()} />
  }
  
  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <Header count={pendingProperties.length} />
        
        <SearchAndFilters
          onSearch={(query) => {/* Filter logic */}}
          onSort={(sort) => {/* Sort logic */}}
        />
        
        <StaggerContainer className="grid gap-4">
          {pendingProperties.map((property) => (
            <StaggerItem key={property.id}>
              <PropertyVerificationCard
                property={property}
                onView={() => setSelectedProperty(property)}
                onApprove={() => handleApprove(property)}
                onReject={() => {
                  setSelectedProperty(property)
                  setShowRejectDialog(true)
                }}
              />
            </StaggerItem>
          ))}
        </StaggerContainer>
        
        {pendingProperties.length === 0 && (
          <EmptyState message="All caught up! No pending verifications." />
        )}
        
        {selectedProperty && (
          <PropertyVerificationDialog
            property={selectedProperty}
            open={!!selectedProperty && !showRejectDialog}
            onClose={() => setSelectedProperty(null)}
            onApprove={() => handleApprove(selectedProperty)}
            onReject={() => setShowRejectDialog(true)}
          />
        )}
        
        <RejectDialog
          property={selectedProperty}
          open={showRejectDialog}
          onClose={() => {
            setShowRejectDialog(false)
            setSelectedProperty(null)
          }}
          onConfirm={(reason, notes) => {
            if (selectedProperty) {
              handleReject(selectedProperty, reason, notes)
            }
          }}
        />
      </div>
    </ErrorBoundary>
  )
}
```

---

## Example 3: Custom Hook for Property Verification

```tsx
// hooks/use-property-verification.ts
import { useSWRConfig } from 'swr'
import { toast } from 'sonner'
import { fetchWithRetry } from '@/lib/fetch-utils'

interface ApprovePropertyParams {
  propertyId: string
  notes?: string
}

interface RejectPropertyParams {
  propertyId: string
  reason: string
  notes?: string
}

export function usePropertyVerification() {
  const { mutate } = useSWRConfig()
  
  const approveProperty = async ({ propertyId, notes }: ApprovePropertyParams) => {
    const response = await fetchWithRetry(
      `/api/admin/properties/${propertyId}/approve`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      },
      3 // Max retries
    )
    
    if (!response.ok) {
      throw new Error('Failed to approve property')
    }
    
    // Invalidate related queries
    mutate(key => typeof key === 'string' && key.includes('/properties'))
    
    return response.json()
  }
  
  const rejectProperty = async ({ propertyId, reason, notes }: RejectPropertyParams) => {
    const response = await fetchWithRetry(
      `/api/admin/properties/${propertyId}/reject`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason, notes }),
      },
      3
    )
    
    if (!response.ok) {
      throw new Error('Failed to reject property')
    }
    
    mutate(key => typeof key === 'string' && key.includes('/properties'))
    
    return response.json()
  }
  
  return {
    approveProperty,
    rejectProperty,
  }
}
```

---

## Example 4: Optimized Property Submission Form

### Before (Current)
```tsx
// Multi-step form with all logic in one component
export function PropertySubmissionForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({})
  // All form logic mixed with UI
}
```

### After (Separated Concerns)
```tsx
// hooks/use-property-submission.ts
import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { propertySubmissionSchema } from '@/lib/validations/property'
import type { PropertyFormData } from '@/types/property'

export function usePropertySubmission() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertySubmissionSchema),
    mode: 'onChange',
    defaultValues: {
      // Default values
    },
  })
  
  const nextStep = useCallback(() => {
    form.trigger() // Validate current step
    if (form.formState.isValid) {
      setCurrentStep(prev => Math.min(prev + 1, 5))
    }
  }, [form])
  
  const previousStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }, [])
  
  const submitProperty = useCallback(async (data: PropertyFormData) => {
    setIsSubmitting(true)
    try {
      // API call will go here
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) throw new Error('Submission failed')
      
      return response.json()
    } finally {
      setIsSubmitting(false)
    }
  }, [])
  
  return {
    form,
    currentStep,
    nextStep,
    previousStep,
    submitProperty,
    isSubmitting,
  }
}

// components/agent/property-submission-form.tsx
"use client"

import { usePropertySubmission } from "@/hooks/use-property-submission"
import { PropertySubmissionSteps } from "./property-submission-steps"
import { PropertySubmissionStep1 } from "./steps/step-1-basic-info"
import { PropertySubmissionStep2 } from "./steps/step-2-location"
import { PropertySubmissionStep3 } from "./steps/step-3-pricing"
import { PropertySubmissionStep4 } from "./steps/step-4-media"
import { PropertySubmissionStep5 } from "./steps/step-5-documents"
import { ErrorBoundary } from "@/components/error-boundary"

export function PropertySubmissionForm() {
  const {
    form,
    currentStep,
    nextStep,
    previousStep,
    submitProperty,
    isSubmitting,
  } = usePropertySubmission()
  
  const handleSubmit = async (data: PropertyFormData) => {
    try {
      await submitProperty(data)
      toast.success('Property submitted successfully!')
      // Navigate to listings
    } catch (error) {
      toast.error('Failed to submit property')
    }
  }
  
  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <Header />
        
        <PropertySubmissionSteps
          currentStep={currentStep}
          onStepClick={(step) => {
            // Allow going back, validate before going forward
            if (step < currentStep) {
              form.setValue('currentStep', step)
            }
          }}
        />
        
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          {currentStep === 1 && <PropertySubmissionStep1 form={form} />}
          {currentStep === 2 && <PropertySubmissionStep2 form={form} />}
          {currentStep === 3 && <PropertySubmissionStep3 form={form} />}
          {currentStep === 4 && <PropertySubmissionStep4 form={form} />}
          {currentStep === 5 && <PropertySubmissionStep5 form={form} />}
          
          <FormNavigation
            currentStep={currentStep}
            onPrevious={previousStep}
            onNext={nextStep}
            isSubmitting={isSubmitting}
            canProceed={form.formState.isValid}
          />
        </form>
      </div>
    </ErrorBoundary>
  )
}
```

---

## Example 5: Fetch Utility with Retry Logic

```tsx
// lib/fetch-utils.ts
interface FetchOptions extends RequestInit {
  retries?: number
  retryDelay?: number
  timeout?: number
}

export async function fetchWithRetry(
  url: string,
  options: FetchOptions = {},
  maxRetries = 3
): Promise<Response> {
  const { retries = maxRetries, retryDelay = 1000, timeout = 10000, ...fetchOptions } = options
  
  let lastError: Error
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // Timeout wrapper
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)
      
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      })
      
      clearTimeout(timeoutId)
      
      if (response.ok) {
        return response
      }
      
      // Don't retry on client errors (4xx)
      if (response.status >= 400 && response.status < 500) {
        throw new Error(`Client error: ${response.status}`)
      }
      
      throw new Error(`HTTP ${response.status}`)
    } catch (error) {
      lastError = error as Error
      
      // Don't retry on abort or client errors
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout')
      }
      
      if (attempt < retries) {
        const delay = retryDelay * Math.pow(2, attempt) // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }
  
  throw lastError!
}

// SWR fetcher with retry
export const swrFetcher = async (url: string) => {
  const response = await fetchWithRetry(url, { retries: 3 })
  if (!response.ok) {
    throw new Error('Failed to fetch')
  }
  return response.json()
}
```

---

## Example 6: Error Boundary Implementation

```tsx
// components/error-boundary.tsx
"use client"

import { Component, ReactNode, ErrorInfo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { logError } from '@/lib/error-tracking'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onReset?: () => void
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo })
    
    // Log to error tracking service
    logError(error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: true,
    })
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
    
    if (this.props.onReset) {
      this.props.onReset()
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <Card className="max-w-md mx-auto mt-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <CardTitle>Something went wrong</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-xs">
                <summary className="cursor-pointer text-muted-foreground">
                  Error details
                </summary>
                <pre className="mt-2 p-2 bg-muted rounded overflow-auto">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
            
            <div className="flex gap-2">
              <Button onClick={this.handleReset} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              <Button
                onClick={() => window.location.reload()}
                variant="default"
              >
                Reload Page
              </Button>
            </div>
          </CardContent>
        </Card>
      )
    }

    return this.props.children
  }
}
```

---

## Example 7: Type Definitions

```tsx
// types/property.ts
export interface Property {
  id: string
  title: string
  description: string
  address: Address
  price: Price
  type: PropertyType
  status: PropertyStatus
  agent: Agent
  images: string[]
  documents: Document[]
  amenities: string[]
  specifications: PropertySpecifications
  createdAt: string
  updatedAt: string
  verifiedAt?: string
}

export interface Address {
  street: string
  unit?: string
  city: string
  state: string
  zipCode: string
  neighborhood?: string
  fullAddress: string
}

export interface Price {
  amount: number
  currency: string
  period?: 'month' | 'week' | 'year'
  deposit?: number
}

export type PropertyType = 
  | 'apartment' 
  | 'house' 
  | 'condo' 
  | 'villa' 
  | 'commercial'

export type PropertyStatus = 
  | 'pending' 
  | 'active' 
  | 'sold' 
  | 'rented' 
  | 'rejected'

export interface PropertySpecifications {
  bedrooms: number
  bathrooms: number
  squareFeet: number
  yearBuilt?: number
  parking?: number
}

export interface Agent {
  id: string
  name: string
  email: string
  phone: string
  license?: string
  avatar?: string
}

export interface Document {
  id: string
  name: string
  type: string
  url: string
  uploadedAt: string
}

// Form types
export type PropertyFormData = Omit<
  Property,
  'id' | 'createdAt' | 'updatedAt' | 'verifiedAt' | 'agent'
> & {
  agentId?: string
}

// Preview type for lists
export type PropertyPreview = Pick<
  Property,
  'id' | 'title' | 'address' | 'price' | 'images' | 'type' | 'status'
>

// API response types
export interface PropertiesResponse {
  properties: Property[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

export interface PropertyResponse {
  property: Property
}
```

---

## Example 8: Validation Schema

```tsx
// lib/validations/property.ts
import { z } from 'zod'

export const propertySubmissionSchema = z.object({
  // Step 1: Basic Info
  title: z.string().min(10, 'Title must be at least 10 characters'),
  type: z.enum(['apartment', 'house', 'condo', 'villa', 'commercial']),
  bedrooms: z.number().min(0).max(20),
  bathrooms: z.number().min(0).max(20),
  squareFeet: z.number().min(100, 'Minimum 100 sqft'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  amenities: z.array(z.string()).optional(),
  
  // Step 2: Location
  address: z.object({
    street: z.string().min(5),
    unit: z.string().optional(),
    city: z.string().min(2),
    state: z.string().length(2),
    zipCode: z.string().regex(/^\d{5}$/),
    neighborhood: z.string().optional(),
  }),
  
  // Step 3: Pricing
  price: z.object({
    amount: z.number().min(0),
    currency: z.string().default('USD'),
    period: z.enum(['month', 'week', 'year']).optional(),
    deposit: z.number().min(0).optional(),
  }),
  availableFrom: z.string().optional(),
  
  // Step 4: Media
  images: z.array(z.string().url()).min(1, 'At least one image required'),
  videoUrl: z.string().url().optional(),
  
  // Step 5: Documents
  documents: z.array(z.object({
    name: z.string(),
    type: z.string(),
    url: z.string().url(),
  })).min(1, 'At least one document required'),
}).refine(
  (data) => {
    // Custom validation: if period is set, it must be for rent
    if (data.price.period && data.price.amount < 100) {
      return false
    }
    return true
  },
  {
    message: 'Invalid price configuration',
    path: ['price'],
  }
)

export type PropertyFormData = z.infer<typeof propertySubmissionSchema>
```

---

These examples show how to apply the architecture principles to your actual codebase. Start implementing these patterns gradually, beginning with the highest-impact changes like adding SWR for data fetching and error boundaries.

