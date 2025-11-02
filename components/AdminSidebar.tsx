"use client"; // บังคับให้เป็น Client Component

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Building2, Calendar, Users, LogOut } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export const AdminSidebar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
    { icon: Building2, label: "Facilities", path: "/admin/facilities" },
    { icon: Calendar, label: "Bookings", path: "/admin/bookings" },
    { icon: Users, label: "Users", path: "/admin/users" },
  ];

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  return (
    <div className="w-64 bg-white h-screen shadow-lg fixed left-0 top-0 flex flex-col">
      <div className="p-6 border-b">
        <h3 style={{ color: "#6B8AFF" }}>SPU Admin</h3>
      </div>
      <nav className="flex-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all ${
                isActive ? "text-white" : "text-gray-700 hover:bg-gray-100"
              }`}
              style={isActive ? { backgroundColor: "#6B8AFF" } : {}}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};
