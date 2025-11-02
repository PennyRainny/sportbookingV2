'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Clock, Hash, Send } from 'lucide-react';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { toast } from 'sonner';
import { useBooking } from '@/contexts/BookingContext';

interface BookingDetailPageProps {
  params: {
    id: string;
  };
}

export default function BookingDetailPage({ params }: BookingDetailPageProps) {
  const router = useRouter();
  const { id } = params;
  const { getBookingById } = useBooking();

  const booking = getBookingById(id || '');

  if (!booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-purple-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-center text-gray-500">Booking not found</p>
        </div>
      </div>
    );
  }

  const statusColors = {
    approved: '#6B8AFF',
    pending: '#FFC7D3',
    cancelled: '#BFA2FF',
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleSendToLine = () => {
    toast.success('Booking info sent to LINE!', {
      description: 'Check your LINE app for the booking details.',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-purple-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <Button
          onClick={() => router.push('/my-bookings')}
          variant="ghost"
          className="mb-6 rounded-xl flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to My Bookings
        </Button>

        {/* Booking Detail Card */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          {/* Facility Image */}
          <div className="h-64 overflow-hidden">
            <ImageWithFallback
              src={booking.facilityImage}
              alt={booking.facilityName}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Booking Info */}
          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <h1 className="flex-1">{booking.facilityName}</h1>
              <Badge
                style={{
                  backgroundColor: statusColors[booking.status],
                  color: 'white',
                }}
              >
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </Badge>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start gap-3">
                <Hash className="w-5 h-5 mt-1" style={{ color: '#6B8AFF' }} />
                <div>
                  <p className="text-gray-500 text-sm">Booking ID</p>
                  <p>{booking.id}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 mt-1" style={{ color: '#6B8AFF' }} />
                <div>
                  <p className="text-gray-500 text-sm">Date</p>
                  <p>{formatDate(booking.date)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 mt-1" style={{ color: '#6B8AFF' }} />
                <div>
                  <p className="text-gray-500 text-sm">Time</p>
                  <p>{booking.time}</p>
                </div>
              </div>
            </div>

            {/* Status Message */}
            {booking.status === 'pending' && (
              <div className="p-4 rounded-xl mb-6" style={{ backgroundColor: '#FFF4F6' }}>
                <p style={{ color: '#E91E63' }}>
                  ⏳ Your booking is pending approval. We'll notify you via LINE once it's confirmed.
                </p>
              </div>
            )}
            {booking.status === 'approved' && (
              <div className="p-4 rounded-xl mb-6" style={{ backgroundColor: '#EEF2FF' }}>
                <p style={{ color: '#6B8AFF' }}>
                  ✅ Your booking has been approved! See you at the field.
                </p>
              </div>
            )}
            {booking.status === 'cancelled' && (
              <div className="p-4 rounded-xl mb-6" style={{ backgroundColor: '#F5F3FF' }}>
                <p style={{ color: '#9333EA' }}>
                  ❌ This booking has been cancelled.
                </p>
              </div>
            )}

            {/* Action Button */}
            <Button
              onClick={handleSendToLine}
              className="w-full rounded-xl py-6 transition-all hover:scale-105 flex items-center justify-center gap-2"
              style={{ backgroundColor: '#06C755' }}
            >
              <Send className="w-5 h-5" />
              Send Booking Info to LINE
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
