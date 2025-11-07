// /app/api/booking/route.js

import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, where, serverTimestamp } from "firebase/firestore";

// ✅ สร้างการจองใหม่
export async function POST(request) {
  try {
    const { userId, fieldName, date, timeSlot } = await request.json();

    if (!userId || !fieldName || !date || !timeSlot) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    // เพิ่มข้อมูลใหม่ใน Firestore
    const bookingCheck = collection(db, "bookings");
    const checkQuery = query(
      bookingCheck,
      where("fieldName", "==", fieldName),
      where("date", "==", date),
      where("timeSlot", "==", timeSlot),
    );

    const haveBooking = await getDocs(checkQuery);

    if(!haveBooking.empty){
      return new Response(JSON.stringify({ error: "This time slot is has booked" }), { status: 400 });
    };


  await addDoc(bookingCheck, {
    userId,
    fieldName,
    data,
    timeSlot,
    status: "pending",
    createTime: serverTimestamp(),
  
  });
     return new Response(JSON.stringify({ error: "Booking Created Successfully" }), { status: 400 });
  } catch (error) {
    console.error("Error creating booking:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create booking" }),
      { status: 500 }
    );
  }
}
    

// ✅ ดึงรายการจองทั้งหมด หรือกรองตาม userId
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const bookingsRef = collection(db, "bookings");

    // ถ้ามี userId → ดึงเฉพาะของคนนั้น
    const q = userId
      ? query(bookingsRef, where("userId", "==", userId))
      : query(bookingsRef);

    const snapshot = await getDocs(q);
    const bookings = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return new Response(JSON.stringify(bookings), { status: 200 });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch bookings" }),
      { status: 500 }
    );
  }
}
