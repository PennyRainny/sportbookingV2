// app/api/saveUser/route.js
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function POST(request) {
  try {
    const { lineId, name } = await request.json();

    if (!lineId || !name) {
      return new Response(JSON.stringify({ error: "Missing lineId or name" }), { status: 400 });
    }

    const docRef = await addDoc(collection(db, "users"), { 
      lineId,
      name,
      date: serverTimestamp(),
    });

    return new Response(JSON.stringify({ id: docRef.id, message: "User saved successfully" }), { status: 200 });
  } catch (error) {
    console.error("Error saving user:", error);
    return new Response(JSON.stringify({ error: "Failed to save user" }), { status: 500 });
  }
}
