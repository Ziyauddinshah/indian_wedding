// app/customer/bookings/[bookingId]/page.tsx
'use client'

import { Calendar, MapPin, Clock, Phone, Mail, Download, MessageCircle } from 'lucide-react'
import Link from 'next/link'

const bookings = [
  {
    id: 'BK-001',
    vehicle: 'White Marwari Horse',
    type: 'Ghodi',
    date: '15 Dec 2024',
    time: '10:00 AM',
    location: 'Jaipur',
    venue: 'Royal Stables Jaipur',
    duration: '4 hours',
    price: 15000,
    tax: 2700,
    total: 17700,
    status: 'confirmed',
    paymentStatus: 'paid',
    rating: 5,
    image: '🐎',
    partner: {
      name: 'Royal Stables Jaipur',
      phone: '+91 98765 12345',
      email: 'royalstables@example.com'
    },
    inclusions: [
      'Horse with traditional decoration',
      'Experienced handler (Saise)',
      'Practice session for groom',
      'Basic flower garlands',
      'Insurance coverage'
    ]
  },
  {
    id: 'BK-002',
    vehicle: 'Rolls Royce Phantom',
    type: 'Luxury',
    date: '20 Dec 2024',
    time: '2:00 PM',
    location: 'Delhi',
    venue: 'Royal Stables Delhi',
    duration: '2 hours',
    price: 65000,
    tax: 11700,
    total: 76700,
    status: 'pending',
    paymentStatus: 'pending', 
    rating: 5,
    image: '🚗',
    partner: {
      name: 'Royal Stables Delhi',
      phone: '+91 98765 12345',
      email: 'royalstables@example.com'
    },
    inclusions: [
      'Horse with traditional decoration',
      'Experienced handler (Saise)',
      'Practice session for groom',
      'Basic flower garlands',
      'Insurance coverage'
    ]
  },
  {
    id: 'BK-000',
    vehicle: 'Vintage 1950s Car',
    type: 'Royal',
    date: '10 Nov 2024',
    time: '10:00 AM',
    location: 'Udaipur',
    venue: 'Royal Stables Udaipur',
    duration: '5 hours',
    price: 35000,
    tax: 6300,
    total: 41300,
    status: 'completed',
    paymentStatus: 'paid',
    rating: 5,
    image: '🏎️',
    partner: {
      name: 'Royal Stables Udaipur',
      phone: '+91 98765 12345',
      email: 'royalstables@example.com'
    },
    inclusions: [
      'Horse with traditional decoration',
      'Experienced handler (Saise)',
      'Practice session for groom',
      'Basic flower garlands',
      'Insurance coverage'
    ]
  }
]

async function getVehicle(id: string) {
  // Replace with: const res = await fetch(`https://api.example.com/vehicles/${id}`);
  // const data = await res.json();
  // return data;
  const data = bookings.find(v => v.id === id) || null;
  if(!data)
    return bookings[0];
  return data;
}

export default async function BookingDetailPage({ params }: {
  params: Promise<{ id: string }>;   // Note: params is a Promise now
}) {

  const { id } = await params;
  const booking = await getVehicle(id);

  const steps = [
    { name: 'Booking Confirmed', date: '01 Dec 2024', completed: true },
    { name: 'Payment Received', date: '01 Dec 2024', completed: true },
    { name: 'Partner Assigned', date: '02 Dec 2024', completed: true },
    { name: 'Wedding Day', date: '15 Dec 2024', completed: false },
    { name: 'Service Completed', date: '15 Dec 2024', completed: false }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Back Button */}
        <Link href="/customer/bookings" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          ← Back to My Bookings
        </Link>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking #{booking.id}</h1>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">✅ {booking.status}</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">💳 {booking.paymentStatus}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Invoice
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center">
                <MessageCircle className="h-4 w-4 mr-2" />
                Message Partner
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Vehicle Details */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Vehicle Details</h2>
              <div className="flex items-center gap-4">
                <div className="text-6xl">{booking.image}</div>
                <div>
                  <h3 className="text-xl font-bold">{booking.vehicle}</h3>
                  <p className="text-gray-600">{booking.type}</p>
                  <p className="text-gray-500 text-sm mt-2">by {booking.partner.name}</p>
                </div>
              </div>
            </div>

            {/* Booking Timeline */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Booking Timeline</h2>
              <div className="relative">
                {steps.map((step, idx) => (
                  <div key={step.name} className="flex mb-8 last:mb-0">
                    <div className="relative">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        step.completed ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                      }`}>
                        {step.completed ? '✓' : idx + 1}
                      </div>
                      {idx < steps.length - 1 && (
                        <div className="absolute top-10 left-1/2 w-0.5 h-12 bg-gray-200 -translate-x-1/2"></div>
                      )}
                    </div>
                    <div className="ml-4">
                      <h4 className="font-bold text-gray-900">{step.name}</h4>
                      {step.date && <p className="text-sm text-gray-500">{step.date}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* What's Included */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">What's Included</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {booking.inclusions.map((item, idx) => (
                  <div key={idx} className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-green-500 mr-3"></div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Booking Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Vehicle Price</span>
                  <span className="font-medium">₹{booking.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxes & Fees</span>
                  <span className="font-medium">₹{booking.tax.toLocaleString()}</span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between">
                    <span className="font-bold">Total Paid</span>
                    <span className="font-bold text-xl">₹{booking.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Date & Location */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Event Details</h2>
              <div className="space-y-3">
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <div className="font-medium">{booking.date}</div>
                    <div className="text-sm text-gray-500">{booking.time} • {booking.duration}</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <div className="font-medium">{booking.venue}</div>
                    <div className="text-sm text-gray-500">{booking.location}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Partner Contact */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
              <h3 className="font-bold text-gray-900 mb-3">📞 Partner Contact</h3>
              <p className="text-sm text-gray-600 mb-2">{booking.partner.name}</p>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-blue-600" />
                <a href={`tel:${booking.partner.phone}`} className="text-blue-600">{booking.partner.phone}</a>
              </div>
              <div className="flex items-center gap-2 text-sm mt-1">
                <Mail className="h-4 w-4 text-blue-600" />
                <a href={`mailto:${booking.partner.email}`} className="text-blue-600">{booking.partner.email}</a>
              </div>
            </div>

            {/* Need Help */}
            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
              <h3 className="font-bold text-amber-800 mb-2">❓ Need Help?</h3>
              <p className="text-sm text-amber-700 mb-3">Our support team is available 24/7</p>
              <button className="w-full py-2 bg-amber-600 text-white rounded-xl font-medium hover:bg-amber-700">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}