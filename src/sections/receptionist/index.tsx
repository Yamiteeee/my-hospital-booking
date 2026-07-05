"use client";

import React from "react";
import { useIsAuthenticated } from "@refinedev/core"; // Import Refine's authentication guard hook
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useReceptionistDesk } from "@/hooks/useReceptionistDesk";
import { ShieldAlert, Lock } from "lucide-react";

export default function ReceptionistSection() {
  // 1. Core Security Gatecheck
  const { data: authStatus, isPending: authChecking } = useIsAuthenticated();
  
  // Extract state management machine
  const { bookings, isLoading, handleStatusUpdate } = useReceptionistDesk();

  // 2. Render State Handlers for Security Checking
  if (authChecking) {
    return (
      <div className="p-8 max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse flex items-center gap-2">
          <Lock className="h-3.5 w-3.5 text-slate-300" />
          Verifying terminal access rights...
        </div>
      </div>
    );
  }

  if (!authStatus?.authenticated) {
    return (
      <div className="p-8 max-w-xl mx-auto mt-12">
        <Card className="border-rose-200 bg-rose-50/40 shadow-sm rounded-2xl overflow-hidden">
          <div className="h-1 bg-rose-500" />
          <CardHeader className="text-center space-y-2">
            <div className="h-10 w-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-sm">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <CardTitle className="text-base text-rose-950 font-bold tracking-tight">
              Access Denied
            </CardTitle>
            <CardDescription className="text-xs text-rose-600 font-medium">
              This terminal stream contains Protected Health Information (PHI). You must be an authenticated Virtual Assistant to access this panel.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // 3. Authenticated Content Render View
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
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
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