import { useState, useEffect, useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { MobileCta } from "@/components/site/MobileCta";
import { Quiz } from "@/components/site/Quiz";
import { motion, AnimatePresence } from "framer-motion";
import { CLINIC } from "@/lib/clinic";
import { createAppointmentFn } from "@/lib/appointment";
import { toast } from "sonner";
import {
  CalendarDays, Clock, MapPin, CheckCircle, ChevronLeft, ChevronRight, PhoneCall, Sparkles, MessageCircle, AlertCircle
} from "lucide-react";

export const Route = createFileRoute("/appointment")({
  head: () => ({
    meta: [
      { title: "Book Dentist Appointment Online in Dehradun | Dental Plus Clinic" },
      { name: "description", content: `Book your dental slot with Dr. Jigyasa Bhardwaj. Painless root canal, dental implants, teeth whitening, veneers. Immediate confirmation via WhatsApp.` },
      { name: "keywords", content: "dentist appointment Dehradun, book teeth whitening Dehradun, root canal appointment Dehradun" },
      { property: "og:title", content: "Book Dentist Appointment Online in Dehradun | Dental Plus Clinic" },
      { property: "og:description", content: `Book your dental slot with Dr. Jigyasa Bhardwaj. Painless root canal, dental implants, teeth whitening, veneers. Immediate confirmation via WhatsApp.` },
      { property: "og:type", content: "website" },
    ],
  }),
  component: AppointmentPage,
});

const servicesList = [
  "Dental Checkup", "Teeth Whitening", "Root Canal", "Dental Implants",
  "Cosmetic Dentistry", "Veneers & Crowns", "Braces and Aligner", "Pediatric Dentistry", "Emergency Care", "Other",
];

// Custom styled Time Slots
const morningSlots = ["10:15 AM", "11:00 AM", "11:45 AM", "12:30 PM", "01:15 PM"];
const eveningSlots = ["05:15 PM", "06:00 PM", "06:45 PM", "07:30 PM"];

function AppointmentPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    service: servicesList[0],
    message: "",
  });

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);
  const [slotAlert, setSlotAlert] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formSectionRef = useRef<HTMLDivElement>(null);

  // Month navigation for our custom calendar
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Cross-route state synchronization from Services or Quiz
  useEffect(() => {
    const preselected = localStorage.getItem("preselectedService");
    if (preselected) {
      // Find matching item in list
      const matched = servicesList.find(s => s.toLowerCase().includes(preselected.toLowerCase()) || preselected.toLowerCase().includes(s.toLowerCase()));
      if (matched) {
        setForm(prev => ({ ...prev, service: matched }));
      } else {
        setForm(prev => ({ ...prev, service: preselected }));
      }
      localStorage.removeItem("preselectedService");
      
      // Smooth scroll to form
      setTimeout(() => {
        formSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    }
  }, []);

  const handleApplyQuizRecommendation = (serviceName: string) => {
    const matched = servicesList.find(s => s.toLowerCase().includes(serviceName.toLowerCase()) || serviceName.toLowerCase().includes(s.toLowerCase()));
    setForm(prev => ({ ...prev, service: matched || serviceName }));
    
    // Smooth scroll to form
    formSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) {
      setSlotAlert("Please select a convenient date for your appointment.");
      return;
    }
    if (!selectedSlot) {
      setSlotAlert("Please choose a preferred time slot.");
      return;
    }

    setSlotAlert("");
    setIsSubmitting(true);
    const formattedDate = selectedDate.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    try {
      const result = await createAppointmentFn({
        data: {
          name: form.name,
          phone: form.phone,
          service: form.service,
          date: formattedDate,
          slot: selectedSlot,
          message: form.message || "",
        },
      });

      if (result?.success) {
        toast.success("Appointment details prepared!", {
          description: "Opening WhatsApp to confirm your slot with our team...",
        });
      } else {
        toast.success("Booking details generated! Opening WhatsApp...");
      }

      const msg = `Hi Dental Plus Clinic, I'd like to book an appointment.%0A%0A*APPOINTMENT DETAILS*%0AName: ${form.name}%0APhone: ${form.phone}%0AService: ${form.service}%0APreferred Date: ${formattedDate}%0APreferred Slot: ${selectedSlot}%0ANote: ${form.message || "None"}`;
      
      window.open(`https://wa.me/${CLINIC.whatsapp}?text=${msg}`, "_blank");
      setSubmitted(true);
    } catch (error: any) {
      console.error("Booking submission failed:", error);
      toast.error("Unable to send request online. You can still message us directly on WhatsApp!", {
        description: "Direct WhatsApp support is active.",
      });
      setSlotAlert("Online booking assistant is currently busy. Please click below to send via WhatsApp directly!");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Custom calendar generation logic
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    // Pad initial empty cells for first day of week alignment
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let d = 1; d <= totalDays; d++) {
      days.push(new Date(year, month, d));
    }
    return days;
  };

  const daysGrid = getDaysInMonth(currentMonth);

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const isDateSelected = (d: Date) => {
    if (!selectedDate) return false;
    return d.getDate() === selectedDate.getDate() &&
           d.getMonth() === selectedDate.getMonth() &&
           d.getFullYear() === selectedDate.getFullYear();
  };

  const isDateInPast = (d: Date) => {
    const today = new Date();
    today.setHours(0,0,0,0);
    return d < today;
  };

  return (
    <main className="min-h-screen bg-background overflow-x-hidden pt-20">
      <Navbar />

      {/* Page Hero */}
      <section className="relative py-14 sm:py-16 bg-gradient-hero overflow-hidden">
        <div className="absolute -bottom-32 -left-20 size-[380px] rounded-full bg-cyan/20 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-4">
            Online Scheduling
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-navy leading-none">
            Schedule <span className="text-gradient">Your Visit</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
            Book slots instantly or take our 1-minute smart Smile Assessment to find the best procedure for you.
          </p>
        </div>
      </section>

      {/* Main Grid Content */}
      <section className="py-12 bg-gradient-soft">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-10">
          
          {/* Assessment Quiz (Left side, 5 columns) */}
          <div className="lg:col-span-5 space-y-6">
            <Quiz onApplyRecommendation={handleApplyQuizRecommendation} />

            {/* Quick benefits notice */}
            <div className="bg-white rounded-3xl p-6 border border-border/80 shadow-soft">
              <h3 className="font-display font-semibold text-navy text-base flex items-center gap-2 mb-3">
                <Sparkles className="size-4 text-primary" /> Booking Guarantees
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                <li className="flex gap-2 items-start">
                  <CheckCircle className="size-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span><strong>Zero consultation fee</strong> for online slot bookings.</span>
                </li>
                <li className="flex gap-2 items-start">
                  <CheckCircle className="size-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span>Confirmation within 15 minutes sent directly to your phone.</span>
                </li>
                <li className="flex gap-2 items-start">
                  <CheckCircle className="size-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span>Free re-scheduling and cancellation via WhatsApp click.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Form Scheduler Section (Right side, 7 columns) */}
          <div className="lg:col-span-7" ref={formSectionRef}>
            <div className="bg-card rounded-3xl p-6 sm:p-8 border border-border shadow-card text-navy">
              <h2 className="font-display font-bold text-navy text-2xl mb-1">Appointment Request</h2>
              <p className="text-sm text-muted-foreground mb-6">Select your concern, date, and convenient timing session below.</p>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-50 border border-emerald-100 rounded-2xl p-8 text-center text-emerald-800"
                >
                  <CheckCircle className="size-14 text-emerald-500 mx-auto mb-4" />
                  <h3 className="font-display font-semibold text-xl">Booking Sent!</h3>
                  <p className="text-sm mt-2 text-emerald-700/95 max-w-sm mx-auto leading-relaxed">
                    Your appointment request has been structured and forwarded to our WhatsApp portal. Dr. Jigyasa Bhardwaj's assistant will verify and confirm your slot instantly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setSelectedDate(null);
                      setSelectedSlot("");
                    }}
                    className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-xs font-semibold text-white shadow-soft"
                  >
                    Book Another Slot
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Basic Details */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-navy uppercase tracking-wider">Your Name *</label>
                      <input
                        required
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Your full name"
                        className="mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-navy uppercase tracking-wider">Phone Number *</label>
                      <input
                        required
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="Your contact number"
                        className="mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                  </div>

                  {/* Treatment Choice */}
                  <div>
                    <label className="text-xs font-bold text-navy uppercase tracking-wider">Treatment Required *</label>
                    <select
                      value={form.service}
                      onChange={(e) => setForm({ ...form, service: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    >
                      {servicesList.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  {/* CUSTOM CALENDAR PICKER */}
                  <div>
                    <label className="text-xs font-bold text-navy uppercase tracking-wider block mb-2">
                      Choose Appointment Date *
                    </label>
                    
                    <div className="border border-border rounded-2xl bg-white overflow-hidden p-4 shadow-soft">
                      {/* Calendar Navigation */}
                      <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
                        <span className="font-display font-semibold text-sm sm:text-base text-navy">
                          {currentMonth.toLocaleString("en-IN", { month: "long", year: "numeric" })}
                        </span>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={prevMonth}
                            className="size-8 rounded-lg hover:bg-secondary flex items-center justify-center transition border border-border"
                          >
                            <ChevronLeft className="size-4" />
                          </button>
                          <button
                            type="button"
                            onClick={nextMonth}
                            className="size-8 rounded-lg hover:bg-secondary flex items-center justify-center transition border border-border"
                          >
                            <ChevronRight className="size-4" />
                          </button>
                        </div>
                      </div>

                      {/* Weekday Names */}
                      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
                        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                          <div key={day} className={day === "Su" ? "text-rose-500" : ""}>{day}</div>
                        ))}
                      </div>

                      {/* Month Days Grid */}
                      <div className="grid grid-cols-7 gap-1">
                        {daysGrid.map((d, index) => {
                          if (!d) return <div key={`empty-${index}`} />;
                          
                          const isSunday = d.getDay() === 0;
                          const isPast = isDateInPast(d);
                          const isSelected = isDateSelected(d);
                          
                          let cellClass = "size-8 sm:size-9 rounded-lg text-xs font-semibold flex items-center justify-center transition-all ";
                          let isDisabled = false;

                          if (isSunday) {
                            cellClass += "text-rose-400 bg-rose-50/20 cursor-not-allowed ";
                            isDisabled = true;
                          } else if (isPast) {
                            cellClass += "text-muted-foreground/30 cursor-not-allowed ";
                            isDisabled = true;
                          } else if (isSelected) {
                            cellClass += "bg-primary text-white shadow-soft scale-105 ";
                          } else {
                            cellClass += "text-navy hover:bg-primary/10 hover:text-primary cursor-pointer ";
                          }

                          return (
                            <button
                              key={`day-${d.getDate()}-${d.getMonth()}`}
                              type="button"
                              disabled={isDisabled}
                              onClick={() => {
                                setSelectedDate(d);
                                setSlotAlert("");
                              }}
                              className={cellClass}
                            >
                              {d.getDate()}
                            </button>
                          );
                        })}
                      </div>
                      
                      {selectedDate && (
                        <div className="mt-3 text-xs text-primary font-semibold flex items-center gap-1.5">
                          <CheckCircle className="size-3.5 text-emerald-500" /> Selected Date:{" "}
                          <span className="text-navy">
                            {selectedDate.toLocaleDateString("en-IN", {
                              weekday: "short",
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* CUSTOM TIME SLOT SELECTOR CHIPS */}
                  <div>
                    <label className="text-xs font-bold text-navy uppercase tracking-wider block mb-2">
                      Choose Time Slot *
                    </label>

                    <div className="space-y-4">
                      {/* Morning slots */}
                      <div>
                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 flex items-center gap-1">
                          <Sparkles className="size-3 text-amber-500" /> Morning Sessions (10 AM - 2 PM)
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {morningSlots.map((slot) => (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => {
                                setSelectedSlot(slot);
                                setSlotAlert("");
                              }}
                              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
                                selectedSlot === slot
                                  ? "bg-primary text-white border-primary shadow-soft"
                                  : "bg-white text-navy border-border hover:border-primary/40 hover:bg-secondary/40"
                              }`}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Evening slots */}
                      <div>
                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 flex items-center gap-1">
                          <Clock className="size-3 text-primary" /> Evening Sessions (5 PM - 8 PM)
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {eveningSlots.map((slot) => (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => {
                                setSelectedSlot(slot);
                                setSlotAlert("");
                              }}
                              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
                                selectedSlot === slot
                                  ? "bg-primary text-white border-primary shadow-soft"
                                  : "bg-white text-navy border-border hover:border-primary/40 hover:bg-secondary/40"
                              }`}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Optional message */}
                  <div>
                    <label className="text-xs font-bold text-navy uppercase tracking-wider">Additional details / note (optional)</label>
                    <textarea
                      rows={3}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="e.g. Having severe back molar tooth pain or regular cleanup"
                      className="mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>

                  {/* Errors and Alert warnings */}
                  {slotAlert && (
                    <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs text-rose-600 flex items-center gap-2 font-medium">
                      <AlertCircle className="size-4 shrink-0 text-rose-500" />
                      <span>{slotAlert}</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-primary px-6 py-4 font-semibold text-primary-foreground shadow-cta hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                        Securing your preferred slot...
                      </>
                    ) : (
                      <>
                        <MessageCircle className="size-5 shrink-0" /> Request Slot & Confirm on WhatsApp
                      </>
                    )}
                  </button>

                  <p className="text-[10px] text-center text-muted-foreground mt-2 leading-relaxed">
                    * Slots are locked immediately. To reschedule or cancel, simply message us on WhatsApp.
                  </p>
                </form>
              )}

            </div>
          </div>

        </div>
      </section>

      <Footer />
      <MobileCta />
    </main>
  );
}
