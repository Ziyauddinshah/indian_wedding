// app/vehicles/royal/page.tsx
'use client'

import { useState } from 'react'
import { Crown, Castle, Shield, Sparkles, Star, MapPin, Award, Users } from 'lucide-react'
import Link from 'next/link'

const royalVehicles = [
  {
    id: 'royal-1',
    name: 'Decorated Royal Elephant',
    description: 'Majestic elephant with traditional howdah, royal attendants, and ceremonial music',
    price: 55000,
    rating: 4.7,
    reviewCount: 31,
    city: 'Jaipur',
    features: ['Golden Howdah', '4 Royal Attendants', 'Traditional Music', 'Photo Session', 'Insurance'],
    images: ['/vehicles/elephant-1.jpg'],
    type: 'Elephant',
    era: 'Traditional',
    availability: 'Available',
    partner: 'Royal Heritage Jaipur',
    partnerRating: 4.8,
    tags: ['Iconic', 'Traditional'],
    capacity: 2
  },
  {
    id: 'royal-2',
    name: 'Victorian Horse Carriage',
    description: 'Elegant horse-drawn carriage from British era, restored to perfection',
    price: 38000,
    rating: 4.8,
    reviewCount: 27,
    city: 'Udaipur',
    features: ['Restored Carriage', '2 Horses', 'Coachman in Period Attire', 'Photography Setup'],
    images: ['/vehicles/carriage-1.jpg'],
    type: 'Carriage',
    era: 'Victorian',
    availability: 'Available',
    partner: 'Heritage Carriages',
    partnerRating: 4.7,
    tags: ['Romantic', 'Elegant'],
    capacity: 4
  },
  {
    id: 'royal-3',
    name: 'Vintage Rolls Royce 1930',
    description: 'Classic 1930s Rolls Royce in pristine condition, perfect for royal themes',
    price: 45000,
    rating: 4.6,
    reviewCount: 22,
    city: 'Delhi',
    features: ['Fully Restored', 'Period Driver', 'Classic Decor', 'Insurance'],
    images: ['/vehicles/vintage-rolls-1.jpg'],
    type: 'Vintage Car',
    era: '1930s',
    availability: 'Limited',
    partner: 'Classic Cars Delhi',
    partnerRating: 4.9,
    tags: ['Classic', 'Heritage'],
    capacity: 4
  },
  {
    id: 'royal-4',
    name: 'Royal Camel Caravan',
    description: 'Traditional camel caravan with decorated camels and musicians',
    price: 35000,
    rating: 4.5,
    reviewCount: 18,
    city: 'Jaisalmer',
    features: ['3 Decorated Camels', 'Folk Musicians', 'Traditional Attire', 'Desert Theme'],
    images: ['/vehicles/camel-1.jpg'],
    type: 'Camel',
    era: 'Traditional',
    availability: 'Available',
    partner: 'Desert Royals',
    partnerRating: 4.6,
    tags: ['Desert Theme', 'Unique'],
    capacity: 6
  },
  {
    id: 'royal-5',
    name: 'Royal Jeep (1940s Military)',
    description: 'Vintage military jeep converted for royal wedding processions',
    price: 28000,
    rating: 4.4,
    reviewCount: 15,
    city: 'Goa',
    features: ['Military Style', 'Open Top', 'Vintage Decor', 'Adventure Theme'],
    images: ['/vehicles/jeep-1.jpg'],
    type: 'Vintage Jeep',
    era: '1940s',
    availability: 'Available',
    partner: 'Vintage Adventures',
    partnerRating: 4.5,
    tags: ['Adventure', 'Rustic'],
    capacity: 6
  },
  {
    id: 'royal-6',
    name: 'Palanquin (Doli) with Bearers',
    description: 'Traditional Indian palanquin carried by bearers in royal attire',
    price: 32000,
    rating: 4.7,
    reviewCount: 25,
    city: 'Varanasi',
    features: ['Handcrafted Doli', '8 Bearers', 'Traditional Attire', 'Ceremonial Music'],
    images: ['/vehicles/doli-1.jpg'],
    type: 'Palanquin',
    era: 'Traditional',
    availability: 'Available',
    partner: 'Traditional Weddings',
    partnerRating: 4.8,
    tags: ['Authentic', 'Traditional'],
    capacity: 2
  },
]

const vehicleTypes = ['Elephant', 'Carriage', 'Vintage Car', 'Camel', 'Vintage Jeep', 'Palanquin', 'All']
const eras = ['Traditional', 'Victorian', '1930s', '1940s', 'All']

export default function RoyalVehiclesPage() {
  const [selectedType, setSelectedType] = useState('All')
  const [selectedEra, setSelectedEra] = useState('All')
  const [selectedCity, setSelectedCity] = useState('All')
  const [sortBy, setSortBy] = useState('popular')

  const filteredVehicles = royalVehicles.filter(vehicle => {
    if (selectedType !== 'All' && vehicle.type !== selectedType) return false
    if (selectedEra !== 'All' && vehicle.era !== selectedEra) return false
    if (selectedCity !== 'All' && vehicle.city !== selectedCity) return false
    return true
  })

  const sortedVehicles = [...filteredVehicles].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price
      case 'price-high': return b.price - a.price
      case 'rating': return b.rating - a.rating
      default: return a.tags.includes('Iconic') ? -1 : 1
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-900 via-purple-800 to-pink-900 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-500 rounded-full blur-3xl"></div>
        </div>

        <div className="container relative mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full mb-8">
              <Crown className="h-6 w-6 text-yellow-400 mr-3" />
              <span className="text-lg font-bold">ROYAL HERITAGE COLLECTION</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="block">Experience True</span>
              <span className="block bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-300 bg-clip-text text-transparent">
                Royal Grandeur
              </span>
            </h1>

            <p className="text-xl text-purple-100 mb-10 max-w-3xl mx-auto">
              Step into a world of regal splendor with our heritage collection of elephants, 
              vintage cars, horse carriages, and traditional vehicles fit for royalty.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {[
                { label: 'Royal Vehicles', value: '6+', icon: '👑' },
                { label: 'Heritage Cities', value: '8+', icon: '🏰' },
                { label: 'Avg Rating', value: '4.7★', icon: '⭐' },
                { label: 'Royal Weddings', value: '150+', icon: '🎊' },
              ].map((stat, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-2xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-purple-200">{stat.label}</div>
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
              {/* Type Filter */}
              <div className="bg-white rounded-2xl shadow-xl border-2 border-purple-100 p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <Crown className="h-5 w-5 mr-2 text-purple-600" />
                  Vehicle Type
                </h3>
                <div className="space-y-2">
                  {vehicleTypes.map(type => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                        selectedType === type
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="mr-3 text-xl">
                          {type === 'Elephant' ? '🐘' : 
                           type === 'Carriage' ? '🏇' : 
                           type === 'Vintage Car' ? '🚗' : 
                           type === 'Camel' ? '🐪' : 
                           type === 'Vintage Jeep' ? '🚙' : 
                           type === 'Palanquin' ? '👑' : '👑'}
                        </span>
                        {type}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Era Filter */}
              <div className="bg-white rounded-2xl shadow-xl border-2 border-purple-100 p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <Castle className="h-5 w-5 mr-2 text-purple-600" />
                  Era/Theme
                </h3>
                <div className="space-y-2">
                  {eras.map(era => (
                    <button
                      key={era}
                      onClick={() => setSelectedEra(era)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                        selectedEra === era
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {era}
                    </button>
                  ))}
                </div>
              </div>

              {/* City Filter */}
              <div className="bg-white rounded-2xl shadow-xl border-2 border-purple-100 p-6">
                <h3 className="text-lg font-bold mb-4">📍 City</h3>
                <div className="grid grid-cols-2 gap-2">
                  {['Jaipur', 'Udaipur', 'Delhi', 'Jaisalmer', 'Goa', 'Varanasi', 'All'].map(city => (
                    <button
                      key={city}
                      onClick={() => setSelectedCity(city)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedCity === city
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>

              {/* Royal Features */}
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-6 text-white">
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Royal Experience Includes
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Shield className="h-4 w-4 mr-3 text-yellow-300" />
                    <span>Traditional Attire for Attendants</span>
                  </li>
                  <li className="flex items-center">
                    <Award className="h-4 w-4 mr-3 text-yellow-300" />
                    <span>Ceremonial Music Setup</span>
                  </li>
                  <li className="flex items-center">
                    <Users className="h-4 w-4 mr-3 text-yellow-300" />
                    <span>Trained Handlers/Drivers</span>
                  </li>
                  <li className="flex items-center">
                    <Star className="h-4 w-4 mr-3 text-yellow-300" />
                    <span>Photo Session with Vehicle</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Results Header */}
            <div className="bg-white rounded-2xl shadow-xl border-2 border-purple-100 p-6 mb-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Royal Heritage Vehicles
                    <span className="ml-3 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-bold">
                      {filteredVehicles.length} Available
                    </span>
                  </h2>
                  <p className="text-gray-600">Step into history with these majestic vehicles</p>
                </div>

                <div className="flex items-center gap-4">
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-3 rounded-xl border-2 border-gray-200 bg-white focus:border-purple-500 outline-none font-medium"
                  >
                    <option value="popular">✨ Most Popular</option>
                    <option value="price-low">💰 Price: Low to High</option>
                    <option value="price-high">💰 Price: High to Low</option>
                    <option value="rating">⭐ Highest Rated</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Vehicles Grid */}
            {filteredVehicles.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-xl border-2 border-purple-100">
                <div className="text-6xl mb-6">👑</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No royal vehicles found</h3>
                <p className="text-gray-600 mb-8">Try adjusting your filters</p>
                <button
                  onClick={() => {
                    setSelectedType('All')
                    setSelectedEra('All')
                    setSelectedCity('All')
                  }}
                  className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {sortedVehicles.map(vehicle => (
                  <Link key={vehicle.id} href={`/vehicles/${vehicle.id}`}>
                    <div className="bg-white rounded-2xl shadow-xl border-2 border-purple-100 overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer">
                      {/* Vehicle Image */}
                      <div className="h-56 relative overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100">
                        {/* Tags */}
                        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                          {vehicle.tags.map(tag => (
                            <div key={tag} className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-full text-sm">
                              {tag}
                            </div>
                          ))}
                        </div>

                        {/* Type Badge */}
                        <div className="absolute top-4 right-4 z-10">
                          <div className="px-3 py-1 bg-white/90 backdrop-blur-sm text-purple-700 font-bold rounded-full">
                            {vehicle.type}
                          </div>
                        </div>

                        {/* Vehicle Icon */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-8xl animate-float">
                            {vehicle.type === 'Elephant' ? '🐘' : 
                             vehicle.type === 'Carriage' ? '🏇' : 
                             vehicle.type === 'Vintage Car' ? '🚗' : 
                             vehicle.type === 'Camel' ? '🐪' : 
                             vehicle.type === 'Vintage Jeep' ? '🚙' : '👑'}
                          </div>
                        </div>

                        {/* Era Badge */}
                        <div className="absolute bottom-4 left-4">
                          <div className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-bold">
                            {vehicle.era}
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
                          <MapPin className="h-4 w-4 mr-2" />
                          <span className="font-medium">{vehicle.city}</span>
                          <span className="mx-2">•</span>
                          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">
                            {vehicle.capacity} seats
                          </span>
                        </div>

                        {/* Features */}
                        <div className="flex flex-wrap gap-2 mb-6">
                          {vehicle.features.slice(0, 3).map((feature, idx) => (
                            <span 
                              key={idx}
                              className="px-3 py-1 bg-purple-50 text-purple-700 text-sm rounded-lg"
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
                          <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Royal Themes */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">🎭 Popular Royal Themes</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    name: 'Mughal Royalty',
                    description: 'Elephants, howdahs, and traditional musicians',
                    vehicles: ['Elephant', 'Palanquin'],
                    color: 'from-amber-500 to-yellow-500',
                    icon: '🐘'
                  },
                  {
                    name: 'British Raj',
                    description: 'Victorian carriages and vintage cars',
                    vehicles: ['Horse Carriage', 'Vintage Car'],
                    color: 'from-blue-500 to-indigo-500',
                    icon: '🏇'
                  },
                  {
                    name: 'Desert Kingdom',
                    description: 'Camel caravans and desert themes',
                    vehicles: ['Camel', 'Vintage Jeep'],
                    color: 'from-orange-500 to-red-500',
                    icon: '🐪'
                  }
                ].map((theme, idx) => (
                  <div key={idx} className={`bg-gradient-to-br ${theme.color} text-white rounded-2xl p-6`}>
                    <div className="text-4xl mb-4">{theme.icon}</div>
                    <h4 className="text-xl font-bold mb-2">{theme.name}</h4>
                    <p className="mb-4 opacity-90">{theme.description}</p>
                    <div className="space-y-1">
                      {theme.vehicles.map((vehicle, vIdx) => (
                        <div key={vIdx} className="flex items-center">
                          <span className="mr-2">✓</span>
                          {vehicle}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Booking Process */}
            <div className="mt-12 bg-gradient-to-r from-purple-900 to-pink-900 rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-8 md:p-12 text-white">
                <h3 className="text-3xl font-bold mb-8 text-center">The Royal Booking Process</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  {[
                    {
                      step: '01',
                      title: 'Consultation',
                      description: 'Discuss your royal theme and requirements'
                    },
                    {
                      step: '02',
                      title: 'Vehicle Selection',
                      description: 'Choose from our heritage collection'
                    },
                    {
                      step: '03',
                      title: 'Customization',
                      description: 'Add traditional attire, music, and decor'
                    },
                    {
                      step: '04',
                      title: 'Royal Execution',
                      description: 'Experience the grandeur on your special day'
                    }
                  ].map((step, idx) => (
                    <div key={idx} className="text-center">
                      <div className="text-4xl font-bold text-yellow-300 mb-4">{step.step}</div>
                      <h4 className="text-xl font-bold mb-3">{step.title}</h4>
                      <p className="text-purple-200">{step.description}</p>
                    </div>
                  ))}
                </div>
                <div className="text-center mt-8">
                  <button className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900 font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                    🏰 Book Royal Consultation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}