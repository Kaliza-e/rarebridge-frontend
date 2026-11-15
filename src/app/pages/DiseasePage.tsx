import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchDiseasesFromAPI } from "../data";
import {
  ZebraEmptyState,
  BabyZebraBadge,
  ZebraStripeBackground,
} from "../components/common/Visuals";
import SpecialistAvatar from "../components/common/SpecialistAvatar";
import { generateDiseasePDF } from "../utils/pdf-generator";
import { LinkifiedText, RichTextRunsRenderer } from "../utils/link-helper";
import { getBlocks } from "../utils/rbm";
import { BlocksRenderer } from "../components/rbm";
import {
  Search,
  X,
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
  FileText,
  Dna,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Layers,
  Zap,
  Bot,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";

type DiseasePageProps = {
  diseaseId: string;
  onBack: () => void;
  onSelectDisease?: (id: string) => void;
};

function renderNodeRunsOrString(runsOrText: any) {
  if (!runsOrText) return null;
  if (Array.isArray(runsOrText)) {
    return <RichTextRunsRenderer runs={runsOrText} />;
  }
  if (typeof runsOrText === "string") {
    return <LinkifiedText text={runsOrText} />;
  }
  return String(runsOrText);
}

export default function DiseasePage({ diseaseId, onBack, onSelectDisease }: DiseasePageProps) {
  const [disease, setDisease] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "causes" | "typesAndSymptoms" | "diagnosis" | "lifestyleCommunity" | "researchPharma" | "faqs" | "myths" | "specialists"
  >("overview");

  // All diseases for the Book of Diseases
  const [allDiseases, setAllDiseases] = useState<any[]>([]);
  const [isBookSidebarOpen, setIsBookSidebarOpen] = useState(false);
  const [bookSearchQuery, setBookSearchQuery] = useState("");
  const [bookSelectedCat, setBookSelectedCat] = useState("All");

  // Accordion states
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [openMythIndex, setOpenMythIndex] = useState<number | null>(0);
  const [showAllSymptoms, setShowAllSymptoms] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadDetail() {
      try {
        setLoading(true);
        setLoadError(null);
        const list = await fetchDiseasesFromAPI();
        if (cancelled) return;
        setAllDiseases(list);

        const targetId = String(diseaseId || "").trim().toLowerCase();
        const found = list.find((d: any) => {
          const directId = String(d.id || "").trim().toLowerCase();
          const dNum = String(d.diseaseNumber || "").trim().toLowerCase();
          const dSlug = String(d.name || "").toLowerCase().replace(/\s+/g, "-");
          return directId === targetId || dNum === targetId || dSlug === targetId;
        });

        setDisease(found || null);
      } catch (err) {
        console.error("Failed to load disease detail:", err);
        if (!cancelled) setLoadError("Disease information could not be loaded from the source data. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadDetail();
    return () => {
      cancelled = true;
    };
  }, [diseaseId]);

  // Safe extractors & content availability checks
  const causesList = disease && Array.isArray(disease.causesStructured) && disease.causesStructured.length > 0
    ? disease.causesStructured
    : (disease && typeof disease.causes === "object" && disease.causes !== null
      ? Object.entries(disease.causes).map(([key, val]) => ({ title: `${key.toUpperCase()} CAUSE`, explanation: String(val) }))
      : (disease && typeof disease.causes === "string" && disease.causes.trim()
        ? [{ title: "Primary Causes & Genetic Inheritance", explanation: disease.causes.replace(/^<!--rbm:[^>]*-->\s*/, "") }]
        : []));

  const typesList = disease && Array.isArray(disease.typesStructured) && disease.typesStructured.length > 0
    ? disease.typesStructured
    : (disease && Array.isArray(disease.types) && disease.types.length > 0
      ? disease.types.map((t: any) => ({
        title: t.type || t.name || t.title || "Subtype",
        description: t.description || (t.symptoms ? `Symptoms: ${Array.isArray(t.symptoms) ? t.symptoms.join(", ") : t.symptoms}` : "Clinical form"),
        stage: t.stage,
        severity: t.severity,
        characteristics: Array.isArray(t.characteristics) ? t.characteristics : []
      }))
      : (disease?.typesAndSymptomsRaw
        ? disease.typesAndSymptomsRaw.split(/\r?\n|•/)
          .map((l: string) => l.trim())
          .filter((l: string) => Boolean(l) && !l.startsWith('<!--rbm:'))
          .map((line: string) => {
            const cleaned = line.replace(/[*_#`]/g, '').trim();
            const colon = cleaned.indexOf(':');
            return colon > 0
              ? { title: cleaned.substring(0, colon).trim(), description: cleaned.substring(colon + 1).trim() }
              : { title: "Subtype / Clinical Form", description: cleaned };
          })
        : (disease && Array.isArray(disease.typesAndSymptoms) && disease.typesAndSymptoms.length > 0
          ? disease.typesAndSymptoms
            .map((s: string) => (typeof s === "string" ? s : ""))
            .filter((s: string) => Boolean(s) && !s.startsWith('<!--rbm:'))
            .map((s: string) => {
              const cleaned = s.replace(/[*_#`]/g, '').trim();
              const colon = cleaned.indexOf(':');
              return colon > 0
                ? { title: cleaned.substring(0, colon).trim(), description: cleaned.substring(colon + 1).trim() }
                : { title: "Subtype / Clinical Form", description: cleaned };
            })
          : [])));

  const symptomsList = (
    disease && Array.isArray(disease.symptomsStructured) && disease.symptomsStructured.length > 0
      ? disease.symptomsStructured
      : (disease && Array.isArray(disease.typesAndSymptoms) && disease.typesAndSymptoms.length > 0
        ? disease.typesAndSymptoms
        : (disease && Array.isArray(disease.symptoms) && disease.symptoms.length > 0
          ? disease.symptoms
          : (disease?.typesAndSymptomsRaw
            ? disease.typesAndSymptomsRaw.split(/\r?\n/)
            : [])))
  )
    .map((sym: any) => {
      const rawText = typeof sym === "string" ? sym : sym?.name || "";
      const cleaned = rawText
        .replace(/^<!--rbm:[^>]*-->\s*/, "")
        .replace(/^#+\s*/, "")
        .replace(/[*_#`]/g, "")
        .replace(/^[•·▪▸►\-–—]\s*/, "")
        .trim();
      return cleaned
        ? {
            ...(typeof sym === "object" && sym !== null ? sym : {}),
            name: cleaned,
          }
        : null;
    })
    .filter(Boolean);

  const diagnosticSteps = disease && Array.isArray(disease.diagnosis) && disease.diagnosis.length > 0
    ? disease.diagnosis
    : (disease?.diagnosticSteps || []);

  const researchList = disease && Array.isArray(disease.treatmentsAndPharma) && disease.treatmentsAndPharma.length > 0
    ? disease.treatmentsAndPharma
    : (disease && Array.isArray(disease.research) ? disease.research : []);
  const clinicalTrials = Array.isArray(disease?.clinicalTrials) ? disease.clinicalTrials : researchList;
  const researchOrganizations = Array.isArray(disease?.researchOrganizations)
    ? disease.researchOrganizations
    : [];

  const mythsList = disease && Array.isArray(disease.factsMyths) && disease.factsMyths.length > 0
    ? disease.factsMyths
    : (disease && Array.isArray(disease.myths) ? disease.myths : []);

  const specialistsList = disease && Array.isArray(disease.specialists) && disease.specialists.length > 0
    ? disease.specialists
    : [];

  // RBM blocks
  const overviewBlocks = disease?.rbmBlocks?.overview || getBlocks(disease?.overview);
  const causesBlocks = disease?.rbmBlocks?.causes || getBlocks(disease?.causes);
  const typesSymptomsBlocks = disease?.rbmBlocks?.typesSymptoms || getBlocks(disease?.typesAndSymptoms) || getBlocks(disease?.typesAndSymptomsRaw);
  const diagnosisBlocks = disease?.rbmBlocks?.diagnosis || getBlocks(disease?.diagnosis) || getBlocks(disease?.diagnosisRaw);
  const lifestyleBlocks = disease?.rbmBlocks?.lifestyle || getBlocks(disease?.lifestyleAndDailySupport) || getBlocks(disease?.lifestyleAndDailySupportRaw);
  const researchBlocks = disease?.rbmBlocks?.research || getBlocks(disease?.treatmentsAndPharma) || getBlocks(disease?.treatmentsAndPharmaRaw);
  const faqsBlocks = disease?.rbmBlocks?.faqs || getBlocks(disease?.faqs);
  const mythsBlocks = disease?.rbmBlocks?.myths || getBlocks(disease?.factsMyths);
  const specialistsBlocks = disease?.rbmBlocks?.specialists || getBlocks(disease?.specialists);

  const faqsList = useMemo(() => {
    if (disease && Array.isArray(disease.faqs) && disease.faqs.length > 0) {
      return disease.faqs;
    }
    if (disease && Array.isArray(disease.faq) && disease.faq.length > 0) {
      return disease.faq;
    }
    if (faqsBlocks && faqsBlocks.length > 0) {
      return faqsBlocks
        .filter((b: any) => b.type === "labeled" || (b.type === "record" && b.fields))
        .map((b: any, idx: number) => {
          if (b.type === "labeled") {
            const ans = Array.isArray(b.body)
              ? b.body.map((s: any) => s.t || "").join("")
              : typeof b.body === "string"
              ? b.body
              : "";
            return {
              question: b.label,
              answer: ans.trim(),
              q: b.label,
              a: ans.trim(),
              order: idx + 1,
            };
          }
          if (b.type === "record") {
            const qF = b.fields.find((f: any) => /question/i.test(f.label));
            const aF = b.fields.find((f: any) => /answer/i.test(f.label));
            const qStr = qF
              ? Array.isArray(qF.body)
                ? qF.body.map((s: any) => s.t || "").join("")
                : String(qF.body || "")
              : `Question ${idx + 1}`;
            const aStr = aF
              ? Array.isArray(aF.body)
                ? aF.body.map((s: any) => s.t || "").join("")
                : String(aF.body || "")
              : "";
            return {
              question: qStr.trim(),
              answer: aStr.trim(),
              q: qStr.trim(),
              a: aStr.trim(),
              order: idx + 1,
            };
          }
          return null;
        })
        .filter(Boolean);
    }
    if (typeof disease?.faqs === "string" && disease.faqs.trim()) {
      const cleaned = disease.faqs.replace(/^<!--rbm:[^>]*-->\s*/, "").trim();
      const lines = cleaned.split(/\r?\n/).map((l: string) => l.trim()).filter(Boolean);
      const parsed: any[] = [];
      let currentQ = "";
      let currentA = "";
      for (const line of lines) {
        const match = line.match(/^(?:Q\d*[:.]\s*|\*\*(.+?)\*\*:?\s*|(.+?\?):?\s*)(.*)$/i);
        if (match) {
          if (currentQ) parsed.push({ question: currentQ, answer: currentA.trim(), q: currentQ, a: currentA.trim() });
          currentQ = (match[1] || match[2] || line).trim();
          currentA = match[3] || "";
        } else if (currentQ) {
          currentA += " " + line;
        }
      }
      if (currentQ) parsed.push({ question: currentQ, answer: currentA.trim(), q: currentQ, a: currentA.trim() });
      if (parsed.length > 0) return parsed;
    }
    return [];
  }, [disease, faqsBlocks]);

  const allTabs = [
    { id: "overview", label: "Overview", icon: BookOpen },
    { id: "causes", label: "Causes", icon: Microscope },
    { id: "typesAndSymptoms", label: "Types & Symptoms", icon: Activity },
    { id: "diagnosis", label: "Diagnosis", icon: FileText },
    { id: "lifestyleCommunity", label: "Lifestyle & Daily Support", icon: HeartPulse },
    { id: "researchPharma", label: "Research & Pharma", icon: FlaskConical },
    { id: "faqs", label: "FAQs", icon: HelpCircle },
    { id: "myths", label: "Facts vs. Myths", icon: Lightbulb },
    { id: "specialists", label: "Specialists", icon: Stethoscope },
  ] as const;

  const tabs = allTabs;

  const navigateToTab = (id: typeof activeTab) => {
    setActiveTab(id);
    requestAnimationFrame(() => {
      const target = document.getElementById("editorial-reading-section");
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  };

  // Section lead summaries
  const tabSummaries: Record<string, string> = {
    overview:
      disease?.shortDesc ||
      (typeof disease?.overview === "object" && disease?.overview?.simple ? disease.overview.simple : null) ||
      `${disease?.name || "This condition"} is a rare medical disorder requiring coordinated clinical care, ongoing observation, and dedicated family support.`,
    causes:
      `Underlying genetic variants, biochemical alterations, and biological mechanisms responsible for ${disease?.name || "this condition"}.`,
    typesAndSymptoms:
      `Clinical forms, subtypes, and early warning signs observed across children and adults diagnosed with ${disease?.name || "this condition"}.`,
    diagnosis:
      `Diagnostic criteria, biochemical testing, and genetic screening pathways used by clinical specialists to confirm ${disease?.name || "this condition"}.`,
    lifestyleCommunity:
      `Practical daily care guidance, recommended rehabilitation therapies, nutrition considerations, and peer caregiver support circles.`,
    researchPharma:
      `Investigational therapies, ongoing clinical trial pipelines, and emerging gene-targeted pharmacological research for ${disease?.name || "this condition"}.`,
    faqs:
      `Frequently asked questions and verified clinical answers extracted from medical research documentation.`,
    myths:
      `Common misconceptions versus verified medical facts to ensure accurate family understanding.`,
    specialists:
      `Medical specialists, academic genetic centers, and multidisciplinary clinics experienced in treating ${disease?.name || "this condition"}.`,
  };

  // Sidebar Key Takeaways
  const keyTakeaways = useMemo(() => {
    if (!disease) return [];
    const list: string[] = [];
    if (disease.category) list.push(`Classification: ${disease.category}`);
    if (disease.inheritancePattern) list.push(`Inheritance: ${disease.inheritancePattern}`);
    if (specialistsList.length > 0) list.push(`Primary Care Lead: ${specialistsList[0].profession || specialistsList[0].name}`);
    if (disease.prevalence) list.push(`Prevalence: ${disease.prevalence}`);
    if (list.length === 0) {
      list.push("Verified clinical profile reviewed by medical specialists.");
      list.push("Personalized multi-disciplinary therapy is essential.");
    }
    return list;
  }, [disease, specialistsList]);

  // Jump to links inside the active section
  const jumpLinks = useMemo(() => {
    switch (activeTab) {
      case "overview":
        return [
          { label: "About Condition", href: "#sec-about" },
          { label: "Clinical Summary", href: "#sec-summary" },
          ...(symptomsList.length > 0 ? [{ label: "Key Symptoms", href: "#sec-symptoms-preview" }] : []),
        ];
      case "causes":
        return [
          { label: "Genetic Risk Factors", href: "#sec-causes-list" },
          { label: "Inheritance Pattern", href: "#sec-inheritance" },
        ];
      case "typesAndSymptoms":
        return [
          ...(typesList.length > 0 ? [{ label: "Clinical Subtypes", href: "#sec-subtypes" }] : []),
          { label: "Comprehensive Symptoms", href: "#sec-symptoms-full" },
        ];
      case "diagnosis":
        return [
          { label: "Diagnostic Steps & Tests", href: "#sec-diagnosis-steps" },
          { label: "Confirmatory Criteria", href: "#sec-criteria" },
        ];
      case "lifestyleCommunity":
        return [
          { label: "Recommended Therapies", href: "#sec-therapies" },
          { label: "Nutrition & Diet", href: "#sec-nutrition" },
          { label: "Assistive Devices", href: "#sec-devices" },
          { label: "Caregiver Advice", href: "#sec-caregiver" },
        ];
      case "researchPharma":
        return [
          { label: "Investigational Treatments", href: "#sec-pharma" },
          { label: "Clinical Trials", href: "#sec-trials" },
        ];
      case "faqs":
        return [{ label: "Clinical Q&A", href: "#sec-faqs" }];
      case "myths":
        return [{ label: "Myths vs. Facts", href: "#sec-myths" }];
      case "specialists":
        return [{ label: "Verified Centers & Doctors", href: "#sec-specialists-list" }];
      default:
        return [];
    }
  }, [activeTab, symptomsList.length, typesList.length]);

  const openRareZeChat = () => {
    window.dispatchEvent(new CustomEvent("open-ai-assistant"));
  };

  // Categories & filtering for the Book of Diseases
  const bookCategories = useMemo(() => {
    const cats = new Set<string>();
    cats.add("All");
    allDiseases.forEach((d: any) => {
      if (d.category) cats.add(d.category);
    });
    return Array.from(cats);
  }, [allDiseases]);

  const filteredBookDiseases = useMemo(() => {
    return allDiseases.filter((d: any) => {
      const q = bookSearchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        (d.name && d.name.toLowerCase().includes(q)) ||
        (d.abbreviation && d.abbreviation.toLowerCase().includes(q)) ||
        (d.category && d.category.toLowerCase().includes(q));
      const matchesCat =
        bookSelectedCat === "All" || d.category === bookSelectedCat;
      return matchesSearch && matchesCat;
    });
  }, [allDiseases, bookSearchQuery, bookSelectedCat]);

  const handleSelectDisease = (targetId: string) => {
    if (onSelectDisease) {
      onSelectDisease(targetId);
    }
    if (window.innerWidth < 1024) {
      setIsBookSidebarOpen(false);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
    setActiveTab("overview");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7FBFE] flex items-center justify-center p-6 text-[#112250]">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-12 w-12 rounded-full border-4 border-[#112250]/20 border-t-[#112250] animate-spin" />
          <p className="font-heading font-black text-lg text-[#112250]">Loading medical guide...</p>
          <p className="text-sm text-[#3B507D]">Retrieving verified clinical documentation from knowledge base.</p>
        </div>
      </div>
    );
  }

  if (loadError || !disease) {
    return (
      <div className="min-h-screen bg-[#F7FBFE] flex items-center justify-center p-6 text-[#112250]">
        <div className="max-w-md w-full rounded-3xl border border-[#112250]/15 bg-white p-8 text-center shadow-md space-y-4">
          <ZebraEmptyState message="Disease information unavailable" sub={loadError || "The requested condition record could not be found."} />
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-full bg-[#112250] hover:bg-[#1C376F] text-white px-6 py-3 text-sm font-bold shadow-xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Disease Guide</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-transparent pb-24 text-[#112250] selection:bg-[#D6EAF5] selection:text-[#112250]">
      {/* Background Zebra Stripe & Soft Pastel Glows */}
      <ZebraStripeBackground />

      {/* ================= BOOK OF DISEASES DRAWER / SIDEBAR ================= */}
      <AnimatePresence>
        {isBookSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBookSidebarOpen(false)}
              className="fixed inset-0 z-50 bg-[#112250]/40 backdrop-blur-xs cursor-pointer"
            />

            {/* Drawer panel */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 260 }}
              className="fixed inset-y-0 left-0 z-50 w-full max-w-sm sm:max-w-md bg-white shadow-2xl flex flex-col border-r border-[#112250]/15"
            >
              {/* Drawer Header */}
              <div className="p-4 sm:p-5 border-b border-[#112250]/10 bg-[#F7FBFE] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-10 w-10 rounded-xl bg-[#112250] flex items-center justify-center text-white shadow-xs">
                    <BookOpen className="h-5 w-5 text-[#BCE0F5]" />
                  </div>
                  <div>
                    <h3 className="font-heading font-black text-base text-[#112250] flex items-center gap-2">
                      <span>Book of Diseases</span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#D6EAF5] text-[#112250]">
                        {allDiseases.length} Chapters
                      </span>
                    </h3>
                    <p className="text-xs text-[#3B507D]">Select any condition to switch chapter</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsBookSidebarOpen(false)}
                  className="h-8 w-8 rounded-full hover:bg-[#112250]/10 flex items-center justify-center text-[#3B507D] hover:text-[#112250] transition-colors cursor-pointer"
                  aria-label="Close Book of Diseases"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Search & Filter within Book */}
              <div className="p-4 border-b border-[#112250]/10 space-y-3 bg-white">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#3B507D]" />
                  <input
                    type="text"
                    value={bookSearchQuery}
                    onChange={(e) => setBookSearchQuery(e.target.value)}
                    placeholder="Search condition or category..."
                    className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm rounded-xl border border-[#112250]/15 bg-[#F7FBFE] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#112250]/20 text-[#112250] placeholder:text-[#3B507D]/60"
                  />
                  {bookSearchQuery && (
                    <button
                      onClick={() => setBookSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#3B507D] hover:text-[#112250] p-0.5"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5 text-xs">
                  {bookCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setBookSelectedCat(cat)}
                      className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        bookSelectedCat === cat
                          ? "bg-[#112250] text-white"
                          : "bg-[#F5F4F0] text-[#3B507D] hover:bg-[#D6EAF5] hover:text-[#112250]"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Disease List Items */}
              <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
                {filteredBookDiseases.length === 0 ? (
                  <div className="p-8 text-center text-sm text-[#3B507D]">
                    No diseases match your search.
                  </div>
                ) : (
                  filteredBookDiseases.map((d: any) => {
                    const isCurrent =
                      String(d.id || "").toLowerCase() === String(disease.id || "").toLowerCase() ||
                      String(d.name || "").toLowerCase() === String(disease.name || "").toLowerCase();
                    return (
                      <button
                        key={d.id || d.name}
                        onClick={() => handleSelectDisease(d.id || d.name)}
                        className={`w-full text-left p-3 rounded-2xl transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isCurrent
                            ? "bg-[#112250] text-white shadow-sm ring-2 ring-[#112250]/30"
                            : "hover:bg-[#D6EAF5]/40 text-[#112250] border border-transparent hover:border-[#112250]/10"
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <p className={`font-heading font-bold text-sm truncate ${isCurrent ? "text-white" : "text-[#112250]"}`}>
                            {d.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            {d.category && (
                              <span className={`text-[11px] truncate ${isCurrent ? "text-[#BCE0F5]" : "text-[#3B507D]"}`}>
                                {d.category}
                              </span>
                            )}
                          </div>
                        </div>
                        {isCurrent ? (
                          <span className="shrink-0 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#BCE0F5] text-[#112250]">
                            Reading
                          </span>
                        ) : (
                          <ChevronRight className="h-4 w-4 text-[#3B507D]/40 shrink-0" />
                        )}
                      </button>
                    );
                  })
                )}
              </div>

              {/* Drawer Footer */}
              <div className="p-3 border-t border-[#112250]/10 bg-[#F7FBFE] flex items-center justify-between text-xs text-[#3B507D]">
                <span>Showing {filteredBookDiseases.length} of {allDiseases.length}</span>
                <button
                  type="button"
                  onClick={onBack}
                  className="font-bold text-[#112250] hover:underline cursor-pointer"
                >
                  Go to Disease Guide →
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ================= SLEEK READER TOP BAR (Replaces fixed navbar on disease view) ================= */}
      <nav aria-label="Reader Navigation" className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#112250]/10 shadow-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-4">
          {/* Left: Back to Disease Guide + Book of Diseases Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-heading font-bold text-[#3B507D] hover:text-[#112250] hover:bg-[#D6EAF5]/50 transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Disease Guide</span>
              <span className="sm:hidden">Guide</span>
            </button>

            <div className="h-4 w-px bg-[#112250]/15" />

            <button
              type="button"
              onClick={() => setIsBookSidebarOpen(!isBookSidebarOpen)}
              className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-heading font-bold transition-all cursor-pointer ${
                isBookSidebarOpen
                  ? "bg-[#112250] text-white shadow-xs"
                  : "bg-[#D6EAF5]/60 hover:bg-[#D6EAF5] text-[#112250] border border-[#112250]/10"
              }`}
              title="Open Book of Diseases"
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Book of Diseases</span>
              {allDiseases.length > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${isBookSidebarOpen ? "bg-white/20 text-white" : "bg-white text-[#112250]"}`}>
                  {allDiseases.length}
                </span>
              )}
            </button>
          </div>

          {/* Right: PDF Action */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => generateDiseasePDF(disease)}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#112250] hover:bg-[#1C376F] px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-heading font-bold text-white shadow-xs transition-colors cursor-pointer"
            >
              <Download className="h-3.5 w-3.5 text-[#BCE0F5] shrink-0" />
              <span className="hidden sm:inline">Download Family Guide (PDF)</span>
              <span className="sm:hidden">Family Guide</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ================= EDITORIAL HEADER ================= */}
      <header className="relative pt-6 sm:pt-8 pb-4 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Editorial Header Row: Title & Badges (Repetitive paragraph removed so user reads directly in Overview tab) */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 pb-4 border-b border-[#112250]/10">
          <div className="space-y-3 max-w-3xl">
            {/* Meta Tags */}
            <div className="flex flex-wrap items-center gap-2">
              {disease.category && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#D6EAF5] px-3 py-1 text-xs font-heading font-bold text-[#112250]">
                  <Dna className="h-3 w-3 text-[#112250]" />
                  <span>{disease.category}</span>
                </span>
              )}
              {disease.inheritancePattern && (
                <span className="inline-flex items-center rounded-full bg-white border border-[#112250]/15 px-3 py-1 text-xs font-semibold text-[#3B507D]">
                  {disease.inheritancePattern}
                </span>
              )}
              {(disease as any).researchStatus && (
                <span className="inline-flex items-center rounded-full bg-[#F5F4F0] border border-[#112250]/10 px-3 py-1 text-xs font-semibold text-[#3B507D]">
                  {(disease as any).researchStatus}
                </span>
              )}
            </div>

            {/* Prominent Editorial Title */}
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-[#112250] tracking-tight leading-tight">
              {disease.name}
            </h1>
          </div>
        </div>
      </header>

      {/* ================= STICKY HORIZONTAL TAB NAVIGATION ================= */}
      {tabs.length > 0 && (
        <section className="sticky top-[49px] sm:top-[53px] z-30 py-2.5 bg-[#F7FBFE]/90 backdrop-blur-md border-b border-[#112250]/10 shadow-2xs">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none py-1">
              {tabs.map((tab) => {
                const IconComp = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => navigateToTab(tab.id)}
                    className={`inline-flex shrink-0 items-center gap-2 px-4 py-2 sm:px-4.5 sm:py-2.5 rounded-full text-xs sm:text-sm font-heading font-bold transition-all whitespace-nowrap cursor-pointer min-h-[44px] ${
                      isActive
                        ? "bg-[#112250] text-white shadow-sm"
                        : "text-[#3B507D] hover:text-[#112250] hover:bg-[#D6EAF5]/50 bg-white border border-[#112250]/10"
                    }`}
                  >
                    <IconComp className={`h-4 w-4 shrink-0 ${isActive ? "text-[#BCE0F5]" : "text-[#3B507D]"}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ================= MAIN TWO-COLUMN EDITORIAL READING LAYOUT ================= */}
      <section id="editorial-reading-section" className="scroll-mt-32 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <div className="grid gap-8 lg:grid-cols-12">
          {/* ================= LEFT COLUMN: MAIN READING CANVAS (8 COLS) ================= */}
          <main className="lg:col-span-8">
            <div className="rounded-3xl border border-[#112250]/12 bg-white p-6 sm:p-8 lg:p-10 shadow-xs space-y-8">
              {/* Dynamic Tab Editorial Content */}
              <AnimatePresence mode="wait">
                {/* ── 1. OVERVIEW TAB ── */}
                {activeTab === "overview" && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="space-y-8"
                  >
                    <div id="sec-about" className="space-y-4">
                      <h2 className="font-heading font-black text-2xl sm:text-3xl text-[#112250] pb-3 border-b border-[#112250]/10 flex items-center gap-2.5">
                        <BookOpen className="h-6 w-6 text-[#112250]" />
                        <span>About {disease.name}</span>
                      </h2>

                      {overviewBlocks && overviewBlocks.length > 0 ? (
                        <BlocksRenderer blocks={overviewBlocks} />
                      ) : (
                        <div className="text-base text-[#112250]/90 leading-relaxed font-normal space-y-4">
                          {typeof disease.overview === "object" && disease.overview !== null ? (
                            <>
                              {disease.overview.simple && (
                                <p className="text-base sm:text-lg leading-relaxed text-[#112250]">
                                  <LinkifiedText text={disease.overview.simple} />
                                </p>
                              )}
                              {disease.overview.medical && (
                                <div className="rounded-xl bg-[#F5F4F0] border-l-4 border-[#112250] p-4 sm:p-5 my-4">
                                  <span className="font-heading font-bold text-sm uppercase tracking-wider text-[#112250] block mb-1">
                                    Clinical Definition
                                  </span>
                                  <p className="text-sm sm:text-base text-[#112250]/90 leading-relaxed">
                                    <LinkifiedText text={disease.overview.medical} />
                                  </p>
                                </div>
                              )}
                            </>
                          ) : (
                            <p className="whitespace-pre-line text-base leading-relaxed text-[#112250]/90">
                              {Array.isArray(disease.parsedDiseaseModel?.overview) ? (
                                <RichTextRunsRenderer runs={disease.parsedDiseaseModel.overview} />
                              ) : (
                                <LinkifiedText
                                  text={
                                    (typeof disease.overview === "string"
                                      ? disease.overview.replace(/^<!--rbm:[^>]*-->\s*/, "")
                                      : disease.overview) ||
                                    disease.shortDesc ||
                                    "Comprehensive overview currently being updated."
                                  }
                                />
                              )}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Common Symptoms Checklist Preview */}
                    {symptomsList.length > 0 && (
                      <div id="sec-symptoms-preview" className="pt-6 border-t border-[#112250]/10 space-y-4">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-heading font-bold text-xl text-[#112250] flex items-center gap-2">
                            <Activity className="h-5 w-5 text-[#112250]" />
                            <span>Primary Observed Symptoms</span>
                          </h3>
                          <button
                            onClick={() => navigateToTab("typesAndSymptoms")}
                            className="text-xs sm:text-sm font-bold text-[#112250] hover:underline cursor-pointer"
                          >
                            View full symptom breakdown →
                          </button>
                        </div>
                        <ul className="space-y-3 pl-1">
                          {symptomsList.slice(0, 4).map((sym: any, idx: number) => (
                            <li key={idx} className="flex items-start gap-3 text-base text-[#112250]/90 leading-relaxed">
                              <span className="h-2 w-2 rounded-full bg-[#112250] mt-2 shrink-0" />
                              <span className="font-medium">{sym.name || sym}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* ── 2. CAUSES TAB ── */}
                {activeTab === "causes" && (
                  <motion.div
                    key="causes"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="space-y-8"
                  >
                    <div id="sec-causes-list" className="space-y-4">
                      <h2 className="font-heading font-black text-2xl sm:text-3xl text-[#112250] pb-3 border-b border-[#112250]/10 flex items-center gap-2.5">
                        <Microscope className="h-6 w-6 text-[#112250]" />
                        <span>Causes & Genetic Risk Factors</span>
                      </h2>
                      <p className="text-base sm:text-lg text-[#3B507D] font-normal leading-relaxed">
                        {tabSummaries.causes}
                      </p>

                      {causesBlocks && causesBlocks.length > 0 ? (
                        <BlocksRenderer blocks={causesBlocks} />
                      ) : causesList.length > 0 ? (
                        <div className="space-y-6 pt-2">
                          {causesList.map((cause: any, idx: number) => (
                            <div key={idx} className="space-y-2">
                              <h3 className="font-heading font-bold text-lg text-[#112250] flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-[#112250]" />
                                <span>{cause.title || `Contributing Factor #${idx + 1}`}</span>
                              </h3>
                              <p className="text-base text-[#112250]/90 font-normal leading-relaxed pl-4">
                                <LinkifiedText text={cause.explanation || cause} />
                              </p>
                              {Array.isArray(cause.details) && cause.details.length > 0 && (
                                <ul className="space-y-1.5 pl-8 text-sm text-[#3B507D]">
                                  {cause.details.map((detail: string, dIdx: number) => (
                                    <li key={dIdx} className="flex items-start gap-2">
                                      <span className="h-1.5 w-1.5 rounded-full bg-[#3B507D] mt-2 shrink-0" />
                                      <span>{detail}</span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-base text-[#3B507D] italic">Causes documentation currently being updated.</p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* ── 3. TYPES & SYMPTOMS TAB ── */}
                {activeTab === "typesAndSymptoms" && (
                  <motion.div
                    key="typesAndSymptoms"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="space-y-8"
                  >
                    {/* Subtypes Section */}
                    {typesList.length > 0 && (
                      <div id="sec-subtypes" className="space-y-4">
                        <h2 className="font-heading font-black text-2xl sm:text-3xl text-[#112250] pb-3 border-b border-[#112250]/10 flex items-center gap-2.5">
                          <Layers className="h-6 w-6 text-[#112250]" />
                          <span>Clinical Subtypes & Forms</span>
                        </h2>

                        <div className="space-y-5 pt-2">
                          {typesList.map((type: any, idx: number) => (
                            <div key={idx} className="space-y-1.5">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="font-heading font-bold text-lg text-[#112250]">
                                  {type.title || `Subtype ${idx + 1}`}
                                </h3>
                                {type.stage && (
                                  <span className="rounded-full bg-[#112250] px-2.5 py-0.5 text-xs font-bold text-white uppercase">
                                    {type.stage}
                                  </span>
                                )}
                              </div>
                              <p className="text-base text-[#112250]/90 font-normal leading-relaxed">
                                <LinkifiedText text={type.description} />
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Symptoms Section */}
                    <div id="sec-symptoms-full" className="space-y-4 pt-6 border-t border-[#112250]/10">
                      <h3 className="font-heading font-bold text-xl text-[#112250] flex items-center gap-2">
                        <Activity className="h-5 w-5 text-[#112250]" />
                        <span>Observed Symptoms</span>
                      </h3>

                      {typesSymptomsBlocks && typesSymptomsBlocks.length > 0 ? (
                        <BlocksRenderer blocks={typesSymptomsBlocks} />
                      ) : symptomsList.length > 0 ? (
                        <div className="space-y-4">
                          <ul className="space-y-3">
                            {(showAllSymptoms ? symptomsList : symptomsList.slice(0, 4)).map((sym: any, idx: number) => (
                              <li key={idx} className="flex items-start gap-3 text-base text-[#112250]/90 leading-relaxed">
                                <span className="h-2 w-2 rounded-full bg-[#112250] mt-2 shrink-0" />
                                <span className="font-medium">{sym.name || sym}</span>
                              </li>
                            ))}
                          </ul>

                          {symptomsList.length > 4 && (
                            <button
                              type="button"
                              onClick={() => setShowAllSymptoms((prev) => !prev)}
                              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#112250] hover:text-[#1C376F] pt-2 cursor-pointer underline"
                            >
                              <span>{showAllSymptoms ? "Show fewer symptoms" : `View all ${symptomsList.length} symptoms`}</span>
                              {showAllSymptoms ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </button>
                          )}
                        </div>
                      ) : (
                        <p className="text-base text-[#3B507D] italic">Symptom details currently being updated.</p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* ── 4. DIAGNOSIS TAB ── */}
                {activeTab === "diagnosis" && (
                  <motion.div
                    key="diagnosis"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="space-y-8"
                  >
                    <div id="sec-diagnosis-steps" className="space-y-4">
                      <h2 className="font-heading font-black text-2xl sm:text-3xl text-[#112250] pb-3 border-b border-[#112250]/10 flex items-center gap-2.5">
                        <FileText className="h-6 w-6 text-[#112250]" />
                        <span>Diagnostic Pathways & Criteria</span>
                      </h2>
                      <p className="text-base sm:text-lg text-[#3B507D] font-normal leading-relaxed">
                        {tabSummaries.diagnosis}
                      </p>

                      {diagnosisBlocks && diagnosisBlocks.length > 0 ? (
                        <BlocksRenderer blocks={diagnosisBlocks} />
                      ) : diagnosticSteps.length > 0 ? (
                        <div className="space-y-6 pt-2">
                          {diagnosticSteps.map((step: any, idx: number) => (
                            <div key={idx} className="space-y-1.5">
                              <h3 className="font-heading font-bold text-lg text-[#112250] flex items-center gap-2">
                                <span className="font-black text-sm text-[#112250] bg-[#D6EAF5] px-2 py-0.5 rounded-full">
                                  Step {idx + 1}
                                </span>
                                <span>{step.name || step.title || step.test || `Diagnostic Test #${idx + 1}`}</span>
                              </h3>
                              <p className="text-base text-[#112250]/90 font-normal leading-relaxed pl-2">
                                <LinkifiedText text={step.desc || step.details || step.explanation || step} />
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-base text-[#3B507D] italic">Diagnostic testing details currently being updated.</p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* ── 5. LIFESTYLE & DAILY SUPPORT TAB ── */}
                {activeTab === "lifestyleCommunity" && (
                  <motion.div
                    key="lifestyle"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="space-y-8"
                  >
                    <div className="space-y-4">
                      <h2 className="font-heading font-black text-2xl sm:text-3xl text-[#112250] pb-3 border-b border-[#112250]/10 flex items-center gap-2.5">
                        <HeartPulse className="h-6 w-6 text-[#112250]" />
                        <span>Daily Living & Family Support</span>
                      </h2>
                      <p className="text-base sm:text-lg text-[#3B507D] font-normal leading-relaxed">
                        {tabSummaries.lifestyleCommunity}
                      </p>

                      {lifestyleBlocks && lifestyleBlocks.length > 0 ? (
                        <BlocksRenderer blocks={lifestyleBlocks} />
                      ) : (
                        <div className="space-y-8 pt-2">
                          {/* Therapies */}
                          <div id="sec-therapies" className="space-y-3">
                            <h3 className="font-heading font-bold text-xl text-[#112250] flex items-center gap-2">
                              <Activity className="h-5 w-5 text-[#112250]" />
                              <span>1. Recommended Therapies</span>
                            </h3>
                            {Array.isArray(disease.lifestyleAndDailySupport?.therapies) && disease.lifestyleAndDailySupport.therapies.length > 0 ? (
                              <ul className="space-y-2.5 pl-2">
                                {disease.lifestyleAndDailySupport.therapies.map((th: any, idx: number) => (
                                  <li key={idx} className="flex items-start gap-3 text-base text-[#112250]/90 leading-relaxed">
                                    <span className="h-1.5 w-1.5 rounded-full bg-[#112250] mt-2 shrink-0" />
                                    <span>{typeof th === "string" ? th : `${th.name}${th.desc ? `: ${th.desc}` : ""}`}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-base text-[#3B507D] italic pl-2">Physical, speech, and occupational therapies.</p>
                            )}
                          </div>

                          {/* Nutrition */}
                          <div id="sec-nutrition" className="space-y-3 pt-4 border-t border-[#112250]/10">
                            <h3 className="font-heading font-bold text-xl text-[#112250] flex items-center gap-2">
                              <HeartPulse className="h-5 w-5 text-[#112250]" />
                              <span>2. Dietary & Nutritional Considerations</span>
                            </h3>
                            <div className="text-base text-[#112250]/90 font-normal leading-relaxed pl-2">
                              {disease.lifestyleAndDailySupport?.nutrition ? (
                                <LinkifiedText text={disease.lifestyleAndDailySupport.nutrition} />
                              ) : (
                                <p className="text-base text-[#3B507D] italic">Nutritional and dietary guidelines.</p>
                              )}
                            </div>
                          </div>

                          {/* Assistive Devices */}
                          <div id="sec-devices" className="space-y-3 pt-4 border-t border-[#112250]/10">
                            <h3 className="font-heading font-bold text-xl text-[#112250] flex items-center gap-2">
                              <Zap className="h-5 w-5 text-[#112250]" />
                              <span>3. Assistive Devices & Medical Equipment</span>
                            </h3>
                            {Array.isArray(disease.lifestyleAndDailySupport?.devices) && disease.lifestyleAndDailySupport.devices.length > 0 ? (
                              <ul className="space-y-2.5 pl-2">
                                {disease.lifestyleAndDailySupport.devices.map((dev: string, idx: number) => (
                                  <li key={idx} className="flex items-start gap-3 text-base text-[#112250]/90 leading-relaxed">
                                    <span className="h-1.5 w-1.5 rounded-full bg-[#112250] mt-2 shrink-0" />
                                    <span>{dev}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-base text-[#3B507D] italic pl-2">Assistive equipment and mobility aids.</p>
                            )}
                          </div>

                          {/* Caregiver Tips */}
                          <div id="sec-caregiver" className="space-y-3 pt-4 border-t border-[#112250]/10">
                            <h3 className="font-heading font-bold text-xl text-[#112250] flex items-center gap-2">
                              <CheckCircle className="h-5 w-5 text-[#112250]" />
                              <span>4. Daily Caregiver Advice & Support</span>
                            </h3>
                            {Array.isArray(disease.lifestyleAndDailySupport?.caregiverAdvice) && disease.lifestyleAndDailySupport.caregiverAdvice.length > 0 ? (
                              <ul className="space-y-2.5 pl-2">
                                {disease.lifestyleAndDailySupport.caregiverAdvice.map((tip: string, idx: number) => (
                                  <li key={idx} className="flex items-start gap-3 text-base text-[#112250]/90 leading-relaxed">
                                    <span className="h-1.5 w-1.5 rounded-full bg-[#112250] mt-2 shrink-0" />
                                    <span>{tip}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-base text-[#3B507D] italic pl-2">Practical caregiver coping advice.</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* ── 6. RESEARCH & PHARMA TAB ── */}
                {activeTab === "researchPharma" && (
                  <motion.div
                    key="researchPharma"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="space-y-8"
                  >
                    <div id="sec-pharma" className="space-y-4">
                      <h2 className="font-heading font-black text-2xl sm:text-3xl text-[#112250] pb-3 border-b border-[#112250]/10 flex items-center gap-2.5">
                        <FlaskConical className="h-6 w-6 text-[#112250]" />
                        <span>Treatments, Clinical Trials & Research</span>
                      </h2>
                      <p className="text-base sm:text-lg text-[#3B507D] font-normal leading-relaxed">
                        {tabSummaries.researchPharma}
                      </p>

                      {researchBlocks && researchBlocks.length > 0 ? (
                        <BlocksRenderer blocks={researchBlocks} />
                      ) : researchList.length > 0 ? (
                        <div className="space-y-6 pt-2">
                          {researchList.map((item: any, idx: number) => (
                            <div key={idx} className="space-y-1.5">
                              <h3 className="font-heading font-bold text-lg text-[#112250] flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-[#112250]" />
                                <span>{item.name || item.title || `Therapy #${idx + 1}`}</span>
                              </h3>
                              <p className="text-base text-[#112250]/90 font-normal leading-relaxed pl-4">
                                <LinkifiedText text={item.desc || item.details || item.explanation || item} />
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-base text-[#3B507D] italic">Investigational pipeline details currently being updated.</p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* ── 7. FAQS TAB (COLLAPSIBLE ACCORDION) ── */}
                {activeTab === "faqs" && (
                  <motion.div
                    key="faqs"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="space-y-6"
                  >
                    <div id="sec-faqs" className="space-y-4">
                      <h2 className="font-heading font-black text-2xl sm:text-3xl text-[#112250] pb-3 border-b border-[#112250]/10 flex items-center gap-2.5">
                        <HelpCircle className="h-6 w-6 text-[#112250]" />
                        <span>Frequently Asked Questions</span>
                      </h2>
                      <p className="text-base sm:text-lg text-[#3B507D] font-normal leading-relaxed">
                        {tabSummaries.faqs}
                      </p>

                      {faqsList.length > 0 ? (
                        <div className="space-y-3 pt-2">
                          {faqsList.map((faq: any, idx: number) => {
                            const isOpen = openFaqIndex === idx;
                            return (
                              <div key={idx} className="rounded-2xl border border-[#112250]/12 bg-[#F7FBFE] overflow-hidden transition-all">
                                <button
                                  type="button"
                                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                                  className="flex w-full items-center justify-between p-4 sm:p-5 text-left font-heading font-bold text-base text-[#112250] hover:bg-[#D6EAF5]/40 transition-colors cursor-pointer"
                                >
                                  <span className="flex items-center gap-3 pr-2">
                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#112250] text-xs font-bold text-white">
                                      Q
                                    </span>
                                    <span>{faq.question || faq.q}</span>
                                  </span>
                                  {isOpen ? (
                                    <ChevronUp className="h-5 w-5 text-[#112250] shrink-0" />
                                  ) : (
                                    <ChevronDown className="h-5 w-5 text-[#3B507D] shrink-0" />
                                  )}
                                </button>
                                {isOpen && (
                                  <div className="p-4 sm:p-5 pt-0 border-t border-[#112250]/10 bg-white">
                                    <p className="text-base text-[#112250]/90 font-normal leading-relaxed">
                                      <LinkifiedText text={faq.answer || faq.a} />
                                    </p>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-base text-[#3B507D] italic">FAQ documentation currently being updated.</p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* ── 8. FACTS VS. MYTHS TAB (COLLAPSIBLE ACCORDION) ── */}
                {activeTab === "myths" && (
                  <motion.div
                    key="myths"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="space-y-6"
                  >
                    <div id="sec-myths" className="space-y-4">
                      <h2 className="font-heading font-black text-2xl sm:text-3xl text-[#112250] pb-3 border-b border-[#112250]/10 flex items-center gap-2.5">
                        <Lightbulb className="h-6 w-6 text-[#112250]" />
                        <span>Facts vs. Common Misconceptions</span>
                      </h2>
                      <p className="text-base sm:text-lg text-[#3B507D] font-normal leading-relaxed">
                        {tabSummaries.myths}
                      </p>

                      {mythsBlocks && mythsBlocks.length > 0 ? (
                        <BlocksRenderer blocks={mythsBlocks} />
                      ) : mythsList.length > 0 ? (
                        <div className="space-y-4 pt-2">
                          {mythsList.map((m: any, idx: number) => {
                            const isOpen = openMythIndex === idx;
                            const mythText = typeof m === "string" ? m : m.myth || m.statement || "Misconception";
                            const factText = typeof m === "object" && m.fact ? m.fact : "Verified clinical fact clarified by medical literature.";

                            return (
                              <div key={idx} className="rounded-2xl border border-[#112250]/12 bg-[#F7FBFE] overflow-hidden">
                                <button
                                  type="button"
                                  onClick={() => setOpenMythIndex(isOpen ? null : idx)}
                                  className="flex w-full items-center justify-between p-4 sm:p-5 text-left font-heading font-bold text-base text-[#112250] hover:bg-[#D6EAF5]/40 transition-colors cursor-pointer"
                                >
                                  <span className="flex items-center gap-2.5 pr-2">
                                    <span className="rounded-full bg-[#112250] px-2.5 py-0.5 text-xs font-bold text-white shrink-0">
                                      Myth
                                    </span>
                                    <span>{mythText}</span>
                                  </span>
                                  {isOpen ? (
                                    <ChevronUp className="h-5 w-5 text-[#112250] shrink-0" />
                                  ) : (
                                    <ChevronDown className="h-5 w-5 text-[#3B507D] shrink-0" />
                                  )}
                                </button>
                                {isOpen && (
                                  <div className="p-4 sm:p-5 pt-0 border-t border-[#112250]/10 bg-white">
                                    <div className="rounded-xl bg-[#F5F4F0] border-l-4 border-[#112250] p-4">
                                      <div className="flex items-center gap-2 mb-1">
                                        <CheckCircle className="h-4 w-4 text-[#112250]" />
                                        <span className="font-heading font-bold text-xs uppercase tracking-wider text-[#112250]">
                                          Medical Fact
                                        </span>
                                      </div>
                                      <p className="text-base text-[#112250]/90 font-normal leading-relaxed">
                                        <LinkifiedText text={factText} />
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-base text-[#3B507D] italic">No Myth vs. Fact pairs available.</p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* ── 9. SPECIALISTS TAB ── */}
                {activeTab === "specialists" && (
                  <motion.div
                    key="specialists"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="space-y-6"
                  >
                    <div id="sec-specialists-list" className="space-y-4">
                      <h2 className="font-heading font-black text-2xl sm:text-3xl text-[#112250] pb-3 border-b border-[#112250]/10 flex items-center gap-2.5">
                        <Stethoscope className="h-6 w-6 text-[#112250]" />
                        <span>Verified Specialists & Clinical Centers</span>
                      </h2>
                      <p className="text-base sm:text-lg text-[#3B507D] font-normal leading-relaxed">
                        {tabSummaries.specialists}
                      </p>

                      {specialistsBlocks && specialistsBlocks.length > 0 ? (
                        <BlocksRenderer blocks={specialistsBlocks} />
                      ) : specialistsList.length > 0 ? (
                        <div className="grid gap-4 sm:grid-cols-2 pt-2">
                          {specialistsList.map((spec: any, idx: number) => (
                            <div key={idx} className="rounded-2xl border border-[#112250]/15 bg-[#F7FBFE] p-5 flex flex-col justify-between space-y-3">
                              <div className="flex items-start gap-3">
                                <SpecialistAvatar name={spec.name} size={48} className="h-12 w-12" />
                                <div>
                                  <h3 className="font-heading font-bold text-base text-[#112250]">{spec.name}</h3>
                                  <p className="text-xs font-semibold text-[#3B507D] mt-0.5">{spec.profession || "Specialist"}</p>
                                  {spec.organization && (
                                    <p className="text-xs text-[#112250] mt-1 flex items-center gap-1">
                                      <Building2 className="h-3.5 w-3.5 text-[#3B507D] shrink-0" />
                                      <span className="truncate">{spec.organization}</span>
                                    </p>
                                  )}
                                </div>
                              </div>
                              {spec.specialization && (
                                <p className="text-xs text-[#112250]/90 font-normal leading-relaxed pl-3 border-l-2 border-[#112250]">
                                  {spec.specialization}
                                </p>
                              )}
                              {spec.contact && (
                                <a
                                  href={spec.contact.startsWith("http") ? spec.contact : `https://${spec.contact}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs font-bold text-[#112250] hover:underline pt-2"
                                >
                                  <span>Contact Specialist</span>
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-base text-[#3B507D] italic">Specialist directory currently being updated.</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Disclaimer */}
              <div className="pt-8 mt-12 border-t border-[#112250]/10 text-center">
                <p className="text-xs text-[#3B507D] font-normal leading-relaxed max-w-2xl mx-auto">
                  This clinical summary is provided for educational and caregiver support purposes only. Always consult a qualified medical specialist or genetic counselor for personal health diagnosis and treatment decisions.
                </p>
              </div>
            </div>
          </main>

          {/* ================= RIGHT COLUMN: SECONDARY INFORMATION SIDEBAR (4 COLS) ================= */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="lg:sticky lg:top-28 space-y-6">
              {/* Sidebar Box 0: Book of Diseases Quick Switcher */}
              <div className="rounded-3xl border border-[#112250]/12 bg-[#D6EAF5]/40 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-heading font-black text-[#112250] uppercase tracking-wider">
                    <BookOpen className="h-4 w-4 text-[#112250]" />
                    <span>Book of Diseases</span>
                  </div>
                  <span className="text-[11px] font-bold text-[#3B507D]">
                    {allDiseases.length} chapters
                  </span>
                </div>
                <p className="text-xs text-[#3B507D] leading-relaxed">
                  Flip through our medical catalogue of rare disease condition chapters.
                </p>
                <button
                  type="button"
                  onClick={() => setIsBookSidebarOpen(true)}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#112250] hover:bg-[#1C376F] px-4 py-2.5 text-xs font-heading font-bold text-white shadow-xs transition-colors cursor-pointer"
                >
                  <BookOpen className="h-3.5 w-3.5 text-[#BCE0F5]" />
                  <span>Browse All Chapters</span>
                </button>
              </div>

              {/* Sidebar Box 1: At a Glance (Key Clinical Facts & Takeaways) */}
              <div className="rounded-3xl border border-[#112250]/12 bg-white p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#112250]/10">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#D6EAF5] text-[#112250]">
                      <ShieldCheck className="h-4 w-4" />
                    </span>
                    <h3 className="font-heading font-black text-sm uppercase tracking-wider text-[#112250]">
                      At a Glance
                    </h3>
                  </div>
                  <BabyZebraBadge size={20} />
                </div>

                <div className="space-y-3">
                  {keyTakeaways.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-sm text-[#112250]/90 font-normal leading-relaxed">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#112250] mt-2 shrink-0" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sidebar Box 2: Contextual "Jump to" List */}
              {jumpLinks.length > 0 && (
                <div className="rounded-3xl border border-[#112250]/12 bg-white p-6 shadow-xs space-y-3">
                  <h4 className="font-heading font-black text-xs uppercase tracking-wider text-[#112250] flex items-center gap-2">
                    <Zap className="h-4 w-4 text-[#112250]" />
                    <span>In this section</span>
                  </h4>
                  <div className="space-y-1.5 pt-1">
                    {jumpLinks.map((link, idx) => (
                      <a
                        key={idx}
                        href={link.href}
                        className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-[#112250] bg-[#F7FBFE] hover:bg-[#D6EAF5]/60 transition-colors min-h-[44px]"
                      >
                        <span>{link.label}</span>
                        <ChevronRight className="h-4 w-4 text-[#3B507D]" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Sidebar Box 3: Ask Rare-Ze Assistant */}
              <div className="rounded-3xl border border-[#112250]/12 bg-white p-6 shadow-xs space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-[#112250]" />
                    <span className="font-heading font-black text-sm text-[#112250]">Rare-Ze Assistant</span>
                  </div>
                  <BabyZebraBadge size={22} />
                </div>
                <p className="text-xs text-[#3B507D] font-normal leading-relaxed">
                  Have questions about symptoms, tests, or therapies for <strong>{disease.name}</strong>?
                </p>
                <button
                  type="button"
                  onClick={openRareZeChat}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#112250] hover:bg-[#1C376F] px-4 py-3 text-xs sm:text-sm font-bold text-white shadow-xs transition-all duration-200 cursor-pointer min-h-[44px]"
                >
                  <MessageCircle className="h-4 w-4 text-[#BCE0F5]" />
                  <span>Chat with Rare-Ze</span>
                </button>
              </div>

              {/* Sidebar Box 4: Quick PDF Download Action */}
              <div className="rounded-3xl border border-[#112250]/12 bg-[#F5F4F0] p-6 text-center space-y-2.5">
                <h4 className="font-heading font-black text-xs uppercase tracking-wider text-[#112250]">
                  Printable Guide
                </h4>
                <p className="text-xs text-[#3B507D] font-normal leading-relaxed">
                  Download the full formatted Family Medical Guide to share with doctors and caregivers.
                </p>
                <button
                  type="button"
                  onClick={() => generateDiseasePDF(disease)}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-white border border-[#112250]/20 hover:border-[#112250] px-4 py-2.5 text-xs font-bold text-[#112250] transition-colors cursor-pointer shadow-2xs min-h-[44px]"
                >
                  <Download className="h-3.5 w-3.5 text-[#112250]" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
