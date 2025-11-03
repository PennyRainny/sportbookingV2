"use client";
import React from 'react';
import { AdminSidebar } from '@/components/AdminSidebar';
import { useBooking } from '@/contexts/BookingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, Building2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const AdminDashboard: React.FC = () => {
  const { facilities, bookings } = useBooking();

  const statsData = [
    {
      title: 'Total Users',
      value: '245',
      icon: Users,
      color: '#6B8AFF',
    },
    {
      title: 'Total Bookings',
      value: bookings.length.toString(),
      icon: Calendar,
      color: '#FFC7D3',
    },
    {
      title: 'Active Fields',
      value: facilities.filter((f) => f.status === 'open').length.toString(),
      icon: Building2,
      color: '#BFA2FF',
    },
  ];

  const chartData = [
    { sport: 'Football', bookings: 35 },
    { sport: 'Basketball', bookings: 28 },
  ];

  const latestBookings = bookings.slice(0, 5);

  const statusColors = {
    approved: '#6B8AFF',
    pending: '#FFC7D3',
    cancelled: '#BFA2FF',
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="ml-64 p-8">
        <div className="mb-8">
          <h1 className="mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {statsData.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="rounded-2xl border-0 shadow-md">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: stat.color + '20' }}
                  >
                    <Icon className="w-5 h-5" style={{ color: stat.color }} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl">{stat.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Chart Section */}
        <Card className="rounded-2xl border-0 shadow-md mb-8">
          <CardHeader>
            <CardTitle>Bookings by Sport Type</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="sport" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="bookings" fill="#6B8AFF" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Latest Bookings */}
        <Card className="rounded-2xl border-0 shadow-md">
          <CardHeader>
            <CardTitle>Latest Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking ID</TableHead>
                  <TableHead>Facility</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {latestBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>{booking.id}</TableCell>
                    <TableCell>{booking.facilityName}</TableCell>
                    <TableCell>{formatDate(booking.date)}</TableCell>
                    <TableCell>{booking.time}</TableCell>
                    <TableCell>
                      <Badge
                        style={{
                          backgroundColor: statusColors[booking.status],
                          color: 'white',
                        }}
                      >
                        {booking.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;