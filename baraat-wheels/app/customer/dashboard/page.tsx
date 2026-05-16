// app/customer/dashboard/page.tsx
'use client'

import { useEffect, useState, useCallback } from 'react'
import { Calendar, Car, Heart, User, Clock, Star, AlertCircle, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/app/contexts/AuthContext'

// ─── Types ─────────────────────────────────────────────────────────

interface VehicleInfo {
  name: string
  company: string
  image?: string
  pricePerDay?: number
  location?: string
}

interface Booking {
  _id: string
  bookingNumber: string
  vehicleId: VehicleInfo
  startDate: string
  endDate: string
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed'
  totalPrice: number
}

interface WishlistItem {
  _id: string
  vehicleId: VehicleInfo
}

interface DashboardStats {
  totalBookings: number
  activeBookings: number
  wishlistCount: number
  reviewsCount: number
}

interface ApiResponse<T> {
  data?: T
  error?: string
}

// ─── Constants ─────────────────────────────────────────────────────

const UPCOMING_STATUSES = ['confirmed', 'pending'] as const
const MAX_BOOKINGS_DISPLAY = 3
const MAX_WISHLIST_DISPLAY = 2
const API_TIMEOUT = 10000 // 10 seconds

// ─── Helper Functions ─────────────────────────────────────────────

const formatBookingDate = (startDate: string, endDate: string): string => {
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' }
  const start = new Date(startDate).toLocaleDateString('en-US', options)
  const end = new Date(endDate).toLocaleDateString('en-US', options)
  return `${start} - ${end}`
}

const getStatusBadge = (status: Booking['status']) => {
  const styles = {
    confirmed: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    cancelled: 'bg-red-100 text-red-700',
    completed: 'bg-blue-100 text-blue-700',
  }
  const icons = {
    confirmed: '✅',
    pending: '⏳',
    cancelled: '❌',
    completed: '✓',
  }
  return { className: styles[status], icon: icons[status] }
}

// ─── Components ───────────────────────────────────────────────────

function StatCard({ label, value, icon: Icon, color }: {
  label: string
  value: number
  icon: React.ComponentType<{ className?: string }>
  color: string
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      <div className={`h-12 w-12 rounded-xl ${color} bg-opacity-10 flex items-center justify-center mb-4`}>
        <Icon className={`h-6 w-6 ${color.replace('bg-', 'text-')}`} />
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-gray-600">{label}</div>
    </div>
  )
}

function BookingCard({ booking }: { booking: Booking }) {
  const { className, icon } = getStatusBadge(booking.status)

  return (
    <div className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
      <div className="flex-shrink-0 mr-4">
        {booking.vehicleId?.image ? (
          <img
            src={booking.vehicleId.image}
            alt={`${booking.vehicleId.company} ${booking.vehicleId.name}`}
            className="w-14 h-14 object-cover rounded-lg"
            loading="lazy"
          />
        ) : (
          <div className="w-14 h-14 bg-gray-200 rounded-lg flex items-center justify-center">
            <Car className="h-8 w-8 text-gray-400" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-gray-900 truncate">
          {booking.vehicleId?.company} {booking.vehicleId?.name}
        </h3>
        <div className="flex items-center text-sm text-gray-600 mt-1">
          <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
          {formatBookingDate(booking.startDate, booking.endDate)}
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Booking #{booking.bookingNumber}
        </p>
      </div>
      <div className="flex-shrink-0 ml-4 flex flex-col items-end gap-2">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${className}`}>
          {icon} {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </span>
        <Link href={`/customer/bookings/${booking._id}`}>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors text-sm">
            View Details
          </button>
        </Link>
      </div>
    </div>
  )
}

function WishlistCard({ item }: { item: WishlistItem }) {
  return (
    <div className="flex items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
      <div className="flex-shrink-0 mr-3">
        {item.vehicleId?.image ? (
          <img
            src={item.vehicleId.image}
            alt={item.vehicleId.name}
            className="w-10 h-10 object-cover rounded"
            loading="lazy"
          />
        ) : (
          <Car className="h-5 w-5 text-gray-500" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-900 truncate">
          {item.vehicleId?.company} {item.vehicleId?.name}
        </div>
        <div className="text-sm text-gray-500">
          {item.vehicleId?.location || 'Location TBD'} • ₹{item.vehicleId?.pricePerDay?.toLocaleString('en-IN')}/day
        </div>
      </div>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-amber-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your dashboard...</p>
      </div>
    </div>
  )
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-amber-50">
      <div className="text-center max-w-md px-4">
        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <p className="text-red-600 mb-2 font-medium">Error loading dashboard</p>
        <p className="text-gray-500 mb-6 text-sm">{message}</p>
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition-colors flex items-center justify-center gap-2 mx-auto"
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </button>
      </div>
    </div>
  )
}

function EmptyBookings() {
  return (
    <div className="text-center py-12">
      <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
      <p className="text-gray-500 mb-2">No upcoming bookings</p>
      <p className="text-gray-400 text-sm mb-6">Start planning your wedding transport</p>
      <Link href="/vehicles">
        <button className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg transition-shadow">
          Browse Vehicles
        </button>
      </Link>
    </div>
  )
}

// ─── Main Page Component ──────────────────────────────────────────

export default function CustomerDashboard() {
  const { user, isLoading: authLoading } = useAuth()

  const [bookings, setBookings] = useState<Booking[]>([])
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    activeBookings: 0,
    wishlistCount: 0,
    reviewsCount: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch with timeout to prevent hanging requests
  const fetchWithTimeout = useCallback(async (url: string, options?: RequestInit) => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT)

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        credentials: 'include',
      })
      clearTimeout(timeoutId)
      return response
    } catch (err) {
      clearTimeout(timeoutId)
      throw err
    }
  }, [])

  const fetchDashboardData = useCallback(async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      // Parallel fetch for better performance
      const [bookingsRes, wishlistRes, statsRes] = await Promise.allSettled([
        fetchWithTimeout('/api/customer/bookings?limit=5'),
        fetchWithTimeout('/api/customer/wishlist?limit=10&page=1'),
        fetchWithTimeout('/api/customer/stats'),
      ])

      // Handle bookings
      if (bookingsRes.status === 'fulfilled' && bookingsRes.value.ok) {
        const data = await bookingsRes.value.json()
        setBookings(data.bookings || [])
      } else if (bookingsRes.status === 'rejected') {
        console.error('Bookings fetch failed:', bookingsRes.reason)
      }

      // Handle wishlist
      if (wishlistRes.status === 'fulfilled' && wishlistRes.value.ok) {
        const data = await wishlistRes.value.json()
        setWishlist(data.wishlist || [])
      } else if (wishlistRes.status === 'rejected') {
        console.error('Wishlist fetch failed:', wishlistRes.reason)
      }

      // Handle stats
      if (statsRes.status === 'fulfilled' && statsRes.value.ok) {
        const data = await statsRes.value.json()
        setStats({
          totalBookings: data.totalBookings ?? 0,
          activeBookings: data.activeBookings ?? 0,
          wishlistCount: data.wishlistCount ?? 0,
          reviewsCount: data.reviewsCount ?? 0,
        })
      } else if (statsRes.status === 'rejected') {
        console.error('Stats fetch failed:', statsRes.reason)
      }

      // Set error if all failed
      const allFailed = [bookingsRes, wishlistRes, statsRes].every(
        r => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.ok)
      )
      if (allFailed) {
        setError('Unable to load dashboard data. Please check your connection.')
      }
    } catch (err: any) {
      console.error('Dashboard error:', err)
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }, [user, fetchWithTimeout])

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  // Loading state
  if (authLoading || loading) {
    return <LoadingSkeleton />
  }

  // Error state
  if (error) {
    return <ErrorState message={error} onRetry={fetchDashboardData} />
  }

  // Filter upcoming bookings
  const upcomingBookings = bookings
    .filter(b => UPCOMING_STATUSES.includes(b.status as typeof UPCOMING_STATUSES[number]) && new Date(b.endDate) >= new Date())
    .slice(0, MAX_BOOKINGS_DISPLAY)

  // Stats for UI
  const statsCards = [
    { label: 'Total Bookings', value: stats.totalBookings, icon: Calendar, color: 'bg-blue-500' },
    { label: 'Active Bookings', value: stats.activeBookings, icon: Clock, color: 'bg-green-500' },
    { label: 'Saved Vehicles', value: stats.wishlistCount, icon: Heart, color: 'bg-pink-500' },
    { label: 'Reviews Written', value: stats.reviewsCount, icon: Star, color: 'bg-amber-500' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-amber-50 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name || 'Customer'}! 👋
          </h1>
          <p className="text-gray-600 mt-2">Your wedding journey is just a click away</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {statsCards.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Bookings */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Upcoming Bookings</h2>
                <Link href="/customer/bookings" className="text-amber-600 hover:text-amber-700 font-medium transition-colors">
                  View All →
                </Link>
              </div>

              {upcomingBookings.length === 0 ? (
                <EmptyBookings />
              ) : (
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => (
                    <BookingCard key={booking._id} booking={booking} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Promo Banner */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white">
              <h3 className="text-xl font-bold mb-4">🎉 Wedding Season Offer</h3>
              <p className="mb-4 text-amber-50">
                Book 3+ vehicles and get 10% off + free decoration upgrade!
              </p>
              <Link href="/vehicles">
                <button className="px-4 py-2 bg-white text-gray-900 rounded-xl font-semibold hover:scale-105 transition-transform">
                  Book Now
                </button>
              </Link>
            </div>

            {/* Wishlist Preview */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-900">💖 Saved Vehicles</h3>
                <Link href="/customer/wishlist" className="text-sm text-amber-600 hover:text-amber-700 transition-colors">
                  View All
                </Link>
              </div>
              <div className="space-y-3">
                {wishlist.slice(0, MAX_WISHLIST_DISPLAY).map((item) => (
                  <WishlistCard key={item._id} item={item} />
                ))}
                {wishlist.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No saved vehicles yet
                  </p>
                )}
              </div>
            </div>

            {/* Profile Link */}
            <Link href="/customer/profile">
              <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center justify-between hover:shadow-xl transition-shadow border border-gray-100">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center mr-4">
                    <User className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Profile Settings</div>
                    <div className="text-sm text-gray-500">Update your information</div>
                  </div>
                </div>
                <span className="text-gray-400">→</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}