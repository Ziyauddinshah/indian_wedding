// app/vehicles/[vehicleId]/page.tsx - VIBRANT VERSION
'use client'

import { useState } from 'react'
import { Share2, Heart, Shield, Star, MapPin, Clock, Users, Award, Sparkles } from 'lucide-react'
import Link from 'next/link'

// Mock vehicle data - dynamic based on type
const vehicle = {
  id: '1',
  name: 'White Marwari Horse with Golden Decorations',
  type: 'ghodi',
  city: 'Jaipur',
  price: 18000,
  originalPrice: 22000,
  rating: 4.8,
  reviewCount: 42,
  description: 'A majestic white Marwari horse, specially trained for wedding processions. Comes with traditional golden decorations and experienced handler.',
  features: [
    'Pure White Marwari Breed',
    'Traditional Golden Saddle & Bridle',
    'Experienced Handler (Saise)',
    'Practice Session for Groom',
    'Insurance Coverage',
    'Basic Floral Decoration Included'
  ],
  specifications: {
    breed: 'Marwari Horse',
    age: '6 Years',
    height: '15.2 hands',
    color: 'Pure White',
    training: '3+ Years',
    experience: '50+ Weddings',
    availability: 'All Season',
    insurance: '₹5 Lakhs'
  },
  images: [
    '/vehicles/horse-1.jpg',
    '/vehicles/horse-2.jpg',
    '/vehicles/horse-3.jpg',
    '/vehicles/horse-4.jpg'
  ],
  partner: {
    name: 'Royal Stables Jaipur',
    rating: 4.9,
    joined: '2022',
    totalBookings: 150,
    responseRate: '98%',
    description: 'Specializes in traditional wedding horses with 15+ years experience.'
  },
  inclusions: [
    'Horse with full decoration',
    'Experienced handler',
    'Basic floral garlands',
    'Practice session',
    'Insurance coverage',
    'Transport to venue'
  ],
  addons: [
    { name: 'Premium Floral Decor', price: 3000 },
    { name: 'Professional Photography', price: 5000 },
    { name: 'Video Recording', price: 8000 },
    { name: 'Royal Attire for Groom', price: 2000 }
  ]
}

export default function VehicleDetailPage() {
  const [isLiked, setIsLiked] = useState(false)
  const [activeImage, setActiveImage] = useState(0)
  const [showAllFeatures, setShowAllFeatures] = useState(false)

  const typeConfig = {
    ghodi: {
      icon: '🐎',
      color: 'amber',
      gradient: 'from-amber-400 to-yellow-500',
      bgGradient: 'from-amber-100 to-yellow-100'
    },
    luxury: {
      icon: '🚗',
      color: 'blue',
      gradient: 'from-blue-500 to-indigo-600',
      bgGradient: 'from-blue-100 to-indigo-100'
    },
    royal: {
      icon: '👑',
      color: 'purple',
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-100 to-pink-100'
    }
  }[vehicle.type]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-rose-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-rose-300 rounded-full blur-3xl"></div>
      </div>

      <div className="container relative mx-auto px-4 py-8">
        {/* Breadcrumb with Festive Style */}
        <nav className="mb-8">
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
            <Link href="/" className="text-gray-600 hover:text-amber-600 transition-colors font-medium">
              🏠 Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/vehicles" className="text-gray-600 hover:text-amber-600 transition-colors font-medium">
              🚗 Vehicles
            </Link>
            <span className="text-gray-400">/</span>
            <Link href={`/vehicles?type=${vehicle.type}`} className="text-gray-600 hover:text-amber-600 transition-colors font-medium">
              {vehicle.type === 'ghodi' ? '🐎 Ghodi' : vehicle.type === 'luxury' ? '🚗 Luxury' : '👑 Royal'}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="font-bold text-gray-900 truncate max-w-xs">{vehicle.name}</span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Gallery & Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Main Card with Title */}
            <div className="bg-white rounded-3xl shadow-2xl border-2 border-gray-100 overflow-hidden">
              {/* Header with Badges */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`px-4 py-2 bg-gradient-to-r ${typeConfig?.gradient} text-white font-bold rounded-full flex items-center`}>
                        <span className="mr-2 text-lg">{typeConfig?.icon}</span>
                        {vehicle.type === 'ghodi' ? 'Ghodi' : vehicle.type === 'luxury' ? 'Luxury Car' : 'Royal Vehicle'}
                      </div>
                      <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-bold">
                        ⚡ Available Today
                      </div>
                    </div>
                    
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                      {vehicle.name}
                    </h1>
                    
                    <div className="flex flex-wrap items-center gap-4 text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 mr-2 text-rose-500" />
                        <span className="font-medium">{vehicle.city}</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-5 w-5 mr-2 text-amber-500 fill-amber-500" />
                        <span className="font-bold">{vehicle.rating}</span>
                        <span className="ml-1">({vehicle.reviewCount} reviews)</span>
                      </div>
                      <div className="flex items-center">
                        <Award className="h-5 w-5 mr-2 text-blue-500" />
                        <span className="font-medium">Verified Partner</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setIsLiked(!isLiked)}
                      className={`p-3 rounded-xl border-2 ${
                        isLiked 
                          ? 'border-rose-500 bg-rose-50 text-rose-500' 
                          : 'border-gray-200 hover:border-gray-300'
                      } transition-all hover:scale-105`}
                    >
                      <Heart className={`h-5 w-5 ${isLiked ? 'fill-rose-500' : ''}`} />
                    </button>
                    <button className="p-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all hover:scale-105">
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Image Gallery */}
              <div className="p-6">
                <div className="rounded-2xl overflow-hidden mb-4">
                  <div className={`h-96 ${typeConfig?.bgGradient} flex items-center justify-center relative`}>
                    {/* Main Image Display */}
                    <div className="text-9xl animate-float">
                      {typeConfig?.icon}
                    </div>
                    
                    {/* Image Navigation */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                      {vehicle.images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveImage(idx)}
                          className={`h-3 w-3 rounded-full transition-all ${
                            activeImage === idx 
                              ? 'bg-white w-8' 
                              : 'bg-white/50 hover:bg-white/80'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Thumbnails */}
                <div className="grid grid-cols-4 gap-3">
                  {vehicle.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`h-24 rounded-xl overflow-hidden border-2 transition-all ${
                        activeImage === idx
                          ? 'border-amber-500 scale-105'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`h-full w-full ${typeConfig?.bgGradient} flex items-center justify-center`}>
                        <span className="text-3xl">{typeConfig?.icon}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Description Card */}
            <div className="bg-white rounded-3xl shadow-2xl border-2 border-gray-100 p-8">
              <div className="flex items-center mb-6">
                <Sparkles className="h-6 w-6 text-amber-500 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">About This Vehicle</h2>
              </div>
              
              <p className="text-gray-700 text-lg leading-relaxed mb-8">
                {vehicle.description}
              </p>
              
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-200">
                <div className="flex items-start">
                  <Shield className="h-8 w-8 text-green-600 mr-4 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg mb-2">Verified & Insured</h4>
                    <p className="text-gray-700">
                      This vehicle is thoroughly verified by our team and comes with comprehensive insurance coverage. 
                      All handlers are certified and trained for wedding processions.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Features & Amenities */}
            <div className="bg-white rounded-3xl shadow-2xl border-2 border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                <span className="mr-3">✨</span>
                Features & Amenities
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(showAllFeatures ? vehicle.features : vehicle.features.slice(0, 6)).map((feature, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                  >
                    <div className="h-3 w-3 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 mr-4 group-hover:scale-125 transition-transform"></div>
                    <span className="font-medium text-gray-900">{feature}</span>
                  </div>
                ))}
              </div>
              
              {vehicle.features.length > 6 && (
                <button
                  onClick={() => setShowAllFeatures(!showAllFeatures)}
                  className="mt-6 px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors w-full"
                >
                  {showAllFeatures ? 'Show Less' : `Show ${vehicle.features.length - 6} More Features`}
                </button>
              )}
            </div>

            {/* Specifications */}
            <div className="bg-white rounded-3xl shadow-2xl border-2 border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                <span className="mr-3">📋</span>
                Specifications
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(vehicle.specifications).map(([key, value]) => (
                  <div key={key} className="border-b border-gray-100 pb-4">
                    <div className="text-sm text-gray-500 mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                    <div className="font-bold text-gray-900 text-lg">{value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Partner Info */}
            <div className="bg-white rounded-3xl shadow-2xl border-2 border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                <span className="mr-3">🤝</span>
                About the Partner
              </h2>
              
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                    {vehicle.partner.name.charAt(0)}
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <h3 className="text-2xl font-bold text-gray-900">{vehicle.partner.name}</h3>
                    <div className="flex items-center px-3 py-1 bg-amber-100 text-amber-800 rounded-full font-bold">
                      <Star className="h-4 w-4 mr-1 fill-amber-500" />
                      {vehicle.partner.rating} Partner Rating
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-6">{vehicle.partner.description}</p>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-xl">
                      <div className="text-2xl font-bold text-gray-900">{vehicle.partner.totalBookings}+</div>
                      <div className="text-sm text-gray-600">Bookings</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-xl">
                      <div className="text-2xl font-bold text-gray-900">{vehicle.partner.responseRate}</div>
                      <div className="text-sm text-gray-600">Response Rate</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-xl">
                      <div className="text-2xl font-bold text-gray-900">{vehicle.partner.joined}</div>
                      <div className="text-sm text-gray-600">Since</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-8">
              {/* Pricing Card */}
              <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-3xl shadow-2xl overflow-hidden">
                <div className="p-8 text-white">
                  <div className="mb-6">
                    <div className="text-sm font-medium text-amber-100 mb-2">STARTING FROM</div>
                    <div className="flex items-baseline">
                      <div className="text-5xl font-bold">₹{vehicle.price.toLocaleString()}</div>
                      <div className="ml-2 text-amber-100">per day</div>
                    </div>
                    {vehicle.originalPrice && (
                      <div className="flex items-center mt-2">
                        <div className="text-lg line-through text-amber-200">₹{vehicle.originalPrice.toLocaleString()}</div>
                        <div className="ml-3 px-2 py-1 bg-white text-amber-600 rounded-full text-sm font-bold">
                          Save ₹{(vehicle.originalPrice - vehicle.price).toLocaleString()}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-semibold">Flexible Duration</div>
                        <div className="text-sm opacity-90">Book by hour or full day</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                        <Shield className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-semibold">Free Cancellation</div>
                        <div className="text-sm opacity-90">Up to 7 days before</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-8">
                  <button className="w-full py-4 bg-gradient-to-r from-rose-600 to-red-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center text-lg">
                    <span className="mr-3">🎉</span>
                    Book Now & Get Free Decor
                    <span className="ml-3">→</span>
                  </button>
                  
                  <div className="text-center mt-4 text-sm text-gray-600">
                    ⚡ Instant confirmation • 🔒 Secure payment
                  </div>
                </div>
              </div>

              {/* Inclusions Card */}
              <div className="bg-white rounded-3xl shadow-2xl border-2 border-gray-100 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="mr-2">✅</span>
                  What's Included
                </h3>
                
                <div className="space-y-3">
                  {vehicle.inclusions.map((item, idx) => (
                    <div key={idx} className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-green-600">✓</span>
                      </div>
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add-ons Card */}
              <div className="bg-white rounded-3xl shadow-2xl border-2 border-gray-100 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="mr-2">✨</span>
                  Popular Add-ons
                </h3>
                
                <div className="space-y-4">
                  {vehicle.addons.map((addon, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group cursor-pointer">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                          <span className="text-blue-600">+</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{addon.name}</div>
                        </div>
                      </div>
                      <div className="text-lg font-bold text-gray-900">₹{addon.price.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust Badges */}
              <div className="bg-white rounded-3xl shadow-2xl border-2 border-gray-100 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="mr-2">🛡️</span>
                  Why Book With Us
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center mr-4">
                      <Shield className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Secure Booking</h4>
                      <p className="text-sm text-gray-600">100% payment protection</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mr-4">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Verified Partners</h4>
                      <p className="text-sm text-gray-600">Background checked & rated</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mr-4">
                      <Clock className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">24/7 Support</h4>
                      <p className="text-sm text-gray-600">Dedicated wedding coordinator</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-200">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 flex items-center justify-center mr-3">
                      <span className="text-white">⚡</span>
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">Need Help Deciding?</div>
                      <button className="text-amber-600 font-semibold hover:text-amber-700 mt-1">
                        Chat with our wedding expert →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Vehicles Section */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Similar Royal Vehicles</h2>
              <p className="text-gray-600 mt-2">Other magnificent options for your grand entrance</p>
            </div>
            <Link href="/vehicles">
              <button className="px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 font-bold rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all hover:scale-105">
                View All Vehicles →
              </button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sample Related Vehicles */}
            {[
              { type: 'ghodi', name: 'Golden Decorated Kathiawari Horse', price: 22000, city: 'Udaipur', icon: '🐎' },
              { type: 'luxury', name: 'Mercedes Maybach 2024', price: 55000, city: 'Delhi', icon: '🚗' },
              { type: 'royal', name: 'Royal Elephant with Howdah', price: 45000, city: 'Jaipur', icon: '🐘' },
            ].map((vehicle, idx) => (
              <Link key={idx} href={`/vehicles/${idx + 2}`}>
                <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-3xl">{vehicle.icon}</div>
                    <div className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-bold">
                      Popular
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{vehicle.name}</h3>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="h-4 w-4 mr-2" />
                    {vehicle.city}
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    ₹{vehicle.price.toLocaleString()}
                    <span className="text-sm text-gray-600 ml-2">per day</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}