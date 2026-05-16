// // app/customer/wishlist/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { Heart, MapPin, Star, Trash2, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/app/contexts/AuthContext'
import { useRouter } from 'next/navigation'

interface WishlistItem {
  _id: string
  vehicleId: {
    _id: string
    name: string
    company: string
    pricePerDay: number
    image?: string
    location?: string
    rating?: number
  }
  createdAt: string
}

export default function WishlistPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [removingId, setRemovingId] = useState<string | null>(null)

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?callbackUrl=/customer/wishlist')
    }
  }, [user, authLoading, router])

  // Fetch wishlist on mount
  useEffect(() => {
    if (!user) return

    const fetchWishlist = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/customer/wishlist')
        if (!res.ok) {
          if (res.status === 401) throw new Error('Please login again')
          throw new Error('Failed to fetch wishlist')
        }
        const data = await res.json()
        setWishlist(data.wishlist || [])
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchWishlist()
  }, [user])

  // Remove item from wishlist
  const removeFromWishlist = async (vehicleId: string, wishlistItemId: string) => {
    if (!confirm('Remove this vehicle from your wishlist?')) return
    
    try {
      setRemovingId(wishlistItemId)
      const res = await fetch(`/api/customer/wishlist?vehicleId=${vehicleId}`, {
        method: 'DELETE',
      })
      
      if (!res.ok) {
        throw new Error('Failed to remove')
      }
      
      // Remove from local state
      setWishlist(prev => prev.filter(item => item._id !== wishlistItemId))
    } catch (err: any) {
      alert(err.message)
    } finally {
      setRemovingId(null)
    }
  }

  // Helper to get vehicle image or fallback emoji
  const getVehicleEmoji = (name: string) => {
    const lower = name.toLowerCase()
    if (lower.includes('horse')) return '🐎'
    if (lower.includes('rolls') || lower.includes('bentley')) return '🚗'
    if (lower.includes('mercedes') || lower.includes('maybach')) return '🚙'
    if (lower.includes('vintage')) return '🏎️'
    return '🚘'
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const wishlistItems = wishlist.map(item => ({
    id: item.vehicleId._id,
    wishlistId: item._id,
    name: `${item.vehicleId.company} ${item.vehicleId.name}`,
    type: 'luxury', // you can infer from vehicle type if available
    city: item.vehicleId.location || 'Multiple locations',
    price: item.vehicleId.pricePerDay,
    rating: item.vehicleId.rating || 4.5,
    image: item.vehicleId.image || getVehicleEmoji(item.vehicleId.name),
  }))

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
            <p className="text-gray-600">{wishlistItems.length} vehicle{wishlistItems.length !== 1 ? 's' : ''} saved</p>
          </div>
          <Link href="/vehicles">
            <button className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold hover:shadow-lg transition">
              + Browse More
            </button>
          </Link>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-600 mb-6">Save your favorite vehicles to book them later</p>
            <Link href="/vehicles">
              <button className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold">
                Explore Vehicles
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((vehicle) => (
              <div key={vehicle.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition">
                <div className="h-40 bg-gradient-to-br from-amber-100 to-yellow-100 flex items-center justify-center relative">
                  {typeof vehicle.image === 'string' && vehicle.image.startsWith('/') ? (
                    <img src={vehicle.image} alt={vehicle.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="text-6xl">{vehicle.image}</div>
                  )}
                  <button
                    onClick={() => removeFromWishlist(vehicle.id, vehicle.wishlistId)}
                    disabled={removingId === vehicle.wishlistId}
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition disabled:opacity-50"
                  >
                    {removingId === vehicle.wishlistId ? (
                      <Loader2 className="h-5 w-5 text-red-500 animate-spin" />
                    ) : (
                      <Trash2 className="h-5 w-5 text-red-500" />
                    )}
                  </button>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{vehicle.name}</h3>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-amber-500 fill-amber-500 mr-1" />
                      <span className="font-medium">{vehicle.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    {vehicle.city}
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div>
                      <span className="text-2xl font-bold">₹{vehicle.price.toLocaleString()}</span>
                      <span className="text-gray-500 text-sm">/day</span>
                    </div>
                    <Link href={`/vehicles/${vehicle.id}`}>
                      <button className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium hover:scale-105 transition">
                        Book Now
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}