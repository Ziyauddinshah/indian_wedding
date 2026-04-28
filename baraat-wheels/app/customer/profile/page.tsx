// app/customer/profile/page.tsx
'use client'

import { useState } from 'react'
import { User, Mail, Phone, MapPin, Lock, Bell, Save } from 'lucide-react'
import { useAuth } from '@/app/contexts/AuthContext'
export default function ProfilePage() {
  const { user } = useAuth()

  const [profile, setProfile] = useState({
    name: user?.name || 'Rajesh Kumar',
    email: user?.email || 'rajesh@example.com',
    phone: user?.phone || '+91 98765 43210',
    city: 'Jaipur',
    notifications: true,
    marketingEmails: false
  })

  const handleChange = (field: string, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Save profile changes
    alert('Profile updated successfully!')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <div className="h-24 w-24 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                RK
              </div>
              <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
              <p className="text-gray-600 mt-1">Customer since 2024</p>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total Bookings</span>
                  <span className="font-bold">12</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-500">Reviews Given</span>
                  <span className="font-bold">8</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <User className="h-5 w-5 mr-2 text-amber-500" />
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                      value={profile.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none appearance-none"
                    >
                      <option>Jaipur</option>
                      <option>Delhi</option>
                      <option>Udaipur</option>
                      <option>Mumbai</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center mb-6">
                  <Bell className="h-5 w-5 mr-2 text-amber-500" />
                  Notification Preferences
                </h3>

                <div className="space-y-4">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <div className="font-medium text-gray-900">Booking Updates</div>
                      <div className="text-sm text-gray-500">Get notified about booking status changes</div>
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={profile.notifications}
                        onChange={(e) => handleChange('notifications', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-amber-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </div>
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <div className="font-medium text-gray-900">Marketing Emails</div>
                      <div className="text-sm text-gray-500">Receive offers and wedding inspiration</div>
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={profile.marketingEmails}
                        onChange={(e) => handleChange('marketingEmails', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-amber-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center mb-6">
                  <Lock className="h-5 w-5 mr-2 text-amber-500" />
                  Change Password
                </h3>

                <div className="grid grid-cols-1 gap-4">
                  <input
                    type="password"
                    placeholder="Current Password"
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-amber-500 outline-none"
                  />
                  <input
                    type="password"
                    placeholder="New Password"
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-amber-500 outline-none"
                  />
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:shadow-lg transition-all flex items-center justify-center"
              >
                <Save className="h-5 w-5 mr-2" />
                Save Changes
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}