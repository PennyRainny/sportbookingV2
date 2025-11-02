"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { FacilityCard } from '../../components/FacilityCard';
import { useBooking } from '@/contexts/BookingContext';
import { Button } from '@/components/ui/button';
import { CircleDot, CalendarDays } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { facilities } = useBooking();
  const [selectedSport, setSelectedSport] = useState<'all' | 'football' | 'basketball'>('all');

  const filteredFacilities = selectedSport === 'all'
    ? facilities
    : facilities.filter((f) => f.type === selectedSport);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-purple-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="mb-4" style={{ color: '#6B8AFF' }}>Welcome to SPU Sport Booking</h1>
          <p className="text-gray-600">Choose your favorite sport and book a field in just a few clicks!</p>
        </div>

        <div className="mb-12">
          <h2 className="text-center mb-6">Choose Your Sport</h2>
          <div className="flex justify-center gap-4 flex-wrap">
            {['all', 'football', 'basketball'].map((sport) => (
              <Button
                key={sport}
                onClick={() => setSelectedSport(sport as any)}
                className="rounded-xl px-8 py-6 transition-all hover:scale-105 flex items-center gap-2"
                style={{
                  backgroundColor: selectedSport === sport ? '#6B8AFF' : '#E5E7EB',
                  color: selectedSport === sport ? 'white' : '#374151',
                }}
              >
                {sport === 'football' && <CircleDot className="w-5 h-5" />}
                {sport === 'basketball' && <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="..." /></svg>}
                {sport === 'all' ? 'All Sports' : sport.charAt(0).toUpperCase() + sport.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex justify-center mb-12">
          <Button
            onClick={() => router.push('/my-bookings')}
            className="rounded-xl px-8 py-6 transition-all hover:scale-105 flex items-center gap-2"
            style={{ backgroundColor: '#FFC7D3' }}
          >
            <CalendarDays className="w-5 h-5" />
            View My Bookings
          </Button>
        </div>

        <div>
          <h2 className="mb-6">Available Fields</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFacilities.map((facility) => (
              <FacilityCard
                key={facility.id}
                name={facility.name}
                type={facility.type}
                image={facility.image}
                status={facility.status}
                onViewDetails={() => router.push(`/facility/${facility.id}`)}
              />
            ))}
          </div>
          {filteredFacilities.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No facilities found for this sport type.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
