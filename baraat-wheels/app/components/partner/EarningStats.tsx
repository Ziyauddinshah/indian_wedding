'use client';

import { TrendingUp, TrendingDown, Sparkles, Target } from 'lucide-react';

const milestones = [
  { amount: '₹1,00,000', label: 'First Lakh', achieved: true, date: 'Mar 15, 2024' },
  { amount: '₹5,00,000', label: 'Five Lakhs', achieved: true, date: 'Aug 30, 2024' },
  { amount: '₹10,00,000', label: 'Ten Lakhs', achieved: false, progress: 84 },
  { amount: '₹25,00,000', label: 'Twenty Five Lakhs', achieved: false, progress: 34 },
];

export default function EarningsStats() {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
          <Target className="text-white" size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Earnings Milestones</h2>
          <p className="text-gray-600">Track your financial achievements</p>
        </div>
      </div>

      <div className="space-y-4">
        {milestones.map((milestone, index) => (
          <div key={index} className="p-4 bg-white rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                {milestone.achieved ? (
                  <div className="p-1.5 bg-emerald-100 rounded-lg">
                    <Sparkles className="text-emerald-600" size={18} />
                  </div>
                ) : (
                  <div className="p-1.5 bg-blue-100 rounded-lg">
                    <Target className="text-blue-600" size={18} />
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-gray-800">{milestone.amount}</h4>
                  <p className="text-sm text-gray-600">{milestone.label}</p>
                </div>
              </div>
              <div className="text-right">
                {milestone.achieved ? (
                  <div className="text-emerald-600 font-medium">
                    Achieved!
                  </div>
                ) : (
                  <div className="text-blue-600 font-medium">
                    {milestone.progress}%
                  </div>
                )}
                {milestone.date && (
                  <div className="text-sm text-gray-500">{milestone.date}</div>
                )}
              </div>
            </div>
            
            {!milestone.achieved && milestone.progress && (
              <div className="mt-3">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{milestone.progress}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${milestone.progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Performance Metrics */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="font-bold text-gray-800 mb-4">Performance Metrics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">4.8</div>
            <div className="text-sm text-gray-600">Avg. Rating</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">98%</div>
            <div className="text-sm text-gray-600">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">42</div>
            <div className="text-sm text-gray-600">Repeat Clients</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">24hr</div>
            <div className="text-sm text-gray-600">Avg. Response</div>
          </div>
        </div>
      </div>
    </div>
  );
}