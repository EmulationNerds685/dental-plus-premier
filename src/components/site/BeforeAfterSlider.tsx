import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import beforeImg from "@/assets/optimized/before.webp";
import afterImg from "@/assets/optimized/after.webp";

export function BeforeAfterSlider() {
  const [sliderPosition, setSliderPosition] = useState(50); // percentage (0 - 100)
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(600);
  const [containerHeight, setContainerHeight] = useState(400);

  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setContainerWidth(rect.width);
      setContainerHeight(rect.height);
    }

    const handleResize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerWidth(rect.width);
        setContainerHeight(rect.height);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.buttons === 1 || isDragging) {
      handleMove(e.clientX);
    }
  };

  // Keyboard navigation for accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      setSliderPosition((prev) => Math.max(0, prev - 5));
    } else if (e.key === "ArrowRight") {
      setSliderPosition((prev) => Math.min(100, prev + 5));
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
        className="relative w-full max-w-2xl h-[320px] sm:h-[400px] rounded-3xl overflow-hidden shadow-glow cursor-ew-resize select-none border border-white/20 group"
      >
        {/* AFTER IMAGE (The base/underneath image - clean, white, beautiful) */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src={afterImg}
            alt="After Treatment"
            className="w-full h-full object-cover"
            draggable="false"
          />
          <div className="absolute bottom-4 right-4 bg-primary/80 backdrop-blur px-3 py-1 rounded-lg text-xs font-semibold text-white tracking-wider flex items-center gap-1">
            <Sparkles className="size-3 fill-amber-300 text-amber-300" /> AFTER TREATMENT
          </div>
        </div>

        {/* BEFORE IMAGE (The sliding overlay) */}
        <div
          className="absolute inset-0 h-full overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={beforeImg}
            alt="Before Treatment"
            className="absolute inset-0 w-full h-full object-cover max-w-none"
            style={{
              width: `${containerWidth}px`,
              height: `${containerHeight}px`,
            }}
            draggable="false"
          />
          <div className="absolute bottom-4 left-4 bg-navy/80 backdrop-blur px-3 py-1 rounded-lg text-xs font-semibold text-white tracking-wider">
            BEFORE TREATMENT
          </div>
        </div>

        {/* SLIDER BAR / DRAG HANDLE */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize flex items-center justify-center"
          style={{ left: `${sliderPosition}%` }}
        >
          <div
            tabIndex={0}
            onKeyDown={handleKeyDown}
            aria-label="Smile comparison slider drag handle. Use left and right arrow keys to compare."
            aria-valuenow={sliderPosition}
            aria-valuemin={0}
            aria-valuemax={100}
            role="slider"
            className="size-9 rounded-full bg-white text-primary shadow-glow flex items-center justify-center border-2 border-primary hover:scale-110 active:scale-95 transition-transform outline-none focus:ring-2 focus:ring-primary/50"
          >
            <svg
              className="size-4 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M8 9l-4 4 4 4m8 0l4-4-4-4"
              />
            </svg>
          </div>
        </div>
      </div>
      <p className="mt-3 text-xs text-muted-foreground text-center">
        Drag the slider horizontally to view the instant transformation.
      </p>
      <div className="mt-6 text-center">
        <Link
          to="/results"
          className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-6 py-2.5 text-sm font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200 group"
        >
          View All Patient Transformations
          <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
