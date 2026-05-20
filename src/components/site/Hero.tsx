import { motion } from "framer-motion";
import { Phone, MessageCircle, Calendar, ShieldCheck, Sparkles, Star } from "lucide-react";
import heroImg from "@/assets/hero-clinic.jpg";
import { CLINIC, waLink } from "@/lib/clinic";

export function Hero() {
  return (
    <section id="home" className="relative pt-28 md:pt-36 pb-16 md:pb-24 bg-gradient-hero overflow-hidden">
      <div className="absolute -top-24 -right-24 size-[420px] rounded-full bg-cyan/20 blur-3xl" />
      <div className="absolute -bottom-32 -left-20 size-[420px] rounded-full bg-primary/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-medium text-navy mb-5">
            <Sparkles className="size-3.5 text-primary" />
            Trusted Dental Clinic in Dehradun
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-navy leading-[1.05]">
            Premium Dental Care.{" "}
            <span className="text-gradient">Confident Smiles.</span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-xl">
            Advanced, painless & affordable dental treatments by{" "}
            <span className="text-navy font-semibold">{CLINIC.doctor.name}</span>. Modern equipment, sterilized environment, and personal care.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#appointment" className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3.5 font-semibold text-primary-foreground shadow-cta hover:scale-[1.03] transition-transform">
              <Calendar className="size-5" /> Book Appointment
            </a>
            <a href={waLink()} target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-6 py-3.5 font-semibold text-white shadow-soft hover:scale-[1.03] transition-transform">
              <MessageCircle className="size-5" /> WhatsApp
            </a>
            <a href={`tel:${CLINIC.phones[0]}`} className="inline-flex items-center gap-2 rounded-full glass px-6 py-3.5 font-semibold text-navy hover:scale-[1.03] transition-transform">
              <Phone className="size-5" /> Call Now
            </a>
          </div>

          <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><ShieldCheck className="size-5 text-primary" /> Sterilized Clinic</div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => <Star key={i} className="size-4 fill-amber-400 text-amber-400" />)}
              <span className="ml-1 font-medium text-navy">4.9</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.1 }}
          className="relative"
        >
          <div className="relative rounded-3xl overflow-hidden shadow-glow ring-1 ring-white/60">
            <img src={heroImg} alt="Modern dental clinic in Dehradun" width={1536} height={1024} className="w-full h-[420px] sm:h-[520px] object-cover" />
            <div className="absolute inset-0 bg-gradient-to-tr from-navy/30 via-transparent to-transparent" />
          </div>

          <motion.div
            animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity }}
            className="absolute -left-4 sm:-left-8 top-10 glass rounded-2xl p-4 shadow-card w-44"
          >
            <div className="text-3xl font-bold text-gradient">10+</div>
            <div className="text-xs text-muted-foreground">Years of clinical excellence</div>
          </motion.div>
          <motion.div
            animate={{ y: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity, delay: 1 }}
            className="absolute -right-3 sm:-right-6 bottom-8 glass rounded-2xl p-4 shadow-card w-48"
          >
            <div className="flex items-center gap-2">
              <div className="size-9 rounded-full bg-gradient-primary grid place-items-center">
                <Sparkles className="size-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-navy">5000+ Smiles</div>
                <div className="text-[11px] text-muted-foreground">Treated with care</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
