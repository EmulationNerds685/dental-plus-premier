import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const reviews = [
  { name: "Ananya Sharma", role: "Dehradun", text: "The most painless root canal I've ever had! Dr. Jigyasa is incredibly skilled and the clinic feels world-class.", rating: 5 },
  { name: "Rohit Verma", role: "Ajabpur Kalan", text: "Got my teeth whitening done — results were stunning in a single visit. Highly recommend Dental Plus.", rating: 5 },
  { name: "Priya Negi", role: "Pragati Vihar", text: "Best dental clinic in Dehradun. Sterilization, technology and patient care are all top-notch.", rating: 5 },
  { name: "Manish Rawat", role: "Patel Nagar", text: "Got dental implants done here. Smooth process, transparent pricing, and excellent results.", rating: 5 },
  { name: "Sneha Bisht", role: "Dehradun", text: "Took my son for a checkup — super child-friendly clinic. He actually enjoyed the visit!", rating: 5 },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-20 md:py-28 bg-gradient-soft overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-4">
            Testimonials
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-navy">
            Loved by <span className="text-gradient">5000+ Patients</span>
          </h2>
        </div>

        <div className="flex gap-5 overflow-x-auto pb-6 snap-x snap-mandatory -mx-4 px-4 scrollbar-hide">
          {reviews.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="snap-start shrink-0 w-[85%] sm:w-[420px] bg-card rounded-3xl p-7 border border-border shadow-card"
            >
              <Quote className="size-8 text-primary/30 mb-3" />
              <div className="flex gap-1 mb-3">
                {[...Array(r.rating)].map((_, i) => <Star key={i} className="size-4 fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-foreground/90 leading-relaxed">"{r.text}"</p>
              <div className="mt-5 flex items-center gap-3">
                <div className="size-11 rounded-full bg-gradient-primary grid place-items-center text-white font-semibold">
                  {r.name[0]}
                </div>
                <div>
                  <div className="font-semibold text-navy">{r.name}</div>
                  <div className="text-xs text-muted-foreground">{r.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
