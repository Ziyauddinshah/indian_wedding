
'use client';

import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { Calendar, X, CheckCircle2 } from 'lucide-react';
import { format, isSameDay } from 'date-fns';
import 'react-day-picker/dist/style.css';

interface BookNowModalProps {
  availableDates: Date[];
  bookedDates: Date[];
  price: number;
  vehicleName: string;
}

export default function BookNowModal({
  availableDates,
  bookedDates,
  price,
  vehicleName,
}: BookNowModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const isBooked = (date: Date) =>
    bookedDates.some((d) => isSameDay(d, date));
  const isAvailable = (date: Date) =>
    availableDates.some((d) => isSameDay(d, date));

  const handleDayClick = (date: Date) => {
    if (isAvailable(date) && !isBooked(date)) {
      setSelectedDate(date);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedDate(undefined);
  };

  const handleConfirm = () => {
    if (!selectedDate) return;
    alert(`Booking confirmed!\nVehicle: ${vehicleName}\nDate: ${format(selectedDate, 'PPP')}\nPrice: ₹${price}`);
    handleClose();
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="px-8 py-4 bg-gradient-to-r from-rose-600 to-red-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center"
      >
        <Calendar className="h-5 w-5 mr-2" />
        Book Now
      </button>

      {/* Modal overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
          onClick={handleClose} // closes when clicking outside
        >
          {/* Modal content – stop propagation to avoid closing when clicking inside */}
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col"
            style={{ maxHeight: '90vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold bg-gradient-to-r from-amber-500 to-rose-600 bg-clip-text text-transparent">
                Choose Your Date
              </h2>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {/* Scrollable area for calendar + legend + selected date */}
            <div className="overflow-y-auto p-6 flex flex-col gap-4">
              {/* Calendar */}
              <div className="flex justify-center">
                <DayPicker
                  mode="single"
                  selected={selectedDate}
                  onDayClick={handleDayClick}
                  disabled={(date) => !isAvailable(date)}
                  modifiers={{
                    booked: (date) => isBooked(date),
                    available: (date) => isAvailable(date),
                  }}
                  modifiersClassNames={{
                    available: '!bg-green-100 !text-green-800 !rounded-full',
                    booked:
                      '!bg-red-100 !text-red-400 !line-through !rounded-full cursor-not-allowed',
                    selected:
                      '!bg-gradient-to-r !from-amber-400 !to-yellow-500 !text-white !rounded-full',
                  }}
                  className="mx-auto"
                />
              </div>

              {/* Legend */}
              <div className="flex justify-center gap-6 text-sm">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-full bg-green-100 border border-green-300" />
                  <span className="text-gray-700">Available</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-full bg-red-100 border border-red-300" />
                  <span className="text-gray-700">Booked</span>
                </div>
              </div>

              {/* Selected Date + Price */}
              {selectedDate ? (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="font-bold text-gray-900">
                      {format(selectedDate, 'EEEE, MMMM do, yyyy')}
                    </span>
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-gray-600">Total price:</span>
                    <span className="text-xl font-bold text-gray-900">
                      ₹{price.toLocaleString()}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-500">Pick an available date to proceed</p>
              )}
            </div>

            {/* Fixed bottom – Confirm button */}
            <div className="px-6 pb-6 pt-2 border-t border-gray-100">
              <button
                onClick={handleConfirm}
                disabled={!selectedDate}
                className={`w-full py-3.5 rounded-xl font-bold text-lg transition-all ${
                  selectedDate
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:scale-105'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}