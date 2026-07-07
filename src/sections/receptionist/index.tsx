"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OPERATIONAL_HOURS, BookingRecord, Doctor } from "@/hooks/useReceptionistDesk";
import { useDispatchEngine } from "@/hooks/useDispatchEngine";
import { SPECIALTY_ROUTING_MAP } from "@/utils/normalization";
import { useRouter } from "next/navigation"; 
import { useLogout } from "@refinedev/core"; 
import { 
  ShieldAlert, 
  UserCheck, 
  Phone, 
  Stethoscope, 
  Clock, 
  AlertCircle, 
  ShieldCheck, 
  Users, 
  Calendar,
  LogOut,
  Activity
} from "lucide-react";

export default function ReceptionistSection() {
  const router = useRouter(); 
  const { mutate: logout } = useLogout(); 

  const {
    isAuthenticated,
    authChecking,
    bookings,
    doctors,
    pendingQueue,
    isLoading,
    selectedPatient,
    setSelectedPatient,
    activeDoctorTab,
    setActiveDoctorTab,
    currentDoctor,
    targetSpecialty,
    isDepartmentMismatch,
    selectedDate,
    setSelectedDate,
    handleStatusUpdate,
    handleDoctorAvailabilityUpdate,
    dispatchToSlot
  } = useDispatchEngine();

  const handleEndShift = () => {
    logout(
      {}, 
      {
        onSuccess: () => {
          router.push("/login");
          router.refresh();
        },
        onError: (err) => {
          console.warn("Redirecting fallback active:", err);
          router.push("/login");
        }
      }
    );
  };

  const getAvailabilityBadge = (status: Doctor["availability_status"]) => {
    switch (status) {
      case "available":
        return <Badge className="bg-emerald-50 border-emerald-200 text-emerald-700 text-[9px] shadow-none">On Duty</Badge>;
      case "lunch_break":
        return <Badge className="bg-amber-50 border-amber-200 text-amber-700 text-[9px] shadow-none">Lunch Break</Badge>;
      case "rest_time":
        return <Badge className="bg-blue-50 border-blue-200 text-blue-700 text-[9px] shadow-none">Resting</Badge>;
      case "early_out":
        return <Badge className="bg-slate-100 border-slate-200 text-slate-600 text-[9px] shadow-none">Left Early</Badge>;
      default:
        return null;
    }
  };

  const getPatientLifecycleBadge = (status: BookingRecord["status"]) => {
    switch (status) {
      case "checked_in":
        return <Badge className="bg-sky-50 border-sky-200 text-sky-700 text-[9px] shadow-none">Waiting Outside</Badge>;
      case "present":
        return <Badge className="bg-amber-50 border-amber-200 text-amber-700 text-[9px] shadow-none animate-pulse">In Consultation</Badge>;
      case "completed":
        return <Badge className="bg-slate-100 border-slate-200 text-slate-600 text-[9px] shadow-none">Completed</Badge>;
      default:
        return <Badge className="bg-indigo-50 border-indigo-100 text-indigo-700 text-[9px] shadow-none">Booked</Badge>;
    }
  };

  if (authChecking) {
    return <div className="p-8 text-center text-xs tracking-widest uppercase text-slate-400 animate-pulse pt-24">Verifying Credentials...</div>;
  }
  
  if (!isAuthenticated) {
    return <div className="p-8 max-w-md mx-auto text-center font-bold text-rose-600">Access Denied</div>;
  }

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Clinic Intake & Scheduling Desk</h1>
          <p className="text-xs text-slate-500">Manage incoming clinic patient files and assign schedules to doctors on duty.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <div className="text-[11px] h-10 font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl flex items-center gap-2 justify-center shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Receptionist Session Active
          </div>

          <Button
            size="sm"
            variant="ghost"
            onClick={handleEndShift}
            className="h-10 border border-slate-200 rounded-xl px-3 bg-white text-slate-500 hover:text-rose-600 text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-1.5"
          >
            <LogOut className="h-4 w-4" />
            <span>End Shift</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* LEFT PANEL: PATIENT INTAKE QUEUE */}
        <div className="w-full lg:w-1/3 space-y-4">
          <div className="space-y-1">
            <h2 className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" /> Waiting Queue ({pendingQueue.length})
            </h2>
            <p className="text-[11px] text-slate-500">Select a waiting patient below to begin assignment.</p>
          </div>

          <div className="space-y-3 max-h-[50vh] lg:max-h-[70vh] overflow-y-auto pr-1">
            {isLoading ? (
              <div className="text-center p-8 text-xs text-slate-400 animate-pulse font-medium uppercase">Syncing Schedule Data...</div>
            ) : pendingQueue.length === 0 ? (
              <div className="p-8 text-center text-xs border border-dashed border-slate-200 bg-slate-50/50 rounded-xl text-slate-400">
                All patient files have been successfully scheduled.
              </div>
            ) : (
              pendingQueue.map((patient: BookingRecord) => {
                const requiredDept = patient.normalized_reason ? SPECIALTY_ROUTING_MAP[patient.normalized_reason as keyof typeof SPECIALTY_ROUTING_MAP] : null;
                const isSelected = selectedPatient?.id === patient.id;
                
                return (
                  <Card 
                    key={patient.id}
                    onClick={() => setSelectedPatient(patient)}
                    className={`cursor-pointer transition-all border rounded-xl shadow-sm hover:shadow-md ${
                      isSelected ? "ring-2 ring-blue-600 border-transparent bg-blue-50/10" : "border-slate-200 bg-white"
                    }`}
                  >
                    <CardContent className="p-4 space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <p className="text-sm font-semibold text-slate-900 tracking-tight">{patient.patient_name}</p>
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5"><Phone className="h-3 w-3" /> {patient.phone}</p>
                        </div>
                        {requiredDept && (
                          <Badge className="bg-indigo-50 hover:bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-medium tracking-normal px-2 py-0 rounded-md shadow-none">
                            {requiredDept}
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-slate-600 bg-slate-50 border border-slate-100 p-3 rounded-lg leading-relaxed">
                        {patient.reason}
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT PANEL: PHYSICIAN ALLOCATION BOARD */}
        <div className="w-full lg:w-2/3 space-y-4">
          
          {/* Medical Doctor Selection Tabs */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">Available Physicians</span>
            <div className="flex flex-wrap gap-2 bg-slate-50 border border-slate-200/60 p-1.5 rounded-xl">
              {doctors.map((doc: Doctor) => {
                const isActive = activeDoctorTab === doc.badge_id;
                const initials = doc.name?.split(".").pop()?.trim().charAt(0) || "D";

                return (
                  <button
                    key={doc.badge_id}
                    onClick={() => setActiveDoctorTab(doc.badge_id)}
                    className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-3 border grow sm:grow-0 ${
                      isActive 
                        ? "bg-white text-slate-900 shadow-sm border-slate-200" 
                        : "text-slate-500 hover:text-slate-900 border-transparent hover:bg-white/50"
                    }`}
                  >
                    <div className={`h-7 w-7 rounded-md flex items-center justify-center font-bold text-xs shrink-0 ${
                      isActive ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-700"
                    }`}>
                      {initials}
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-1.5">
                        <p className="leading-none text-xs font-bold text-slate-800">{doc.name}</p>
                        {getAvailabilityBadge(doc.availability_status)}
                      </div>
                      <p className="text-[10px] opacity-75 font-normal mt-0.5 flex items-center gap-1">
                        <Stethoscope className="h-2.5 w-2.5" /> {doc.specialty}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hourly Booking Grid Frame */}
          <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-4 sm:p-5 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center w-full sm:w-auto">
                <div className="space-y-1">
                  <CardTitle className="text-xs font-bold uppercase text-slate-400 tracking-wider">Physician Daily Schedule</CardTitle>
                  <div className="flex flex-wrap items-center gap-2 mt-0.5">
                    <CardDescription className="text-xs text-slate-600">Showing blocks for {currentDoctor?.name || "Staff"}</CardDescription>
                    
                    {currentDoctor?.id && (
                      <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-md px-1.5 py-0.5 shadow-sm">
                        <Activity className="h-2.5 w-2.5 text-slate-400" />
                        <select
                          value={currentDoctor.availability_status || "available"}
                          onChange={(e) => handleDoctorAvailabilityUpdate(currentDoctor.id, e.target.value as any)}
                          className="text-[10px] font-medium bg-transparent border-none text-slate-600 focus:ring-0 cursor-pointer pr-1 py-0 h-5 outline-none"
                        >
                          <option value="available">On Duty (Available)</option>
                          <option value="lunch_break">Lunch Break</option>
                          <option value="rest_time">Resting / Break</option>
                          <option value="early_out">Left Early</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-lg border border-slate-200 shadow-sm">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <Input 
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="h-6 text-xs p-1 border-none focus-visible:ring-0 bg-transparent w-[125px]"
                  />
                </div>
              </div>

              {selectedPatient && (
                <div className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg flex items-center gap-2 border shadow-none animate-in fade-in duration-150 w-full sm:w-auto justify-center ${
                  isDepartmentMismatch 
                    ? "bg-rose-50 border-rose-200 text-rose-700" 
                    : "bg-emerald-50 border-emerald-200 text-emerald-800"
                }`}>
                  {isDepartmentMismatch ? (
                    <>
                      <ShieldAlert className="h-3.5 w-3.5 text-rose-500" /> Restrained: Requires {targetSpecialty} Specialist
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Validated: Safe to Schedule
                    </>
                  )}
                </div>
              )}
            </CardHeader>
            <CardContent className="p-0 max-h-[60vh] overflow-y-auto">
              
              {/* Mobile View */}
              <div className="block sm:hidden divide-y divide-slate-100">
                {OPERATIONAL_HOURS.map((hour: string) => {
                  const isBreak = currentDoctor?.breaks?.includes(hour) ?? false;
                  const filledBooking = bookings.find(b => (b.badge_id || b.doctorId) === currentDoctor?.badge_id && b.timeSlot === hour && b.preferredDate === selectedDate && b.status !== "cancelled");

                  return (
                    <div key={hour} className={`p-4 space-y-2 ${isBreak ? "bg-amber-50/20" : filledBooking ? "bg-slate-50/20" : ""}`}>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-xs text-slate-700 flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-slate-400" /> {hour}</span>
                        {isBreak && <Badge className="bg-amber-100 border-amber-200 hover:bg-amber-100 text-amber-800 text-[9px] font-medium">Break</Badge>}
                        {filledBooking && getPatientLifecycleBadge(filledBooking.status)}
                      </div>
                      
                      <div className="text-xs">
                        {filledBooking ? (
                          <div className="space-y-1">
                            <p className="font-semibold text-slate-900">{filledBooking.patient_name}</p>
                            
                            <div className="mt-2 flex gap-1.5 flex-wrap">
                              {filledBooking.status !== "checked_in" && filledBooking.status !== "present" && filledBooking.status !== "completed" ? (
                                <Button size="sm" variant="outline" className="text-[10px] h-6 grow" onClick={() => handleStatusUpdate(filledBooking.id, "checked_in")}>
                                  Check In Patient
                                </Button>
                              ) : filledBooking.status === "present" ? (
                                <Badge className="bg-amber-100 border-amber-300 text-amber-800 text-[10px] py-1 font-semibold tracking-normal grow justify-center rounded-md shadow-none cursor-not-allowed">
                                  In Consultation
                                </Badge>
                              ) : (
                                <span className="text-[10px] text-slate-400 italic">Managed by Physician Portal</span>
                              )}
                            </div>
                          </div>
                        ) : !isBreak ? (
                          <span className="text-slate-400 italic">Open time slot</span>
                        ) : null}
                      </div>

                      {selectedPatient && !isBreak && !filledBooking && (
                        <Button
                          size="sm"
                          disabled={isDepartmentMismatch}
                          onClick={() => dispatchToSlot(hour)}
                          className="w-full h-8 text-[11px] font-medium mt-2"
                        >
                          {isDepartmentMismatch ? "Department Locked" : "Schedule Patient"}
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Desktop Table Layout */}
              <Table className="hidden sm:table">
                <TableHeader className="bg-slate-50 sticky top-0 backdrop-blur-sm z-10 border-b border-slate-200">
                  <TableRow>
                    <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-400 py-3 pl-6 w-[120px]">Time Slot</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-400 py-3">Scheduled Patient Context</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-400 py-3 text-right pr-6 w-[200px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {OPERATIONAL_HOURS.map((hour: string) => {
                    const isBreak = currentDoctor?.breaks?.includes(hour) ?? false;
                    const filledBooking = bookings.find(b => (b.badge_id || b.doctorId) === currentDoctor?.badge_id && b.timeSlot === hour && b.preferredDate === selectedDate && b.status !== "cancelled");

                    return (
                      <TableRow key={hour} className={`border-b border-slate-100/80 ${isBreak ? "bg-amber-50/10" : filledBooking ? "bg-slate-50/20" : "hover:bg-slate-50/10"}`}>
                        <TableCell className="font-semibold text-xs text-slate-700 py-3.5 pl-6">
                          <span className="flex items-center gap-1.5"><Clock className="h-3 w-3 text-slate-400" /> {hour}</span>
                        </TableCell>
                        
                        <TableCell className="py-3.5">
                          {isBreak ? (
                            <div className="text-[11px] font-medium text-amber-700 flex items-center gap-1.5 bg-amber-50/50 border border-amber-100 px-2.5 py-0.5 w-max rounded-md">
                              <AlertCircle className="h-3 w-3 text-amber-500" /> Physician Rest Period
                            </div>
                          ) : filledBooking ? (
                            <div className="flex items-center gap-3">
                              <UserCheck className="h-4 w-4 text-blue-500 shrink-0" />
                              <div className="space-y-0.5">
                                <p className="text-xs font-semibold text-slate-900">{filledBooking.patient_name}</p>
                                <p className="text-[11px] text-slate-500 max-w-[340px] truncate">{filledBooking.reason}</p>
                              </div>
                              {getPatientLifecycleBadge(filledBooking.status)}
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-400 font-normal italic">Available Appointment Block</span>
                          )}
                        </TableCell>

                        <TableCell className="py-3.5 text-right pr-6">
                          {isBreak ? null : filledBooking ? (
                            <div className="flex justify-end gap-1.5">
                              {filledBooking.status !== "checked_in" && filledBooking.status !== "present" && filledBooking.status !== "completed" ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleStatusUpdate(filledBooking.id, "checked_in")}
                                  className="h-7 px-2.5 text-[11px] font-medium rounded-lg text-sky-700 border-slate-200 hover:bg-sky-50"
                                >
                                  Check In
                                </Button>
                              ) : filledBooking.status === "present" ? (
                                <Badge className="bg-amber-50 border-amber-200 text-amber-700 text-[10px] font-semibold h-7 px-3 flex items-center rounded-lg shadow-none cursor-not-allowed select-none">
                                  In Consultation
                                </Badge>
                              ) : (
                                <span className="text-[11px] text-slate-400 font-normal italic pr-2">
                                  {filledBooking.status === "checked_in" ? "Awaiting Doctor" : "Physician Session Active"}
                                </span>
                              )}
                            </div>
                          ) : selectedPatient ? (
                            <Button
                              size="sm"
                              disabled={isDepartmentMismatch}
                              onClick={() => dispatchToSlot(hour)}
                              className="h-7 px-3 text-[11px] font-medium rounded-lg"
                            >
                              {isDepartmentMismatch ? "Locked" : "Book Slot"}
                            </Button>
                          ) : (
                            <span className="text-[10px] text-slate-300 font-medium uppercase tracking-wider">Empty</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}