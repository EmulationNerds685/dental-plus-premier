import { motion } from "framer-motion";
import { HeartHandshake, Microscope, UserRound, Award, Clock, BadgeIndianRupee, ShieldCheck, ScanLine, Baby } from "lucide-react";

const items = [
  { icon: HeartHandshake, title: "Painless Treatment", desc: "Modern anesthesia & gentle techniques for a stress-free visit." },
  { icon: Microscope, title: "Modern Equipment", desc: "State-of-the-art chairs, lasers and imaging technology." },
  { icon: UserRound, title: "Female Dentist", desc: "Comfortable & empathetic care for women and families." },
  { icon: Award, title: "Experienced Doctors", desc: "Years of expertise across cosmetic & surgical dentistry." },
  { icon: Clock, title: "Same-Day Treatment", desc: "Most procedures completed in a single visit." },
  { icon: BadgeIndianRupee, title: "Affordable Pricing", desc: "Transparent costs with EMI options available." },
  { icon: ShieldCheck, title: "Sterilization Standards", desc: "Hospital-grade autoclave & disposable kits." },
  { icon: ScanLine, title: "Digital Scanner", desc: "3D digital impressions — no messy moulds." },
  { icon: Baby, title: "Child-Friendly Clinic", desc: "A warm, welcoming space designed for kids." },
];

export function WhyUs() {
  return (
    <section id="why" className="py-20 md:py-28 bg-gradient-soft">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-4">
            Why Choose Us
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-navy">
            The <span className="text-gradient">Dental Plus</span> Difference
          </h2>
          <p className="mt-4 text-muted-foreground">Premium standards, modern technology, and a genuinely caring team.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((it, i) => (
            <motion.div
              key={it.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.45, delay: (i % 3) * 0.08 }}
              className="glass rounded-2xl p-6 shadow-soft hover:shadow-card transition-shadow"
            >
              <div className="size-14 rounded-2xl bg-gradient-primary grid place-items-center shadow-cta mb-4">
                <it.icon className="size-7 text-white" />
              </div>
              <h3 className="font-display text-lg font-semibold text-navy">{it.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{it.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
