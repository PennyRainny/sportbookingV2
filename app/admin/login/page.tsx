"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // ✅ ใช้ของ Next.js
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const router = useRouter(); // ✅ แทน useNavigate

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password, "admin");
    router.push("/admin/dashboard"); // ✅ แก้จาก navigate
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        {/* SPU Logo */}
        <div className="flex justify-center mb-6">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "#6B8AFF" }}
          >
            <span className="text-3xl text-white">SPU</span>
          </div>
        </div>

        <h1 className="text-center mb-2">Admin Login</h1>
        <p className="text-center text-gray-600 mb-8">
          Login to SPU Sport Booking Dashboard
        </p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <Label htmlFor="email" className="mb-2 block">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@spu.ac.th"
              className="rounded-xl"
              required
            />
          </div>
          <div>
            <Label htmlFor="password" className="mb-2 block">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="rounded-xl"
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full rounded-xl py-6 transition-all hover:scale-105"
            style={{ backgroundColor: "#6B8AFF" }}
          >
            Login to Dashboard
          </Button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          © 2025 Sripatum University
        </p>
      </div>
    </div>
  );
}
