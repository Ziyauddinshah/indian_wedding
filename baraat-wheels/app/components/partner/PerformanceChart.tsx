'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, Users, 
  Calendar, Car, ArrowUpRight, BarChart3,
  Download, Filter 
} from 'lucide-react';

const timeRanges = [
  { id: 'week', label: 'This Week' },
  { id: 'month', label: 'This Month' },
  { id: 'quarter', label: 'This Quarter' },
  { id: 'year', label: 'This Year' },
];

const monthlyData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  revenue: [45000, 52000, 48000, 61000, 72000, 85000, 92000, 88000, 95000, 102000, 115000, 125000],
  bookings: [12, 15, 14, 18, 22, 25, 28, 26, 30, 32, 35, 38],
  expenses: [8000, 9500, 8500, 11000, 12500, 14500, 15500, 14200, 16500, 17500, 19000, 21000],
};

const vehicleTypeData = [
  { type: 'Luxury', value: 65, color: 'from-purple-500 to-pink-500', icon: '🏎️' },
  { type: 'Ghodi', value: 25, color: 'from-amber-500 to-orange-500', icon: '🐎' },
  { type: 'Royal', value: 10, color: 'from-emerald-500 to-teal-600', icon: '👑' },
];

const metrics = [
  { 
    label: 'Total Revenue', 
    value: '₹12.5L', 
    change: '+24%', 
    icon: <DollarSign />, 
    color: 'from-emerald-500 to-teal-600',
    trend: 'up' 
  },
  { 
    label: 'Total Bookings', 
    value: '289', 
    change: '+18%', 
    icon: <Users />, 
    color: 'from-blue-500 to-cyan-500',
    trend: 'up' 
  },
  { 
    label: 'Vehicle Utilization', 
    value: '82%', 
    change: '+12%', 
    icon: <Car />, 
    color: 'from-purple-500 to-pink-500',
    trend: 'up' 
  },
  { 
    label: 'Avg. Rating', 
    value: '4.8', 
    change: '+0.2', 
    icon: <TrendingUp />, 
    color: 'from-amber-500 to-orange-500',
    trend: 'up' 
  },
];

export default function PerformanceChart() {
  const [timeRange, setTimeRange] = useState('year');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [chartData, setChartData] = useState(monthlyData);

  const maxValue = Math.max(...chartData.revenue);
  const chartHeight = 200;

  const getBarHeight = (value: number) => {
    return (value / maxValue) * chartHeight;
  };

  const getCurrentData = () => {
    if (timeRange === 'week') {
      return {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        revenue: [15000, 18000, 22000, 25000, 28000, 32000, 35000],
        bookings: [3, 4, 5, 6, 7, 8, 9],
      };
    }
    return chartData;
  };

  const currentData = getCurrentData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
            <BarChart3 className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Performance Analytics</h2>
            <p className="text-gray-600">Track your growth and insights</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Time Range Selector */}
          <div className="flex bg-gray-100 p-1 rounded-xl">
            {timeRanges.map((range) => (
              <button
                key={range.id}
                onClick={() => setTimeRange(range.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  timeRange === range.id
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>

          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Download className="text-gray-600" size={20} />
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <div 
            key={index}
            className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg bg-gradient-to-r ${metric.color} text-white`}>
                {metric.icon}
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${
                metric.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {metric.trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {metric.change}
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-800">{metric.value}</p>
            <p className="text-sm text-gray-600">{metric.label}</p>
          </div>
        ))}
      </div>

      {/* Chart Container */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-800">Revenue vs Bookings</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Revenue (₹)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Bookings</span>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="relative h-64">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-sm text-gray-500">
            <span>₹{maxValue.toLocaleString()}</span>
            <span>₹{(maxValue * 0.75).toLocaleString()}</span>
            <span>₹{(maxValue * 0.5).toLocaleString()}</span>
            <span>₹{(maxValue * 0.25).toLocaleString()}</span>
            <span>₹0</span>
          </div>

          {/* Chart Bars */}
          <div className="ml-12 h-full flex items-end justify-between relative">
            {currentData.revenue.map((revenue, index) => {
              const height = getBarHeight(revenue);
              const bookingHeight = getBarHeight(currentData.bookings[index] * 2000);
              
              return (
                <div 
                  key={index}
                  className="flex flex-col items-center justify-end w-8 sm:w-12 relative group"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Bookings Bar */}
                  <div 
                    className="w-4 sm:w-6 bg-gradient-to-t from-purple-500 to-pink-500 rounded-t-lg transition-all duration-300"
                    style={{ height: `${bookingHeight}px` }}
                  ></div>
                  
                  {/* Revenue Bar */}
                  <div 
                    className="w-full bg-gradient-to-t from-blue-500 to-cyan-500 rounded-t-lg transition-all duration-300 group-hover:opacity-90"
                    style={{ height: `${height}px` }}
                  ></div>
                  
                  {/* Hover Tooltip */}
                  {hoveredIndex === index && (
                    <div className="absolute -top-24 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white p-3 rounded-xl shadow-2xl z-10 min-w-48">
                      <div className="text-sm font-bold mb-2">{currentData.labels[index]}</div>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-blue-300">Revenue:</span>
                          <span className="font-bold">₹{revenue.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-purple-300">Bookings:</span>
                          <span className="font-bold">{currentData.bookings[index]}</span>
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
                    </div>
                  )}
                  
                  {/* X-axis label */}
                  <div className="mt-2 text-sm text-gray-600 font-medium">
                    {currentData.labels[index]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Vehicle Type Distribution */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Vehicle Type Distribution</h3>
          <div className="space-y-4">
            {vehicleTypeData.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium text-gray-700">{item.type}</span>
                  </div>
                  <span className="font-bold text-gray-800">{item.value}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-1000`}
                    style={{ width: `${item.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Insights */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
          <div className="flex items-center gap-3 mb-3">
            <ArrowUpRight className="text-blue-600" size={20} />
            <h4 className="font-bold text-gray-800">Key Insights</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span>Luxury vehicles generate 65% of revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Weekend bookings are 40% higher</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>December is your peak month (+35%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              <span>Add more royal vehicles for growth</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}