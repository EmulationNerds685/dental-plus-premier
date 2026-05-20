import { motion } from "framer-motion";
import smile from "@/assets/smile.jpg";
import clinic from "@/assets/hero-clinic.jpg";

const items = [
  { src: smile, h: "h-64", label: "Cosmetic Smile Design" },
  { src: clinic, h: "h-80", label: "Modern Clinic Interior" },
  { src: smile, h: "h-80", label: "Teeth Whitening" },
  { src: clinic, h: "h-64", label: "Implant Suite" },
  { src: smile, h: "h-72", label: "Veneers & Crowns" },
  { src: clinic, h: "h-72", label: "Digital Scanner Room" },
];

export function Gallery() {
  return (
    <section id="gallery" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-4">
            Smile Gallery
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-navy">
            Real Transformations, <span className="text-gradient">Real Confidence</span>
          </h2>
        </div>

        <div className="columns-2 lg:columns-3 gap-4 space-y-4">
          {items.map((it, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              className="break-inside-avoid relative rounded-2xl overflow-hidden shadow-card group"
            >
              <img src={it.src} alt={it.label} loading="lazy" className={`w-full ${it.h} object-cover group-hover:scale-105 transition-transform duration-500`} />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 text-white text-sm font-medium">{it.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
