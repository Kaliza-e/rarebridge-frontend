import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DISEASES, fetchDiseasesFromAPI } from "../data";
import { ZebraEmptyState, OrganicWavyLine, ZebraGridDoodle } from "../components/common/Visuals";
import { generateDiseasePDF } from "../utils/pdf-generator";
import { LinkifiedText, RichTextRunsRenderer } from "../utils/link-helper";
import {
  ArrowLeft,
  Download,
  BookOpen,
  Stethoscope,
  Microscope,
  Activity,
  HelpCircle,
  FlaskConical,
  Lightbulb,
  HeartPulse,
  Building2,
  CheckCircle,
  ExternalLink,
  MapPin,
  Mail,
  ShieldAlert,
  FileText,
  UserCheck,
  Dna,
  Info,
  ChevronDown,
  ChevronUp,
  Clock,
  Star,
  Layers,
  FileCheck,
  Droplets,
  Zap,
  Sparkles,
  Users,
} from "lucide-react";

type DiseasePageProps = {
  diseaseId: string;
  onBack: () => void;
};

function ContentNodeRenderer({ nodes }: { nodes?: any[] }) {
  if (!nodes || !Array.isArray(nodes) || nodes.length === 0) return null;

  return (
    <div className="space-y-3">
      {nodes.map((node, idx) => {
        if (!node) return null;

        if (node.type === "section" || node.type === "subsection") {
          return (
            <div key={idx} className="rounded-xl border-2 border-[#E7E2CE] bg-[#F5F4F0] p-5 space-y-3">
              {node.title && (
                <h3 className="font-heading font-black text-base text-[#112250] flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-[#112250]" />
                  <RichTextRunsRenderer runs={node.title} />
                </h3>
              )}
              {node.content && (
                <p className="text-xs text-[#112250] font-medium leading-relaxed">
                  <RichTextRunsRenderer runs={node.content} />
                </p>
              )}
              {Array.isArray(node.children) && node.children.length > 0 && (
                <div className="pl-3 border-l-2 border-[#E7E2CE]">
                  <ContentNodeRenderer nodes={node.children} />
                </div>
              )}
            </div>
          );
        }

        if (node.type === "bullet") {
          return (
            <div key={idx} className="flex items-start gap-2 text-xs text-[#112250] font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-[#112250] mt-1.5 shrink-0" />
              <span><RichTextRunsRenderer runs={node.content} /></span>
            </div>
          );
        }

        if (node.type === "numbered") {
          return (
            <div key={idx} className="flex items-start gap-2 text-xs text-[#112250] font-medium">
              <span className="font-bold text-[#112250] shrink-0">{idx + 1}.</span>
              <span><RichTextRunsRenderer runs={node.content} /></span>
            </div>
          );
        }

        return (
          <div key={idx} className="text-xs font-medium text-[#112250] leading-relaxed">
            <RichTextRunsRenderer runs={node.content} />
          </div>
        );
      })}
    </div>
  );
}

export default function DiseasePage({ diseaseId, onBack }: DiseasePageProps) {
  const [disease, setDisease] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "symptoms"
    | "causes"
    | "types"
    | "diagnosis"
    | "treatments"
    | "lifestyle"
    | "community"
    | "faqs"
    | "myths"
    | "specialists"
    | "sources"
  >("overview");

  // State for FAQ accordion toggle
  const [openFaqIndices, setOpenFaqIndices] = useState<Record<number, boolean>>({});

  // State for Parse Completeness Report collapsible debug panel
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadDetail() {
      setLoading(true);
      try {
        const allDiseases = await fetchDiseasesFromAPI();
        if (cancelled) return;

        const found = (allDiseases && allDiseases.length > 0 ? allDiseases : DISEASES).find(
          (d: any) =>
            d.id === diseaseId ||
            d.diseaseNumber === diseaseId ||
            d.name?.toLowerCase() === diseaseId?.toLowerCase()
        );

        if (found) {
          setDisease(found);
        } else {
          const local = DISEASES.find(
            (d) =>
              d.id === diseaseId ||
              d.name?.toLowerCase() === diseaseId?.toLowerCase()
          );
          setDisease(local || DISEASES[0]);
        }
      } catch (err) {
        console.error("Failed to load disease detail:", err);
        const local = DISEASES.find(
          (d) =>
            d.id === diseaseId ||
            d.name?.toLowerCase() === diseaseId?.toLowerCase()
        );
        setDisease(local || DISEASES[0]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadDetail();

    return () => {
      cancelled = true;
    };
  }, [diseaseId]);

  // Safe extractors & content availability checks (safe for null disease)
  const causesList = disease && Array.isArray(disease.causesStructured) && disease.causesStructured.length > 0
    ? disease.causesStructured
    : (disease && typeof disease.causes === "object" && disease.causes !== null
        ? Object.entries(disease.causes).map(([key, val]) => ({ title: `${key.toUpperCase()} CAUSE`, explanation: String(val) }))
        : (disease && typeof disease.causes === "string" && disease.causes.trim()
            ? [{ title: "Primary Causes & Genetic Inheritance", explanation: disease.causes }]
            : []));

  const typesList = disease && Array.isArray(disease.typesStructured) && disease.typesStructured.length > 0
    ? disease.typesStructured
    : (disease && Array.isArray(disease.types) && disease.types.length > 0
        ? disease.types.map((t: any) => ({
            title: t.type || t.name || t.title || "Subtype",
            description: t.description || (t.symptoms ? `Symptoms: ${t.symptoms.join(", ")}` : "Clinical form"),
            stage: t.stage,
            severity: t.severity
          }))
        : (disease?.typesAndSymptomsRaw
            ? disease.typesAndSymptomsRaw.split(/\r?\n|•/).map((l: string) => l.trim()).filter(Boolean).map((line: string) => {
                const colon = line.indexOf(':');
                return colon > 0
                  ? { title: line.substring(0, colon).trim(), description: line.substring(colon + 1).trim() }
                  : { title: "Subtype / Clinical Form", description: line };
              })
            : (disease && Array.isArray(disease.typesAndSymptoms) && disease.typesAndSymptoms.length > 0
                ? disease.typesAndSymptoms.map((s: string) => {
                    const colon = s.indexOf(':');
                    return colon > 0
                      ? { title: s.substring(0, colon).trim(), description: s.substring(colon + 1).trim() }
                      : { title: "Subtype / Clinical Form", description: s };
                  })
                : [])));

  const symptomsList = disease && Array.isArray(disease.symptomsStructured) && disease.symptomsStructured.length > 0
    ? disease.symptomsStructured
    : (disease && Array.isArray(disease.typesAndSymptoms) && disease.typesAndSymptoms.length > 0
        ? disease.typesAndSymptoms.map((s: string) => ({ name: s }))
        : (disease && Array.isArray(disease.symptoms) && disease.symptoms.length > 0
            ? disease.symptoms.map((s: string) => ({ name: s }))
            : []));

  const diagnosticSteps = disease && Array.isArray(disease.diagnosis) && disease.diagnosis.length > 0
    ? disease.diagnosis
    : (disease?.diagnosticSteps || []);

  const researchList = disease && Array.isArray(disease.treatmentsAndPharma) && disease.treatmentsAndPharma.length > 0
    ? disease.treatmentsAndPharma
    : (disease && Array.isArray(disease.research) ? disease.research : []);

  const faqsList = disease && Array.isArray(disease.faqs) && disease.faqs.length > 0
    ? disease.faqs
    : (disease && Array.isArray(disease.faq) ? disease.faq : []);

  const mythsList = disease && Array.isArray(disease.factsMyths) && disease.factsMyths.length > 0
    ? disease.factsMyths
    : (disease && Array.isArray(disease.myths) ? disease.myths : []);

  const specialistsList = disease && Array.isArray(disease.specialists) && disease.specialists.length > 0
    ? disease.specialists
    : [];

  const sourcesList = disease && Array.isArray(disease.sources) && disease.sources.length > 0
    ? disease.sources
    : (disease && Array.isArray(disease.links) ? disease.links : []);

  const uncategorizedList = disease && Array.isArray(disease.uncategorizedContent) ? disease.uncategorizedContent : [];

  const hasOverview = Boolean(disease?.overview || disease?.shortDesc);
  const hasSymptoms = symptomsList.length > 0;
  const hasCauses = causesList.length > 0;
  const hasTypes = typesList.length > 0;
  const hasDiagnosis = diagnosticSteps.length > 0;
  const hasTreatments = researchList.length > 0;
  const hasLifestyle = Boolean(
    disease?.lifestyleAndDailySupport && (
      (Array.isArray(disease.lifestyleAndDailySupport.therapies) && disease.lifestyleAndDailySupport.therapies.length > 0) ||
      (disease.lifestyleAndDailySupport.nutrition && String(disease.lifestyleAndDailySupport.nutrition).trim()) ||
      (Array.isArray(disease.lifestyleAndDailySupport.devices) && disease.lifestyleAndDailySupport.devices.length > 0) ||
      (Array.isArray(disease.lifestyleAndDailySupport.caregiverTips) && disease.lifestyleAndDailySupport.caregiverTips.length > 0) ||
      (disease.lifestyleAndDailySupport.raw && String(disease.lifestyleAndDailySupport.raw).trim()) ||
      (disease.lifestyleAndDailySupportRaw && String(disease.lifestyleAndDailySupportRaw).trim()) ||
      (typeof disease.lifestyleAndDailySupport === "string" && disease.lifestyleAndDailySupport.trim())
    )
  );
  const hasCommunity = Boolean(disease?.lifestyleAndDailySupport?.community || disease?.community);
  const hasFaqs = faqsList.length > 0;
  const hasMyths = mythsList.length > 0;
  const hasSpecialists = specialistsList.length > 0;
  const hasSources = sourcesList.length > 0;

  const diseaseFirstName = disease?.name ? disease.name.split(" ")[0] : "Condition";

  const allTabs = [
    { id: "overview", label: "Overview", icon: BookOpen, show: hasOverview },
    { id: "symptoms", label: "Symptoms", icon: Activity, show: hasSymptoms },
    { id: "causes", label: "Causes & Risk Factors", icon: Microscope, show: hasCauses },
    { id: "types", label: "Types", icon: Layers, show: hasTypes },
    { id: "diagnosis", label: "Diagnosis", icon: FileText, show: hasDiagnosis },
    { id: "treatments", label: "Treatment & Management", icon: FlaskConical, show: hasTreatments },
    { id: "lifestyle", label: `Living with ${diseaseFirstName}`, icon: HeartPulse, show: hasLifestyle },
    { id: "community", label: "Community", icon: Users, show: hasCommunity },
    { id: "faqs", label: "FAQs", icon: HelpCircle, show: hasFaqs },
    { id: "myths", label: "Facts vs. Myths", icon: Lightbulb, show: hasMyths },
    { id: "specialists", label: "Specialists", icon: Stethoscope, show: hasSpecialists },
    { id: "sources", label: "Sources & Links", icon: ExternalLink, show: hasSources },
  ];

  const tabs = allTabs.filter((t) => t.show);

  // Hook #7: Reset activeTab if current activeTab is hidden
  useEffect(() => {
    if (disease && tabs.length > 0 && !tabs.some((t) => t.id === activeTab)) {
      setActiveTab(tabs[0].id as any);
    }
  }, [disease, activeTab, tabs]);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndices((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center bg-[#F5F4F0] p-8 text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#112250] border-t-transparent mb-4" />
        <p className="text-base font-bold text-[#3B507D]">Loading disease information...</p>
      </div>
    );
  }

  if (!disease) {
    return (
      <div className="min-h-screen bg-[#F5F4F0] px-6 py-16 text-center">
        <ZebraEmptyState message="Condition not found" sub="The condition you are looking for could not be loaded." />
        <button
          onClick={onBack}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#112250] px-6 py-3.5 font-bold text-white hover:bg-[#3B507D] transition-all"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Disease Directory
        </button>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen bg-transparent pb-24 text-[#112250] selection:bg-[#E7E2CE] selection:text-[#112250] overflow-hidden">
      <OrganicWavyLine side="left" />
      <OrganicWavyLine side="right" />

      {/* ================= BREADCRUMBS & TOP BAR ================= */}
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-xs font-semibold text-[#3B507D] mb-4">
          <button onClick={onBack} className="hover:text-[#112250] hover:underline">
            Diseases
          </button>
          <span>&gt;</span>
          <span className="text-[#112250] font-bold">{disease.name}</span>
        </nav>
      </div>

      {/* ================= HEADER HERO BANNER ================= */}
      <section className="relative overflow-hidden bg-transparent pt-2 pb-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-xl border-2 border-[#E7E2CE] bg-[#F5F8FF] p-6 sm:p-8 lg:p-10 shadow-xs"
          >
            <ZebraGridDoodle opacity={0.12} />
            {/* Soft Background Illustration Image */}
            <img
              src="/rarebridge_hero_child.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute -right-6 -bottom-8 h-64 w-64 object-contain opacity-20 hidden md:block"
            />

            <div className="relative z-10 grid gap-6 lg:grid-cols-12 lg:items-center">
              {/* Left Column: Icon + Header Details */}
              <div className="lg:col-span-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#E0EBFB] text-[#112250] border border-[#BFD5F8] shadow-xs">
                    <Dna className="h-9 w-9 text-[#112250]" />
                  </div>
                  <div>
                    <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-[#112250]">
                      {disease.name}
                    </h1>
                    <p className="mt-1.5 text-sm sm:text-base font-medium text-[#3B507D] leading-relaxed max-w-2xl">
                      {disease.shortDesc || (typeof disease.overview === "string" ? disease.overview : (disease.overview?.simple || disease.overview?.medical))}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-4">
                  {disease.category && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-bold text-[#112250] border border-[#E7E2CE] shadow-2xs">
                      <Dna className="h-3.5 w-3.5 text-[#3B507D]" />
                      <span>{disease.category}</span>
                    </span>
                  )}
                  {Array.isArray(disease.categoryBadges) &&
                    disease.categoryBadges.map((badge: string, idx: number) => {
                      if (badge.toLowerCase() === disease.category?.toLowerCase()) return null;
                      return (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-bold text-[#112250] border border-[#E7E2CE] shadow-2xs"
                        >
                          <Star className="h-3.5 w-3.5 text-[#3B507D]" />
                          <span>{badge}</span>
                        </span>
                      );
                    })}
                  {disease.inheritancePattern && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E7E2CE]/70 px-3.5 py-1.5 text-xs font-bold text-[#112250]">
                      Inheritance: {disease.inheritancePattern}
                    </span>
                  )}
                </div>
              </div>

              {/* Right Column: Zebra Artwork & PDF Action */}
              <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center gap-4">
                <div className="relative flex items-center gap-3 rounded-2xl bg-white/90 p-4 border border-[#E7E2CE] shadow-xs">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#E7E2CE]">
                    <img
                      src="/rarebridge_hero_child.png"
                      alt="RareBridge Support"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="rounded-lg bg-[#112250] px-2.5 py-1 text-[11px] font-bold text-white shadow-2xs inline-block">
                      More awareness, more hope ❤️
                    </div>
                    <p className="mt-1 text-xs text-[#3B507D] font-semibold">RareBridge Rare Disease Support</p>
                  </div>
                </div>

                <button
                  onClick={() => generateDiseasePDF(disease)}
                  className="inline-flex w-full lg:w-auto items-center justify-center gap-2 rounded-xl bg-[#112250] px-6 py-3 text-sm font-bold text-white hover:bg-[#3B507D] transition-all shadow-sm"
                >
                  <Download className="h-4 w-4 text-white" />
                  <span>Download Family Guide (PDF)</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= STICKY TAB NAVIGATION ================= */}
      {tabs.length > 0 && (
        <section className="sticky top-[76px] z-30 relative overflow-hidden bg-[#F8F7F2]/90 backdrop-blur-md py-2 border-y border-[#E7E2CE]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
              {tabs.map((tab) => {
                const IconComp = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`inline-flex shrink-0 items-center gap-2 px-4 py-2.5 text-xs transition-all ${
                      isActive
                        ? "border-b-2 border-[#112250] text-[#112250] bg-white rounded-t-lg font-black shadow-2xs"
                        : "border-b-2 border-transparent text-[#3B507D] font-bold hover:text-[#112250] hover:border-[#E7E2CE]"
                    }`}
                  >
                    <IconComp className={`h-4 w-4 ${isActive ? "text-[#112250]" : "text-[#3B507D]"}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ================= MAIN CONTENT GRID (8-COL MAIN / 4-COL SIDEBAR) ================= */}
      <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-12">
          {/* ================= LEFT MAIN CONTENT COLUMN (8 COLS) ================= */}
          <div className="lg:col-span-8 space-y-8">
            <AnimatePresence mode="wait">
              {/* ── 1. OVERVIEW TAB ── */}
              {activeTab === "overview" && (
                <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                  {/* Card 1: What is Disease? */}
                  <div className="rounded-xl border-2 border-[#E7E2CE] bg-white p-6 sm:p-8 shadow-xs">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F0F4FA] text-[#112250]">
                        <Lightbulb className="h-5 w-5 text-[#112250]" />
                      </div>
                      <h2 className="font-heading text-xl sm:text-2xl font-black text-[#112250]">
                        What is {disease.name}?
                      </h2>
                    </div>

                    <div className="prose max-w-none text-sm text-[#112250] leading-relaxed font-medium space-y-3">
                      {typeof disease.overview === "object" && disease.overview !== null ? (
                        <>
                          {disease.overview.simple && <p><LinkifiedText text={disease.overview.simple} /></p>}
                          {disease.overview.medical && <p><LinkifiedText text={disease.overview.medical} /></p>}
                        </>
                      ) : (
                        <p><LinkifiedText text={disease.overview || disease.shortDesc || "Comprehensive overview currently being updated."} /></p>
                      )}
                    </div>

                    {/* Quick Fact Callout Box */}
                    <div className="mt-6 flex items-start gap-3 rounded-xl bg-[#F0F5FF] p-4 border border-[#CDE0FF]">
                      <Info className="h-5 w-5 text-[#112250] shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-bold text-[#112250] uppercase tracking-wider">Quick Fact</h4>
                        <p className="mt-1 text-xs text-[#3B507D] font-semibold leading-relaxed">
                          {disease.name} is caused by cellular protein changes that impact organ systems, requiring structured care management.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Common Symptoms Summary */}
                  {symptomsList.length > 0 && (
                    <div className="rounded-xl border-2 border-[#E7E2CE] bg-white p-6 sm:p-8 shadow-xs">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-heading text-lg font-black text-[#112250] flex items-center gap-2">
                          <Activity className="h-5 w-5 text-[#112250]" /> Common Symptoms
                        </h3>
                        <button onClick={() => setActiveTab("symptoms")} className="text-xs font-bold text-[#112250] hover:underline">
                          View All Symptoms →
                        </button>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {symptomsList.slice(0, 6).map((sym: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-3 rounded-xl bg-[#F5F4F0] p-3.5 border border-[#E7E2CE]">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#112250] shadow-2xs">
                              <Droplets className="h-4 w-4 text-[#112250]" />
                            </div>
                            <span className="text-xs font-bold text-[#112250]">{sym.name || sym}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Card 3: Causes & Risk Factors Summary */}
                  {causesList.length > 0 && (
                    <div className="rounded-xl border-2 border-[#E7E2CE] bg-white p-6 sm:p-8 shadow-xs">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-heading text-lg font-black text-[#112250] flex items-center gap-2">
                          <Dna className="h-5 w-5 text-[#112250]" /> Causes & Risk Factors
                        </h3>
                        <button onClick={() => setActiveTab("causes")} className="text-xs font-bold text-[#112250] hover:underline">
                          View All Causes →
                        </button>
                      </div>
                      <ul className="space-y-2 text-xs text-[#112250] font-medium">
                        {causesList.slice(0, 3).map((c: any, idx: number) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="h-2 w-2 rounded-full bg-[#112250] mt-1.5 shrink-0" />
                            <span><strong className="font-bold">{c.title}:</strong> <LinkifiedText text={c.explanation} /></span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              )}

              {/* ── 2. SYMPTOMS TAB ── */}
              {activeTab === "symptoms" && (
                <motion.div key="symptoms" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                  <div className="rounded-xl border-2 border-[#E7E2CE] bg-white p-6 sm:p-8 shadow-xs">
                    <h2 className="font-heading text-2xl font-black text-[#112250] mb-2 flex items-center gap-2">
                      <Activity className="h-6 w-6 text-[#112250]" /> Symptoms & Characteristics
                    </h2>
                    <p className="text-xs font-medium text-[#3B507D] mb-6">
                      Full symptom list extracted from clinical sources with attached descriptions, severity, and age notes.
                    </p>

                    {symptomsList.length > 0 ? (
                      <div className="space-y-4">
                        {symptomsList.map((sym: any, idx: number) => (
                          <div key={idx} className="rounded-xl border border-[#E7E2CE] bg-[#F5F4F0] p-5 transition-all">
                            <div className="flex items-center justify-between">
                              <h4 className="font-heading text-base font-bold text-[#112250] flex items-center gap-2">
                                <span className="flex h-2.5 w-2.5 rounded-full bg-[#112250]" />
                                <span>{sym.name || sym}</span>
                              </h4>
                              {sym.severity && (
                                <span className="rounded-full bg-[#112250] px-3 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                                  {sym.severity}
                                </span>
                              )}
                            </div>
                            {sym.description && (
                              <p className="mt-2 text-xs text-[#3B507D] font-medium leading-relaxed pl-4 border-l-2 border-[#112250]">
                                <LinkifiedText text={sym.description} />
                              </p>
                            )}
                            {sym.ageNotes && (
                              <p className="mt-1 text-[11px] text-[#3B507D] font-semibold italic pl-4">
                                Age factor: {sym.ageNotes}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-[#3B507D] italic">No symptom details available for this condition.</p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ── 3. CAUSES TAB ── */}
              {activeTab === "causes" && (
                <motion.div key="causes" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                  <div className="rounded-xl border-2 border-[#E7E2CE] bg-white p-6 sm:p-8 shadow-xs">
                    <h2 className="font-heading text-2xl font-black text-[#112250] mb-2 flex items-center gap-2">
                      <Microscope className="h-6 w-6 text-[#112250]" /> Causes & Genetic Risk Factors
                    </h2>
                    <p className="text-xs font-medium text-[#3B507D] mb-6">
                      Detailed breakdown of genetic mutations, environmental factors, and inheritance patterns.
                    </p>

                    {causesList.length > 0 ? (
                      <div className="space-y-5">
                        {causesList.map((cause: any, idx: number) => (
                          <div key={idx} className="rounded-xl border-2 border-[#E7E2CE] bg-[#F5F4F0] p-6 space-y-3">
                            <div className="flex items-center gap-2">
                              <span className="rounded-full bg-[#112250] px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
                                {cause.title || `Cause #${idx + 1}`}
                              </span>
                            </div>
                            <p className="text-sm text-[#112250] font-medium leading-relaxed">
                              <LinkifiedText text={cause.explanation || cause} />
                            </p>
                            {Array.isArray(cause.details) && cause.details.length > 0 && (
                              <ul className="mt-2 space-y-1.5 pl-4 border-l-2 border-[#E7E2CE] text-xs text-[#3B507D] font-medium">
                                {cause.details.map((detail: string, dIdx: number) => (
                                  <li key={dIdx}>• {detail}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-[#3B507D] italic">Causes information currently being updated.</p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ── 4. TYPES TAB ── */}
              {activeTab === "types" && (
                <motion.div key="types" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                  <div className="rounded-xl border-2 border-[#E7E2CE] bg-white p-6 sm:p-8 shadow-xs">
                    <h2 className="font-heading text-2xl font-black text-[#112250] mb-2 flex items-center gap-2">
                      <Layers className="h-6 w-6 text-[#112250]" /> Disease Subtypes & Forms
                    </h2>
                    <p className="text-xs font-medium text-[#3B507D] mb-6">
                      Preserved sub-information, characteristics, and clinical stages per type.
                    </p>

                    {typesList.length > 0 ? (
                      <div className="space-y-5">
                        {typesList.map((type: any, idx: number) => (
                          <div key={idx} className="rounded-xl border-2 border-[#E7E2CE] bg-[#F9F8F5] p-6">
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="font-heading font-black text-lg text-[#112250]">
                                {type.title || `Type ${idx + 1}`}
                              </h3>
                              {type.stage && (
                                <span className="rounded-md bg-[#112250] px-2.5 py-1 text-[10px] font-bold text-white uppercase">
                                  {type.stage}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-[#112250] font-medium leading-relaxed mb-3">
                              <LinkifiedText text={type.description} />
                            </p>
                            {Array.isArray(type.characteristics) && type.characteristics.length > 0 && (
                              <div className="mt-3 rounded-lg bg-white p-3 border border-[#E7E2CE]">
                                <h4 className="text-[11px] font-bold text-[#112250] uppercase mb-1">Key Characteristics</h4>
                                <ul className="list-disc list-inside text-xs text-[#3B507D] font-medium space-y-1">
                                  {type.characteristics.map((c: string, cIdx: number) => (
                                    <li key={cIdx}>{c}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-[#3B507D] italic">No specific subtype breakdown for this condition.</p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ── 5. DIAGNOSIS TAB ── */}
              {activeTab === "diagnosis" && (
                <motion.div key="diagnosis" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                  <div className="rounded-xl border-2 border-[#E7E2CE] bg-white p-6 sm:p-8 shadow-xs">
                    <h2 className="font-heading text-2xl font-black text-[#112250] mb-2 flex items-center gap-2">
                      <FileText className="h-6 w-6 text-[#112250]" /> Diagnostic Procedures & Testing
                    </h2>
                    <p className="text-xs font-medium text-[#3B507D] mb-6">
                      Complete diagnostic criteria, tests, procedures, and result meanings.
                    </p>

                    {diagnosticSteps.length > 0 ? (
                      <div className="space-y-4">
                        {diagnosticSteps.map((step: any, idx: number) => (
                          <div key={idx} className="rounded-xl border-2 border-[#E7E2CE] bg-[#F5F4F0] p-6 space-y-3">
                            <span className="rounded-full bg-[#112250] px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
                              {step.name || `Diagnostic Method #${idx + 1}`}
                            </span>
                            {step.what && (
                              <p className="text-xs font-bold text-[#112250]">
                                What it is: <span className="font-medium text-[#3B507D]"><LinkifiedText text={step.what} /></span>
                              </p>
                            )}
                            {step.how && (
                              <p className="text-xs font-bold text-[#112250]">
                                How it works: <span className="font-medium text-[#3B507D]"><LinkifiedText text={step.how} /></span>
                              </p>
                            )}
                            {step.result && (
                              <p className="text-xs font-bold text-[#112250]">
                                Result meaning: <span className="font-medium text-[#3B507D]"><LinkifiedText text={step.result} /></span>
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-[#3B507D] italic">Diagnostic information is currently being updated.</p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ── 6. TREATMENT & RESEARCH TAB ── */}
              {activeTab === "treatments" && (
                <motion.div key="treatments" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                  <div className="rounded-xl border-2 border-[#E7E2CE] bg-white p-6 sm:p-8 shadow-xs">
                    <h2 className="font-heading text-2xl font-black text-[#112250] mb-2 flex items-center gap-2">
                      <FlaskConical className="h-6 w-6 text-[#112250]" /> Research & Pharma Directory
                    </h2>
                    <p className="text-xs font-medium text-[#3B507D] mb-6">
                      Complete records of active clinical trials, pharmaceutical organizations, development stages, and eligibility.
                    </p>

                    {researchList.length > 0 ? (
                      <div className="space-y-5">
                        {researchList.map((res: any, idx: number) => (
                          <div key={idx} className="rounded-xl border-2 border-[#E7E2CE] bg-[#F5F4F0] p-6 space-y-3">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div>
                                <h3 className="font-heading font-black text-lg text-[#112250]">
                                  {res.name || res.title || "Research Organization"}
                                </h3>
                                {res.drugName && (
                                  <span className="mt-1 inline-block text-xs font-bold text-[#3B507D]">
                                    Drug / Compound: {res.drugName}
                                  </span>
                                )}
                              </div>
                              {res.url && (
                                <a
                                  href={res.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#112250] px-4 py-2 text-xs font-bold text-white hover:bg-[#3B507D] transition-all"
                                >
                                  <span>Official Website / Trial</span>
                                  <ExternalLink className="h-3.5 w-3.5" />
                                </a>
                              )}
                            </div>

                            <p className="text-xs text-[#112250] font-medium leading-relaxed">
                              <LinkifiedText text={res.focus || res.description || "Active rare disease research project."} />
                            </p>

                            <div className="grid gap-2 text-[11px] text-[#3B507D] font-semibold sm:grid-cols-2 pt-2 border-t border-[#E7E2CE]">
                              {res.stage && <div>Development Stage: <span className="text-[#112250]">{res.stage}</span></div>}
                              {res.status && <div>Trial Status: <span className="text-[#112250]">{res.status}</span></div>}
                              {res.eligibility && <div>Eligibility: <span className="text-[#112250]">{res.eligibility}</span></div>}
                              {res.location && <div>Location: <span className="text-[#112250]">{res.location}</span></div>}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-[#3B507D] italic">No research records found for this disease.</p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ── 7. LIFESTYLE TAB ── */}
              {activeTab === "lifestyle" && (
                <motion.div key="lifestyle" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                  <div className="rounded-xl border-2 border-[#E7E2CE] bg-white p-6 sm:p-8 shadow-xs">
                    <h2 className="font-heading text-2xl font-black text-[#112250] mb-2 flex items-center gap-2">
                      <HeartPulse className="h-6 w-6 text-[#112250]" /> Lifestyle & Daily Support
                    </h2>
                    <p className="text-xs font-medium text-[#3B507D] mb-6">
                      Therapies, nutrition, equipment, daily guidance, and support routines.
                    </p>

                    {disease.lifestyleAndDailySupport ? (
                      <div className="space-y-5">
                        {disease.lifestyleAndDailySupport.raw && (
                          <div className="rounded-xl bg-[#F5F4F0] p-5 text-xs text-[#112250] leading-relaxed font-medium border border-[#E7E2CE]">
                            <LinkifiedText text={disease.lifestyleAndDailySupport.raw} />
                          </div>
                        )}

                        {Array.isArray(disease.lifestyleAndDailySupport.therapies) && disease.lifestyleAndDailySupport.therapies.length > 0 && (
                          <div className="rounded-xl border-2 border-[#E7E2CE] bg-white p-5">
                            <h4 className="font-heading font-black text-base text-[#112250] mb-3 flex items-center gap-2">
                              <Activity className="h-4 w-4 text-[#112250]" /> Recommended Therapies
                            </h4>
                            <div className="grid gap-3 sm:grid-cols-2">
                              {disease.lifestyleAndDailySupport.therapies.map((th: any, idx: number) => (
                                <div key={idx} className="rounded-lg bg-[#F5F4F0] p-3 text-xs font-bold text-[#112250] border border-[#E7E2CE]">
                                  {typeof th === "string" ? th : `${th.name}${th.desc ? `: ${th.desc}` : ""}`}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {disease.lifestyleAndDailySupport.nutrition && (
                          <div className="rounded-xl border-2 border-[#E7E2CE] bg-[#F5F4F0] p-5">
                            <h4 className="font-heading font-black text-base text-[#112250] mb-1">Nutrition & Dietary Support</h4>
                            <p className="text-xs text-[#3B507D] font-medium leading-relaxed">
                              <LinkifiedText text={disease.lifestyleAndDailySupport.nutrition} />
                            </p>
                          </div>
                        )}

                        {Array.isArray(disease.lifestyleAndDailySupport.devices) && disease.lifestyleAndDailySupport.devices.length > 0 && (
                          <div className="rounded-xl border-2 border-[#E7E2CE] bg-white p-5">
                            <h4 className="font-heading font-black text-base text-[#112250] mb-2">Assistive Devices & Medical Equipment</h4>
                            <ul className="list-disc list-inside space-y-1 text-xs text-[#3B507D] font-medium">
                              {disease.lifestyleAndDailySupport.devices.map((dev: string, idx: number) => (
                                <li key={idx}>{dev}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {Array.isArray(disease.lifestyleAndDailySupport.caregiverTips) && disease.lifestyleAndDailySupport.caregiverTips.length > 0 && (
                          <div className="rounded-xl border-2 border-[#E7E2CE] bg-[#F5F4F0] p-5">
                            <h4 className="font-heading font-black text-base text-[#112250] mb-3">Caregiver Guidance & Practical Advice</h4>
                            <ul className="space-y-2">
                              {disease.lifestyleAndDailySupport.caregiverTips.map((tip: string, idx: number) => (
                                <li key={idx} className="flex items-start gap-2 text-xs text-[#112250] font-semibold">
                                  <CheckCircle className="h-4 w-4 text-[#112250] shrink-0 mt-0.5" />
                                  <span><LinkifiedText text={tip} /></span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-[#3B507D] italic">Lifestyle information currently being updated.</p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ── 8. COMMUNITY TAB ── */}
              {activeTab === "community" && (
                <motion.div key="community" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                  <div className="rounded-xl border-2 border-[#E7E2CE] bg-white p-6 sm:p-8 shadow-xs">
                    <h2 className="font-heading text-2xl font-black text-[#112250] mb-2 flex items-center gap-2">
                      <Users className="h-6 w-6 text-[#112250]" /> Community & Patient Support Resources
                    </h2>
                    <p className="text-xs font-medium text-[#3B507D] mb-6">
                      Patient advocacy organizations, family networks, support groups, and contact channels.
                    </p>

                    <div className="rounded-xl border-2 border-[#E7E2CE] bg-[#F5F4F0] p-6 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#112250] text-white">
                          <Users className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-heading font-bold text-base text-[#112250]">Global Rare Disease Alliance</h3>
                          <p className="text-xs text-[#3B507D]">Connecting families and patients worldwide</p>
                        </div>
                      </div>
                      <p className="text-xs text-[#112250] font-medium leading-relaxed">
                        {disease.lifestyleAndDailySupport?.community ? (
                          <LinkifiedText text={disease.lifestyleAndDailySupport.community} />
                        ) : (
                          `Connect with support groups and peer resources for families navigating ${disease.name}. Access patient advocacy tools, community forums, and verified guidance.`
                        )}
                      </p>
                      <div className="pt-3 border-t border-[#E7E2CE] flex flex-wrap items-center gap-3">
                        <a href="https://rarediseases.org" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#112250] hover:underline">
                          <span>Visit NORD Patient Portal</span>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── 9. FAQS TAB ── */}
              {activeTab === "faqs" && (
                <motion.div key="faqs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                  <div className="rounded-xl border-2 border-[#E7E2CE] bg-white p-6 sm:p-8 shadow-xs">
                    <h2 className="font-heading text-2xl font-black text-[#112250] mb-2 flex items-center gap-2">
                      <HelpCircle className="h-6 w-6 text-[#112250]" /> Frequently Asked Questions (FAQs)
                    </h2>
                    <p className="text-xs font-medium text-[#3B507D] mb-6">
                      Structured Q&A pairs extracted from clinical documentation.
                    </p>

                    {faqsList.length > 0 ? (
                      <div className="space-y-3">
                        {faqsList.map((faq: any, idx: number) => {
                          const isOpen = openFaqIndices[idx] ?? (idx === 0);
                          const qText = faq.question || faq.q || `Question ${idx + 1}`;
                          const aText = faq.answer || faq.a || "Information unavailable.";

                          return (
                            <div key={idx} className="rounded-xl border-2 border-[#E7E2CE] bg-[#F5F4F0] overflow-hidden transition-all">
                              <button
                                onClick={() => toggleFaq(idx)}
                                className="flex w-full items-center justify-between p-5 text-left font-heading font-black text-sm text-[#112250] hover:bg-[#E7E2CE]/40 transition-colors"
                              >
                                <span className="flex items-center gap-2">
                                  <HelpCircle className="h-4 w-4 text-[#112250] shrink-0" />
                                  <span>{qText}</span>
                                </span>
                                {isOpen ? <ChevronUp className="h-4 w-4 text-[#112250] shrink-0" /> : <ChevronDown className="h-4 w-4 text-[#3B507D] shrink-0" />}
                              </button>

                              {isOpen && (
                                <div className="p-5 pt-0 border-t border-[#E7E2CE] bg-white text-xs text-[#3B507D] font-medium leading-relaxed">
                                  <LinkifiedText text={aText} />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-[#3B507D] italic">No FAQs available for this condition.</p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ── 10. FACTS VS MYTHS TAB ── */}
              {activeTab === "myths" && (
                <motion.div key="myths" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                  <div className="rounded-xl border-2 border-[#E7E2CE] bg-white p-6 sm:p-8 shadow-xs">
                    <h2 className="font-heading text-2xl font-black text-[#112250] mb-2 flex items-center gap-2">
                      <Lightbulb className="h-6 w-6 text-[#112250]" /> Facts vs. Myths
                    </h2>
                    <p className="text-xs font-medium text-[#3B507D] mb-6">
                      Paired myth statements and corresponding verified medical facts.
                    </p>

                    {mythsList.length > 0 ? (
                      <div className="space-y-4">
                        {mythsList.map((item: any, idx: number) => {
                          const mythText = item.myth || item.statement || "Common Myth";
                          const factText = item.fact || item.explanation || "Medical Fact";

                          return (
                            <div key={idx} className="rounded-xl border-2 border-[#E7E2CE] bg-[#F5F4F0] p-6 space-y-4 shadow-xs">
                              {/* Myth Section */}
                              <div className="rounded-lg bg-white border border-[#E7E2CE] p-4 shadow-2xs">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="inline-flex items-center gap-1 rounded-full bg-[#112250] px-2.5 py-0.5 text-[10px] font-bold text-white uppercase shadow-2xs">
                                    <ShieldAlert className="h-3 w-3" /> Myth
                                  </span>
                                </div>
                                <p className="text-xs font-bold text-[#112250]">{mythText}</p>
                              </div>

                              {/* Fact Section */}
                              <div className="rounded-lg bg-[#F0F5FF] border border-[#BFD5F8] p-4 shadow-2xs">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="inline-flex items-center gap-1 rounded-full bg-[#3B507D] px-2.5 py-0.5 text-[10px] font-bold text-white uppercase shadow-2xs">
                                    <CheckCircle className="h-3 w-3" /> Fact
                                  </span>
                                </div>
                                <p className="text-xs font-medium text-[#112250] leading-relaxed">
                                  <LinkifiedText text={factText} />
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-[#3B507D] italic">No Myth vs. Fact pairs available.</p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ── 11. SPECIALIST DIRECTORY TAB ── */}
              {activeTab === "specialists" && (
                <motion.div key="specialists" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                  <div className="rounded-xl border-2 border-[#E7E2CE] bg-white p-6 sm:p-8 shadow-xs">
                    <h2 className="font-heading text-2xl font-black text-[#112250] mb-2 flex items-center gap-2">
                      <Stethoscope className="h-6 w-6 text-[#112250]" /> Specialist Directory
                    </h2>
                    <p className="text-xs font-medium text-[#3B507D] mb-6">
                      Boundary-delimited specialist records with confirmed medical credentials.
                    </p>

                    {specialistsList.length > 0 ? (
                      <div className="grid gap-6 sm:grid-cols-2">
                        {specialistsList.map((spec: any, idx: number) => {
                          const specText = spec.specialization || spec.focus || "";
                          const isLongSpec = specText.length > 35;
                          const badgeLabel = !isLongSpec && specText
                            ? specText
                            : (spec.profession || "Medical Specialist");

                          return (
                            <div key={idx} className="rounded-xl border-2 border-[#E7E2CE] bg-[#F9F8F5] p-6 flex flex-col justify-between space-y-4 shadow-xs hover:border-[#112250]/30 transition-all">
                              <div className="space-y-3">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="rounded-full bg-[#112250] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-2xs">
                                    {badgeLabel}
                                  </span>
                                  {spec.location && (
                                    <span className="text-[11px] font-bold text-[#3B507D] flex items-center gap-1">
                                      <MapPin className="h-3.5 w-3.5 text-[#112250]" />
                                      <span>{spec.location}</span>
                                    </span>
                                  )}
                                </div>

                                <div>
                                  <h3 className="font-heading font-black text-xl text-[#112250] flex items-center gap-2">
                                    <Stethoscope className="h-5 w-5 text-[#112250] shrink-0" />
                                    <span>{spec.name}</span>
                                  </h3>
                                  {spec.profession && (
                                    <p className="text-xs font-bold text-[#3B507D] mt-1">{spec.profession}</p>
                                  )}
                                </div>

                                {/* Specialization & Clinical Focus Details */}
                                {specText && (
                                  <div className="rounded-lg bg-white p-4 border border-[#E7E2CE] space-y-1">
                                    <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-[#112250]">
                                      Clinical Specialization & Focus
                                    </h4>
                                    <p className="text-xs text-[#3B507D] font-medium leading-relaxed">
                                      <LinkifiedText text={specText} />
                                    </p>
                                  </div>
                                )}

                                {spec.publications && spec.publications !== "0" && (
                                  <div className="text-xs text-[#3B507D] font-medium pl-1">
                                    <strong className="text-[#112250]">Publications & Clinical Trials:</strong> <LinkifiedText text={String(spec.publications)} />
                                  </div>
                                )}
                              </div>

                              <div className="space-y-2 border-t border-[#E7E2CE] pt-3 text-xs text-[#3B507D] font-medium">
                                {spec.organization && (
                                  <div className="flex items-center gap-2">
                                    <Building2 className="h-4 w-4 text-[#112250] shrink-0" />
                                    <span className="font-bold text-[#112250]">{spec.organization}</span>
                                  </div>
                                )}
                                {spec.contact && (
                                  <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-[#112250] shrink-0" />
                                    <LinkifiedText text={spec.contact} />
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-[#3B507D] italic">No specialist records found for this condition.</p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ── 12. SOURCES & LINKS TAB ── */}
              {activeTab === "sources" && (
                <motion.div key="sources" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                  <div className="rounded-xl border-2 border-[#E7E2CE] bg-white p-6 sm:p-8 shadow-xs">
                    <h2 className="font-heading text-2xl font-black text-[#112250] mb-2 flex items-center gap-2">
                      <ExternalLink className="h-6 w-6 text-[#112250]" /> Disease Sources & External References
                    </h2>
                    <p className="text-xs font-medium text-[#3B507D] mb-6">
                      Detected websites, clinical trials, academic publications, and official registry citations.
                    </p>

                    {sourcesList.length > 0 ? (
                      <div className="space-y-3">
                        {sourcesList.map((src: any, idx: number) => {
                          const title = src.title || src.name || `Reference ${idx + 1}`;
                          const url = src.url || (typeof src === "string" ? src : null);

                          return (
                            <div key={idx} className="flex items-center justify-between rounded-xl bg-[#F5F4F0] p-4 border border-[#E7E2CE]">
                              <div>
                                <span className="rounded-full bg-[#112250] px-2.5 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider mb-1 inline-block">
                                  {src.type || "Reference"}
                                </span>
                                <h4 className="text-xs font-bold text-[#112250]">{title}</h4>
                                {src.description && <p className="text-[11px] text-[#3B507D] mt-0.5">{src.description}</p>}
                              </div>
                              {url && (
                                <a
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs font-bold text-[#112250] hover:underline shrink-0"
                                >
                                  <span>Visit Link</span>
                                  <ExternalLink className="h-3.5 w-3.5" />
                                </a>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-[#3B507D] italic">No external references listed for this condition.</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── ANTI-DATA-LOSS FALLBACK SECTION ── */}
            {uncategorizedList.length > 0 && (
              <div className="rounded-xl border-2 border-[#BFD5F8] bg-[#F5F8FF] p-6 shadow-xs">
                <h3 className="font-heading font-black text-base text-[#112250] flex items-center gap-2 mb-2">
                  <ShieldAlert className="h-5 w-5 text-[#112250]" />
                  <span>Uncategorized / Additional Preserved Information</span>
                </h3>
                <p className="text-xs text-[#3B507D] font-medium mb-4">
                  Information preserved by the anti-data-loss validation layer to guarantee no source content was discarded.
                </p>
                <div className="space-y-2">
                  {uncategorizedList.map((item: string, idx: number) => (
                    <div key={idx} className="rounded-lg bg-white p-3 text-xs font-medium text-[#112250] border border-[#E7E2CE]">
                      <LinkifiedText text={item} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── MEDICAL DISCLAIMER CARD ── */}
            <div className="rounded-xl border-2 border-[#E7E2CE] bg-[#F5F4F0] p-6 text-center shadow-2xs">
              <div className="flex justify-center mb-2">
                <ShieldAlert className="h-6 w-6 text-[#112250]" />
              </div>
              <h4 className="text-xs font-bold text-[#112250] uppercase tracking-wider mb-1">Medical Disclaimer</h4>
              <p className="text-xs text-[#3B507D] font-medium leading-relaxed max-w-2xl mx-auto">
                This information is provided for general educational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified physician regarding any medical condition.
              </p>
            </div>
          </div>

          {/* ================= RIGHT SIDEBAR COLUMN (4 COLS) ================= */}
          <div className="lg:col-span-4 space-y-6">
            {/* Sidebar Card 1: Quick Links */}
            <div className="rounded-xl border-2 border-[#E7E2CE] bg-white p-6 shadow-xs">
              <h3 className="font-heading font-black text-base text-[#112250] mb-4 flex items-center gap-2">
                <Zap className="h-4 w-4 text-[#112250]" /> Quick Links
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab("treatments")}
                  className="flex w-full items-center justify-between rounded-lg bg-[#F5F4F0] p-3 text-xs font-bold text-[#112250] hover:bg-[#E7E2CE] transition-all"
                >
                  <span className="flex items-center gap-2">
                    <FlaskConical className="h-4 w-4 text-[#112250]" />
                    <span>Find Treatments & Research</span>
                  </span>
                  <span>→</span>
                </button>

                <button
                  onClick={() => setActiveTab("specialists")}
                  className="flex w-full items-center justify-between rounded-lg bg-[#F5F4F0] p-3 text-xs font-bold text-[#112250] hover:bg-[#E7E2CE] transition-all"
                >
                  <span className="flex items-center gap-2">
                    <Stethoscope className="h-4 w-4 text-[#112250]" />
                    <span>Find Specialists</span>
                  </span>
                  <span>→</span>
                </button>

                <button
                  onClick={() => setActiveTab("community")}
                  className="flex w-full items-center justify-between rounded-lg bg-[#F5F4F0] p-3 text-xs font-bold text-[#112250] hover:bg-[#E7E2CE] transition-all"
                >
                  <span className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-[#112250]" />
                    <span>Join the Community</span>
                  </span>
                  <span>→</span>
                </button>

                <button
                  onClick={() => generateDiseasePDF(disease)}
                  className="flex w-full items-center justify-between rounded-lg bg-[#F5F4F0] p-3 text-xs font-bold text-[#112250] hover:bg-[#E7E2CE] transition-all"
                >
                  <span className="flex items-center gap-2">
                    <Download className="h-4 w-4 text-[#112250]" />
                    <span>Download Resources (PDF)</span>
                  </span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Sidebar Card 2: Latest Research Preview */}
            <div className="rounded-xl border-2 border-[#E7E2CE] bg-white overflow-hidden shadow-xs">
              <div className="h-36 bg-[#E0EBFB] relative flex items-center justify-center p-4">
                <div className="text-center">
                  <FlaskConical className="h-10 w-10 text-[#112250] mx-auto mb-1" />
                  <span className="text-xs font-black text-[#112250]">Latest Clinical Trials</span>
                </div>
              </div>
              <div className="p-5">
                <span className="text-[10px] font-bold text-[#3B507D] uppercase tracking-wider">Latest Research</span>
                <h4 className="font-heading font-black text-sm text-[#112250] mt-1 leading-snug">
                  New gene therapies and precision modulators show promise for rare conditions
                </h4>
                <button
                  onClick={() => setActiveTab("treatments")}
                  className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#112250] hover:underline"
                >
                  <span>Read more</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Sidebar Card 3: Community Callout Zebra Card */}
            <div className="rounded-xl border-2 border-[#E7E2CE] bg-[#FFFBF0] p-6 shadow-xs relative overflow-hidden">
              <div className="relative z-10">
                <h4 className="font-heading font-black text-lg text-[#112250]">You&apos;re not alone.</h4>
                <p className="mt-2 text-xs font-medium text-[#3B507D] leading-relaxed">
                  Thousands of families are on this journey. Let&apos;s build a stronger support system together.
                </p>
                <button
                  onClick={() => setActiveTab("community")}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#112250] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#3B507D] transition-all shadow-xs"
                >
                  <span>Join the Community</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}