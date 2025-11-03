"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import styles from "./login.module.css";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const saveUserToFirebase = async (lineId: string, name: string) => {
    try {
      const res = await fetch("/api/saveUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lineId, name }),
      });
      return await res.json();
    } catch (err) {
      console.error("Failed to save user:", err);
    }
  };

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");
    if (code) {
      setLoading(true);

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 7000);

      fetch("/api/linelogin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
        signal: controller.signal,
      })
        .then(res => res.json())
        .then(async data => {
          if (data?.userId && data?.displayName) {
            await saveUserToFirebase(data.userId, data.displayName);
            login(data.userId, "", "user");
            router.push("/home");
          } else {
            router.push("/login?error=invalid_profile");
          }
        })
        .catch(() => {
          router.push("/login?error=timeout");
        })
        .finally(() => {
          clearTimeout(timeout);
          setLoading(false);
        });
    }
  }, []);

  const redirectToLINE = () => {
    const clientId = process.env.NEXT_PUBLIC_LINE_CLIENT_ID;
    const redirectUri = encodeURIComponent(process.env.NEXT_PUBLIC_LINE_REDIRECT_URI || "");
    const state = "secure_random_state";
    const scope = "profile openid";

    if (!clientId || clientId === "undefined") {
      alert("LINE Client ID is missing. Please check your environment variables.");
      return;
    }

    const lineUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}&prompt=login`;
    window.location.href = lineUrl;
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.bgBlur} style={{ backgroundImage: "url(...)" }} />
      <div className={styles.bgGradientOverlay} />

      <div className={styles.glassCard}>
        <div className={styles.logoWrapper}>
          <div className={styles.logoCircle}>
            <span className={styles.logoText}>SPU</span>
          </div>
        </div>

        <h1 className={styles.title}>SPU Sport Booking</h1>
        <p className={styles.subtitle}>Book your favorite sports field easily.</p>

        <button
          className={styles.lineButton}
          onClick={redirectToLINE}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className={styles.loaderIcon} />
              Connecting to LINE…
            </>
          ) : (
            <>
              <svg className={styles.lineIcon} viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.365 9.863c..." />
              </svg>
              Login with LINE
            </>
          )}
        </button>

        <p className={styles.loginNote}>Login via your LINE account to continue.</p>
      </div>

      <div className={styles.footer}>© 2025 Sripatum University</div>
    </div>
  );
}
