'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { useBooking } from '@/contexts/BookingContext';
import { Button } from '@/components/ui/button';
import { CircleDot, CalendarDays } from 'lucide-react';
import styles from './homepage.module.css';

export default function HomePage() {
  const router = useRouter();
  const { facilities } = useBooking();
  const [selectedSport, setSelectedSport] = useState<'all' | 'football' | 'basketball'>('all');

  const filteredFacilities =
    selectedSport === 'all'
      ? facilities
      : facilities.filter((f) => f.type === selectedSport);

  return (
    <div className={styles.pageWrapper}>
      <Header />
      <main className={styles.main}>
        {/* Welcome */}
        <div className={styles.welcomeSection}>
          <h1 className={styles.title}>Welcome to SPU Sport Booking</h1>
          <p className={styles.subtitle}>
            Choose your favorite sport and book a field in just a few clicks!
          </p>
        </div>

        {/* Sport Selector */}
        <div className={styles.selectorSection}>
          <h2 className={styles.selectorTitle}>Choose Your Sport</h2>
          <div className={styles.selectorButtons}>
            {['all', 'football', 'basketball'].map((sport) => (
              <Button
                key={sport}
                onClick={() => setSelectedSport(sport as 'all' | 'football' | 'basketball')}
                className={`${styles.sportButton} ${
                  selectedSport === sport ? styles.activeSport : styles.inactiveSport
                }`}
              >
                {sport === 'football' && <CircleDot className={styles.icon} />}
                {sport === 'basketball' && (
                  <svg className={styles.icon} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2a10 10 0 100 20 10 10 0 000-20zM4.93 4.93a8 8 0 0110.14 10.14L4.93 4.93zM12 20a8 8 0 01-7.07-4.93l11.14-11.14A8 8 0 0112 20z" />
                  </svg>
                )}
                {sport === 'all' ? 'All Sports' : sport.charAt(0).toUpperCase() + sport.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* My Bookings */}
        <div className={styles.bookingsSection}>
          <Button onClick={() => router.push('/my-bookings')} className={styles.bookingsButton}>
            <CalendarDays className={styles.icon} />
            View My Bookings
          </Button>
        </div>

        {/* Facility List */}
        <div className={styles.facilitySection}>
          <h2 className={styles.facilityTitle}>Available Fields</h2>
          <div className={styles.facilityGrid}>
            {filteredFacilities.map((facility) => (
              <div key={facility.id} className={styles.facilityCard}>
                <div className={styles.cardImageWrapper}>
                  <img src={facility.image} alt={facility.name} className={styles.cardImage} />
                  {facility.status === 'open' && (
                    <span className={styles.statusTag}>Available</span>
                  )}
                </div>
                <div className={styles.cardContent}>
                  <div>
                    <h3 className={styles.cardTitle}>{facility.name}</h3>
                    <p className={styles.cardType}>{facility.type}</p>
                  </div>
                  <Button
                    className={styles.cardButton}
                    onClick={() => router.push(`/facility/${facility.id}`)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
          {filteredFacilities.length === 0 && (
            <div className={styles.noFacilities}>No facilities found for this sport type.</div>
          )}
        </div>
      </main>
    </div>
  );
}
