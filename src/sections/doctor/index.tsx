"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OPERATIONAL_HOURS } from "@/hooks/useReceptionistDesk";
import { useDoctor } from "@/hooks/useDoctor"; // 🌟 Imported your new hook!
import { 
  Clock, 
  Calendar as CalendarIcon, 
  Coffee, 
  User, 
  LogOut, 
  FileText,
  CheckCircle 
} from "lucide-react";

export default function DoctorDashboard() {
  const {
    identity,
    identityLoading,
    selectedDate,
    setSelectedDate,
    currentDoctor,
    dailyAppointments,
    handleEndShift,
    handleStatusUpdate,
  } = useDoctor();

  if (identityLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">
          Loading Security Session...
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      
      {/* Upper Context Control Banner */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded-md">
              Physician Portal Active
            </span>
            <span className="text-[10px] font-mono text-slate-400 uppercase">
              Badge: {identity?.badge_id || identity?.id || "UNVERIFIED"}
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-2">
            Welcome back, {currentDoctor.name}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Department: <span className="font-semibold">{currentDoctor.specialty}</span>
          </p>
        </div>

        {/* Action Controls Side Container */}
        <div className="flex items-center gap-3 self-stretch sm:self-auto justify-end">
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
            <CalendarIcon className="h-4 w-4 text-slate-400" />
            <Input 
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="h-7 text-xs border-none focus-visible:ring-0 bg-transparent w-[130px] font-medium"
            />
          </div>

          <Button
            size="sm"
            variant="ghost"
            onClick={handleEndShift} 
            className="h-10 border border-slate-200 rounded-xl px-3 bg-white text-slate-500 hover:text-rose-600 text-xs font-semibold shadow-sm transition-all"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline ml-1.5">End Shift</span>
          </Button>
        </div>
      </div>

      {/* Main Layout Splitting metrics from the calendar ladder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* LEFT COLUMN: DAILY SUMMARY METRICS */}
        <div className="space-y-4 lg:col-span-1">
          <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Day at a Glance</h3>
          
          <Card className="border-slate-200/80 shadow-sm rounded-xl bg-white">
            <CardContent className="p-5 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                <span className="text-xs text-slate-500 font-medium">Total Manifest</span>
                <Badge variant="secondary" className="bg-slate-100 text-slate-700 font-bold text-xs px-2.5">
                  {dailyAppointments.length} Booked
                </Badge>
              </div>

              <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                <span className="text-xs text-slate-500 font-medium">Checked In Waiting</span>
                <Badge className="bg-emerald-50 border border-emerald-100 text-emerald-700 font-bold text-xs px-2.5 shadow-none">
                  {dailyAppointments.filter(b => b.status === "checked-in").length} Present
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500 font-medium">Scheduled Breaks</span>
                <div className="flex items-center gap-1 text-amber-700 font-semibold text-xs">
                  <Coffee className="h-3.5 w-3.5 text-amber-500" /> {currentDoctor.breaks?.length || 0} Blocks
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: THE CALENDAR LADDER TIMEGRID */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Your Personal Agenda</h3>
          
          <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden bg-white">
            <CardContent className="p-0 divide-y divide-slate-100">
              {OPERATIONAL_HOURS.map((hour) => {
                const isBreak = (currentDoctor.breaks as string[])?.includes(hour) ?? false;
                const appointment = dailyAppointments.find(b => b.timeSlot === hour);

                return (
                  <div key={hour} className="flex min-h-[76px] transition-all hover:bg-slate-50/30 group">
                    
                    {/* Left chronological ladder step marker */}
                    <div className="w-[85px] sm:w-[100px] border-r border-slate-100 p-4 shrink-0 flex items-start gap-1.5 justify-end text-slate-400 font-semibold text-xs tracking-tight bg-slate-50/40 select-none">
                      <Clock className="h-3.5 w-3.5 mt-0.5 opacity-60" />
                      {hour}
                    </div>

                    {/* Right allocation contents container */}
                    <div className="flex-1 p-3 flex flex-col justify-center">
                      {isBreak ? (
                        <div className="bg-amber-50/40 border border-amber-100/70 text-amber-800 rounded-xl px-4 py-2.5 flex items-center justify-between animate-in fade-in duration-100">
                          <div className="flex items-center gap-2.5">
                            <div className="h-7 w-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 shadow-none shrink-0">
                              <Coffee className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-xs font-bold">Personal Rest Block / Break</p>
                              <p className="text-[10px] text-amber-600 font-medium">Clinic routing is automatically paused during this block.</p>
                            </div>
                          </div>
                          <Badge className="bg-amber-100/80 hover:bg-amber-100/80 text-amber-900 text-[10px] font-bold border-transparent shadow-none">Unavailable</Badge>
                        </div>

                      ) : appointment ? (
                        <div className={`border rounded-xl px-4 py-3 flex flex-col sm:flex-row gap-3 sm:items-center justify-between shadow-sm transition-all ${
                          appointment.status === "checked-in" 
                            ? "bg-emerald-50/30 border-emerald-200 text-emerald-950" 
                            : "bg-blue-50/20 border-blue-100 text-blue-950"
                        }`}>
                          <div className="flex items-start gap-3">
                            <div className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 shadow-none ${
                              appointment.status === "checked-in" ? "bg-emerald-600 text-white" : "bg-blue-600 text-white"
                            }`}>
                              <User className="h-4 w-4" />
                            </div>
                            <div className="space-y-0.5">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-xs font-bold tracking-tight">{appointment.patient_name}</p>
                                {appointment.status === "checked-in" && (
                                  <Badge className="bg-emerald-600 text-white border-transparent text-[9px] font-bold px-1.5 h-4 flex items-center py-0 rounded shadow-none">Arrived / Ready</Badge>
                                )}
                              </div>
                              <p className="text-[11px] opacity-80 max-w-[400px] leading-normal flex items-center gap-1">
                                <FileText className="h-3 w-3 shrink-0 opacity-70" /> {appointment.reason}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                            {appointment.status !== "checked-in" ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusUpdate(appointment.id, "checked-in")}
                                className="h-7 text-[11px] font-semibold bg-white border-slate-200 shadow-none text-slate-700 hover:bg-slate-50"
                              >
                                Mark Present
                              </Button>
                            ) : (
                              <div className="text-[11px] font-bold text-emerald-700 flex items-center gap-1.5 px-2 bg-emerald-100/50 py-1 rounded-md border border-emerald-200/60">
                                <CheckCircle className="h-3.5 w-3.5 text-emerald-600" /> Patient Checked In
                              </div>
                            )}
                          </div>
                        </div>

                      ) : (
                        <div className="text-[11px] text-slate-400 font-normal italic pl-2 group-hover:text-slate-500 transition-colors flex items-center gap-1">
                          No active appointments assigned to this time frame.
                        </div>
                      )}
                    </div>

                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}