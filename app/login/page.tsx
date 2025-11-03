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

  // บันทึก user ลง Firebase
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

  // ดึง code จาก URL แล้วเรียก /api/linelogin
  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");
    if (code) {
      setLoading(true);

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 7000); // timeout 7s

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

  return (
    <div className={styles.pageWrapper}>
      <div
        className={styles.bgBlur}
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1609134154058-860440f6f609?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBmaWVsZCUyMHVuaXZlcnNpdHl8ZW58MXx8fHwxNzYyMDcwMDY4fDA&ixlib=rb-4.1.0&q=80&w=1080)",
        }}
      />
      <div className={styles.bgGradientOverlay} />

      <div className={styles.glassCard}>
        <div className={styles.logoWrapper}>
          <div className={styles.logoCircle}>
            <span className={styles.logoText}>SPU</span>
          </div>
        </div>

        <h1 className={styles.title}>SPU Sport Booking</h1>
        <p className={styles.subtitle}>Book your favorite sports field easily.</p>

        <button className={styles.lineButton} disabled>
          <Loader2 className={styles.loaderIcon} />
          {loading ? "Connecting to LINE…" : "Waiting for LINE redirect…"}
        </button>

        <p className={styles.loginNote}>Login via your LINE account to continue.</p>
      </div>

      <div className={styles.footer}>© 2025 Sripatum University</div>
    </div>
  );
}
