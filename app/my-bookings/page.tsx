'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { useBooking } from '@/contexts/BookingContext';
import { useAuth } from '@/contexts/AuthContext';
import { CalendarX, CalendarDays, Clock } from 'lucide-react';
import styles from './mybooking.module.css';

export default function MyBookingsPage() {
  const router = useRouter();
  const { getUserBookings } = useBooking();
  const { user } = useAuth();

  const bookings = user ? getUserBookings(user.id) : [];

  return (
    <div className={styles.pageWrapper}>
      <Header />
      <main className={styles.mainContent}>
        <h1 className={styles.pageTitle}>My Bookings</h1>

        {bookings.length === 0 ? (
          <div className={styles.emptyBox}>
            <CalendarX className={styles.emptyIcon} strokeWidth={1.5} />
            <h2 className={styles.emptyTitle}>No Bookings Yet</h2>
            <p className={styles.emptyText}>
              You haven't made any bookings yet. Start by browsing available facilities!
            </p>
            <button
              onClick={() => router.push('/home')}
              className={styles.browseButton}
            >
              Browse Facilities
            </button>
          </div>
        ) : (
          <div className={styles.bookingList}>
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className={styles.card}
                onClick={() => router.push(`/booking-detail/${booking.id}`)}
              >
                <img
                  src={booking.facilityImage}
                  alt={booking.facilityName}
                  className={styles.image}
                />
                <div className={styles.details}>
                  <h3 className={styles.name}>{booking.facilityName}</h3>
                  <div className={styles.infoRow}>
                    <CalendarDays className={styles.icon} />
                    <span>
                      {new Date(booking.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className={styles.infoRow}>
                    <Clock className={styles.icon} />
                    <span>{booking.time}</span>
                  </div>
                </div>
                <div className={`${styles.status} ${styles[booking.status]}`}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
