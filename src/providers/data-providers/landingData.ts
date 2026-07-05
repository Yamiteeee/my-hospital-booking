// @/providers/data-provider/landingData.ts

export const NAVIGATION_LINKS = [
  { label: "1-Click Intake", href: "#intake" },
  { label: "VA Dispatch Pipeline", href: "#workflow" },
  { label: "Desk Metrics", href: "#telemetry" },
];
//this is for the landing page category section
export const UNIQUE_DEPARTMENTS = [
  { id: "cardio", name: "Cardiovascular Medicine" },
  { id: "ortho", name: "Orthopedics & Joint Care" },
  { id: "peds", name: "Pediatrics & Neonatal Care" },
  { id: "neuro", name: "Neurological Sciences" }
];

export const TELEMETRY_METRICS = [
  { target: 45, suffix: "s", label: "Avg VA Sorting Time" },
  { target: 99.8, suffix: "%", label: "Doctor Routing Rate" }, // Handled as float safely
  { target: 12, suffix: " min", label: "Total Patient Wait Time" }
];