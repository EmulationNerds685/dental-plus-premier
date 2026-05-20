import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarCheck, MessageCircle, Phone, MapPin, Clock } from "lucide-react";
import { CLINIC, waLink } from "@/lib/clinic";

const services = [
  "Dental Checkup", "Teeth Whitening", "Root Canal", "Dental Implants",
  "Cosmetic Dentistry", "Veneers & Crowns", "Pediatric Dentistry", "Emergency Care", "Other",
];

export function Appointment() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", service: services[0], message: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Hi Dental Plus,%0AName: ${form.name}%0APhone: ${form.phone}%0AService: ${form.service}%0AMessage: ${form.message}`;
    window.open(`https://wa.me/${CLINIC.whatsapp}?text=${msg}`, "_blank");
    setSubmitted(true);
  };

  return (
    <section id="appointment" className="py-20 md:py-28 bg-gradient-navy text-white relative overflow-hidden">
      <div className="absolute -top-20 -right-20 size-96 rounded-full bg-cyan/20 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 size-96 rounded-full bg-primary/30 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur px-4 py-1.5 text-xs font-semibold uppercase tracking-wider mb-4">
            Book Appointment
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            Ready for your <span className="text-cyan">perfect smile?</span>
          </h2>
          <p className="mt-4 text-white/75">Fill the form and we'll confirm your appointment instantly via WhatsApp.</p>

          <div className="mt-8 space-y-4">
            <div className="flex items-start gap-3">
              <div className="size-10 rounded-xl bg-white/10 grid place-items-center"><MapPin className="size-5" /></div>
              <div>
                <div className="font-semibold">Visit Us</div>
                <div className="text-sm text-white/70">{CLINIC.address.line1}, {CLINIC.address.line2}, {CLINIC.address.city}</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="size-10 rounded-xl bg-white/10 grid place-items-center"><Clock className="size-5" /></div>
              <div>
                <div className="font-semibold">Timings</div>
                {CLINIC.hours.map((h) => <div key={h.day} className="text-sm text-white/70">{h.day}: {h.time}</div>)}
              </div>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <a href={`tel:${CLINIC.phones[0]}`} className="inline-flex items-center gap-2 rounded-full bg-white text-navy px-5 py-3 font-semibold shadow-cta">
                <Phone className="size-4" /> {CLINIC.phonesDisplay[0]}
              </a>
              <a href={waLink()} target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-5 py-3 font-semibold shadow-cta">
                <MessageCircle className="size-4" /> WhatsApp
              </a>
            </div>
          </div>
        </motion.div>

        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
          className="glass rounded-3xl p-6 sm:p-8 shadow-glow text-navy"
        >
          <h3 className="font-display text-2xl font-semibold mb-5">Request Appointment</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Full Name</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-border bg-white/80 px-4 py-3 outline-none focus:ring-2 focus:ring-primary" placeholder="Your name" />
            </div>
            <div>
              <label className="text-sm font-medium">Phone Number</label>
              <input required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-border bg-white/80 px-4 py-3 outline-none focus:ring-2 focus:ring-primary" placeholder="+91 …" />
            </div>
            <div>
              <label className="text-sm font-medium">Service Required</label>
              <select value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-border bg-white/80 px-4 py-3 outline-none focus:ring-2 focus:ring-primary">
                {services.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Message (optional)</label>
              <textarea rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-border bg-white/80 px-4 py-3 outline-none focus:ring-2 focus:ring-primary" placeholder="Tell us briefly…" />
            </div>
            <button type="submit" className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-primary px-6 py-4 font-semibold text-primary-foreground shadow-cta hover:scale-[1.02] transition-transform">
              <CalendarCheck className="size-5" /> {submitted ? "Sent on WhatsApp ✓" : "Request Appointment"}
            </button>
            <p className="text-xs text-muted-foreground text-center">We'll respond within 15 minutes during clinic hours.</p>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
