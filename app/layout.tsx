// app/layout.tsx
import "./globals.css";
import localFont from "next/font/local";
import React, { ReactNode } from "react";
import type { Metadata } from "next";
import { AuthProvider } from "@/contexts/AuthContext";
import { BookingProvider } from "@/contexts/BookingContext";
import { Toaster } from "@/components/ui/sonner";

// ------------------------------
// ฟอนต์จาก public/fonts
// ------------------------------
const geistSans = localFont({
  src: [
    { path: "/fonts/Geist/otf/Geist-Regular.otf", weight: "400" },
    { path: "/fonts/Geist/otf/Geist-Medium.otf", weight: "500" },
    { path: "/fonts/Geist/otf/Geist-Bold.otf", weight: "700" },
    { path: "/fonts/Geist/otf/Geist-Black.otf", weight: "900" },
  ],
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = localFont({
  src: [
    { path: "/fonts/GeistMono/otf/GeistMono-Regular.otf", weight: "400" },
    { path: "/fonts/GeistMono/otf/GeistMono-Medium.otf", weight: "500" },
    { path: "/fonts/GeistMono/otf/GeistMono-Bold.otf", weight: "700" },
  ],
  variable: "--font-geist-mono",
  display: "swap",
});

// ------------------------------
// Metadata
// ------------------------------
export const metadata: Metadata = {
  title: "SPU Sport Home",
  description: "Facility booking system for SPU students and staff",
};

// ------------------------------
// RootLayout
// ------------------------------
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased">
        <AuthProvider>
          <BookingProvider>
            {children}
            <Toaster position="top-right" richColors />
          </BookingProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
