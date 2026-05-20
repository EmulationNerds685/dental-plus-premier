import { motion } from "framer-motion";
import {
  Sparkles, Smile, Stethoscope, Gem, Bone, Layers, Siren, Scissors,
  Shield, Zap, ShieldCheck, Activity, Baby, Wrench, Droplets, RefreshCw,
  Crown, ScanLine, CalendarCheck,
} from "lucide-react";

const services = [
  { icon: Sparkles, title: "Teeth Whitening", desc: "Brighter smile in a single sitting." },
  { icon: Smile, title: "Dental Bonding", desc: "Repair chips and gaps seamlessly." },
  { icon: Stethoscope, title: "Dental Checkups", desc: "Comprehensive oral evaluation." },
  { icon: Gem, title: "Cosmetic Dentistry", desc: "Designed for premium aesthetics." },
  { icon: Bone, title: "Dental Implants", desc: "Permanent, natural-looking teeth." },
  { icon: Layers, title: "Dentures & Bridges", desc: "Custom-fit restorations." },
  { icon: Siren, title: "Emergency Care", desc: "Immediate relief, any urgency." },
  { icon: Scissors, title: "Tooth Extractions", desc: "Painless, precise procedures." },
  { icon: Shield, title: "Fillings & Sealants", desc: "Protect and restore enamel." },
  { icon: Zap, title: "Laser Dentistry", desc: "Advanced, minimally invasive." },
  { icon: ShieldCheck, title: "Mouth Guards", desc: "Custom protection for sports." },
  { icon: Activity, title: "Oral Surgery", desc: "Expert surgical interventions." },
  { icon: Baby, title: "Pediatric Dentistry", desc: "Gentle care for children." },
  { icon: Wrench, title: "Root Canal Treatment", desc: "Save your natural teeth." },
  { icon: Droplets, title: "Teeth Cleaning", desc: "Professional scaling & polish." },
  { icon: RefreshCw, title: "Teeth Reshaping", desc: "Subtle contouring artistry." },
  { icon: Crown, title: "Veneers & Crowns", desc: "Hollywood-grade aesthetics." },
  { icon: ScanLine, title: "Dental X-Ray", desc: "Digital diagnostic imaging." },
  { icon: CalendarCheck, title: "Online Booking", desc: "Reserve your slot instantly." },
];

export function Services() {
  return (
    <section id="services" className="py-20 md:py-28 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-4">
            Our Services
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-navy">
            Complete Dental Solutions <span className="text-gradient">Under One Roof</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            From routine checkups to advanced cosmetic dentistry — everything you need for a healthy, confident smile.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: (i % 8) * 0.04 }}
              className="group relative bg-card rounded-2xl p-5 sm:p-6 border border-border hover:border-primary/30 shadow-soft hover:shadow-card transition-all hover:-translate-y-1"
            >
              <div className="size-12 rounded-xl bg-gradient-to-br from-primary/10 to-cyan/20 grid place-items-center mb-4 group-hover:bg-gradient-primary transition-all">
                <s.icon className="size-6 text-primary group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-display font-semibold text-navy text-base sm:text-lg">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
