"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Facility {
  id: string;
  name: string;
  type: 'football' | 'basketball';
  description: string;
  image: string;
  status: 'open' | 'closed';
  availableTimes: string[];
}

export interface Booking {
  id: string;
  userId: string;
  facilityId: string;
  facilityName: string;
  facilityImage: string;
  date: string;
  time: string;
  status: 'approved' | 'pending' | 'cancelled';
  createdAt: string;
}

interface BookingContextType {
  facilities: Facility[];
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => void; // ✅ status ไม่ถูก omit แล้ว
  updateBookingStatus: (bookingId: string, status: 'approved' | 'pending' | 'cancelled') => void;
  getUserBookings: (userId: string) => Booking[];
  getBookingById: (bookingId: string) => Booking | undefined;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

const initialFacilities: Facility[] = [
   {
    id: 'f1',
    name: 'Main Football Field',
    type: 'football',
    description: 'Professional-grade football field with natural grass. Perfect for matches and training sessions.',
    image: 'https://images.unsplash.com/photo-1709431511156-6998b1b1e459?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMGZpZWxkJTIwc3RhZGl1bXxlbnwxfHx8fDE3NjIwNzAwNjh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    status: 'open',
    availableTimes: ['08:00', '10:00', '14:00', '16:00', '18:00'],
  },
  {
    id: 'f2',
    name: 'Indoor Basketball Court A',
    type: 'basketball',
    description: 'Air-conditioned indoor basketball court with professional flooring and lighting.',
    image: 'https://images.unsplash.com/photo-1710378844976-93a6538671ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNrZXRiYWxsJTIwY291cnQlMjBpbmRvb3J8ZW58MXx8fHwxNzYyMDI2Mzc4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    status: 'open',
    availableTimes: ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00'],
  },
  {
    id: 'f3',
    name: 'Training Football Field',
    type: 'football',
    description: 'Smaller football field ideal for training and small-sided games.',
    image: 'https://images.unsplash.com/photo-1609134154058-860440f6f609?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBmaWVsZCUyMHVuaXZlcnNpdHl8ZW58MXx8fHwxNzYyMDcwMDY4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    status: 'open',
    availableTimes: ['07:00', '09:00', '11:00', '15:00', '17:00'],
  },
  {
    id: 'f4',
    name: 'Outdoor Basketball Court B',
    type: 'basketball',
    description: 'Outdoor basketball court with excellent lighting for evening games.',
    image: 'https://images.unsplash.com/photo-1710378844976-93a6538671ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNrZXRiYWxsJTIwY291cnQlMjBpbmRvb3J8ZW58MXx8fHwxNzYyMDI2Mzc4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    status: 'open',
    availableTimes: ['08:00', '10:00', '14:00', '16:00', '18:00', '20:00'],
  },
];

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const facilityF1 = initialFacilities.find(f => f.id === 'f1');
  const facilityF2 = initialFacilities.find(f => f.id === 'f2');
  const [facilities] = useState<Facility[]>(initialFacilities);
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: 'b1',
      userId: 'user-1',
      facilityId: 'f1',
      facilityName: 'Main Football Field',
      facilityImage: initialFacilities[0].image,
      date: '2025-11-05',
      time: '14:00',
      status: 'approved',
      createdAt: '2025-11-01T10:30:00',
    },
    {
      id: 'b2',
      userId: 'user-1',
      facilityId: 'f2',
      facilityName: 'Indoor Basketball Court A',
      facilityImage: initialFacilities[1].image,
      date: '2025-11-08',
      time: '15:00',
      status: 'pending',
      createdAt: '2025-11-02T14:20:00',
    },
  ]);

  // ✅ status รับจากภายนอก ถ้าไม่ใส่ จะ default เป็น 'pending'
  const addBooking = (booking: Omit<Booking, 'id' | 'createdAt'>) => {
    const newBooking: Booking = {
      ...booking,
      id: 'b' + Date.now(),
      createdAt: new Date().toISOString(),
      status: booking.status ?? 'pending',
    };
    setBookings((prev) => [...prev, newBooking]);
  };

  const updateBookingStatus = (bookingId: string, status: 'approved' | 'pending' | 'cancelled') => {
    setBookings(bookings.map(b => b.id === bookingId ? { ...b, status } : b));
  };

  const getUserBookings = (userId: string) => {
    return bookings.filter(b => b.userId === userId);
  };

  const getBookingById = (bookingId: string) => {
    return bookings.find(b => b.id === bookingId);
  };

  return (
    <BookingContext.Provider
      value={{
        facilities,
        bookings,
        addBooking,
        updateBookingStatus,
        getUserBookings,
        getBookingById,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within BookingProvider');
  }
  return context;
};
