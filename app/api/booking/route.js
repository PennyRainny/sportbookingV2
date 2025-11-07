// /app/api/booking/route.js

import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";

// ✅ สร้างการจองใหม่
export async function POST(request) {
  try {
    const {
      userId,
      facilityId,
      facilityName,
      facilityImage,
      date,
      time,
      status,
    } = await request.json();

    // ✅ ตรวจสอบค่าที่จำเป็น
    if (!userId || !facilityId || !facilityName || !date || !time) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    const bookingsRef = collection(db, "bookings");

    // ✅ ตรวจสอบว่าช่วงเวลานั้นถูกจองไปแล้วหรือยัง
    const checkQuery = query(
      bookingsRef,
      where("facilityId", "==", facilityId),
      where("date", "==", date),
      where("time", "==", time)
    );

    const snapshot = await getDocs(checkQuery);

    if (!snapshot.empty) {
      return new Response(
        JSON.stringify({ error: "This time slot is already booked" }),
        { status: 400 }
      );
    }

    // ✅ เพิ่มข้อมูลใหม่ลง Firestore
    await addDoc(bookingsRef, {
      userId,
      facilityId,
      facilityName,
      facilityImage,
      date,
      time,
      status: status || "pending",
      createdAt: serverTimestamp(),
    });

    return new Response(
      JSON.stringify({ message: "Booking Created Successfully" }),
      { status: 201 }
    );
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
