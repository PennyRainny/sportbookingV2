"use client";

import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation'; // ✅ ใช้ของ Next.js
import { Button } from './ui/button';
import { LogOut, User } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const router = useRouter(); // ✅ แทน useNavigate

  const handleLogout = () => {
    logout();
    router.push('/'); // ✅ แก้จาก navigate('/')
  };

  const handleProfile = () => {
    router.push('/profile'); // ✅ แก้จาก navigate('/profile')
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div
          className="cursor-pointer"
          onClick={() => router.push('/home')} // ✅ แก้จาก navigate('/home')
        >
          <h2 style={{ color: '#6B8AFF' }}>SPU Sport Booking</h2>
        </div>
        <div className="flex items-center gap-4">
          {user && (
            <>
              <Button
                variant="ghost"
                onClick={handleProfile}
                className="flex items-center gap-2 rounded-xl"
              >
                <User className="w-4 h-4" />
                <span>{user.name}</span>
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-xl"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
