'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { CheckCircle, Home, Calendar, Check } from 'lucide-react';
import styles from './bookingSuccess.module.css';

export default function BookingSuccessPage() {
  const router = useRouter();

  return (
    <div className={styles.pageWrapper}>
      <Header />

      <main className={styles.container}>
        {/* Success Icon */}
        <div className={styles.iconWrapper}>
          <CheckCircle className={styles.icon} strokeWidth={1.5} />
        </div>

        {/* Success Message */}
        <h1 className={styles.title}>Booking Confirmed!</h1>
        <p className={styles.subtitle}>
          Your booking has been successfully submitted and is pending approval.
          We'll notify you via LINE once it's confirmed.
        </p>

        {/* Summary Card */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>What's Next?</h3>
          <ul className={styles.cardList}>
            <li className={styles.cardItem}>
              <span className={styles.cardIcon}>📋</span>
              <span>Your booking will be reviewed by our staff</span>
            </li>
            <li className={styles.cardItem}>
              <span className={styles.cardIcon}>✅</span>
              <span>You'll receive a confirmation via LINE</span>
            </li>
            <li className={styles.cardItem}>
              <span className={styles.cardIcon}>🏃</span>
              <span>Get ready to play on your scheduled date!</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className={styles.buttonGroup}>
          <Button
            onClick={() => router.push('/my-bookings')}
            variant="outline"
            className={styles.secondaryButton}
          >
            <Calendar className={styles.buttonIcon} />
            View My Bookings
          </Button>
          <Button
            onClick={() => router.push('home')}
            variant="outline"
            className={styles.secondaryButton}
          >
            <Home className={styles.buttonIcon} />
            Back to Home
          </Button>
        </div>
      </main>
    </div>
  );
}
