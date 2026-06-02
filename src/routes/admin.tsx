import { useState, useEffect, useCallback, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { getConsentsFn, deleteConsentFn } from "@/lib/consent";
import { getAppointmentsFn, deleteAppointmentFn, updateAppointmentStatusFn } from "@/lib/appointment";
import { getQueriesFn, deleteQueryFn, updateQueryStatusFn } from "@/lib/query";
import { CLINIC } from "@/lib/clinic";
import { PROCEDURES_DATA, CONSENT_TEXT } from "@/lib/consentData";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import logoImg from "@/assets/optimized/DP_Logo.webp";
import {
  Lock, KeyRound, Search, FileText, Download, Trash2, Eye,
  Calendar, CheckCircle2, ChevronUp, AlertCircle, RefreshCw,
  LayoutDashboard, MessageSquare, Clock, Users, Check, XCircle,
  ExternalLink, Mail, Phone, Activity, FileCheck, ClipboardList, CheckSquare
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
  CartesianGrid, PieChart, Pie, Cell, Legend
} from "recharts";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Doctor Admin Panel | Dental Plus Clinic Dehradun" },
      { name: "description", content: "Clinic administrative dashboard to review clinical patient consent forms, appointments, user inquiries, and download legal PDFs." },
      { property: "og:title", content: "Doctor Admin Panel | Dental Plus Clinic Dehradun" },
      { property: "og:description", content: "Clinic administrative dashboard to review clinical patient consent forms, appointments, user inquiries, and download legal PDFs." },
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

  // Detach stylesheets so html2canvas isn't confused by oklch vars
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
      *, *::before, *::after { box-sizing: border-box; }
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
        pagebreak: { mode: ["css", "legacy"] },
      } as any)
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
        boxSizing: "border-box",
        fontFamily: "'Georgia', 'Times New Roman', serif",
        padding: "18mm 14mm 16mm 14mm",
        color: "#111827",
        backgroundColor: "#ffffff",
        width: "182mm",
        fontSize: "11px",
        lineHeight: "1.55",
      }}
    >
      {/* Header band */}
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

            <td style={{ verticalAlign: "top", textAlign: "left", width: "30%" }}>
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

      {/* Title bar */}
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

      {/* Patient particulars */}
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

      {/* Medical history */}
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

      {/* Intro quote */}
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

      {/* Procedures grid */}
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

      {/* Disclaimers */}
      <div style={{ marginBottom: "18px", pageBreakInside: "avoid", breakInside: "avoid" }}>
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

      {/* Signatures */}
      <div style={{ pageBreakInside: "avoid", breakInside: "avoid" }}>
        <PDFSectionHeader label="Authorisation & Signatures / प्राधिकरण एवं हस्ताक्षर" />
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "6px" }}>
          <tbody>
            <tr>
              {/* Patient signature */}
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

              {/* Doctor panel */}
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
      </div>

      {/* Footer */}
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

function StatCard({ icon, label, value, trend }: { icon: React.ReactNode; label: string; value: React.ReactNode; trend?: string }) {
  return (
    <div className="bg-card rounded-2xl border border-border p-5 shadow-soft flex items-center gap-4 hover:shadow-card transition-all">
      <div className="size-12 rounded-xl bg-primary/10 grid place-items-center text-primary shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider truncate">{label}</div>
        <div className="font-display font-extrabold text-2xl text-navy mt-0.5">{value}</div>
        {trend && <div className="text-[10px] font-semibold text-emerald-600 mt-1 flex items-center gap-0.5">{trend}</div>}
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
  const [appointments, setAppointments] = useState<any[]>([]);
  const [queries, setQueries] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "consents" | "bookings" | "queries">("overview");

  // Search & filter states
  const [consentSearch, setConsentSearch] = useState("");
  
  const [bookingSearch, setBookingSearch] = useState("");
  const [bookingStatusFilter, setBookingStatusFilter] = useState("all");

  const [querySearch, setQuerySearch] = useState("");
  const [queryStatusFilter, setQueryStatusFilter] = useState("all");

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [pdfRecord, setPdfRecord] = useState<ConsentRecord | null>(null);
  const [isPdfBusy, setIsPdfBusy] = useState(false);

  // ── Data fetching ──
  const fetchAllData = useCallback(async (notify = false) => {
    setLoading(true);
    try {
      const [consentsData, appointmentsData, queriesData] = await Promise.all([
        getConsentsFn(),
        getAppointmentsFn(),
        getQueriesFn(),
      ]);
      setConsents(consentsData as ConsentRecord[]);
      setAppointments(appointmentsData);
      setQueries(queriesData);
      if (notify) toast.success("Clinic panel updated successfully.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to load patient records.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Restore session on mount
  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === "true") {
      setIsAuthenticated(true);
      fetchAllData();
    }
  }, [fetchAllData]);

  // ── Auth ──
  const handleUnlock = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (VALID_PINS.has(pin)) {
        setIsAuthenticated(true);
        setPinError("");
        sessionStorage.setItem(SESSION_KEY, "true");
        toast.success("Welcome, clinic administrator.");
        fetchAllData();
      } else {
        setPinError("Invalid Administrative PIN. Please try again.");
        toast.error("Incorrect PIN");
      }
    },
    [pin, fetchAllData],
  );

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    sessionStorage.removeItem(SESSION_KEY);
    setPin("");
    toast.info("Logged out from admin panel.");
  }, []);

  // ── Delete Handlers ──
  const handleDeleteConsent = useCallback(async (id: string, name: string) => {
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

  const handleDeleteAppointment = useCallback(async (id: string, name: string) => {
    if (!window.confirm(`Permanently delete appointment request for ${name}? This cannot be undone.`)) return;
    try {
      const result = await deleteAppointmentFn({ data: id });
      if (result?.success) {
        toast.success(`Appointment for ${name} deleted.`);
        setAppointments((prev) => prev.filter((a) => a.id !== id));
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete appointment.");
    }
  }, []);

  const handleDeleteQuery = useCallback(async (id: string, name: string) => {
    if (!window.confirm(`Permanently delete query from ${name}? This cannot be undone.`)) return;
    try {
      const result = await deleteQueryFn({ data: id });
      if (result?.success) {
        toast.success(`Query from ${name} deleted.`);
        setQueries((prev) => prev.filter((q) => q.id !== id));
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete query.");
    }
  }, []);

  // ── Status Updates ──
  const handleUpdateAppointmentStatus = useCallback(async (id: string, name: string, status: "pending" | "confirmed" | "completed" | "cancelled") => {
    try {
      const result = await updateAppointmentStatusFn({ data: { id, status } });
      if (result?.success) {
        toast.success(`Appointment for ${name} marked as ${status}.`);
        setAppointments((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status } : a))
        );
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status.");
    }
  }, []);

  const handleUpdateQueryStatus = useCallback(async (id: string, name: string, status: "pending" | "resolved") => {
    try {
      const result = await updateQueryStatusFn({ data: { id, status } });
      if (result?.success) {
        toast.success(`Query from ${name} marked as ${status}.`);
        setQueries((prev) =>
          prev.map((q) => (q.id === id ? { ...q, status } : q))
        );
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update query.");
    }
  }, []);

  // ── PDF Download ──
  const handleDownloadPDF = useCallback(async (record: ConsentRecord) => {
    setPdfRecord(record);
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

  // ── Derived statistics ──
  const stats = useMemo(() => {
    const todayStr = new Date().toDateString();
    return {
      totalConsents: consents.length,
      consentsToday: consents.filter((c) => new Date(c.createdAt).toDateString() === todayStr).length,
      totalBookings: appointments.length,
      bookingsToday: appointments.filter((a) => new Date(a.createdAt).toDateString() === todayStr).length,
      pendingBookings: appointments.filter((a) => a.status === "pending" || !a.status).length,
      activeQueries: queries.filter((q) => q.status === "pending" || !q.status).length,
    };
  }, [consents, appointments, queries]);

  // ── Search & Filter Logic ──
  const filteredConsents = useMemo(() => {
    return consents.filter(
      (c) =>
        c.name.toLowerCase().includes(consentSearch.toLowerCase()) ||
        c.phone.includes(consentSearch),
    );
  }, [consents, consentSearch]);

  const filteredAppointments = useMemo(() => {
    return appointments.filter((a) => {
      const matchesSearch =
        a.name.toLowerCase().includes(bookingSearch.toLowerCase()) ||
        a.phone.includes(bookingSearch) ||
        a.service.toLowerCase().includes(bookingSearch.toLowerCase());
      
      const status = a.status || "pending";
      const matchesStatus = bookingStatusFilter === "all" || status === bookingStatusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [appointments, bookingSearch, bookingStatusFilter]);

  const filteredQueries = useMemo(() => {
    return queries.filter((q) => {
      const matchesSearch =
        q.name.toLowerCase().includes(querySearch.toLowerCase()) ||
        q.phone.includes(querySearch) ||
        q.subject.toLowerCase().includes(querySearch.toLowerCase()) ||
        q.message.toLowerCase().includes(querySearch.toLowerCase());
      
      const status = q.status || "pending";
      const matchesStatus = queryStatusFilter === "all" || status === queryStatusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [queries, querySearch, queryStatusFilter]);

  // ── Recharts data preparation ──
  const chartData = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
      days.push({
        name: dateStr,
        date: d.toDateString(),
        bookings: 0,
        consents: 0,
      });
    }

    appointments.forEach((a) => {
      const createdDate = new Date(a.createdAt).toDateString();
      const match = days.find((day) => day.date === createdDate);
      if (match) match.bookings++;
    });

    consents.forEach((c) => {
      const createdDate = new Date(c.createdAt).toDateString();
      const match = days.find((day) => day.date === createdDate);
      if (match) match.consents++;
    });

    return days;
  }, [appointments, consents]);

  const treatmentPieData = useMemo(() => {
    const counts: Record<string, number> = {};
    appointments.forEach((a) => {
      counts[a.service] = (counts[a.service] || 0) + 1;
    });

    const data = Object.entries(counts).map(([name, value]) => ({ name, value }));
    return data.length > 0 ? data : [
      { name: "Consultation", value: 3 },
      { name: "Root Canal", value: 2 },
      { name: "Whitening", value: 4 },
      { name: "Implants", value: 1 },
    ];
  }, [appointments]);

  const recentActivities = useMemo(() => {
    const items: any[] = [];
    
    consents.slice(0, 4).forEach((c) => {
      items.push({
        id: `consent-${c.id}`,
        type: "consent",
        title: `Consent Signed: ${c.name}`,
        desc: `${c.selectedProcedures.length} procedures certified`,
        time: new Date(c.createdAt),
      });
    });

    appointments.slice(0, 4).forEach((a) => {
      items.push({
        id: `booking-${a.id}`,
        type: "booking",
        title: `Appointment: ${a.name}`,
        desc: `${a.service} scheduled on ${a.date}`,
        time: new Date(a.createdAt),
      });
    });

    queries.slice(0, 4).forEach((q) => {
      items.push({
        id: `query-${q.id}`,
        type: "query",
        title: `Patient Query: ${q.name}`,
        desc: q.subject,
        time: new Date(q.createdAt),
      });
    });

    return items.sort((a, b) => b.time.getTime() - a.time.getTime()).slice(0, 6);
  }, [consents, appointments, queries]);

  const PIE_COLORS = ["#0284c7", "#0d9488", "#eab308", "#f97316", "#6366f1", "#ec4899", "#84cc16"];

  return (
    <main className="min-h-screen bg-background overflow-x-hidden pt-20">
      {isPdfBusy && (
        <div className="fixed inset-0 z-[99999] bg-[#0b1b3d] flex flex-col items-center justify-center text-white gap-4 backdrop-blur-md">
          <div className="relative flex items-center justify-center">
            <div className="size-16 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
            <div className="absolute size-10 rounded-full border-4 border-b-cyan-400 border-t-transparent border-r-transparent border-l-transparent animate-spin duration-700"></div>
          </div>
          <h3 className="font-display font-bold text-lg tracking-wide animate-pulse">Generating Certified PDF...</h3>
          <p className="text-xs text-slate-300 font-medium">Compiling print layout & signature elements.</p>
        </div>
      )}
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
                    Admin Session
                  </span>
                  <h1 className="font-display font-bold text-3xl text-navy">Dental Plus Clinic Admin</h1>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Manage patient consents, bookings, WhatsApp communications, and key insights.</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => fetchAllData(true)}
                  disabled={loading}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white text-navy px-4.5 py-2.5 text-xs font-bold hover:bg-muted shadow-soft transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh Data
                </button>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 px-4.5 py-2.5 text-xs font-bold hover:bg-rose-100/70 shadow-soft transition-all"
                >
                  Lock Panel
                </button>
              </div>
            </div>

            {/* Tab navigation */}
            <div className="flex flex-wrap gap-2 border-b border-border/80 pb-1">
              <button
                onClick={() => setActiveTab("overview")}
                className={`pb-3 px-4.5 font-display font-bold text-sm transition-all border-b-2 -mb-[2px] flex items-center gap-2 ${
                  activeTab === "overview"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-navy"
                }`}
              >
                <LayoutDashboard className="size-4" /> Overview &amp; Insights
              </button>
              <button
                onClick={() => setActiveTab("consents")}
                className={`pb-3 px-4.5 font-display font-bold text-sm transition-all border-b-2 -mb-[2px] flex items-center gap-2 ${
                  activeTab === "consents"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-navy"
                }`}
              >
                <FileText className="size-4" /> Consents ({consents.length})
              </button>
              <button
                onClick={() => setActiveTab("bookings")}
                className={`pb-3 px-4.5 font-display font-bold text-sm transition-all border-b-2 -mb-[2px] flex items-center gap-2 ${
                  activeTab === "bookings"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-navy"
                }`}
              >
                <Calendar className="size-4" /> Bookings ({appointments.length})
              </button>
              <button
                onClick={() => setActiveTab("queries")}
                className={`pb-3 px-4.5 font-display font-bold text-sm transition-all border-b-2 -mb-[2px] flex items-center gap-2 ${
                  activeTab === "queries"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-navy"
                }`}
              >
                <MessageSquare className="size-4" /> Queries ({queries.length})
              </button>
            </div>

            {/* Loading Indicator */}
            {loading && (
              <div className="w-full h-1 bg-muted overflow-hidden rounded-full">
                <div className="h-full bg-primary animate-[pulse_1.5s_infinite] w-2/3 rounded-full"></div>
              </div>
            )}

            {/* TAB CONTENTS */}
            <AnimatePresence mode="wait">
              {activeTab === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-8"
                >
                  {/* Stats card grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <StatCard
                      icon={<FileText className="size-6" />}
                      label="Signed Consents"
                      value={stats.totalConsents}
                      trend={stats.consentsToday > 0 ? `+${stats.consentsToday} today` : undefined}
                    />
                    <StatCard
                      icon={<Calendar className="size-6" />}
                      label="Total Bookings"
                      value={stats.totalBookings}
                      trend={stats.bookingsToday > 0 ? `+${stats.bookingsToday} today` : undefined}
                    />
                    <StatCard
                      icon={<Clock className="size-6" />}
                      label="Pending Bookings"
                      value={`${stats.pendingBookings} slots`}
                      trend={stats.pendingBookings > 0 ? "Needs confirmation" : "All cleared"}
                    />
                    <StatCard
                      icon={<MessageSquare className="size-6" />}
                      label="Active Queries"
                      value={`${stats.activeQueries} pending`}
                      trend={stats.activeQueries > 0 ? "Follow up required" : "Zero inbox"}
                    />
                  </div>

                  {/* Charts Grid */}
                  <div className="grid lg:grid-cols-12 gap-8">
                    {/* Activity Area Chart */}
                    <div className="lg:col-span-8 bg-card border border-border shadow-soft rounded-3xl p-6">
                      <div className="mb-4">
                        <h3 className="font-display font-bold text-navy text-lg flex items-center gap-2">
                          <Activity className="size-5 text-primary" /> Traffic &amp; Submissions Trend
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">Daily overview of booking requests and clinical consents signed.</p>
                      </div>
                      <div className="h-72 w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#0284c7" stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="colorConsents" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                            <XAxis dataKey="name" tickLine={false} tick={{ fontSize: 10, fill: "#64748b" }} />
                            <YAxis tickLine={false} tick={{ fontSize: 10, fill: "#64748b" }} />
                            <Tooltip />
                            <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                            <Area name="Bookings" type="monotone" dataKey="bookings" stroke="#0284c7" strokeWidth={2.5} fillOpacity={1} fill="url(#colorBookings)" />
                            <Area name="Consents" type="monotone" dataKey="consents" stroke="#0d9488" strokeWidth={2.5} fillOpacity={1} fill="url(#colorConsents)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Service Pie Chart */}
                    <div className="lg:col-span-4 bg-card border border-border shadow-soft rounded-3xl p-6 flex flex-col">
                      <div className="mb-4">
                        <h3 className="font-display font-bold text-navy text-lg flex items-center gap-2">
                          <ClipboardList className="size-5 text-primary" /> Service Distribution
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">Distribution of dental treatment booking requests.</p>
                      </div>
                      <div className="h-48 w-full relative flex-1 mt-2">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={treatmentPieData}
                              cx="50%"
                              cy="50%"
                              innerRadius={55}
                              outerRadius={75}
                              paddingAngle={4}
                              dataKey="value"
                            >
                              {treatmentPieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-4 text-[10.5px] font-bold text-navy/95 border-t border-border pt-4">
                        {treatmentPieData.map((entry, index) => (
                          <div key={entry.name} className="flex items-center gap-1.5 truncate">
                            <span className="size-2.5 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }} />
                            <span className="truncate">{entry.name}: <span className="text-muted-foreground">{entry.value}</span></span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity Timeline & Clinic Checklist */}
                  <div className="grid lg:grid-cols-12 gap-8">
                    {/* Activity Feed */}
                    <div className="lg:col-span-7 bg-card border border-border shadow-soft rounded-3xl p-6">
                      <h3 className="font-display font-bold text-navy text-lg mb-6 flex items-center gap-2">
                        <Activity className="size-5 text-primary" /> Live Audit Log &amp; Stream
                      </h3>
                      <div className="space-y-6 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-border/60">
                        {recentActivities.length === 0 ? (
                          <div className="py-8 text-center text-xs text-muted-foreground font-semibold">No recent activity detected.</div>
                        ) : (
                          recentActivities.map((act) => (
                            <div key={act.id} className="flex items-start gap-4 relative">
                              <div className={`size-6 rounded-full grid place-items-center text-white shrink-0 relative z-10 ${
                                act.type === "consent" ? "bg-teal-500" : act.type === "booking" ? "bg-sky-500" : "bg-indigo-500"
                              }`}>
                                {act.type === "consent" ? <FileCheck className="size-3.5" /> : act.type === "booking" ? <Calendar className="size-3" /> : <MessageSquare className="size-3" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-4">
                                  <h4 className="font-semibold text-sm text-navy truncate">{act.title}</h4>
                                  <span className="text-[10px] font-medium text-muted-foreground shrink-0">
                                    {new Date(act.time).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                                  </span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5 truncate">{act.desc}</p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Dr. Quick Reminders Info */}
                    <div className="lg:col-span-5 bg-card border border-border shadow-soft rounded-3xl p-6">
                      <h3 className="font-display font-bold text-navy text-lg mb-4 flex items-center gap-2">
                        <Users className="size-5 text-primary" /> Clinic Coordinator Checklist
                      </h3>
                      <div className="space-y-3.5 text-sm text-navy">
                        <div className="p-3 bg-sky-50/50 border border-sky-100 rounded-xl flex items-start gap-3">
                          <CheckSquare className="size-4.5 text-sky-600 shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-bold text-xs text-sky-800 uppercase tracking-wider">Confirm Booking Requests</h4>
                            <p className="text-xs text-sky-700/90 mt-0.5">Use the Bookings tab to review slot dates and notify patients instantly via WhatsApp.</p>
                          </div>
                        </div>
                        <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-xl flex items-start gap-3">
                          <AlertCircle className="size-4.5 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-bold text-xs text-amber-800 uppercase tracking-wider">Pending Patient Inquiries</h4>
                            <p className="text-xs text-amber-700/90 mt-0.5">Check for unresolved patient questions. Follow up to secure dental restoration visits.</p>
                          </div>
                        </div>
                        <div className="p-3 bg-teal-50/50 border border-teal-100 rounded-xl flex items-start gap-3">
                          <CheckCircle2 className="size-4.5 text-teal-600 shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-bold text-xs text-teal-800 uppercase tracking-wider">Print Consent PDFs</h4>
                            <p className="text-xs text-teal-700/90 mt-0.5">Review, download, and archive signed patient consent forms for surgical and restoration history.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "consents" && (
                /* ── CONSENTS TAB ── */
                <motion.div
                  key="consents"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  {/* Search */}
                  <div className="bg-card rounded-2xl border border-border p-4.5 shadow-soft flex items-center gap-3">
                    <Search className="size-5 text-muted-foreground shrink-0 ml-1.5" />
                    <input
                      type="text"
                      value={consentSearch}
                      onChange={(e) => setConsentSearch(e.target.value)}
                      placeholder="Search consents by patient name or phone number…"
                      className="w-full border-none outline-none bg-transparent text-sm text-navy placeholder:text-muted-foreground/75 font-medium"
                    />
                    {consentSearch && (
                      <button onClick={() => setConsentSearch("")} className="text-xs font-bold text-primary hover:text-navy p-1">
                        Clear
                      </button>
                    )}
                  </div>

                  {/* Consents list/table */}
                  <div className="bg-card rounded-3xl border border-border shadow-card overflow-hidden">
                    {filteredConsents.length === 0 ? (
                      <div className="py-20 text-center space-y-2">
                        <AlertCircle className="size-12 text-muted-foreground/60 mx-auto" />
                        <h3 className="font-bold text-navy text-lg">No patient consent forms found</h3>
                        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                          {consentSearch ? "No records match your search filter." : "Signed consent forms will appear here."}
                        </p>
                      </div>
                    ) : (
                      <div className="divide-y divide-border/60">
                        {/* Desktop Header */}
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
                              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center px-6 py-5 text-navy">
                                {/* Particulars */}
                                <div className="col-span-1 md:col-span-3 flex items-center gap-2.5">
                                  <div className="size-9 rounded-full bg-primary/10 grid place-items-center text-primary font-bold text-sm shrink-0">
                                    {consent.name.charAt(0).toUpperCase()}
                                  </div>
                                  <div className="truncate">
                                    <h4 className="font-semibold text-sm leading-tight truncate">{consent.name}</h4>
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

                                {/* Treatments */}
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
                                    title={isExpanded ? "Collapse" : "Expand details"}
                                    className="size-9 border border-border bg-white text-navy hover:bg-muted shadow-soft rounded-lg grid place-items-center transition-colors"
                                  >
                                    {isExpanded ? <ChevronUp className="size-4" /> : <Eye className="size-4" />}
                                  </button>
                                  <button
                                    onClick={() => handleDeleteConsent(consent.id, consent.name)}
                                    title="Delete consent record"
                                    className="size-9 bg-rose-50 border border-rose-100 text-rose-500 hover:bg-rose-100/60 shadow-soft rounded-lg grid place-items-center transition-colors"
                                  >
                                    <Trash2 className="size-4" />
                                  </button>
                                </div>
                              </div>

                              {/* Expanded Panel */}
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
                </motion.div>
              )}

              {activeTab === "bookings" && (
                /* ── BOOKINGS TAB ── */
                <motion.div
                  key="bookings"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  {/* Search and filter row */}
                  <div className="flex flex-col md:flex-row gap-4 items-center bg-card rounded-2xl border border-border p-4.5 shadow-soft">
                    <div className="flex-1 w-full flex items-center gap-3">
                      <Search className="size-5 text-muted-foreground shrink-0 ml-1.5" />
                      <input
                        type="text"
                        value={bookingSearch}
                        onChange={(e) => setBookingSearch(e.target.value)}
                        placeholder="Search bookings by name, phone, or service…"
                        className="w-full border-none outline-none bg-transparent text-sm text-navy placeholder:text-muted-foreground/75 font-medium"
                      />
                      {bookingSearch && (
                        <button onClick={() => setBookingSearch("")} className="text-xs font-bold text-primary hover:text-navy p-1">
                          Clear
                        </button>
                      )}
                    </div>
                    <div className="flex gap-1.5 w-full md:w-auto shrink-0 overflow-x-auto pb-1 md:pb-0">
                      {["all", "pending", "confirmed", "completed", "cancelled"].map((st) => (
                        <button
                          key={st}
                          onClick={() => setBookingStatusFilter(st)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all border ${
                            bookingStatusFilter === st
                              ? "bg-primary text-white border-primary"
                              : "bg-white text-navy border-border hover:bg-muted"
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Bookings List */}
                  <div className="bg-card rounded-3xl border border-border shadow-card overflow-hidden">
                    {filteredAppointments.length === 0 ? (
                      <div className="py-20 text-center space-y-2">
                        <AlertCircle className="size-12 text-muted-foreground/60 mx-auto" />
                        <h3 className="font-bold text-navy text-lg">No appointments found</h3>
                        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                          {bookingSearch || bookingStatusFilter !== "all"
                            ? "No appointments match your filters."
                            : "Patient bookings submitted through the booking scheduler will appear here."}
                        </p>
                      </div>
                    ) : (
                      <div className="divide-y divide-border/60">
                        {/* Desktop Header */}
                        <div className="hidden lg:grid grid-cols-12 gap-4 bg-secondary/50 px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-navy border-b border-border/80">
                          <div className="col-span-3">Patient Particulars</div>
                          <div className="col-span-3">Schedule Date &amp; Slot</div>
                          <div className="col-span-2">Required Service</div>
                          <div className="col-span-2">Status</div>
                          <div className="col-span-2 text-right">Actions</div>
                        </div>

                        {filteredAppointments.map((booking) => {
                          const status = booking.status || "pending";
                          const dateCreated = new Date(booking.createdAt || Date.now()).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
                          const statusColors = {
                            pending: "bg-amber-50 text-amber-700 border-amber-200",
                            confirmed: "bg-blue-50 text-blue-700 border-blue-200",
                            completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
                            cancelled: "bg-rose-50 text-rose-700 border-rose-200",
                          }[status as "pending" | "confirmed" | "completed" | "cancelled"];

                          const whatsappText = `Hi ${booking.name}, this is Dental Plus Clinic Dehradun. Regarding your appointment request for a *${booking.service}* on *${booking.date}* at *${booking.slot}*: We would love to confirm this slot for you! Please let us know if you are ready.`;
                          const whatsappUrl = `https://wa.me/${booking.phone.replace(/\s+/g, "")}?text=${encodeURIComponent(whatsappText)}`;

                          return (
                            <div key={booking.id} className="transition-all hover:bg-secondary/15 p-5 lg:p-0">
                              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center lg:px-6 lg:py-5 text-navy">
                                {/* Particulars */}
                                <div className="col-span-1 lg:col-span-3 flex items-center gap-2.5">
                                  <div className="size-9 rounded-full bg-primary/10 grid place-items-center text-primary font-bold text-sm shrink-0">
                                    {booking.name.charAt(0).toUpperCase()}
                                  </div>
                                  <div className="truncate">
                                    <h4 className="font-semibold text-sm leading-tight truncate">{booking.name}</h4>
                                    <span className="text-[10px] text-muted-foreground font-semibold mt-1 inline-block">
                                      Registered: {dateCreated}
                                    </span>
                                  </div>
                                </div>

                                {/* Schedule & Date */}
                                <div className="col-span-1 lg:col-span-3 text-xs sm:text-sm text-navy/90 flex flex-col gap-1">
                                  <div className="flex items-center gap-1.5 font-semibold">
                                    <Calendar className="size-3.5 text-primary shrink-0" />
                                    <span>{booking.date}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5 font-semibold text-muted-foreground">
                                    <Clock className="size-3.5 text-primary/75 shrink-0" />
                                    <span>{booking.slot}</span>
                                  </div>
                                </div>

                                {/* Service */}
                                <div className="col-span-1 lg:col-span-2">
                                  <span className="lg:hidden text-xs font-bold uppercase text-navy/70 shrink-0 w-24 block mb-1">Service:</span>
                                  <span className="text-xs font-bold bg-navy/5 text-navy border border-border px-2.5 py-1 rounded-full inline-block">
                                    {booking.service}
                                  </span>
                                </div>

                                {/* Status */}
                                <div className="col-span-1 lg:col-span-2">
                                  <span className="lg:hidden text-xs font-bold uppercase text-navy/70 shrink-0 w-24 block mb-1">Status:</span>
                                  <span className={`text-[10.5px] font-bold border px-2.5 py-0.5 rounded-full inline-block uppercase tracking-wide ${statusColors}`}>
                                    {status}
                                  </span>
                                </div>

                                {/* Actions */}
                                <div className="col-span-1 lg:col-span-2 flex flex-wrap justify-end gap-1.5 pt-3 lg:pt-0 border-t border-dashed border-border/80 lg:border-none">
                                  {status === "pending" && (
                                    <>
                                      <button
                                        onClick={() => handleUpdateAppointmentStatus(booking.id, booking.name, "confirmed")}
                                        title="Confirm Appointment"
                                        className="h-8 px-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center text-xs font-bold gap-1 shadow-soft"
                                      >
                                        <Check className="size-3.5" /> Confirm
                                      </button>
                                      <button
                                        onClick={() => handleUpdateAppointmentStatus(booking.id, booking.name, "cancelled")}
                                        title="Cancel Appointment"
                                        className="h-8 px-2.5 bg-rose-50 border border-rose-100 text-rose-500 hover:bg-rose-100/50 rounded-lg flex items-center justify-center text-xs font-bold gap-1"
                                      >
                                        <XCircle className="size-3.5" /> Cancel
                                      </button>
                                    </>
                                  )}

                                  {status === "confirmed" && (
                                    <>
                                      <button
                                        onClick={() => handleUpdateAppointmentStatus(booking.id, booking.name, "completed")}
                                        title="Mark as Completed"
                                        className="h-8 px-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg flex items-center justify-center text-xs font-bold gap-1 shadow-soft"
                                      >
                                        <Check className="size-3.5" /> Complete
                                      </button>
                                      <button
                                        onClick={() => handleUpdateAppointmentStatus(booking.id, booking.name, "cancelled")}
                                        title="Cancel Appointment"
                                        className="h-8 px-2.5 bg-rose-50 border border-rose-100 text-rose-500 hover:bg-rose-100/50 rounded-lg flex items-center justify-center text-xs font-bold gap-1"
                                      >
                                        <XCircle className="size-3.5" /> Cancel
                                      </button>
                                    </>
                                  )}

                                  {(status === "completed" || status === "cancelled") && (
                                    <button
                                      onClick={() => handleUpdateAppointmentStatus(booking.id, booking.name, "pending")}
                                      className="h-8 px-2 bg-white border border-border text-navy text-xs font-bold rounded-lg"
                                    >
                                      Reset
                                    </button>
                                  )}

                                  <a
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="Open WhatsApp chat with prefilled message"
                                    className="size-8 bg-whatsapp text-white hover:opacity-95 shadow-soft rounded-lg grid place-items-center shrink-0"
                                  >
                                    <Phone className="size-3.5 fill-white text-whatsapp" />
                                  </a>

                                  <button
                                    onClick={() => handleDeleteAppointment(booking.id, booking.name)}
                                    title="Delete appointment"
                                    className="size-8 bg-rose-50 border border-rose-100 text-rose-500 hover:bg-rose-100/60 shadow-soft rounded-lg grid place-items-center shrink-0"
                                  >
                                    <Trash2 className="size-3.5" />
                                  </button>
                                </div>
                              </div>

                              {/* Booking Notes/Message (if present) */}
                              {booking.message && (
                                <div className="lg:pl-16 lg:pb-4 lg:pr-6 text-xs text-muted-foreground -mt-2.5">
                                  <div className="bg-secondary/40 border border-border/60 rounded-xl p-2.5 inline-block max-w-lg">
                                    <strong className="text-navy/70">Patient Note:</strong> "{booking.message}"
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === "queries" && (
                /* ── QUERIES TAB ── */
                <motion.div
                  key="queries"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  {/* Search and filter row */}
                  <div className="flex flex-col md:flex-row gap-4 items-center bg-card rounded-2xl border border-border p-4.5 shadow-soft">
                    <div className="flex-1 w-full flex items-center gap-3">
                      <Search className="size-5 text-muted-foreground shrink-0 ml-1.5" />
                      <input
                        type="text"
                        value={querySearch}
                        onChange={(e) => setQuerySearch(e.target.value)}
                        placeholder="Search queries by name, subject, message content…"
                        className="w-full border-none outline-none bg-transparent text-sm text-navy placeholder:text-muted-foreground/75 font-medium"
                      />
                      {querySearch && (
                        <button onClick={() => setQuerySearch("")} className="text-xs font-bold text-primary hover:text-navy p-1">
                          Clear
                        </button>
                      )}
                    </div>
                    <div className="flex gap-1.5 w-full md:w-auto shrink-0">
                      {["all", "pending", "resolved"].map((st) => (
                        <button
                          key={st}
                          onClick={() => setQueryStatusFilter(st)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all border ${
                            queryStatusFilter === st
                              ? "bg-primary text-white border-primary"
                              : "bg-white text-navy border-border hover:bg-muted"
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Queries list */}
                  <div className="space-y-4">
                    {filteredQueries.length === 0 ? (
                      <div className="bg-card rounded-3xl border border-border shadow-card py-20 text-center space-y-2">
                        <AlertCircle className="size-12 text-muted-foreground/60 mx-auto" />
                        <h3 className="font-bold text-navy text-lg">No patient queries found</h3>
                        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                          {querySearch || queryStatusFilter !== "all"
                            ? "No contact submissions match your filters."
                            : "Patient inquiries submitted through the contact page form will appear here."}
                        </p>
                      </div>
                    ) : (
                      filteredQueries.map((query) => {
                        const status = query.status || "pending";
                        const dateFormatted = new Date(query.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

                        const whatsappResponse = `Hi ${query.name}, this is Dental Plus Clinic. Regarding your query about *"${query.subject}"*: `;
                        const whatsappUrl = `https://wa.me/${query.phone.replace(/\s+/g, "")}?text=${encodeURIComponent(whatsappResponse)}`;

                        return (
                          <div
                            key={query.id}
                            className={`bg-card rounded-2xl border p-5 sm:p-6 shadow-soft transition-all hover:shadow-card flex flex-col md:flex-row md:items-start gap-4 relative overflow-hidden ${
                              status === "resolved" ? "border-emerald-100 bg-emerald-50/10" : "border-border"
                            }`}
                          >
                            {/* Left Badge Indicator */}
                            <div className={`absolute top-0 left-0 w-1.5 h-full ${
                              status === "resolved" ? "bg-emerald-500" : "bg-amber-400"
                            }`} />

                            {/* Particulars & Message */}
                            <div className="flex-1 space-y-3.5">
                              <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                  <h4 className="font-display font-bold text-navy text-base">{query.name}</h4>
                                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground font-semibold mt-1">
                                    <span className="flex items-center gap-1"><Phone className="size-3.5" /> {query.phone}</span>
                                    {query.email && <span className="flex items-center gap-1"><Mail className="size-3.5" /> {query.email}</span>}
                                    <span className="text-muted-foreground/60">| {dateFormatted}</span>
                                  </div>
                                </div>
                                <span className={`text-[10px] font-bold border px-2.5 py-0.5 rounded-md uppercase tracking-wider ${
                                  status === "resolved"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : "bg-amber-50 text-amber-700 border-amber-200"
                                }`}>
                                  {status}
                                </span>
                              </div>

                              <div className="border border-border/80 rounded-xl bg-white/70 p-4 font-semibold text-navy/95 shadow-inner">
                                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Subject: {query.subject}</div>
                                <div className="text-sm font-medium leading-relaxed font-sans mt-1.5 whitespace-pre-line">
                                  "{query.message}"
                                </div>
                              </div>
                            </div>

                            {/* Action Buttons Right */}
                            <div className="flex md:flex-col justify-end items-stretch gap-2 shrink-0 border-t border-dashed border-border/60 md:border-t-0 pt-4.5 md:pt-0">
                              {status === "pending" ? (
                                <button
                                  onClick={() => handleUpdateQueryStatus(query.id, query.name, "resolved")}
                                  className="h-9 px-4.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-soft transition-colors"
                                >
                                  <Check className="size-4" /> Mark Resolved
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleUpdateQueryStatus(query.id, query.name, "pending")}
                                  className="h-9 px-4.5 border border-border bg-white text-navy hover:bg-muted rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                                >
                                  Reset Status
                                </button>
                              )}

                              <div className="flex gap-2">
                                <a
                                  href={whatsappUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-1 h-9 bg-whatsapp hover:opacity-95 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-soft"
                                >
                                  <Phone className="size-3.5 fill-white text-whatsapp" /> Chat
                                </a>
                                {query.email && (
                                  <a
                                    href={`mailto:${query.email}?subject=Re: ${encodeURIComponent(query.subject)}`}
                                    className="size-9 bg-sky-50 border border-sky-100 hover:bg-sky-100/60 text-sky-600 rounded-xl grid place-items-center"
                                  >
                                    <Mail className="size-4" />
                                  </a>
                                )}
                                <button
                                  onClick={() => handleDeleteQuery(query.id, query.name)}
                                  className="size-9 bg-rose-50 border border-rose-100 hover:bg-rose-100/60 text-rose-500 rounded-xl grid place-items-center"
                                >
                                  <Trash2 className="size-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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