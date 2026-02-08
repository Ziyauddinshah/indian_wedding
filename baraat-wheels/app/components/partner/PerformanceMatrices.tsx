'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown, Target, Zap, Crown } from 'lucide-react';

const performanceGoals = [
  { 
    id: 1, 
    goal: 'Achieve ₹15L Revenue', 
    target: '₹15,00,000', 
    current: '₹12,50,000', 
    progress: 83,
    deadline: 'Mar 31, 2025',
    icon: '💰'
  },
  { 
    id: 2, 
    goal: 'Reach 4.9 Avg Rating', 
    target: '4.9', 
    current: '4.8', 
    progress: 96,
    deadline: 'Ongoing',
    icon: '⭐'
  },
  { 
    id: 3, 
    goal: 'Reduce Response Time', 
    target: '1 hour', 
    current: '2.4 hours', 
    progress: 58,
    deadline: 'Feb 28, 2025',
    icon: '⚡'
  },
  { 
    id: 4, 
    goal: '50 Repeat Clients', 
    target: '50', 
    current: '42', 
    progress: 84,
    deadline: 'Apr 30, 2025',
    icon: '👥'
  },
];

export default function PerformanceMetrics() {
  const [selectedGoal, setSelectedGoal] = useState<number | null>(null);

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return 'from-emerald-500 to-teal-600';
    if (progress >= 70) return 'from-blue-500 to-cyan-500';
    if (progress >= 50) return 'from-amber-500 to-orange-500';
    return 'from-red-500 to-pink-600';
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
          <Target className="text-white" size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Performance Goals</h2>
          <p className="text-gray-600">Track your progress towards targets</p>
        </div>
      </div>

      <div className="space-y-4">
        {performanceGoals.map((goal) => {
          const progressColor = getProgressColor(goal.progress);
          const isSelected = selectedGoal === goal.id;
          
          return (
            <div
              key={goal.id}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                isSelected 
                  ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-300' 
                  : 'hover:border-blue-300'
              }`}
              onClick={() => setSelectedGoal(isSelected ? null : goal.id)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{goal.icon}</span>
                  <div>
                    <h4 className="font-bold text-gray-800">{goal.goal}</h4>
                    <p className="text-sm text-gray-500">Target: {goal.target}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-800">{goal.progress}%</div>
                  <div className="text-sm text-gray-500">Progress</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-2">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Current: {goal.current}</span>
                  <span>Target: {goal.target}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full bg-gradient-to-r ${progressColor} transition-all duration-1000`}
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>

              {/* Additional Info */}
              <div className={`grid grid-cols-2 gap-4 mt-3 ${isSelected ? 'block' : 'hidden'}`}>
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500">Deadline</div>
                  <div className="font-medium text-gray-800">{goal.deadline}</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500">Remaining</div>
                  <div className="font-medium text-gray-800">
                    {goal.progress === 100 ? 'Achieved!' : `${100 - goal.progress}% to go`}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Performance Tips */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="text-amber-500" size={18} />
          <h3 className="font-bold text-gray-800">Quick Wins</h3>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <span>Respond within 1 hour for 30% more conversions</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Add vehicle photos to get 2x more bookings</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span>Enable instant booking for 25% faster bookings</span>
          </div>
        </div>
      </div>

      {/* Performance Level */}
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
        <div className="flex items-center gap-3 mb-2">
          <Crown className="text-purple-600" />
          <h3 className="font-bold text-gray-800">Performance Level: Premium</h3>
        </div>
        <p className="text-sm text-gray-600 mb-3">
          Maintain your rating above 4.7 to keep Premium status
        </p>
        <div className="flex items-center justify-between">
          <div className="text-sm">
            <span className="text-gray-500">Next Level:</span>
            <span className="font-bold text-purple-700 ml-2">Elite (4.9+)</span>
          </div>
          <div className="text-sm text-emerald-600 font-medium">
            +15% benefits
          </div>
        </div>
      </div>
    </div>
  );
}