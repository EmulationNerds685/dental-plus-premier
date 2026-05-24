// ── Clinic Spaces ──
import consultationArea from "@/assets/optimized/consultationArea.webp";
import consultationArea2 from "@/assets/optimized/consultationArea2.webp";
import treatmentArea1 from "@/assets/optimized/treatmentArea1.webp";
import treatmentArea2 from "@/assets/optimized/treatmentArea2.webp";
import treatmentArea3 from "@/assets/optimized/TreatmentArea3.webp";
import lobby from "@/assets/optimized/lobby.webp";

// ── Doctor Portraits ──
import doctor from "@/assets/optimized/doctor.webp";
import doctor2 from "@/assets/optimized/doctor2.webp";
import doctor3 from "@/assets/optimized/doctor3.webp";
import doctor5 from "@/assets/optimized/doctor5.webp";
import doctor6 from "@/assets/optimized/doctor6.webp";

// ── Doctor In Action (treating & discussing) ──
import docTreating1 from "@/assets/optimized/docTreating1.webp";
import docTreating2 from "@/assets/optimized/docTreating2.webp";
import docTreating3 from "@/assets/optimized/docTreating3.webp";
import docDiscuss from "@/assets/optimized/docDiscuss.webp";
import docDiscuss2 from "@/assets/optimized/docDiscuss2.webp";
import docDiscuss4 from "@/assets/optimized/docDiscuss4.webp";
import docDiscuss5 from "@/assets/optimized/docDiscuss5.webp";

// ── Team ──
import staff from "@/assets/optimized/staff.webp";
import staff2 from "@/assets/optimized/staff2.webp";

export interface GalleryItem {
  id: string;
  src: string;
  category: "spaces" | "doctor" | "team";
  title: string;
  description: string;
  h: string; // masonry layout height classes
}

export const galleryCategories = [
  { id: "all", label: "All Photos" },
  { id: "spaces", label: "Clinic & Rooms" },
  { id: "doctor", label: "Dr. Jigyasa Bhardwaj" },
  { id: "team", label: "Our Team & Care" },
] as const;

export const galleryItems: GalleryItem[] = [
  // ── Clinic & Rooms ──
  {
    id: "lobby",
    src: lobby,
    category: "spaces",
    title: "Welcoming Reception & Lobby",
    description:
      "Step into a warm, modern reception designed to put you at ease from the moment you arrive.",
    h: "h-72 md:h-80",
  },
  {
    id: "consultation-1",
    src: consultationArea,
    category: "spaces",
    title: "Private Consultation Chamber",
    description:
      "A comfortable, private space where Dr. Jigyasa Bhardwaj explains every diagnosis and treatment plan on-screen before proceeding.",
    h: "h-64 md:h-72",
  },
  {
    id: "consultation-2",
    src: consultationArea2,
    category: "spaces",
    title: "Consultation & Counseling Room",
    description:
      "Equipped with digital displays for transparent cost breakdowns and visual diagnostic reports.",
    h: "h-64 md:h-72",
  },
  {
    id: "treatment-1",
    src: treatmentArea1,
    category: "spaces",
    title: "Advanced Treatment Suite",
    description:
      "State-of-the-art dental operatory with ergonomic chairs, LED shadowless lighting, and Class-B sterilized instruments.",
    h: "h-72 md:h-80",
  },
  {
    id: "treatment-2",
    src: treatmentArea2,
    category: "spaces",
    title: "Modern Operatory Room",
    description:
      "Fully digitized treatment station with rotary endodontic equipment and intraoral imaging for precision care.",
    h: "h-64 md:h-72",
  },
  {
    id: "treatment-3",
    src: treatmentArea3,
    category: "spaces",
    title: "Sterile Procedure Bay",
    description:
      "A pristine, fully sanitized treatment bay ready for painless restorative and cosmetic procedures.",
    h: "h-72 md:h-80",
  },

  // ── Doctor Portraits ──
  {
    id: "doctor-1",
    src: doctor,
    category: "doctor",
    title: "Dr. Jigyasa Bhardwaj",
    description:
      "Chief Dental Surgeon (BDS, MAOI) — passionate about delivering painless, precision dental care with over a decade of clinical experience.",
    h: "h-80 md:h-[450px]",
  },
  {
    id: "doctor-2",
    src: doctor2,
    category: "doctor",
    title: "Committed to Clinical Excellence",
    description:
      "Combining advanced medical training with warm, empathetic patient communication at every visit.",
    h: "h-72 md:h-80",
  },
  {
    id: "doctor-3",
    src: doctor3,
    category: "doctor",
    title: "A Gentle, Reassuring Approach",
    description:
      "Dr. Jigyasa Bhardwaj believes every patient deserves to feel safe, comfortable, and fully informed during their treatment.",
    h: "h-80 md:h-[400px]",
  },
  {
    id: "doctor-5",
    src: doctor5,
    category: "doctor",
    title: "Expertise You Can Trust",
    description:
      "Specialized in modern cosmetic dentistry, rotary endodontics, and advanced implant procedures.",
    h: "h-72 md:h-80",
  },
  {
    id: "doctor-6",
    src: doctor6,
    category: "doctor",
    title: "Ready to Transform Your Smile",
    description:
      "From routine check-ups to complete smile makeovers — Dr. Jigyasa Bhardwaj is your partner in dental wellness.",
    h: "h-64 md:h-72",
  },

  // ── In Action — Treating & Discussing ──
  {
    id: "treating-1",
    src: docTreating1,
    category: "team",
    title: "Painless Precision Treatment",
    description:
      "Dr. Jigyasa Bhardwaj performing a meticulous dental procedure with gentle, patient-first care.",
    h: "h-72 md:h-80",
  },
  {
    id: "treating-2",
    src: docTreating2,
    category: "team",
    title: "Advanced Restorative Care",
    description:
      "Utilizing modern rotary instruments and digital magnification for single-visit root canals and restorations.",
    h: "h-64 md:h-72",
  },
  {
    id: "treating-3",
    src: docTreating3,
    category: "team",
    title: "Comfort-Focused Dentistry",
    description:
      "Every procedure is paced thoughtfully, ensuring zero anxiety and maximum patient comfort throughout.",
    h: "h-72 md:h-80",
  },
  {
    id: "discuss-1",
    src: docDiscuss,
    category: "team",
    title: "Collaborative Diagnostic Review",
    description:
      "Dr. Jigyasa Bhardwaj and her team meticulously reviewing X-rays and patient reports before every treatment.",
    h: "h-72 md:h-[350px]",
  },
  {
    id: "discuss-2",
    src: docDiscuss2,
    category: "team",
    title: "Thorough Case Planning",
    description:
      "Every diagnosis is discussed in detail — ensuring a fully transparent, evidence-based treatment approach.",
    h: "h-64 md:h-72",
  },
  {
    id: "discuss-4",
    src: docDiscuss4,
    category: "team",
    title: "Relaxed Clinic Atmosphere",
    description:
      "Our clinical team enjoying a comfortable break between appointments, cultivating a warm, friendly, and collaborative environment.",
    h: "h-64 md:h-72",
  },
  {
    id: "discuss-5",
    src: docDiscuss5,
    category: "team",
    title: "Team-Based Care Coordination",
    description:
      "The clinical team working together to deliver the highest standard of patient care and safety.",
    h: "h-72 md:h-80",
  },

  // ── Our Team ──
  {
    id: "staff-1",
    src: staff,
    category: "team",
    title: "The Dental Plus Family",
    description:
      "Our dedicated team of professionals — Dr. Jigyasa Bhardwaj and her skilled nursing staff ready to welcome you.",
    h: "h-80 md:h-[450px]",
  },
  {
    id: "staff-2",
    src: staff2,
    category: "team",
    title: "Empathetic, Trained & Professional",
    description:
      "A team committed to empathetic, thorough, and completely sterilized dental care — making every visit feel safe.",
    h: "h-80 md:h-[400px]",
  },
];
