import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export async function POST(req) {
  try {
    console.time("Parse body");
    const { code } = await req.json();
    console.timeEnd("Parse body");

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

    console.time("Fetch LINE token");
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
    console.timeEnd("Fetch LINE token");

    console.time("Parse token response");
    const tokenData = await tokenRes.json();
    console.timeEnd("Parse token response");

    const accessToken = tokenData?.access_token;
    if (typeof accessToken !== "string" || !accessToken.trim()) {
      return NextResponse.json({ error: "Failed to get access token" }, { status: 401 });
    }

    console.time("Fetch LINE profile");
    const profileRes = await fetch("https://api.line.me/v2/profile", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    console.timeEnd("Fetch LINE profile");

    console.time("Parse profile response");
    const profile = await profileRes.json();
    console.timeEnd("Parse profile response");

    const { userId, displayName, pictureUrl } = profile;
    if (
      typeof userId !== "string" ||
      typeof displayName !== "string" ||
      typeof pictureUrl !== "string"
    ) {
      return NextResponse.json({ error: "Invalid profile data" }, { status: 422 });
    }

    console.time("Write to Firestore");
    const safeUser = {
      lineId: userId,
      nameUser: displayName,
      picture: pictureUrl,
      timeDateLogin: serverTimestamp(),
    };
    await setDoc(doc(db, "users", userId), safeUser);
    console.timeEnd("Write to Firestore");

    return NextResponse.json(profile);
  } catch (err) {
    console.error("LINE Login Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
