// app/customer/dashboard/page.tsx
'use client'

import { Calendar, Car, Heart, User, Clock, Star } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/app/contexts/AuthContext'
export default function CustomerDashboard() {
  const { user } = useAuth()

  // Mock data - replace with real API later
  const upcomingBookings = [
    {
      id: 'BK-001',
      vehicle: 'White Marwari Horse',
      date: '15 Dec 2024',
      time: '10:00 AM',
      status: 'confirmed',
      image: '🐎'
    },
    {
      id: 'BK-002',
      vehicle: 'Rolls Royce Phantom',
      date: '20 Dec 2024',
      time: '2:00 PM',
      status: 'pending',
      image: '🚗'
    }
  ]

  const stats = [
    { label: 'Total Bookings', value: '12', icon: Calendar, color: 'bg-blue-500' },
    { label: 'Active Bookings', value: '2', icon: Clock, color: 'bg-green-500' },
    { label: 'Saved Vehicles', value: '5', icon: Heart, color: 'bg-pink-500' },
    { label: 'Reviews Written', value: '8', icon: Star, color: 'bg-amber-500' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-amber-50 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name || 'Customer'}! 👋</h1>
          <p className="text-gray-600 mt-2">Your wedding journey is just a click away</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className={`h-12 w-12 rounded-xl ${stat.color} bg-opacity-10 flex items-center justify-center mb-4`}>
                <stat.icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Upcoming Bookings */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Upcoming Bookings</h2>
                <Link href="/customer/bookings" className="text-blue-600 hover:text-blue-700 font-medium">
                  View All →
                </Link>
              </div>

              {upcomingBookings.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No upcoming bookings</p>
                  <Link href="/vehicles">
                    <button className="mt-4 px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl">
                      Browse Vehicles
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center p-4 bg-gray-50 rounded-xl">
                      <div className="text-4xl mr-4">{booking.image}</div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{booking.vehicle}</h3>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <Calendar className="h-4 w-4 mr-2" />
                          {booking.date} at {booking.time}
                        </div>
                      </div>
                      <div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          booking.status === 'confirmed' 
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {booking.status === 'confirmed' ? '✅ Confirmed' : '⏳ Pending'}
                        </span>
                        <Link href={`/customer/bookings/${booking.id}`}>
                          <button className="ml-4 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
                            View Details
                          </button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar - Quick Actions & Wishlist Preview */}
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white">
              <h3 className="text-xl font-bold mb-4">🎉 Wedding Season Offer</h3>
              <p className="mb-4">Book 3+ vehicles and get 10% off + free decoration upgrade!</p>
              <Link href="/vehicles">
                <button className="px-4 py-2 bg-white text-gray-900 rounded-xl font-semibold hover:scale-105 transition">
                  Book Now
                </button>
              </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-900">💖 Saved Vehicles</h3>
                <Link href="/customer/wishlist" className="text-sm text-blue-600">View All</Link>
              </div>
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                  <span className="text-2xl mr-3">🐎</span>
                  <div className="flex-1">
                    <div className="font-medium">Kathiawari Horse</div>
                    <div className="text-sm text-gray-500">Jaipur • ₹18,000/day</div>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                  <span className="text-2xl mr-3">🚗</span>
                  <div className="flex-1">
                    <div className="font-medium">Mercedes Maybach</div>
                    <div className="text-sm text-gray-500">Delhi • ₹55,000/day</div>
                  </div>
                </div>
              </div>
            </div>

            <Link href="/customer/profile">
              <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center justify-between hover:shadow-xl transition">
                <div className="flex items-center">
                  <User className="h-10 w-10 text-gray-400 mr-4" />
                  <div>
                    <div className="font-bold text-gray-900">Profile Settings</div>
                    <div className="text-sm text-gray-500">Update your information</div>
                  </div>
                </div>
                <span>→</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}