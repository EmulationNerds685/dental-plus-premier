import { useState, useMemo } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { MobileCta } from "@/components/site/MobileCta";
import { motion, AnimatePresence } from "framer-motion";
import { serviceDetails } from "@/lib/servicesData";
import { Search, ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Dental Treatments & Services in Dehradun | Dental Plus" },
      { name: "description", content: "Explore our range of general, cosmetic & restorative dental treatments including painless root canals, implants, whitening, and veneers in Dehradun by Dr. Jigyasa Bhardwaj." },
      { name: "keywords", content: "Root Canal Dehradun, Teeth Whitening Dehradun, Dental Implants Dehradun, Dentist Services Dehradun, Veneers Dehradun" },
    ],
  }),
  component: ServicesPage,
});

const categories = ["All", "Cosmetic", "Restorative", "General", "Emergency"];

function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  const navigate = useNavigate();

  // Filter services dynamically
  const filteredServices = useMemo(() => {
    return serviceDetails.filter((s) => {
      const matchesCategory = selectedCategory === "All" || s.category === selectedCategory;
      const matchesSearch =
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.desc.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <main className="min-h-screen bg-background overflow-x-hidden pt-20">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 bg-gradient-hero overflow-hidden">
        <div className="absolute -bottom-32 -left-20 size-[380px] rounded-full bg-primary/20 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-4">
            Our Clinical Treatments
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-navy leading-none">
            Advanced <span className="text-gradient">Dental Solutions</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            From emergency relief to Hollywood-grade cosmetic makeovers. Click on a treatment to view detailed procedures, custom FAQs, and book your slot.
          </p>
        </div>
      </section>

      {/* Search and Filters Bar */}
      <section className="py-8 bg-white border-y border-border sticky top-16 md:top-20 z-40 shadow-soft">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Categories Tabs */}
          <div className="flex gap-1 bg-secondary p-1 rounded-2xl overflow-x-auto w-full md:w-auto scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                  selectedCategory === cat
                    ? "bg-white text-primary shadow-soft"
                    : "text-muted-foreground hover:text-navy"
                }`}
              >
                {cat} {cat !== "All" && `(${serviceDetails.filter(s => s.category === cat).length})`}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search treatments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-border bg-secondary/50 pl-10 pr-4 py-2.5 text-sm text-navy outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground hover:text-navy"
              >
                Clear
              </button>
            )}
          </div>

        </div>
      </section>

      {/* Services Grid Section */}
      <section className="py-12 bg-gradient-soft min-h-[500px]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <AnimatePresence mode="popLayout">
            {filteredServices.length > 0 ? (
              <motion.div
                layout
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6"
              >
                {filteredServices.map((s) => {
                  const Icon = s.icon;
                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      key={s.title}
                      onClick={() => navigate({ to: "/services/$slug", params: { slug: s.slug } })}
                      className="group cursor-pointer bg-card rounded-2xl p-5 border border-border hover:border-primary/40 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all flex flex-col"
                    >
                      <div className="size-12 rounded-xl bg-gradient-to-br from-primary/10 to-cyan/20 grid place-items-center mb-4 group-hover:bg-gradient-primary transition-all duration-300">
                        <Icon className="size-6 text-primary group-hover:text-white transition-colors duration-300" />
                      </div>
                      
                      <div className="inline-block text-[9px] font-bold uppercase tracking-wider text-primary mb-1">
                        {s.category}
                      </div>

                      <h3 className="font-display font-bold text-navy text-base sm:text-lg group-hover:text-primary transition-colors">
                        {s.title}
                      </h3>
                      
                      <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground leading-relaxed flex-1">
                        {s.desc}
                      </p>

                      <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs text-primary font-semibold group-hover:translate-x-1 transition-transform">
                        <span>Learn More</span>
                        <span>→</span>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 max-w-md mx-auto"
              >
                <ShieldAlert className="size-12 text-primary/40 mx-auto mb-4" />
                <h3 className="font-display font-semibold text-lg text-navy">No treatments found</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  We couldn't find any results matching "{searchQuery}". Try clearing your filters or search terms.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory("All");
                    setSearchQuery("");
                  }}
                  className="mt-5 inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white shadow-soft"
                >
                  Reset All Filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <Footer />
      <MobileCta />
    </main>
  );
}
