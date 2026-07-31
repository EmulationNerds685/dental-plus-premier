import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, ChevronLeft, ChevronRight } from "lucide-react";

// Import optimized before/after pairs
import before1 from "@/assets/optimized/before1.webp";
import after1 from "@/assets/optimized/after1.webp";
import before2 from "@/assets/optimized/before2.webp";
import after2 from "@/assets/optimized/after2.webp";
import before3 from "@/assets/optimized/before3.webp";
import after3 from "@/assets/optimized/after3.webp";
import before4 from "@/assets/optimized/before4.JPG";
import after4 from "@/assets/optimized/after4.webp";
import before5 from "@/assets/optimized/before5.webp";
import after5 from "@/assets/optimized/after5.webp";
import before6 from "@/assets/optimized/before6.PNG";
import after6 from "@/assets/optimized/after6.png";
import before7 from "@/assets/optimized/before7.png";
import after7 from "@/assets/optimized/after7.png";
import before8 from "@/assets/optimized/before8.png";
import after8 from "@/assets/optimized/after8.png";
const cases = [
  {
    id: 1,
    before: before1,
    after: after1,
    label: "Crown and Bridges",
    description: "Multiple missing teeth replaced with custom ceramic bridges for a seamless, functional smile.",
  },
  {
    id: 2,
    before: before2,
    after: after2,
    label: "Crown and Bridges",
    description: "Damaged teeth reconstructed with full-coverage crowns to restore strength and aesthetics.",
  },
  {
    id: 3,
    before: before3,
    after: after3,
    label: "Crown and Bridges",
    description: "Span of missing teeth bridged with precision-fitted porcelain units for natural alignment.",
  },
  {
    id: 4,
    before: before4,
    after: after4,
    label: "Crown and Bridges",
    description: "Severely worn and broken teeth rebuilt with durable crowns to re-establish proper bite and shape.",
  },
  {
    id: 5,
    before: before5,
    after: after5,
    label: "Teeth Whitening",
    description: "Noticeable shade improvement achieved through professional bleaching for a brighter smile.",
  },
  {
    id: 6,
    before: before6,
    after: after6,
    label: "Composite Restoration",
    description: "Chips, gaps, and discoloration corrected with tooth-colored composite resin bonding.",
  },
{
  id: 7,
  before: before7,
  after: after7,
  label: "Smile Designing",
  description: "Customized facial analysis and digital planning to create a harmonious, personalized smile transformation.",
}
  ,
{
  id: 8,
  before: before8,
  after: after8,
  label: "Complete Denture",
  description: "Full upper or lower arch replacement restoring chewing function, facial support, and a natural-looking smile.",
}
];
// ─── Individual Case Slider ───────────────────────────────────────────────────
function CaseSlider({
  before,
  after,
  label,
  description,
  index,
}: {
  before: string;
  after: string;
  label: string;
  description: string;
  index: number;
}) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(600);
  const [containerHeight, setContainerHeight] = useState(400);

  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerWidth(rect.width);
        setContainerHeight(rect.height);
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(pct);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") setSliderPosition((p) => Math.max(0, p - 5));
    else if (e.key === "ArrowRight") setSliderPosition((p) => Math.min(100, p + 5));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: "easeOut" }}
      className="bg-card rounded-3xl overflow-hidden border border-border shadow-soft hover:shadow-card transition-shadow"
    >
      {/* Slider */}
      <div
        ref={containerRef}
        onMouseMove={(e) => { if (e.buttons === 1 || isDragging) handleMove(e.clientX); }}
        onTouchMove={(e) => { if (e.touches.length > 0) handleMove(e.touches[0].clientX); }}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
        className="relative w-full h-64 sm:h-80 cursor-ew-resize select-none overflow-hidden"
      >
        {/* After (base) */}
        <div className="absolute inset-0">
          <img src={after} alt="After Treatment" className="w-full h-full object-cover" draggable="false" />
          <div className="absolute bottom-3 right-3 bg-primary/80 backdrop-blur px-2.5 py-1 rounded-lg text-[10px] font-semibold text-white tracking-wider flex items-center gap-1">
            <Sparkles className="size-2.5 fill-amber-300 text-amber-300" /> AFTER
          </div>
        </div>

        {/* Before (overlay) */}
        <div className="absolute inset-0 h-full overflow-hidden" style={{ width: `${sliderPosition}%` }}>
          <img
            src={before}
            alt="Before Treatment"
            className="absolute inset-0 object-cover max-w-none"
            style={{ width: `${containerWidth}px`, height: `${containerHeight}px` }}
            draggable="false"
          />
          <div className="absolute bottom-3 left-3 bg-navy/80 backdrop-blur px-2.5 py-1 rounded-lg text-[10px] font-semibold text-white tracking-wider">
            BEFORE
          </div>
        </div>

        {/* Drag handle */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white/80 cursor-ew-resize flex items-center justify-center"
          style={{ left: `${sliderPosition}%` }}
        >
          <div
            tabIndex={0}
            onKeyDown={handleKeyDown}
            role="slider"
            aria-label="Before/after comparison slider"
            aria-valuenow={sliderPosition}
            aria-valuemin={0}
            aria-valuemax={100}
            className="size-8 rounded-full bg-white text-primary shadow-glow flex items-center justify-center border-2 border-primary hover:scale-110 active:scale-95 transition-transform outline-none focus:ring-2 focus:ring-primary/50"
          >
            <div className="flex items-center gap-px">
              <ChevronLeft className="size-3 shrink-0" />
              <ChevronRight className="size-3 shrink-0" />
            </div>
          </div>
        </div>
      </div>

      {/* Card info */}
      <div className="p-5">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-2">
          {label}
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        <p className="mt-2 text-[11px] text-muted-foreground/60">
          Drag the slider ← → to compare
        </p>
      </div>
    </motion.div>
  );
}

// ─── Results Gallery ──────────────────────────────────────────────────────────
export function ResultsGallery() {
  return (
    <div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
        {cases.map((c, i) => (
          <CaseSlider
            key={c.id}
            before={c.before}
            after={c.after}
            label={c.label}
            description={c.description}
            index={i}
          />
        ))}
      </div>
      <p className="mt-10 text-center text-xs text-muted-foreground/60">
        * Photos are of actual patients treated at Dental Plus, Dehradun. Results may vary.
      </p>
    </div>
  );
}
