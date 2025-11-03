"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LineCallback() {
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code"); // code จาก LINE
    const state = urlParams.get("state");

    if (code) {
      // เรียก API ของคุณเพื่อแลก access token และดึงข้อมูลผู้ใช้
      fetch("/api/lineLogin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("User info:", data);
          // redirect ไปหน้า profile หรือ home
          router.push("/profile");
        });
    }
  }, [router]);

  return <p>Loading...</p>;
}
