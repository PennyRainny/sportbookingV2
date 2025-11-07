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

  const [facility, setFacility] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // ✅ โหลดข้อมูลสนามจาก API
  useEffect(() => {
    const fetchFacility = async () => {
      try {
        const res = await fetch(`/api/facility/${id}`);
        if (!res.ok) throw new Error('Failed to load facility');
        const data = await res.json();
        setFacility(data);
      } catch (err) {
        console.error(err);
      }
    };

    if (id) fetchFacility();
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

  // ✅ ฟังก์ชันจองสนาม (ยิง API จริง)
  const handleConfirmBooking = async () => {
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid,
          facilityId: facility.id,
          facilityName: facility.name,
          facilityImage: facility.image,
          date: selectedDate.toISOString().split('T')[0],
          time: selectedTime,
          status: 'pending',
        }),
      });

      if (!res.ok) throw new Error('Booking failed');
      setShowConfirmDialog(false);
      router.push('/booking-success');
    } catch (err) {
      console.error('❌ Booking error:', err);
      alert('จองไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('th-TH', {
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
          <span>กลับไปหน้ารายละเอียดสนาม</span>
        </div>

        <div className={styles.grid}>
          {/* ปฏิทิน */}
          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>เลือกวันที่</h2>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className={styles.calendar}
              disabled={(date) => date < new Date()}
            />
          </div>

          {/* ช่องเวลา + สรุป */}
          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>เลือกช่วงเวลา</h2>
            <div className={styles.timeGrid}>
              {facility.availableTimes?.length ? (
                facility.availableTimes.map((time) => (
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
                <p>ไม่มีช่วงเวลาให้เลือก</p>
              )}
            </div>

            <h2 className={styles.sectionTitle}>สรุปการจอง</h2>
            <div className={styles.summaryItem}>
              <MapPin width={20} height={20} color="#6B8AFF" />
              <div>
                <p className={styles.label}>สนาม</p>
                <p>{facility.name}</p>
              </div>
            </div>
            <div className={styles.summaryItem}>
              <CalendarIcon width={20} height={20} color="#6B8AFF" />
              <div>
                <p className={styles.label}>วันที่</p>
                <p>{selectedDate ? formatDate(selectedDate) : 'ยังไม่ได้เลือก'}</p>
              </div>
            </div>
            <div className={styles.summaryItem}>
              <Clock width={20} height={20} color="#6B8AFF" />
              <div>
                <p className={styles.label}>เวลา</p>
                <p>{selectedTime || 'ยังไม่ได้เลือก'}</p>
              </div>
            </div>

            <Button
              onClick={() => setShowConfirmDialog(true)}
              disabled={!selectedDate || !selectedTime}
              className={styles.confirmButton}
            >
              ยืนยันการจอง
            </Button>
          </div>
        </div>
      </main>

      {/* กล่องยืนยัน */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className={styles.dialog}>
          <DialogHeader>
            <DialogTitle>ยืนยันการจอง?</DialogTitle>
            <DialogDescription>
              คุณต้องการจอง <strong>{facility.name}</strong> วันที่{' '}
              {formatDate(selectedDate)} เวลา {selectedTime} ใช่หรือไม่?
            </DialogDescription>
          </DialogHeader>

          <div className={styles.dialogButtonRow}>
            <button
              onClick={() => setShowConfirmDialog(false)}
              className={styles.dialogCancelButton}
            >
              ยกเลิก
            </button>
            <button
              onClick={handleConfirmBooking}
              className={styles.dialogConfirmButton}
            >
              ยืนยัน
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
