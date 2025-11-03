import localFont from "next/font/local";
import "./globals.css";
import type { Metadata } from "next";
import { AuthProvider } from "@/contexts/AuthContext";
import { BookingProvider } from "@/contexts/BookingContext";
import { Toaster } from "@/components/ui/sonner";

// ✅ ใช้ฟอนต์ Geist จาก public/fonts/Geist/otf
const geistSans = localFont({
  src: [
    { path: "/fonts/Geist/otf/Geist-Regular.otf", weight: "400" },
    { path: "/fonts/Geist/otf/Geist-Medium.otf", weight: "500" },
    { path: "/fonts/Geist/otf/Geist-Bold.otf", weight: "700" },
  ],
  variable: "--font-geist-sans",
  display: "swap",
});

// ✅ ใช้ฟอนต์ GeistMono จาก public/fonts/GeistMono/otf
const geistMono = localFont({
  src: [
    { path: "/fonts/GeistMono/otf/GeistMono-Regular.otf", weight: "400" },
    { path: "/fonts/GeistMono/otf/GeistMono-Medium.otf", weight: "500" },
    { path: "/fonts/GeistMono/otf/GeistMono-Bold.otf", weight: "700" },
  ],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SPU Sport Home",
  description: "Facility booking system for SPU students and staff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
