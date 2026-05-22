import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { About as AboutComponent } from "@/components/site/About";
import { WhyUs } from "@/components/site/WhyUs";
import { BeforeAfterSlider } from "@/components/site/BeforeAfterSlider";
import { Footer } from "@/components/site/Footer";
import { MobileCta } from "@/components/site/MobileCta";
import { CLINIC } from "@/lib/clinic";
import { ShieldCheck, Award, Heart, CheckCircle2 } from "lucide-react";
import doctorImg from "@/assets/doctor.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: `About ${CLINIC.doctor.name} | Best Dentist in Dehradun` },
      { name: "description", content: `Meet Dr. Jigyasa Bhardwaj (BDS, MAOI), lead surgeon at Dental Plus Dehradun. Empathetic dental care, 10+ years clinical excellence, specialized in painless endodontics & cosmetics.` },
      { name: "keywords", content: "Dr Jigyasa Bhardwaj, Best Dentist Dehradun, Dental Clinic Dehradun, BDS Dentist Dehradun, Dental Surgeon Dehradun" },
      { property: "og:title", content: `Dr. Jigyasa Bhardwaj | Chief Dentist at Dental Plus Dehradun` },
      { property: "og:description", content: "Qualified Dental Surgeon with BDS, MAOI and a passion for modern, painless cosmetic and restorative dentistry in Dehradun." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden pt-20">
      <Navbar />
      
      {/* Page Hero */}
      <section className="relative py-16 sm:py-20 bg-gradient-hero overflow-hidden">
        <div className="absolute -top-24 -right-24 size-[380px] rounded-full bg-cyan/20 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-4">
            Meet the Surgeon
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-navy">
            Pioneering <span className="text-gradient">Gentle Dentistry</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
            Combining advanced medical technology with human empathy to deliver an exceptional dental experience in Dehradun.
          </p>
        </div>
      </section>

      {/* Main Doctor Bio */}
      <AboutComponent />

      {/* Philosophy & Core Values */}
      <section className="py-16 bg-white border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display text-3xl font-bold text-navy">Our Practice Philosophy</h2>
            <p className="mt-3 text-muted-foreground">Every smile we treat is built on four core pillars of clinical standards.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: ShieldCheck,
                title: "Sterilization First",
                desc: "We practice class-B autoclave sterilization, ensuring 100% sterile instruments and fully disposable patient safety kits.",
              },
              {
                icon: Heart,
                title: "Empathetic Patient Care",
                desc: "We listen to your dental anxieties. Treatments are fully paced and explained, removing fear from the dentist chair.",
              },
              {
                icon: Award,
                title: "Global Standards",
                desc: "We employ modern rotary endodontics, 3D intraoral digital imaging, and premium materials sourced globally.",
              },
              {
                icon: CheckCircle2,
                title: "Transparent & Fair",
                desc: "No hidden costs. Every diagnosis is captured on digital screens and walked through before treatment begins.",
              },
            ].map((p, i) => (
              <div key={i} className="p-6 rounded-2xl border border-border bg-card shadow-soft hover:shadow-card transition-shadow">
                <p.icon className="size-8 text-primary mb-4" />
                <h3 className="font-display font-semibold text-navy text-lg">{p.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before/After Transformation Showcase */}
      <section className="py-16 sm:py-20 bg-gradient-soft">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-3">
              Treatment Results
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy">See the Difference</h2>
            <p className="mt-3 text-muted-foreground">Slide to witness the remarkable smile restorations performed by Dr. Jigyasa Bhardwaj.</p>
          </div>
          <BeforeAfterSlider />
        </div>
      </section>

      <WhyUs />
      
      <Footer />
      <MobileCta />
    </main>
  );
}
