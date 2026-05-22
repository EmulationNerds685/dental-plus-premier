import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { MobileCta } from "@/components/site/MobileCta";
import { motion } from "framer-motion";
import { CLINIC, waLink } from "@/lib/clinic";
import { Phone, Mail, MapPin, Clock, MessageSquare, Compass, Send, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: `Contact Dental Plus | Best Dental Clinic in Ajabpur Kalan Dehradun` },
      { name: "description", content: `Get directions, timings, and contact details for Dental Plus Clinic in Dehradun. Reach Dr. Jigyasa Bhardwaj at ${CLINIC.phonesDisplay[0]} or message on WhatsApp.` },
      { name: "keywords", content: "Dental Plus Dehradun contact, dentist number Dehradun, dentist timings Ajabpur Kalan, dentist address Dehradun" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "Query", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate sending message to WhatsApp
    const msg = `Hi Dental Plus,%0AName: ${form.name}%0APhone: ${form.phone}%0ASubject: ${form.subject}%0AMessage: ${form.message}`;
    window.open(`https://wa.me/${CLINIC.whatsapp}?text=${msg}`, "_blank");
    setFormSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-background overflow-x-hidden pt-20">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 bg-gradient-hero overflow-hidden">
        <div className="absolute -top-24 -right-24 size-[380px] rounded-full bg-cyan/20 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-4">
            Get in touch
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-navy leading-none">
            Contact <span className="text-gradient">Our Clinic</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
            Have questions about a treatment, costs, or scheduling? Reach out via phone, WhatsApp, or drop a message below.
          </p>
        </div>
      </section>

      {/* Contact Cards & Form Details */}
      <section className="py-12 bg-gradient-soft">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-10">
          
          {/* Contact Details & Map Card (Right side, 5 columns) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-card rounded-3xl p-6 sm:p-8 border border-border shadow-soft">
              <h2 className="font-display font-bold text-navy text-xl mb-6">Clinic Information</h2>
              
              <div className="space-y-6">
                
                {/* Location */}
                <div className="flex gap-4 items-start">
                  <div className="size-11 rounded-xl bg-primary/10 grid place-items-center text-primary shrink-0">
                    <MapPin className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy text-sm sm:text-base">Clinic Address</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      {CLINIC.address.line1}, {CLINIC.address.line2}, {CLINIC.address.city}
                    </p>
                    <a
                      href={CLINIC.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary font-semibold hover:underline mt-2"
                    >
                      <Compass className="size-3.5 animate-spin" style={{ animationDuration: "12s" }} /> Get Directions on Google Maps
                    </a>
                  </div>
                </div>

                {/* Phones */}
                <div className="flex gap-4 items-start">
                  <div className="size-11 rounded-xl bg-primary/10 grid place-items-center text-primary shrink-0">
                    <Phone className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy text-sm sm:text-base">Call Clinic</h3>
                    <div className="mt-1 space-y-1">
                      {CLINIC.phonesDisplay.map((p, i) => (
                        <a
                          key={p}
                          href={`tel:${CLINIC.phones[i]}`}
                          className="block text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          {p}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Timings */}
                <div className="flex gap-4 items-start">
                  <div className="size-11 rounded-xl bg-primary/10 grid place-items-center text-primary shrink-0">
                    <Clock className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy text-sm sm:text-base">Working Hours</h3>
                    <div className="mt-1 space-y-1">
                      {CLINIC.hours.map((h) => (
                        <div key={h.day} className="text-xs sm:text-sm text-muted-foreground flex justify-between gap-4">
                          <span className="font-medium text-navy/70">{h.day}:</span>
                          <span>{h.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* WhatsApp Chat */}
                <div className="flex gap-4 items-start">
                  <div className="size-11 rounded-xl bg-primary/10 grid place-items-center text-primary shrink-0">
                    <MessageSquare className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy text-sm sm:text-base">Instant WhatsApp</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      Have a quick query? Send us a direct WhatsApp text. We respond in minutes.
                    </p>
                    <a
                      href={waLink("Hi Dental Plus, I have a query about your services.")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-whatsapp px-4 py-2 text-xs font-semibold text-white shadow-soft hover:scale-[1.03] transition-transform mt-3"
                    >
                      <MessageSquare className="size-3.5 fill-white text-whatsapp" /> Chat with Us
                    </a>
                  </div>
                </div>

              </div>
            </div>

            {/* Static High-quality visual map placeholder */}
            <div className="relative rounded-3xl overflow-hidden border border-border shadow-soft h-64 group bg-secondary">
              {/* Embed map */}
              <iframe
                title="Dental Plus Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3444.6974797072485!2d78.04944437637172!3d30.288416674801127!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390921bb55555555%3A0xe54e3d36ea1a5d2e!2sDental+Plus+Clinic!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                className="w-full h-full border-none filter contrast-[1.05]"
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/80 to-transparent p-4 flex justify-between items-center text-white">
                <div className="text-xs font-semibold">Swami Dayanand Saraswati Setu, Pragati Vihar</div>
                <a
                  href={CLINIC.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-primary hover:bg-primary/95 text-[10px] font-bold py-1 px-3 rounded-full uppercase tracking-wider"
                >
                  Open Maps
                </a>
              </div>
            </div>
          </div>

          {/* Form Box (Left side, 7 columns) */}
          <div className="lg:col-span-7">
            <div className="bg-card rounded-3xl p-6 sm:p-8 border border-border shadow-card">
              <h2 className="font-display font-bold text-navy text-xl mb-2">Send us a Message</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Fill this form, and we will automatically direct your query to our coordination team.
              </p>

              {formSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 text-center text-emerald-800"
                >
                  <CheckCircle2 className="size-12 text-emerald-500 mx-auto mb-3" />
                  <h3 className="font-display font-semibold text-lg">Query Shared!</h3>
                  <p className="text-sm mt-1 text-emerald-700/95 max-w-sm mx-auto">
                    Your message has been formatted and opened in WhatsApp. We will confirm details shortly!
                  </p>
                  <button
                    onClick={() => setFormSubmitted(false)}
                    className="mt-5 text-xs font-bold text-primary hover:underline"
                  >
                    Send another query
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-navy">Your Name *</label>
                      <input
                        required
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="John Doe"
                        className="mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-navy outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-navy">Phone Number *</label>
                      <input
                        required
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+91 99999 99999"
                        className="mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-navy outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-navy">Subject</label>
                    <select
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-navy outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    >
                      <option>Treatment Cost Estimate</option>
                      <option>Painless Procedures Query</option>
                      <option>General Feedback</option>
                      <option>Other Question</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-navy">Your Message *</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Hi Dr. Jigyasa, I wanted to know..."
                      className="mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-navy outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-primary px-6 py-4 font-semibold text-primary-foreground shadow-cta hover:scale-[1.02] active:scale-95 transition-transform"
                  >
                    <Send className="size-4.5" /> Send via WhatsApp
                  </button>
                  <p className="text-[10px] text-center text-muted-foreground mt-2">
                    * Required fields. Submitting will format details and prompt WhatsApp to send instantly.
                  </p>
                </form>
              )}

            </div>
          </div>

        </div>
      </section>

      <Footer />
      <MobileCta />
    </main>
  );
}
