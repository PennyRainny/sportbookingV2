'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLineLogin = () => {
    setLoading(true);
    setTimeout(() => {
      login('student@spu.ac.th', '', 'user');
      setLoading(false);
      router.push('/home');
    }, 1500);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Background with gradient overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1609134154058-860440f6f609?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBmaWVsZCUyMHVuaXZlcnNpdHl8ZW58MXx8fHwxNzYyMDcwMDY4fDA&ixlib=rb-4.1.0&q=80&w=1080)',
          filter: 'blur(8px)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg, rgba(107, 138, 255, 0.7), rgba(255, 199, 211, 0.7), rgba(191, 162, 255, 0.7))',
        }}
      />

      {/* Glassmorphism Card */}
      <div
        className="relative z-10 w-full max-w-md rounded-3xl p-8 shadow-2xl backdrop-blur-md"
        style={{
          background: 'rgba(255, 255, 255, 0.25)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
        }}
      >
        {/* SPU Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full flex items-center justify-center bg-white">
            <span className="text-3xl text-[#6B8AFF] font-bold">SPU</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-center text-white mb-2 font-semibold text-xl">
          SPU Sport Booking
        </h1>
        <p className="text-center text-white/90 mb-8">
          Book your favorite sports field easily.
        </p>

        {/* LINE Login Button */}
        <Button
          onClick={handleLineLogin}
          disabled={loading}
          className="w-full rounded-xl py-6 transition-all hover:scale-105 shadow-lg"
          style={{
            backgroundColor: '#06C755',
            color: 'white',
          }}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Connecting to LINE…
            </>
          ) : (
            <>
              {/* LINE Icon */}
              <svg
                className="w-5 h-5 mr-2"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
              </svg>
              Login with LINE
            </>
          )}
        </Button>

        <p className="text-center text-white/80 mt-6 text-sm">
          Login via your LINE account to continue.
        </p>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 text-center text-white text-sm">
        © 2025 Sripatum University
      </div>
    </div>
  );
}
