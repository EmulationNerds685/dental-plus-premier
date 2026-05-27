import { motion } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

const reviews = [
  { name: "Ananya Sharma", role: "Dehradun", text: "The most painless root canal I've ever had! Dr. Jigyasa Bhardwaj is incredibly skilled and the clinic feels world-class.", rating: 5 },
  { name: "Rohit Verma", role: "Ajabpur Kalan", text: "Got my teeth whitening done — results were stunning in a single visit. Highly recommend Dental Plus.", rating: 5 },
  { name: "Priya Negi", role: "Pragati Vihar", text: "Best dental clinic in Dehradun. Sterilization, technology and patient care are all top-notch.", rating: 5 },
  { name: "Manish Rawat", role: "Patel Nagar", text: "Got dental implants done here. Smooth process, transparent pricing, and excellent results.", rating: 5 },
  { name: "Sneha Bisht", role: "Dehradun", text: "Took my son for a checkup — super child-friendly clinic. He actually enjoyed the visit!", rating: 5 },
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [width, setWidth] = useState(1024);

  useEffect(() => {
    setWidth(window.innerWidth);
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  let visibleCards = 3;
  if (width < 640) {
    visibleCards = 1;
  } else if (width < 1024) {
    visibleCards = 2;
  }

  const maxIndex = Math.max(0, reviews.length - visibleCards);

  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [maxIndex, currentIndex]);

  // Autoplay functionality
  useEffect(() => {
    if (isHovered || maxIndex === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(timer);
  }, [isHovered, maxIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  return (
    <section 
      id="testimonials" 
      className="py-20 md:py-28 bg-gradient-soft overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-4">
            Testimonials
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-navy">
            Loved by <span className="text-gradient">10000+ Patients</span>
          </h2>
        </div>

        {/* Carousel Container */}
        <div className="relative mx-auto max-w-6xl px-1">
          <div className="overflow-hidden cursor-grab active:cursor-grabbing">
            <motion.div
              className="flex gap-0"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.25}
              onDragEnd={(e, info) => {
                const threshold = 40;
                if (info.offset.x < -threshold && currentIndex < maxIndex) {
                  handleNext();
                } else if (info.offset.x > threshold && currentIndex > 0) {
                  handlePrev();
                }
              }}
              animate={{ x: `-${currentIndex * (100 / visibleCards)}%` }}
              transition={{ type: "spring", stiffness: 180, damping: 22 }}
            >
              {reviews.map((r) => (
                <div
                  key={r.name}
                  className="shrink-0 px-3 select-none"
                  style={{ width: `${100 / visibleCards}%` }}
                >
                  <div className="bg-card rounded-3xl p-7 border border-border shadow-card h-full flex flex-col justify-between hover:shadow-glow hover:-translate-y-1 transition-all duration-300">
                    <div>
                      <Quote className="size-8 text-primary/30 mb-3" />
                      <div className="flex gap-1 mb-3">
                        {[...Array(r.rating)].map((_, i) => (
                          <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <p className="text-foreground/90 leading-relaxed italic">"{r.text}"</p>
                    </div>
                    <div className="mt-6 flex items-center gap-3 pt-4 border-t border-border/60">
                      <div className="size-11 rounded-full bg-gradient-primary grid place-items-center text-white font-semibold shadow-soft">
                        {r.name[0]}
                      </div>
                      <div>
                        <div className="font-semibold text-navy">{r.name}</div>
                        <div className="text-xs text-muted-foreground">{r.role}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Navigation Controls */}
          {maxIndex > 0 && (
            <div className="flex justify-center items-center gap-4 mt-10">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="size-12 rounded-full border border-border glass hover:bg-muted text-navy flex items-center justify-center transition-all shadow-soft hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100 disabled:cursor-not-allowed"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="size-5" />
              </button>

              {/* Dots */}
              <div className="flex items-center gap-2">
                {[...Array(maxIndex + 1)].map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentIndex === idx ? "w-6 bg-primary" : "w-2 bg-primary/20 hover:bg-primary/40"
                    }`}
                    aria-label={`Go to testimonial slide ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                disabled={currentIndex === maxIndex}
                className="size-12 rounded-full border border-border glass hover:bg-muted text-navy flex items-center justify-center transition-all shadow-soft hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100 disabled:cursor-not-allowed"
                aria-label="Next testimonial"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

