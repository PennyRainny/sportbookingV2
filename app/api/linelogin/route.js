import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export async function POST(req) {
  try {
    const { code } = await req.json();
    if (typeof code !== "string" || !code.trim()) {
      console.error("Missing or invalid code:", code);
      return NextResponse.json({ error: "Missing or invalid code" }, { status: 400 });
    }

    const clientId = process.env.LINE_CLIENT_ID;
    const clientSecret = process.env.LINE_CLIENT_SECRET;
    const redirectUri = process.env.LINE_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
      console.error("Missing LINE env:", { clientId, clientSecret, redirectUri });
      return NextResponse.json({ error: "Missing LINE environment variables" }, { status: 500 });
    }

    // 🔐 Request access token
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

    if (!tokenRes.ok) {
      const errorText = await tokenRes.text();
      console.error("LINE token error:", tokenRes.status, errorText);
      return NextResponse.json({ error: "Token request failed" }, { status: tokenRes.status });
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData?.access_token;
    if (!accessToken || typeof accessToken !== "string") {
      console.error("Missing access token:", tokenData);
      return NextResponse.json({ error: "Failed to get access token" }, { status: 401 });
    }

    // 👤 Request profile
    const profileRes = await fetch("https://api.line.me/v2/profile", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!profileRes.ok) {
      const errorText = await profileRes.text();
      console.error("LINE profile error:", profileRes.status, errorText);
      return NextResponse.json({ error: "Profile request failed" }, { status: profileRes.status });
    }

    const profile = await profileRes.json();
    console.log("LINE profile raw:", profile);

    const { userId, displayName, pictureUrl } = profile;
    if (!userId || !displayName) {
      console.error("Invalid profile data:", profile);
      return NextResponse.json({ error: "Invalid profile data" }, { status: 422 });
    }

    // 📝 Save to Firestore
    try {
      const safeUser = {
        lineId: userId,
        nameUser: displayName,
        picture: pictureUrl || "",
        timeDateLogin: serverTimestamp(),
      };
      await setDoc(doc(db, "users", userId), safeUser);
    } catch (firestoreErr) {
      console.error("Firestore error:", firestoreErr);
      return NextResponse.json({ error: "Failed to save user" }, { status: 500 });
    }

    return NextResponse.json({ userId, displayName, pictureUrl: pictureUrl || "" });
  } catch (err) {
    console.error("LINE Login Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
