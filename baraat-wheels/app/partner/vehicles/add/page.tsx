'use client';

import { useState } from 'react';
import { Upload, Camera, Tag, Calendar, MapPin, DollarSign } from 'lucide-react';

const vehicleTypes = [
  { id: 'luxury', name: 'Luxury Vehicle', color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
  { id: 'ghodi', name: 'Ghodi', color: 'bg-gradient-to-r from-amber-500 to-orange-500' },
  { id: 'royal', name: 'Royal Vehicle', color: 'bg-gradient-to-r from-emerald-500 to-teal-600' },
];

export default function AddVehicle() {
  const [selectedType, setSelectedType] = useState('luxury');
  const [images, setImages] = useState<string[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setImages(prev => [...prev, ...newImages].slice(0, 6));
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Add New Vehicle</h1>
        <p className="text-gray-600 mt-2">List your premium vehicle and start earning</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            {/* Vehicle Type Selection */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Tag className="text-blue-600" />
                Select Vehicle Type
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {vehicleTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`
                      p-4 rounded-xl border-2 transition-all duration-300
                      ${selectedType === type.id 
                        ? 'border-blue-500 bg-blue-50 shadow-md' 
                        : 'border-gray-200 hover:border-blue-300'
                      }
                    `}
                  >
                    <div className={`w-12 h-12 ${type.color} rounded-lg flex items-center justify-center mb-3`}>
                      <CarIcon type={type.id} />
                    </div>
                    <h3 className="font-semibold text-gray-800">{type.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {type.id === 'luxury' && 'Mercedes, BMW, Audi'}
                      {type.id === 'ghodi' && 'Traditional horse carriage'}
                      {type.id === 'royal' && 'Vintage & special vehicles'}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vehicle Name *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                    placeholder="e.g., Mercedes S-Class 2024"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price per Day (₹) *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="number"
                      className="w-full px-4 py-3 pl-10 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                      placeholder="15000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Model Year *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="number"
                      className="w-full px-4 py-3 pl-10 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                      placeholder="2024"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      className="w-full px-4 py-3 pl-10 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                      placeholder="Mumbai, Maharashtra"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition resize-none"
                  placeholder="Describe your vehicle's features, amenities, and special services..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Add Vehicle & Start Earning
              </button>
            </form>
          </div>
        </div>

        {/* Right Column - Image Upload */}
        <div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 sticky top-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Camera className="text-pink-600" />
              Vehicle Photos
            </h2>
            <p className="text-gray-600 mb-6">Upload high-quality photos (6 max)</p>

            {/* Image Upload Area */}
            <label className="block cursor-pointer">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <div className="border-2 border-dashed border-blue-300 rounded-2xl p-8 text-center hover:bg-blue-50 transition-colors group">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="text-blue-600" size={28} />
                </div>
                <h3 className="font-semibold text-gray-800">Click to upload</h3>
                <p className="text-sm text-gray-500 mt-1">or drag and drop</p>
                <p className="text-xs text-gray-400 mt-2">PNG, JPG, WEBP up to 10MB</p>
              </div>
            </label>

            {/* Preview Grid */}
            {images.length > 0 && (
              <div className="mt-6">
                <h3 className="font-medium text-gray-700 mb-3">Preview</h3>
                <div className="grid grid-cols-2 gap-3">
                  {images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img}
                        alt={`Vehicle ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => setImages(images.filter((_, i) => i !== index))}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tips Card */}
            <div className="mt-8 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
              <h4 className="font-semibold text-amber-800 mb-2">💡 Photo Tips</h4>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• Use good lighting</li>
                <li>• Show all angles</li>
                <li>• Include interior shots</li>
                <li>• Highlight special features</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CarIcon({ type }: { type: string }) {
  if (type === 'luxury') return <span className="text-white">🏎️</span>;
  if (type === 'ghodi') return <span className="text-white">🐎</span>;
  return <span className="text-white">👑</span>;
}