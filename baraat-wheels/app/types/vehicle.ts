// app/types/vehicle.ts
export interface Vehicle {
  id: string
  name: string
  type: 'ghodi' | 'luxury' | 'royal' | 'premium'
  city: string
  price: number
  rating: number
  reviewCount?: number
  image: string
  featured: boolean
  description?: string
  features?: string[]
  images?: string[]
  partner?: {
    name: string
    rating: number
    joined: string
  }
}