import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { galleryItems, galleryCategories, GalleryItem } from "@/lib/galleryData";

export function Gallery() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);

  // Filter items based on active tab
  const filteredItems = galleryItems.filter(
    (item) => activeCategory === "all" || item.category === activeCategory
  );

  // Find index of selected photo in current filtered list for navigation
  const selectedIndex = selectedPhoto
    ? filteredItems.findIndex((item) => item.id === selectedPhoto.id)
    : -1;

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIndex > 0) {
      setSelectedPhoto(filteredItems[selectedIndex - 1]);
    } else {
      setSelectedPhoto(filteredItems[filteredItems.length - 1]); // Loop to end
    }
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIndex < filteredItems.length - 1) {
      setSelectedPhoto(filteredItems[selectedIndex + 1]);
    } else {
      setSelectedPhoto(filteredItems[0]); // Loop to start
    }
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedPhoto) return;
      if (e.key === "Escape") setSelectedPhoto(null);
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPhoto, selectedIndex, filteredItems]);

  return (
    <section id="gallery" className="py-20 md:py-28 bg-gradient-soft relative">
      <div className="absolute -top-24 -left-24 size-[380px] rounded-full bg-cyan/10 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 size-[380px] rounded-full bg-primary/10 blur-3xl" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-4">
            Clinic Showcase
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-navy">
            Take a Virtual Tour of <span className="text-gradient">Dental Plus</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
            Explore our state-of-the-art operatory rooms, warm patient spaces, advanced computerized technology, and meet the supportive team here to care for you.
          </p>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex justify-center mb-12">
          <div className="flex gap-1.5 bg-secondary p-1.5 rounded-2xl overflow-x-auto max-w-full scrollbar-hide shadow-soft border border-border/40">
            {galleryCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 relative ${
                  activeCategory === cat.id
                    ? "text-primary bg-white shadow-soft"
                    : "text-muted-foreground hover:text-navy"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry Image Grid */}
        <motion.div 
          layout 
          className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="break-inside-avoid relative rounded-3xl overflow-hidden shadow-soft hover:shadow-card bg-card border border-border/40 group cursor-pointer"
                onClick={() => setSelectedPhoto(item)}
              >
                <div className="relative overflow-hidden w-full">
                  <img
                    src={item.src}
                    alt={item.title}
                    loading="lazy"
                    className={`w-full ${item.h} object-cover group-hover:scale-105 transition-transform duration-700 ease-out`}
                  />
                  {/* Subtle border overlay */}
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/10 group-hover:ring-white/20 transition-all pointer-events-none" />
                </div>
                
                {/* Floating Category Pill */}
                <div className="absolute top-4 left-4 z-10 glass px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-navy bg-white/70">
                  {item.category === "spaces" ? "Clinic & Rooms" : item.category === "doctor" ? "Dr. Jigyasa Bhardwaj" : "Our Team & Care"}
                </div>

                {/* Hover Reveal Details Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  {/* Zoom indicator icon */}
                  <div className="absolute top-4 right-4 size-10 rounded-full glass bg-white/20 flex items-center justify-center text-white transform -translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-75">
                    <ZoomIn className="size-5" />
                  </div>
                  
                  <span className="text-[10px] font-bold text-cyan uppercase tracking-widest mb-1">
                    {item.category}
                  </span>
                  <h3 className="text-white font-display font-bold text-base md:text-lg leading-tight transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                    {item.title}
                  </h3>
                  <p className="text-white/80 text-xs mt-1.5 line-clamp-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Glassmorphic Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col justify-between bg-navy/95 backdrop-blur-md py-6 px-4 md:px-8"
            onClick={() => setSelectedPhoto(null)}
          >
            {/* Modal Header Controls */}
            <div className="flex justify-between items-center w-full max-w-7xl mx-auto z-10">
              <span className="text-xs uppercase tracking-widest font-semibold text-white/50">
                Viewing Photo {selectedIndex + 1} of {filteredItems.length}
              </span>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="size-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all cursor-pointer"
                title="Close (ESC)"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Main Lightbox Image Viewport */}
            <div className="flex-1 flex items-center justify-center relative max-w-5xl mx-auto w-full my-4">
              {/* Left Arrow */}
              <button
                onClick={handlePrev}
                className="absolute left-0 md:-left-16 z-20 size-12 md:size-14 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-white border border-white/10 transition-all cursor-pointer"
                title="Previous (Left Arrow)"
              >
                <ChevronLeft className="size-6 md:size-7" />
              </button>

              {/* Central Image Card */}
              <motion.div
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="relative rounded-3xl overflow-hidden shadow-glow max-h-[60vh] md:max-h-[70vh] flex items-center justify-center"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image
              >
                <img
                  src={selectedPhoto.src}
                  alt={selectedPhoto.title}
                  className="max-h-[60vh] md:max-h-[70vh] w-auto max-w-full object-contain rounded-2xl border border-white/10"
                />
              </motion.div>

              {/* Right Arrow */}
              <button
                onClick={handleNext}
                className="absolute right-0 md:-right-16 z-20 size-12 md:size-14 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-white border border-white/10 transition-all cursor-pointer"
                title="Next (Right Arrow)"
              >
                <ChevronRight className="size-6 md:size-7" />
              </button>
            </div>

            {/* Modal Bottom Caption Panel */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ delay: 0.1 }}
              className="w-full max-w-3xl mx-auto text-center z-10 bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6 backdrop-blur-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="inline-block text-[10px] font-bold text-cyan uppercase tracking-widest mb-1.5">
                {selectedPhoto.category === "spaces" ? "Clinic & Rooms" : selectedPhoto.category === "doctor" ? "Dr. Jigyasa Bhardwaj" : "Our Team & Care"}
              </span>
              <h3 className="text-white font-display font-bold text-lg md:text-xl leading-tight">
                {selectedPhoto.title}
              </h3>
              <p className="text-white/70 text-xs md:text-sm mt-2 max-w-2xl mx-auto leading-relaxed">
                {selectedPhoto.description}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
