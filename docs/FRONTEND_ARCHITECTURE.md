# Frontend Architecture & Performance Guide
## Industry Concepts & SOLID Principles for PropFlow

---

## 🎯 Core Performance Principles

### 1. **Critical Rendering Path Optimization**
- **First Contentful Paint (FCP)**: < 1.8s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Time to Interactive (TTI)**: < 3.8s
- **Cumulative Layout Shift (CLS)**: < 0.1

**Implementation:**
- Use Next.js Image component with priority for above-the-fold images
- Implement code splitting at route level (automatic in Next.js)
- Lazy load components below the fold
- Preload critical resources

### 2. **Bundle Size Optimization**
- Target: Initial bundle < 200KB (gzipped)
- Use dynamic imports for heavy components
- Tree-shake unused code
- Analyze bundle with `@next/bundle-analyzer`

### 3. **Network Optimization**
- Implement request deduplication
- Use HTTP/2 Server Push for critical assets
- Implement request caching strategies
- Use SWR or React Query for data fetching

---

## 🏗️ SOLID Principles (Frontend Adaptation)

### **S - Single Responsibility Principle**
Each component should have one reason to change.

**Bad:**
```tsx
// Component does too much
function PropertyCard({ property }) {
  // Rendering logic
  // API call logic
  // Formatting logic
  // Validation logic
}
```

**Good:**
```tsx
// Separate concerns
function PropertyCard({ property }) {
  return <Card>{/* Rendering only */}</Card>
}

function usePropertyData(id) {
  // Data fetching logic
}

function formatPropertyPrice(price) {
  // Formatting logic
}
```

### **O - Open/Closed Principle**
Open for extension, closed for modification.

**Implementation:**
- Use composition over inheritance
- Create base components with variant props
- Use render props or children for extensibility

```tsx
// Base component
function BaseCard({ variant, children, ...props }) {
  return <Card className={variants[variant]} {...props}>{children}</Card>
}

// Extended without modification
function PropertyCard({ property, ...props }) {
  return (
    <BaseCard variant="property" {...props}>
      {/* Property-specific content */}
    </BaseCard>
  )
}
```

### **L - Liskov Substitution Principle**
Derived components should be substitutable for their base components.

**Implementation:**
- Maintain consistent prop interfaces
- Use TypeScript interfaces for contracts

```tsx
interface BaseComponentProps {
  id: string
  className?: string
}

interface PropertyCardProps extends BaseComponentProps {
  property: Property
}

// Both can be used interchangeably where BaseComponentProps is expected
```

### **I - Interface Segregation Principle**
Clients shouldn't depend on interfaces they don't use.

**Implementation:**
- Create focused, specific hooks
- Split large prop interfaces into smaller ones
- Use composition for optional features

```tsx
// Bad: One large interface
interface PropertyCardProps {
  property: Property
  showActions: boolean
  showStats: boolean
  showMap: boolean
  // ... many more
}

// Good: Segregated interfaces
interface PropertyCardBaseProps {
  property: Property
}

interface PropertyCardActionsProps {
  showActions: boolean
  onEdit?: () => void
  onDelete?: () => void
}

// Compose as needed
```

### **D - Dependency Inversion Principle**
Depend on abstractions, not concretions.

**Implementation:**
- Use dependency injection for API clients
- Abstract data fetching behind hooks
- Use context for shared dependencies

```tsx
// Abstraction
interface ApiClient {
  getProperty(id: string): Promise<Property>
  updateProperty(id: string, data: Property): Promise<Property>
}

// Implementation
function useProperty(id: string, apiClient: ApiClient) {
  // Uses abstraction, not concrete implementation
}
```

---

## 🚀 Performance Optimization Strategies

### 1. **Code Splitting & Lazy Loading**

```tsx
// Route-level splitting (automatic in Next.js)
// Component-level lazy loading
import dynamic from 'next/dynamic'

const PropertyVerification = dynamic(
  () => import('@/components/admin/property-verification'),
  {
    loading: () => <Skeleton />,
    ssr: false // If not needed for SEO
  }
)

// Heavy libraries
const Chart = dynamic(() => import('recharts'), { ssr: false })
```

### 2. **Memoization Strategy**

```tsx
// React.memo for expensive components
const PropertyCard = React.memo(({ property }) => {
  // Component logic
}, (prevProps, nextProps) => {
  // Custom comparison
  return prevProps.property.id === nextProps.property.id
})

// useMemo for expensive calculations
const filteredProperties = useMemo(() => {
  return properties.filter(/* expensive filter */)
}, [properties, filters])

// useCallback for stable function references
const handleSubmit = useCallback((data) => {
  onSubmit(data)
}, [onSubmit])
```

### 3. **Virtual Scrolling for Large Lists**

```tsx
// Use react-window or react-virtual for long lists
import { useVirtualizer } from '@tanstack/react-virtual'

function PropertiesList({ properties }) {
  const parentRef = useRef()
  
  const virtualizer = useVirtualizer({
    count: properties.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 200,
  })
  
  return (
    <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
      {virtualizer.getVirtualItems().map(virtualItem => (
        <PropertyCard
          key={virtualItem.key}
          property={properties[virtualItem.index]}
          style={{
            height: `${virtualItem.size}px`,
            transform: `translateY(${virtualItem.start}px)`,
          }}
        />
      ))}
    </div>
  )
}
```

### 4. **Image Optimization**

```tsx
// Next.js Image with proper configuration
<Image
  src={property.image}
  alt={property.title}
  width={400}
  height={300}
  priority={isAboveFold} // For LCP optimization
  placeholder="blur" // Blur placeholder
  blurDataURL={blurDataUrl}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  loading={isAboveFold ? "eager" : "lazy"}
/>
```

### 5. **Request Optimization**

```tsx
// Request deduplication with SWR
import useSWR from 'swr'

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json()
}

function useProperty(id: string) {
  const { data, error, isLoading } = useSWR(
    id ? `/api/properties/${id}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 2000, // Dedupe requests within 2s
    }
  )
  
  return { property: data, error, isLoading }
}
```

---

## 🔄 State Management Patterns

### 1. **Server State vs Client State**

```tsx
// Server State (from API) - Use SWR/React Query
const { data: properties } = useSWR('/api/properties', fetcher)

// Client State (UI state) - Use useState/useReducer
const [filters, setFilters] = useState({ type: '', price: '' })

// Shared Client State - Use Context (sparingly)
const { theme, setTheme } = useTheme()
```

### 2. **Optimistic Updates**

```tsx
function useUpdateProperty() {
  const { mutate } = useSWRConfig()
  
  const updateProperty = async (id: string, data: Property) => {
    // Optimistic update
    mutate(`/api/properties/${id}`, data, false)
    
    try {
      const updated = await api.updateProperty(id, data)
      // Revalidate with server data
      mutate(`/api/properties/${id}`, updated)
    } catch (error) {
      // Rollback on error
      mutate(`/api/properties/${id}`)
      throw error
    }
  }
  
  return { updateProperty }
}
```

### 3. **Pagination & Infinite Scroll**

```tsx
import useSWRInfinite from 'swr/infinite'

function useInfiniteProperties(filters: Filters) {
  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.hasMore) return null
    return [`/api/properties`, pageIndex, filters]
  }
  
  const { data, error, size, setSize, isValidating } = useSWRInfinite(
    getKey,
    fetcher,
    {
      revalidateFirstPage: false,
    }
  )
  
  const properties = data ? data.flatMap(page => page.properties) : []
  const isLoadingMore = isValidating && data && data.length > 0
  
  return {
    properties,
    error,
    isLoadingMore,
    loadMore: () => setSize(size + 1),
    hasMore: data?.[data.length - 1]?.hasMore ?? false,
  }
}
```

---

## 🛡️ Reliability & Error Handling

### 1. **Error Boundaries**

```tsx
// app/error-boundary.tsx
'use client'

import { Component, ReactNode } from 'react'
import { Button } from '@/components/ui/button'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo)
    // Log to error tracking service
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <h2 className="text-xl font-semibold mb-4">Something went wrong</h2>
          <Button onClick={() => this.setState({ hasError: false })}>
            Try Again
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}
```

### 2. **Retry Logic with Exponential Backoff**

```tsx
async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  maxRetries = 3
): Promise<Response> {
  let lastError: Error
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options)
      if (response.ok) return response
      throw new Error(`HTTP ${response.status}`)
    } catch (error) {
      lastError = error as Error
      if (i < maxRetries - 1) {
        const delay = Math.pow(2, i) * 1000 // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }
  
  throw lastError!
}
```

### 3. **Graceful Degradation**

```tsx
function PropertyCard({ property }: { property: Property }) {
  const [imageError, setImageError] = useState(false)
  
  return (
    <Card>
      {!imageError ? (
        <Image
          src={property.image}
          onError={() => setImageError(true)}
          alt={property.title}
        />
      ) : (
        <div className="bg-muted flex items-center justify-center h-48">
          <ImageIcon className="h-12 w-12 text-muted-foreground" />
        </div>
      )}
      {/* Rest of component */}
    </Card>
  )
}
```

---

## 📦 Code Organization Principles

### 1. **Feature-Based Structure**

```
/components
  /properties
    /property-card
      - index.tsx
      - property-card.tsx
      - property-card.test.tsx
      - property-card.styles.ts
    /property-list
      - index.tsx
      - property-list.tsx
      - use-property-list.ts
```

### 2. **Custom Hooks for Logic Separation**

```tsx
// hooks/use-property-filters.ts
export function usePropertyFilters(initialFilters: Filters) {
  const [filters, setFilters] = useState(initialFilters)
  const [debouncedFilters, setDebouncedFilters] = useState(filters)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(filters)
    }, 300)
    
    return () => clearTimeout(timer)
  }, [filters])
  
  return {
    filters,
    debouncedFilters,
    updateFilter: (key: keyof Filters, value: any) => {
      setFilters(prev => ({ ...prev, [key]: value }))
    },
    resetFilters: () => setFilters(initialFilters),
  }
}
```

### 3. **Type Safety with TypeScript**

```tsx
// types/property.ts
export interface Property {
  id: string
  title: string
  address: Address
  price: Price
  type: PropertyType
  status: PropertyStatus
  agent: Agent
  images: string[]
  documents: Document[]
  createdAt: string
  updatedAt: string
}

export type PropertyType = 'apartment' | 'house' | 'condo' | 'villa' | 'commercial'
export type PropertyStatus = 'pending' | 'active' | 'sold' | 'rented' | 'rejected'

// Utility types
export type PropertyPreview = Pick<Property, 'id' | 'title' | 'address' | 'price' | 'images'>
export type PropertyFormData = Omit<Property, 'id' | 'createdAt' | 'updatedAt'>
```

---

## 🎨 UI/UX Performance Patterns

### 1. **Skeleton Loading States**

```tsx
function PropertyCardSkeleton() {
  return (
    <Card>
      <Skeleton className="h-48 w-full" />
      <CardContent className="p-4">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
    </Card>
  )
}

function PropertiesList({ isLoading, properties }) {
  if (isLoading) {
    return (
      <div className="grid gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <PropertyCardSkeleton key={i} />
        ))}
      </div>
    )
  }
  
  return properties.map(property => (
    <PropertyCard key={property.id} property={property} />
  ))
}
```

### 2. **Progressive Enhancement**

```tsx
// Start with basic functionality, enhance with JS
function SearchInput({ onSearch }: { onSearch: (query: string) => void }) {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)
  
  useEffect(() => {
    if (debouncedQuery) {
      onSearch(debouncedQuery)
    }
  }, [debouncedQuery, onSearch])
  
  return (
    <Input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search properties..."
      // Works without JS (form submission)
      type="search"
    />
  )
}
```

### 3. **Optimistic UI Updates**

```tsx
function PropertyVerification({ propertyId }: { propertyId: string }) {
  const { property, mutate } = useProperty(propertyId)
  const [isApproving, setIsApproving] = useState(false)
  
  const handleApprove = async () => {
    setIsApproving(true)
    
    // Optimistic update
    mutate(
      { ...property, status: 'active' },
      false // Don't revalidate yet
    )
    
    try {
      await approveProperty(propertyId)
      // Revalidate to get server state
      mutate()
    } catch (error) {
      // Rollback on error
      mutate()
      toast.error('Failed to approve property')
    } finally {
      setIsApproving(false)
    }
  }
  
  return (
    <Button
      onClick={handleApprove}
      disabled={isApproving}
    >
      {isApproving ? 'Approving...' : 'Approve'}
    </Button>
  )
}
```

---

## 🔍 Monitoring & Analytics

### 1. **Performance Monitoring**

```tsx
// lib/performance.ts
export function reportWebVitals(metric: any) {
  // Send to analytics
  if (metric.label === 'web-vital') {
    switch (metric.name) {
      case 'CLS':
        analytics.track('Web Vital', {
          name: 'CLS',
          value: metric.value,
          id: metric.id,
        })
        break
      case 'FCP':
      case 'LCP':
      case 'FID':
      case 'TTFB':
        // Track other metrics
        break
    }
  }
}

// app/layout.tsx
export function reportWebVitals(metric: any) {
  reportWebVitals(metric)
}
```

### 2. **Error Tracking**

```tsx
// lib/error-tracking.ts
export function logError(error: Error, context?: Record<string, any>) {
  // Send to error tracking service (Sentry, LogRocket, etc.)
  console.error('Error:', error, context)
  
  // In production:
  // Sentry.captureException(error, { extra: context })
}
```

---

## 📋 Checklist for Implementation

### Performance
- [ ] Implement code splitting for routes and heavy components
- [ ] Optimize images with Next.js Image component
- [ ] Add skeleton loading states
- [ ] Implement virtual scrolling for long lists
- [ ] Use memoization for expensive calculations
- [ ] Debounce search and filter inputs
- [ ] Implement request deduplication
- [ ] Add service worker for offline support (optional)

### Reliability
- [ ] Add error boundaries at route level
- [ ] Implement retry logic for API calls
- [ ] Add graceful degradation for features
- [ ] Handle network errors gracefully
- [ ] Implement optimistic updates with rollback
- [ ] Add proper loading states
- [ ] Handle empty states

### Code Quality
- [ ] Follow SOLID principles
- [ ] Separate concerns (UI, logic, data)
- [ ] Use TypeScript strictly
- [ ] Create reusable hooks
- [ ] Implement proper error handling
- [ ] Add unit tests for critical logic
- [ ] Document complex components

### User Experience
- [ ] Implement optimistic UI updates
- [ ] Add proper feedback (toasts, loading states)
- [ ] Ensure accessibility (a11y)
- [ ] Test on multiple devices/browsers
- [ ] Implement proper form validation
- [ ] Add keyboard navigation support

---

## 🚀 Quick Wins (Start Here)

1. **Add SWR for data fetching** - Immediate performance boost
2. **Implement skeleton loaders** - Better perceived performance
3. **Add error boundaries** - Better error handling
4. **Optimize images** - Use Next.js Image everywhere
5. **Debounce search inputs** - Reduce unnecessary API calls
6. **Memoize expensive components** - Reduce re-renders
7. **Add TypeScript strict mode** - Catch errors early

---

## 📚 Recommended Libraries

- **Data Fetching**: SWR or TanStack Query (React Query)
- **Forms**: React Hook Form (already using)
- **Virtual Scrolling**: @tanstack/react-virtual
- **State Management**: Zustand (if needed, otherwise Context/useState)
- **Error Tracking**: Sentry
- **Analytics**: Vercel Analytics (already using)
- **Testing**: Vitest + React Testing Library

---

This architecture will ensure your frontend is fast, reliable, and maintainable while waiting for the backend API.

