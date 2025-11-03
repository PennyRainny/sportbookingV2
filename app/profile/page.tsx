'use client';

import React, { useEffect, useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { db, storage } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth } from "firebase/auth";
import styles from "./profilePage.module.css";

interface User {
  name: string;
  email: string;
  photoURL?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoURL, setPhotoURL] = useState<string>("");

  useEffect(() => {
    if (!userId) return;
    const fetchUser = async () => {
      try {
        const docSnap = await getDoc(doc(db, "users", userId));
        if (docSnap.exists()) {
          const data = docSnap.data() as User;
          setUser(data);
          setPhotoURL(data.photoURL || "");
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoFile(e.target.files[0]);
    }
  };

  const handleUploadPhoto = async () => {
    if (!photoFile || !userId) return;
    try {
      const photoRef = ref(storage, `profilePhotos/${userId}`);
      await uploadBytes(photoRef, photoFile);
      const downloadURL = await getDownloadURL(photoRef);
      await setDoc(
        doc(db, "users", userId),
        { photoURL: downloadURL, updatedAt: serverTimestamp() },
        { merge: true }
      );
      setPhotoURL(downloadURL);
      alert("Profile picture updated!");
    } catch (err) {
      console.error("Failed to upload photo:", err);
      alert("Failed to upload photo");
    }
  };

  if (loading) return <p className={styles.status}>Loading...</p>;

  return (
    <div className={styles.pageWrapper}>
      <header className={styles.header}>
        <span className={styles.logo}>SPU Sport Booking</span>
        <div className={styles.headerRight}>
          <span className={styles.userLabel}>{user?.name}</span>
          <button onClick={() => router.push("/login")} className={styles.logoutButton}>
            Logout
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <button onClick={() => router.push("/home")} className={styles.backButton}>
          ← Back to Home
        </button>

        <h1 className={styles.title}>My Profile</h1>

        <div className={styles.card}>
          <div className={styles.avatarWrapper}>
            <img
              src={photoURL || "/default-avatar.png"}
              alt="Profile"
              className={styles.avatar}
            />
            <div className={styles.syncIcon}>🔄</div>
          </div>

          <div style={{ textAlign: "center", marginBottom: "16px" }}>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>

          <div className={styles.field}>
            <label>Name</label>
            <input value={user?.name || ""} disabled className={styles.input} />
          </div>

          <div className={styles.field}>
            <label>Email</label>
            <input value={user?.email || ""} disabled className={styles.input} />
          </div>

          <div className={styles.buttonGroup}>
            <button className={styles.syncButton}>Sync Data from LINE</button>
            <button onClick={handleUploadPhoto} className={styles.saveButton}>
              Save Changes
            </button>
          </div>

          <div className={styles.footer}>Logged in via LINE Account.</div>
        </div>
      </main>
    </div>
  );
}
