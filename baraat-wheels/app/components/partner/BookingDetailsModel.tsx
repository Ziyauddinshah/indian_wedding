'use client';

import { useState } from 'react';
import { 
  X, Phone, Mail, MapPin, Calendar, Clock, 
  Users, Car, IndianRupee, CheckCircle, AlertCircle,
  Download, MessageCircle, Printer, Share2, Edit,
  CheckSquare, XCircle, User, FileText
} from 'lucide-react';

interface BookingDetailsModalProps {
  booking: any;
  isOpen: boolean;
  onClose: () => void;
  onAction: (action: string) => void;
}

export default function BookingDetailsModal({ booking, isOpen, onClose, onAction }: BookingDetailsModalProps) {
  const [activeTab, setActiveTab] = useState('details');

  if (!isOpen || !booking) return null;

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'confirmed': return 'text-emerald-600 bg-emerald-50';
      case 'pending': return 'text-amber-600 bg-amber-50';
      case 'ongoing': return 'text-blue-600 bg-blue-50';
      case 'completed': return 'text-purple-600 bg-purple-50';
      case 'cancelled': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        {/* Overlay */}
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        
        {/* Modal */}
        <div className="relative bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-white">
                  {booking.vehicle.type === 'luxury' && '🏎️'}
                  {booking.vehicle.type === 'ghodi' && '🐎'}
                  {booking.vehicle.type === 'royal' && '👑'}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{booking.bookingId}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status.toUpperCase()}
                    </span>
                    <span className="text-gray-500">• Created on {booking.createdAt}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Printer size={20} />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Share2 size={20} />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg" onClick={onClose}>
                  <X size={20} />
                </button>
              </div>
            </div>
            
            {/* Tabs */}
            <div className="flex gap-4 mt-6">
              {['details', 'timeline', 'payment', 'documents'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    activeTab === tab
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            {activeTab === 'details' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Customer Details */}
                <div className="lg:col-span-1">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <User size={20} />
                      Customer Information
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                          {booking.customer.avatar}
                        </div>
                        <div>
                          <p className="font-semibold text-lg text-gray-800">{booking.customer.name}</p>
                          <div className="space-y-1 mt-2">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone size={14} />
                              <span>{booking.customer.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Mail size={14} />
                              <span>{booking.customer.email}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-gray-200">
                        <button className="w-full py-2.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium flex items-center justify-center gap-2">
                          <MessageCircle size={16} />
                          Send Message
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="lg:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Car size={20} />
                        Vehicle Details
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-600">Vehicle Name</p>
                          <p className="font-semibold text-gray-800">{booking.vehicle.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Category</p>
                          <p className="font-semibold text-gray-800">{booking.vehicle.category}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Calendar size={20} />
                        Schedule
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Date</span>
                          <span className="font-semibold">{booking.details.date}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Time</span>
                          <span className="font-semibold">{booking.details.time}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Duration</span>
                          <span className="font-semibold">{booking.details.duration}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Guests</span>
                          <span className="font-semibold">{booking.details.guests} people</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6 md:col-span-2">
                      <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <MapPin size={20} />
                        Location Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm text-gray-600 mb-2">Pickup Location</p>
                          <p className="font-semibold text-gray-800">{booking.details.pickup}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-2">Dropoff Location</p>
                          <p className="font-semibold text-gray-800">{booking.details.dropoff}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="mt-6">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <FileText size={20} />
                      Special Instructions & Notes
                    </h3>
                    <div className="bg-gray-50 rounded-xl p-6">
                      <p className="text-gray-700">{booking.notes}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Tab */}
            {activeTab === 'payment' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200">
                    <h3 className="font-bold text-gray-800 mb-4">Payment Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Amount</span>
                        <span className="text-2xl font-bold text-gray-800">{booking.payment.amount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Advance Paid</span>
                        <span className="font-semibold text-emerald-600">{booking.payment.advance}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Balance Due</span>
                        <span className="font-semibold text-amber-600">
                          {booking.payment.status === 'paid' ? '₹0' : '₹' + (parseInt(booking.payment.amount.replace('₹', '').replace(',', '')) - parseInt(booking.payment.advance.replace('₹', '').replace(',', ''))).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Method</span>
                        <span className="font-medium">{booking.payment.method}</span>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2 bg-gray-50 rounded-xl p-6">
                    <h3 className="font-bold text-gray-800 mb-4">Payment History</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-emerald-100 rounded-lg">
                            <CheckCircle className="text-emerald-600" size={20} />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">Advance Payment</p>
                            <p className="text-sm text-gray-600">Paid on {booking.createdAt}</p>
                          </div>
                        </div>
                        <span className="font-bold text-emerald-600">{booking.payment.advance}</span>
                      </div>
                      
                      {booking.payment.status === 'paid' && (
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-100 rounded-lg">
                              <CheckCircle className="text-emerald-600" size={20} />
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">Balance Payment</p>
                              <p className="text-sm text-gray-600">Paid on {booking.details.date}</p>
                            </div>
                          </div>
                          <span className="font-bold text-emerald-600">
                            ₹{parseInt(booking.payment.amount.replace('₹', '').replace(',', '')) - parseInt(booking.payment.advance.replace('₹', '').replace(',', ''))}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Payment Actions */}
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <h3 className="font-bold text-gray-800 mb-4">Payment Actions</h3>
                  <div className="flex flex-wrap gap-3">
                    {booking.payment.status === 'pending' && (
                      <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:shadow-md font-medium">
                        Mark as Paid
                      </button>
                    )}
                    <button className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium">
                      Send Payment Reminder
                    </button>
                    <button className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium">
                      <Download className="inline mr-2" size={16} />
                      Download Invoice
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
            <div className="flex flex-wrap gap-3 justify-between">
              <div className="flex gap-3">
                {booking.status === 'pending' && (
                  <>
                    <button 
                      onClick={() => onAction('confirm')}
                      className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:shadow-md font-medium flex items-center gap-2"
                    >
                      <CheckSquare size={18} />
                      Confirm Booking
                    </button>
                    <button 
                      onClick={() => onAction('reject')}
                      className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:shadow-md font-medium flex items-center gap-2"
                    >
                      <XCircle size={18} />
                      Reject Booking
                    </button>
                  </>
                )}
                <button className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium flex items-center gap-2">
                  <Edit size={18} />
                  Edit Booking
                </button>
              </div>
              
              <div className="flex gap-3">
                <button className="px-6 py-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 font-medium">
                  Save Changes
                </button>
                <button 
                  onClick={onClose}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}