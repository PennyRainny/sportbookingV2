"use client";

import React, { useState } from "react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, UserX } from "lucide-react";
import { toast } from "sonner";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

// ✅ Mock user data
const mockUsers = [
  {
    id: "user-1",
    name: "Student User",
    email: "student@spu.ac.th",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=student1",
    joinedVia: "LINE",
    totalBookings: 5,
    status: "active",
  },
  {
    id: "user-2",
    name: "John Doe",
    email: "john.doe@spu.ac.th",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    joinedVia: "LINE",
    totalBookings: 12,
    status: "active",
  },
  {
    id: "user-3",
    name: "Jane Smith",
    email: "jane.smith@spu.ac.th",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
    joinedVia: "LINE",
    totalBookings: 8,
    status: "active",
  },
  {
    id: "user-4",
    name: "Mike Johnson",
    email: "mike.j@spu.ac.th",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
    joinedVia: "LINE",
    totalBookings: 3,
    status: "active",
  },
];

export default function ManageUsers() {
  const [users] = useState(mockUsers);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeactivateUser = (userName: string) => {
    toast.success("User deactivated!", {
      description: `${userName}'s account has been deactivated.`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="ml-64 p-8">
        <div className="mb-8">
          <h1 className="mb-2">Manage Users</h1>
          <p className="text-gray-600">View and manage registered users.</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or email..."
            className="pl-10 rounded-xl"
          />
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Joined Via</TableHead>
                <TableHead>Total Bookings</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <ImageWithFallback
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <span>{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-xl text-sm">
                      {user.joinedVia}
                    </span>
                  </TableCell>
                  <TableCell>{user.totalBookings}</TableCell>
                  <TableCell>
                    <span
                      className="px-3 py-1 rounded-xl text-sm text-white"
                      style={{ backgroundColor: "#6B8AFF" }}
                    >
                      {user.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-xl text-red-600 border-red-600"
                      onClick={() => handleDeactivateUser(user.name)}
                    >
                      <UserX className="w-4 h-4 mr-2" />
                      Deactivate
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredUsers.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No users found matching your search.
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="mt-6 text-gray-600 text-sm">
          Showing {filteredUsers.length} of {users.length} users
        </div>
      </main>
    </div>
  );
}
