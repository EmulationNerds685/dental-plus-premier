import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { WhyUs } from "@/components/site/WhyUs";
import { Testimonials } from "@/components/site/Testimonials";
import { BeforeAfterSlider } from "@/components/site/BeforeAfterSlider";
import { Faq } from "@/components/site/Faq";
import { Footer } from "@/components/site/Footer";
import { MobileCta } from "@/components/site/MobileCta";
import { CLINIC } from "@/lib/clinic";
import { Sparkles, Wrench, Bone, Crown, ArrowRight, ShieldCheck, Star } from "lucide-react";
import doctorImg from "@/assets/optimized/doctor2.webp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dental Plus — Best Dental Clinic in Dehradun | Dr. Jigyasa Bhardwaj" },
      { name: "description", content: "Premium dental clinic in Dehradun offering painless root canal, dental implants, teeth whitening, cosmetic & pediatric dentistry by Dr. Jigyasa Bhardwaj. Book your appointment today." },
      { name: "keywords", content: "Best Dentist in Dehradun, Dental Clinic in Dehradun, Root Canal Treatment Dehradun, Teeth Whitening Dehradun, Dental Implants Dehradun, Cosmetic Dentistry Dehradun" },
      { property: "og:title", content: "Dental Plus — Premium Dental Care in Dehradun" },
      { property: "og:description", content: "Advanced, painless dental treatments by Dr. Jigyasa Bhardwaj. Modern equipment, sterilized clinic, affordable pricing." },
      { property: "og:type", content: "website" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Dentist",
          name: "Dental Plus",
          image: "/og.jpg",
          telephone: "+91-8755703677",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Swami Dayanand Saraswati Setu, Pragati Vihar, Ajabpur Kalan",
            addressLocality: "Dehradun",
            addressRegion: "Uttarakhand",
            postalCode: "248001",
            addressCountry: "IN",
          },
          openingHours: ["Mo-Sa 10:00-14:00", "Mo-Sa 17:00-20:00"],
          priceRange: "₹₹",
        }),
      },
    ],
  }),
  component: Home,
});

const featuredServices = [
  { icon: Wrench, title: "Root Canal Treatment", desc: "Painless rotary root canals completed in a single session." },
  { icon: Sparkles, title: "Teeth Whitening", desc: "Brighter, stain-free smiles in less than 45 minutes." },
  { icon: Bone, title: "Dental Implants", desc: "Permanent, bio-compatible titanium replacement for missing teeth." },
  { icon: Crown, title: "Veneers & Crowns", desc: "Hollywood-grade aesthetics utilizing premium E-Max porcelain." },
];

function Home() {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <Hero />

      {/* Smile Transformations (Before/After Slider) Section */}
      <section className="py-20 md:py-28 relative">
        <div className="absolute -top-24 -right-24 size-[380px] rounded-full bg-cyan/15 blur-3xl" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-4">
              Smile Transformations
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-navy">
              Real Results, <span className="text-gradient">Real Confidence</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              Experience the remarkable difference. Slide horizontally to see actual patient restorations performed at our clinic.
            </p>
          </div>
          <BeforeAfterSlider />
        </div>
      </section>

      {/* Services Teaser Section */}
      <section className="py-20 md:py-28 bg-gradient-soft border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-4">
              Core Expertise
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-navy">
              Premium Dental <span className="text-gradient">Specialties</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              Advanced, precision dental solutions designed for your absolute comfort and safety.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredServices.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.title}
                  className="bg-card rounded-3xl p-6 border border-border shadow-soft hover:shadow-card hover:-translate-y-1 transition-all flex flex-col"
                >
                  <div className="size-12 rounded-xl bg-gradient-to-br from-primary/10 to-cyan/20 grid place-items-center mb-4 text-primary">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="font-display font-bold text-navy text-lg">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">{s.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-8 py-4 font-semibold text-primary-foreground shadow-cta hover:scale-[1.03] transition-transform"
            >
              Explore All 19 Treatments <ArrowRight className="size-4.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* About Teaser Section */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-primary opacity-15 rounded-[2rem] blur-2xl" />
            <div className="relative rounded-[2rem] overflow-hidden shadow-glow ring-1 ring-white/60">
              <img src={doctorImg} alt={CLINIC.doctor.name} width={1024} height={1280} loading="lazy" className="w-full h-[400px] sm:h-[500px] object-cover" />
            </div>
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 glass rounded-2xl px-5 py-3 shadow-card text-center">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Chief Dentist</div>
              <div className="font-display font-semibold text-navy text-sm sm:text-base">{CLINIC.doctor.name}</div>
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-4">
              Meet Dr. Jigyasa Bhardwaj
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy leading-tight">
              A Decade of <span className="text-gradient">Clinical Excellence</span>
            </h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              Dr. Jigyasa Bhardwaj (BDS, MAOI) combines extensive experience with warm, empathetic patient communication. Under her leadership, Dental Plus delivers painless, top-tier treatments, ensuring you feel comfortable and completely safe.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 text-xs sm:text-sm font-semibold text-navy">
              <div className="flex items-center gap-2 bg-secondary px-4 py-2 rounded-full">
                <ShieldCheck className="size-4 text-primary" /> Sterilized Clinic
              </div>
              <div className="flex items-center gap-2 bg-secondary px-4 py-2 rounded-full">
                <Star className="size-4 fill-amber-400 text-amber-400" /> 4.9 Rated (Google Reviews)
              </div>
            </div>
            <div className="mt-8">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 rounded-full bg-secondary hover:bg-muted border border-border px-7 py-3.5 font-semibold text-navy transition-all"
              >
                Read Professional Bio & Credentials <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <WhyUs />
      <Testimonials />

      {/* Quick Booking CTA banner */}
      <section className="py-16 bg-gradient-navy text-white relative overflow-hidden">
        <div className="absolute -top-20 -right-20 size-96 rounded-full bg-cyan/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 size-96 rounded-full bg-primary/30 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold leading-tight">
            Ready to experience <span className="text-cyan">painless dental care?</span>
          </h2>
          <p className="mt-3 text-white/80 max-w-lg mx-auto text-sm sm:text-base">
            Select a preferred slot or consult Dr. Jigyasa Bhardwaj directly. Click below to book your appointment online in 1 minute.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/appointment"
              className="inline-flex items-center gap-2 rounded-full bg-white text-navy px-8 py-4 font-semibold shadow-cta hover:scale-[1.03] transition-transform"
            >
              Book Appointment Now
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

      <Faq />
      <Footer />
      <MobileCta />
    </main>
  );
}
