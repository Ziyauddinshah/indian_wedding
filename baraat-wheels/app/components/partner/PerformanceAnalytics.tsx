'use client';

import { useState } from 'react';
import { PieChart, BarChart3, LineChart, Download, Filter } from 'lucide-react';

const analyticsData = {
  customerSegments: [
    { segment: 'Wedding', percentage: 45, value: '₹5.6L', color: 'from-purple-500 to-pink-500' },
    { segment: 'Corporate', percentage: 25, value: '₹3.1L', color: 'from-blue-500 to-cyan-500' },
    { segment: 'Tourism', percentage: 20, value: '₹2.5L', color: 'from-emerald-500 to-teal-600' },
    { segment: 'Events', percentage: 10, value: '₹1.3L', color: 'from-amber-500 to-orange-500' },
  ],
  bookingSources: [
    { source: 'Direct', percentage: 35, growth: '+12%', color: 'bg-blue-500' },
    { source: 'Platform', percentage: 40, growth: '+8%', color: 'bg-purple-500' },
    { source: 'Referrals', percentage: 15, growth: '+25%', color: 'bg-emerald-500' },
    { source: 'Repeat', percentage: 10, growth: '+18%', color: 'bg-amber-500' },
  ],
  timeAnalysis: [
    { time: '6 AM - 12 PM', bookings: 15, revenue: '₹1.8L' },
    { time: '12 PM - 6 PM', bookings: 35, revenue: '₹4.2L' },
    { time: '6 PM - 12 AM', bookings: 45, revenue: '₹5.4L' },
    { time: '12 AM - 6 AM', bookings: 5, revenue: '₹0.6L' },
  ],
};

export default function PerformanceAnalytics() {
  const [activeTab, setActiveTab] = useState<'segments' | 'sources' | 'time'>('segments');

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Advanced Analytics</h2>
          <p className="text-gray-600">Deep insights into your performance</p>
        </div>
        
        <div className="flex items-center gap-3 mt-2 md:mt-0">
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('segments')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                activeTab === 'segments' 
                  ? 'bg-white text-blue-700 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Segments
            </button>
            <button
              onClick={() => setActiveTab('sources')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                activeTab === 'sources' 
                  ? 'bg-white text-blue-700 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Sources
            </button>
            <button
              onClick={() => setActiveTab('time')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                activeTab === 'time' 
                  ? 'bg-white text-blue-700 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Time
            </button>
          </div>
          
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Download className="text-gray-600" size={20} />
          </button>
        </div>
      </div>

      {/* Analytics Content */}
      <div className="space-y-6">
        {activeTab === 'segments' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pie Chart Visualization */}
              <div className="relative h-64 flex items-center justify-center">
                <div className="relative w-48 h-48">
                  {analyticsData.customerSegments.map((segment, index) => {
                    const startAngle = analyticsData.customerSegments
                      .slice(0, index)
                      .reduce((sum, s) => sum + (s.percentage / 100) * 360, 0);
                    const angle = (segment.percentage / 100) * 360;
                    
                    return (
                      <div
                        key={index}
                        className="absolute inset-0"
                        style={{
                          clipPath: `conic-gradient(${segment.color} ${startAngle}deg, transparent ${startAngle + angle}deg)`,
                        }}
                      />
                    );
                  })}
                  <div className="absolute inset-0 m-auto w-24 h-24 bg-white rounded-full" />
                </div>
                
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <div className="text-2xl font-bold text-gray-800">100%</div>
                  <div className="text-sm text-gray-500">Total</div>
                </div>
              </div>

              {/* Segment Details */}
              <div className="space-y-4">
                {analyticsData.customerSegments.map((segment, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${segment.color}`} />
                        <span className="font-medium text-gray-800">{segment.segment}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-800">{segment.percentage}%</div>
                        <div className="text-sm text-gray-500">{segment.value}</div>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full bg-gradient-to-r ${segment.color}`}
                        style={{ width: `${segment.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Insights */}
            <div className="mt-6 p-4 bg-blue-50 rounded-xl">
              <h4 className="font-bold text-gray-800 mb-2">💡 Segment Insights</h4>
              <p className="text-sm text-gray-700">
                Wedding segment contributes 45% of revenue. Consider adding more wedding-specific packages
                and marketing during wedding season (Nov-Feb) to maximize earnings.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'sources' && (
          <div className="space-y-6">
            {analyticsData.bookingSources.map((source, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: source.color }} />
                    <span className="font-medium text-gray-800">{source.source}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-gray-800">{source.percentage}%</span>
                    <span className={`text-sm font-medium ${
                      source.growth.startsWith('+') ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {source.growth}
                    </span>
                  </div>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full"
                    style={{ 
                      width: `${source.percentage}%`,
                      backgroundColor: source.color 
                    }}
                  />
                </div>
              </div>
            ))}
            
            {/* Recommendations */}
            <div className="mt-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
              <h4 className="font-bold text-gray-800 mb-2">🚀 Growth Opportunities</h4>
              <p className="text-sm text-gray-700 mb-3">
                Referral source shows highest growth (+25%). Consider implementing a referral program
                to accelerate growth in this segment.
              </p>
              <button className="text-sm font-medium text-emerald-700 hover:text-emerald-800">
                Set up referral program →
              </button>
            </div>
          </div>
        )}

        {activeTab === 'time' && (
          <div className="space-y-6">
            {/* Time Distribution */}
            <div className="space-y-4">
              {analyticsData.timeAnalysis.map((timeSlot, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-800">{timeSlot.time}</span>
                    <div className="text-right">
                      <div className="font-bold text-gray-800">{timeSlot.bookings} bookings</div>
                      <div className="text-sm text-gray-500">{timeSlot.revenue} revenue</div>
                    </div>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                      style={{ width: `${(timeSlot.bookings / 100) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Peak Hours Analysis */}
            <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
              <h4 className="font-bold text-gray-800 mb-2">📊 Peak Hours Analysis</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Peak Booking Hours:</span>
                  <span className="font-bold text-gray-800">6 PM - 12 AM (45%)</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Highest Revenue Hours:</span>
                  <span className="font-bold text-gray-800">6 PM - 12 AM (₹5.4L)</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Optimization Potential:</span>
                  <span className="font-bold text-emerald-600">+30% in off-peak hours</span>
                </div>
              </div>
            </div>

            {/* Actionable Insight */}
            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
              <h4 className="font-bold text-gray-800 mb-2">🎯 Actionable Insight</h4>
              <p className="text-sm text-gray-700">
                Consider offering special discounts during off-peak hours (12 AM - 6 PM) to increase
                utilization and revenue. A 20% discount could increase bookings by 40% in this slot.
              </p>
              <button className="mt-2 text-sm font-medium text-purple-700 hover:text-purple-800">
                Create time-based pricing →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}