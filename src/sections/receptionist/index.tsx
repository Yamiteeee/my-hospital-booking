"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useReceptionistDesk, BookingRecord } from "@/hooks/useReceptionistDesk";

export default function ReceptionistSection() {
  // Extract state management machine
  const { bookings, isLoading, handleStatusUpdate } = useReceptionistDesk();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "checked-in":
        return <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white">Checked In</Badge>;
      case "confirmed":
        return <Badge className="bg-blue-500 hover:bg-blue-600 text-white">Confirmed</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100">Pending</Badge>;
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Reception Desk</h1>
          <p className="text-slate-500">Manage incoming patient appointments, statuses, and live check-ins.</p>
        </div>
      </div>

      <Card className="border-slate-200 shadow-sm bg-white">
        <CardHeader>
          <CardTitle className="text-lg">Live Booking Stream</CardTitle>
          <CardDescription>Real-time booking requests incoming from the landing chat channel.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Patient Name</TableHead>
                <TableHead>Contact Info</TableHead>
                <TableHead>Reason for Visit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-slate-400">
                    Loading clinical desk stream...
                  </TableCell>
                </TableRow>
              ) : (
                bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium text-slate-900">{booking.patient_name}</TableCell>
                    <TableCell className="text-slate-600">{booking.phone}</TableCell>
                    <TableCell className="max-w-[300px] truncate text-slate-600">{booking.reason}</TableCell>
                    <TableCell>{getStatusBadge(booking.status)}</TableCell>
                    <TableCell className="text-right space-x-2">
                      {booking.status !== "checked-in" && booking.status !== "cancelled" && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleStatusUpdate(booking.id, "confirmed")}
                            className="h-8 text-xs border-slate-200 text-blue-600 hover:text-blue-700"
                          >
                            Confirm
                          </Button>
                          <Button 
                            variant="default" 
                            size="sm" 
                            onClick={() => handleStatusUpdate(booking.id, "checked-in")}
                            className="h-8 text-xs bg-slate-950 text-white hover:bg-slate-800"
                          >
                            Check In
                          </Button>
                        </>
                      )}
                      {booking.status !== "cancelled" && booking.status !== "checked-in" && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleStatusUpdate(booking.id, "cancelled")}
                          className="h-8 text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                        >
                          Cancel
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}

              {!isLoading && bookings.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-slate-400">
                    No bookings found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}