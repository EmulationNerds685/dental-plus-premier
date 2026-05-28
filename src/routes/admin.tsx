import { useState, useEffect, useCallback, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { getConsentsFn, deleteConsentFn } from "@/lib/consent";
import { CLINIC } from "@/lib/clinic";
import { PROCEDURES_DATA, CONSENT_TEXT } from "@/lib/consentData";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import logoImg from "@/assets/optimized/DP_Logo.webp";
import {
  Lock, KeyRound, Search, FileText, Download, Trash2, Eye,
  Calendar, CheckCircle2, ChevronUp, AlertCircle, RefreshCw,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Doctor Admin Panel | Dental Plus Clinic Dehradun" },
      { name: "description", content: "Clinic administrative dashboard to review clinical patient consent forms and download legal PDFs." },
      { property: "og:title", content: "Doctor Admin Panel | Dental Plus Clinic Dehradun" },
      { property: "og:description", content: "Clinic administrative dashboard to review clinical patient consent forms and download legal PDFs." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: AdminDashboardPage,
});

// ─── Types ───────────────────────────────────────────────────────────────────

interface ConsentRecord {
  id: string;
  name: string;
  phone: string;
  history?: string;
  selectedProcedures: string[];
  signatureImage: string;
  certified: boolean;
  lang: "en" | "hi";
  createdAt: string;
}

// ─── Auth constants ───────────────────────────────────────────────────────────

const VALID_PINS = new Set(["1234", "dental2026"]);
const SESSION_KEY = "admin_authenticated";

// ─── Shared PDF generator (mirrors ConsentPage utility) ──────────────────────

async function generateConsentPDF(
  elementId: string,
  filename: string,
  onStart: () => void,
  onDone: () => void,
): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element || typeof window === "undefined") return false;

  onStart();

  const styles = Array.from(document.querySelectorAll<HTMLElement>("style, link[rel='stylesheet']"));
  styles.forEach((el) => el.parentNode?.removeChild(el));

  let iframe: HTMLIFrameElement | null = null;

  try {
    const mod = await import(/* @vite-ignore */ "html2pdf.js");
    const html2pdf = mod.default ?? mod;

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

// ─── Shared PDF template sub-component ───────────────────────────────────────
// Kept outside AdminDashboardPage so it doesn't re-create on every render.

function ConsentPDFTemplate({ record }: { record: ConsentRecord }) {
  const t = CONSENT_TEXT[record.lang];
  const procedures = PROCEDURES_DATA[record.lang];

  const signedAt = new Date(record.createdAt);
  const dateStr = signedAt.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  const timeStr = signedAt.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  const consentId = `DPCD-${record.id.slice(0, 8).toUpperCase()}`;

  return (
    <div
      id="consent-form-printable-admin"
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
                <div><strong>Signed:</strong> {dateStr} {timeStr}</div>
                <div><strong>Language:</strong> {record.lang === "en" ? "English" : "Hindi / हिन्दी"}</div>
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
        <div style={{ fontSize: "13px", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase" }}>{t.title}</div>
        <div style={{ fontSize: "8.5px", opacity: 0.8, marginTop: "2px", letterSpacing: "0.5px" }}>{t.subtitle}</div>
      </div>

      {/* ── Patient particulars ── */}
      <div style={{ marginBottom: "14px" }}>
        <PDFSectionHeader label={t.patientParticulars} />
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'Arial', sans-serif", fontSize: "10.5px" }}>
          <tbody>
            <tr>
              <td style={pdfLabel}>Patient Name:</td>
              <td style={pdfValue}>{record.name}</td>
              <td style={{ ...pdfLabel, textAlign: "right", paddingRight: "6px" }}>Contact:</td>
              <td style={{ ...pdfValue, width: "28%" }}>{record.phone}</td>
            </tr>
            <tr>
              <td style={pdfLabel}>Signed Date:</td>
              <td style={pdfValue}>{dateStr}</td>
              <td style={{ ...pdfLabel, textAlign: "right", paddingRight: "6px" }}>Time:</td>
              <td style={pdfValue}>{timeStr}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── Medical history ── */}
      <div style={{ marginBottom: "14px" }}>
        <PDFSectionHeader label={t.medHistory} />
        <div style={{
          minHeight: "24px",
          borderBottom: "1px dotted #9ca3af",
          padding: "3px 0 4px 0",
          fontFamily: "'Arial', sans-serif",
          fontSize: "10.5px",
          fontStyle: record.history ? "normal" : "italic",
          color: record.history ? "#111827" : "#9ca3af",
        }}>
          {record.history || (record.lang === "hi" ? "कोई चिकित्सीय इतिहास नहीं बताया गया।" : "None reported.")}
        </div>
      </div>

      {/* ── Intro quote ── */}
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
        <PDFSectionHeader label={t.proceduresHeader} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "5px 14px" }}>
          {procedures.map((proc, i) => {
            const ok = record.selectedProcedures.includes(proc.id);
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
        <PDFSectionHeader label="Terms & Conditions / नियम एवं शर्तें" />
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
      <PDFSectionHeader label="Authorisation & Signatures / प्राधिकरण एवं हस्ताक्षर" />
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "6px" }}>
        <tbody>
          <tr>
            <td style={{ width: "50%", paddingRight: "12px", verticalAlign: "bottom" }}>
              <div style={{
                border: "1.5px solid #0b1b3d", borderRadius: "6px",
                height: "72px", display: "flex", alignItems: "center", justifyContent: "center",
                position: "relative", backgroundColor: "#fafafa",
              }}>
                {record.signatureImage
                  ? <img src={record.signatureImage} alt="Patient Signature" style={{ height: "60px", width: "auto", objectFit: "contain" }} />
                  : <span style={{ fontSize: "9px", color: "#9ca3af", fontFamily: "'Arial', sans-serif" }}>No signature recorded</span>}
                {record.signatureImage && (
                  <span style={{
                    position: "absolute", bottom: "3px", right: "6px",
                    fontSize: "7px", color: "#059669", fontWeight: "700",
                    fontFamily: "'Arial', sans-serif",
                    backgroundColor: "#ecfdf5", padding: "1px 4px",
                    borderRadius: "2px", border: "1px solid #a7f3d0",
                  }}>
                    ✓ VERIFIED ONLINE
                  </span>
                )}
              </div>
              <div style={{ fontSize: "9.5px", fontWeight: "700", marginTop: "5px", textTransform: "uppercase", fontFamily: "'Arial', sans-serif" }}>
                Patient / Guardian Signature
              </div>
              <div style={{ fontSize: "8.5px", color: "#6b7280", fontFamily: "'Arial', sans-serif", marginTop: "1px" }}>
                Name: {record.name} &nbsp;|&nbsp; Signed: {dateStr} {timeStr}
              </div>
            </td>

            <td style={{ width: "50%", paddingLeft: "12px", verticalAlign: "bottom" }}>
              <div style={{
                border: "2px solid #0b1b3d", borderRadius: "6px",
                height: "72px", display: "flex", flexDirection: "column",
                justifyContent: "center", alignItems: "center", textAlign: "center",
                backgroundColor: "#f8fafc", padding: "8px",
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
        marginTop: "18px", paddingTop: "8px",
        borderTop: "2px solid #0b1b3d",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        fontFamily: "'Arial', sans-serif", fontSize: "7.5px", color: "#6b7280",
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
  );
}

// ─── PDF cell styles ──────────────────────────────────────────────────────────

const pdfLabel: React.CSSProperties = {
  fontWeight: "700",
  padding: "3px 6px 3px 0",
  width: "18%",
  verticalAlign: "bottom",
  fontFamily: "'Arial', sans-serif",
  fontSize: "9.5px",
  color: "#374151",
};

const pdfValue: React.CSSProperties = {
  borderBottom: "1px dotted #9ca3af",
  padding: "3px 6px",
  fontFamily: "'Arial', sans-serif",
  fontSize: "10px",
  fontWeight: "600",
  color: "#111827",
};

function PDFSectionHeader({ label }: { label: string }) {
  return (
    <div style={{
      fontSize: "9.5px", fontWeight: "700",
      fontFamily: "'Arial', sans-serif",
      color: "#ffffff", backgroundColor: "#374151",
      padding: "3px 8px", borderRadius: "3px",
      textTransform: "uppercase", letterSpacing: "0.7px",
      marginBottom: "7px",
    }}>
      {label}
    </div>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="bg-card rounded-2xl border border-border p-5 shadow-soft flex items-center gap-4">
      <div className="size-12 rounded-xl bg-primary/10 grid place-items-center text-primary shrink-0">{icon}</div>
      <div>
        <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{label}</div>
        <div className="font-display font-extrabold text-2xl text-navy mt-0.5">{value}</div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");

  const [consents, setConsents] = useState<ConsentRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [pdfRecord, setPdfRecord] = useState<ConsentRecord | null>(null);
  const [isPdfBusy, setIsPdfBusy] = useState(false);

  // ── Derived ──
  const filteredConsents = useMemo(
    () => consents.filter(
      (c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery),
    ),
    [consents, searchQuery],
  );

  const todayCount = useMemo(
    () => consents.filter((c) => new Date(c.createdAt).toDateString() === new Date().toDateString()).length,
    [consents],
  );

  // ── Data fetching ──
  const fetchConsents = useCallback(async (notify = false) => {
    setLoading(true);
    try {
      const data = await getConsentsFn();
      setConsents(data as ConsentRecord[]);
      if (notify) toast.success("Consent list refreshed.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to load patient consent forms.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Restore session on mount
  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === "true") {
      setIsAuthenticated(true);
      fetchConsents();
    }
  }, [fetchConsents]);

  // ── Auth ──
  const handleUnlock = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (VALID_PINS.has(pin)) {
        setIsAuthenticated(true);
        setPinError("");
        sessionStorage.setItem(SESSION_KEY, "true");
        toast.success("Welcome, clinic administrator.");
        fetchConsents();
      } else {
        setPinError("Invalid Administrative PIN. Please try again.");
        toast.error("Incorrect PIN");
      }
    },
    [pin, fetchConsents],
  );

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    sessionStorage.removeItem(SESSION_KEY);
    setPin("");
    toast.info("Logged out from admin panel.");
  }, []);

  // ── Delete ──
  const handleDelete = useCallback(async (id: string, name: string) => {
    if (!window.confirm(`Permanently delete ${name}'s consent form? This cannot be undone.`)) return;
    try {
      const result = await deleteConsentFn({ data: id });
      if (result?.success) {
        toast.success(`${name}'s consent form deleted.`);
        setConsents((prev) => prev.filter((c) => c.id !== id));
        setExpandedId((prev) => (prev === id ? null : prev));
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete record.");
    }
  }, []);

  // ── PDF ──
  const handleDownloadPDF = useCallback(async (record: ConsentRecord) => {
    setPdfRecord(record);
    // Let the off-screen template mount with the new record
    await new Promise((r) => setTimeout(r, 400));

    toast.info(`Compiling PDF for ${record.name}…`);
    const ok = await generateConsentPDF(
      "consent-form-printable-admin",
      `Dental_Plus_Consent_${record.name.replace(/\s+/g, "_")}.pdf`,
      () => setIsPdfBusy(true),
      () => setIsPdfBusy(false),
    );

    ok
      ? toast.success("PDF downloaded successfully!")
      : toast.error("Failed to generate PDF. Please try again.");
  }, []);

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <main className="min-h-screen bg-background overflow-x-hidden pt-20">
      <Navbar />

      {!isAuthenticated ? (
        /* ── Lock screen ── */
        <section className="relative min-h-[70vh] flex items-center justify-center bg-gradient-soft py-12 px-4 sm:px-6">
          <div className="absolute -bottom-32 -left-20 size-[380px] rounded-full bg-cyan/20 blur-3xl pointer-events-none" />
          <div className="absolute top-10 right-20 size-[300px] rounded-full bg-indigo/10 blur-3xl pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md bg-card border border-border shadow-card rounded-3xl p-6 sm:p-10 text-navy relative z-10"
          >
            <div className="text-center space-y-3 mb-8">
              <div className="size-16 rounded-2xl bg-primary/10 grid place-items-center text-primary mx-auto">
                <Lock className="size-8" />
              </div>
              <h1 className="font-display font-bold text-2xl tracking-tight">Staff Credentials Required</h1>
              <p className="text-sm text-muted-foreground">
                Enter your Dental Plus Clinic admin security PIN to access signed patient records.
              </p>
            </div>

            <form onSubmit={handleUnlock} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-navy flex items-center gap-1.5">
                  <KeyRound className="size-3.5 text-primary" /> Admin Passcode PIN
                </label>
                <input
                  required
                  type="password"
                  value={pin}
                  onChange={(e) => { setPin(e.target.value); setPinError(""); }}
                  placeholder="Enter passcode"
                  className="w-full text-center tracking-widest text-lg font-bold rounded-xl border border-border bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              {pinError && (
                <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-xl text-xs text-rose-600 flex items-center gap-2 font-semibold">
                  <AlertCircle className="size-4 shrink-0 text-rose-500" />
                  <span>{pinError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-primary px-6 py-3.5 font-semibold text-white shadow-cta hover:scale-[1.02] active:scale-95 transition-all"
              >
                Authenticate &amp; Unlock
              </button>
            </form>
          </motion.div>
        </section>
      ) : (
        /* ── Dashboard ── */
        <section className="py-12 bg-gradient-soft min-h-[80vh]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/80 pb-6">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full animate-pulse">
                    Live Session
                  </span>
                  <h1 className="font-display font-bold text-3xl text-navy">Clinical Consent Portal</h1>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Review, audit and generate certified clinical PDF consent files instantly.</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => fetchConsents(true)}
                  disabled={loading}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white text-navy px-4.5 py-2.5 text-xs font-bold hover:bg-muted shadow-soft transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh List
                </button>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 px-4.5 py-2.5 text-xs font-bold hover:bg-rose-100/70 shadow-soft transition-all"
                >
                  Lock Panel
                </button>
              </div>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <StatCard icon={<FileText className="size-6" />} label="Total Consents" value={`${consents.length} forms`} />
              <div className="bg-card rounded-2xl border border-border p-5 shadow-soft flex items-center gap-4">
                <div className="size-12 rounded-xl bg-emerald-500/10 grid place-items-center text-emerald-600 shrink-0">
                  <CheckCircle2 className="size-6" />
                </div>
                <div>
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Signed Today</div>
                  <div className="font-display font-extrabold text-2xl text-navy mt-0.5">{todayCount} forms</div>
                </div>
              </div>
              <div className="bg-card rounded-2xl border border-border p-5 shadow-soft flex items-center gap-4">
                <div className="size-12 rounded-xl bg-indigo/10 grid place-items-center text-indigo shrink-0">
                  <Calendar className="size-6" />
                </div>
                <div>
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Latest Activity</div>
                  <div className="font-display font-bold text-sm text-navy mt-1 truncate max-w-[180px]">
                    {consents[0]?.name ?? "No entries yet"}
                  </div>
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="bg-card rounded-2xl border border-border p-4.5 shadow-soft flex items-center gap-3">
              <Search className="size-5 text-muted-foreground shrink-0 ml-1.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by patient name or phone number…"
                className="w-full border-none outline-none bg-transparent text-sm text-navy placeholder:text-muted-foreground/75 font-medium"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="text-xs font-bold text-primary hover:text-navy p-1">
                  Clear
                </button>
              )}
            </div>

            {/* Table */}
            <div className="bg-card rounded-3xl border border-border shadow-card overflow-hidden">
              {loading && consents.length === 0 ? (
                <div className="py-20 text-center space-y-3">
                  <RefreshCw className="size-10 text-primary animate-spin mx-auto" />
                  <p className="text-sm font-semibold text-muted-foreground">Loading consent forms…</p>
                </div>
              ) : filteredConsents.length === 0 ? (
                <div className="py-20 text-center space-y-2">
                  <AlertCircle className="size-12 text-muted-foreground/60 mx-auto" />
                  <h3 className="font-bold text-navy text-lg">No patient consent forms found</h3>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    {searchQuery
                      ? "No records match your search filter."
                      : "Signed consent forms will appear here once patients submit."}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border/60">
                  {/* Desktop column headers */}
                  <div className="hidden md:grid grid-cols-12 gap-4 bg-secondary/50 px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-navy border-b border-border/80">
                    <div className="col-span-3">Patient Particulars</div>
                    <div className="col-span-2">Phone Number</div>
                    <div className="col-span-2">Submission Date</div>
                    <div className="col-span-3">Consented Treatments</div>
                    <div className="col-span-2 text-right">Actions</div>
                  </div>

                  {filteredConsents.map((consent) => {
                    const isExpanded = expandedId === consent.id;
                    const dateFormatted = new Date(consent.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
                    const timeFormatted = new Date(consent.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

                    return (
                      <div key={consent.id} className="transition-all hover:bg-secondary/15">
                        {/* Row summary */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center px-6 py-5 text-navy">

                          {/* Name + lang badge */}
                          <div className="col-span-1 md:col-span-3 flex items-center gap-2">
                            <div className="size-9 rounded-full bg-primary/10 grid place-items-center text-primary font-bold text-sm shrink-0">
                              {consent.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="truncate">
                              <h4 className="font-semibold text-sm leading-tight">{consent.name}</h4>
                              <span className="text-[10px] font-bold text-primary uppercase bg-primary/10 px-1.5 py-0.5 rounded-md mt-1 inline-block">
                                {consent.lang === "hi" ? "हिन्दी" : "English"}
                              </span>
                            </div>
                          </div>

                          {/* Phone */}
                          <div className="col-span-1 md:col-span-2 text-sm text-muted-foreground flex items-center gap-2 md:gap-0">
                            <span className="md:hidden text-xs font-bold uppercase text-navy/70 shrink-0 w-24">Phone:</span>
                            <span className="font-semibold text-navy/90">{consent.phone}</span>
                          </div>

                          {/* Date */}
                          <div className="col-span-1 md:col-span-2 text-sm text-muted-foreground flex items-center gap-2 md:gap-0">
                            <span className="md:hidden text-xs font-bold uppercase text-navy/70 shrink-0 w-24">Signed:</span>
                            <div className="font-semibold">
                              <div>{dateFormatted}</div>
                              <div className="text-[10px] text-muted-foreground/80 mt-0.5">{timeFormatted}</div>
                            </div>
                          </div>

                          {/* Procedures */}
                          <div className="col-span-1 md:col-span-3 flex flex-wrap gap-1.5 items-center">
                            <span className="md:hidden text-xs font-bold uppercase text-navy/70 shrink-0 w-24">Treatments:</span>
                            <div className="flex flex-wrap gap-1">
                              {consent.selectedProcedures.slice(0, 2).map((id) => {
                                const name = PROCEDURES_DATA[consent.lang].find((p) => p.id === id)?.name ?? id;
                                return (
                                  <span key={id} className="text-[10.5px] font-bold bg-navy/5 text-navy border border-border px-2 py-0.5 rounded-lg truncate max-w-[120px]">
                                    {name}
                                  </span>
                                );
                              })}
                              {consent.selectedProcedures.length > 2 && (
                                <span className="text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-100 px-1.5 py-0.5 rounded-md shrink-0">
                                  +{consent.selectedProcedures.length - 2} more
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="col-span-1 md:col-span-2 flex justify-end gap-2 pt-3 md:pt-0 border-t border-dashed border-border/80 md:border-none">
                            <button
                              onClick={() => handleDownloadPDF(consent)}
                              disabled={isPdfBusy}
                              title="Download Consent PDF"
                              className="size-9 bg-primary text-white hover:bg-primary/95 shadow-soft rounded-lg grid place-items-center transition-colors disabled:opacity-50"
                            >
                              <Download className="size-4" />
                            </button>
                            <button
                              onClick={() => setExpandedId(isExpanded ? null : consent.id)}
                              title={isExpanded ? "Collapse" : "Expand patient details"}
                              className="size-9 border border-border bg-white text-navy hover:bg-muted shadow-soft rounded-lg grid place-items-center transition-colors"
                            >
                              {isExpanded ? <ChevronUp className="size-4" /> : <Eye className="size-4" />}
                            </button>
                            <button
                              onClick={() => handleDelete(consent.id, consent.name)}
                              title="Delete consent record"
                              className="size-9 bg-rose-50 border border-rose-100 text-rose-500 hover:bg-rose-100/60 shadow-soft rounded-lg grid place-items-center transition-colors"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        </div>

                        {/* Expanded detail */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden bg-secondary/20 border-t border-border/50"
                            >
                              <div className="px-6 py-6 space-y-6 text-sm text-navy">
                                <div className="grid md:grid-cols-12 gap-6">

                                  {/* Left – history + procedures */}
                                  <div className="md:col-span-7 space-y-4">
                                    <div>
                                      <h5 className="font-bold text-xs uppercase text-muted-foreground tracking-wider mb-1 flex items-center gap-1.5">
                                        <AlertCircle className="size-3.5 text-primary" /> Medical / Drug History
                                      </h5>
                                      <div className="bg-white border border-border rounded-xl p-4 font-semibold text-navy/95 min-h-[50px] shadow-inner leading-relaxed">
                                        {consent.history || "No medical or systemic history reported."}
                                      </div>
                                    </div>

                                    <div>
                                      <h5 className="font-bold text-xs uppercase text-muted-foreground tracking-wider mb-2 flex items-center gap-1.5">
                                        <CheckCircle2 className="size-3.5 text-emerald-500" /> Authorized Clinical Checklist
                                      </h5>
                                      <div className="grid gap-2 sm:grid-cols-2">
                                        {consent.selectedProcedures.map((procId) => {
                                          const p = PROCEDURES_DATA[consent.lang].find((x) => x.id === procId);
                                          return (
                                            <div key={procId} className="bg-white border border-border rounded-xl p-3 flex gap-2.5 items-start shadow-soft">
                                              <div className="size-4 rounded-full bg-emerald-500 text-white text-[8px] font-bold grid place-items-center mt-0.5 shrink-0">✓</div>
                                              <div>
                                                <div className="font-bold text-xs text-navy leading-normal">{p?.name ?? procId}</div>
                                                {p?.risks && (
                                                  <div className="text-[9.5px] text-primary/95 font-semibold uppercase tracking-wider mt-0.5">
                                                    Complication: {p.risks}
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Right – signature */}
                                  <div className="md:col-span-5 space-y-4">
                                    <div>
                                      <h5 className="font-bold text-xs uppercase text-muted-foreground tracking-wider mb-1.5 flex items-center gap-1.5">
                                        <FileText className="size-3.5 text-primary" /> Captured Digital Signature
                                      </h5>
                                      <div className="bg-white border border-border rounded-xl p-4.5 flex flex-col justify-center items-center h-48 shadow-soft relative overflow-hidden">
                                        {consent.signatureImage
                                          ? <img src={consent.signatureImage} alt={`${consent.name}'s Signature`} className="h-36 w-auto object-contain" />
                                          : <span className="text-xs text-muted-foreground italic">No signature captured</span>}
                                        <span className="absolute bottom-2.5 right-3.5 text-[8.5px] font-extrabold uppercase bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded">
                                          VERIFIED DIGITAL CONSENT
                                        </span>
                                      </div>
                                    </div>

                                    <button
                                      onClick={() => handleDownloadPDF(consent)}
                                      disabled={isPdfBusy}
                                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-primary px-4 py-3 text-xs font-bold text-white shadow-soft hover:scale-[1.01] transition-transform disabled:opacity-50"
                                    >
                                      <Download className="size-4" /> Download Legal PDF
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        </section>
      )}

      {/* ── Off-screen professional PDF template ── */}
      {pdfRecord && (
        <div aria-hidden style={{ position: "absolute", left: "-9999px", top: 0 }}>
          <ConsentPDFTemplate record={pdfRecord} />
        </div>
      )}

      <Footer />
    </main>
  );
}