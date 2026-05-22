import { Phone, MessageCircle, CalendarCheck } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { CLINIC, waLink } from "@/lib/clinic";

export function MobileCta() {
  return (
    <>
      {/* Floating WhatsApp (tablet/desktop only) */}
      <a
        href={waLink()}
        target="_blank"
        rel="noopener"
        aria-label="WhatsApp Dental Plus"
        className="hidden md:grid fixed right-4 bottom-6 z-40 size-14 place-items-center rounded-full bg-whatsapp text-white shadow-cta animate-pulse-ring"
      >
        <MessageCircle className="size-7" />
      </a>

      {/* Sticky bottom bar (mobile only) */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 glass border-t border-border">
        <div className="grid grid-cols-3 gap-1 p-2">
          <a href={`tel:${CLINIC.phones[0]}`} className="flex flex-col items-center gap-1 py-2 rounded-xl text-navy">
            <Phone className="size-5" />
            <span className="text-[11px] font-semibold">Call</span>
          </a>
          <a href={waLink()} target="_blank" rel="noopener" className="flex flex-col items-center gap-1 py-2 rounded-xl bg-whatsapp text-white">
            <MessageCircle className="size-5" />
            <span className="text-[11px] font-semibold">WhatsApp</span>
          </a>
          <Link to="/appointment" className="flex flex-col items-center gap-1 py-2 rounded-xl bg-gradient-primary text-primary-foreground text-center">
            <CalendarCheck className="size-5 mx-auto" />
            <span className="text-[11px] font-semibold">Book</span>
          </Link>
        </div>
      </div>
    </>
  );
}
