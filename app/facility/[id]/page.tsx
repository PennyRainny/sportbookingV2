"use client";

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { useBooking } from '@/contexts/BookingContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, MapPin } from 'lucide-react';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import styles from './facilityDetail.module.css';

export default function FacilityDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : '';
  const { facilities } = useBooking();

  const facility = facilities.find((f) => f.id === id);

  if (!facility) {
    return (
      <div className={styles.pageWrapper}>
        <Header />
        <div className={styles.container}>
          <p className={styles.descriptionText}>Facility not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <Header />
      <main className={styles.container}>
        {/* Back Button */}
        <div className={styles.backButton} onClick={() => router.push('/home')}>
          <ArrowLeft width={16} height={16} />
          <span>Back to Sports List</span>
        </div>

        {/* Banner */}
        <div className={styles.banner}>
          <ImageWithFallback
            src={facility.image}
            alt={facility.name}
            className={styles.bannerImage}
          />
        </div>

        {/* Card */}
        <div className={styles.card}>
          {/* Header */}
          <div className={styles.header}>
            <h1 className={styles.title}>{facility.name}</h1>
            <div className={styles.badgeGroup}>
              <div className={styles.badge} style={{ backgroundColor: '#BFA2FF' }}>
                {facility.type}
              </div>
              {facility.status === 'open' && (
                <div className={styles.badge} style={{ backgroundColor: '#6B8AFF' }}>
                  Available
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className={styles.descriptionSection}>
            <MapPin width={20} height={20} color="#6B8AFF" />
            <div>
              <h3 className={styles.descriptionTitle}>Description</h3>
              <p className={styles.descriptionText}>{facility.description}</p>
            </div>
          </div>

          {/* Time Slots */}
          <div className={styles.timeSection}>
            <Clock width={20} height={20} color="#6B8AFF" />
            <div>
              <h3 className={styles.timeTitle}>Available Time Slots</h3>
              <div className={styles.timeGrid}>
                {facility.availableTimes.map((time) => (
                  <div key={time} className={styles.timeSlot}>
                    {time}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <Button
            onClick={() => router.push(`/booking/${facility.id}`)}
            className={styles.actionButton}
            disabled={facility.status === 'closed'}
          >
            View Booking Calendar
          </Button>
        </div>
      </main>
    </div>
  );
}
