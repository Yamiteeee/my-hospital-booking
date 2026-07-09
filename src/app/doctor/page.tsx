import DoctorSection from "@/sections/doctor";
import { ClientAuthGate } from "@/hooks/ClientAuthGate";

// 🌟 Safe server configurations
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function DoctorPage() {
  return (
    <ClientAuthGate>
      <main className="min-h-screen bg-slate-50/50">
        <DoctorSection />
      </main>
    </ClientAuthGate>
  );
}