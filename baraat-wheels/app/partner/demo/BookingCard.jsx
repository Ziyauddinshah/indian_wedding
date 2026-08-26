// components/BookingCard.jsx
import React from 'react';
import { 
  Calendar, Clock, Users, MapPin, CreditCard, 
  Wallet, ArrowRight, Phone, Mail, Car, 
  CheckCircle, Clock as ClockIcon, AlertCircle, Sparkles, MessageCircle, Eye
} from 'lucide-react';

const BookingCard = ({ booking }) => {
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    return date.toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    return date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Get status info
  const getStatusInfo = (status) => {
    const statusMap = {
      'Pending': { color: 'text-amber-700', bg: 'bg-amber-100', border: 'border-amber-200', icon: ClockIcon, label: 'Pending' },
      'Confirmed': { color: 'text-blue-700', bg: 'bg-blue-100', border: 'border-blue-200', icon: CheckCircle, label: 'Confirmed' },
      'Started': { color: 'text-purple-700', bg: 'bg-purple-100', border: 'border-purple-200', icon: Car, label: 'In Progress' },
      'Completed': { color: 'text-emerald-700', bg: 'bg-emerald-100', border: 'border-emerald-200', icon: CheckCircle, label: 'Completed' },
      'Cancelled': { color: 'text-rose-700', bg: 'bg-rose-100', border: 'border-rose-200', icon: AlertCircle, label: 'Cancelled' }
    };
    return statusMap[status] || statusMap['Pending'];
  };

  const statusInfo = getStatusInfo(booking.status || 'Pending');
  const year = booking.timeline?.createdAt ? new Date(booking.timeline.createdAt).getFullYear() : new Date().getFullYear();
  const bookingRef = booking._id ? `BK-${booking._id.slice(-6).toUpperCase()}` : `BK-${year}-001`;

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 transition-all duration-200 hover:shadow-md w-full">
      {/* Top Header Bar */}
      <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-gray-50/70 to-white">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
          {/* Vehicle Thumbnail */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0 relative">
            {booking.vehicle?.images?.[0] ? (
              <img
                src={booking.vehicle.images[0]}
                alt={booking.vehicle?.vehicleName || 'Vehicle'}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <Car size={24} />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate">
                {booking.vehicle?.company} {booking.vehicle?.vehicleName || 'Vehicle Name'}
              </h3>
              <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-2 py-0.5 rounded-md border border-gray-200 shrink-0">
                {bookingRef}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border shrink-0 ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border}`}>
                <statusInfo.icon size={13} />
                {statusInfo.label}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1 truncate">
              {booking.vehicle?.category || 'Category'} • {booking.vehicle?.modelYear || '2024'} • Created on {formatDate(booking.timeline?.createdAt)}
            </p>
          </div>
        </div>

        {/* Fare Summary */}
        <div className="text-left sm:text-right flex-shrink-0 sm:pl-2">
          <span className="text-[11px] text-gray-400 uppercase tracking-wider block">Total Fare</span>
          <span className="text-xl sm:text-2xl font-bold text-gray-900">
            {booking.fare?.currency || '₹'} {(booking.fare?.total || 0).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-4 sm:p-5 space-y-4 sm:space-y-5">
        {/* Horizontal Row: Customer Details | Vehicle Details | Payment Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
          {/* 1. Customer Details */}
          <div className="bg-gray-50/80 rounded-xl p-3.5 sm:p-4 border border-gray-100 flex flex-col justify-between min-w-0">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shadow-sm flex-shrink-0">
                  {booking.customer?.name ? booking.customer.name.charAt(0).toUpperCase() : 'C'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Customer Details</div>
                  <div className="font-semibold text-sm text-gray-900 truncate">
                    {booking.customer?.name || 'Customer Name'}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-gray-600 pt-2 border-t border-gray-200/60">
                <div className="flex items-center gap-2 min-w-0">
                  <Phone size={13} className="text-blue-500 flex-shrink-0" />
                  <span className="truncate">{booking.customer?.phone || '+91 ----------'}</span>
                </div>
                <div className="flex items-center gap-2 min-w-0">
                  <Mail size={13} className="text-blue-500 flex-shrink-0" />
                  <span className="truncate">{booking.customer?.email || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Vehicle Details & Schedule */}
          <div className="bg-gray-50/80 rounded-xl p-3.5 sm:p-4 border border-gray-100 flex flex-col justify-between min-w-0">
            <div>
              <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Vehicle & Journey</span>
                <span className="text-blue-600 font-medium truncate ml-1">{booking.vehicle?.vehicleType || 'Sedan'}</span>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-700 mb-2.5 font-medium min-w-0">
                <Calendar size={13} className="text-blue-600 flex-shrink-0" />
                <span className="truncate">{formatDate(booking.timeline?.createdAt)} • {formatTime(booking.timeline?.createdAt)}</span>
              </div>

              <div className="space-y-1.5 text-xs bg-white p-2.5 rounded-lg border border-gray-100">
                <div className="flex items-start gap-1.5 min-w-0">
                  <MapPin size={13} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-800 line-clamp-1 min-w-0">
                    <strong className="font-medium text-gray-500">From:</strong> {booking.pickup?.address || 'Pickup Location'}
                  </span>
                </div>
                <div className="flex items-start gap-1.5 min-w-0">
                  <MapPin size={13} className="text-rose-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-800 line-clamp-1 min-w-0">
                    <strong className="font-medium text-gray-500">To:</strong> {booking.drop?.address || 'Drop Location'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 text-xs text-gray-500 mt-2.5 pt-2 border-t border-gray-200/60 flex-wrap">
              <span className="flex items-center gap-1">
                <Users size={12} className="text-gray-400" /> 2 guests
              </span>
              <span className="flex items-center gap-1 truncate">
                <Car size={12} className="text-gray-400" /> {booking.vehicle?.category || 'Special'}
              </span>
            </div>
          </div>

          {/* 3. Payment Details */}
          <div className="bg-gray-50/80 rounded-xl p-3.5 sm:p-4 border border-gray-100 flex flex-col justify-between min-w-0">
            <div>
              <div className="flex justify-between items-center mb-2.5">
                <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard size={13} className="text-blue-600 flex-shrink-0" />
                  Payment Details
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold shrink-0 ${
                  booking.paymentStatus === 'paid' 
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                }`}>
                  {booking.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                </span>
              </div>

              <div className="space-y-1.5 bg-white p-2.5 rounded-lg border border-gray-100">
                <div className="flex justify-between items-baseline gap-2">
                  <span className="text-xs text-gray-500 shrink-0">Total Amount:</span>
                  <span className="text-base font-bold text-gray-900 truncate">
                    {booking.fare?.currency || '₹'} {(booking.fare?.total || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-baseline gap-2 text-xs">
                  <span className="text-gray-500 shrink-0">Advance (30%):</span>
                  <span className="font-semibold text-emerald-700 truncate">
                    {booking.fare?.currency || '₹'} {Math.round((booking.fare?.total || 0) * 0.3).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs text-gray-500 mt-2.5 pt-2 border-t border-gray-200/60">
              <span className="truncate">Method: <strong className="font-medium text-gray-700">{booking.payment?.gateway ? booking.payment.gateway.toUpperCase() : 'Online'}</strong></span>
              <span className="text-emerald-600 font-medium shrink-0 ml-2">Verified</span>
            </div>
          </div>
        </div>

        {/* Below: Horizontally Aligned Booking Timeline */}
        <div className="bg-gray-50/80 rounded-xl p-3.5 sm:p-4 border border-gray-100">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
              <Clock size={13} className="text-blue-600 flex-shrink-0" />
              Booking Timeline
            </span>
            <span className="text-xs text-gray-500 font-medium">8 hours duration</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
            {[
              { label: '1. Requested', date: booking.timeline?.createdAt, status: 'completed' },
              { label: '2. Confirmed', date: booking.timeline?.confirmedAt, status: booking.timeline?.confirmedAt ? 'completed' : 'pending' },
              { label: '3. Vehicle Assigned', date: booking.timeline?.startedAt, status: booking.timeline?.startedAt ? 'completed' : 'pending' },
              { label: '4. Completed / Journey', date: booking.timeline?.completedAt || booking.timeline?.createdAt, status: booking.status === 'Completed' ? 'completed' : 'upcoming' }
            ].map((step, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-lg border text-center transition-colors min-w-0 ${
                  step.status === 'completed'
                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                    : step.status === 'upcoming'
                    ? 'bg-blue-50/80 border-blue-200 text-blue-900'
                    : 'bg-white border-gray-200 text-gray-500'
                }`}
              >
                <div className="text-[11px] font-semibold flex items-center justify-center gap-1 truncate">
                  {step.status === 'completed' && <CheckCircle size={12} className="text-emerald-600 flex-shrink-0" />}
                  <span className="truncate">{step.label}</span>
                </div>
                <div className="text-[11px] mt-0.5 opacity-80 truncate">
                  {step.date ? formatDate(step.date) : 'Pending'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notes & Actions Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-2">
          {/* Notes */}
          <div className="flex-1 bg-amber-50/80 border border-amber-200/80 rounded-lg px-3 py-2 flex items-center gap-2 text-xs text-amber-900 w-full sm:w-auto min-w-0">
            <span className="text-sm shrink-0">📝</span>
            <span className="font-medium text-amber-800 shrink-0">Notes:</span>
            <span className="truncate flex-1">{booking.vehicle?.description || 'Wedding ceremony - need decoration'}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
            <button className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-sm">
              <Eye size={14} />
              View Details
            </button>
            <button className="flex-1 sm:flex-none px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5">
              <MessageCircle size={14} />
              Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


export default BookingCard;