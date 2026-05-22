import { useState, useMemo } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { MobileCta } from "@/components/site/MobileCta";
import { motion, AnimatePresence } from "framer-motion";
import { serviceDetails } from "@/lib/servicesData";
import { CLINIC } from "@/lib/clinic";
import { 
  Clock, Award, ShieldCheck, CheckCircle, ArrowLeft, ChevronDown, 
  Sparkles, Calendar, CalendarCheck, ShieldAlert, Check
} from "lucide-react";

export const Route = createFileRoute("/services_/$slug")({
  head: ({ params }) => {
    const service = serviceDetails.find((s) => s.slug === params.slug);
    const title = service 
      ? `${service.title} in Dehradun | Painless Dental Care | Dental Plus`
      : "Premium Dental Treatment | Dental Plus Dehradun";
    const description = service
      ? `${service.desc} Get advanced ${service.title.toLowerCase()} in Dehradun under chief dentist Dr. Jigyasa Bhardwaj. Painless techniques, modern tech, 100% sterilized.`
      : "Advanced clinical dental treatments in Dehradun under Dr. Jigyasa Bhardwaj BDS MAOI. Book online.";
    
    // Structured JSON-LD Medical Schema for SEO rich results
    const schema = service ? {
      "@context": "https://schema.org",
      "@type": "MedicalProcedure",
      "name": service.title,
      "description": service.desc,
      "category": service.category,
      "procedureSteps": service.steps.map(s => `${s.title}: ${s.desc}`).join(". "),
      "provider": {
        "@type": "Dentist",
        "name": "Dental Plus",
        "telephone": "+91-8755703677",
        "priceRange": "₹₹",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Swami Dayanand Saraswati Setu, Pragati Vihar, Ajabpur Kalan",
          "addressLocality": "Dehradun",
          "addressRegion": "Uttarakhand",
          "postalCode": "248001",
          "addressCountry": "IN"
        }
      }
    } : null;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "keywords", content: `${service?.title || "Dental"} Dehradun, dentist Dehradun, best clinic Pragati Vihar, Dr Jigyasa Bhardwaj` },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
      ],
      scripts: schema ? [
        {
          type: "application/ld+json",
          children: JSON.stringify(schema)
        }
      ] : []
    };
  },
  component: ServiceDetailPage,
});

function ServiceDetailPage() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();

  const service = useMemo(() => {
    return serviceDetails.find((s) => s.slug === slug);
  }, [slug]);

  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  if (!service) {
    return (
      <main className="min-h-screen bg-background overflow-x-hidden pt-20 flex flex-col justify-between">
        <Navbar />
        <div className="mx-auto max-w-md text-center py-32 px-4">
          <ShieldAlert className="size-16 text-primary mx-auto mb-4" />
          <h2 className="font-display text-3xl font-bold text-navy">Service Not Found</h2>
          <p className="mt-4 text-muted-foreground">The dental treatment you are looking for does not exist or has been relocated.</p>
          <Link to="/services" className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-primary px-8 py-3 font-semibold text-white shadow-soft">
            <ArrowLeft className="size-4" /> Back to All Services
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const Icon = service.icon;

  // Resolve related treatments from the same category to increase engagement (dwell time)
  const relatedServices = useMemo(() => {
    return serviceDetails
      .filter((s) => s.category === service.category && s.slug !== service.slug)
      .slice(0, 3);
  }, [service]);

  const handleBookService = () => {
    localStorage.setItem("preselectedService", service.title);
    navigate({ to: "/appointment" });
  };

  return (
    <main className="min-h-screen bg-background overflow-x-hidden pt-20">
      <Navbar />

      {/* Breadcrumbs */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
        <Link to="/services" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-navy transition-colors">
          <ArrowLeft className="size-4" /> Back to All Treatments
        </Link>
      </div>

      {/* Treatment Hero Presentation */}
      <section className="py-10 md:py-16 relative">
        <div className="absolute top-0 right-0 size-96 rounded-full bg-cyan/10 blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 size-96 rounded-full bg-primary/10 blur-3xl -z-10" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-10 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-5">
              <Sparkles className="size-3 text-primary animate-pulse" />
              {service.category} Dental Care
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-navy leading-tight">
              {service.title} <span className="text-gradient">in Dehradun</span>
            </h1>
            <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed">
              {service.desc} Under the expert care of <span className="font-semibold text-navy">{CLINIC.doctor.name}</span>, we provide specialized treatments equipped with highly sterile protocols, advanced painless methods, and clinical precision.
            </p>
            
            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={handleBookService}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-8 py-4 font-semibold text-white shadow-cta hover:scale-[1.03] transition-transform"
              >
                <CalendarCheck className="size-5" /> Book Treatment Slot
              </button>
              <a
                href={`tel:${CLINIC.phones[0]}`}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-8 py-4 font-semibold text-navy hover:bg-muted transition-colors shadow-soft"
              >
                <Clock className="size-5" /> Consult Dentist
              </a>
            </div>
          </div>

          {/* Hero Right Visual Emblem */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="absolute -inset-4 bg-gradient-primary opacity-10 rounded-[2.5rem] blur-2xl -z-10" />
            <div className="w-full max-w-sm aspect-square bg-card rounded-[2.5rem] p-8 border border-border shadow-glow flex flex-col justify-between items-center text-center">
              <div className="size-24 rounded-3xl bg-gradient-to-br from-primary/10 to-cyan/20 grid place-items-center text-primary shadow-inner">
                <Icon className="size-12" />
              </div>
              <div>
                <div className="font-display font-semibold text-navy text-lg">Dental Plus Premier</div>
                <div className="text-xs text-muted-foreground mt-1">A decade of trust and patient safety</div>
              </div>
              <div className="flex gap-4 text-xs font-semibold text-navy bg-secondary/60 rounded-full px-5 py-2">
                <span className="flex items-center gap-1.5"><ShieldCheck className="size-4 text-primary" /> Sterilized</span>
                <span className="text-border">|</span>
                <span className="flex items-center gap-1.5"><Check className="size-4 text-primary" /> Painless Tech</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Quick Facts Card Grid */}
      <section className="py-8 border-y border-border bg-gradient-soft">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid sm:grid-cols-3 gap-6">
          <div className="bg-card rounded-2xl p-5 border border-border shadow-soft flex gap-4 items-start">
            <div className="size-11 rounded-xl bg-primary/10 grid place-items-center text-primary shrink-0">
              <Clock className="size-5.5" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Session Duration</div>
              <div className="font-semibold text-navy mt-1 text-sm sm:text-base">{service.duration}</div>
            </div>
          </div>

          <div className="bg-card rounded-2xl p-5 border border-border shadow-soft flex gap-4 items-start">
            <div className="size-11 rounded-xl bg-primary/10 grid place-items-center text-primary shrink-0">
              <Award className="size-5.5" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Clinical Technology</div>
              <div className="font-semibold text-navy mt-1 text-sm sm:text-base">{service.tech}</div>
            </div>
          </div>

          <div className="bg-card rounded-2xl p-5 border border-border shadow-soft flex gap-4 items-start">
            <div className="size-11 rounded-xl bg-primary/10 grid place-items-center text-primary shrink-0">
              <ShieldCheck className="size-5.5" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Sterilization Standard</div>
              <div className="font-semibold text-navy mt-1 text-sm sm:text-base">ISO Class 7 Autoclave</div>
            </div>
          </div>
        </div>
      </section>

      {/* Procedure Walkthrough (Timeline) */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-4">
              What to Expect
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy">
              Your Treatment <span className="text-gradient">Walkthrough</span>
            </h2>
            <p className="mt-4 text-muted-foreground text-sm sm:text-base">
              We guide you transparently through every stage of your dental procedure to ensure complete comfort and peace of mind.
            </p>
          </div>

          {/* Timeline Track */}
          <div className="relative border-l border-primary/20 ml-4 sm:ml-6 space-y-12">
            {service.steps.map((step, idx) => (
              <div key={idx} className="relative pl-8 sm:pl-10">
                {/* Timeline Pin */}
                <div className="absolute -left-3 top-0.5 size-6 rounded-full bg-white border-2 border-primary flex items-center justify-center font-display text-[10px] font-bold text-primary shadow-soft">
                  {idx + 1}
                </div>
                <h3 className="font-display font-bold text-navy text-lg sm:text-xl">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-2xl">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Checklist & FAQ Accordion */}
      <section className="py-16 md:py-24 bg-gradient-soft border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Benefits Checkbox list (Left) */}
          <div className="lg:col-span-5 bg-card rounded-3xl p-6 sm:p-8 border border-border shadow-card">
            <h3 className="font-display font-bold text-navy text-xl sm:text-2xl mb-6">
              Why Choose Dental Plus for {service.title}?
            </h3>
            <ul className="space-y-4">
              {service.benefits.map((benefit, i) => (
                <li key={i} className="flex gap-3 items-start text-sm sm:text-base text-muted-foreground">
                  <div className="size-6 rounded-full bg-emerald-100 grid place-items-center text-emerald-600 shrink-0 mt-0.5">
                    <Check className="size-3.5 stroke-[3]" />
                  </div>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* FAQ Accordion (Right) */}
          <div className="lg:col-span-7">
            <h3 className="font-display font-bold text-navy text-xl sm:text-2xl mb-6">
              Treatment <span className="text-gradient">Frequently Asked Questions</span>
            </h3>
            
            <div className="space-y-3">
              {service.faqs.map((faq, idx) => (
                <div 
                  key={idx} 
                  className="bg-card rounded-2xl border border-border overflow-hidden transition-all duration-300 shadow-soft"
                >
                  <button
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    className="w-full px-5 py-4 text-left flex justify-between items-center text-navy font-semibold hover:text-primary transition-colors gap-4"
                  >
                    <span className="text-sm sm:text-base">{faq.q}</span>
                    <ChevronDown className={`size-4.5 text-primary shrink-0 transition-transform duration-300 ${activeFaq === idx ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence initial={false}>
                    {activeFaq === idx && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <div className="px-5 pb-5 pt-1 border-t border-border/40 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Related Services Teasers */}
      {relatedServices.length > 0 && (
        <section className="py-16 md:py-24 border-t border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h3 className="font-display font-bold text-navy text-2xl sm:text-3xl">
                Other Related <span className="text-gradient">Treatments</span>
              </h3>
              <p className="mt-2 text-muted-foreground text-sm">
                Explore further premium procedures in our {service.category} catalog.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              {relatedServices.map((rel) => {
                const RelIcon = rel.icon;
                return (
                  <Link
                    key={rel.slug}
                    to="/services/$slug"
                    params={{ slug: rel.slug }}
                    className="group bg-card rounded-2xl p-6 border border-border shadow-soft hover:shadow-card hover:-translate-y-1 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="size-11 rounded-xl bg-primary/10 grid place-items-center text-primary group-hover:bg-gradient-primary group-hover:text-white transition-all mb-4">
                        <RelIcon className="size-5.5" />
                      </div>
                      <h4 className="font-display font-bold text-navy text-lg group-hover:text-primary transition-colors">
                        {rel.title}
                      </h4>
                      <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                        {rel.desc}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs text-primary font-semibold group-hover:translate-x-1 transition-transform">
                      <span>View Procedure</span>
                      <span>→</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Glowing Booking CTA Banner */}
      <section className="py-16 bg-gradient-navy text-white relative overflow-hidden">
        <div className="absolute -top-20 -right-20 size-96 rounded-full bg-cyan/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 size-96 rounded-full bg-primary/30 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold leading-tight">
            Ready to schedule your <span className="text-cyan">{service.title}?</span>
          </h2>
          <p className="mt-3 text-white/80 max-w-lg mx-auto text-sm sm:text-base">
            Select your slot online in under 1 minute or chat directly with our care coordinator on WhatsApp.
          </p>
          
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button
              onClick={handleBookService}
              className="inline-flex items-center gap-2 rounded-full bg-white text-navy px-8 py-4 font-semibold shadow-cta hover:scale-[1.03] transition-transform"
            >
              Book Slot for {service.title}
            </button>
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
