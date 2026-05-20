import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Services } from "@/components/site/Services";
import { About } from "@/components/site/About";
import { WhyUs } from "@/components/site/WhyUs";
import { Testimonials } from "@/components/site/Testimonials";
import { Gallery } from "@/components/site/Gallery";
import { Appointment } from "@/components/site/Appointment";
import { Faq } from "@/components/site/Faq";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { MobileCta } from "@/components/site/MobileCta";

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

function Home() {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <Hero />
      <Services />
      <About />
      <WhyUs />
      <Testimonials />
      <Gallery />
      <Appointment />
      <Faq />
      <Contact />
      <Footer />
      <MobileCta />
    </main>
  );
}
