'use client';

import { 
  PlusCircle, Calendar, Upload, Star, 
  Settings, TrendingUp, MessageSquare, Bell,
  ArrowRight, Zap, Target, Sparkles 
} from 'lucide-react';
import { useState } from 'react';

const quickActions = [
  {
    id: 1,
    title: 'Add New Vehicle',
    description: 'List your luxury car, ghodi or royal vehicle',
    icon: <PlusCircle className="text-white" size={22} />,
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50',
    action: 'addVehicle',
    hot: true,
  },
  {
    id: 2,
    title: 'Update Calendar',
    description: 'Mark dates as available/unavailable',
    icon: <Calendar className="text-white" size={22} />,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-50',
    action: 'updateCalendar',
    notification: 3,
  },
  {
    id: 3,
    title: 'Upload Photos',
    description: 'Add high-quality vehicle photos',
    icon: <Upload className="text-white" size={22} />,
    color: 'from-emerald-500 to-teal-600',
    bgColor: 'bg-gradient-to-br from-emerald-50 to-teal-50',
    action: 'uploadPhotos',
  },
  {
    id: 4,
    title: 'Boost Rating',
    description: 'Get more 5-star reviews',
    icon: <Star className="text-white" size={22} />,
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-gradient-to-br from-amber-50 to-orange-50',
    action: 'boostRating',
  },
  {
    id: 5,
    title: 'Special Offers',
    description: 'Create limited-time discounts',
    icon: <Zap className="text-white" size={22} />,
    color: 'from-red-500 to-pink-600',
    bgColor: 'bg-gradient-to-br from-red-50 to-pink-50',
    action: 'createOffer',
    hot: true,
  },
  {
    id: 6,
    title: 'Performance Tips',
    description: 'Learn to increase bookings',
    icon: <TrendingUp className="text-white" size={22} />,
    color: 'from-indigo-500 to-blue-500',
    bgColor: 'bg-gradient-to-br from-indigo-50 to-blue-50',
    action: 'viewTips',
  },
];

const recommendations = [
  {
    id: 1,
    title: 'Wedding Season Alert!',
    description: 'Update your pricing for peak season',
    icon: '💍',
    color: 'text-purple-600 bg-purple-100',
  },
  {
    id: 2,
    title: 'Add 3+ Photos',
    description: 'Vehicles with more photos get 2x bookings',
    icon: '📸',
    color: 'text-blue-600 bg-blue-100',
  },
  {
    id: 3,
    title: 'Instant Booking',
    description: 'Enable for 30% more conversions',
    icon: '⚡',
    color: 'text-emerald-600 bg-emerald-100',
  },
];

export default function QuickActions() {
  const [actions, setActions] = useState(quickActions);

  const handleActionClick = (actionType: string) => {
    // Handle different action types
    switch(actionType) {
      case 'addVehicle':
        alert('Opening Add Vehicle form...');
        break;
      case 'updateCalendar':
        alert('Opening Calendar...');
        break;
      case 'uploadPhotos':
        alert('Opening Photo Upload...');
        break;
      case 'boostRating':
        alert('Opening Rating Tips...');
        break;
      case 'createOffer':
        alert('Creating Special Offer...');
        break;
      case 'viewTips':
        alert('Showing Performance Tips...');
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
            <Zap className="text-white" size={20} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Quick Actions</h3>
            <p className="text-sm text-gray-600">Complete tasks to boost earnings</p>
          </div>
        </div>
        <Sparkles className="text-amber-500 animate-pulse" />
      </div>

      {/* Action Grid */}
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleActionClick(action.action)}
            className={`${action.bgColor} rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all duration-300 group relative overflow-hidden`}
          >
            {/* Hot Badge */}
            {action.hot && (
              <div className="absolute top-2 right-2">
                <div className="px-2 py-1 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-bold rounded-full flex items-center gap-1">
                  <Target size={10} />
                  HOT
                </div>
              </div>
            )}

            {/* Notification Badge */}
            {action.notification && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-bounce">
                {action.notification}
              </div>
            )}

            {/* Icon */}
            <div className={`p-3 rounded-xl bg-gradient-to-r ${action.color} w-fit mb-3 group-hover:scale-110 transition-transform`}>
              {action.icon}
            </div>

            {/* Content */}
            <h4 className="font-bold text-gray-800 text-left mb-1 group-hover:text-blue-700 transition-colors">
              {action.title}
            </h4>
            <p className="text-sm text-gray-600 text-left">{action.description}</p>

            {/* Hover Arrow */}
            <ArrowRight className="absolute bottom-3 right-3 text-gray-400 group-hover:text-blue-500 transition-all opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0" />
          </button>
        ))}
      </div>

      {/* Recommendations */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare className="text-blue-600" size={20} />
          <h4 className="font-bold text-gray-800">Smart Recommendations</h4>
        </div>
        
        <div className="space-y-2">
          {recommendations.map((rec) => (
            <div 
              key={rec.id}
              className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-sm transition-shadow cursor-pointer"
            >
              <div className={`p-2 rounded-lg ${rec.color} text-lg`}>
                {rec.icon}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">{rec.title}</p>
                <p className="text-sm text-gray-600">{rec.description}</p>
              </div>
              <ArrowRight className="text-gray-400" size={16} />
            </div>
          ))}
        </div>

        <button className="w-full mt-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium hover:shadow-md transition-all flex items-center justify-center gap-2">
          <Bell size={16} />
          Enable Smart Alerts
        </button>
      </div>

      {/* Progress */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium text-emerald-800">Partner Level Progress</span>
          <span className="text-emerald-700 font-bold">85%</span>
        </div>
        <div className="h-2 bg-emerald-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all duration-1000"
            style={{ width: '85%' }}
          ></div>
        </div>
        <p className="text-sm text-emerald-700 mt-2">
          Complete 3 more actions to reach Premium Level 🚀
        </p>
      </div>
    </div>
  );
}