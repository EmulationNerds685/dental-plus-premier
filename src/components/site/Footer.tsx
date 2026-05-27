import { CLINIC, waLink } from "@/lib/clinic";
import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Phone, MessageCircle, MapPin, Youtube } from "lucide-react";
import logoImg from "@/assets/optimized/DP_Logo.webp";

const services = [
  "Teeth Whitening", "Dental Implants", "Root Canal Treatment", "Veneers & Crowns",
  "Cosmetic Dentistry", "Pediatric Dentistry", "Emergency Care", "Laser Dentistry",
];

export function Footer() {
  return (
    <footer className="bg-navy text-white pt-16 pb-28 md:pb-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <img src={logoImg} alt="Dental Plus Logo" className="h-10 w-auto object-contain shrink-0" />
            <div>
              <div className="font-display font-semibold text-lg">{CLINIC.name}</div>
              <div className="text-[10px] uppercase tracking-widest text-white/60">Dehradun</div>
            </div>
          </div>
          <p className="text-sm text-white/70 leading-relaxed">
            Premium dental clinic in Dehradun offering advanced, painless and affordable dental treatments by {CLINIC.doctor.name}.
          </p>
          <div className="flex gap-3 mt-5">
            <a
              href={CLINIC.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="size-10 grid place-items-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="size-4" />
            </a>
            <a
              href={CLINIC.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="size-10 grid place-items-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="size-4" />
            </a>
            {CLINIC.social.youtube && (
              <a
                href={CLINIC.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="size-10 grid place-items-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="size-4" />
              </a>
            )}
          </div>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-4">Services</h4>
          <ul className="space-y-2 text-sm text-white/70">
            {services.map((s) => (
              <li key={s}>
                <Link to="/services" className="hover:text-cyan">
                  {s} in Dehradun
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link to="/" className="hover:text-cyan">Home</Link></li>
            <li><Link to="/about" className="hover:text-cyan">About Doctor</Link></li>
            <li><Link to="/services" className="hover:text-cyan">Our Services</Link></li>
            <li><Link to="/contact" className="hover:text-cyan">Contact Us</Link></li>
            <li><Link to="/appointment" className="hover:text-cyan">Book Appointment</Link></li>
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
        <div>© {new Date().getFullYear()} {CLINIC.name}. All rights reserved.</div>
        <div>Best Dental Clinic in Dehradun • Cosmetic & Implant Dentistry</div>
      </div>
    </footer>
  );
}
