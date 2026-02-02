// app/components/booking/BookingWidget.tsx (Simplified)
'use client'

import { useState } from 'react'
import { Calendar, Clock } from 'lucide-react'

export default function BookingWidget() {
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('10:00')

  return (
    <div className="space-y-6">
      <div>
        <label className="flex items-center font-semibold mb-3 text-gray-900">
          <Calendar className="h-5 w-5 mr-2 text-amber-600" />
          Select Wedding Date
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
        />
      </div>

      <div>
        <label className="flex items-center font-semibold mb-3 text-gray-900">
          <Clock className="h-5 w-5 mr-2 text-amber-600" />
          Preferred Start Time
        </label>
        <div className="grid grid-cols-3 gap-2">
          {['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'].map((time) => (
            <button
              key={time}
              onClick={() => setSelectedTime(time)}
              className={`p-3 rounded-lg border-2 ${
                selectedTime === time
                  ? 'border-amber-500 bg-amber-50 text-amber-700'
                  : 'border-gray-200 hover:border-gray-300'
              } transition-all`}
            >
              {time}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}