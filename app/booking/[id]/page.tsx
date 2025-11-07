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

// ✅ import Firestore
import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';

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
  const [loading, setLoading] = useState(false);

  // ✅ โหลดข้อมูลสนามจาก Firestore (สมมติว่ามี collection "facilities")
  useEffect(() => {
    const fetchFacility = async () => {
      try {
        const res = await fetch(`/api/facility/${id}`); // ถ้ายังใช้ API ดึงสนามได้ปกติ
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

  // ✅ ฟังก์ชันจอง (ติดต่อ Firestore โดยตรง)
  const handleConfirmBooking = async () => {
  if (!selectedDate || !selectedTime || !facility) return; // ✅ กัน null
  setLoading(true);

  try {
    const bookingsRef = collection(db, 'bookings');

    // 🔍 ตรวจสอบว่าช่วงเวลานั้นถูกจองไปแล้วหรือยัง
    const q = query(
      bookingsRef,
      where('facilityId', '==', facility.id),
      where('date', '==', selectedDate.toISOString().split('T')[0]),
      where('time', '==', selectedTime)
    );

    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      alert('❌ เวลานี้ถูกจองแล้ว');
      setLoading(false);
      return;
    }

    // ✅ ถ้ายังว่าง → เพิ่มข้อมูลใหม่
    await addDoc(bookingsRef, {
      userId: user.uid,
      facilityId: facility.id,
      facilityName: facility.name,
      facilityImage: facility.image,
      date: selectedDate.toISOString().split('T')[0],
      time: selectedTime,
      status: 'pending',
      createdAt: serverTimestamp(),
    });

    alert('✅ จองสำเร็จ!');
    router.push('/booking-success');
  } catch (err) {
    console.error('Error creating booking:', err);
    alert('เกิดข้อผิดพลาดในการจอง กรุณาลองใหม่อีกครั้ง');
  } finally {
    setLoading(false);
    setShowConfirmDialog(false);
  }
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
              disabled={!selectedDate || !selectedTime || loading}
              className={styles.confirmButton}
            >
              {loading ? 'กำลังจอง...' : 'ยืนยันการจอง'}
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
              disabled={loading}
            >
              {loading ? 'กำลังจอง...' : 'ยืนยัน'}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
