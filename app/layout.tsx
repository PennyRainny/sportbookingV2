import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// ✅ Context และ Toaster เป็น client component
import { AuthProvider } from "@/contexts/AuthContext";
import { BookingProvider } from "@/contexts/BookingContext";
import { Toaster } from "@/components/ui/sonner"; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Context เป็น Client Component */}
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