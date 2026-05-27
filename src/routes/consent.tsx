import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { MobileCta } from "@/components/site/MobileCta";
import { motion } from "framer-motion";
import { CLINIC } from "@/lib/clinic";
import { toast } from "sonner";
import { z } from "zod";
import { CONSENT_TEXT, PROCEDURES_DATA } from "@/lib/consentData";
import { createConsentFn } from "@/lib/consent";
import logoImg from "@/assets/optimized/DP_Logo.webp";
import {
  ShieldCheck, FileText, CheckCircle2, AlertCircle,
  ArrowLeft, Edit3, Trash2, Languages, Download, Check,
} from "lucide-react";

// ─── URL search param schema ────────────────────────────────────────────────
const consentSearchSchema = z.object({
  name: z.string().catch(""),
  phone: z.string().catch(""),
  service: z.string().catch(""),
});

export const Route = createFileRoute("/consent")({
  validateSearch: (search) => consentSearchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Patient Clinical Consent Form | Dental Plus Clinic Dehradun" },
      { name: "description", content: "Complete and digitally sign your dental treatment consent form online." },
    ],
  }),
  component: ConsentPage,
});

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Map a URL service slug to a procedure id */
function serviceToId(slug: string): string {
  const map: [RegExp, string][] = [
    [/whitening|checkup/, "scaling"],
    [/bonding/, "filling"],
    [/canal|rct/, "rct"],
    [/implant/, "implant"],
    [/extraction/, "extractions"],
    [/braces|aligner/, "braces"],
    [/crown|veneer/, "crown"],
  ];
  return map.find(([rx]) => rx.test(slug))?.[1] ?? "";
}

// ─── Custom hook: Signature Pad ──────────────────────────────────────────────
function useSignaturePad() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasSigned, setHasSigned] = useState(false);
  const [signatureImage, setSignatureImage] = useState("");
  const isDrawingRef = useRef(false);

  /** Common draw-line helper */
  const drawLine = useCallback(
    (ctx: CanvasRenderingContext2D, x: number, y: number, begin: boolean) => {
      if (begin) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineWidth = 2.5;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = "#0b1b3d";
      } else {
        ctx.lineTo(x, y);
        ctx.stroke();
        setHasSigned(true);
      }
    },
    [],
  );

  /** Scale raw client coords to canvas logical pixels */
  const scale = useCallback((canvas: HTMLCanvasElement, cx: number, cy: number) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (cx - rect.left) * (canvas.width / rect.width),
      y: (cy - rect.top) * (canvas.height / rect.height),
    };
  }, []);

  // Touch events – must be passive:false to prevent page scroll
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const ctx = canvas.getContext("2d")!;
      const { x, y } = scale(canvas, e.touches[0].clientX, e.touches[0].clientY);
      drawLine(ctx, x, y, true);
      isDrawingRef.current = true;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDrawingRef.current) return;
      e.preventDefault();
      const ctx = canvas.getContext("2d")!;
      const { x, y } = scale(canvas, e.touches[0].clientX, e.touches[0].clientY);
      drawLine(ctx, x, y, false);
    };

    const onTouchEnd = () => {
      if (!isDrawingRef.current) return;
      isDrawingRef.current = false;
      setSignatureImage(canvas.toDataURL());
    };

    const opts: AddEventListenerOptions = { passive: false };
    canvas.addEventListener("touchstart", onTouchStart, opts);
    canvas.addEventListener("touchmove", onTouchMove, opts);
    canvas.addEventListener("touchend", onTouchEnd, opts);
    return () => {
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
    };
  }, [drawLine, scale]);

  // Mouse handlers (returned so JSX can attach them directly)
  const onMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      e.preventDefault();
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d")!;
      const { x, y } = scale(canvas, e.clientX, e.clientY);
      drawLine(ctx, x, y, true);
      isDrawingRef.current = true;
    },
    [drawLine, scale],
  );

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDrawingRef.current) return;
      e.preventDefault();
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d")!;
      const { x, y } = scale(canvas, e.clientX, e.clientY);
      drawLine(ctx, x, y, false);
    },
    [drawLine, scale],
  );

  const onMouseUp = useCallback(() => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    const canvas = canvasRef.current;
    if (canvas) setSignatureImage(canvas.toDataURL());
  }, []);

  const clear = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSigned(false);
    setSignatureImage("");
  }, []);

  return {
    canvasRef,
    hasSigned,
    signatureImage,
    mouseHandlers: { onMouseDown, onMouseMove, onMouseUp, onMouseLeave: onMouseUp },
    clear,
  };
}

// ─── PDF generator ──────────────────────────────────────────────────────────
async function generatePDF(
  elementId: string,
  filename: string,
  onStart: () => void,
  onDone: () => void,
): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element || typeof window === "undefined") return false;

  onStart();

  // Detach stylesheets so html2canvas isn't confused by oklch vars
  const styles = Array.from(document.querySelectorAll<HTMLElement>("style, link[rel='stylesheet']"));
  styles.forEach((el) => el.parentNode?.removeChild(el));

  let iframe: HTMLIFrameElement | null = null;

  try {
    const html2pdfModule = await import(/* @vite-ignore */ "html2pdf.js");
    const html2pdf = html2pdfModule.default ?? html2pdfModule;

    iframe = document.createElement("iframe");
    Object.assign(iframe.style, {
      position: "fixed", top: "0", left: "0",
      width: "210mm", height: "297mm",
      zIndex: "-9999", opacity: "0", pointerEvents: "none",
    });
    document.body.appendChild(iframe);

    const doc = iframe.contentDocument ?? iframe.contentWindow?.document;
    if (!doc) throw new Error("iframe document inaccessible");

    doc.open();
    doc.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><style>
      body{margin:0;padding:0;background:#fff;-webkit-print-color-adjust:exact}
    </style></head><body>${element.outerHTML}</body></html>`);
    doc.close();

    await new Promise((r) => setTimeout(r, 350));

    const target = doc.getElementById(elementId);
    if (!target) throw new Error("Target not found inside iframe");

    await html2pdf()
      .from(target)
      .set({
        margin: [8, 8, 8, 8] as [number, number, number, number],
        filename,
        image: { type: "jpeg" as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" as const },
      })
      .save();

    return true;
  } catch (err) {
    console.error("PDF generation error:", err);
    return false;
  } finally {
    styles.forEach((el) => document.head.appendChild(el));
    iframe?.remove();
    onDone();
  }
}

// ─── Component ──────────────────────────────────────────────────────────────
function ConsentPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();

  const [lang, setLang] = useState<"en" | "hi">("en");
  const [form, setForm] = useState({ name: "", phone: "", history: "" });
  const [selectedProcedures, setSelectedProcedures] = useState<string[]>([]);
  const [certified, setCertified] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isPdfBusy, setIsPdfBusy] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

  const { canvasRef, hasSigned, signatureImage, mouseHandlers, clear } = useSignaturePad();

  // Seed from URL params
  useEffect(() => {
    setForm((prev) => ({ ...prev, name: search.name, phone: search.phone }));
    if (search.service) {
      const id = serviceToId(search.service.toLowerCase());
      if (id) setSelectedProcedures([id]);
    }
  }, [search]);

  const toggleProcedure = useCallback((id: string) => {
    setSelectedProcedures((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  }, []);

  const pdfFilename = useMemo(
    () => `Dental_Plus_Consent_${form.name.replace(/\s+/g, "_") || "Patient"}.pdf`,
    [form.name],
  );

  const handleDownloadPDF = useCallback(
    async (showToast = true) => {
      if (showToast) toast.info(lang === "en" ? "Compiling Consent PDF…" : "पीडीएफ तैयार हो रही है…");
      const ok = await generatePDF(
        "consent-form-printable",
        pdfFilename,
        () => setIsPdfBusy(true),
        () => setIsPdfBusy(false),
      );
      if (showToast) {
        ok
          ? toast.success(lang === "en" ? "PDF Downloaded!" : "पीडीएफ डाउनलोड हो गई!")
          : toast.error(lang === "en" ? "PDF generation failed." : "पीडीएफ निर्माण विफल।");
      }
      return ok;
    },
    [lang, pdfFilename],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProcedures.length) {
      setAlertMsg(lang === "en" ? "Please select at least one treatment procedure." : "कृपया कम से कम एक प्रक्रिया चुनें।");
      return;
    }
    if (!hasSigned || !signatureImage) {
      setAlertMsg(lang === "en" ? "Please draw your signature on the pad." : "कृपया हस्ताक्षर पैड पर हस्ताक्षर करें।");
      return;
    }
    if (!certified) {
      setAlertMsg(lang === "en" ? "Please check the certification box to authorise." : "कृपया प्रमाणीकरण बॉक्स चेक करें।");
      return;
    }

    setAlertMsg("");
    setIsSaving(true);

    try {
      const result = await createConsentFn({
        data: { name: form.name, phone: form.phone, history: form.history, selectedProcedures, signatureImage, certified, lang },
      });
      if (!result?.success) throw new Error("Invalid server response");
      await handleDownloadPDF(false);
      setSubmitted(true);
      toast.success(lang === "en" ? "Consent saved & downloaded!" : "सहमति पत्र सहेजा व डाउनलोड हो गया!");
    } catch (err: any) {
      console.error(err);
      toast.error(lang === "en" ? "Failed to save consent form." : "सहमति पत्र सहेजना विफल।");
      setAlertMsg(lang === "en" ? "Unable to connect to clinic database. Check your internet and try again." : "डेटाबेस से कनेक्ट नहीं हो पाया। इंटरनेट जांचें और पुनः प्रयास करें।");
    } finally {
      setIsSaving(false);
    }
  };

  const t = CONSENT_TEXT[lang];
  const procedures = PROCEDURES_DATA[lang];

  // Consent ID for the PDF (session-stable)
  const consentId = useMemo(() => `DPCD-${Date.now().toString(36).toUpperCase()}`, []);
  const todayStr = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <main className="min-h-screen bg-background overflow-x-hidden pt-20">
      <Navbar />

      {/* Hero */}
      <section className="relative py-12 sm:py-16 bg-gradient-hero overflow-hidden">
        <div className="absolute -bottom-32 -left-20 size-[380px] rounded-full bg-cyan/20 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 bg-secondary/80 border border-border p-1 rounded-2xl mb-6 shadow-soft">
            {(["en", "hi"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`flex items-center gap-1.5 px-4.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${lang === l ? "bg-primary text-white shadow-soft" : "text-muted-foreground hover:text-navy"
                  }`}
              >
                <Languages className="size-3.5" /> {l === "en" ? "English" : "हिन्दी"}
              </button>
            ))}
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-navy leading-none">
            {lang === "en" ? "Dental Plus" : "डेंटल प्लस"}{" "}
            <span className="text-gradient">{lang === "en" ? "Clinic" : "क्लीनिक"}</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto font-medium">
            {t.subtitle} • {CLINIC.address.city}
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="py-12 bg-gradient-soft">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="bg-card rounded-3xl p-5 sm:p-10 border border-border shadow-card text-navy">

            {/* Card header */}
            <div className="flex items-center gap-3 border-b border-border pb-5 mb-8">
              <div className="size-12 rounded-2xl bg-primary/10 grid place-items-center text-primary shrink-0">
                <FileText className="size-6" />
              </div>
              <div>
                <h2 className="font-display font-bold text-lg sm:text-xl text-navy">Clinical &amp; Diagnostics Consent</h2>
                <p className="text-xs sm:text-sm text-muted-foreground">Governed under clinical safety guidelines &amp; world-class sterilization protocols.</p>
              </div>
            </div>

            {submitted ? (
              /* ── Success state ── */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-50 border border-emerald-100 rounded-3xl p-8 sm:p-12 text-center text-emerald-800"
              >
                <CheckCircle2 className="size-16 text-emerald-500 mx-auto mb-4 animate-pulse" />
                <h3 className="font-display font-semibold text-2xl">
                  {lang === "en" ? "Consent Submitted!" : "सहमति पत्र जमा किया गया!"}
                </h3>
                <p className="text-sm mt-3 text-emerald-700/95 max-w-md mx-auto leading-relaxed">
                  {lang === "en"
                    ? "Your signed consent form has been securely saved to our database and downloaded."
                    : "आपका हस्ताक्षरित सहमति पत्र डेटाबेस में सुरक्षित सहेजा व डाउनलोड हो गया है।"}
                </p>

                <div className="my-8 max-w-md mx-auto bg-white border border-emerald-200/80 rounded-2xl p-6 text-left shadow-soft space-y-4">
                  <div className="font-bold text-navy text-xs uppercase tracking-wider border-b border-border pb-2 flex items-center gap-1.5">
                    <ShieldCheck className="size-4 text-emerald-600" /> {lang === "en" ? "Submission Highlights" : "सफलतापूर्वक जमा"}
                  </div>
                  {[
                    lang === "en"
                      ? ["Saved to Clinic Database", "Our doctors have instant digital access to your signed form."]
                      : ["क्लीनिक डेटाबेस में सहेजा", "हमारे डॉक्टरों के पास आपके पत्र तक डिजिटल पहुंच है।"],
                    lang === "en"
                      ? ["PDF Downloaded", `'${pdfFilename}' has been saved to your device.`]
                      : ["पीडीएफ डाउनलोड", `'${pdfFilename}' आपके डिवाइस पर है।`],
                  ].map(([title, body]) => (
                    <div key={title} className="flex gap-3 items-start text-xs sm:text-sm text-muted-foreground leading-normal">
                      <Check className="size-4.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>{title}:</strong> {body}</span>
                    </div>
                  ))}
                  <div className="flex gap-3 items-start text-xs sm:text-sm text-emerald-800 font-semibold leading-normal pt-2 border-t border-dashed border-emerald-100">
                    <Check className="size-4.5 text-emerald-600 shrink-0 mt-0.5 animate-bounce" />
                    <span>{lang === "en" ? "Please inform clinic staff that you have completed this form!" : "कृपया क्लीनिक स्टाफ को सूचित करें कि आपने यह फॉर्म भर दिया है!"}</span>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-4 justify-center">
                  <button
                    onClick={() => handleDownloadPDF(true)}
                    disabled={isPdfBusy}
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-8 py-3.5 font-semibold text-white shadow-soft hover:scale-[1.03] transition-transform disabled:opacity-50"
                  >
                    <Download className="size-4.5" /> {isPdfBusy ? "Compiling…" : "Re-download PDF"}
                  </button>
                  <button
                    onClick={() => { setSubmitted(false); clear(); }}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-white text-navy px-8 py-3.5 font-semibold hover:bg-muted transition-colors"
                  >
                    {t.editSign}
                  </button>
                </div>
              </motion.div>
            ) : (
              /* ── Form state ── */
              <form onSubmit={handleSubmit} className="space-y-8">

                {/* 1. Patient Particulars */}
                <fieldset className="space-y-4">
                  <SectionHeading n="1" label={t.patientParticulars} />
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label={t.nameLabel}>
                      <input
                        required
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder={lang === "en" ? "Patient Name" : "मरीज का नाम"}
                        className="mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-semibold"
                      />
                    </Field>
                    <Field label={t.phoneLabel}>
                      <input
                        required
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder={lang === "en" ? "Contact Number" : "फ़ोन नंबर"}
                        className="mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </Field>
                  </div>
                </fieldset>

                {/* 2. Medical History */}
                <fieldset className="space-y-4 pt-4 border-t border-border/80">
                  <SectionHeading n="2" label={t.medHistory} />
                  <textarea
                    rows={3}
                    value={form.history}
                    onChange={(e) => setForm({ ...form, history: e.target.value })}
                    placeholder={t.medHistoryPlaceholder}
                    className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </fieldset>

                {/* 3. Procedures */}
                <fieldset className="space-y-4 pt-4 border-t border-border/80">
                  <SectionHeading n="3" label={t.proceduresHeader} />
                  <p className="text-xs sm:text-sm text-muted-foreground italic leading-relaxed">"{t.introText}"</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {procedures.map((proc) => {
                      const isSelected = selectedProcedures.includes(proc.id);
                      return (
                        <div
                          key={proc.id}
                          onClick={() => toggleProcedure(proc.id)}
                          className={`rounded-2xl border p-4.5 cursor-pointer select-none transition-all duration-300 flex items-start gap-3 h-full ${isSelected ? "border-primary/40 bg-primary/5 shadow-soft" : "border-border bg-white hover:border-primary/25"
                            }`}
                        >
                          <div className={`size-5 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors duration-300 ${isSelected ? "bg-primary border-primary text-white" : "border-border bg-white"
                            }`}>
                            {isSelected && <CheckCircle2 className="size-3.5 stroke-[3.5] text-white" />}
                          </div>
                          <div>
                            <div className="font-semibold text-navy text-sm">{proc.name}</div>
                            {proc.risks && (
                              <div className="text-[10px] text-primary font-medium mt-1 uppercase tracking-wider">
                                {lang === "en" ? "Complication: " : "संभावित प्रभाव: "}{proc.risks}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </fieldset>

                {/* 4. Disclaimers */}
                <div className="pt-6 border-t border-border/80 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  <div className="bg-secondary/40 border border-border p-5 rounded-2xl space-y-3.5">
                    {[t.clausePostpone, t.clauseDisposal, t.clauseUnderstand, t.clauseWithdraw].map((clause, i) => (
                      <div key={i} className="flex gap-2.5 items-start">
                        <div className="size-2 bg-primary rounded-full mt-1.5 shrink-0" />
                        <p>{clause}</p>
                      </div>
                    ))}
                    <div className="flex gap-2.5 items-start text-navy font-semibold">
                      <ShieldCheck className="size-4.5 text-primary mt-0.5 shrink-0" />
                      <p>{t.clauseLanguage}</p>
                    </div>
                  </div>
                </div>

                {/* 5. Signature */}
                <fieldset className="space-y-4 pt-4 border-t border-border/80">
                  <SectionHeading n="4" label={lang === "en" ? "Sign Online" : "ऑनलाइन हस्ताक्षर करें"} />
                  <div className="bg-slate-50 border border-border/80 rounded-2xl p-5 space-y-4 shadow-inner">
                    <label className="text-xs font-bold text-navy uppercase tracking-wider flex items-center gap-1.5">
                      <Edit3 className="size-3.5 text-primary" /> {t.signPrompt}
                    </label>

                    <div className="relative border-2 border-dashed border-slate-300 rounded-2xl overflow-hidden bg-white shadow-soft h-48 w-full cursor-crosshair">
                      <canvas
                        ref={canvasRef}
                        width={600}
                        height={192}
                        {...mouseHandlers}
                        className="absolute inset-0 w-full h-full touch-none"
                      />
                      {!hasSigned && (
                        <div className="absolute inset-0 pointer-events-none flex flex-col justify-center items-center text-muted-foreground/50 text-xs text-center p-4">
                          <Edit3 className="size-8 stroke-[1] mb-2 animate-pulse" />
                          <span>{lang === "en" ? "Use your mouse or finger to draw your signature here" : "माउस या उंगली से हस्ताक्षर करें"}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={clear}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white text-rose-500 px-4 py-2.5 text-xs font-semibold hover:bg-rose-50 transition-colors shadow-soft"
                      >
                        <Trash2 className="size-3.5" /> {t.clearButton}
                      </button>
                    </div>
                  </div>

                  <div
                    onClick={() => setCertified((c) => !c)}
                    className="flex items-start gap-3 cursor-pointer select-none mt-4 bg-secondary/35 border border-border p-4.5 rounded-xl"
                  >
                    <div className={`size-5 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors duration-300 ${certified ? "bg-primary border-primary text-white" : "border-border bg-white"
                      }`}>
                      {certified && <CheckCircle2 className="size-3.5 stroke-[3] text-white" />}
                    </div>
                    <p className="text-xs sm:text-sm text-navy leading-normal font-semibold">{t.certifyLabel}</p>
                  </div>
                </fieldset>

                {/* Alert */}
                {alertMsg && (
                  <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-xl text-xs sm:text-sm text-rose-600 flex items-center gap-2 font-medium">
                    <AlertCircle className="size-4 shrink-0 text-rose-500" />
                    <span>{alertMsg}</span>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isPdfBusy || isSaving}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-primary px-6 py-4 font-semibold text-primary-foreground shadow-cta hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                >
                  <ShieldCheck className="size-5 shrink-0" />
                  {isSaving
                    ? (lang === "en" ? "Saving to Database…" : "डेटाबेस में सहेजा जा रहा है…")
                    : isPdfBusy
                      ? (lang === "en" ? "Compiling PDF…" : "पीडीएफ तैयार हो रही है…")
                      : t.submitButton}
                </button>

                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => navigate({ to: "/" })}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-primary hover:text-navy transition-colors"
                  >
                    <ArrowLeft className="size-3.5" /> {lang === "en" ? "Back to Homepage" : "मुख्य पृष्ठ पर वापस जाएं"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ─── Off-screen professional PDF template ──────────────────────────────── */}
      <div aria-hidden style={{ position: "absolute", left: "-9999px", top: 0 }}>
        <div
          id="consent-form-printable"
          style={{
            fontFamily: "'Georgia', 'Times New Roman', serif",
            padding: "18mm 14mm 16mm 14mm",
            color: "#111827",
            backgroundColor: "#ffffff",
            width: "182mm",
            fontSize: "11px",
            lineHeight: "1.55",
          }}
        >
          {/* ── Header band ── */}
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "16px" }}>
            <tbody>
              <tr>
                {/* Left – clinic identity */}
                <td style={{ verticalAlign: "top", width: "70%" }}>
                  <table style={{ borderCollapse: "collapse" }}>
                    <tbody>
                      <tr>
                        <td style={{ padding: "0 10px 0 0", verticalAlign: "middle" }}>
                          <img
                            src={logoImg}
                            alt="Clinic Logo"
                            style={{ height: "36px", width: "auto", objectFit: "contain", display: "block" }}
                          />
                        </td>
                        <td style={{ verticalAlign: "middle" }}>
                          <div style={{
                            display: "inline-block",
                            backgroundColor: "#0b1b3d",
                            color: "#ffffff",
                            padding: "4px 14px 4px 10px",
                            borderRadius: "3px",
                            fontSize: "18px",
                            fontWeight: "700",
                            letterSpacing: "1.5px",
                            textTransform: "uppercase",
                            fontFamily: "'Arial', sans-serif",
                          }}>
                            {CLINIC.name}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div style={{ fontSize: "8.5px", color: "#4b5563", fontFamily: "'Arial', sans-serif", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.8px", marginTop: "6px", marginBottom: "2px" }}>
                    Premium Clinical Restorations &amp; Dental Surgery
                  </div>
                  <div style={{ fontSize: "8px", color: "#6b7280", fontFamily: "'Arial', sans-serif" }}>
                    {CLINIC.address.line1}, {CLINIC.address.line2}, {CLINIC.address.city}
                  </div>
                </td>

                {/* Right – doc metadata */}
                <td style={{ verticalAlign: "top", textAlign: "right", width: "30%" }}>
                  <div style={{
                    border: "1.5px solid #0b1b3d",
                    borderRadius: "5px",
                    padding: "6px 10px",
                    fontSize: "8px",
                    fontFamily: "'Arial', sans-serif",
                    color: "#374151",
                    lineHeight: "1.7",
                  }}>
                    <div style={{ fontWeight: "700", color: "#0b1b3d", fontSize: "8.5px", marginBottom: "3px" }}>DOCUMENT INFO</div>
                    <div><strong>Consent ID:</strong> {consentId}</div>
                    <div><strong>Date:</strong> {todayStr}</div>
                    <div><strong>Language:</strong> {lang === "en" ? "English" : "Hindi / हिन्दी"}</div>
                    <div style={{ marginTop: "4px", color: "#059669", fontWeight: "700", fontSize: "7.5px", textTransform: "uppercase" }}>✓ Digitally Signed</div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* ── Title bar ── */}
          <div style={{
            backgroundColor: "#0b1b3d",
            color: "#ffffff",
            textAlign: "center",
            padding: "7px 12px",
            borderRadius: "4px",
            marginBottom: "16px",
            fontFamily: "'Arial', sans-serif",
          }}>
            <div style={{ fontSize: "13px", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase" }}>
              {t.title}
            </div>
            <div style={{ fontSize: "8.5px", opacity: 0.8, marginTop: "2px", letterSpacing: "0.5px" }}>
              {t.subtitle}
            </div>
          </div>

          {/* ── Patient particulars ── */}
          <div style={{ marginBottom: "14px" }}>
            <SectionHeaderPDF label={t.patientParticulars} />
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'Arial', sans-serif", fontSize: "10.5px" }}>
              <tbody>
                <tr>
                  <td style={pdfLabelCell}>Patient Name:</td>
                  <td style={pdfValueCell}>{form.name || "—"}</td>
                  <td style={{ ...pdfLabelCell, textAlign: "right", paddingRight: "6px" }}>Contact:</td>
                  <td style={{ ...pdfValueCell, width: "28%" }}>{form.phone || "—"}</td>
                </tr>
                <tr>
                  <td style={pdfLabelCell}>Date:</td>
                  <td style={pdfValueCell}>{todayStr}</td>
                  <td style={{ ...pdfLabelCell, textAlign: "right", paddingRight: "6px" }}>Consent ID:</td>
                  <td style={pdfValueCell}>{consentId}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ── Medical / Drug history ── */}
          <div style={{ marginBottom: "14px" }}>
            <SectionHeaderPDF label={t.medHistory} />
            <div style={{
              minHeight: "24px",
              borderBottom: "1px dotted #9ca3af",
              padding: "3px 0 4px 0",
              fontFamily: "'Arial', sans-serif",
              fontSize: "10.5px",
              fontStyle: form.history ? "normal" : "italic",
              color: form.history ? "#111827" : "#9ca3af",
            }}>
              {form.history || "None reported / कोई चिकित्सीय इतिहास नहीं बताया गया।"}
            </div>
          </div>

          {/* ── Intro text ── */}
          <div style={{
            fontStyle: "italic",
            fontSize: "9.5px",
            marginBottom: "12px",
            color: "#4b5563",
            fontFamily: "'Georgia', serif",
            borderLeft: "3px solid #0b1b3d",
            paddingLeft: "8px",
            lineHeight: "1.6",
          }}>
            "{t.introText}"
          </div>

          {/* ── Procedures grid ── */}
          <div style={{ marginBottom: "16px" }}>
            <SectionHeaderPDF label={t.proceduresHeader} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "5px 14px" }}>
              {procedures.map((proc, i) => {
                const ok = selectedProcedures.includes(proc.id);
                return (
                  <div key={proc.id} style={{ display: "flex", alignItems: "flex-start", gap: "6px", padding: "3px 0", opacity: ok ? 1 : 0.4 }}>
                    <div style={{
                      width: "12px", height: "12px",
                      border: "1.5px solid #0b1b3d",
                      borderRadius: "2px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      backgroundColor: ok ? "#0b1b3d" : "#fff",
                      color: "#fff",
                      fontSize: "8px", fontWeight: "bold",
                      marginTop: "2px", flexShrink: 0,
                      fontFamily: "'Arial', sans-serif",
                    }}>
                      {ok && "✓"}
                    </div>
                    <div>
                      <div style={{ fontWeight: ok ? "700" : "500", fontSize: "10px", fontFamily: "'Arial', sans-serif" }}>
                        {i + 1}. {proc.name}
                      </div>
                      {proc.risks && ok && (
                        <div style={{ fontSize: "8px", color: "#b91c1c", fontWeight: "700", textTransform: "uppercase", marginTop: "1px", fontFamily: "'Arial', sans-serif" }}>
                          ⚠ {proc.risks}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Disclaimers ── */}
          <div style={{ marginBottom: "18px" }}>
            <SectionHeaderPDF label="Terms & Conditions / नियम एवं शर्तें" />
            <div style={{
              border: "1px solid #d1d5db",
              borderRadius: "5px",
              padding: "9px 12px",
              backgroundColor: "#f9fafb",
              fontSize: "9px",
              color: "#374151",
              fontFamily: "'Arial', sans-serif",
              lineHeight: "1.7",
            }}>
              {[t.clausePostpone, t.clauseDisposal, t.clauseUnderstand, t.clauseWithdraw].map((c, i) => (
                <div key={i} style={{ marginBottom: "4px", display: "flex", gap: "5px" }}>
                  <span style={{ color: "#0b1b3d", fontWeight: "700", flexShrink: 0 }}>•</span>
                  <span>{c}</span>
                </div>
              ))}
              <div style={{ marginTop: "6px", paddingTop: "6px", borderTop: "1px dashed #d1d5db", fontWeight: "700", color: "#0b1b3d", display: "flex", gap: "5px" }}>
                <span style={{ flexShrink: 0 }}>⚖</span>
                <span>{t.clauseLanguage}</span>
              </div>
            </div>
          </div>

          {/* ── Signatures ── */}
          <SectionHeaderPDF label="Authorisation & Signatures / प्राधिकरण एवं हस्ताक्षर" />
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "6px" }}>
            <tbody>
              <tr>
                {/* Patient signature */}
                <td style={{ width: "50%", paddingRight: "12px", verticalAlign: "bottom" }}>
                  <div style={{
                    border: "1.5px solid #0b1b3d",
                    borderRadius: "6px",
                    height: "72px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    backgroundColor: "#fafafa",
                  }}>
                    {signatureImage ? (
                      <img src={signatureImage} alt="Patient Signature" style={{ height: "60px", width: "auto", objectFit: "contain" }} />
                    ) : (
                      <span style={{ fontSize: "9px", color: "#9ca3af", fontFamily: "'Arial', sans-serif" }}>No signature recorded</span>
                    )}
                    {signatureImage && (
                      <span style={{
                        position: "absolute", bottom: "3px", right: "6px",
                        fontSize: "7px", color: "#059669", fontWeight: "700",
                        fontFamily: "'Arial', sans-serif",
                        backgroundColor: "#ecfdf5",
                        padding: "1px 4px",
                        borderRadius: "2px",
                        border: "1px solid #a7f3d0",
                      }}>
                        ✓ VERIFIED ONLINE
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: "9.5px", fontWeight: "700", marginTop: "5px", textTransform: "uppercase", fontFamily: "'Arial', sans-serif" }}>
                    Patient / Guardian Signature
                  </div>
                  <div style={{ fontSize: "8.5px", color: "#6b7280", fontFamily: "'Arial', sans-serif", marginTop: "1px" }}>
                    Name: {form.name || "—"} &nbsp;|&nbsp; Date: {todayStr}
                  </div>
                </td>

                {/* Doctor panel */}
                <td style={{ width: "50%", paddingLeft: "12px", verticalAlign: "bottom" }}>
                  <div style={{
                    border: "2px solid #0b1b3d",
                    borderRadius: "6px",
                    height: "72px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    backgroundColor: "#f8fafc",
                    padding: "8px",
                  }}>
                    <div style={{ fontSize: "11.5px", fontWeight: "800", color: "#0b1b3d", textTransform: "uppercase", fontFamily: "'Arial', sans-serif", letterSpacing: "0.5px" }}>
                      Dr. Jigyasa Bhardwaj
                    </div>
                    <div style={{ fontSize: "8px", color: "#4b5563", fontWeight: "600", marginTop: "2px", fontFamily: "'Arial', sans-serif" }}>
                      Chief Dental Surgeon — BDS, MAOI
                    </div>
                    <div style={{ fontSize: "7.5px", color: "#6b7280", marginTop: "1px", fontFamily: "'Arial', sans-serif" }}>
                      Dental Plus Clinic, {CLINIC.address.city}
                    </div>
                  </div>
                  <div style={{ fontSize: "9.5px", fontWeight: "700", marginTop: "5px", textTransform: "uppercase", fontFamily: "'Arial', sans-serif" }}>
                    Doctor Name &amp; Verification
                  </div>
                  <div style={{ fontSize: "8.5px", color: "#6b7280", fontFamily: "'Arial', sans-serif", marginTop: "1px" }}>
                    Clinical verification — Dental Plus
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* ── Footer ── */}
          <div style={{
            marginTop: "18px",
            paddingTop: "8px",
            borderTop: "2px solid #0b1b3d",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: "'Arial', sans-serif",
            fontSize: "7.5px",
            color: "#6b7280",
          }}>
            <div>
              <strong style={{ color: "#0b1b3d" }}>{CLINIC.name}</strong> &nbsp;•&nbsp;
              {CLINIC.address.line1}, {CLINIC.address.city}
            </div>
            <div style={{ textAlign: "right" }}>
              <div>This document is legally binding upon signing.</div>
              <div style={{ color: "#0b1b3d", fontWeight: "600" }}>Consent ID: {consentId}</div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <MobileCta />
    </main>
  );
}

// ─── Small shared sub-components ─────────────────────────────────────────────

function SectionHeading({ n, label }: { n: string; label: string }) {
  return (
    <h3 className="font-display font-bold text-navy text-sm uppercase tracking-wider mb-2 flex items-center gap-2">
      <span className="size-5 rounded-full bg-primary/10 grid place-items-center text-primary text-[10px]">{n}</span>
      {label}
    </h3>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-bold text-navy uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}

function SectionHeaderPDF({ label }: { label: string }) {
  return (
    <div style={{
      fontSize: "9.5px",
      fontWeight: "700",
      fontFamily: "'Arial', sans-serif",
      color: "#ffffff",
      backgroundColor: "#374151",
      padding: "3px 8px",
      borderRadius: "3px",
      textTransform: "uppercase",
      letterSpacing: "0.7px",
      marginBottom: "7px",
    }}>
      {label}
    </div>
  );
}

// ─── PDF cell styles (defined once, reused) ──────────────────────────────────
const pdfLabelCell: React.CSSProperties = {
  fontWeight: "700",
  padding: "3px 6px 3px 0",
  width: "18%",
  verticalAlign: "bottom",
  fontFamily: "'Arial', sans-serif",
  fontSize: "9.5px",
  color: "#374151",
};

const pdfValueCell: React.CSSProperties = {
  borderBottom: "1px dotted #9ca3af",
  padding: "3px 6px",
  fontFamily: "'Arial', sans-serif",
  fontSize: "10px",
  fontWeight: "600",
  color: "#111827",
};