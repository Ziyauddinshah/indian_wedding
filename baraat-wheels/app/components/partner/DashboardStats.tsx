'use client';

import { TrendingUp, Users, Car, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';

const stats = [
  {
    title: 'Total Revenue',
    value: '₹2,45,820',
    change: '+12.5%',
    icon: <TrendingUp className="text-white" size={24} />,
    color: 'from-purple-500 to-pink-500',
    bg: 'bg-gradient-to-br from-purple-50 to-pink-50',
    border: 'border-purple-100',
  },
  {
    title: 'Active Bookings',
    value: '18',
    change: '+3 this week',
    icon: <Calendar className="text-white" size={24} />,
    color: 'from-blue-500 to-cyan-500',
    bg: 'bg-gradient-to-br from-blue-50 to-cyan-50',
    border: 'border-blue-100',
  },
  {
    title: 'Total Vehicles',
    value: '24',
    change: '+2 new',
    icon: <Car className="text-white" size={24} />,
    color: 'from-emerald-500 to-teal-600',
    bg: 'bg-gradient-to-br from-emerald-50 to-teal-50',
    border: 'border-emerald-100',
  },
  {
    title: 'Customer Rating',
    value: '4.8/5',
    change: '98% positive',
    icon: <Users className="text-white" size={24} />,
    color: 'from-amber-500 to-orange-500',
    bg: 'bg-gradient-to-br from-amber-50 to-orange-50',
    border: 'border-amber-100',
  },
];

export default function DashboardStats() {
  const [animatedValues, setAnimatedValues] = useState(stats.map(() => 0));

  useEffect(() => {
    const intervals = stats.map((stat, index) => {
      const finalValue = parseFloat(stat.value.replace(/[^0-9.]/g, ''));
      const step = finalValue / 30;
      let current = 0;
      
      const interval = setInterval(() => {
        current += step;
        if (current >= finalValue) {
          current = finalValue;
          clearInterval(interval);
        }
        
        setAnimatedValues(prev => {
          const newValues = [...prev];
          newValues[index] = Math.floor(current);
          return newValues;
        });
      }, 50);
      
      return interval;
    });

    return () => intervals.forEach(interval => clearInterval(interval));
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div 
          key={index}
          className={`${stat.bg} rounded-2xl p-6 border ${stat.border} shadow-lg hover:shadow-xl transition-shadow duration-300`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-md`}>
              {stat.icon}
            </div>
            <span className={`text-sm font-semibold px-3 py-1 rounded-full ${stat.bg} border ${stat.border}`}>
              {stat.change}
            </span>
          </div>
          
          <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
          <p className="text-3xl font-bold text-gray-800">
            {stat.title === 'Customer Rating' 
              ? stat.value 
              : `₹${animatedValues[index].toLocaleString()}`
            }
          </p>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${stat.color} rounded-full transition-all duration-1000`}
                style={{ width: `${Math.min(100, (animatedValues[index] / 100) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}