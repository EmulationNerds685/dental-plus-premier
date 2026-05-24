import { motion } from "framer-motion";
import { GraduationCap, BadgeCheck, Stethoscope } from "lucide-react";
import doctorImg from "@/assets/optimized/doctor2.webp";
import { CLINIC } from "@/lib/clinic";

export function About() {
  return (
    <section id="about" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="absolute -inset-4 bg-gradient-primary opacity-20 rounded-[2rem] blur-2xl" />
          <div className="relative rounded-[2rem] overflow-hidden shadow-glow ring-1 ring-white/60">
            <img src={doctorImg} alt={CLINIC.doctor.name} width={1024} height={1280} loading="lazy" className="w-full h-[480px] sm:h-[560px] object-cover" />
          </div>
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 glass rounded-2xl px-5 py-3 shadow-card text-center">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Chief Dentist</div>
            <div className="font-display font-semibold text-navy">{CLINIC.doctor.name}</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-4">
            About the Doctor
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-navy">
            Meet <span className="text-gradient">{CLINIC.doctor.name}</span>
          </h2>
          <p className="mt-2 text-sm font-medium text-primary">{CLINIC.doctor.qualifications} • {CLINIC.doctor.panel}</p>

          <p className="mt-5 text-muted-foreground leading-relaxed">
            With over a decade of experience in modern cosmetic and restorative dentistry,
            Dr. Jigyasa Bhardwaj is passionate about delivering painless, precision care. She combines
            advanced clinical training with empathetic patient communication — ensuring every
            visit to Dental Plus feels safe, comfortable, and uplifting.
          </p>

          <div className="mt-8 grid sm:grid-cols-3 gap-4">
            {[
              { icon: GraduationCap, t: "BDS, MAOI", d: "Qualified Dental Surgeon" },
              { icon: BadgeCheck, t: "IIP PTCUL", d: "Empaneled Specialist" },
              { icon: Stethoscope, t: "10+ Years", d: "Clinical Experience" },
            ].map((b) => (
              <div key={b.t} className="rounded-2xl border border-border p-4 bg-card shadow-soft">
                <b.icon className="size-6 text-primary mb-2" />
                <div className="font-semibold text-navy text-sm">{b.t}</div>
                <div className="text-xs text-muted-foreground">{b.d}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
