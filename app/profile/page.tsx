"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // ✅ ใช้ Next.js router
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, RefreshCw, Save } from "lucide-react";
import { toast } from "sonner";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

export default function ProfilePage() {
  const router = useRouter(); // ✅ แทน useNavigate
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  const handleSyncFromLine = () => {
    toast.success("Data synced from LINE!", {
      description: "Your profile has been updated with the latest data from LINE.",
    });
  };

  const handleSave = () => {
    toast.success("Profile updated!", {
      description: "Your profile information has been saved.",
    });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-purple-50">
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-8">
        <Button
          onClick={() => router.push("/home")}
          variant="ghost"
          className="mb-6 rounded-xl flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Button>

        <h1 className="mb-8" style={{ color: "#6B8AFF" }}>
          My Profile
        </h1>

        <div className="bg-white rounded-3xl shadow-lg p-8">
          {/* Avatar Section */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <ImageWithFallback
                src={user.avatar}
                alt={user.name}
                className="w-32 h-32 rounded-full"
              />
              <div
                className="absolute bottom-0 right-0 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
                style={{ backgroundColor: "#6B8AFF" }}
              >
                <RefreshCw className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="space-y-6 mb-8">
            <div>
              <Label htmlFor="name" className="mb-2 block">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-xl"
              />
            </div>
            <div>
              <Label htmlFor="email" className="mb-2 block">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4">
            <Button
              onClick={handleSyncFromLine}
              className="w-full rounded-xl py-6 transition-all hover:scale-105 flex items-center justify-center gap-2"
              style={{ backgroundColor: "#06C755" }}
            >
              <RefreshCw className="w-5 h-5" />
              Sync Data from LINE
            </Button>
            <Button
              onClick={handleSave}
              className="w-full rounded-xl py-6 transition-all hover:scale-105 flex items-center justify-center gap-2"
              style={{ backgroundColor: "#6B8AFF" }}
            >
              <Save className="w-5 h-5" />
              Save Changes
            </Button>
          </div>

          {/* LINE Account Info */}
          <div className="mt-8 pt-8 border-t">
            <p className="text-gray-500 text-sm text-center">
              Logged in via LINE Account
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}