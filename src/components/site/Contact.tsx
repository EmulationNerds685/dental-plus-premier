import { MapPin, Phone, MessageCircle, Clock, Navigation } from "lucide-react";
import { CLINIC, waLink } from "@/lib/clinic";

export function Contact() {
  return (
    <section id="contact" className="py-20 md:py-28 bg-gradient-soft">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-4">Visit Us</div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-navy">
            Find <span className="text-gradient">Dental Plus</span> in Dehradun
          </h2>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 rounded-3xl overflow-hidden shadow-card border border-border bg-card h-[360px] sm:h-[460px]">
            <iframe
              title="Dental Plus location"
              src="https://www.google.com/maps?q=Dental+Plus+Clinic+Ajabpur+Kalan+Dehradun&output=embed"
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-2xl bg-card border border-border shadow-soft p-5">
              <div className="flex items-start gap-3">
                <div className="size-11 rounded-xl bg-primary/10 grid place-items-center"><MapPin className="size-5 text-primary" /></div>
                <div>
                  <div className="font-display font-semibold text-navy">Address</div>
                  <p className="text-sm text-muted-foreground mt-1">{CLINIC.address.line1}, {CLINIC.address.line2}, {CLINIC.address.city}</p>
                  <a href={CLINIC.mapsUrl} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 mt-2 text-sm font-medium text-primary">
                    <Navigation className="size-4" /> Get Directions
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-card border border-border shadow-soft p-5">
              <div className="flex items-start gap-3">
                <div className="size-11 rounded-xl bg-primary/10 grid place-items-center"><Clock className="size-5 text-primary" /></div>
                <div>
                  <div className="font-display font-semibold text-navy">Clinic Hours</div>
                  {CLINIC.hours.map((h) => (
                    <div key={h.day} className="text-sm text-muted-foreground mt-1">
                      <span className="text-navy font-medium">{h.day}:</span> {h.time}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <a href={`tel:${CLINIC.phones[0]}`} className="rounded-2xl bg-gradient-primary p-4 text-primary-foreground shadow-cta flex flex-col items-center justify-center gap-1">
                <Phone className="size-5" />
                <span className="text-sm font-semibold">Call Now</span>
              </a>
              <a href={waLink()} target="_blank" rel="noopener" className="rounded-2xl bg-whatsapp p-4 text-white shadow-cta flex flex-col items-center justify-center gap-1">
                <MessageCircle className="size-5" />
                <span className="text-sm font-semibold">WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
