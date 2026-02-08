'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, Star, Target, Trophy, 
  Zap, Award, Users, Calendar, Clock, TrendingUp as Growth,
  BarChart3, PieChart, LineChart, Download, Filter,
  RefreshCw, Sparkles, AlertCircle, CheckCircle, XCircle,
  ChevronDown, ChevronUp, Eye, Share2, MoreVertical,
  IndianRupee, Car, MapPin, User, MessageSquare,
  ArrowUpRight, ArrowDownRight, Target as TargetIcon,
  Activity, TrendingUp as TrendingIcon, Crown
} from 'lucide-react';
import PerformanceChart from '@/app/components/partner/PerformanceChart';

const performanceData = {
  overview: {
    rating: 4.8,
    totalBookings: 289,
    successRate: 98,
    responseTime: '2.4 hours',
    customerSatisfaction: 96,
    growth: '+24%',
    rank: 'Top 15%',
  },
  metrics: [
    { label: 'Total Revenue', value: '₹12.5L', change: '+24%', trend: 'up', icon: <IndianRupee /> },
    { label: 'Bookings Growth', value: '35%', change: '+12%', trend: 'up', icon: <TrendingUp /> },
    { label: 'Avg. Rating', value: '4.8/5', change: '+0.2', trend: 'up', icon: <Star /> },
    { label: 'Repeat Clients', value: '42', change: '+8', trend: 'up', icon: <Users /> },
    { label: 'Response Rate', value: '98%', change: '+3%', trend: 'up', icon: <MessageSquare /> },
    { label: 'Cancellation Rate', value: '2%', change: '-1%', trend: 'down', icon: <XCircle /> },
  ],
  monthlyPerformance: [
    { month: 'Jan', revenue: 125000, bookings: 18, rating: 4.7, satisfaction: 92 },
    { month: 'Feb', revenue: 142000, bookings: 22, rating: 4.7, satisfaction: 93 },
    { month: 'Mar', revenue: 158000, bookings: 25, rating: 4.8, satisfaction: 94 },
    { month: 'Apr', revenue: 175000, bookings: 28, rating: 4.8, satisfaction: 95 },
    { month: 'May', revenue: 192500, bookings: 32, rating: 4.8, satisfaction: 95 },
    { month: 'Jun', revenue: 215000, bookings: 35, rating: 4.8, satisfaction: 96 },
    { month: 'Jul', revenue: 238000, bookings: 38, rating: 4.9, satisfaction: 96 },
    { month: 'Aug', revenue: 255000, bookings: 42, rating: 4.9, satisfaction: 96 },
    { month: 'Sep', revenue: 272000, bookings: 45, rating: 4.9, satisfaction: 97 },
    { month: 'Oct', revenue: 295000, bookings: 48, rating: 4.9, satisfaction: 97 },
    { month: 'Nov', revenue: 318000, bookings: 52, rating: 4.9, satisfaction: 97 },
    { month: 'Dec', revenue: 342500, bookings: 55, rating: 4.9, satisfaction: 98 },
  ],
  vehiclePerformance: [
    { name: 'Mercedes S-Class', bookings: 24, revenue: '₹6,00,000', rating: 4.9, utilization: '92%', color: 'from-purple-500 to-pink-500' },
    { name: 'Royal Elephant', bookings: 18, revenue: '₹8,10,000', rating: 4.8, utilization: '88%', color: 'from-emerald-500 to-teal-600' },
    { name: 'BMW 7 Series', bookings: 15, revenue: '₹3,30,000', rating: 4.8, utilization: '85%', color: 'from-blue-500 to-cyan-500' },
    { name: 'Traditional Ghodi', bookings: 32, revenue: '₹4,80,000', rating: 4.7, utilization: '78%', color: 'from-amber-500 to-orange-500' },
    { name: 'Audi A8 L', bookings: 12, revenue: '₹2,64,000', rating: 4.9, utilization: '82%', color: 'from-gray-700 to-gray-900' },
  ],
  achievements: [
    { id: 1, title: 'Fast Responder', description: 'Avg. response under 1 hour', icon: '⚡', unlocked: true, date: '2024-08-15' },
    { id: 2, title: '5-Star Performer', description: '30 consecutive 5-star reviews', icon: '⭐', unlocked: true, date: '2024-09-22' },
    { id: 3, title: 'Revenue Champion', description: '₹10L+ earnings milestone', icon: '💰', unlocked: true, date: '2024-10-05' },
    { id: 4, title: 'Loyalty Master', description: '50+ repeat customers', icon: '👑', unlocked: false, progress: 84 },
    { id: 5, title: 'Peak Performer', description: '100% booking success rate for 3 months', icon: '🏆', unlocked: false, progress: 67 },
    { id: 6, title: 'Platform Elite', description: 'Top 5% of all partners', icon: '🎯', unlocked: false, progress: 95 },
  ],
  comparison: {
    yourAvgRating: 4.8,
    platformAvgRating: 4.3,
    yourResponseTime: '2.4h',
    platformResponseTime: '8.2h',
    yourSuccessRate: '98%',
    platformSuccessRate: '92%',
    yourRepeatRate: '35%',
    platformRepeatRate: '22%',
  },
  recommendations: [
    { id: 1, title: 'Improve Response Time', description: 'Aim for under 1 hour response time', impact: 'High', icon: '⚡' },
    { id: 2, title: 'Add More Photos', description: 'Vehicles with 5+ photos get 2x more bookings', impact: 'Medium', icon: '📸' },
    { id: 3, title: 'Update Pricing', description: 'Competitive pricing can increase bookings by 30%', impact: 'High', icon: '💰' },
    { id: 4, title: 'Enable Instant Booking', description: 'Reduce booking friction for customers', impact: 'Medium', icon: '🚀' },
  ],
};

const timeRanges = [
  { id: 'week', label: 'This Week' },
  { id: 'month', label: 'This Month' },
  { id: 'quarter', label: 'This Quarter' },
  { id: 'year', label: 'This Year' },
  { id: 'all', label: 'All Time' },
];

const chartTypes = [
  { id: 'revenue', label: 'Revenue', icon: <IndianRupee size={16} /> },
  { id: 'bookings', label: 'Bookings', icon: <Calendar size={16} /> },
  { id: 'rating', label: 'Rating', icon: <Star size={16} /> },
  { id: 'satisfaction', label: 'Satisfaction', icon: <Users size={16} /> },
];

export default function PartnerPerformance() {
  const [timeRange, setTimeRange] = useState('year');
  const [activeChart, setActiveChart] = useState('revenue');
  const [expandedAchievement, setExpandedAchievement] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'detailed'>('overview');
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [showRecommendations, setShowRecommendations] = useState(true);

  // Calculate performance scores
  const calculatePerformanceScore = () => {
    const metrics = performanceData.metrics;
    const totalScore = metrics.reduce((sum, metric) => {
      const change = parseFloat(metric.change.replace('%', '').replace('+', ''));
      return sum + (metric.trend === 'up' ? change : -change);
    }, 0);
    return Math.min(100, Math.max(0, 50 + totalScore));
  };

  const performanceScore = calculatePerformanceScore();
  const percentileRank = Math.round((performanceScore / 100) * 100);

  // Get chart data based on selection
  const getChartData = () => {
    switch(activeChart) {
      case 'revenue':
        return performanceData.monthlyPerformance.map(m => m.revenue);
      case 'bookings':
        return performanceData.monthlyPerformance.map(m => m.bookings);
      case 'rating':
        return performanceData.monthlyPerformance.map(m => m.rating * 100); // Scale for visualization
      case 'satisfaction':
        return performanceData.monthlyPerformance.map(m => m.satisfaction);
      default:
        return performanceData.monthlyPerformance.map(m => m.revenue);
    }
  };

  const chartData = getChartData();
  const maxChartValue = Math.max(...chartData);
  const chartHeight = 200;

  // Get trend icon and color
  const getTrendIndicator = (trend: string, change: string) => {
    const isUp = trend === 'up';
    const color = isUp ? 'text-emerald-600' : 'text-red-600';
    const Icon = isUp ? ArrowUpRight : ArrowDownRight;
    
    return (
      <div className={`flex items-center gap-1 ${color}`}>
        <Icon size={16} />
        <span className="text-sm font-medium">{change}</span>
      </div>
    );
  };

  // Get impact badge
  const getImpactBadge = (impact: string) => {
    switch(impact.toLowerCase()) {
      case 'high':
        return { color: 'bg-red-100 text-red-700', icon: '🚨' };
      case 'medium':
        return { color: 'bg-amber-100 text-amber-700', icon: '⚠️' };
      case 'low':
        return { color: 'bg-blue-100 text-blue-700', icon: 'ℹ️' };
      default:
        return { color: 'bg-gray-100 text-gray-700', icon: '📝' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
              <Trophy className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Performance Dashboard
              </h1>
              <p className="text-gray-600 mt-2">Track your growth, achievements, and optimization opportunities</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="p-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50">
            <Download className="text-gray-600" size={20} />
          </button>
          <button className="p-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50">
            <Share2 className="text-gray-600" size={20} />
          </button>
          <button className="p-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50">
            <RefreshCw className="text-gray-600" size={20} />
          </button>
        </div>
      </div>

      {/* Performance Score Card */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="text-yellow-300" size={24} />
              <h2 className="text-2xl font-bold">Your Performance Score</h2>
            </div>
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="text-6xl font-bold">{performanceScore.toFixed(1)}</div>
                <div className="text-lg opacity-90">/100</div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="text-yellow-300" />
                  <span className="text-xl font-bold">{performanceData.overview.rank}</span>
                </div>
                <p className="opacity-90">You're performing better than {percentileRank}% of partners</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 min-w-64">
            <h3 className="font-bold text-lg mb-4">Key Highlights</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="opacity-90">Response Time</span>
                <span className="font-bold">{performanceData.overview.responseTime}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="opacity-90">Success Rate</span>
                <span className="font-bold">{performanceData.overview.successRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="opacity-90">Customer Satisfaction</span>
                <span className="font-bold">{performanceData.overview.customerSatisfaction}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {performanceData.metrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${
                metric.trend === 'up' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
              }`}>
                {metric.icon}
              </div>
              {getTrendIndicator(metric.trend, metric.change)}
            </div>
            <p className="text-3xl font-bold text-gray-800 mb-1">{metric.value}</p>
            <p className="text-gray-600">{metric.label}</p>
            
            {/* Progress Bar */}
            <div className="mt-4">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${
                    metric.trend === 'up' 
                      ? 'bg-gradient-to-r from-emerald-400 to-teal-500' 
                      : 'bg-gradient-to-r from-red-400 to-pink-500'
                  }`}
                  style={{ 
                    width: `${Math.min(100, 
                      (parseFloat(metric.value.replace(/[^0-9.]/g, '')) / 
                      (metric.label.includes('Revenue') ? 2000000 : 
                       metric.label.includes('Rating') ? 5 : 100)) * 100
                    )}%` 
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Performance Chart */}

          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Performance Trends</h2>
                <p className="text-gray-600">Monthly performance overview</p>
              </div>
              
              <div className="flex items-center gap-3 mt-2 md:mt-0">
                {/* Time Range */}
                <div className="flex bg-gray-100 p-1 rounded-xl">
                  {timeRanges.map((range) => (
                    <button
                      key={range.id}
                      onClick={() => setTimeRange(range.id)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                        timeRange === range.id
                          ? 'bg-white text-blue-700 shadow-sm'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
                
                {/* Chart Type */}
                <div className="flex bg-gray-100 p-1 rounded-xl">
                  {chartTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setActiveChart(type.id)}
                      className={`p-2 rounded-lg ${
                        activeChart === type.id
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                      title={type.label}
                    >
                      {type.icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="h-64 mt-8">
              <div className="flex h-full items-end gap-2">
                {chartData.map((value, index) => {
                  const height = (value / maxChartValue) * chartHeight;
                  const month = performanceData.monthlyPerformance[index].month;
                  
                  return (
                    <div key={index} className="flex-1 group relative">
                      <div
                        className="bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-lg transition-all duration-300 group-hover:from-blue-600 group-hover:to-purple-600"
                        style={{ height: `${height}px` }}
                      />
                      
                      {/* Tooltip */}
                      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-gray-900 text-white p-2 rounded-lg text-sm whitespace-nowrap transition-opacity z-10">
                        <div className="font-bold">
                          {activeChart === 'revenue' && `₹${value.toLocaleString()}`}
                          {activeChart === 'bookings' && `${value} bookings`}
                          {activeChart === 'rating' && `${(value / 100).toFixed(1)}/5`}
                          {activeChart === 'satisfaction' && `${value}%`}
                        </div>
                        <div className="text-xs text-gray-300">{month}</div>
                      </div>
                      
                      {/* Month Label */}
                      <div className="absolute bottom-0 left-0 right-0 transform translate-y-full mt-2">
                        <div className="text-center text-sm font-medium text-gray-700">
                          {month}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded"></div>
                  <span className="text-sm text-gray-600">
                    {activeChart === 'revenue' && 'Revenue (₹)'}
                    {activeChart === 'bookings' && 'Bookings Count'}
                    {activeChart === 'rating' && 'Rating (/5)'}
                    {activeChart === 'satisfaction' && 'Satisfaction (%)'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle Performance */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Vehicle Performance</h2>
                <p className="text-gray-600">Performance metrics by vehicle</p>
              </div>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200">
                Compare All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Vehicle</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Bookings</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Revenue</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Rating</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Utilization</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Performance</th>
                  </tr>
                </thead>
                <tbody>
                  {performanceData.vehiclePerformance.map((vehicle, index) => (
                    <tr 
                      key={index} 
                      className={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                        selectedVehicle === vehicle.name ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedVehicle(
                        selectedVehicle === vehicle.name ? null : vehicle.name
                      )}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${vehicle.color} flex items-center justify-center text-white`}>
                            {vehicle.name.includes('Mercedes') && '🏎️'}
                            {vehicle.name.includes('Royal') && '👑'}
                            {vehicle.name.includes('BMW') && '🚗'}
                            {vehicle.name.includes('Ghodi') && '🐎'}
                            {vehicle.name.includes('Audi') && '🚙'}
                          </div>
                          <span className="font-medium text-gray-800">{vehicle.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                          {vehicle.bookings}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-gray-800">{vehicle.revenue}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <Star className="fill-yellow-400 text-yellow-400" size={14} />
                          <span>{vehicle.rating}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full bg-gradient-to-r ${vehicle.color}`}
                              style={{ width: vehicle.utilization }}
                            />
                          </div>
                          <span className="text-sm font-medium">{vehicle.utilization}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                          vehicle.rating >= 4.8 
                            ? 'bg-emerald-100 text-emerald-700'
                            : vehicle.rating >= 4.5
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {vehicle.rating >= 4.8 ? 'Excellent' : 
                           vehicle.rating >= 4.5 ? 'Good' : 'Average'}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column - Achievements & Recommendations */}
        <div className="space-y-6">
          {/* Achievements */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg">
                <Award className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Achievements</h2>
                <p className="text-gray-600">Unlock badges and rewards</p>
              </div>
            </div>

            <div className="space-y-3">
              {performanceData.achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    achievement.unlocked
                      ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200'
                      : 'bg-gray-50 border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => setExpandedAchievement(
                    expandedAchievement === achievement.id ? null : achievement.id
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`text-xl ${achievement.unlocked ? 'opacity-100' : 'opacity-50'}`}>
                        {achievement.icon}
                      </div>
                      <div>
                        <h4 className={`font-bold ${achievement.unlocked ? 'text-gray-800' : 'text-gray-600'}`}>
                          {achievement.title}
                        </h4>
                        <p className="text-sm text-gray-500">{achievement.description}</p>
                      </div>
                    </div>
                    <div>
                      {achievement.unlocked ? (
                        <CheckCircle className="text-emerald-500" size={20} />
                      ) : (
                        <ChevronDown className={`text-gray-400 transition-transform ${
                          expandedAchievement === achievement.id ? 'rotate-180' : ''
                        }`} size={20} />
                      )}
                    </div>
                  </div>

                  {/* Progress for locked achievements */}
                  {!achievement.unlocked && achievement.progress && (
                    <div className={`mt-3 ${expandedAchievement === achievement.id ? 'block' : 'hidden'}`}>
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{achievement.progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                          style={{ width: `${achievement.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Complete {achievement.title.toLowerCase()} to unlock this achievement
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Performance Comparison */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                <BarChart3 className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Vs Platform Average</h2>
                <p className="text-gray-600">How you compare to others</p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { label: 'Average Rating', yours: performanceData.comparison.yourAvgRating, platform: performanceData.comparison.platformAvgRating },
                { label: 'Response Time', yours: performanceData.comparison.yourResponseTime, platform: performanceData.comparison.platformResponseTime },
                { label: 'Success Rate', yours: performanceData.comparison.yourSuccessRate, platform: performanceData.comparison.platformSuccessRate },
                { label: 'Repeat Rate', yours: performanceData.comparison.yourRepeatRate, platform: performanceData.comparison.platformRepeatRate },
              ].map((metric, index) => {
                const isBetter = metric.label === 'Response Time' 
                  ? metric.yours < metric.platform
                  : metric.yours > metric.platform;
                
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{metric.label}</span>
                      <span className={`font-medium ${isBetter ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {isBetter ? 'Better' : 'Needs Improvement'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="text-xs text-gray-500 mb-1">You</div>
                        <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                        <div className="text-sm font-medium text-gray-800 mt-1">{metric.yours}</div>
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-gray-500 mb-1">Platform Avg</div>
                        <div className="h-2 bg-gray-300 rounded-full" />
                        <div className="text-sm font-medium text-gray-800 mt-1">{metric.platform}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Performance Recommendations */}
          {showRecommendations && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Zap className="text-blue-600" size={24} />
                  <h2 className="text-xl font-bold text-gray-800">Optimization Tips</h2>
                </div>
                <button 
                  onClick={() => setShowRecommendations(false)}
                  className="p-1 hover:bg-white/50 rounded-lg"
                >
                  <XCircle className="text-gray-400" size={18} />
                </button>
              </div>

              <div className="space-y-3">
                {performanceData.recommendations.map((rec) => {
                  const impactBadge = getImpactBadge(rec.impact);
                  return (
                    <div key={rec.id} className="p-3 bg-white rounded-xl border border-gray-200">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xl">{rec.icon}</span>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-800">{rec.title}</h4>
                          <p className="text-sm text-gray-600">{rec.description}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${impactBadge.color}`}>
                          {impactBadge.icon} {rec.impact} Impact
                        </span>
                      </div>
                      <button className="w-full mt-2 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100">
                        Learn How →
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 pt-4 border-t border-blue-200">
                <button className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:shadow-md">
                  View All Recommendations
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Growth Insights */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Growth Insights</h2>
            <p className="text-gray-600">Actionable insights to boost your performance</p>
          </div>
          <button className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:shadow-md mt-2 md:mt-0">
            Generate Insights
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
            <div className="flex items-center gap-3 mb-3">
              <TargetIcon className="text-purple-600" size={20} />
              <h3 className="font-bold text-gray-800">Peak Hours</h3>
            </div>
            <p className="text-gray-600 text-sm mb-3">Your bookings peak between 6-9 PM</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Optimization:</span>
              <span className="font-medium text-emerald-600">+25% potential</span>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
            <div className="flex items-center gap-3 mb-3">
              <TrendingIcon className="text-blue-600" size={20} />
              <h3 className="font-bold text-gray-800">Seasonal Trends</h3>
            </div>
            <p className="text-gray-600 text-sm mb-3">December shows 45% higher demand</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Revenue Impact:</span>
              <span className="font-medium text-emerald-600">+₹3.5L</span>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
            <div className="flex items-center gap-3 mb-3">
              <Users className="text-emerald-600" size={20} />
              <h3 className="font-bold text-gray-800">Customer Retention</h3>
            </div>
            <p className="text-gray-600 text-sm mb-3">35% of customers book again within 3 months</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">LTV Increase:</span>
              <span className="font-medium text-emerald-600">+42% possible</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}