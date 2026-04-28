// app/customer/bookings/page.tsx
'use client'

import { useState } from 'react'
import { Calendar, MapPin, Clock, ChevronDown } from 'lucide-react'
import Link from 'next/link'

export default function MyBookingsPage() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'cancelled'>('upcoming')

  const bookings = {
    upcoming: [
      {
        id: 'BK-001',
        vehicle: 'White Marwari Horse',
        type: 'Ghodi',
        date: '15 Dec 2024',
        time: '10:00 AM',
        location: 'Jaipur',
        price: 15000,
        status: 'confirmed',
        rating: 5,
        image: '🐎'
      },
      {
        id: 'BK-002',
        vehicle: 'Rolls Royce Phantom',
        type: 'Luxury',
        date: '20 Dec 2024',
        time: '2:00 PM',
        location: 'Delhi',
        price: 65000,
        status: 'pending',
        rating: 5,
        image: '🚗'
      }
    ],
    past: [
      {
        id: 'BK-000',
        vehicle: 'Vintage 1950s Car',
        type: 'Royal',
        date: '10 Nov 2024',
        time: '10:00 AM',
        location: 'Udaipur',
        price: 35000,
        status: 'completed',
        rating: 5,
        image: '🏎️'
      }
    ],
    cancelled: []
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-gray-200">
          {[
            { id: 'upcoming', label: 'Upcoming', count: bookings.upcoming.length },
            { id: 'past', label: 'Past', count: bookings.past.length },
            { id: 'cancelled', label: 'Cancelled', count: bookings.cancelled.length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-amber-500 text-amber-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {bookings[activeTab].length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No {activeTab} bookings</h3>
            <p className="text-gray-600 mb-6">
              {activeTab === 'upcoming' 
                ? 'You haven\'t booked any vehicles yet' 
                : activeTab === 'past' 
                ? 'No past bookings to show'
                : 'No cancelled bookings'}
            </p>
            {activeTab === 'upcoming' && (
              <Link href="/vehicles">
                <button className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold">
                  Browse Vehicles
                </button>
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {bookings[activeTab].map((booking) => (
              <Link key={booking.id} href={`/customer/bookings/${booking.id}`}>
                <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition cursor-pointer">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{booking.image}</div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-bold text-gray-900">{booking.vehicle}</h3>
                          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">{booking.type}</span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-2">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {booking.date}
                          </div>
                          {booking?.time && (
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {booking?.time}
                            </div>
                          )}
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {booking.location}
                          </div>
                        </div>
                        {booking?.rating && (
                          <div className="flex items-center mt-2">
                            {[...Array(booking.rating)].map((_, i) => (
                              <span key={i} className="text-amber-500">★</span>
                            ))}
                            <span className="text-gray-500 text-sm ml-2">You rated this</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">₹{booking.price.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">total</div>
                      <div className={`mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {booking.status === 'confirmed' ? '✅ Confirmed' : 
                         booking.status === 'pending' ? '⏳ Awaiting confirmation' : 
                         '✓ Completed'}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}