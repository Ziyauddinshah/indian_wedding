'use client';

import { useState } from 'react';
import { 
  CheckCircle, Clock, AlertCircle, MapPin, User, 
  ChevronRight, Star, Calendar, IndianRupee 
} from 'lucide-react';

const initialBookings = [
  {
    id: 1,
    customer: 'Aarav Sharma',
    vehicle: 'Mercedes S-Class 2024',
    type: 'luxury',
    date: 'Today, 2:00 PM',
    pickup: 'Mumbai Airport',
    duration: '4 hours',
    status: 'confirmed',
    amount: '₹25,000',
    rating: 4.9,
    color: 'from-emerald-500 to-teal-600',
    icon: '🏎️',
    action: 'Ready to Deploy',
  },
  {
    id: 2,
    customer: 'Priya Patel',
    vehicle: 'Royal Elephant Set',
    type: 'royal',
    date: 'Tomorrow, 10:00 AM',
    pickup: 'Udaipur Palace',
    duration: '8 hours',
    status: 'pending',
    amount: '₹45,000',
    rating: 4.8,
    color: 'from-amber-500 to-orange-500',
    icon: '👑',
    action: 'Confirm Booking',
  },
  {
    id: 3,
    customer: 'Rohan Mehta',
    vehicle: 'BMW 7 Series Luxury',
    type: 'luxury',
    date: 'Dec 25, 6:00 PM',
    pickup: 'Delhi Hotel',
    duration: '6 hours',
    status: 'confirmed',
    amount: '₹22,500',
    rating: 4.7,
    color: 'from-purple-500 to-pink-500',
    icon: '🚗',
    action: 'Send Details',
  },
  {
    id: 4,
    customer: 'Neha Gupta',
    vehicle: 'Traditional Ghodi',
    type: 'ghodi',
    date: 'Dec 26, 4:00 PM',
    pickup: 'Jaipur Fort',
    duration: '5 hours',
    status: 'cancelled',
    amount: '₹15,000',
    rating: 4.5,
    color: 'from-red-500 to-pink-600',
    icon: '🐎',
    action: 'Refund Processed',
  },
  {
    id: 5,
    customer: 'Vikram Singh',
    vehicle: 'Audi A8 L Chauffeur',
    type: 'luxury',
    date: 'Dec 28, 11:00 AM',
    pickup: 'Bangalore City',
    duration: '12 hours',
    status: 'pending',
    amount: '₹28,000',
    rating: 4.8,
    color: 'from-blue-500 to-cyan-500',
    icon: '🚙',
    action: 'Review Request',
  },
];

const statusConfig = {
  confirmed: { 
    text: 'text-emerald-700', 
    bg: 'bg-emerald-100', 
    icon: <CheckCircle className="text-emerald-500" size={16} />,
    badge: 'bg-gradient-to-r from-emerald-500 to-teal-600'
  },
  pending: { 
    text: 'text-amber-700', 
    bg: 'bg-amber-100', 
    icon: <Clock className="text-amber-500" size={16} />,
    badge: 'bg-gradient-to-r from-amber-500 to-orange-500'
  },
  cancelled: { 
    text: 'text-red-700', 
    bg: 'bg-red-100', 
    icon: <AlertCircle className="text-red-500" size={16} />,
    badge: 'bg-gradient-to-r from-red-500 to-pink-600'
  },
};

export default function RecentBookings() {
  const [bookings, setBookings] = useState(initialBookings);
  const [filter, setFilter] = useState('all');

  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === filter);

  const handleStatusUpdate = (id: number, newStatus: string) => {
    setBookings(bookings.map(booking => 
      booking.id === id ? { ...booking, status: newStatus } : booking
    ));
  };

  const getVehicleTypeColor = (type: string) => {
    switch(type) {
      case 'luxury': return 'border-l-4 border-l-purple-500';
      case 'ghodi': return 'border-l-4 border-l-amber-500';
      case 'royal': return 'border-l-4 border-l-emerald-500';
      default: return 'border-l-4 border-l-gray-500';
    }
  };

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4">
        {['all', 'confirmed', 'pending', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              filter === status
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      <div className="space-y-3">
        {filteredBookings.map((booking) => (
          <div
            key={booking.id}
            className={`bg-white rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 ${getVehicleTypeColor(booking.type)}`}
          >
            <div className="flex items-start justify-between">
              {/* Left Section */}
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${statusConfig[booking.status as keyof typeof statusConfig].badge} text-white`}>
                  <span className="text-xl">{booking.icon}</span>
                </div>
                
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-bold text-lg text-gray-800">{booking.vehicle}</h4>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusConfig[booking.status as keyof typeof statusConfig].bg} ${statusConfig[booking.status as keyof typeof statusConfig].text}`}>
                      {statusConfig[booking.status as keyof typeof statusConfig].icon}
                      {booking.status}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <span className="flex items-center gap-1">
                      <User size={14} />
                      {booking.customer}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {booking.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={14} />
                      {booking.pickup}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="fill-yellow-400 text-yellow-400" size={14} />
                      {booking.rating}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg">
                      {booking.duration}
                    </span>
                    <span className="flex items-center gap-1 font-bold text-gray-800">
                      <IndianRupee size={16} />
                      {booking.amount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Section - Actions */}
              <div className="flex flex-col items-end gap-3">
                <button 
                  onClick={() => handleStatusUpdate(booking.id, booking.status === 'pending' ? 'confirmed' : 'pending')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    booking.status === 'pending'
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:shadow-md'
                      : booking.status === 'confirmed'
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-md'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {booking.action}
                </button>
                
                <button className="text-gray-500 hover:text-blue-600 flex items-center gap-1 text-sm">
                  View Details
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Pending Actions</p>
            <p className="text-2xl font-bold text-gray-800">
              {bookings.filter(b => b.status === 'pending').length} Bookings
            </p>
          </div>
          <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
            View All Bookings
          </button>
        </div>
      </div>
    </div>
  );
}