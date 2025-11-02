"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";

export default function WelcomePage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    setChecking(false);
  }, []);

  const handleStart = () => {
    const hasLoggedIn = localStorage.getItem("hasLoggedIn");
    if (hasLoggedIn === "true") {
      router.push("/homepage"); // ✅ เส้นทางต้องตรงกับไฟล์
    } else {
      router.push("/login");
    }
  };

  if (checking) return null;

  return (
    <>
      <Head>
        <title>Welcome to SPU Sport</title>
      </Head>
      <div className="welcome-wrapper">
        <h1>Welcome to SPU Sport</h1>
        <h2>Sripatum University</h2>
        <button className="btn-start" onClick={handleStart}>
          Start
        </button>
      </div>
    </>
  );
}
