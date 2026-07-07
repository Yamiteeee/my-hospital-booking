// utils/normalization.ts

export type NormalizedReason = 
  | "CHEST_PAIN" 
  | "CARDIAC_CHECKUP" 
  | "HEART_PALPITATIONS"
  | "CHRONIC_MIGRAINE" 
  | "SEIZURE_EVAL" 
  | "CONCUSSION_FOLLOWUP"
  | "ORTHOPEDIC_CARE"      
  | "PEDIATRIC_CARE"       
  | "GENERAL_CONSULT";

export const SPECIALTY_ROUTING_MAP: Record<NormalizedReason, string | null> = {
  CHEST_PAIN: "Cardiology",
  CARDIAC_CHECKUP: "Cardiology",
  HEART_PALPITATIONS: "Cardiology",
  CHRONIC_MIGRAINE: "Neurology",
  SEIZURE_EVAL: "Neurology",
  CONCUSSION_FOLLOWUP: "Neurology",
  ORTHOPEDIC_CARE: "Orthopedic",               // 🌟 Aligned exactly to Dr. Arthur
  PEDIATRIC_CARE: "Pediatrics & Neonatal Care", // 🌟 Aligned exactly to Dr. Maya
  GENERAL_CONSULT: null, 
};

/**
 * Normalizes a messy free-text appointment reason or a form dropdown string into a strict token key.
 */
export const normalizeIncomingReason = (reason: string = ""): NormalizedReason => {
  const text = reason.toLowerCase().trim();

  // 1. Direct Form Dropdown Mapping Matches
  if (text.includes("cardiovascular")) return "CARDIAC_CHECKUP";
  if (text.includes("neurological")) return "CHRONIC_MIGRAINE";
  if (text.includes("orthopedic")) return "ORTHOPEDIC_CARE";
  if (text.includes("pediatric")) return "PEDIATRIC_CARE";

  // 2. Chatbot Natural Language Fallbacks
  if (/heart|cardiac|cardio|chest.*pain|palpitation/.test(text)) {
    if (text.includes("pain")) return "CHEST_PAIN";
    if (text.includes("palpitation")) return "HEART_PALPITATIONS";
    return "CARDIAC_CHECKUP";
  }

  if (/migraine|brain|neuro|headache|seizure|concussion/.test(text)) {
    if (text.includes("seizure")) return "SEIZURE_EVAL";
    if (text.includes("concussion") || text.includes("hit")) return "CONCUSSION_FOLLOWUP";
    return "CHRONIC_MIGRAINE";
  }
  
  if (/bone|joint|fracture|ortho|knee|back/.test(text)) {
    return "ORTHOPEDIC_CARE";
  }

  if (/child|baby|pediatric|neonatal|kid|infant/.test(text)) {
    return "PEDIATRIC_CARE";
  }

  return "GENERAL_CONSULT";
};