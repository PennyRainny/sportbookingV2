import localFont from "next/font/local";
import "./globals.css";

import { AuthProvider } from "@/contexts/AuthContext";
import { BookingProvider } from "@/contexts/BookingContext";
import { Toaster } from "@/components/ui/sonner";

const geistSans = localFont({
  src: "./fonts/Geist-Regular.otf",
  variable: "--font-geist-sans",
});

const geistMono = localFont({
  src: "./fonts/GeistMono-Regular.otf",
  variable: "--font-geist-mono",
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
