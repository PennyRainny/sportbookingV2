'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { ArrowLeft, Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useBooking } from '@/contexts/BookingContext';
import { useAuth } from '@/contexts/AuthContext';

interface BookingCalendarPageProps {
  params: {
    id: string;
  };
}

export default function BookingCalendarPage({ params }: BookingCalendarPageProps) {
  const { id } = params;
  const router = useRouter();
  const { facilities, addBooking } = useBooking();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const facility = facilities.find((f) => f.id === id);
  if (!facility) return null;

  const handleConfirmBooking = () => {
    if (!selectedDate || !selectedTime || !user) return;

    addBooking({
      userId: user.id,
      facilityId: facility.id,
      facilityName: facility.name,
      facilityImage: facility.image,
      date: selectedDate.toISOString().split('T')[0],
      time: selectedTime,
    });

    setShowConfirmDialog(false);
    router.push('/booking-success');
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-purple-50">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <Button
          onClick={() => router.push(`/facility/${facility.id}`)}
          variant="ghost"
          className="mb-6 rounded-xl flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Facility Details
        </Button>

        {/* Calendar & Booking UI */}
        {/* ...โค้ดส่วนที่เหลือเหมือนเดิม */}
      </main>

      {/* Confirmation Dialog */}
      {/* ...โค้ด Dialog เหมือนเดิม */}
    </div>
  );
}
