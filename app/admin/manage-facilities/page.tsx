"use client";

import React, { useState } from "react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { useBooking } from "@/contexts/BookingContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, ToggleLeft, ToggleRight } from "lucide-react";
import { toast } from "sonner";

export default function ManageFacilities() {
  const { facilities } = useBooking();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [facilityName, setFacilityName] = useState("");
  const [facilityType, setFacilityType] = useState("football");
  const [facilityDescription, setFacilityDescription] = useState("");

  const handleAddFacility = () => {
    toast.success("Facility added!", {
      description: `${facilityName} has been added successfully.`,
    });
    setShowAddDialog(false);
    setFacilityName("");
    setFacilityDescription("");
  };

  const handleToggleStatus = (facilityName: string, currentStatus: string) => {
    const newStatus = currentStatus === "open" ? "closed" : "open";
    toast.success("Status updated!", {
      description: `${facilityName} is now ${newStatus}.`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="mb-2">Manage Facilities</h1>
            <p className="text-gray-600">Add, edit, or manage sports facilities.</p>
          </div>
          <Button
            onClick={() => setShowAddDialog(true)}
            className="rounded-xl flex items-center gap-2"
            style={{ backgroundColor: "#6B8AFF" }}
          >
            <Plus className="w-5 h-5" />
            Add New Field
          </Button>
        </div>

        {/* Facilities Table */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Field Name</TableHead>
                <TableHead>Sport Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Available Times</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {facilities.map((facility) => (
                <TableRow key={facility.id}>
                  <TableCell>{facility.name}</TableCell>
                  <TableCell className="capitalize">{facility.type}</TableCell>
                  <TableCell>
                    <Badge
                      style={{
                        backgroundColor:
                          facility.status === "open" ? "#6B8AFF" : "#FFC7D3",
                        color: "white",
                      }}
                    >
                      {facility.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {facility.availableTimes.slice(0, 3).map((time) => (
                        <span
                          key={time}
                          className="text-xs px-2 py-1 bg-gray-100 rounded"
                        >
                          {time}
                        </span>
                      ))}
                      {facility.availableTimes.length > 3 && (
                        <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                          +{facility.availableTimes.length - 3}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-xl"
                        onClick={() => {}}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-xl"
                        onClick={() =>
                          handleToggleStatus(facility.name, facility.status)
                        }
                      >
                        {facility.status === "open" ? (
                          <ToggleRight className="w-4 h-4" />
                        ) : (
                          <ToggleLeft className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>

      {/* Add Facility Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle>Add New Field</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="mb-2 block">
                Field Name
              </Label>
              <Input
                id="name"
                value={facilityName}
                onChange={(e) => setFacilityName(e.target.value)}
                placeholder="e.g., Main Football Field"
                className="rounded-xl"
              />
            </div>
            <div>
              <Label htmlFor="type" className="mb-2 block">
                Sport Type
              </Label>
              <select
                id="type"
                value={facilityType}
                onChange={(e) => setFacilityType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl"
              >
                <option value="football">Football</option>
                <option value="basketball">Basketball</option>
              </select>
            </div>
            <div>
              <Label htmlFor="description" className="mb-2 block">
                Description
              </Label>
              <Textarea
                id="description"
                value={facilityDescription}
                onChange={(e) => setFacilityDescription(e.target.value)}
                placeholder="Field description..."
                className="rounded-xl"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowAddDialog(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddFacility}
              className="rounded-xl"
              style={{ backgroundColor: "#6B8AFF" }}
            >
              Add Field
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
