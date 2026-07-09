"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OPERATIONAL_HOURS } from "@/hooks/useReceptionistDesk";
import { useDoctor } from "@/hooks/useDoctor"; 
import { useHospitalLogout } from "@/hooks/useHospitalLogout";
import {   
  Clock,  
  Calendar as CalendarIcon,  
  Coffee,  
  User,  
  LogOut,  
  FileText,
  CheckCircle,
  PlusCircle,
  XCircle,
  AlertOctagon,
  Hourglass
} from "lucide-react";
import { BookingRecord } from "@/types";

/* ==========================================================================
   SUB-COMPONENT: TIME SLOT ROW WITH HOVER NOTIFICATION DISMISSAL
   ========================================================================== */
interface TimeGridRowProps {
  hour: string;
  currentDoctor: any;
  appointment: any;
  isPastOffWorkLimit: boolean;
  toggleBreak: (hour: string) => void;
  handleStatusUpdate: (id: string, status: BookingRecord["status"]) => void;
}

function TimeGridRow({
  hour,
  currentDoctor,
  appointment,
  isPastOffWorkLimit,
  toggleBreak,
  handleStatusUpdate
}: TimeGridRowProps) {
  const [hasBeenHovered, setHasBeenHovered] = useState(false);

  const isBreak = (currentDoctor?.breaks as string[])?.includes(hour) ?? false;
  const currentStatus = appointment?.status?.toLowerCase().trim() || "";
  
  const isJustBooked = ["confirmed", "pending"].includes(currentStatus);
  const isWaiting = currentStatus === "checked_in";
  const inConsultation = currentStatus === "present";
  const isFinished = currentStatus === "completed";

  const showRedDot = isJustBooked && !hasBeenHovered;

  return (
    <div 
      className={`flex min-h-[76px] transition-all ${isPastOffWorkLimit ? "bg-slate-50/40 select-none" : "hover:bg-slate-50/30 group"}`}
      onMouseEnter={() => {
        if (isJustBooked && !hasBeenHovered) {
          setHasBeenHovered(true);
        }
      }}
    >
      <div className="w-[85px] sm:w-[100px] border-r border-slate-100 p-4 shrink-0 flex items-start gap-1.5 justify-end text-slate-400 font-semibold text-xs tracking-tight bg-slate-50/40 select-none">
        <Clock className="h-3.5 w-3.5 mt-0.5 opacity-60" />
        {hour}
      </div>

      <div className="flex-1 p-3 flex flex-col justify-center">
        {isPastOffWorkLimit ? (
          <div className="border border-slate-200/60 bg-slate-100/40 text-slate-400 rounded-xl px-4 py-2.5 flex items-center justify-between animate-in fade-in slide-in-from-top-1 duration-300">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-slate-200/60 flex items-center justify-center text-slate-500 shrink-0">
                <AlertOctagon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500">Off Duty Block / Shift Concluded</p>
                <p className="text-[10px] text-slate-400 font-medium">Locked out according to your set custom working hours limit.</p>
              </div>
            </div>
            <Badge className="bg-slate-200 text-slate-500 text-[9px] font-bold border-transparent shadow-none uppercase">Closed</Badge>
          </div>
        ) : isBreak ? (
          <div className="bg-amber-50/40 border border-amber-100/70 text-amber-800 rounded-xl px-4 py-2.5 flex items-center justify-between animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 shadow-none shrink-0">
                <Coffee className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold">Personal Rest Block / Break</p>
                <p className="text-[10px] text-amber-600 font-medium">Clinic routing is automatically paused during this block.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-amber-100/80 hover:bg-amber-100/80 text-amber-900 text-[10px] font-bold border-transparent shadow-none group-hover:hidden">Unavailable</Badge>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => toggleBreak(hour)}
                className="hidden group-hover:flex h-6 text-[10px] text-rose-600 hover:bg-rose-50 border border-rose-200 font-bold px-2 rounded-md transition-all gap-1 items-center"
              >
                <XCircle className="h-3 w-3" /> Clear Break
              </Button>
            </div>
          </div>
        ) : appointment ? (
          <div className={`border rounded-xl px-4 py-3 flex flex-col sm:flex-row gap-3 sm:items-center justify-between shadow-sm transition-all animate-in fade-in slide-in-from-top-1 duration-300 ${
            inConsultation 
              ? "bg-amber-50/40 border-amber-200 text-amber-950 shadow-inner" 
              : isFinished
                ? "bg-slate-50/80 border-slate-200 opacity-60 text-slate-500"
                : "bg-slate-50/50 border-slate-100 text-slate-900"
          }`}>
            <div className="flex items-start gap-3">
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 shadow-none ${
                inConsultation ? "bg-amber-500 text-white" : isFinished ? "bg-slate-400 text-white" : "bg-emerald-600 text-white"
              }`}>
                <User className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-xs font-bold tracking-tight flex items-center gap-2">
                    {appointment.patient_name}
                    {showRedDot && (
                      <span className="relative flex h-2 w-2 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                      </span>
                    )}
                  </p>
                  {isJustBooked && (
                    <Badge className="bg-slate-100 text-slate-600 border-transparent text-[9px] font-bold px-1.5 h-4 flex items-center py-0 rounded shadow-none">Assigned Slot</Badge>
                  )}
                  {isWaiting && (
                    <Badge className="bg-emerald-600 text-white border-transparent text-[9px] font-bold px-1.5 h-4 flex items-center py-0 rounded shadow-none animate-in scale-95">Waiting Outside</Badge>
                  )}
                  {inConsultation && (
                    <Badge className="bg-amber-500 text-white border-transparent text-[9px] font-bold px-1.5 h-4 flex items-center py-0 rounded shadow-none animate-pulse">In Consultation</Badge>
                  )}
                  {isFinished && (
                    <Badge className="bg-slate-400 text-white border-transparent text-[9px] font-bold px-1.5 h-4 flex items-center py-0 rounded shadow-none">Done / Checked Out</Badge>
                  )}
                </div>
                <p className="text-[11px] opacity-80 max-w-[400px] leading-normal flex items-center gap-1">
                  <FileText className="h-3 w-3 shrink-0 opacity-70" /> {appointment.reason}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              {isJustBooked && (
                <div className="text-[10px] font-semibold text-slate-400 flex items-center gap-1 px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-md shadow-none select-none">
                  <Hourglass className="h-3 w-3 text-slate-400" /> Awaiting Reception Check-in
                </div>
              )}

              {isWaiting && (
                <Button
                  size="sm"
                  onClick={() => handleStatusUpdate(appointment.id, "present")}
                  className="h-7 text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-none rounded-md"
                >
                  Start Consultation
                </Button>
              )}

              {inConsultation && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleStatusUpdate(appointment.id, "completed")}
                  className="h-7 text-[11px] font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-none rounded-md"
                >
                  End Consultation
                </Button>
              )}

              {isFinished && (
                <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5 px-2 bg-slate-100 py-1 rounded-md border border-slate-200">
                  <CheckCircle className="h-3.5 w-3.5 text-slate-400" /> Consultation Finished
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between pl-2 animate-in fade-in duration-150">
            <div className="text-[11px] text-slate-400 font-normal italic group-hover:text-slate-500 transition-colors flex items-center gap-1">
              No active appointments assigned to this time frame.
            </div>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => toggleBreak(hour)}
              className="opacity-0 group-hover:opacity-100 h-6 text-[10px] text-amber-700 bg-amber-50/50 hover:bg-amber-100 border border-amber-200 font-bold px-2 rounded-md transition-all gap-1 flex items-center"
            >
              <PlusCircle className="h-3 w-3" /> Set Break Block
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ==========================================================================
   SUB-COMPONENT: DYNAMIC OFF-WORK MANAGEMENT MODULE CARD
   ========================================================================== */
interface DynamicOffWorkModuleProps {
  currentDoctor: any;
  selectedDate: string;
  setOffWorkHour: (hour: string | null) => Promise<void>;
}

function DynamicOffWorkModule({ currentDoctor, selectedDate, setOffWorkHour }: DynamicOffWorkModuleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempHour, setTempHour] = useState(currentDoctor?.off_work_hour || "");

  // Sync local state if the doctor switches dates on the calendar
  React.useEffect(() => {
    setTempHour(currentDoctor?.off_work_hour || "");
    setIsEditing(false);
  }, [selectedDate, currentDoctor?.off_work_hour]);

  return (
    <Card className="border-slate-200/80 shadow-sm rounded-xl bg-white">
      <CardContent className="p-5 space-y-3">
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-slate-400" /> Dynamic Off-Work Cutoff
          </h4>
          <p className="text-[11px] text-slate-500 leading-normal">
            Leaving early or doing a partial shift? Select your target cutoff time to close off all subsequent booking slots.
          </p>
        </div>

        <div className="space-y-2">
          <select
            value={tempHour}
            disabled={!isEditing}
            onChange={(e) => setTempHour(e.target.value)}
            className={`w-full text-xs h-8 px-2.5 rounded-md border font-medium transition-all ${
              isEditing 
                ? "bg-white border-slate-300 text-slate-900 cursor-pointer" 
                : "bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed"
            }`}
          >
            <option value="">Full Shift (Available All Day)</option>
            {OPERATIONAL_HOURS.map((hr) => (
              <option key={hr} value={hr}>
                {hr} (Off duty here & after)
              </option>
            ))}
          </select>

          <div className="flex gap-2 justify-end pt-1">
            {!isEditing ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="h-7 text-[11px] font-bold px-3 border-slate-200"
              >
                Edit Cutoff
              </Button>
            ) : (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setTempHour(currentDoctor?.off_work_hour || "");
                    setIsEditing(false);
                  }}
                  className="h-7 text-[11px] font-medium text-slate-500 hover:bg-slate-100"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={async () => {
                    await setOffWorkHour(tempHour || null);
                    setIsEditing(false);
                  }}
                  className="h-7 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Save Shift
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ==========================================================================
   MAIN DASHBOARD COMPONENT
   ========================================================================== */
export default function DoctorDashboard() {
  const { performLogout } = useHospitalLogout();
  const {
    identity,
    identityLoading,
    selectedDate,
    setSelectedDate,
    currentDoctor,
    dailyAppointments = [], 
    handleStatusUpdate,
    toggleBreak, 
    doctorLeaves = [], 
    requestLeave,
    cancelLeave,
    setOffWorkHour
  } = useDoctor();

  if (identityLoading || !currentDoctor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">
          Loading Security Session...
        </p>
      </div>
    );
  }

  const activeLeaveForToday = doctorLeaves.find((leave: any) => leave.leave_date === selectedDate);

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      
      {/* Upper Context Control Banner */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-md shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Live Gateway Sync Active
            </span>
            
            <span className="text-[10px] font-mono text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded-md">
              Badge: {identity?.badge_id || identity?.id || "UNVERIFIED"}
            </span>
          </div>
          
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-2">
            Welcome back, {currentDoctor?.name || "Doctor"}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Department: <span className="font-semibold text-slate-700">{currentDoctor?.specialty || "General Medicine"}</span>
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
            onClick={performLogout}
            className="h-10 border border-slate-200 rounded-xl px-3 bg-white text-slate-500 hover:text-rose-600 text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-1.5"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">End Shift</span>
          </Button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* LEFT COLUMN: DAILY SUMMARY METRICS */}
        <div className="space-y-4 lg:col-span-1">
          <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Day at a Glance</h3>

          {/* DYNAMIC OFF-WORK MANAGEMENT MODULE CARD */}
          <DynamicOffWorkModule 
            currentDoctor={currentDoctor} 
            selectedDate={selectedDate} 
            setOffWorkHour={setOffWorkHour} 
          />

          {/* SCHEDULE TIME OFF MANAGEMENT MODULE */}
          <Card className="border-slate-200/80 shadow-sm rounded-xl bg-white">
            <CardContent className="p-5 space-y-3">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-700">Schedule Time Off</h4>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Mark <span className="font-semibold text-slate-700">{selectedDate}</span> as an official leave day. This will lock appointment intakes.
                </p>
              </div>
                  
              {activeLeaveForToday ? (
                <div className="flex flex-col gap-2 animate-in zoom-in-95 duration-150">
                  <div className="text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-100 p-2.5 rounded-lg text-center">
                    ✈️ Scheduled Off-Duty on this Date
                  </div>
                  
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      const confirmation = window.confirm("Cancel this leave and restore your availability status for today?");
                      if (confirmation) cancelLeave(String(activeLeaveForToday.id));
                    }}
                    className="w-full h-8 text-[11px] font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-none rounded-md transition-all flex items-center justify-center gap-1"
                  >
                    <XCircle className="h-3.5 w-3.5" /> Cancel Leave / Go Available
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const confirmation = window.confirm(`Are you sure you want to mark ${selectedDate} as an Off-Duty Leave day?`);
                    if (confirmation) requestLeave(selectedDate, "Physician Request Leave");
                  }}
                  className="w-full h-8 text-[11px] font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50/50 border border-slate-200 shadow-none rounded-md transition-all"
                >
                  Block Day / Set Leave
                </Button>
              )}
            </CardContent>
          </Card>

          <Card className="border-slate-200/80 shadow-sm rounded-xl bg-white">
            <CardContent className="p-5 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                <span className="text-xs text-slate-500 font-medium">Total Manifest</span>
                <Badge variant="secondary" className="bg-slate-100 text-slate-700 font-bold text-xs px-2.5 shadow-none transition-all duration-300">
                  {dailyAppointments.length} Booked
                </Badge>
              </div>

              <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                <span className="text-xs text-slate-500 font-medium">Active Consultations</span>
                <Badge className="bg-amber-50 border border-amber-100 text-amber-700 font-bold text-xs px-2.5 shadow-none transition-all duration-300">
                  {dailyAppointments.filter(b => b.status === "present").length} In Room
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500 font-medium">Scheduled Breaks</span>
                <div className="flex items-center gap-1 text-amber-700 font-semibold text-xs transition-all duration-300">
                  <Coffee className="h-3.5 w-3.5 text-amber-500" /> {currentDoctor?.breaks?.length || 0} Blocks
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
                const appointment = dailyAppointments.find(b => b.timeSlot === hour);
                const isPastOffWorkLimit = currentDoctor?.off_work_hour
                  ? hour >= currentDoctor.off_work_hour
                  : false;

                return (
                  <TimeGridRow 
                    key={hour}
                    hour={hour}
                    currentDoctor={currentDoctor}
                    appointment={appointment}
                    isPastOffWorkLimit={isPastOffWorkLimit}
                    toggleBreak={toggleBreak}
                    handleStatusUpdate={handleStatusUpdate}
                  />
                );
              })}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}