"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import styles from "./login.module.css"; // ใช้ CSS UI ที่คุณทำไว้
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth(); // ถ้ามี context สำหรับ login

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

  const handleLineLogin = async () => {
    setLoading(true);
    try {
      // TODO: เชื่อม LINE SDK จริง ๆ
      // ตอนนี้เป็นตัวอย่าง ใช้ค่า static
      const lineId = "USER_LINE_ID"; 
      const name = "User Name";

      // บันทึกผู้ใช้ลง Firebase
      await saveUserToFirebase(lineId, name);

      // login local/context ถ้ามี
      login(lineId, "", "user");

      router.push("/home");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Background */}
      <div
        className={styles.bgBlur}
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1609134154058-860440f6f609?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBmaWVsZCUyMHVuaXZlcnNpdHl8ZW58MXx8fHwxNzYyMDcwMDY4fDA&ixlib=rb-4.1.0&q=80&w=1080)",
        }}
      />
      <div className={styles.bgGradientOverlay} />

      {/* Glass Card */}
      <div className={styles.glassCard}>
        <div className={styles.logoWrapper}>
          <div className={styles.logoCircle}>
            <span className={styles.logoText}>SPU</span>
          </div>
        </div>

        <h1 className={styles.title}>SPU Sport Booking</h1>
        <p className={styles.subtitle}>Book your favorite sports field easily.</p>

        {/* ปุ่ม LINE Login */}
        <Button
          onClick={handleLineLogin}
          disabled={loading}
          variant="default"
          size="lg"
          className={styles.lineButton}
        >
          {loading ? (
            <>
              <Loader2 className={styles.loaderIcon} />
              Connecting to LINE…
            </>
          ) : (
            <>
              <svg className={styles.lineIcon} viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.365 9.863c... (same path)" />
              </svg>
              Login with LINE
            </>
          )}
        </Button>

        <p className={styles.loginNote}>Login via your LINE account to continue.</p>
      </div>

      <div className={styles.footer}>© 2025 Sripatum University</div>
    </div>
  );
}
