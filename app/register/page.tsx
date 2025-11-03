"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import styles from "../login/login.module.css";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    const { name, username, email, password } = form;
    if (!name || !username || !email || !password) return alert("กรอกข้อมูลให้ครบ");

    setLoading(true);

    try {
      // ตรวจสอบ username ซ้ำใน Firestore
      const docRef = doc(db, "users", username);
      const exists = await getDoc(docRef);
      if (exists.exists()) return alert("Username ซ้ำแล้ว");

      // สร้างบัญชี Firebase Auth
      await createUserWithEmailAndPassword(auth, email, password);

      // เก็บข้อมูลลง Firestore
      await setDoc(doc(db, "users", username), {
        username,
        name,
        email,
        password, // ถ้าต้องการเก็บ password
        createdAt: serverTimestamp(),
      });

      alert("สมัครเรียบร้อย");
      router.push("/login");
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
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

        <h1 className={styles.title}>Register</h1>
        <p className={styles.subtitle}>Create your SPU Sport Booking account</p>

        <input
          className={styles.inputField}
          placeholder="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
        />
        <input
          className={styles.inputField}
          placeholder="Username"
          name="username"
          value={form.username}
          onChange={handleChange}
        />
        <input
          className={styles.inputField}
          placeholder="Email"
          name="email"
          value={form.email}
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
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className={styles.loginNote}>
          Already have an account?{" "}
          <span
            style={{ textDecoration: "underline", cursor: "pointer" }}
            onClick={() => router.push("/login")}
          >
            Login here
          </span>
        </p>
      </div>

      <div className={styles.footer}>© 2025 Sripatum University</div>
    </div>
  );
}
