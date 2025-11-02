"use client";

import React from 'react';
import { useRouter, useParams } from 'next/navigation'; // ✅ ใช้ของ Next.js
import { Header } from '@/components/Header';
import { useBooking } from '@/contexts/BookingContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, MapPin } from 'lucide-react';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';

export default function FacilityDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { facilities } = useBooking();

  const facility = facilities.find((f) => f.id === id);

  if (!facility) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-purple-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-center text-gray-500">Facility not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-purple-50">
      <Header />

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          onClick={() => router.push('/home')}
          variant="ghost"
          className="mb-6 rounded-xl flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Sports List
        </Button>

        {/* Facility Image Banner */}
        <div className="rounded-3xl overflow-hidden shadow-2xl mb-8 h-96">
          <ImageWithFallback
            src={facility.image}
            alt={facility.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Facility Info */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="mb-2">{facility.name}</h1>
              <div className="flex items-center gap-3">
                <Badge
                  className="capitalize"
                  style={{ backgroundColor: '#BFA2FF', color: 'white' }}
                >
                  {facility.type}
                </Badge>
                <Badge
                  style={{
                    backgroundColor: facility.status === 'open' ? '#6B8AFF' : '#FFC7D3',
                    color: 'white',
                  }}
                >
                  {facility.status === 'open' ? 'Available' : 'Closed'}
                </Badge>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-start gap-2 mb-4">
              <MapPin className="w-5 h-5 mt-1" style={{ color: '#6B8AFF' }} />
              <div>
                <h3 className="mb-2">Description</h3>
                <p className="text-gray-600">{facility.description}</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-start gap-2">
              <Clock className="w-5 h-5 mt-1" style={{ color: '#6B8AFF' }} />
              <div className="flex-1">
                <h3 className="mb-3">Available Time Slots</h3>
                <div className="flex flex-wrap gap-2">
                  {facility.availableTimes.map((time) => (
                    <div
                      key={time}
                      className="px-4 py-2 rounded-xl text-white"
                      style={{ backgroundColor: '#6B8AFF' }}
                    >
                      {time}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={() => router.push(`/booking/${facility.id}`)}
              className="flex-1 rounded-xl py-6 transition-all hover:scale-105"
              style={{ backgroundColor: '#6B8AFF' }}
              disabled={facility.status === 'closed'}
            >
              View Booking Calendar
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
