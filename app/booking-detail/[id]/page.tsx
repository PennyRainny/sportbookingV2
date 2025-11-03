'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { useBooking } from '@/contexts/BookingContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Clock, Hash, Send } from 'lucide-react';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { toast } from 'sonner';
import styles from './bookingDetail.module.css';

export default function BookingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : '';
  const { getBookingById } = useBooking();

  const booking = getBookingById(id || '');

  if (!booking) {
    return (
      <div className={styles.pageWrapper}>
        <Header />
        <div className={styles.container}>
          <p className={styles.notFound}>Booking not found</p>
        </div>
      </div>
    );
  }

  const statusColors = {
    approved: '#6B8AFF',
    pending: '#FFC7D3',
    cancelled: '#BFA2FF',
  } as const;

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
    <div className={styles.pageWrapper}>
      <Header />
      <main className={styles.container}>
        <div className={styles.backButton} onClick={() => router.push('/my-bookings')}>
          <ArrowLeft width={16} height={16} />
          <span>Back to My Bookings</span>
        </div>

        <div className={styles.card}>
          <div className={styles.imageWrapper}>
            <ImageWithFallback
              src={booking.facilityImage}
              alt={booking.facilityName}
              className={styles.image}
            />
          </div>

          <div className={styles.cardContent}>
            <div className={styles.header}>
              <h1 className={styles.title}>{booking.facilityName}</h1>
              <Badge
                style={{
                  backgroundColor: statusColors[booking.status],
                  color: 'white',
                }}
              >
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </Badge>
            </div>

            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <Hash width={20} height={20} color="#6B8AFF" />
                <div>
                  <p className={styles.label}>Booking ID</p>
                  <p>{booking.id}</p>
                </div>
              </div>
              <div className={styles.infoItem}>
                <Calendar width={20} height={20} color="#6B8AFF" />
                <div>
                  <p className={styles.label}>Date</p>
                  <p>{formatDate(booking.date)}</p>
                </div>
              </div>
              <div className={styles.infoItem}>
                <Clock width={20} height={20} color="#6B8AFF" />
                <div>
                  <p className={styles.label}>Time</p>
                  <p>{booking.time}</p>
                </div>
              </div>
            </div>

            {booking.status === 'pending' && (
              <div className={styles.statusBoxPending}>
                ⏳ Your booking is pending approval. We'll notify you via LINE once it's confirmed.
              </div>
            )}
            {booking.status === 'approved' && (
              <div className={styles.statusBoxApproved}>
                ✅ Your booking has been approved! See you at the field.
              </div>
            )}
            {booking.status === 'cancelled' && (
              <div className={styles.statusBoxCancelled}>
                ❌ This booking has been cancelled.
              </div>
            )}

            <Button onClick={handleSendToLine} className={styles.sendButton}>
              <Send width={20} height={20} />
              Send Booking Info to LINE
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
