import ReceptionistSection from "@/sections/receptionist";
import { ClientAuthGate } from "@/hooks/ClientAuthGate"; // We will create this next

// 🌟 Now these are perfectly valid because this is a Server Component!
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function ReceptionistPage() {
  return (
    <ClientAuthGate>
      <main className="min-h-screen bg-slate-50">
        <ReceptionistSection />
      </main>
    </ClientAuthGate>
  );
}