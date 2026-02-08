'use client';

import { X, User, Car, Calendar, MapPin, IndianRupee, FileText, CreditCard, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface TransactionDetailsModalProps {
  transaction: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function TransactionDetailsModal({ transaction, isOpen, onClose }: TransactionDetailsModalProps) {
  if (!isOpen || !transaction) return null;

  const getTransactionTypeInfo = (type: string) => {
    switch(type) {
      case 'booking':
        return { 
          label: 'Booking Payment', 
          icon: '💰',
          color: 'from-purple-500 to-pink-500'
        };
      case 'payout':
        return { 
          label: 'Payout', 
          icon: '🏦',
          color: 'from-blue-500 to-cyan-500'
        };
      case 'refund':
        return { 
          label: 'Refund', 
          icon: '↩️',
          color: 'from-red-500 to-pink-600'
        };
      case 'commission':
        return { 
          label: 'Commission', 
          icon: '📊',
          color: 'from-amber-500 to-orange-500'
        };
      default:
        return { 
          label: 'Transaction', 
          icon: '💳',
          color: 'from-gray-500 to-gray-700'
        };
    }
  };

  const typeInfo = getTransactionTypeInfo(transaction.type);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        
        <div className="relative bg-white rounded-2xl w-full max-w-lg">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${typeInfo.color} text-white text-xl`}>
                  {typeInfo.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{typeInfo.label}</h3>
                  <p className="text-gray-600">Transaction details</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Transaction Summary */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Transaction Amount</p>
                  <p className={`text-2xl font-bold ${
                    transaction.amount.startsWith('+') ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {transaction.amount}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Status</p>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    transaction.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                    transaction.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-gray-800 mb-3">Transaction Details</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Description</span>
                    <span className="font-medium text-gray-800">{transaction.description}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date & Time</span>
                    <span className="font-medium text-gray-800">{transaction.date}</span>
                  </div>
                  {transaction.bookingId && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Booking ID</span>
                      <span className="font-medium text-gray-800">{transaction.bookingId}</span>
                    </div>
                  )}
                  {transaction.reference && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reference ID</span>
                      <span className="font-medium text-gray-800">{transaction.reference}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Booking Details (if applicable) */}
              {transaction.type === 'booking' && (
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-bold text-gray-800 mb-3">Booking Details</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-600">
                      <User size={16} />
                      <span>Customer: Aarav Sharma</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Car size={16} />
                      <span>Vehicle: Mercedes S-Class</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar size={16} />
                      <span>Date: 25 Dec 2024, 6:00 PM</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin size={16} />
                      <span>Pickup: Taj Hotel, Mumbai</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Payout Details (if applicable) */}
              {transaction.type === 'payout' && (
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-bold text-gray-800 mb-3">Payout Details</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-600">
                      <CreditCard size={16} />
                      <span>Method: Bank Transfer</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <IndianRupee size={16} />
                      <span>Bank: HDFC Bank</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FileText size={16} />
                      <span>Account: XXXX-XXXX-1234</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Timeline */}
            <div className="pt-4 border-t border-gray-200">
              <h4 className="font-bold text-gray-800 mb-3">Transaction Timeline</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-emerald-500" size={16} />
                  <div>
                    <p className="text-sm font-medium text-gray-800">Transaction Initiated</p>
                    <p className="text-xs text-gray-500">Today, 2:00 PM</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-emerald-500" size={16} />
                  <div>
                    <p className="text-sm font-medium text-gray-800">Payment Processed</p>
                    <p className="text-xs text-gray-500">Today, 2:05 PM</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {transaction.status === 'completed' ? (
                    <CheckCircle className="text-emerald-500" size={16} />
                  ) : (
                    <Clock className="text-amber-500" size={16} />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {transaction.status === 'completed' ? 'Transaction Completed' : 'Processing'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {transaction.status === 'completed' ? 'Today, 2:10 PM' : 'In progress'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200">
            <div className="flex gap-3">
              <button className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-medium">
                Download Receipt
              </button>
              <button className="flex-1 py-2.5 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 font-medium">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}