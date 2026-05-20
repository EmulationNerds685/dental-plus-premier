import { CLINIC, waLink } from "@/lib/clinic";
import { Instagram, Facebook, Phone, MessageCircle, MapPin } from "lucide-react";

const services = [
  "Teeth Whitening", "Dental Implants", "Root Canal Treatment", "Veneers & Crowns",
  "Cosmetic Dentistry", "Pediatric Dentistry", "Emergency Care", "Laser Dentistry",
];

export function Footer() {
  return (
    <footer className="bg-navy text-white pt-16 pb-28 md:pb-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="size-10 rounded-xl bg-gradient-primary grid place-items-center"><span className="font-bold">D+</span></div>
            <div>
              <div className="font-display font-semibold text-lg">Dental Plus</div>
              <div className="text-[10px] uppercase tracking-widest text-white/60">Dehradun</div>
            </div>
          </div>
          <p className="text-sm text-white/70 leading-relaxed">
            Premium dental clinic in Dehradun offering advanced, painless and affordable dental treatments by {CLINIC.doctor.name}.
          </p>
          <div className="flex gap-3 mt-5">
            <a href="#" className="size-10 grid place-items-center rounded-full bg-white/10 hover:bg-white/20"><Instagram className="size-4" /></a>
            <a href="#" className="size-10 grid place-items-center rounded-full bg-white/10 hover:bg-white/20"><Facebook className="size-4" /></a>
          </div>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-4">Services</h4>
          <ul className="space-y-2 text-sm text-white/70">
            {services.map((s) => (
              <li key={s}><a href="#services" className="hover:text-cyan">{s} in Dehradun</a></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li><a href="#home" className="hover:text-cyan">Home</a></li>
            <li><a href="#about" className="hover:text-cyan">About Doctor</a></li>
            <li><a href="#why" className="hover:text-cyan">Why Choose Us</a></li>
            <li><a href="#testimonials" className="hover:text-cyan">Patient Reviews</a></li>
            <li><a href="#faq" className="hover:text-cyan">FAQs</a></li>
            <li><a href="#appointment" className="hover:text-cyan">Book Appointment</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-4">Contact</h4>
          <div className="space-y-3 text-sm text-white/75">
            <a href={CLINIC.mapsUrl} target="_blank" rel="noopener" className="flex gap-2 hover:text-cyan">
              <MapPin className="size-4 mt-0.5 shrink-0" />
              <span>{CLINIC.address.line1}, {CLINIC.address.line2}, {CLINIC.address.city}</span>
            </a>
            {CLINIC.phonesDisplay.map((p, i) => (
              <a key={p} href={`tel:${CLINIC.phones[i]}`} className="flex gap-2 hover:text-cyan">
                <Phone className="size-4 mt-0.5" /> {p}
              </a>
            ))}
            <a href={waLink()} target="_blank" rel="noopener" className="flex gap-2 hover:text-cyan">
              <MessageCircle className="size-4 mt-0.5" /> WhatsApp Us
            </a>
          </div>
        </div>
      </div>

      <div className="mt-12 pt-6 border-t border-white/10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between gap-3 text-xs text-white/50">
        <div>© {new Date().getFullYear()} Dental Plus. All rights reserved.</div>
        <div>Best Dental Clinic in Dehradun • Cosmetic & Implant Dentistry</div>
      </div>
    </footer>
  );
}
