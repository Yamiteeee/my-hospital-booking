// @/providers/data-provider/footerData.ts
import { Atom, Fingerprint, Heart, Building2, Network, Share2 } from "lucide-react";

export const CORPORATE_SPONSORS = [
  { 
    name: "NovaHealth Tech", 
    desc: "Clinical AI Solutions", 
    icon: Atom, 
    style: "text-indigo-600 bg-indigo-50/50 border-indigo-100" 
  },
  { 
    name: "Veris Systems", 
    desc: "Biometric Architecture", 
    icon: Fingerprint, 
    style: "text-blue-600 bg-blue-50/50 border-blue-100" 
  },
  { 
    name: "OmniCare Labs", 
    desc: "Diagnostic Integrations", 
    icon: Heart, 
    style: "text-rose-600 bg-rose-50/50 border-rose-100" 
  },
  { 
    name: "Apex Infrastructure", 
    desc: "Secure Desk Hubs", 
    icon: Building2, 
    style: "text-slate-700 bg-slate-100/70 border-slate-200" 
  },
  { 
    name: "Synapse Network", 
    desc: "Telehealth Pipeline", 
    icon: Network, 
    style: "text-emerald-600 bg-emerald-50/50 border-emerald-100" 
  },
  { 
    name: "Helix Data", 
    desc: "SaaS Interoperability", 
    icon: Share2, 
    style: "text-cyan-600 bg-cyan-50/50 border-cyan-100" 
  },
];

export const CAMPUS_CONTACTS = {
  address: "8900 Wilshire Blvd, Suite 250, Beverly Hills, CA 90211",
  phone: "+1 (310) 555-0199",
  phoneRaw: "+13105550199",
  email: "assist@stmarysmedva.org",
  triageStatus: "Active 24/7"
};