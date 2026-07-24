import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { MobileCta } from "@/components/site/MobileCta";
import { ResultsGallery } from "@/components/site/ResultsGallery";
import { ArrowRight, Sparkles } from "lucide-react";

export const Route = createFileRoute("/results")({
  head: () => ({
    meta: [
      {
        title:
          "Before & After Results — Real Patient Transformations | Dental Plus Dehradun",
      },
      {
        name: "description",
        content:
          "See real before and after dental treatment photos from actual patients at Dental Plus, Dehradun. Smile makeovers, teeth whitening, veneers, and more by Dr. Jigyasa Bhardwaj.",
      },
      {
        name: "keywords",
        content:
          "Dental Before After Dehradun, Smile Makeover Results, Teeth Whitening Before After, Dental Transformation Dehradun",
      },
      {
        property: "og:title",
        content: "Real Patient Transformations — Dental Plus Dehradun",
      },
      {
        property: "og:description",
        content:
          "Swipe through actual before & after dental results from Dental Plus clinic, Dehradun.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: ResultsPage,
});

function ResultsPage() {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 relative overflow-hidden">
        <div className="absolute -top-32 -right-32 size-[500px] rounded-full bg-cyan/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 size-[400px] rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-5">
            <Sparkles className="size-3.5 text-amber-400 fill-amber-400" />
            Real Patient Results
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-navy leading-tight">
            Smile Transformations{" "}
            <span className="text-gradient">That Speak for Themselves</span>
          </h1>
          <p className="mt-5 text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Every smile below belongs to a real patient treated at Dental Plus
            by Dr. Jigyasa Bhardwaj. Drag the slider on each photo to reveal the
            remarkable difference.
          </p>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ResultsGallery />
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 md:py-20 bg-gradient-navy text-white relative overflow-hidden">
        <div className="absolute -top-20 -right-20 size-96 rounded-full bg-cyan/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 size-96 rounded-full bg-primary/30 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold leading-tight">
            Ready for your own{" "}
            <span className="text-cyan">smile transformation?</span>
          </h2>
          <p className="mt-3 text-white/80 max-w-lg mx-auto text-sm sm:text-base">
            Book a consultation with Dr. Jigyasa Bhardwaj today. Your new smile
            is just one appointment away.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/appointment"
              className="inline-flex items-center gap-2 rounded-full bg-white text-navy px-8 py-4 font-semibold shadow-cta hover:scale-[1.03] transition-transform"
            >
              Book Appointment Now <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 backdrop-blur px-8 py-4 font-semibold hover:bg-white/20 transition-all"
            >
              Contact Clinic
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <MobileCta />
    </main>
  );
}
