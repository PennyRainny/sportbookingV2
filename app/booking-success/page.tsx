'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { CheckCircle, Home, Calendar } from 'lucide-react';

export default function BookingSuccessPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-purple-50">
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-16 text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-8 animate-bounce">
          <CheckCircle
            className="w-32 h-32"
            style={{ color: '#6B8AFF' }}
            strokeWidth={1.5}
          />
        </div>

        {/* Success Message */}
        <h1 className="mb-4" style={{ color: '#6B8AFF' }}>
          Booking Confirmed!
        </h1>
        <p className="text-gray-600 mb-12 text-lg">
          Your booking has been successfully submitted and is pending approval.
          We'll notify you via LINE once it's confirmed.
        </p>

        {/* Summary Card */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-8 max-w-md mx-auto">
          <h3 className="mb-4">What's Next?</h3>
          <ul className="text-left text-gray-600 space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-2xl">📋</span>
              <span>Your booking will be reviewed by our staff</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <span>You'll receive a confirmation via LINE</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">🏃</span>
              <span>Get ready to play on your scheduled date!</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => router.push('/my-bookings')}
            className="rounded-xl px-8 py-6 transition-all hover:scale-105 flex items-center justify-center gap-2"
            style={{ backgroundColor: '#6B8AFF' }}
          >
            <Calendar className="w-5 h-5" />
            View My Bookings
          </Button>
          <Button
            onClick={() => router.push('/')}
            variant="outline"
            className="rounded-xl px-8 py-6 transition-all hover:scale-105 flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Button>
        </div>
      </main>
    </div>
  );
}
