import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { CLINIC } from "@/lib/clinic";
import logoImg from "@/assets/optimized/DP_Logo.webp";

const links = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        open
          ? "bg-transparent"
          : scrolled
            ? "glass shadow-soft"
            : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <img src={logoImg} alt="Dental Plus Logo" className="h-10 w-auto object-contain shrink-0" />
          <div className="leading-tight">
            <div className="font-display font-semibold text-navy">Dental Plus Clinic</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Dehradun</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeProps={{ className: "text-primary font-semibold" }}
              inactiveProps={{ className: "text-foreground/80 hover:text-primary" }}
              className="text-sm font-medium transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-6">
          <a href={`tel:${CLINIC.phones[0]}`} className="inline-flex items-center gap-2 text-sm font-medium text-navy hover:text-primary transition-colors">
            <Phone className="size-4" /> {CLINIC.phonesDisplay[0]}
          </a>
          <Link
            to="/appointment"
            className="inline-flex items-center rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-cta hover:scale-[1.03] transition-transform"
          >
            Book Appointment
          </Link>
        </div>

        <button onClick={() => setOpen(true)} className="lg:hidden size-11 grid place-items-center rounded-xl glass" aria-label="Menu">
          <Menu className="size-5 text-navy" />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-navy/40 backdrop-blur-sm lg:hidden"
            onClick={() => setOpen(false)}
          >
            <motion.aside
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 24, stiffness: 220 }}
              className="absolute right-0 top-0 h-full w-[82%] max-w-sm bg-background p-6 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8">
                <span className="font-display text-xl font-semibold text-navy">Dental Plus</span>
                <button onClick={() => setOpen(false)} className="size-10 grid place-items-center rounded-xl bg-secondary">
                  <X className="size-5" />
                </button>
              </div>
              <nav className="flex flex-col gap-1">
                {links.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setOpen(false)}
                    activeProps={{ className: "bg-secondary text-primary font-semibold" }}
                    inactiveProps={{ className: "text-foreground hover:bg-secondary" }}
                    className="px-4 py-3 rounded-xl text-base font-medium transition"
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto space-y-3 pt-6">
                <a href={`tel:${CLINIC.phones[0]}`} className="flex items-center justify-center gap-2 rounded-xl border border-border py-3 font-medium text-navy">
                  <Phone className="size-4" /> Call Clinic
                </a>
                <Link
                  to="/appointment"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center rounded-xl bg-gradient-primary py-3 font-semibold text-primary-foreground shadow-cta text-center"
                >
                  Book Appointment
                </Link>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
