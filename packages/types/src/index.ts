// Property Types
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

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  createdAt: string
}

export type UserRole = 'admin' | 'agent' | 'owner' | 'tenant'

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

