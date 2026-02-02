// app/vehicles/luxury/page.tsx
'use client'

import { useState } from 'react'
import { Filter, Sparkles, Star, Shield, Zap, Award, Crown, Car } from 'lucide-react'
import Link from 'next/link'

const luxuryVehicles = [
  {
    id: 'lux-1',
    name: 'Rolls Royce Phantom 2024',
    description: 'The epitome of luxury with chauffeur, red carpet, and premium decoration',
    price: 65000,
    originalPrice: 75000,
    rating: 4.9,
    reviewCount: 28,
    city: 'Delhi',
    features: ['Chauffeur in Uniform', 'Red Carpet Setup', 'Premium Bar', 'Entertainment System', 'Flower Decorations'],
    images: ['/vehicles/rolls-1.jpg'],
    availability: 'Available',
    partner: 'Elite Luxury Cars Delhi',
    partnerRating: 4.8,
    tags: ['Most Popular', 'New Arrival'],
    capacity: 4
  },
  {
    id: 'lux-2',
    name: 'Mercedes Maybach S680',
    description: 'Ultimate luxury sedan with every conceivable comfort feature',
    price: 55000,
    rating: 4.8,
    reviewCount: 24,
    city: 'Mumbai',
    features: ['Massage Seats', 'Champagne Setup', 'Professional Chauffeur', 'Ambient Lighting'],
    images: ['/vehicles/maybach-1.jpg'],
    availability: 'Available',
    partner: 'Premium Motors Mumbai',
    partnerRating: 4.9,
    tags: ['Executive Class'],
    capacity: 4
  },
  {
    id: 'lux-3',
    name: 'Range Rover Autobiography LWB',
    description: 'Spacious luxury SUV perfect for family processions',
    price: 45000,
    rating: 4.7,
    reviewCount: 19,
    city: 'Delhi',
    features: ['Extended Wheelbase', 'Panoramic Sunroof', 'Premium Sound System', 'Climate Control'],
    images: ['vehicles/rangerover-1.jpg'],
    availability: 'Available',
    partner: 'SUV Specialists',
    partnerRating: 4.7,
    tags: ['Family Friendly'],
    capacity: 7
  },
  {
    id: 'lux-4',
    name: 'BMW 7 Series 2023',
    description: 'German engineering with luxurious comfort',
    price: 40000,
    rating: 4.6,
    reviewCount: 22,
    city: 'Bangalore',
    features: ['Gesture Control', 'Bowers & Wilkins Audio', 'Executive Lounge', 'Sky Lounge Roof'],
    images: ['/vehicles/bmw7-1.jpg'],
    availability: 'Available',
    partner: 'German Luxury Bangalore',
    partnerRating: 4.8,
    tags: ['Tech Packed'],
    capacity: 4
  },
  {
    id: 'lux-5',
    name: 'Audi A8 L',
    description: 'Sophisticated luxury with cutting-edge technology',
    price: 42000,
    rating: 4.7,
    reviewCount: 18,
    city: 'Hyderabad',
    features: ['Virtual Cockpit', 'Matrix LED Lights', 'Air Suspension', 'Bang & Olufsen Audio'],
    images: ['/vehicles/audi-a8-1.jpg'],
    availability: 'Available',
    partner: 'Audi Exclusive Hyderabad',
    partnerRating: 4.7,
    tags: ['Smooth Ride'],
    capacity: 4
  },
  {
    id: 'lux-6',
    name: 'Bentley Flying Spur',
    description: 'British luxury with unparalleled craftsmanship',
    price: 70000,
    rating: 4.9,
    reviewCount: 15,
    city: 'Delhi',
    features: ['Handcrafted Interior', 'Naim Audio System', 'Mulliner Package', 'Personalized Setup'],
    images: ['/vehicles/bentley-1.jpg'],
    availability: 'Limited',
    partner: 'British Luxury Delhi',
    partnerRating: 4.9,
    tags: ['Ultra Luxury'],
    capacity: 4
  },
]

const brands = ['Rolls Royce', 'Mercedes', 'BMW', 'Audi', 'Range Rover', 'Bentley', 'All']
const cities = ['Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai', 'Jaipur', 'All']

export default function LuxuryVehiclesPage() {
  const [selectedBrand, setSelectedBrand] = useState('All')
  const [selectedCity, setSelectedCity] = useState('All')
  const [priceRange, setPriceRange] = useState('all')
  const [sortBy, setSortBy] = useState('popular')

  const filteredVehicles = luxuryVehicles.filter(vehicle => {
    if (selectedBrand !== 'All' && !vehicle.name.toLowerCase().includes(selectedBrand.toLowerCase())) return false
    if (selectedCity !== 'All' && vehicle.city !== selectedCity) return false
    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(Number)
      if (max && vehicle.price > max) return false
      if (min && vehicle.price < min) return false
    }
    return true
  })

  const sortedVehicles = [...filteredVehicles].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price
      case 'price-high': return b.price - a.price
      case 'rating': return b.rating - a.rating
      default: return a.tags.includes('Most Popular') ? -1 : 1
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-indigo-800 to-purple-900 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
        </div>

        <div className="container relative mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full mb-8">
              <Crown className="h-6 w-6 text-yellow-400 mr-3" />
              <span className="text-lg font-bold">PREMIUM LUXURY COLLECTION</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="block">Luxury Cars for</span>
              <span className="block bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-300 bg-clip-text text-transparent">
                Grand Entrances
              </span>
            </h1>

            <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto">
              Experience the pinnacle of automotive luxury with our curated collection of premium vehicles, 
              each offering unparalleled comfort, style, and prestige for your special day.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {[
                { label: 'Premium Brands', value: '6+', icon: '🏆' },
                { label: 'Cities', value: '10+', icon: '📍' },
                { label: 'Avg Rating', value: '4.8★', icon: '⭐' },
                { label: 'Happy Clients', value: '200+', icon: '👰' },
              ].map((stat, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-2xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-blue-200">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="sticky top-24 space-y-6">
              {/* Brand Filter */}
              <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-100 p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <Car className="h-5 w-5 mr-2 text-blue-600" />
                  Brand
                </h3>
                <div className="space-y-2">
                  {brands.map(brand => (
                    <button
                      key={brand}
                      onClick={() => setSelectedBrand(brand)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                        selectedBrand === brand
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>

              {/* City Filter */}
              <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-100 p-6">
                <h3 className="text-lg font-bold mb-4">📍 City</h3>
                <div className="grid grid-cols-2 gap-2">
                  {cities.map(city => (
                    <button
                      key={city}
                      onClick={() => setSelectedCity(city)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedCity === city
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-100 p-6">
                <h3 className="text-lg font-bold mb-4">💰 Price Range</h3>
                <div className="space-y-2">
                  {[
                    { label: 'Under ₹40,000', value: '0-40000' },
                    { label: '₹40,000 - ₹60,000', value: '40000-60000' },
                    { label: 'Above ₹60,000', value: '60000-100000' },
                  ].map(range => (
                    <label key={range.value} className="flex items-center space-x-3 cursor-pointer group">
                      <input 
                        type="radio" 
                        name="price" 
                        value={range.value}
                        checked={priceRange === range.value}
                        onChange={(e) => setPriceRange(e.target.value)}
                        className="h-4 w-4 text-blue-600"
                      />
                      <span className="text-gray-700 group-hover:text-gray-900">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white">
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Included in All Bookings
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Zap className="h-4 w-4 mr-3 text-yellow-300" />
                    <span>Professional Chauffeur</span>
                  </li>
                  <li className="flex items-center">
                    <Sparkles className="h-4 w-4 mr-3 text-yellow-300" />
                    <span>Basic Flower Decoration</span>
                  </li>
                  <li className="flex items-center">
                    <Award className="h-4 w-4 mr-3 text-yellow-300" />
                    <span>Insurance Coverage</span>
                  </li>
                  <li className="flex items-center">
                    <Star className="h-4 w-4 mr-3 text-yellow-300" />
                    <span>Red Carpet Service</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Results Header */}
            <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-100 p-6 mb-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Luxury Vehicles
                    <span className="ml-3 px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full text-sm font-bold">
                      {filteredVehicles.length} Available
                    </span>
                  </h2>
                  <p className="text-gray-600">Experience luxury like never before</p>
                </div>

                <div className="flex items-center gap-4">
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-3 rounded-xl border-2 border-gray-200 bg-white focus:border-blue-500 outline-none font-medium"
                  >
                    <option value="popular">✨ Most Popular</option>
                    <option value="price-low">💰 Price: Low to High</option>
                    <option value="price-high">💰 Price: High to Low</option>
                    <option value="rating">⭐ Highest Rated</option>
                  </select>

                  <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                    <Filter className="h-5 w-5 mr-2 inline" />
                    Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Vehicles Grid */}
            {filteredVehicles.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-xl border-2 border-blue-100">
                <div className="text-6xl mb-6">🚗</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No luxury vehicles found</h3>
                <p className="text-gray-600 mb-8">Try adjusting your filters</p>
                <button
                  onClick={() => {
                    setSelectedBrand('All')
                    setSelectedCity('All')
                    setPriceRange('all')
                  }}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {sortedVehicles.map(vehicle => (
                  <Link key={vehicle.id} href={`/vehicles/${vehicle.id}`}>
                    <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-100 overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer">
                      {/* Vehicle Image */}
                      <div className="h-56 relative overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100">
                        {/* Tags */}
                        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                          {vehicle.tags.map(tag => (
                            <div key={tag} className="px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold rounded-full text-sm">
                              {tag}
                            </div>
                          ))}
                        </div>

                        {/* Availability */}
                        <div className="absolute top-4 right-4 z-10">
                          <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                            vehicle.availability === 'Available' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {vehicle.availability}
                          </div>
                        </div>

                        {/* Car Icon */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-8xl animate-float">
                            🚗
                          </div>
                        </div>
                      </div>

                      {/* Vehicle Info */}
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-xl font-bold text-gray-900">{vehicle.name}</h3>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-amber-500 fill-amber-500 mr-1" />
                            <span className="font-bold">{vehicle.rating}</span>
                            <span className="text-gray-500 text-sm ml-1">({vehicle.reviewCount})</span>
                          </div>
                        </div>

                        <p className="text-gray-600 mb-4 line-clamp-2">{vehicle.description}</p>

                        <div className="flex items-center text-gray-600 mb-4">
                          <span className="font-medium">{vehicle.city}</span>
                          <span className="mx-2">•</span>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                            {vehicle.capacity} seats
                          </span>
                        </div>

                        {/* Features */}
                        <div className="flex flex-wrap gap-2 mb-6">
                          {vehicle.features.slice(0, 3).map((feature, idx) => (
                            <span 
                              key={idx}
                              className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-lg"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>

                        {/* Price & CTA */}
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-bold text-gray-900">
                              ₹{vehicle.price.toLocaleString()}
                            </div>
                            {vehicle.originalPrice && (
                              <div className="text-sm text-gray-500 line-through">
                                ₹{vehicle.originalPrice.toLocaleString()}
                              </div>
                            )}
                          </div>
                          <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Why Choose Luxury */}
            <div className="mt-12 bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-8 md:p-12 text-white">
                <h3 className="text-3xl font-bold mb-8 text-center">Why Choose Luxury Cars?</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    {
                      icon: '👑',
                      title: 'Status & Prestige',
                      description: 'Make a statement with world-class luxury brands that reflect your success'
                    },
                    {
                      icon: '✨',
                      title: 'Ultimate Comfort',
                      description: 'Experience unparalleled comfort with premium seating, climate control, and smooth rides'
                    },
                    {
                      icon: '📸',
                      title: 'Photographic Excellence',
                      description: 'Stunning vehicles that create picture-perfect moments for your wedding album'
                    }
                  ].map((feature, idx) => (
                    <div key={idx} className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl">
                      <div className="text-4xl mb-4">{feature.icon}</div>
                      <h4 className="text-xl font-bold mb-3">{feature.title}</h4>
                      <p className="text-blue-200">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Luxury Packages */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">🎁 Luxury Packages</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    name: 'Basic Luxury',
                    price: '₹40,000',
                    features: ['Chauffeur', 'Basic Decor', 'Insurance', '4 Hours'],
                    color: 'from-blue-100 to-indigo-100'
                  },
                  {
                    name: 'Premium Package',
                    price: '₹65,000',
                    features: ['Uniformed Chauffeur', 'Premium Decor', 'Red Carpet', 'Champagne', '8 Hours'],
                    color: 'from-blue-300 to-indigo-300',
                    popular: true
                  },
                  {
                    name: 'Royal Experience',
                    price: '₹90,000',
                    features: ['Dual Chauffeurs', 'Royal Decor', 'VIP Treatment', 'Photographer', 'Full Day'],
                    color: 'from-blue-500 to-indigo-500',
                    textColor: 'text-white'
                  }
                ].map((pkg, idx) => (
                  <div key={idx} className={`bg-gradient-to-br ${pkg.color} ${pkg.textColor || 'text-gray-900'} rounded-2xl p-6 border-2 ${pkg.popular ? 'border-yellow-400' : 'border-transparent'}`}>
                    {pkg.popular && (
                      <div className="inline-flex items-center px-3 py-1 bg-yellow-400 text-gray-900 rounded-full text-sm font-bold mb-4">
                        ⭐ Most Popular
                      </div>
                    )}
                    <h4 className="text-xl font-bold mb-2">{pkg.name}</h4>
                    <div className="text-3xl font-bold mb-4">{pkg.price}</div>
                    <ul className="space-y-2 mb-6">
                      {pkg.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-center">
                          <span className="mr-2">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <button className={`w-full py-3 ${pkg.popular ? 'bg-yellow-400 text-gray-900' : 'bg-white/20 backdrop-blur-sm'} font-bold rounded-xl hover:scale-105 transition-transform`}>
                      Book Package
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}