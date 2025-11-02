'use client';

import React, { useState } from 'react';
import { AdminSidebar } from '@/components/AdminSidebar';
import { useBooking } from '@/contexts/BookingContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Check, X, Search } from 'lucide-react';
import { toast } from 'sonner';

const ManageBookingsPage: React.FC = () => {
  const { bookings, updateBookingStatus } = useBooking();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSport, setFilterSport] = useState<'all' | 'football' | 'basketball'>('all');

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.facilityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  const statusColors = {
    approved: '#6B8AFF',
    pending: '#FFC7D3',
    cancelled: '#BFA2FF',
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleApprove = (bookingId: string, facilityName: string) => {
    updateBookingStatus(bookingId, 'approved');
    toast.success('Booking approved!', {
      description: `Booking for ${facilityName} has been approved.`,
    });
  };

  const handleCancel = (bookingId: string, facilityName: string) => {
    updateBookingStatus(bookingId, 'cancelled');
    toast.success('Booking cancelled!', {
      description: `Booking for ${facilityName} has been cancelled.`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="ml-64 p-8">
        <div className="mb-8">
          <h1 className="mb-2">Manage Bookings</h1>
          <p className="text-gray-600">Review and manage all facility bookings.</p>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by booking ID or facility name..."
              className="pl-10 rounded-xl"
            />
          </div>
          <select
            value={filterSport}
            onChange={(e) => setFilterSport(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-xl"
          >
            <option value="all">All Sports</option>
            <option value="football">Football</option>
            <option value="basketball">Basketball</option>
          </select>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Field</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>{booking.id}</TableCell>
                  <TableCell>{booking.userId}</TableCell>
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
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {booking.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            className="rounded-xl"
                            style={{ backgroundColor: '#6B8AFF' }}
                            onClick={() => handleApprove(booking.id, booking.facilityName)}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-xl text-red-600 border-red-600"
                            onClick={() => handleCancel(booking.id, booking.facilityName)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      {booking.status === 'approved' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-xl text-red-600 border-red-600"
                          onClick={() => handleCancel(booking.id, booking.facilityName)}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredBookings.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No bookings found matching your criteria.
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ManageBookingsPage;
