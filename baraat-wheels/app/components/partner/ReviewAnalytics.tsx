'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown, Star, Users, Calendar, Target, Zap } from 'lucide-react';

const analyticsData = {
  trends: [
    { month: 'Jan', rating: 4.7, reviews: 12, sentiment: 'positive' },
    { month: 'Feb', rating: 4.7, reviews: 15, sentiment: 'positive' },
    { month: 'Mar', rating: 4.8, reviews: 18, sentiment: 'positive' },
    { month: 'Apr', rating: 4.8, reviews: 22, sentiment: 'positive' },
    { month: 'May', rating: 4.8, reviews: 25, sentiment: 'positive' },
    { month: 'Jun', rating: 4.9, reviews: 28, sentiment: 'positive' },
    { month: 'Jul', rating: 4.9, reviews: 32, sentiment: 'positive' },
  ],
  benchmarks: {
    yourRating: 4.8,
    categoryAvg: 4.3,
    topPerformer: 4.9,
    responseRate: '98%',
    categoryResponseRate: '85%',
  },
  improvementAreas: [
    { area: 'Response Time', current: '4.2h', target: '2h', improvement: 'High' },
    { area: 'Review Volume', current: '142', target: '200', improvement: 'Medium' },
    { area: 'Negative Feedback', current: '2%', target: '1%', improvement: 'High' },
    { area: 'Review Length', current: '42 words', target: '60+ words', improvement: 'Low' },
  ],
};

export default function ReviewAnalytics() {
  const [timeRange, setTimeRange] = useState('6m');

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
            <Target className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Review Analytics</h2>
            <p className="text-gray-600">Performance trends and benchmarks</p>
          </div>
        </div>
        
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 bg-white border border-gray-300 rounded-xl"
        >
          <option value="3m">Last 3 months</option>
          <option value="6m">Last 6 months</option>
          <option value="1y">Last year</option>
          <option value="all">All time</option>
        </select>
      </div>

      {/* Trends Chart */}
      <div className="mb-8">
        <h3 className="font-bold text-gray-800 mb-4">Rating Trends</h3>
        <div className="h-48 flex items-end gap-2">
          {analyticsData.trends.map((month, index) => (
            <div key={index} className="flex-1 group relative">
              <div
                className={`rounded-t-lg transition-all duration-300 ${
                  month.sentiment === 'positive'
                    ? 'bg-gradient-to-t from-emerald-500 to-teal-600'
                    : 'bg-gradient-to-t from-amber-500 to-orange-500'
                }`}
                style={{ height: `${(month.rating / 5) * 100}%` }}
              />
              <div className="absolute bottom-0 left-0 right-0 transform translate-y-full mt-2">
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-700">{month.month}</div>
                  <div className="text-xs text-gray-500">{month.rating}</div>
                </div>
              </div>
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-gray-900 text-white p-2 rounded-lg text-sm whitespace-nowrap">
                <div className="font-bold">{month.rating}/5</div>
                <div className="text-xs text-gray-300">{month.reviews} reviews</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Benchmarks */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Your Rating</span>
            <Star className="fill-yellow-400 text-yellow-400" size={16} />
          </div>
          <div className="text-2xl font-bold text-gray-800">{analyticsData.benchmarks.yourRating}</div>
          <div className="text-sm text-gray-500">Category avg: {analyticsData.benchmarks.categoryAvg}</div>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Response Rate</span>
            <Users className="text-blue-500" size={16} />
          </div>
          <div className="text-2xl font-bold text-gray-800">{analyticsData.benchmarks.responseRate}</div>
          <div className="text-sm text-gray-500">Category: {analyticsData.benchmarks.categoryResponseRate}</div>
        </div>
      </div>

      {/* Improvement Areas */}
      <div>
        <h3 className="font-bold text-gray-800 mb-4">Improvement Areas</h3>
        <div className="space-y-4">
          {analyticsData.improvementAreas.map((area, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-800">{area.area}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  area.improvement === 'High' ? 'bg-red-100 text-red-700' :
                  area.improvement === 'Medium' ? 'bg-amber-100 text-amber-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {area.improvement} Priority
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Current: {area.current}</span>
                <span>Target: {area.target}</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    area.improvement === 'High' ? 'bg-gradient-to-r from-red-500 to-pink-600' :
                    area.improvement === 'Medium' ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
                    'bg-gradient-to-r from-blue-500 to-cyan-500'
                  }`}
                  style={{ 
                    width: area.area === 'Response Time' ? '60%' :
                           area.area === 'Review Volume' ? '71%' :
                           area.area === 'Negative Feedback' ? '50%' : '70%'
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Plan */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="text-amber-500" size={18} />
          <h3 className="font-bold text-gray-800">Recommended Actions</h3>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <span>Respond to all reviews within 24 hours</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Request reviews after each successful booking</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span>Address negative feedback immediately</span>
          </div>
        </div>
      </div>
    </div>
  );
}