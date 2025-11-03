import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export async function POST(req) {
  try {
    const { code } = await req.json();

    if (typeof code !== "string" || !code.trim()) {
      return NextResponse.json({ error: "Missing or invalid code" }, { status: 400 });
    }

    const clientId = process.env.LINE_CLIENT_ID;
    const clientSecret = process.env.LINE_CLIENT_SECRET;
    const redirectUri = process.env.LINE_REDIRECT_URI;

    if (
      typeof clientId !== "string" ||
      typeof clientSecret !== "string" ||
      typeof redirectUri !== "string"
    ) {
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
    const accessToken = tokenData?.access_token;

    if (typeof accessToken !== "string" || !accessToken.trim()) {
      return NextResponse.json({ error: "Failed to get access token" }, { status: 401 });
    }

    // 2. ดึงข้อมูล profile
    const profileRes = await fetch("https://api.line.me/v2/profile", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const profile = await profileRes.json();

    // 3. ตรวจสอบข้อมูลก่อนเขียน
    const { userId, displayName, pictureUrl } = profile;

    if (
      typeof userId !== "string" ||
      typeof displayName !== "string" ||
      typeof pictureUrl !== "string"
    ) {
      return NextResponse.json({ error: "Invalid profile data" }, { status: 422 });
    }

    // 4. เขียนลง Firestore แบบปลอดภัย
    const safeUser = {
      lineId: userId,
      nameUser: displayName,
      picture: pictureUrl,
      timeDateLogin: serverTimestamp(),
    };

    await setDoc(doc(db, "users", userId), safeUser);

    return NextResponse.json(profile);
  } catch (err) {
    console.error("LINE Login Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
