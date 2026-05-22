import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, ArrowLeft, RefreshCw, Calendar } from "lucide-react";

interface QuizProps {
  onApplyRecommendation: (serviceName: string) => void;
}

export function Quiz({ onApplyRecommendation }: QuizProps) {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    concern: "",
    preference: "",
    age: "",
    lastVisit: "",
  });

  const concerns = [
    { id: "teeth-whitening", label: "Stained or Yellowed Teeth", desc: "Want a bright, radiant smile in 1 hour." },
    { id: "implants", label: "Missing or Broken Teeth", desc: "Looking for a permanent, natural replacement." },
    { id: "veneers", label: "Gaps, Chips or Crooked Teeth", desc: "Interested in gorgeous Hollywood-style veneers." },
    { id: "root-canal", label: "Sharp Toothache or Sensitivity", desc: "Need pain relief or root canal treatments." },
    { id: "cleaning", label: "General Checkup & Scaling", desc: "Routine health assessment & tartar removal." },
  ];

  const preferences = [
    { id: "speed", label: "Painless & Same-Day", desc: "Complete my treatment in a single visit if possible." },
    { id: "premium", label: "Highly Durable & Aesthetic", desc: "Focus on top-tier premium cosmetics and durability." },
    { id: "affordable", label: "Standard & Budget-Friendly", desc: "Focus on affordable, transparent pricing with EMIs." },
  ];

  const ageGroups = ["Child / Under 12", "Teenager (13-19)", "Adult (20-55)", "Senior (55+)"];
  
  const lastVisits = [
    "Within the last 6 months",
    "6 months to 1 year ago",
    "More than 1 year ago",
    "I haven't visited a dentist in years / Never",
  ];

  const resetQuiz = () => {
    setAnswers({ concern: "", preference: "", age: "", lastVisit: "" });
    setStep(1);
  };

  const getRecommendation = () => {
    switch (answers.concern) {
      case "Stained or Yellowed Teeth":
        return {
          title: "Teeth Whitening or Veneers",
          desc: "To achieve a brilliant white smile, we recommend our professional 1-hour in-clinic Teeth Whitening. If you also have minor chips or gaps, customized porcelain Veneers would be the ultimate, permanent aesthetic choice.",
          service: "Teeth Whitening",
        };
      case "Missing or Broken Teeth":
        return {
          title: "Dental Implants or Crown & Bridge",
          desc: "For a highly durable, permanent solution that feels exactly like a natural tooth, we recommend modern Titanium Dental Implants. If you prefer a non-surgical alternative, custom Bridges are a fantastic choice.",
          service: "Dental Implants",
        };
      case "Gaps, Chips or Crooked Teeth":
        return {
          title: "Cosmetic Dentistry & Veneers",
          desc: "Custom dental bonding or ultra-thin dental Veneers can reshape your smile, closing gaps and hiding chips in just 1-2 painless sessions.",
          service: "Cosmetic Dentistry",
        };
      case "Sharp Toothache or Sensitivity":
        return {
          title: "Painless Root Canal Treatment",
          desc: "Dr. Jigyasa specializes in modern rotary root canal therapy, which relieves acute toothache in a single sitting without any pain.",
          service: "Root Canal",
        };
      default:
        return {
          title: "Comprehensive Dental Checkup & Scaling",
          desc: "We recommend a professional ultrasonic Scaling and teeth cleaning to eliminate plaque/tartar buildup, followed by a personalized oral diagnostic consultation.",
          service: "Dental Checkup",
        };
    }
  };

  const recommendation = getRecommendation();

  return (
    <div className="bg-card rounded-3xl p-6 sm:p-8 border border-border shadow-card relative overflow-hidden">
      <div className="absolute top-0 right-0 size-28 bg-primary/5 rounded-full blur-xl" />
      
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
        <div>
          <h3 className="font-display font-semibold text-navy text-lg flex items-center gap-2">
            <Sparkles className="size-4 text-primary" /> Smile Assessment
          </h3>
          <p className="text-xs text-muted-foreground">Find your customized treatment plan in 1 minute</p>
        </div>
        {step < 5 && (
          <div className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
            Step {step} of 4
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <h4 className="font-semibold text-navy">What is your primary smile concern?</h4>
            <div className="grid gap-2">
              {concerns.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setAnswers({ ...answers, concern: c.label });
                    setStep(2);
                  }}
                  className={`w-full text-left p-4 rounded-2xl border transition-all text-sm group ${
                    answers.concern === c.label
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border hover:border-primary/40 hover:bg-secondary/40"
                  }`}
                >
                  <div className="font-semibold text-navy group-hover:text-primary transition-colors">{c.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{c.desc}</div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <h4 className="font-semibold text-navy">What are you looking for in a treatment?</h4>
            <div className="grid gap-2">
              {preferences.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setAnswers({ ...answers, preference: p.label });
                    setStep(3);
                  }}
                  className={`w-full text-left p-4 rounded-2xl border transition-all text-sm group ${
                    answers.preference === p.label
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border hover:border-primary/40 hover:bg-secondary/40"
                  }`}
                >
                  <div className="font-semibold text-navy group-hover:text-primary transition-colors">{p.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{p.desc}</div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-navy transition-colors font-medium mt-2"
            >
              <ArrowLeft className="size-3.5" /> Back
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <h4 className="font-semibold text-navy">Select your age group:</h4>
            <div className="grid sm:grid-cols-2 gap-2">
              {ageGroups.map((a) => (
                <button
                  key={a}
                  onClick={() => {
                    setAnswers({ ...answers, age: a });
                    setStep(4);
                  }}
                  className={`text-center p-4 rounded-2xl border transition-all text-sm font-semibold ${
                    answers.age === a
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border text-navy hover:border-primary/40 hover:bg-secondary/40"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-navy transition-colors font-medium mt-2"
            >
              <ArrowLeft className="size-3.5" /> Back
            </button>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <h4 className="font-semibold text-navy">When did you last visit a dentist?</h4>
            <div className="grid gap-2">
              {lastVisits.map((lv) => (
                <button
                  key={lv}
                  onClick={() => {
                    setAnswers({ ...answers, lastVisit: lv });
                    setStep(5);
                  }}
                  className={`w-full text-left p-4 rounded-2xl border transition-all text-sm font-medium ${
                    answers.lastVisit === lv
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border text-navy hover:border-primary/40 hover:bg-secondary/40"
                  }`}
                >
                  {lv}
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-navy transition-colors font-medium mt-2"
            >
              <ArrowLeft className="size-3.5" /> Back
            </button>
          </motion.div>
        )}

        {step === 5 && (
          <motion.div
            key="recommendation"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
            className="space-y-5"
          >
            <div className="bg-secondary/60 rounded-2xl p-5 border border-border">
              <div className="inline-block text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2.5 py-1 rounded-md mb-2">
                YOUR SUGGESTED TREATMENT
              </div>
              <h4 className="font-display font-bold text-navy text-xl">{recommendation.title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                {recommendation.desc}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                onClick={() => onApplyRecommendation(recommendation.service)}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-cta hover:scale-[1.02] transition-transform"
              >
                <Calendar className="size-4" /> Apply to Booking Form
              </button>
              <button
                onClick={resetQuiz}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-secondary border border-border px-5 py-3.5 text-sm font-semibold text-navy hover:bg-muted transition"
              >
                <RefreshCw className="size-4" /> Start Over
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
