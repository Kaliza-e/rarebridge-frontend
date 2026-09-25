import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DISEASES, fetchDiseasesFromAPI, type Disease } from "../data";
import { ZebraEmptyState, EdelweissFlower, OrganicWavyLine, ZebraGridDoodle } from "../components/common/Visuals";
import { generateDiseasePDF } from "../utils/pdf-generator";
import { LinkifiedText } from "../utils/link-helper";
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
  XCircle,
  ExternalLink,
  MapPin,
  Mail,
  ShieldAlert,
  FileText,
  UserCheck,
  BrainCircuit,
  Sparkles,
  Dna,
} from "lucide-react";

type DiseasePageProps = {
  diseaseId: string;
  onBack: () => void;
};

export default function DiseasePage({ diseaseId, onBack }: DiseasePageProps) {
  const [disease, setDisease] = useState<any | null>(null);
  const [allDiseasesList, setAllDiseasesList] = useState<any[]>(DISEASES);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "causes"
    | "symptoms"
    | "diagnosis"
    | "lifestyle"
    | "treatments"
    | "faqs"
    | "myths"
    | "specialists"
    | "sources"
  >("overview");

  useEffect(() => {
    let cancelled = false;

    async function loadDetail() {
      setLoading(true);
      try {
        const allDiseases = await fetchDiseasesFromAPI();
        if (cancelled) return;

        if (allDiseases && allDiseases.length > 0) {
          setAllDiseasesList(allDiseases);
        }

        const found = allDiseases.find(
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
          className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#112250] px-6 py-3.5 font-bold text-white hover:bg-[#3B507D]"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Disease Directory
        </button>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: BookOpen },
    { id: "causes", label: "Causes", icon: Microscope },
    { id: "symptoms", label: "Types & Symptoms", icon: Activity },
    { id: "diagnosis", label: "Diagnosis", icon: FileText },
    { id: "lifestyle", label: "Lifestyle & Support", icon: HeartPulse },
    { id: "treatments", label: "Research & Pharma", icon: FlaskConical },
    { id: "faqs", label: "FAQs", icon: HelpCircle },
    { id: "myths", label: "Facts vs. Myths", icon: Lightbulb },
    { id: "specialists", label: "Specialist Directory", icon: Stethoscope },
    { id: "sources", label: "Sources & Links", icon: ExternalLink },
  ] as const;

  const renderSmartContent = (data: any, fallback = "Information currently being updated for this section.") => {
    if (!data) return <p className="text-sm text-[#3B507D]/70 italic">{fallback}</p>;

    if (typeof data === "string") {
      if (!data.trim()) return <p className="text-sm text-[#3B507D]/70 italic">{fallback}</p>;
      return (
        <div className="prose max-w-none text-sm text-[#112250] leading-relaxed font-medium whitespace-pre-line">
          <LinkifiedText text={data} />
        </div>
      );
    }

    // Overview object handler
    if (typeof data === "object" && !Array.isArray(data) && (data.simple || data.medical || data.summary || data.description || data.text || data.content || data.overview || data.raw)) {
      const parts = [
        data.simple,
        data.medical,
        data.summary,
        data.description,
        data.text,
        data.content,
        data.overview,
        data.raw
      ].filter(Boolean);

      const uniqueParts = parts.filter((val, idx) => parts.indexOf(val) === idx && typeof val === "string");
      const textToDisplay = uniqueParts.join("\n\n");

      return (
        <div className="prose max-w-none text-sm text-[#112250] leading-relaxed font-medium whitespace-pre-line">
          <LinkifiedText text={textToDisplay || fallback} />
        </div>
      );
    }

    // Causes object handler
    if (typeof data === "object" && !Array.isArray(data) && (data.genetic || data.environmental || data.unknown)) {
      return (
        <div className="space-y-4">
          {data.genetic && (
            <div className="rounded-2xl border-2 border-[#E7E2CE] bg-[#F5F4F0] p-5">
              <span className="rounded-full bg-[#112250] px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider">Genetic Causes</span>
              <p className="mt-2 text-sm text-[#112250] font-medium leading-relaxed">{data.genetic}</p>
            </div>
          )}
          {data.environmental && (
            <div className="rounded-2xl border-2 border-[#E7E2CE] bg-[#F5F4F0] p-5">
              <span className="rounded-full bg-[#3B507D] px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider">Environmental Triggers</span>
              <p className="mt-2 text-sm text-[#112250] font-medium leading-relaxed">{data.environmental}</p>
            </div>
          )}
          {data.unknown && (
            <div className="rounded-2xl border-2 border-[#E7E2CE] bg-[#F5F4F0] p-5">
              <span className="rounded-full bg-[#E7E2CE] px-3 py-1 text-[10px] font-bold text-[#112250] uppercase tracking-wider">Other Factors</span>
              <p className="mt-2 text-sm text-[#112250] font-medium leading-relaxed">{data.unknown}</p>
            </div>
          )}
        </div>
      );
    }

    // Lifestyle object handler
    if (typeof data === "object" && !Array.isArray(data) && (data.therapies || data.nutrition || data.devices || data.caregiverTips || data.community || data.raw)) {
      return (
        <div className="space-y-5">
          {data.raw && (
            <div className="rounded-2xl border-2 border-[#E7E2CE] bg-[#F5F4F0] p-5 text-sm text-[#112250] leading-relaxed font-medium">
              <LinkifiedText text={data.raw} />
            </div>
          )}
          {Array.isArray(data.therapies) && data.therapies.length > 0 && (
            <div className="rounded-2xl border-2 border-[#E7E2CE] bg-white p-5">
              <h4 className="font-heading font-black text-base text-[#112250] mb-3 flex items-center gap-2">
                <Activity className="h-4 w-4 text-[#112250]" /> Recommended Therapies
              </h4>
              <div className="grid gap-3 sm:grid-cols-2">
                {data.therapies.map((th: any, idx: number) => (
                  <div key={idx} className="rounded-xl bg-[#F5F4F0] p-3 text-xs font-semibold text-[#112250] border border-[#E7E2CE]">
                    {typeof th === "string" ? th : (th.name + (th.desc ? `: ${th.desc}` : ""))}
                  </div>
                ))}
              </div>
            </div>
          )}
          {data.nutrition && (
            <div className="rounded-2xl border-2 border-[#E7E2CE] bg-[#F5F4F0] p-5">
              <h4 className="font-heading font-black text-base text-[#112250] mb-1">Nutrition & Dietary Support</h4>
              <p className="text-xs text-[#3B507D] font-medium leading-relaxed">{data.nutrition}</p>
            </div>
          )}
          {Array.isArray(data.devices) && data.devices.length > 0 && (
            <div className="rounded-2xl border-2 border-[#E7E2CE] bg-white p-5">
              <h4 className="font-heading font-black text-base text-[#112250] mb-2">Assistive Devices & Equipment</h4>
              <ul className="list-disc list-inside space-y-1 text-xs text-[#3B507D] font-medium">
                {data.devices.map((d: string, idx: number) => (
                  <li key={idx}>{d}</li>
                ))}
              </ul>
            </div>
          )}
          {Array.isArray(data.caregiverTips) && data.caregiverTips.length > 0 && (
            <div className="rounded-2xl border-2 border-[#E7E2CE] bg-[#F5F4F0] p-5">
              <h4 className="font-heading font-black text-base text-[#112250] mb-2">Caregiver Guidance & Tips</h4>
              <ul className="space-y-2">
                {data.caregiverTips.map((tip: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-[#112250] font-medium">
                    <CheckCircle className="h-4 w-4 text-[#112250] shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {data.community && (
            <div className="rounded-2xl border-2 border-[#E7E2CE] bg-white p-5">
              <h4 className="font-heading font-black text-base text-[#112250] mb-1">Community Support & Groups</h4>
              <p className="text-xs text-[#3B507D] font-medium leading-relaxed">{data.community}</p>
            </div>
          )}
        </div>
      );
    }

    if (Array.isArray(data)) {
      if (data.length === 0) return <p className="text-sm text-[#3B507D]/70 italic">{fallback}</p>;

      return (
        <div className="space-y-3">
          {data.map((item, i) => {
            if (typeof item === "string") {
              return (
                <div key={i} className="flex items-start gap-3 rounded-2xl bg-[#F5F4F0] p-4 border border-[#E7E2CE]">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-[#112250] mt-1.5 shrink-0" />
                  <div className="text-sm font-medium text-[#112250]">
                    <LinkifiedText text={item} />
                  </div>
                </div>
              );
            }

            // Diagnostic Step
            if (item.what || item.how || item.result) {
              return (
                <div key={i} className="rounded-2xl border-2 border-[#E7E2CE] bg-[#F5F4F0] p-5">
                  <span className="rounded-full bg-[#112250] px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
                    {item.name || `Diagnostic Step ${i + 1}`}
                  </span>
                  {item.what && <p className="mt-2 text-xs font-bold text-[#112250]">What it is: <span className="font-medium text-[#3B507D]">{item.what}</span></p>}
                  {item.how && <p className="mt-1 text-xs font-bold text-[#112250]">How it works: <span className="font-medium text-[#3B507D]">{item.how}</span></p>}
                  {item.result && <p className="mt-1 text-xs font-bold text-[#112250]">Result meaning: <span className="font-medium text-[#3B507D]">{item.result}</span></p>}
                </div>
              );
            }

            // Research Org
            if (item.focus || item.url) {
              return (
                <div key={i} className="rounded-2xl border-2 border-[#E7E2CE] bg-[#F5F4F0] p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-heading font-black text-base text-[#112250]">{item.name || item.title || "Research Organization"}</h4>
                      {item.focus && <p className="text-xs font-medium text-[#3B507D] mt-1">{item.focus}</p>}
                    </div>
                    {item.url && (
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-[#112250] hover:underline">
                        <span>Visit Website</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              );
            }

            // Specialist
            if (item.name && (item.profession || item.organization || item.specialization || item.location)) {
              return (
                <div key={i} className="rounded-2xl border-2 border-[#E7E2CE] bg-[#F5F4F0] p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#3B507D] border border-[#E7E2CE]">
                        {item.specialization || item.profession || "Specialist"}
                      </span>
                      <h4 className="font-heading font-black text-lg text-[#112250] mt-1">{item.name}</h4>
                      {item.profession && <p className="text-xs font-bold text-[#3B507D]">{item.profession}</p>}
                    </div>
                    <UserCheck className="h-5 w-5 text-[#112250]" />
                  </div>
                  <div className="mt-3 space-y-1.5 border-t border-[#E7E2CE] pt-3 text-xs text-[#3B507D] font-medium">
                    {item.organization && (
                      <div className="flex items-center gap-2">
                        <Building2 className="h-3.5 w-3.5 text-[#112250]" />
                        <span>{item.organization}</span>
                      </div>
                    )}
                    {item.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-[#112250]" />
                        <span>{item.location}</span>
                      </div>
                    )}
                    {item.contact && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5 text-[#112250]" />
                        <LinkifiedText text={item.contact} />
                      </div>
                    )}
                  </div>
                </div>
              );
            }

            // Fact/Myth
            if (item.statement !== undefined || item.myth !== undefined || item.isFact !== undefined) {
              const isFact = item.isFact || item.fact !== undefined;
              const title = item.statement || item.myth || item.fact;
              const text = item.explanation || item.fact || item.myth;

              return (
                <div key={i} className={`rounded-2xl border-2 p-5 ${isFact ? "border-emerald-200 bg-emerald-50/50" : "border-amber-200 bg-amber-50/50"}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {isFact ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-0.5 text-[10px] font-bold text-white uppercase">
                        <CheckCircle className="h-3 w-3" /> Fact
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-600 px-3 py-0.5 text-[10px] font-bold text-white uppercase">
                        <ShieldAlert className="h-3 w-3" /> Myth
                      </span>
                    )}
                  </div>
                  <h4 className="font-heading font-black text-base text-[#112250]">{title}</h4>
                  <p className="mt-2 text-xs leading-relaxed text-[#3B507D] font-medium border-t border-[#E7E2CE] pt-2">
                    <LinkifiedText text={text} />
                  </p>
                </div>
              );
            }

            // FAQ
            if (item.question && item.answer) {
              return (
                <div key={i} className="rounded-2xl border-2 border-[#E7E2CE] bg-[#F5F4F0] p-5">
                  <h4 className="font-heading font-black text-base text-[#112250] flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-[#112250] shrink-0" />
                    <span>{item.question}</span>
                  </h4>
                  <div className="mt-2 text-xs leading-relaxed text-[#3B507D] font-medium border-t border-[#E7E2CE] pt-2">
                    <LinkifiedText text={item.answer} />
                  </div>
                </div>
              );
            }

            // Generic object fallback
            return (
              <div key={i} className="rounded-2xl border border-[#E7E2CE] bg-[#F5F4F0] p-4 text-xs font-medium text-[#112250]">
                {Object.entries(item).map(([k, v]) => (
                  <div key={k} className="mb-1">
                    <strong className="capitalize">{k}: </strong>
                    <span>{typeof v === "string" ? v : JSON.stringify(v)}</span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      );
    }

    if (typeof data === "object" && !Array.isArray(data)) {
      return (
        <div className="space-y-3">
          {Object.entries(data).map(([key, value]) => {
            if (!value) return null;
            const textVal = typeof value === "string" ? value : (typeof value === "object" ? ((value as any).summary || (value as any).simple || (value as any).medical || (value as any).raw || JSON.stringify(value)) : String(value));
            return (
              <div key={key} className="rounded-2xl border-2 border-[#E7E2CE] bg-[#F5F4F0] p-5">
                <span className="rounded-full bg-[#112250] px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider mb-2 inline-block capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <p className="mt-2 text-sm text-[#112250] font-medium leading-relaxed">
                  <LinkifiedText text={textVal} />
                </p>
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <div className="prose max-w-none text-sm text-[#112250] leading-relaxed font-medium">
        <LinkifiedText text={typeof data === "object" ? JSON.stringify(data, null, 2) : String(data)} />
      </div>
    );
  };

  return (
    <main className="relative min-h-screen bg-transparent pb-24 text-[#112250] selection:bg-[#E7E2CE] selection:text-[#112250] overflow-hidden">
      <OrganicWavyLine side="left" />
      <OrganicWavyLine side="right" />

      {/* ================= HEADER HERO BANNER ================= */}
      <section className="relative overflow-hidden bg-transparent pt-10 pb-12">
        {/* Background ambient blobs matching Homepage */}
        <div className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-[#E7E2CE]/70 blur-3xl" />
        <div className="pointer-events-none absolute top-1/3 -left-20 h-56 w-56 rounded-full bg-[#3B507D]/10 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <button
            onClick={onBack}
            className="mb-6 inline-flex items-center gap-2 rounded-2xl border border-[#E7E2CE] bg-white px-4 py-2 text-xs font-bold text-[#112250] hover:bg-[#E7E2CE] transition-colors shadow-xs"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Disease Directory
          </button>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-3xl border-2 border-[#E7E2CE]/80 bg-white/85 backdrop-blur-md p-8 sm:p-10 text-[#112250] shadow-sm"
          >
            {/* Soft Zebra Grid Pattern Overlay */}
            <ZebraGridDoodle opacity={0.16} />

            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="rounded-full bg-[#112250] px-3 py-1 text-xs font-bold text-white">
                  {disease.category || "Rare Disease"}
                </span>
                {disease.diseaseNumber && (
                  <span className="rounded-full bg-[#F5F4F0] px-3 py-1 text-xs font-bold text-[#112250] border border-[#E7E2CE]">
                    Disease No. {disease.diseaseNumber}
                  </span>
                )}
                {disease.orphaCode && (
                  <span className="rounded-full bg-[#F5F4F0] px-3 py-1 text-xs font-bold text-[#112250] border border-[#E7E2CE]">
                    ORPHA: {disease.orphaCode}
                  </span>
                )}
                {disease.inheritancePattern && (
                  <span className="rounded-full bg-[#E7E2CE]/60 px-3 py-1 text-xs font-bold text-[#112250]">
                    Inheritance: {disease.inheritancePattern}
                  </span>
                )}
              </div>

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                  <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-[#112250]">
                    {disease.name}
                  </h1>
                  <p className="font-sans mt-3 text-base text-[#3B507D] font-medium leading-relaxed max-w-3xl">
                    {disease.shortDesc || disease.overview}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 shrink-0">
                  <button
                    onClick={() => generateDiseasePDF(disease)}
                    className="inline-flex items-center gap-2 rounded-2xl bg-[#112250] px-5 py-3 text-sm font-bold text-white hover:bg-[#3B507D] transition-all shadow-md"
                  >
                    <Download className="h-4 w-4 text-white" />
                    <span>Download Family Guide (PDF)</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= STICKY TAB NAVIGATION ================= */}
      <section className="sticky top-[76px] z-30 relative overflow-hidden bg-[#F8F7F2]/60 backdrop-blur-md py-2.5">
        <ZebraGridDoodle opacity={0.18} />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 overflow-x-auto scrollbar-none py-1">
            {tabs.map((tab) => {
              const IconComp = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`inline-flex shrink-0 items-center gap-2 px-3.5 py-2 text-xs font-semibold transition-all ${
                    isActive
                      ? "border-b-2 border-[#112250] text-[#112250] bg-white/70 rounded-t-xl font-bold shadow-2xs"
                      : "border-b-2 border-transparent text-[#3B507D] bg-transparent hover:text-[#112250] hover:border-[#E7E2CE]"
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

      {/* ================= TAB CONTENT PANELS ================= */}
      <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border-2 border-[#E7E2CE] bg-white/90 backdrop-blur-xs p-6 sm:p-10 shadow-sm">
          {/* Subtle Zebra Grid Doodle Background for tab content */}
          <ZebraGridDoodle opacity={0.12} />
          <div className="relative z-10">
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <h2 className="font-heading text-2xl font-black text-[#112250] mb-4">Condition Overview</h2>
                {renderSmartContent(disease.overview || disease.overviewRaw || disease.fullDesc || disease.shortDesc)}
              </motion.div>
            )}

            {activeTab === "causes" && (
              <motion.div key="causes" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <h2 className="font-heading text-2xl font-black text-[#112250] mb-4">Causes & Inheritance</h2>
                {renderSmartContent(disease.causes || disease.causesRaw || disease.genetics)}
              </motion.div>
            )}

            {activeTab === "symptoms" && (
              <motion.div key="symptoms" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <h2 className="font-heading text-2xl font-black text-[#112250] mb-4">Types & Symptoms</h2>
                {renderSmartContent(
                  (Array.isArray(disease.typesAndSymptoms) && disease.typesAndSymptoms.length > 0)
                    ? disease.typesAndSymptoms
                    : (disease.typesAndSymptomsRaw || disease.symptoms || disease.types)
                )}
              </motion.div>
            )}

            {activeTab === "diagnosis" && (
              <motion.div key="diagnosis" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <h2 className="font-heading text-2xl font-black text-[#112250] mb-4">Diagnosis & Diagnostic Methods</h2>
                {renderSmartContent(
                  (Array.isArray(disease.diagnosis) && disease.diagnosis.length > 0)
                    ? disease.diagnosis
                    : (disease.diagnosisRaw || disease.diagnosticSteps)
                )}
              </motion.div>
            )}

            {activeTab === "lifestyle" && (
              <motion.div key="lifestyle" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <h2 className="font-heading text-2xl font-black text-[#112250] mb-4">Lifestyle & Daily Support + Community</h2>
                {renderSmartContent(
                  disease.lifestyleAndDailySupport || disease.lifestyleAndDailySupportRaw || disease.lifestyle
                )}
              </motion.div>
            )}

            {activeTab === "treatments" && (
              <motion.div key="treatments" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <h2 className="font-heading text-2xl font-black text-[#112250] mb-4">Research & Pharma Directory</h2>
                {renderSmartContent(
                  (Array.isArray(disease.treatmentsAndPharma) && disease.treatmentsAndPharma.length > 0)
                    ? disease.treatmentsAndPharma
                    : (disease.treatmentsAndPharmaRaw || disease.treatments || disease.research)
                )}
              </motion.div>
            )}

            {activeTab === "faqs" && (
              <motion.div key="faqs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <h2 className="font-heading text-2xl font-black text-[#112250] mb-4">Frequently Asked Questions (FAQs)</h2>
                {renderSmartContent(
                  (Array.isArray(disease.faqs) && disease.faqs.length > 0)
                    ? disease.faqs
                    : (disease.faqsRaw || disease.faq)
                )}
              </motion.div>
            )}

            {activeTab === "myths" && (
              <motion.div key="myths" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <h2 className="font-heading text-2xl font-black text-[#112250] mb-4">Facts vs. Myths</h2>
                {renderSmartContent(
                  (Array.isArray(disease.factsMyths) && disease.factsMyths.length > 0)
                    ? disease.factsMyths
                    : (disease.factsMythsRaw || disease.factsVsMyths || disease.myths)
                )}
              </motion.div>
            )}

            {activeTab === "specialists" && (
              <motion.div key="specialists" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <h2 className="font-heading text-2xl font-black text-[#112250] mb-4">Specialist Directory</h2>
                {renderSmartContent(
                  (Array.isArray(disease.specialists) && disease.specialists.length > 0)
                    ? disease.specialists
                    : (disease.specialistsRaw || disease.specialistDirectory)
                )}
              </motion.div>
            )}

            {activeTab === "sources" && (
              <motion.div key="sources" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <h2 className="font-heading text-2xl font-black text-[#112250] mb-4">Sources & Official References</h2>
                {renderSmartContent(
                  (Array.isArray(disease.sources) && disease.sources.length > 0)
                    ? disease.sources
                    : (disease.sourcesRaw || disease.links)
                )}
              </motion.div>
            )}
          </AnimatePresence>
          </div>
        </div>
      </section>
    </main>
  );
}