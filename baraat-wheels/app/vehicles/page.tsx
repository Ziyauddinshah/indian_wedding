// app/vehicles/page.tsx - VIBRANT VERSION
'use client'

import { useState } from 'react'
import { Filter, Star, List, MapPin, ChevronDown, Search } from 'lucide-react'
import Link from 'next/link'

// Mock data with more vehicles
const mockVehicles = [
  {
    id: '1',
    name: 'White Marwari Horse with Golden Decor',
    type: 'ghodi',
    city: 'Jaipur',
    price: 18000,
    originalPrice: 22000,
    rating: 4.8,
    reviewCount: 42,
    image: '/vehicles/horse-1.jpg',
    featured: true,
    description: 'Pure white Marwari horse with traditional golden ornaments',
    features: ['Golden Saddle', 'Experienced Handler', 'Insurance', 'Practice Session'],
    isAvailable: true,
    partnerRating: 4.9
  },
  {
    id: '2',
    name: 'Rolls Royce Phantom 2024',
    type: 'luxury',
    city: 'Delhi',
    price: 65000,
    rating: 4.9,
    reviewCount: 28,
    image: '/vehicles/rolls-1.jpg',
    featured: true,
    description: 'Brand new Phantom with chauffeur and premium decor',
    features: ['Chauffeur', 'Red Carpet', 'Bar Setup', 'Flower Decor'],
    isAvailable: true,
    partnerRating: 4.8
  },
  {
    id: '3',
    name: 'Vintage 1950s Classic Car',
    type: 'royal',
    city: 'Udaipur',
    price: 45000,
    rating: 4.7,
    reviewCount: 35,
    image: '/vehicles/vintage-1.jpg',
    featured: false,
    description: 'Restored vintage beauty for royal weddings',
    features: ['Restored', 'Classic', 'Photography', 'Royal Attire'],
    isAvailable: true,
    partnerRating: 4.6
  },
  {
    id: '4',
    name: 'Decorated Royal Elephant',
    type: 'royal',
    city: 'Jaipur',
    price: 55000,
    rating: 4.6,
    reviewCount: 31,
    image: '/vehicles/elephant-1.jpg',
    featured: true,
    description: 'Majestic elephant with traditional howdah',
    features: ['Howdah', '4 Attendants', 'Traditional Music', 'Photo Session'],
    isAvailable: true,
    partnerRating: 4.7
  },
  {
    id: '5',
    name: 'Mercedes Maybach S-Class',
    type: 'luxury',
    city: 'Mumbai',
    price: 45000,
    rating: 4.8,
    reviewCount: 24,
    image: '/vehicles/maybach-1.jpg',
    featured: false,
    description: 'Ultimate luxury sedan for grand entrances',
    features: ['Sunroof', 'Leather', 'Entertainment', 'Chauffeur'],
    isAvailable: true,
    partnerRating: 4.8
  },
  {
    id: '6',
    name: 'Kathiawari Horse with Silver Decor',
    type: 'ghodi',
    city: 'Udaipur',
    price: 22000,
    rating: 4.7,
    reviewCount: 38,
    image: '/vehicles/horse-2.jpg',
    featured: false,
    description: 'Stunning Kathiawari horse with silver ornaments',
    features: ['Silver Decor', 'Trained', 'Insurance', 'Handler'],
    isAvailable: true,
    partnerRating: 4.9
  },
  {
    id: '7',
    name: 'Range Rover Autobiography',
    type: 'luxury',
    city: 'Delhi',
    price: 35000,
    rating: 4.5,
    reviewCount: 19,
    image: '/vehicles/rangerover-1.jpg',
    featured: false,
    description: 'Luxury SUV for modern wedding processions',
    features: ['SUV', 'Spacious', 'Premium', 'Chauffeur'],
    isAvailable: true,
    partnerRating: 4.7
  },
  {
    id: '8',
    name: 'Horse Carriage - Victorian Style',
    type: 'royal',
    city: 'Goa',
    price: 38000,
    rating: 4.8,
    reviewCount: 27,
    image: '/vehicles/carriage-1.jpg',
    featured: true,
    description: 'Elegant Victorian-style horse carriage',
    features: ['Victorian', 'Elegant', 'Photogenic', 'Royal'],
    isAvailable: true,
    partnerRating: 4.8
  },
  {
    id: '9',
    name: 'White Arabian Horse',
    type: 'ghodi',
    city: 'Hyderabad',
    price: 20000,
    rating: 4.6,
    reviewCount: 22,
    image: '/vehicles/horse-3.jpg',
    featured: false,
    description: 'Graceful Arabian horse with floral decor',
    features: ['Arabian', 'Floral', 'Trained', 'Handler'],
    isAvailable: true,
    partnerRating: 4.7
  },
]

export default function VehiclesPage() {
  const [viewMode, setViewMode] = useState<'grid'|'list'>('list')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedCity, setSelectedCity] = useState<string>('all')
  const [priceRange, setPriceRange] = useState<string>('all')
  const [sortBy, setSortBy] = useState('recommended')

  const vehicleTypes = [
    { id: 'all', name: 'All Vehicles', count: 9 },
    { id: 'ghodi', name: 'Ghodi & Horses', count: 3 },
    { id: 'luxury', name: 'Luxury Cars', count: 3 },
    { id: 'royal', name: 'Royal Vehicles', count: 3 },
  ]

  const cities = ['Jaipur', 'Delhi', 'Udaipur', 'Mumbai', 'Hyderabad', 'Goa']

  const filteredVehicles = mockVehicles.filter(vehicle => {
    if (selectedType !== 'all' && vehicle.type !== selectedType) return false
    if (selectedCity !== 'all' && vehicle.city !== selectedCity) return false
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
      default: return a.featured ? -1 : 1 // recommended
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-amber-50">
      {/* Hero Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-300 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-rose-300 rounded-full blur-3xl opacity-20"></div>
        </div>

        <div className="container relative mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full mb-6">
              <span className="text-white font-bold text-sm">ROYAL COLLECTION</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="block text-gray-900">Find Your</span>
              <span className="block bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent animate-gradient">
                Perfect Baraat Ride
              </span>
            </h1>
            
            <p className="text-xl text-gray-700 mb-10">
              Browse our curated collection of majestic vehicles for your grand wedding entrance
            </p>

            {/* Quick Search */}
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-2 mb-12">
              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="flex items-center text-sm font-bold text-gray-700 mb-2">
                      CITY
                    </div>
                    <select 
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full p-4 rounded-xl border-2 border-amber-200 bg-white focus:border-amber-500 outline-none appearance-none"
                    >
                      <option value="all">All Cities</option>
                      {cities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center text-sm font-bold text-gray-700 mb-2">
                      PRICE RANGE
                    </div>
                    <select 
                      value={priceRange}
                      onChange={(e) => setPriceRange(e.target.value)}
                      className="w-full p-4 rounded-xl border-2 border-amber-200 bg-white focus:border-amber-500 outline-none"
                    >
                      <option value="all">Any Price</option>
                      <option value="0-20000">Under ₹20,000</option>
                      <option value="20000-40000">₹20,000 - ₹40,000</option>
                      <option value="40000-60000">₹40,000 - ₹60,000</option>
                      <option value="60000-100000">Above ₹60,000</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button className="px-8 py-4 bg-gradient-to-r from-rose-600 to-red-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center">
                      <Search className="h-5 w-5 mr-2" />
                      Search Vehicles
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-20">
        {/* Vehicle Type Tabs */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-4 justify-center">
            {vehicleTypes.map(type => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`px-6 py-4 rounded-xl font-bold transition-all duration-300 flex items-center ${
                  selectedType === type.id
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-amber-300'
                }`}
              >
                <div className="text-left">
                  <div className="font-bold">{type.name}</div>
                  <div className="text-sm opacity-80">{type.count} vehicles</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Mobile Toggle */}
          <div className="lg:w-1/4">
            <div className="sticky top-24">
              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="lg:hidden w-full mb-4 px-6 py-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-gray-900 font-bold rounded-xl shadow-lg flex items-center justify-center"
              >
                <Filter className="h-5 w-5 mr-2" />
                {filtersOpen ? 'Hide Filters' : 'Show Filters'}
                <ChevronDown className={`h-5 w-5 ml-2 transition-transform ${filtersOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Filters Panel */}
              <div className={`${filtersOpen ? 'block' : 'hidden'} lg:block bg-white rounded-2xl shadow-xl border-2 border-gray-100 p-6`}>
                <div className="mb-8">
                  <h3 className="text-lg font-bold mb-4 flex items-center">
                    <Filter className="h-5 w-5 mr-2 text-amber-600" />
                    Filters
                  </h3>
                  
                  {/* Vehicle Type */}
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">Vehicle Type</h4>
                    <div className="space-y-2">
                      {[
                        { id: 'ghodi', name: 'Ghodi & Horses', color: 'amber' },
                        { id: 'luxury', name: 'Luxury Cars', color: 'blue' },
                        { id: 'royal', name: 'Royal Vehicles', color: 'purple' },
                      ].map(type => (
                        <label key={type.id} className="flex items-center space-x-3 cursor-pointer group">
                          <input 
                            type="checkbox" 
                            checked={selectedType === type.id}
                            onChange={() => setSelectedType(type.id === selectedType ? 'all' : type.id)}
                            className="h-5 w-5 rounded border-2 border-gray-300 checked:bg-amber-500 checked:border-amber-500 focus:ring-amber-200"
                          />
                          <span className="text-gray-700 group-hover:text-gray-900 font-medium">{type.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* City Filter */}
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3 flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-rose-500" />
                      City
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {cities.map(city => (
                        <button
                          key={city}
                          onClick={() => setSelectedCity(selectedCity === city ? 'all' : city)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            selectedCity === city
                              ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">Price Range (per day)</h4>
                    <div className="space-y-2">
                      {[
                        { label: 'Under ₹20,000', value: '0-20000' },
                        { label: '₹20,000 - ₹40,000', value: '20000-40000' },
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
                            className="h-4 w-4 text-amber-600"
                          />
                          <span className="text-gray-700 group-hover:text-gray-900">{range.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Clear Filters */}
                  <button
                    onClick={() => {
                      setSelectedType('all')
                      setSelectedCity('all')
                      setPriceRange('all')
                    }}
                    className="w-full py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Results Header */}
            <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 p-6 mb-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Available Vehicles
                    <span className="ml-3 px-3 py-1 bg-gradient-to-r from-amber-400 to-yellow-500 text-gray-900 rounded-full text-sm font-bold">
                      {filteredVehicles.length} found
                    </span>
                  </h2>
                  <p className="text-gray-600 flex items-center">
                    Curated collection for your perfect entrance
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  {/* View Toggle */}
                  <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-3 transition-all ${viewMode === 'list' ? 'bg-amber-500 text-white' : 'bg-white text-gray-700'}`}
                    >
                      <List className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Sort Dropdown */}
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-3 rounded-xl border-2 border-gray-200 bg-white focus:border-amber-500 outline-none font-medium"
                  >
                    <option value="recommended">Recommended</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Rating: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Vehicle Grid/List */}
            {filteredVehicles.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-xl border-2 border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No vehicles found</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Try adjusting your filters or browse our full collection
                </p>
                <button
                  onClick={() => {
                    setSelectedType('all')
                    setSelectedCity('all')
                    setPriceRange('all')
                  }}
                  className="px-8 py-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-gray-900 font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className={`gap-6 ${
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'flex flex-col'
              }`}>
                {sortedVehicles.map(vehicle => (
                  <Link key={vehicle.id} href={`/vehicles/${vehicle.id}`}>
                    <div className={`bg-white rounded-2xl shadow-xl border-2 border-gray-100 overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer ${
                      viewMode === 'list' ? 'flex' : ''
                    }`}>
                      {/* Image Section */}
                      <div className={`${
                        viewMode === 'list' ? 'w-1/3' : 'h-48'
                      } relative overflow-hidden`}>
                        {/* Type Badge */}
                        <div className="absolute top-3 left-3 z-10">
                          <div className={`px-3 py-1 rounded-full font-bold text-white ${
                            vehicle.type === 'ghodi' ? 'bg-gradient-to-r from-amber-500 to-yellow-500' :
                            vehicle.type === 'luxury' ? 'bg-gradient-to-r from-blue-500 to-indigo-600' :
                            'bg-gradient-to-r from-purple-500 to-pink-500'
                          }`}>
                            {vehicle.type === 'ghodi' ? 'Ghodi' : 
                             vehicle.type === 'luxury' ? 'Luxury' : 'Royal'}
                          </div>
                        </div>

                        {/* Featured Badge */}
                        {vehicle.featured && (
                          <div className="absolute top-3 right-3 z-10">
                            <div className="px-3 py-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold rounded-full">
                              Featured
                            </div>
                          </div>
                        )}

                        {/* Image Placeholder */}
                        <div className={`h-full w-full ${
                          vehicle.type === 'ghodi' ? 'bg-gradient-to-br from-amber-100 to-yellow-100' :
                          vehicle.type === 'luxury' ? 'bg-gradient-to-br from-blue-100 to-indigo-100' :
                          'bg-gradient-to-br from-purple-100 to-pink-100'
                        } flex items-center justify-center`}>
                          <div className="text-6xl animate-float">
                            {vehicle.type === 'ghodi' ? '🐎' : 
                             vehicle.type === 'luxury' ? '🚗' : '👑'}
                          </div>
                        </div>

                        {/* Availability Badge */}
                        <div className="absolute bottom-3 left-3">
                          <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-bold">
                            ✅ Available
                          </div>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className={`p-6 ${viewMode === 'list' ? 'w-2/3' : ''}`}>
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-xl font-bold text-gray-900 line-clamp-2">{vehicle.name}</h3>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-amber-500 fill-amber-500 mr-1" />
                            <span className="font-bold">{vehicle.rating}</span>
                            <span className="text-gray-500 text-sm ml-1">({vehicle.reviewCount})</span>
                          </div>
                        </div>

                        <div className="flex items-center text-gray-600 mb-4">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span className="font-medium">{vehicle.city}</span>
                          <span className="mx-2">•</span>
                          <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                            {vehicle.type === 'ghodi' ? 'Horse' : 
                             vehicle.type === 'luxury' ? 'Luxury Car' : 'Royal Vehicle'}
                          </span>
                        </div>

                        <p className="text-gray-700 mb-4 line-clamp-2">{vehicle.description}</p>

                        {/* Features */}
                        <div className="flex flex-wrap gap-2 mb-6">
                          {vehicle.features.slice(0, 3).map((feature, idx) => (
                            <span 
                              key={idx}
                              className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-lg"
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
                            <div className="text-sm text-gray-500">per day</div>
                          </div>
                          <button className="px-6 py-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-gray-900 font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            {filteredVehicles.length > 0 && (
              <div className="mt-12 flex justify-center">
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    ← Previous
                  </button>
                  {[1, 2, 3].map(page => (
                    <button
                      key={page}
                      className={`px-4 py-2 rounded-lg font-medium ${
                        page === 1
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    Next →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}