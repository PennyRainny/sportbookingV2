'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { useBooking } from '@/contexts/BookingContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { ArrowLeft, Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import styles from './booking.module.css';

export default function BookingCalendarPage() {
  const router = useRouter();
  const params = useParams();
  const id =
    typeof params?.id === 'string'
      ? params.id
      : Array.isArray(params?.id)
      ? params.id[0]
      : '';
  const { facilities, addBooking } = useBooking();
  const { user } = useAuth();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const facility = facilities.find((f) => f.id === id);
  if (!facility || !user) return null;

  const handleConfirmBooking = () => {
    if (!selectedDate || !selectedTime) return;

    addBooking({
      userId: user.id,
      facilityId: facility.id,
      facilityName: facility.name,
      facilityImage: facility.image,
      date: selectedDate.toISOString().split('T')[0],
      time: selectedTime,
      status: 'pending',
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
    <div className={styles.pageWrapper}>
      <Header />
      <main className={styles.container}>
        <div
          className={styles.backButton}
          onClick={() => router.push(`/facility/${facility.id}`)}
        >
          <ArrowLeft width={16} height={16} />
          <span>Back to Facility Details</span>
        </div>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>Select Date</h2>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className={styles.calendar}
              disabled={(date) => date < new Date()}
            />
          </div>

          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>Select Time Slot</h2>
            <div className={styles.timeGrid}>
              {facility.availableTimes.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`${styles.timeSlot} ${
                    selectedTime === time ? styles.timeSlotSelected : ''
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>

            <h2 className={styles.sectionTitle}>Booking Summary</h2>
            <div className={styles.summaryItem}>
              <MapPin width={20} height={20} color="#6B8AFF" />
              <div>
                <p className={styles.label}>Field</p>
                <p>{facility.name}</p>
              </div>
            </div>
            <div className={styles.summaryItem}>
              <CalendarIcon width={20} height={20} color="#6B8AFF" />
              <div>
                <p className={styles.label}>Date</p>
                <p>{selectedDate ? formatDate(selectedDate) : 'Not selected'}</p>
              </div>
            </div>
            <div className={styles.summaryItem}>
              <Clock width={20} height={20} color="#6B8AFF" />
              <div>
                <p className={styles.label}>Time</p>
                <p>{selectedTime || 'Not selected'}</p>
              </div>
            </div>

            <Button
              onClick={() => setShowConfirmDialog(true)}
              disabled={!selectedDate || !selectedTime}
              className={styles.confirmButton}
            >
              Confirm Booking
            </Button>
          </div>
        </div>
      </main>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className={styles.dialog}>
          <DialogHeader>
            <DialogTitle className={styles.dialogTitle}>
              Confirm Your Booking?
            </DialogTitle>
            <DialogDescription className={styles.dialogDescription}>
              Are you sure you want to book <strong>{facility.name}</strong> on{' '}
              {selectedDate ? formatDate(selectedDate) : ''} at {selectedTime}?
            </DialogDescription>
          </DialogHeader>

          <div className={styles.dialogButtonRow}>
            <button
              onClick={() => setShowConfirmDialog(false)}
              className={styles.dialogCancelButton}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmBooking}
              className={styles.dialogConfirmButton}
            >
              Confirm
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
