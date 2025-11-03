// /app/api/linelogin/route.js
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export async function POST(req) {
  const { code } = await req.json();

  // ใช้ JS ปกติ ไม่ใช้ !
  const clientId = process.env.LINE_CLIENT_ID;
  const clientSecret = process.env.LINE_CLIENT_SECRET;
  const redirectUri = process.env.LINE_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    return NextResponse.json({ error: "Missing LINE environment variables" }, { status: 500 });
  }

  // 1. แลก code เป็น access token
  const tokenRes = await fetch("https://api.line.me/oauth2/v2.1/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  const tokenData = await tokenRes.json();
  const accessToken = tokenData.access_token;

  // 2. ดึงข้อมูล profile
  const profileRes = await fetch("https://api.line.me/v2/profile", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const profile = await profileRes.json();

  // 3. เก็บลง Firebase
  await setDoc(doc(db, "users", profile.userId), {
    lineId: profile.userId,
    nameUser: profile.displayName,
    picture: profile.pictureUrl,
    timeDateLogin: serverTimestamp(),
  });

  return NextResponse.json(profile);
}