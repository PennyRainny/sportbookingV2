'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Header } from '@/components/Header';
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
  const { user } = useAuth();

  const id =
    typeof params?.id === 'string'
      ? params.id
      : Array.isArray(params?.id)
      ? params.id[0]
      : '';

  const [facility, setFacility] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ โหลดข้อมูล facility จาก localStorage หรือ API (ในโปรเจกต์จริงอาจมาจาก Context)
  useEffect(() => {
    const storedFacilities = localStorage.getItem('facilities');
    if (storedFacilities) {
      const parsed = JSON.parse(storedFacilities);
      const found = parsed.find((f: any) => f.id === id);
      setFacility(found || null);
    }
  }, [id]);

  if (!facility) {
    return (
      <div className={styles.pageWrapper}>
        <Header />
        <main className={styles.container}>
          <p>Loading facility...</p>
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.pageWrapper}>
        <Header />
        <main className={styles.container}>
          <p>Loading user...</p>
        </main>
      </div>
    );
  }

  // ✅ ฟังก์ชันยืนยันการจอง (เรียก API)
  const handleConfirmBooking = async () => {
    if (!selectedDate || !selectedTime) return;

    setLoading(true);
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          facilityId: facility.id,
          facilityName: facility.name,
          facilityImage: facility.image,
          date: selectedDate.toISOString().split('T')[0],
          time: selectedTime,
          status: 'pending',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Booking failed');
        setLoading(false);
        return;
      }

      alert('✅ Booking created successfully!');
      setShowConfirmDialog(false);
      router.push('/booking-success');
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong, please try again.');
    } finally {
      setLoading(false);
    }
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
              {facility.availableTimes && facility.availableTimes.length > 0 ? (
                facility.availableTimes.map((time: string) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`${styles.timeSlot} ${
                      selectedTime === time ? styles.timeSlotSelected : ''
                    }`}
                  >
                    {time}
                  </button>
                ))
              ) : (
                <p>No available time slots</p>
              )}
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
              disabled={!selectedDate || !selectedTime || loading}
              className={styles.confirmButton}
            >
              {loading ? 'Processing...' : 'Confirm Booking'}
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
              disabled={loading}
            >
              {loading ? 'Booking...' : 'Confirm'}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
