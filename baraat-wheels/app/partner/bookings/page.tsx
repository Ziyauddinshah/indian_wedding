'use client';

import { useState, useEffect } from 'react';
import { 
  Search, Filter, Calendar, Download, MoreVertical, 
  Eye, MessageCircle, CheckCircle, XCircle, Clock,
  TrendingUp, AlertCircle, Star, IndianRupee, Users,
  ChevronDown, ChevronLeft, ChevronRight, MapPin,
  Car, CalendarDays, User, Phone, Mail, FileText,
  Sparkles, BarChart3, RefreshCw, CheckSquare
} from 'lucide-react';
import BookingDetailsModal from '@/app/components/partner/BookingDetailsModel';

const bookingsData = [
  {
    id: 1,
    bookingId: 'BK-2024-001',
    customer: {
      name: 'Aarav Sharma',
      phone: '+91 9876543210',
      email: 'aarav@example.com',
      avatar: 'AS',
    },
    vehicle: {
      name: 'Mercedes S-Class 2024',
      type: 'luxury',
      category: 'Luxury Sedan',
      image: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=400&h=200&fit=crop',
    },
    details: {
      date: '25 Dec 2024',
      time: '06:00 PM',
      duration: '4 hours',
      pickup: 'Taj Hotel, Mumbai',
      dropoff: 'Grand Hyatt, Mumbai',
      guests: 4,
    },
    payment: {
      amount: '₹25,000',
      status: 'paid',
      method: 'UPI',
      advance: '₹10,000',
    },
    status: 'confirmed',
    timeline: [
      { step: 'Requested', time: '24 Nov, 10:30 AM', status: 'completed' },
      { step: 'Confirmed', time: '24 Nov, 11:15 AM', status: 'completed' },
      { step: 'Advance Paid', time: '24 Nov, 02:45 PM', status: 'completed' },
      { step: 'Vehicle Assigned', time: '24 Nov, 03:30 PM', status: 'completed' },
      { step: 'Upcoming', time: '25 Dec, 06:00 PM', status: 'current' },
      { step: 'Completed', time: '-', status: 'pending' },
    ],
    notes: 'Customer requested champagne service',
    createdAt: '24 Nov 2024',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 2,
    bookingId: 'BK-2024-002',
    customer: {
      name: 'Priya Patel',
      phone: '+91 8765432109',
      email: 'priya@example.com',
      avatar: 'PP',
    },
    vehicle: {
      name: 'Royal Elephant Decorated',
      type: 'royal',
      category: 'Royal Procession',
      image: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=400&h=200&fit=crop',
    },
    details: {
      date: '26 Dec 2024',
      time: '10:00 AM',
      duration: '8 hours',
      pickup: 'Udaipur Palace',
      dropoff: 'Lake Palace Hotel',
      guests: 12,
    },
    payment: {
      amount: '₹45,000',
      status: 'pending',
      method: 'Bank Transfer',
      advance: '₹15,000',
    },
    status: 'pending',
    timeline: [
      { step: 'Requested', time: '25 Nov, 02:15 PM', status: 'completed' },
      { step: 'Confirmed', time: 'Pending', status: 'current' },
      { step: 'Advance Paid', time: '-', status: 'pending' },
      { step: 'Vehicle Assigned', time: '-', status: 'pending' },
      { step: 'Upcoming', time: '26 Dec, 10:00 AM', status: 'pending' },
      { step: 'Completed', time: '-', status: 'pending' },
    ],
    notes: 'Wedding ceremony - need decoration',
    createdAt: '25 Nov 2024',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 3,
    bookingId: 'BK-2024-003',
    customer: {
      name: 'Rohan Mehta',
      phone: '+91 7654321098',
      email: 'rohan@example.com',
      avatar: 'RM',
    },
    vehicle: {
      name: 'BMW 7 Series Luxury',
      type: 'luxury',
      category: 'Executive Sedan',
      image: 'https://images.unsplash.com/photo-1555212697-194d092e3b8f?w=400&h=200&fit=crop',
    },
    details: {
      date: '28 Dec 2024',
      time: '11:00 AM',
      duration: '12 hours',
      pickup: 'Bangalore Airport',
      dropoff: 'ITC Gardenia',
      guests: 3,
    },
    payment: {
      amount: '₹28,000',
      status: 'paid',
      method: 'Credit Card',
      advance: '₹14,000',
    },
    status: 'confirmed',
    timeline: [
      { step: 'Requested', time: '26 Nov, 09:45 AM', status: 'completed' },
      { step: 'Confirmed', time: '26 Nov, 10:30 AM', status: 'completed' },
      { step: 'Advance Paid', time: '26 Nov, 11:15 AM', status: 'completed' },
      { step: 'Vehicle Assigned', time: 'Completed', status: 'completed' },
      { step: 'Upcoming', time: '28 Dec, 11:00 AM', status: 'current' },
      { step: 'Completed', time: '-', status: 'pending' },
    ],
    notes: 'Airport pickup - flight BA198',
    createdAt: '26 Nov 2024',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 4,
    bookingId: 'BK-2024-004',
    customer: {
      name: 'Neha Gupta',
      phone: '+91 6543210987',
      email: 'neha@example.com',
      avatar: 'NG',
    },
    vehicle: {
      name: 'Traditional Ghodi Set',
      type: 'ghodi',
      category: 'Traditional',
      image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=200&fit=crop',
    },
    details: {
      date: '29 Dec 2024',
      time: '04:00 PM',
      duration: '5 hours',
      pickup: 'Jaipur Fort',
      dropoff: 'City Palace',
      guests: 8,
    },
    payment: {
      amount: '₹15,000',
      status: 'cancelled',
      method: 'UPI',
      advance: '₹7,500',
    },
    status: 'cancelled',
    timeline: [
      { step: 'Requested', time: '27 Nov, 03:30 PM', status: 'completed' },
      { step: 'Confirmed', time: '27 Nov, 04:15 PM', status: 'completed' },
      { step: 'Advance Paid', time: '27 Nov, 05:00 PM', status: 'completed' },
      { step: 'Cancelled', time: '28 Nov, 10:00 AM', status: 'completed' },
      { step: 'Refund Initiated', time: '28 Nov, 02:30 PM', status: 'completed' },
      { step: 'Refund Completed', time: '29 Nov, 11:00 AM', status: 'completed' },
    ],
    notes: 'Cancelled due to weather conditions',
    createdAt: '27 Nov 2024',
    color: 'from-amber-500 to-orange-500',
  },
  {
    id: 5,
    bookingId: 'BK-2024-005',
    customer: {
      name: 'Vikram Singh',
      phone: '+91 5432109876',
      email: 'vikram@example.com',
      avatar: 'VS',
    },
    vehicle: {
      name: 'Audi A8 L Chauffeur',
      type: 'luxury',
      category: 'Premium Sedan',
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=200&fit=crop',
    },
    details: {
      date: 'Today',
      time: '02:00 PM',
      duration: '6 hours',
      pickup: 'Conrad Hotel',
      dropoff: 'Marina Bay',
      guests: 2,
    },
    payment: {
      amount: '₹22,500',
      status: 'paid',
      method: 'Wallet',
      advance: '₹11,250',
    },
    status: 'ongoing',
    timeline: [
      { step: 'Requested', time: 'Yesterday, 10:00 AM', status: 'completed' },
      { step: 'Confirmed', time: 'Yesterday, 10:45 AM', status: 'completed' },
      { step: 'Advance Paid', time: 'Yesterday, 11:30 AM', status: 'completed' },
      { step: 'Vehicle Assigned', time: 'Yesterday, 12:15 PM', status: 'completed' },
      { step: 'Ongoing', time: 'Today, 02:00 PM', status: 'current' },
      { step: 'Completed', time: 'Today, 08:00 PM', status: 'pending' },
    ],
    notes: 'Anniversary celebration',
    createdAt: 'Yesterday',
    color: 'from-gray-700 to-gray-900',
  },
  {
    id: 6,
    bookingId: 'BK-2024-006',
    customer: {
      name: 'Ananya Reddy',
      phone: '+91 4321098765',
      email: 'ananya@example.com',
      avatar: 'AR',
    },
    vehicle: {
      name: 'Vintage Rolls Royce',
      type: 'royal',
      category: 'Vintage',
      image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&h=200&fit=crop',
    },
    details: {
      date: '30 Dec 2024',
      time: '07:00 PM',
      duration: '3 hours',
      pickup: 'Hyderabad Convention',
      dropoff: 'Falaknuma Palace',
      guests: 6,
    },
    payment: {
      amount: '₹55,000',
      status: 'pending',
      method: 'Bank Transfer',
      advance: '₹27,500',
    },
    status: 'pending',
    timeline: [
      { step: 'Requested', time: 'Today, 09:00 AM', status: 'completed' },
      { step: 'Awaiting Confirmation', time: 'Now', status: 'current' },
      { step: 'Advance Payment', time: '-', status: 'pending' },
      { step: 'Vehicle Assignment', time: '-', status: 'pending' },
      { step: 'Upcoming', time: '30 Dec, 07:00 PM', status: 'pending' },
      { step: 'Completed', time: '-', status: 'pending' },
    ],
    notes: 'Corporate event - red carpet required',
    createdAt: 'Today',
    color: 'from-rose-500 to-red-500',
  },
];

const statusFilters = [
  { id: 'all', label: 'All Bookings', count: 24, color: 'bg-gradient-to-r from-blue-500 to-purple-500' },
  { id: 'pending', label: 'Pending', count: 5, color: 'bg-gradient-to-r from-amber-500 to-orange-500' },
  { id: 'confirmed', label: 'Confirmed', count: 12, color: 'bg-gradient-to-r from-emerald-500 to-teal-600' },
  { id: 'ongoing', label: 'Ongoing', count: 3, color: 'bg-gradient-to-r from-blue-500 to-cyan-500' },
  { id: 'completed', label: 'Completed', count: 15, color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
  { id: 'cancelled', label: 'Cancelled', count: 4, color: 'bg-gradient-to-r from-red-500 to-pink-600' },
];

const quickStats = [
  { label: 'Today\'s Bookings', value: '3', change: '+1', icon: <CalendarDays />, color: 'text-blue-600' },
  { label: 'Pending Actions', value: '5', change: '+2', icon: <AlertCircle />, color: 'text-amber-600' },
  { label: 'Revenue Today', value: '₹67,500', change: '+28%', icon: <IndianRupee />, color: 'text-emerald-600' },
  { label: 'Avg. Rating', value: '4.8', change: '+0.2', icon: <Star />, color: 'text-purple-600' },
];

export default function PartnerBookings() {
  const [bookings, setBookings] = useState(bookingsData);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Add a function to handle booking actions
  const handleBookingAction = (action: string) => {
    if (selectedBooking) {
      switch(action) {
        case 'confirm':
          // Update booking status to confirmed
          setBookings(bookings.map(b => 
            b.id === selectedBooking ? { ...b, status: 'confirmed' } : b
          ));
          alert(`Booking ${selectedBooking} confirmed!`);
          break;
        case 'reject':
          // Update booking status to cancelled
          setBookings(bookings.map(b => 
            b.id === selectedBooking ? { ...b, status: 'cancelled' } : b
          ));
          alert(`Booking ${selectedBooking} rejected!`);
          break;
        case 'message':
          // Open messaging interface
          alert(`Open messaging for booking ${selectedBooking}`);
          break;
        default:
          console.log(`Action: ${action} on booking ${selectedBooking}`);
      }
      setSelectedBooking(null); // Close modal after action
    }
  };

  // Filter bookings
  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = selectedStatus === 'all' || booking.status === selectedStatus;
    const matchesSearch = searchQuery === '' || 
      booking.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.bookingId.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Get status badge configuration
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'confirmed':
        return { 
          label: 'Confirmed', 
          color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
          icon: <CheckCircle className="text-emerald-500" size={16} />
        };
      case 'pending':
        return { 
          label: 'Pending', 
          color: 'bg-amber-100 text-amber-700 border-amber-200',
          icon: <Clock className="text-amber-500" size={16} />
        };
      case 'ongoing':
        return { 
          label: 'Ongoing', 
          color: 'bg-blue-100 text-blue-700 border-blue-200',
          icon: <Car className="text-blue-500" size={16} />
        };
      case 'completed':
        return { 
          label: 'Completed', 
          color: 'bg-purple-100 text-purple-700 border-purple-200',
          icon: <CheckCircle className="text-purple-500" size={16} />
        };
      case 'cancelled':
        return { 
          label: 'Cancelled', 
          color: 'bg-red-100 text-red-700 border-red-200',
          icon: <XCircle className="text-red-500" size={16} />
        };
      default:
        return { 
          label: 'Unknown', 
          color: 'bg-gray-100 text-gray-700 border-gray-200',
          icon: <AlertCircle className="text-gray-500" size={16} />
        };
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch(status) {
      case 'paid':
        return { label: 'Paid', color: 'bg-emerald-100 text-emerald-700' };
      case 'pending':
        return { label: 'Pending', color: 'bg-amber-100 text-amber-700' };
      case 'cancelled':
        return { label: 'Refunded', color: 'bg-red-100 text-red-700' };
      default:
        return { label: 'Unknown', color: 'bg-gray-100 text-gray-700' };
    }
  };

  // Handle booking actions
  const handleAction = (bookingId: number, action: string) => {
    console.log(`Action ${action} on booking ${bookingId}`);
    // Implement your action logic here
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Bookings Management
          </h1>
          <p className="text-gray-600 mt-2">Manage all your vehicle bookings and reservations</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="p-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50">
            <Download className="text-gray-600" size={20} />
          </button>
          <button className="p-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50">
            <RefreshCw className="text-gray-600" size={20} />
          </button>
          <button className="btn-primary flex items-center gap-2 px-6 py-3">
            <Sparkles size={20} />
            New Booking
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{stat.value}</p>
                <div className="text-sm text-emerald-600 flex items-center gap-1 mt-2">
                  <TrendingUp size={14} />
                  {stat.change}
                </div>
              </div>
              <div className={`p-3 ${stat.color} bg-opacity-10 rounded-xl`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters & Controls */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by customer, vehicle, or booking ID..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Date Range */}
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="upcoming">Upcoming</option>
            </select>

            {/* View Mode */}
            <div className="flex bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
              >
                <BarChart3 size={20} className={viewMode === 'list' ? 'text-blue-600' : 'text-gray-600'} />
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`p-2 rounded-lg ${viewMode === 'calendar' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
              >
                <Calendar size={20} className={viewMode === 'calendar' ? 'text-blue-600' : 'text-gray-600'} />
              </button>
            </div>

            <button className="p-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50">
              <Filter className="text-gray-600" size={20} />
            </button>
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap gap-2 mt-6">
          {statusFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedStatus(filter.id)}
              className={`px-4 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 ${
                selectedStatus === filter.id
                  ? 'text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } ${selectedStatus === filter.id ? filter.color : ''}`}
            >
              {filter.label}
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                selectedStatus === filter.id ? 'bg-white/20' : 'bg-gray-300'
              }`}>
                {filter.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {paginatedBookings.map((booking) => {
          const statusBadge = getStatusBadge(booking.status);
          const paymentBadge = getPaymentStatusBadge(booking.payment.status);
          
          return (
            <div
              key={booking.id}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-blue-300 hover:shadow-lg transition-all"
            >
              {/* Booking Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${booking.color} bg-gradient-to-r text-white`}>
                      {booking.vehicle.type === 'luxury' && '🏎️'}
                      {booking.vehicle.type === 'ghodi' && '🐎'}
                      {booking.vehicle.type === 'royal' && '👑'}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-xl font-bold text-gray-800">{booking.bookingId}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusBadge.color}`}>
                          <span className="flex items-center gap-1">
                            {statusBadge.icon}
                            {statusBadge.label}
                          </span>
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${paymentBadge.color}`}>
                          {paymentBadge.label}
                        </span>
                      </div>
                      <p className="text-gray-600 mt-1">Created on {booking.createdAt}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-gray-800">{booking.payment.amount}</span>
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <MoreVertical className="text-gray-500" size={20} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Customer Info */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-gray-800 flex items-center gap-2">
                      <User size={18} />
                      Customer Details
                    </h4>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold">
                        {booking.customer.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{booking.customer.name}</p>
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                          <Phone size={14} />
                          <span>{booking.customer.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                          <Mail size={14} />
                          <span>{booking.customer.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Vehicle & Timing */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-gray-800 flex items-center gap-2">
                      <Car size={18} />
                      Vehicle & Schedule
                    </h4>
                    <div className="space-y-2">
                      <p className="font-semibold text-gray-800">{booking.vehicle.name}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {booking.details.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {booking.details.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users size={14} />
                          {booking.details.guests} guests
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin size={14} />
                        <span>{booking.details.pickup} → {booking.details.dropoff}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-gray-800 flex items-center gap-2">
                      <IndianRupee size={18} />
                      Payment Details
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Amount</span>
                        <span className="font-bold">{booking.payment.amount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Advance Paid</span>
                        <span className="font-semibold text-emerald-600">{booking.payment.advance}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Method</span>
                        <span className="font-medium">{booking.payment.method}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration</span>
                        <span className="font-medium">{booking.details.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes & Actions */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                        <FileText size={16} />
                        Notes
                      </h4>
                      <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{booking.notes}</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setSelectedBooking(booking.id)}
                        className="px-4 py-2.5 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors font-medium flex items-center gap-2"
                      >
                        <Eye size={16} />
                        View Details
                      </button>
                      <button 
                        onClick={() => handleAction(booking.id, 'message')}
                        className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium flex items-center gap-2"
                      >
                        <MessageCircle size={16} />
                        Message
                      </button>
                      {booking.status === 'pending' && (
                        <button 
                          onClick={() => handleAction(booking.id, 'confirm')}
                          className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:shadow-md transition-all font-medium flex items-center gap-2"
                        >
                          <CheckSquare size={16} />
                          Confirm
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="mt-6">
                  <h4 className="font-bold text-gray-800 mb-4">Booking Timeline</h4>
                  <div className="flex overflow-x-auto pb-4">
                    {booking.timeline.map((step, index) => (
                      <div key={index} className="flex items-center">
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            step.status === 'completed' ? 'bg-emerald-500' :
                            step.status === 'current' ? 'bg-blue-500' :
                            'bg-gray-300'
                          } text-white`}>
                            {step.status === 'completed' ? '✓' : index + 1}
                          </div>
                          <div className="text-xs mt-2 text-center font-medium text-gray-700">{step.step}</div>
                          <div className="text-xs text-gray-500 mt-1">{step.time}</div>
                        </div>
                        {index < booking.timeline.length - 1 && (
                          <div className={`w-24 h-1 ${
                            step.status === 'completed' ? 'bg-emerald-500' : 'bg-gray-300'
                          }`} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-2xl p-6 border border-gray-200">
          <div className="text-sm text-gray-600">
            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredBookings.length)}-
            {Math.min(currentPage * itemsPerPage, filteredBookings.length)} of {filteredBookings.length} bookings
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronLeft size={20} />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-lg border ${
                  currentPage === page
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-transparent'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredBookings.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
            <Calendar className="text-gray-400" size={48} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No bookings found</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {searchQuery 
              ? `No bookings match your search "${searchQuery}". Try different keywords.`
              : 'You don\'t have any bookings yet. Start by promoting your vehicles!'}
          </p>
          <button className="btn-primary inline-flex items-center gap-2">
            <Sparkles size={20} />
            Promote Vehicles
          </button>
        </div>
      )}

      {/* Booking Calendar View (Collapsed by default) */}
      {viewMode === 'calendar' && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 mt-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Calendar View</h3>
          <div className="text-center py-12 text-gray-500">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>Calendar view coming soon!</p>
            <button 
              onClick={() => setViewMode('list')}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Switch back to list view
            </button>
          </div>
        </div>
      )}

      


  {selectedBooking && (
        <BookingDetailsModal
          booking={bookings.find(b => b.id === selectedBooking)}
          isOpen={!!selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onAction={handleBookingAction}
        />
      )}
    </div>
  );
}