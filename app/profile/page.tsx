"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import styles from "./profile.module.css";

interface User {
  lineId: string;
  nameUser: string;
  picture: string;
  email?: string;
  timeDateLogin?: any;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const userId = "USER_LINE_ID"; // TODO: replace with actual session

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const docSnap = await getDoc(doc(db, "users", userId));
        if (docSnap.exists()) {
          const data = docSnap.data() as User;
          setUser(data);
          setName(data.nameUser || "");
          setEmail(data.email || "");
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleSyncFromLine = () => {
    alert("Data synced from LINE!");
  };

  const handleSave = () => {
    alert("Profile updated!");
  };

  if (loading) return <p className={styles.status}>Loading...</p>;

  return (
    <div className={styles.pageWrapper}>
      <header className={styles.header}>
        <span className={styles.logo}>SPU Sport Booking</span>
        <div className={styles.headerRight}>
          <span className={styles.userLabel}>Student User</span>
          <button className={styles.logoutButton}>Logout</button>
        </div>
      </header>

      <main className={styles.main}>
        <button onClick={() => router.push("/home")} className={styles.backButton}>
          ← Back to Home
        </button>

        <h1 className={styles.title}>My Profile</h1>

        <div className={styles.card}>
          <div className={styles.avatarWrapper}>
            <img src={user?.picture} alt={user?.nameUser} className={styles.avatar} />
            <div className={styles.syncIcon}>🔄</div>
          </div>

          <div className={styles.field}>
            <label>Name</label>
            <input value={name} disabled className={styles.input} />
          </div>

          <div className={styles.field}>
            <label>Email</label>
            <input value={email} disabled className={styles.input} />
          </div>

          <div className={styles.buttonGroup}>
            <button onClick={handleSyncFromLine} className={styles.syncButton}>
              Sync Data From LINE
            </button>
            <button onClick={handleSave} className={styles.saveButton}>
              Save Changes
            </button>
          </div>

          <div className={styles.footer}>Logged in via LINE Account</div>
        </div>
      </main>
    </div>
  );
}
