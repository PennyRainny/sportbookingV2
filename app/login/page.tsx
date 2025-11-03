"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, fetchSignInMethodsForEmail } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import styles from "./login.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ identifier: "", password: "" }); // identifier = email หรือ username
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    if (!form.identifier || !form.password) {
      return alert("กรุณากรอก Email/Username และรหัสผ่าน");
    }

    setLoading(true);

    try {
      let emailToLogin = form.identifier;

      // ตรวจสอบว่า input เป็น username หรือ email
      if (!emailToLogin.includes("@")) {
        // สมมติว่าเป็น username → หา email จาก Firestore
        const q = query(collection(db, "users"), where("username", "==", form.identifier));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          alert("Username ไม่ถูกต้อง");
          setLoading(false);
          return;
        }
        const userData = querySnapshot.docs[0].data();
        emailToLogin = userData.email;
      }

      // ล็อกอินด้วย email/password
      await signInWithEmailAndPassword(auth, emailToLogin, form.password);
      router.push("/home");
    } catch (err: any) {
      console.error(err);
      alert("Email/Username หรือรหัสผ่านไม่ถูกต้อง");
    } finally {
      setLoading(false);
    }
  };

  const redirectToLINE = () => {
    const clientId = process.env.NEXT_PUBLIC_LINE_CLIENT_ID;
    const redirectUri = encodeURIComponent(process.env.NEXT_PUBLIC_LINE_REDIRECT_URI || "");
    const state = "secure_random_state";
    const scope = "profile openid";
    const lineUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}&prompt=login`;
    window.location.href = lineUrl;
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.bgBlur} style={{ backgroundImage: "url('/images/sport-bg.jpg')" }} />
      <div className={styles.bgGradientOverlay} />

      <div className={styles.glassCard}>
        <div className={styles.logoWrapper}>
          <div className={styles.logoCircle}>
            <span className={styles.logoText}>SPU</span>
          </div>
        </div>

        <h1 className={styles.title}>Login</h1>
        <p className={styles.subtitle}>Access your SPU Sport Booking account</p>

        <input
          className={styles.inputField}
          placeholder="Email หรือ Username"
          name="identifier"
          value={form.identifier}
          onChange={handleChange}
        />
        <input
          className={styles.inputField}
          type="password"
          placeholder="Password"
          name="password"
          value={form.password}
          onChange={handleChange}
        />

        <button
          className={styles.loginButton}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <hr className="my-4 border-white/30" />

        <button className={styles.lineButton} onClick={redirectToLINE}>
          Login with LINE
        </button>

        <p className={styles.loginNote}>
          Don't have an account?{" "}
          <span
            style={{ textDecoration: "underline", cursor: "pointer" }}
            onClick={() => router.push("/register")}
          >
            Register here
          </span>
        </p>
      </div>

      <div className={styles.footer}>© 2025 Sripatum University</div>
    </div>
  );
}
