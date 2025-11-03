// /app/api/saveUser/route.js
import { db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export async function POST(request) {
  try {
    const { lineId, name } = await request.json();

    if (typeof lineId !== "string" || typeof name !== "string") {
      return new Response(JSON.stringify({ error: "Invalid lineId or name" }), { status: 400 });
    }

    const userRef = doc(db, "users", lineId);
    await setDoc(userRef, {
      name,
      date: serverTimestamp(),
    });

    return new Response(JSON.stringify({ id: lineId, message: "User saved successfully" }), { status: 200 });
  } catch (error) {
    console.error("Error saving user:", error);
    return new Response(JSON.stringify({ error: "Failed to save user" }), { status: 500 });
  }
}
