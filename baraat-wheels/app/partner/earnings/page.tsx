'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, IndianRupee, Wallet, 
  Download, Filter, Calendar, BarChart3, PieChart,
  CreditCard, Banknote, Clock, CheckCircle, AlertCircle,
  ChevronDown, ChevronUp, DollarSign, Sparkles, Target,
  RefreshCw, Share2, Eye, MoreVertical, ArrowUpRight,
  User, Car, CalendarDays, MapPin, Phone, Mail, X,
} from 'lucide-react';

const earningsData = {
  summary: {
    totalEarnings: '₹8,42,500',
    availableBalance: '₹1,85,420',
    pendingPayouts: '₹45,800',
    thisMonth: '₹2,15,000',
    lastMonth: '₹1,92,500',
    growth: '+12%',
    currency: 'INR',
  },
  monthlyData: [
    { month: 'Jan', earnings: 125000, bookings: 18, growth: 8 },
    { month: 'Feb', earnings: 142000, bookings: 22, growth: 12 },
    { month: 'Mar', earnings: 158000, bookings: 25, growth: 15 },
    { month: 'Apr', earnings: 175000, bookings: 28, growth: 18 },
    { month: 'May', earnings: 192500, bookings: 32, growth: 22 },
    { month: 'Jun', earnings: 215000, bookings: 35, growth: 25 },
    { month: 'Jul', earnings: 238000, bookings: 38, growth: 28 },
    { month: 'Aug', earnings: 255000, bookings: 42, growth: 32 },
    { month: 'Sep', earnings: 272000, bookings: 45, growth: 35 },
    { month: 'Oct', earnings: 295000, bookings: 48, growth: 38 },
    { month: 'Nov', earnings: 318000, bookings: 52, growth: 42 },
    { month: 'Dec', earnings: 342500, bookings: 55, growth: 45 },
  ],
  transactions: [
    {
      id: 1,
      type: 'booking',
      description: 'Mercedes S-Class Booking',
      amount: '+₹25,000',
      status: 'completed',
      date: 'Today, 2:00 PM',
      bookingId: 'BK-2024-001',
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
    },
    {
      id: 2,
      type: 'payout',
      description: 'Bank Transfer Payout',
      amount: '-₹50,000',
      status: 'completed',
      date: 'Yesterday',
      reference: 'TRX-789012',
      color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
    },
    {
      id: 3,
      type: 'booking',
      description: 'Royal Elephant Booking',
      amount: '+₹45,000',
      status: 'pending',
      date: '2 days ago',
      bookingId: 'BK-2024-002',
      color: 'bg-gradient-to-r from-emerald-500 to-teal-600',
    },
    {
      id: 4,
      type: 'refund',
      description: 'Cancellation Refund',
      amount: '-₹15,000',
      status: 'completed',
      date: '3 days ago',
      bookingId: 'BK-2024-004',
      color: 'bg-gradient-to-r from-red-500 to-pink-600',
    },
    {
      id: 5,
      type: 'booking',
      description: 'BMW 7 Series Booking',
      amount: '+₹22,500',
      status: 'completed',
      date: '1 week ago',
      bookingId: 'BK-2024-003',
      color: 'bg-gradient-to-r from-blue-500 to-purple-500',
    },
    {
      id: 6,
      type: 'commission',
      description: 'Platform Commission',
      amount: '-₹2,250',
      status: 'completed',
      date: '1 week ago',
      reference: 'COM-456789',
      color: 'bg-gradient-to-r from-amber-500 to-orange-500',
    },
  ],
  vehicleEarnings: [
    { vehicle: 'Mercedes S-Class', earnings: '₹2,45,000', percentage: 29, bookings: 24, color: 'from-purple-500 to-pink-500' },
    { vehicle: 'Royal Elephant', earnings: '₹1,98,000', percentage: 24, bookings: 18, color: 'from-emerald-500 to-teal-600' },
    { vehicle: 'BMW 7 Series', earnings: '₹1,65,000', percentage: 20, bookings: 15, color: 'from-blue-500 to-cyan-500' },
    { vehicle: 'Traditional Ghodi', earnings: '₹1,32,000', percentage: 16, bookings: 32, color: 'from-amber-500 to-orange-500' },
    { vehicle: 'Others', earnings: '₹1,02,500', percentage: 12, bookings: 28, color: 'from-gray-500 to-gray-700' },
  ],
  payoutMethods: [
    { id: 1, type: 'bank', name: 'HDFC Bank', account: 'XXXX-XXXX-1234', primary: true },
    { id: 2, type: 'upi', name: 'Google Pay', account: 'partner@okhdfcbank', primary: false },
    { id: 3, type: 'wallet', name: 'Paytm Wallet', account: '+91 9876543210', primary: false },
  ],
};

const timeRanges = [
  { id: 'week', label: 'This Week' },
  { id: 'month', label: 'This Month' },
  { id: 'quarter', label: 'This Quarter' },
  { id: 'year', label: 'This Year' },
  { id: 'all', label: 'All Time' },
];

const transactionTypes = [
  { id: 'all', label: 'All Transactions' },
  { id: 'booking', label: 'Bookings' },
  { id: 'payout', label: 'Payouts' },
  { id: 'refund', label: 'Refunds' },
  { id: 'commission', label: 'Commission' },
];

export default function PartnerEarnings() {
  const [timeRange, setTimeRange] = useState('month');
  const [selectedType, setSelectedType] = useState('all');
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [selectedPayoutMethod, setSelectedPayoutMethod] = useState(1);
  const [expandedTransaction, setExpandedTransaction] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');
  const [showTransactionDetails, setShowTransactionDetails] = useState<number | null>(null);

  // Filter transactions based on selected type
  const filteredTransactions = selectedType === 'all' 
    ? earningsData.transactions 
    : earningsData.transactions.filter(t => t.type === selectedType);

  // Calculate statistics
  const totalBookings = earningsData.transactions
    .filter(t => t.type === 'booking' && t.status === 'completed')
    .length;

  const avgBookingValue = earningsData.transactions
    .filter(t => t.type === 'booking' && t.status === 'completed')
    .reduce((sum, t) => sum + parseInt(t.amount.replace(/[^0-9]/g, '')), 0) / totalBookings || 0;

  // Handle payout request
  const handlePayoutRequest = () => {
    if (!payoutAmount || parseFloat(payoutAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    
    if (parseFloat(payoutAmount) > parseFloat(earningsData.summary.availableBalance.replace(/[^0-9]/g, '')) / 100) {
      alert('Amount exceeds available balance');
      return;
    }
    
    alert(`Payout request of ₹${payoutAmount} submitted successfully!`);
    setShowPayoutModal(false);
    setPayoutAmount('');
  };

  // Get transaction icon
  const getTransactionIcon = (type: string) => {
    switch(type) {
      case 'booking': return '💰';
      case 'payout': return '🏦';
      case 'refund': return '↩️';
      case 'commission': return '📊';
      default: return '💳';
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'completed':
        return { label: 'Completed', color: 'bg-emerald-100 text-emerald-700', icon: <CheckCircle size={14} /> };
      case 'pending':
        return { label: 'Pending', color: 'bg-amber-100 text-amber-700', icon: <Clock size={14} /> };
      case 'failed':
        return { label: 'Failed', color: 'bg-red-100 text-red-700', icon: <AlertCircle size={14} /> };
      default:
        return { label: 'Unknown', color: 'bg-gray-100 text-gray-700', icon: <AlertCircle size={14} /> };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Earnings & Payouts
          </h1>
          <p className="text-gray-600 mt-2">Track your earnings, manage payouts, and view detailed reports</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="p-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50">
            <Share2 className="text-gray-600" size={20} />
          </button>
          <button className="p-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50">
            <Download className="text-gray-600" size={20} />
          </button>
          <button className="p-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50">
            <RefreshCw className="text-gray-600" size={20} />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Earnings */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Earnings</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{earningsData.summary.totalEarnings}</p>
              <div className="flex items-center gap-2 mt-2">
                <TrendingUp className="text-emerald-500" size={16} />
                <span className="text-sm text-emerald-600">{earningsData.summary.growth} growth</span>
              </div>
            </div>
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white">
              <IndianRupee size={24} />
            </div>
          </div>
        </div>

        {/* Available Balance */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Available Balance</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{earningsData.summary.availableBalance}</p>
              <div className="text-sm text-gray-500 mt-2">Ready for payout</div>
            </div>
            <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl text-white">
              <Wallet size={24} />
            </div>
          </div>
        </div>

        {/* This Month */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{earningsData.summary.thisMonth}</p>
              <div className="flex items-center gap-2 mt-2">
                <TrendingUp className="text-emerald-500" size={16} />
                <span className="text-sm text-emerald-600">vs ₹{earningsData.summary.lastMonth} last month</span>
              </div>
            </div>
            <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl text-white">
              <Calendar size={24} />
            </div>
          </div>
        </div>

        {/* Pending Payouts */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Payouts</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{earningsData.summary.pendingPayouts}</p>
              <div className="text-sm text-amber-600 mt-2">3 pending transactions</div>
            </div>
            <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl text-white">
              <Clock size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Chart & Stats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Earnings Chart */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Earnings Overview</h2>
                <p className="text-gray-600">Monthly earnings trend</p>
              </div>
              <div className="flex items-center gap-3 mt-2 md:mt-0">
                <div className="flex bg-gray-100 p-1 rounded-xl">
                  {timeRanges.map((range) => (
                    <button
                      key={range.id}
                      onClick={() => setTimeRange(range.id)}
                      className={`px-4 py-2 rounded-lg font-medium ${
                        timeRange === range.id
                          ? 'bg-white text-blue-700 shadow-sm'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <MoreVertical className="text-gray-600" size={20} />
                </button>
              </div>
            </div>

            {/* Chart */}
            <div className="h-64">
              <div className="flex h-full items-end gap-2">
                {earningsData.monthlyData.map((month, index) => {
                  const height = (month.earnings / 350000) * 100;
                  return (
                    <div key={index} className="flex-1 group relative">
                      <div
                        className="bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-lg transition-all duration-300 group-hover:opacity-90"
                        style={{ height: `${height}%` }}
                      />
                      <div className="absolute bottom-0 left-0 right-0 transform translate-y-full mt-2">
                        <div className="text-center">
                          <div className="text-sm font-medium text-gray-700">{month.month}</div>
                          <div className="text-xs text-gray-500">₹{month.earnings.toLocaleString()}</div>
                        </div>
                      </div>
                      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-gray-900 text-white p-2 rounded-lg text-sm whitespace-nowrap transition-opacity">
                        <div className="font-bold">₹{month.earnings.toLocaleString()}</div>
                        <div className="text-xs">{month.bookings} bookings</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Stats below chart */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-100">
              <div className="text-center">
                <div className="text-sm text-gray-600">Avg. Booking Value</div>
                <div className="text-xl font-bold text-gray-800 mt-1">₹{avgBookingValue.toLocaleString()}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600">Total Bookings</div>
                <div className="text-xl font-bold text-gray-800 mt-1">{totalBookings}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600">Success Rate</div>
                <div className="text-xl font-bold text-gray-800 mt-1">98%</div>
              </div>
            </div>
          </div>

          {/* Vehicle Earnings Distribution */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Vehicle Earnings</h2>
                <p className="text-gray-600">Earnings distribution by vehicle</p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setViewMode('chart')}
                  className={`p-2 rounded-lg ${viewMode === 'chart' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
                >
                  <PieChart size={20} />
                </button>
                <button 
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-lg ${viewMode === 'table' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
                >
                  <BarChart3 size={20} />
                </button>
              </div>
            </div>

            {viewMode === 'chart' ? (
              <div className="space-y-4">
                {earningsData.vehicleEarnings.map((vehicle, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${vehicle.color} flex items-center justify-center text-white`}>
                          {vehicle.vehicle.includes('Mercedes') && '🏎️'}
                          {vehicle.vehicle.includes('Royal') && '👑'}
                          {vehicle.vehicle.includes('BMW') && '🚗'}
                          {vehicle.vehicle.includes('Ghodi') && '🐎'}
                          {vehicle.vehicle.includes('Others') && '📊'}
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">{vehicle.vehicle}</div>
                          <div className="text-sm text-gray-500">{vehicle.bookings} bookings</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-800">{vehicle.earnings}</div>
                        <div className="text-sm text-gray-500">{vehicle.percentage}%</div>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full bg-gradient-to-r ${vehicle.color}`}
                        style={{ width: `${vehicle.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Vehicle</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Earnings</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Percentage</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Bookings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {earningsData.vehicleEarnings.map((vehicle, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${vehicle.color}`} />
                            <span className="font-medium text-gray-800">{vehicle.vehicle}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-bold text-gray-800">{vehicle.earnings}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full bg-gradient-to-r ${vehicle.color}`}
                                style={{ width: `${vehicle.percentage}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-700">{vehicle.percentage}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                            {vehicle.bookings}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Quick Actions & Payouts */}
        <div className="space-y-6">
          {/* Request Payout */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg">
                <Wallet className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Request Payout</h2>
                <p className="text-gray-600">Withdraw your earnings</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Balance
                </label>
                <div className="text-3xl font-bold text-gray-800">{earningsData.summary.availableBalance}</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payout Method
                </label>
                <div className="space-y-2">
                  {earningsData.payoutMethods.map((method) => (
                    <div
                      key={method.id}
                      onClick={() => setSelectedPayoutMethod(method.id)}
                      className={`p-3 border rounded-xl cursor-pointer transition-all ${
                        selectedPayoutMethod === method.id
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-300 hover:border-emerald-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {method.type === 'bank' && <Banknote className="text-blue-500" size={20} />}
                          {method.type === 'upi' && <CreditCard className="text-purple-500" size={20} />}
                          {method.type === 'wallet' && <Wallet className="text-green-500" size={20} />}
                          <div>
                            <div className="font-medium text-gray-800">{method.name}</div>
                            <div className="text-sm text-gray-500">{method.account}</div>
                          </div>
                        </div>
                        {method.primary && (
                          <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                            Primary
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setShowPayoutModal(true)}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold py-3 rounded-xl hover:shadow-lg transition-all"
              >
                Request Payout
              </button>

              <div className="text-sm text-gray-600">
                <p>💰 Next payout date: 30th of month</p>
                <p>⏱️ Processing time: 24-48 hours</p>
              </div>
            </div>
          </div>

          {/* Transaction Filters */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Transaction Filters</h2>
            <div className="space-y-2">
              {transactionTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all ${
                    selectedType === type.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h3 className="font-bold text-gray-800 mb-3">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Transactions</span>
                  <span className="font-bold text-gray-800">142</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">This Month</span>
                  <span className="font-bold text-emerald-600">+₹2.15L</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Avg. Transaction</span>
                  <span className="font-bold text-gray-800">₹18,500</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payout History */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Payouts</h2>
            <div className="space-y-3">
              {earningsData.transactions
                .filter(t => t.type === 'payout')
                .slice(0, 3)
                .map((transaction) => (
                  <div key={transaction.id} className="p-3 border border-gray-200 rounded-xl hover:border-blue-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${transaction.color} text-white`}>
                          🏦
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{transaction.description}</p>
                          <p className="text-sm text-gray-500">{transaction.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-800">{transaction.amount}</p>
                        <span className="text-sm text-emerald-600">Completed</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            <button className="w-full mt-4 py-2.5 text-blue-600 hover:text-blue-700 font-medium">
              View All Payouts →
            </button>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Recent Transactions</h2>
              <p className="text-gray-600">All your earnings and payout transactions</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200">
                <Filter size={16} className="inline mr-2" />
                Filter
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200">
                <Download size={16} className="inline mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Transaction</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Amount</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Status</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Date</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => {
                const statusBadge = getStatusBadge(transaction.status);
                return (
                  <tr 
                    key={transaction.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setExpandedTransaction(
                      expandedTransaction === transaction.id ? null : transaction.id
                    )}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg ${transaction.color} flex items-center justify-center text-white text-lg`}>
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{transaction.description}</p>
                          <p className="text-sm text-gray-500">
                            {transaction.bookingId || transaction.reference || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`font-bold ${
                        transaction.amount.startsWith('+') ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                        {transaction.amount}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${statusBadge.color}`}>
                        {statusBadge.icon}
                        {statusBadge.label}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{transaction.date}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg">
                          <Eye size={16} />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg">
                          <MoreVertical size={16} />
                        </button>
                        <ChevronDown 
                          className={`text-gray-400 transition-transform ${
                            expandedTransaction === transaction.id ? 'rotate-180' : ''
                          }`}
                          size={16}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payout Modal */}
      {showPayoutModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black/50" onClick={() => setShowPayoutModal(false)} />
            
            <div className="relative bg-white rounded-2xl w-full max-w-md">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-800">Request Payout</h3>
                  <button 
                    onClick={() => setShowPayoutModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount to Withdraw (₹)
                    </label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="number"
                        value={payoutAmount}
                        onChange={(e) => setPayoutAmount(e.target.value)}
                        placeholder="Enter amount"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Available: {earningsData.summary.availableBalance}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Selected Method
                    </label>
                    <div className="p-3 border border-gray-300 rounded-xl bg-gray-50">
                      {earningsData.payoutMethods.find(m => m.id === selectedPayoutMethod)?.name} • 
                      {earningsData.payoutMethods.find(m => m.id === selectedPayoutMethod)?.account}
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-xl">
                    <h4 className="font-medium text-blue-800 mb-2">Important Notes</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Minimum withdrawal: ₹1,000</li>
                      <li>• Processing time: 24-48 hours</li>
                      <li>• Tax deductions may apply</li>
                      <li>• Maximum 2 payouts per week</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200">
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowPayoutModal(false)}
                    className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePayoutRequest}
                    className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:shadow-md font-medium"
                  >
                    Confirm Payout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}