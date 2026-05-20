import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

const faqs = [
  { q: "Who is the best dentist in Dehradun?", a: "Dr. Jigyasa Bhardwaj at Dental Plus is one of the most trusted dentists in Dehradun, with 10+ years of experience in cosmetic, restorative and surgical dentistry. The clinic is empaneled with IIP PTCUL." },
  { q: "Is a root canal painful?", a: "Not at all. With modern anesthesia and advanced rotary endodontic equipment, root canal treatment at Dental Plus is virtually painless and often completed in a single visit." },
  { q: "What is the cost of dental implants in Dehradun?", a: "Dental implant costs vary based on the brand and number of teeth. We offer premium implants at transparent, affordable pricing with EMI options. Book a free consultation for an exact estimate." },
  { q: "How long does teeth whitening take?", a: "Our in-clinic professional whitening takes about 45–60 minutes and delivers visibly brighter teeth in a single sitting, lasting 12–18 months with proper care." },
  { q: "Do you provide emergency dental care?", a: "Yes — we offer same-day emergency dental care for severe pain, injuries, and urgent procedures during clinic hours. Call us directly for the fastest response." },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-4">FAQ</div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-navy">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h2>
        </div>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-display font-semibold text-navy">{f.q}</span>
                <motion.span animate={{ rotate: open === i ? 45 : 0 }} className="shrink-0">
                  <Plus className="size-5 text-primary" />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
