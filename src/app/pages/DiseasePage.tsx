import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchDiseasesFromAPI } from "../data";
import {
  ZebraEmptyState,
  ZebraGridDoodle,
  BabyZebraBadge,
  ZebraCloudBlob,
} from "../components/common/Visuals";
import SpecialistAvatar from "../components/common/SpecialistAvatar";
import { generateDiseasePDF } from "../utils/pdf-generator";
import { LinkifiedText, RichTextRunsRenderer } from "../utils/link-helper";
import { getBlocks } from "../utils/rbm";
import { BlocksRenderer } from "../components/rbm";
import type { ParsedSection, ContentNode } from "../services/api.service";
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
  ChevronRight,
  Clock,
  Star,
  Layers,
  FileCheck,
  Droplets,
  Zap,
  Users,
  Bot,
  Sparkles,
  MessageCircle,
} from "lucide-react";

type DiseasePageProps = {
  diseaseId: string;
  onBack: () => void;
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

function ContentNodeRenderer({ nodes }: { nodes?: any[] }) {
  if (!nodes || !Array.isArray(nodes) || nodes.length === 0) return null;

  return (
    <div className="space-y-3">
      {nodes.map((node, idx) => {
        if (!node) return null;

        if (node.type === "section" || node.type === "subsection") {
          return (
            <div key={idx} className="rounded-2xl border border-[#112250]/15 bg-white p-5 space-y-3 shadow-xs card-hover-lift">
              {node.title && (
                <h3 className="font-heading font-black text-base text-[#112250] flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-[#112250]" />
                  {renderNodeRunsOrString(node.title)}
                </h3>
              )}
              {node.content && (
                <p className="text-base text-[#112250] font-medium leading-relaxed">
                  {renderNodeRunsOrString(node.content)}
                </p>
              )}
              {Array.isArray(node.children) && node.children.length > 0 && (
                <div className="pl-3 border-l-2 border-[#D6EAF5]">
                  <ContentNodeRenderer nodes={node.children} />
                </div>
              )}
            </div>
          );
        }

        if (node.type === "bullet") {
          return (
            <div key={idx} className="flex items-start gap-2.5 text-base text-[#112250] font-medium leading-relaxed">
              <span className="h-2 w-2 rounded-full bg-[#112250] mt-2 shrink-0" />
              <span>{renderNodeRunsOrString(node.content)}</span>
            </div>
          );
        }

        if (node.type === "numbered") {
          return (
            <div key={idx} className="flex items-start gap-2.5 text-base text-[#112250] font-medium leading-relaxed">
              <span className="font-bold text-[#112250] shrink-0">{idx + 1}.</span>
              <span>{renderNodeRunsOrString(node.content)}</span>
            </div>
          );
        }

        return (
          <div key={idx} className="text-base font-medium text-[#112250] leading-relaxed">
            {renderNodeRunsOrString(node.content)}
          </div>
        );
      })}
    </div>
  );
}

function StructuredSections({ sections, emptyHeading }: { sections: ParsedSection[]; emptyHeading: string }) {
  if (!sections.length) return null;
  return (
    <div className="space-y-3">
      {sections.map((section, index) => (
        <details key={`${section.title}-${index}`} className="group rounded-2xl border border-[#112250]/15 bg-white overflow-hidden shadow-xs">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 sm:p-5 text-base font-bold text-[#112250] marker:content-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#112250] bg-[#F7FBFE] hover:bg-[#D6EAF5]/40 transition-colors">
            <span className="font-heading font-black">{section.title || emptyHeading}</span>
            <ChevronDown className="h-5 w-5 shrink-0 text-[#112250] transition-transform group-open:rotate-180" aria-hidden="true" />
          </summary>
          <div className="border-t border-[#112250]/10 bg-white p-5">
            {section.content?.length ? (
              <ContentNodeRenderer nodes={section.content as ContentNode[]} />
            ) : (
              <p className="whitespace-pre-line text-base leading-relaxed text-[#112250]">
                <LinkifiedText text={section.raw} />
              </p>
            )}
          </div>
        </details>
      ))}
    </div>
  );
}

export default function DiseasePage({ diseaseId, onBack }: DiseasePageProps) {
  const [disease, setDisease] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "causes"
    | "typesAndSymptoms"
    | "diagnosis"
    | "lifestyleCommunity"
    | "researchPharma"
    | "faqs"
    | "myths"
    | "specialists"
  >("overview");

  // State for FAQ accordion toggle
  const [openFaqIndices, setOpenFaqIndices] = useState<Record<number, boolean>>({ 0: true });

  // State for Myths accordion toggle
  const [openMythIndices, setOpenMythIndices] = useState<Record<number, boolean>>({ 0: true });

  // State for symptoms list view expansion (first 4 visible by default)
  const [showAllSymptoms, setShowAllSymptoms] = useState(false);

  // State for Lifestyle accordions
  const [openLifestyleAccordions, setOpenLifestyleAccordions] = useState<Record<string, boolean>>({
    therapies: true,
    nutrition: false,
    devices: false,
    caregiverTips: false,
    community: false,
  });

  const toggleLifestyleAccordion = (key: string) => {
    setOpenLifestyleAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    let cancelled = false;

    async function loadDetail() {
      setLoading(true);
      setLoadError("");
      try {
        const allDiseases = await fetchDiseasesFromAPI();
        if (cancelled) return;

        const targetId = String(diseaseId || "").trim().toLowerCase();
        const targetClean = targetId.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
        const targetSlug = targetId.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

        const found = allDiseases.find((d: any) => {
          if (!d) return false;
          const dId = String(d.id || "").trim().toLowerCase();
          const dNum = String(d.diseaseNumber || "").trim().toLowerCase();
          const dName = String(d.name || "").trim().toLowerCase();
          const dNorm = dName.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          const dSlug = dNorm.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
          const dClean = dNorm.replace(/[^a-z0-9]/g, "");

          return (
            dId === targetId ||
            dNum === targetId ||
            dName === targetId ||
            dSlug === targetSlug ||
            (targetClean.length > 2 && dClean === targetClean)
          );
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
  const diagnosisSections: ParsedSection[] = Array.isArray(disease?.diagnosisSections)
    ? disease.diagnosisSections
    : [];

  const researchList = disease && Array.isArray(disease.treatmentsAndPharma) && disease.treatmentsAndPharma.length > 0
    ? disease.treatmentsAndPharma
    : (disease && Array.isArray(disease.research) ? disease.research : []);
  const clinicalTrials = Array.isArray(disease?.clinicalTrials) ? disease.clinicalTrials : researchList;
  const researchOrganizations = Array.isArray(disease?.researchOrganizations)
    ? disease.researchOrganizations
    : [];
  const typesAndSymptomsSections: ParsedSection[] = Array.isArray(disease?.typesAndSymptomsSections)
    ? disease.typesAndSymptomsSections
    : [];
  const treatmentSections: ParsedSection[] = Array.isArray(disease?.treatmentSections)
    ? disease.treatmentSections
    : [];
  const clinicalTrialSections: ParsedSection[] = Array.isArray(disease?.researchSections)
    ? disease.researchSections.filter((section: any) => section.kind === "clinicalTrials")
    : [];
  const lifestyleSections: ParsedSection[] = Array.isArray(disease?.lifestyleAndDailySupport?.sections)
    ? disease.lifestyleAndDailySupport.sections.filter((section: ParsedSection) => !/community|support (?:groups?|networks?|resources?)|regional.*groups?/i.test(section.title))
    : [];
  const communityResources = Array.isArray(disease?.lifestyleAndDailySupport?.communities)
    ? disease.lifestyleAndDailySupport.communities
    : [];

  const mythsList = disease && Array.isArray(disease.factsMyths) && disease.factsMyths.length > 0
    ? disease.factsMyths
    : (disease && Array.isArray(disease.myths) ? disease.myths : []);

  const specialistsList = disease && Array.isArray(disease.specialists) && disease.specialists.length > 0
    ? disease.specialists
    : [];

  const sourcesList = disease && Array.isArray(disease.sources) && disease.sources.length > 0
    ? disease.sources
    : (disease && Array.isArray(disease.links) ? disease.links : []);

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
      document.getElementById("disease-tab-content")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const toggleFaq = (idx: number) => {
    setOpenFaqIndices((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleMyth = (idx: number) => {
    setOpenMythIndices((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const openRareZeChat = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-ai-assistant"));
    }
  };

  // Plain-language 1-2 sentence summaries for each tab
  const tabSummaries = useMemo(() => {
    if (!disease) return {};
    const rawOverviewStr = typeof disease.overview === "string"
      ? disease.overview.replace(/^<!--rbm:[^>]*-->\s*/, '').replace(/[*_#`]/g, '').trim()
      : (disease.overview?.simple || disease.overview?.medical || disease.shortDesc || "");

    const firstTwoSentences = rawOverviewStr
      .split(/(?<=[.!?])\s+/)
      .slice(0, 2)
      .join(" ") || `${disease.name} is a recognized rare health condition requiring specialized care and guidance.`;

    return {
      overview: firstTwoSentences,
      causes: `${disease.name} is primarily driven by genetic or biological alterations, though environmental and individual modifiers may also contribute.`,
      typesAndSymptoms: `Symptoms can appear gradually or across distinct subtypes, often affecting multiple bodily systems with varying degrees of severity.`,
      diagnosis: `Clinicians confirm ${disease.name} through comprehensive physical evaluations, targeted genetic testing, blood biomarkers, and specialized imaging.`,
      lifestyleCommunity: `Consistent daily therapies, tailored nutritional support, adaptive equipment, and connected family communities make a lasting difference.`,
      researchPharma: `Clinical teams and research institutions worldwide are actively investigating novel therapies, targeted drug candidates, and observational trials.`,
      faqs: `Here are clear, medical-backed answers to the questions patients, caregivers, and families ask most frequently.`,
      myths: `Medical science is continually evolving. Here we pair common misconceptions with verified clinical facts to keep your family informed.`,
      specialists: `Consulting experienced multidisciplinary clinicians and specialist centers provides the highest quality care and surveillance.`,
    };
  }, [disease]);

  // Contextual Jump-To Anchors per tab
  const jumpLinks = useMemo(() => {
    switch (activeTab) {
      case "overview":
        return [
          { label: "At a Glance", href: "#sec-summary" },
          { label: "Quick Facts", href: "#sec-fact-cards" },
          { label: "Detailed Medical Overview", href: "#sec-detail" },
          { label: "Common Symptoms", href: "#sec-symptoms-preview" },
        ];
      case "causes":
        return [
          { label: "Summary & Facts", href: "#sec-fact-cards" },
          { label: "Genetic Risk Factors", href: "#sec-causes-list" },
          { label: "Inheritance Pattern", href: "#sec-inheritance" },
        ];
      case "typesAndSymptoms":
        return [
          { label: "Summary & Facts", href: "#sec-fact-cards" },
          { label: "Clinical Subtypes", href: "#sec-subtypes" },
          { label: "Symptoms Checklist", href: "#sec-symptoms-list" },
        ];
      case "diagnosis":
        return [
          { label: "Summary & Facts", href: "#sec-fact-cards" },
          { label: "Diagnostic Steps", href: "#sec-diagnostic-steps" },
          { label: "Testing Methods", href: "#sec-testing" },
        ];
      case "lifestyleCommunity":
        return [
          { label: "Daily Support Overview", href: "#sec-fact-cards" },
          { label: "Therapies & Diets", href: "#sec-therapies" },
          { label: "Caregiver Tips & Groups", href: "#sec-caregiver" },
        ];
      case "researchPharma":
        return [
          { label: "Pipeline Overview", href: "#sec-fact-cards" },
          { label: "Active Treatments", href: "#sec-treatments" },
          { label: "Clinical Trials & Centers", href: "#sec-trials" },
        ];
      case "faqs":
        return [
          { label: "Overview", href: "#sec-fact-cards" },
          { label: "Browse All Questions", href: "#sec-faqs-accordion" },
        ];
      case "myths":
        return [
          { label: "Overview", href: "#sec-fact-cards" },
          { label: "Myth vs. Fact Pairs", href: "#sec-myths-accordion" },
        ];
      case "specialists":
        return [
          { label: "Specialty Focus", href: "#sec-fact-cards" },
          { label: "Clinical Directory", href: "#sec-specialists-list" },
        ];
      default:
        return [];
    }
  }, [activeTab]);

  // Key Takeaways per tab
  const keyTakeaways = useMemo(() => {
    if (!disease) return [];
    switch (activeTab) {
      case "overview":
        return [
          `${disease.name} has recognized medical pathways and dedicated clinical resources.`,
          "Early diagnosis and specialized multidisciplinary care significantly improve quality of life.",
        ];
      case "causes":
        return [
          "Understanding the underlying genetic or cellular cause helps guide targeted therapeutic plans.",
          "Genetic counseling is recommended for families seeking clarity on inheritance risks.",
        ];
      case "typesAndSymptoms":
        return [
          "Symptoms vary by subtype and patient age—monitoring progression helps doctors adjust interventions early.",
          "Tracking new symptoms in a simple journal helps clinical appointments remain focused.",
        ];
      case "diagnosis":
        return [
          "A definitive diagnosis typically combines molecular genetic tests with specialized clinical imaging.",
          "Second opinions at certified rare disease referral centers can confirm complex findings.",
        ];
      case "lifestyleCommunity":
        return [
          "Physical and occupational therapies preserve daily mobility and independence.",
          "Connecting with peer support groups helps families share practical day-to-day tips.",
        ];
      case "researchPharma":
        return [
          "New observational studies and targeted therapeutic pipelines are active worldwide.",
          "Talk to your specialist before applying to clinical trials to verify eligibility criteria.",
        ];
      case "faqs":
        return [
          "Clear information dispels uncertainty and helps caregivers advocate with confidence.",
          "Ask your medical team whenever a symptom or treatment plan feels unclear.",
        ];
      case "myths":
        return [
          "Verified medical facts protect families from unproven or potentially harmful claims.",
          "Always verify treatment guidance with licensed clinicians specializing in this disease.",
        ];
      case "specialists":
        return [
          "Experienced specialists coordinate comprehensive care across organs and body systems.",
          "Telemedicine and regional center partnerships make expert consultations more accessible.",
        ];
      default:
        return ["Personalized care and regular consultations help manage this condition effectively."];
    }
  }, [disease, activeTab]);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center bg-[#F7FBFE] p-8 text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#112250] border-t-transparent mb-4" />
        <p className="text-base font-bold text-[#112250]">Loading disease information...</p>
      </div>
    );
  }

  if (!disease) {
    return (
      <div className="min-h-screen bg-[#F7FBFE] px-6 py-16 text-center">
        <ZebraEmptyState
          message={loadError ? "Disease information unavailable" : "Condition not found"}
          sub={loadError || "The condition you are looking for could not be loaded from the source data."}
        />
        <button
          onClick={onBack}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#112250] px-6 py-3.5 font-bold text-white hover:bg-[#1a3365] transition-all min-h-[44px] cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Disease Directory
        </button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#F7FBFE] pb-24 text-[#112250] selection:bg-[#D6EAF5] selection:text-[#112250]">
      {/* ================= COMPACT HEADER (BREADCRUMB, TITLE, TAGS & PDF BUTTON IN ONE ROW) ================= */}
      <header className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-2">
        {/* Subtle pale blue cloud blob and gentle stars behind header */}
        <div className="pointer-events-none absolute -top-8 right-10 w-72 h-44 opacity-35 blur-xl">
          <ZebraCloudBlob className="w-full h-full" />
        </div>
        <div className="pointer-events-none absolute top-3 right-1/4 hidden sm:block opacity-90">
          <BabyZebraBadge size={32} className="border-2 border-white shadow-sm" />
        </div>

        {/* Compact Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-semibold text-[#3B507D] mb-3">
          <button onClick={onBack} className="hover:text-[#112250] hover:underline flex items-center gap-1 cursor-pointer">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Diseases</span>
          </button>
          <ChevronRight className="h-3.5 w-3.5 text-[#3B507D]/70 shrink-0" />
          <span className="text-[#112250] font-bold truncate max-w-[220px] sm:max-w-none">{disease.name}</span>
        </nav>

        {/* Compact Row Container (Title + Tags + PDF Button) */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl sm:rounded-3xl border border-[#112250]/15 bg-white p-4 sm:p-5 shadow-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#D6EAF5] text-[#112250] border border-[#BCE0F5] shadow-2xs">
              <Dna className="h-6 w-6 text-[#112250]" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-heading text-2xl sm:text-3xl font-black text-[#112250] tracking-tight">
                  {disease.name}
                </h1>
                {disease.category && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#D6EAF5] border border-[#BCE0F5] px-2.5 py-0.5 text-xs font-bold text-[#112250]">
                    {disease.category}
                  </span>
                )}
                {disease.inheritancePattern && (
                  <span className="hidden sm:inline-flex items-center rounded-full bg-[#D6EAF5] px-2.5 py-0.5 text-xs font-bold text-[#112250]">
                    {disease.inheritancePattern}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Download PDF button (min 44px tall, pill-shaped, star sparkle on hover) */}
          <button
            onClick={() => generateDiseasePDF(disease)}
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#112250] hover:bg-[#1a3365] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 min-h-[44px] cursor-pointer shrink-0"
          >
            <Download className="h-4 w-4 text-[#D6EAF5] shrink-0 transition-transform group-hover:translate-y-0.5" />
            <span>Download Family Guide (PDF)</span>
            <BabyZebraBadge size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </header>

      {/* ================= STICKY TAB NAVIGATION (CAPSULE PILL BAR) ================= */}
      {tabs.length > 0 && (
        <section className="sticky top-[72px] sm:top-[76px] z-30 py-2">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none py-1.5 px-2 bg-white/95 rounded-full border border-[#112250]/15 shadow-sm backdrop-blur-md">
              {tabs.map((tab) => {
                const IconComp = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => navigateToTab(tab.id)}
                    className={`inline-flex shrink-0 items-center gap-1.5 sm:gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full text-xs sm:text-sm font-heading font-bold transition-all whitespace-nowrap cursor-pointer min-h-[44px] ${
                      isActive
                        ? "bg-[#112250] text-white shadow-xs"
                        : "text-[#3B507D] hover:text-[#112250] hover:bg-[#D6EAF5]/50"
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

      {/* ================= MAIN TWO-COLUMN CONTENT GRID ================= */}
      <section id="disease-tab-content" className="scroll-mt-32 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-12">
          {/* ================= LEFT COLUMN: MAIN CONTENT (8 COLS) ================= */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. PLAIN-LANGUAGE SUMMARY (Starts every tab) */}
            <div id="sec-summary" className="rounded-2xl border border-[#112250]/15 bg-white p-5 sm:p-6 shadow-xs">
              <div className="flex items-center gap-2.5 mb-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#D6EAF5] text-[#112250]">
                  <Sparkles className="h-4 w-4" />
                </span>
                <h3 className="font-heading font-black text-sm uppercase tracking-wider text-[#112250]">
                  Plain-Language Summary
                </h3>
              </div>
              <p className="text-base sm:text-lg leading-relaxed text-[#112250] font-medium">
                {tabSummaries[activeTab]}
              </p>
            </div>

            {/* 2. THREE SMALL FACT CARDS (Follows summary on every tab) */}
            <div id="sec-fact-cards" className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {/* Fact Card 1: Prevalence / How Rare */}
              <div className="rounded-2xl border border-[#112250]/15 bg-[#D6EAF5]/65 p-4 sm:p-4.5 shadow-xs card-hover-lift">
                <div className="flex items-center gap-2 mb-1.5">
                  <Star className="h-4 w-4 text-[#112250]" />
                  <span className="font-heading text-xs font-black uppercase text-[#112250]">How Rare</span>
                </div>
                <h4 className="font-heading font-black text-sm text-[#112250] truncate">
                  {disease.category || "Rare Disorder"}
                </h4>
                <p className="text-xs text-[#3B507D] font-medium mt-0.5 leading-snug">
                  Affects &lt; 1 in 100,000 individuals globally.
                </p>
              </div>

              {/* Fact Card 2: Where in the body */}
              <div className="rounded-2xl border border-[#112250]/15 bg-white p-4 sm:p-4.5 shadow-xs card-hover-lift">
                <div className="flex items-center gap-2 mb-1.5">
                  <HeartPulse className="h-4 w-4 text-[#112250]" />
                  <span className="font-heading text-xs font-black uppercase text-[#112250]">Body Systems</span>
                </div>
                <h4 className="font-heading font-black text-sm text-[#112250] truncate">
                  {disease.categoryBadges?.[0] || "Multisystem / Genetic"}
                </h4>
                <p className="text-xs text-[#3B507D] font-medium mt-0.5 leading-snug">
                  Requires periodic systemic health monitoring.
                </p>
              </div>

              {/* Fact Card 3: Which Specialist */}
              <div className="rounded-2xl border border-[#112250]/15 bg-[#D6EAF5]/65 p-4 sm:p-4.5 shadow-xs card-hover-lift">
                <div className="flex items-center gap-2 mb-1.5">
                  <Stethoscope className="h-4 w-4 text-[#112250]" />
                  <span className="font-heading text-xs font-black uppercase text-[#112250]">Care Lead</span>
                </div>
                <h4 className="font-heading font-black text-sm text-[#112250] truncate">
                  {specialistsList[0]?.profession || "Medical Specialist"}
                </h4>
                <p className="text-xs text-[#3B507D] font-medium mt-0.5 leading-snug">
                  Coordinates clinical therapy & testing.
                </p>
              </div>
            </div>

            {/* 3. DYNAMIC TAB CONTENT (Short cards, scannable format, accordions) */}
            <AnimatePresence mode="wait">
              {/* ── OVERVIEW TAB ── */}
              {activeTab === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div id="sec-detail" className="rounded-2xl border border-[#112250]/15 bg-white p-5 sm:p-6 shadow-xs">
                    <h3 className="font-heading font-black text-lg sm:text-xl text-[#112250] mb-3 flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-[#112250]" />
                      <span>About {disease.name}</span>
                    </h3>

                    {overviewBlocks && overviewBlocks.length > 0 ? (
                      <BlocksRenderer blocks={overviewBlocks} />
                    ) : (
                      <div className="text-base text-[#112250] leading-relaxed font-medium space-y-3">
                        {typeof disease.overview === "object" && disease.overview !== null ? (
                          <>
                            {disease.overview.simple && <p><LinkifiedText text={disease.overview.simple} /></p>}
                            {disease.overview.medical && (
                              <div className="rounded-xl bg-[#F7FBFE] p-4 border border-[#112250]/10 text-sm">
                                <span className="font-bold text-[#112250] block mb-1">Clinical Definition:</span>
                                <LinkifiedText text={disease.overview.medical} />
                              </div>
                            )}
                          </>
                        ) : (
                          <p className="whitespace-pre-line">
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

                  {/* Common Symptoms Preview (First 4 with view all) */}
                  {symptomsList.length > 0 && (
                    <div id="sec-symptoms-preview" className="rounded-2xl border border-[#112250]/15 bg-white p-5 sm:p-6 shadow-xs">
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <h4 className="font-heading font-black text-base sm:text-lg text-[#112250] flex items-center gap-2">
                          <Activity className="h-5 w-5 text-[#112250]" />
                          <span>Symptoms Preview</span>
                        </h4>
                        <button
                          onClick={() => navigateToTab("typesAndSymptoms")}
                          className="text-xs sm:text-sm font-bold text-[#112250] hover:underline cursor-pointer"
                        >
                          View Full Details →
                        </button>
                      </div>
                      <div className="grid gap-2.5 sm:grid-cols-2">
                        {symptomsList.slice(0, 4).map((sym: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-3 rounded-xl bg-[#F7FBFE] p-3 border border-[#112250]/10 card-hover-lift">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white border border-[#112250]/15 text-[#112250] text-xs font-bold shadow-2xs">
                              {idx + 1}
                            </span>
                            <span className="text-sm font-bold text-[#112250] truncate">{sym.name || sym}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* ── CAUSES TAB ── */}
              {activeTab === "causes" && (
                <motion.div
                  key="causes"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div id="sec-causes-list" className="rounded-2xl border border-[#112250]/15 bg-white p-5 sm:p-6 shadow-xs">
                    <h3 className="font-heading font-black text-lg sm:text-xl text-[#112250] mb-4 flex items-center gap-2">
                      <Microscope className="h-5 w-5 text-[#112250]" />
                      <span>Causes & Genetic Risk Factors</span>
                    </h3>

                    {causesBlocks && causesBlocks.length > 0 ? (
                      <BlocksRenderer blocks={causesBlocks} />
                    ) : causesList.length > 0 ? (
                      <div className="space-y-3.5">
                        {causesList.map((cause: any, idx: number) => (
                          <div key={idx} className="rounded-2xl border border-[#112250]/15 bg-[#F7FBFE] p-4 sm:p-5 card-hover-lift">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="rounded-full bg-[#112250] px-3 py-0.5 text-xs font-bold text-white uppercase tracking-wider">
                                {cause.title || `Cause #${idx + 1}`}
                              </span>
                            </div>
                            <p className="text-base text-[#112250] font-medium leading-relaxed">
                              <LinkifiedText text={cause.explanation || cause} />
                            </p>
                            {Array.isArray(cause.details) && cause.details.length > 0 && (
                              <ul className="mt-3 space-y-1.5 pl-4 border-l-2 border-[#112250]/20 text-sm text-[#3B507D] font-medium">
                                {cause.details.map((detail: string, dIdx: number) => (
                                  <li key={dIdx}>• {detail}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-base text-[#3B507D] italic">Causes information currently being updated.</p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ── TYPES & SYMPTOMS TAB (First 4 symptoms with 'View all' toggle) ── */}
              {activeTab === "typesAndSymptoms" && (
                <motion.div
                  key="typesAndSymptoms"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {/* Subtypes Section */}
                  {typesList.length > 0 && (
                    <div id="sec-subtypes" className="rounded-2xl border border-[#112250]/15 bg-white p-5 sm:p-6 shadow-xs">
                      <h3 className="font-heading font-black text-lg sm:text-xl text-[#112250] mb-4 flex items-center gap-2">
                        <Layers className="h-5 w-5 text-[#112250]" />
                        <span>Clinical Subtypes & Forms</span>
                      </h3>
                      <div className="space-y-3.5">
                        {typesList.map((type: any, idx: number) => (
                          <div key={idx} className="rounded-2xl border border-[#112250]/15 bg-[#F7FBFE] p-4 sm:p-5 card-hover-lift">
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                              <h4 className="font-heading font-black text-base text-[#112250]">
                                {type.title || `Subtype ${idx + 1}`}
                              </h4>
                              {type.stage && (
                                <span className="rounded-full bg-[#112250] px-2.5 py-0.5 text-xs font-bold text-white uppercase">
                                  {type.stage}
                                </span>
                              )}
                            </div>
                            <p className="text-base text-[#112250] font-medium leading-relaxed">
                              <LinkifiedText text={type.description} />
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Symptoms Section with first 4 shown + View all toggle */}
                  {symptomsList.length > 0 && (
                    <div id="sec-symptoms-list" className="rounded-2xl border border-[#112250]/15 bg-white p-5 sm:p-6 shadow-xs">
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <h3 className="font-heading font-black text-lg sm:text-xl text-[#112250] flex items-center gap-2">
                          <Activity className="h-5 w-5 text-[#112250]" />
                          <span>Symptoms Checklist ({symptomsList.length})</span>
                        </h3>
                        <span className="text-xs text-[#3B507D] font-bold">
                          {showAllSymptoms ? `Showing all ${symptomsList.length}` : "Showing first 4"}
                        </span>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        {(showAllSymptoms ? symptomsList : symptomsList.slice(0, 4)).map((sym: any, idx: number) => (
                          <div key={idx} className="rounded-2xl border border-[#112250]/15 bg-[#F7FBFE] p-4 card-hover-lift">
                            <div className="flex items-center justify-between gap-2">
                              <h4 className="font-heading text-sm font-black text-[#112250] flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-[#112250]" />
                                <span>{sym.name || sym}</span>
                              </h4>
                              {sym.severity && (
                                <span className="rounded-full bg-[#112250] px-2 py-0.5 text-[10px] font-bold text-white uppercase">
                                  {sym.severity}
                                </span>
                              )}
                            </div>
                            {sym.description && (
                              <p className="mt-1.5 text-xs text-[#3B507D] font-medium leading-relaxed">
                                <LinkifiedText text={sym.description} />
                              </p>
                            )}
                          </div>
                        ))}
                      </div>

                      {symptomsList.length > 4 && (
                        <div className="mt-4 pt-3 border-t border-[#112250]/10 text-center">
                          <button
                            type="button"
                            onClick={() => setShowAllSymptoms((prev) => !prev)}
                            className="inline-flex items-center gap-2 rounded-full bg-[#D6EAF5] hover:bg-[#c2e2f3] text-[#112250] font-bold px-6 py-2.5 text-sm transition-all duration-200 cursor-pointer min-h-[44px]"
                          >
                            <span>{showAllSymptoms ? "Show Fewer Symptoms" : `View All ${symptomsList.length} Symptoms`}</span>
                            {showAllSymptoms ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}

              {/* ── DIAGNOSIS TAB ── */}
              {activeTab === "diagnosis" && (
                <motion.div
                  key="diagnosis"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div id="sec-diagnostic-steps" className="rounded-2xl border border-[#112250]/15 bg-white p-5 sm:p-6 shadow-xs">
                    <h3 className="font-heading font-black text-lg sm:text-xl text-[#112250] mb-4 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-[#112250]" />
                      <span>Diagnostic Procedures & Testing</span>
                    </h3>

                    {diagnosisBlocks && diagnosisBlocks.length > 0 ? (
                      <BlocksRenderer blocks={diagnosisBlocks} />
                    ) : diagnosisSections.length > 0 ? (
                      <StructuredSections sections={diagnosisSections} emptyHeading="Diagnosis" />
                    ) : diagnosticSteps.length > 0 ? (
                      <div className="space-y-3.5">
                        {diagnosticSteps.map((step: any, idx: number) => (
                          <div key={idx} className="rounded-2xl border border-[#112250]/15 bg-[#F7FBFE] p-4 sm:p-5 card-hover-lift space-y-2">
                            <span className="rounded-full bg-[#112250] px-3 py-0.5 text-xs font-bold text-white uppercase tracking-wider inline-block">
                              {step.name || `Diagnostic Method #${idx + 1}`}
                            </span>
                            {step.what && (
                              <p className="text-base text-[#112250] font-medium leading-relaxed">
                                <strong className="font-bold">What it is:</strong> <LinkifiedText text={step.what} />
                              </p>
                            )}
                            {step.how && (
                              <p className="text-base text-[#3B507D] font-medium leading-relaxed">
                                <strong className="font-bold text-[#112250]">How it works:</strong> <LinkifiedText text={step.how} />
                              </p>
                            )}
                            {step.result && (
                              <p className="text-sm text-[#3B507D] font-medium leading-relaxed pl-3 border-l-2 border-[#112250]">
                                <strong className="font-bold text-[#112250]">Result meaning:</strong> <LinkifiedText text={step.result} />
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-base text-[#3B507D] italic">Diagnostic information is currently being updated.</p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ── LIFESTYLE & DAILY SUPPORT TAB ── */}
              {activeTab === "lifestyleCommunity" && (
                <motion.div
                  key="lifestyle"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="rounded-2xl border border-[#112250]/15 bg-white p-5 sm:p-6 shadow-xs">
                    <h3 className="font-heading font-black text-lg sm:text-xl text-[#112250] mb-4 flex items-center gap-2">
                      <HeartPulse className="h-5 w-5 text-[#112250]" />
                      <span>Daily Living & Family Support</span>
                    </h3>

                    {lifestyleBlocks && lifestyleBlocks.length > 0 ? (
                      <BlocksRenderer blocks={lifestyleBlocks} />
                    ) : (
                      <div className="space-y-3">
                        {/* 1. Recommended Therapies */}
                        <div className="rounded-2xl border border-[#112250]/15 bg-[#F7FBFE] overflow-hidden">
                          <button
                            type="button"
                            onClick={() => toggleLifestyleAccordion("therapies")}
                            className="flex w-full items-center justify-between p-4 sm:p-5 text-left font-heading font-black text-base text-[#112250] hover:bg-[#D6EAF5]/40 transition-colors cursor-pointer min-h-[44px]"
                          >
                            <span className="flex items-center gap-2">
                              <Activity className="h-5 w-5 text-[#112250]" />
                              <span>1. Recommended Therapies</span>
                            </span>
                            {openLifestyleAccordions.therapies ? <ChevronUp className="h-5 w-5 text-[#112250]" /> : <ChevronDown className="h-5 w-5 text-[#3B507D]" />}
                          </button>
                          {openLifestyleAccordions.therapies && (
                            <div className="p-4 sm:p-5 border-t border-[#112250]/10 bg-white">
                              {Array.isArray(disease.lifestyleAndDailySupport?.therapies) && disease.lifestyleAndDailySupport.therapies.length > 0 ? (
                                <div className="grid gap-2.5 sm:grid-cols-2">
                                  {disease.lifestyleAndDailySupport.therapies.map((th: any, idx: number) => (
                                    <div key={idx} className="rounded-xl bg-[#F7FBFE] p-3 text-sm font-bold text-[#112250] border border-[#112250]/10">
                                      {typeof th === "string" ? th : `${th.name}${th.desc ? `: ${th.desc}` : ""}`}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-[#3B507D] italic">Physical, occupational, and speech therapy recommendations.</p>
                              )}
                            </div>
                          )}
                        </div>

                        {/* 2. Diets & Nutrition */}
                        <div className="rounded-2xl border border-[#112250]/15 bg-[#F7FBFE] overflow-hidden">
                          <button
                            type="button"
                            onClick={() => toggleLifestyleAccordion("nutrition")}
                            className="flex w-full items-center justify-between p-4 sm:p-5 text-left font-heading font-black text-base text-[#112250] hover:bg-[#D6EAF5]/40 transition-colors cursor-pointer min-h-[44px]"
                          >
                            <span className="flex items-center gap-2">
                              <HeartPulse className="h-5 w-5 text-[#112250]" />
                              <span>2. Diets & Nutrition</span>
                            </span>
                            {openLifestyleAccordions.nutrition ? <ChevronUp className="h-5 w-5 text-[#112250]" /> : <ChevronDown className="h-5 w-5 text-[#3B507D]" />}
                          </button>
                          {openLifestyleAccordions.nutrition && (
                            <div className="p-4 sm:p-5 border-t border-[#112250]/10 bg-white text-base text-[#112250] font-medium leading-relaxed">
                              {disease.lifestyleAndDailySupport?.nutrition ? (
                                <LinkifiedText text={disease.lifestyleAndDailySupport.nutrition} />
                              ) : (
                                <p className="italic text-sm text-[#3B507D]">Nutritional and dietary considerations guidance.</p>
                              )}
                            </div>
                          )}
                        </div>

                        {/* 3. Assistive Devices */}
                        <div className="rounded-2xl border border-[#112250]/15 bg-[#F7FBFE] overflow-hidden">
                          <button
                            type="button"
                            onClick={() => toggleLifestyleAccordion("devices")}
                            className="flex w-full items-center justify-between p-4 sm:p-5 text-left font-heading font-black text-base text-[#112250] hover:bg-[#D6EAF5]/40 transition-colors cursor-pointer min-h-[44px]"
                          >
                            <span className="flex items-center gap-2">
                              <Zap className="h-5 w-5 text-[#112250]" />
                              <span>3. Assistive Devices & Medical Equipment</span>
                            </span>
                            {openLifestyleAccordions.devices ? <ChevronUp className="h-5 w-5 text-[#112250]" /> : <ChevronDown className="h-5 w-5 text-[#3B507D]" />}
                          </button>
                          {openLifestyleAccordions.devices && (
                            <div className="p-4 sm:p-5 border-t border-[#112250]/10 bg-white">
                              {Array.isArray(disease.lifestyleAndDailySupport?.devices) && disease.lifestyleAndDailySupport.devices.length > 0 ? (
                                <ul className="space-y-1.5 text-base text-[#112250] font-medium">
                                  {disease.lifestyleAndDailySupport.devices.map((dev: string, idx: number) => (
                                    <li key={idx}>• {dev}</li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-sm text-[#3B507D] italic">Assistive equipment and mobility aids details.</p>
                              )}
                            </div>
                          )}
                        </div>

                        {/* 4. Caregiver Advice */}
                        <div className="rounded-2xl border border-[#112250]/15 bg-[#F7FBFE] overflow-hidden">
                          <button
                            type="button"
                            onClick={() => toggleLifestyleAccordion("caregiverTips")}
                            className="flex w-full items-center justify-between p-4 sm:p-5 text-left font-heading font-black text-base text-[#112250] hover:bg-[#D6EAF5]/40 transition-colors cursor-pointer min-h-[44px]"
                          >
                            <span className="flex items-center gap-2">
                              <CheckCircle className="h-5 w-5 text-[#112250]" />
                              <span>4. Daily Care Tips & Practical Advice</span>
                            </span>
                            {openLifestyleAccordions.caregiverTips ? <ChevronUp className="h-5 w-5 text-[#112250]" /> : <ChevronDown className="h-5 w-5 text-[#3B507D]" />}
                          </button>
                          {openLifestyleAccordions.caregiverTips && (
                            <div className="p-4 sm:p-5 border-t border-[#112250]/10 bg-white">
                              {Array.isArray(disease.lifestyleAndDailySupport?.caregiverTips) && disease.lifestyleAndDailySupport.caregiverTips.length > 0 ? (
                                <ul className="space-y-2 text-base text-[#112250] font-medium">
                                  {disease.lifestyleAndDailySupport.caregiverTips.map((tip: string, idx: number) => (
                                    <li key={idx} className="flex items-start gap-2">
                                      <CheckCircle className="h-4 w-4 text-[#112250] shrink-0 mt-1" />
                                      <span><LinkifiedText text={tip} /></span>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-sm text-[#3B507D] italic">Caregiver tips and routines guidance.</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ── RESEARCH & PHARMA TAB ── */}
              {activeTab === "researchPharma" && (
                <motion.div
                  key="researchPharma"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="rounded-2xl border border-[#112250]/15 bg-white p-5 sm:p-6 shadow-xs">
                    <h3 className="font-heading font-black text-lg sm:text-xl text-[#112250] mb-4 flex items-center gap-2">
                      <FlaskConical className="h-5 w-5 text-[#112250]" />
                      <span>Research & Clinical Pipeline</span>
                    </h3>

                    {researchBlocks && researchBlocks.length > 0 ? (
                      <BlocksRenderer blocks={researchBlocks} />
                    ) : (
                      <div className="space-y-4">
                        {clinicalTrials.map((res: any, idx: number) => (
                          <div key={idx} className="rounded-2xl border border-[#112250]/15 bg-[#F7FBFE] p-4 sm:p-5 card-hover-lift space-y-2">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                              <div>
                                <h4 className="font-heading font-black text-base text-[#112250]">
                                  {res.name || res.title || "Clinical Trial / Drug Study"}
                                </h4>
                                {res.drugName && (
                                  <span className="inline-block mt-0.5 text-xs font-bold text-[#112250] bg-[#D6EAF5] px-2.5 py-0.5 rounded-full">
                                    Compound: {res.drugName}
                                  </span>
                                )}
                              </div>
                              {res.url && (
                                <a
                                  href={res.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 rounded-full bg-[#112250] px-4 py-2 text-xs font-bold text-white hover:bg-[#1a3365] transition-colors shrink-0 min-h-[44px]"
                                >
                                  <span>Trial Details</span>
                                  <ExternalLink className="h-3.5 w-3.5" />
                                </a>
                              )}
                            </div>
                            <p className="text-base text-[#112250] font-medium leading-relaxed">
                              <LinkifiedText text={res.focus || res.description || "Active clinical research program."} />
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ── FAQS TAB (Collapsible Accordions) ── */}
              {activeTab === "faqs" && (
                <motion.div
                  key="faqs"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div id="sec-faqs-accordion" className="rounded-2xl border border-[#112250]/15 bg-white p-5 sm:p-6 shadow-xs">
                    <h3 className="font-heading font-black text-lg sm:text-xl text-[#112250] mb-4 flex items-center gap-2">
                      <HelpCircle className="h-5 w-5 text-[#112250]" />
                      <span>Frequently Asked Questions</span>
                    </h3>

                    {faqsList.length > 0 ? (
                      <div className="space-y-3">
                        {faqsList.map((faq: any, idx: number) => {
                          const isOpen = openFaqIndices[idx] ?? (idx === 0);
                          const qText = faq.question || faq.q || `Question ${idx + 1}`;
                          const aText = faq.answer || faq.a || "Information unavailable.";

                          return (
                            <div key={idx} className="rounded-2xl border border-[#112250]/15 bg-[#F7FBFE] overflow-hidden transition-all shadow-xs">
                              <button
                                onClick={() => toggleFaq(idx)}
                                className="flex w-full items-start sm:items-center justify-between p-4 sm:p-5 text-left font-heading font-black text-base text-[#112250] hover:bg-[#D6EAF5]/40 transition-colors gap-3 cursor-pointer min-h-[44px]"
                              >
                                <span className="flex items-start gap-2.5">
                                  <HelpCircle className="h-5 w-5 text-[#112250] shrink-0 mt-0.5 sm:mt-0" />
                                  <span>{qText}</span>
                                </span>
                                {isOpen ? (
                                  <ChevronUp className="h-5 w-5 text-[#112250] shrink-0" />
                                ) : (
                                  <ChevronDown className="h-5 w-5 text-[#3B507D] shrink-0" />
                                )}
                              </button>
                              {isOpen && (
                                <div className="p-4 sm:p-5 pt-0 border-t border-[#112250]/10 bg-white text-base text-[#112250] font-medium leading-relaxed">
                                  <LinkifiedText text={aText} />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-base text-[#3B507D] italic">No FAQs available for this condition.</p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ── FACTS VS MYTHS TAB (Collapsible Accordions) ── */}
              {activeTab === "myths" && (
                <motion.div
                  key="myths"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div id="sec-myths-accordion" className="rounded-2xl border border-[#112250]/15 bg-white p-5 sm:p-6 shadow-xs">
                    <h3 className="font-heading font-black text-lg sm:text-xl text-[#112250] mb-4 flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-[#112250]" />
                      <span>Facts vs. Myths Accordion</span>
                    </h3>

                    {mythsBlocks && mythsBlocks.length > 0 ? (
                      <BlocksRenderer blocks={mythsBlocks} />
                    ) : mythsList.length > 0 ? (
                      <div className="space-y-3">
                        {mythsList.map((item: any, idx: number) => {
                          const isOpen = openMythIndices[idx] ?? (idx === 0);
                          const mythText = item.myth || item.statement || `Myth #${idx + 1}`;
                          const factText = item.fact || item.explanation || "Medical guidance verified by clinical specialists.";

                          return (
                            <div key={idx} className="rounded-2xl border border-[#112250]/15 bg-[#F7FBFE] overflow-hidden shadow-xs">
                              <button
                                onClick={() => toggleMyth(idx)}
                                className="flex w-full items-start sm:items-center justify-between p-4 sm:p-5 text-left font-heading font-black text-base text-[#112250] hover:bg-[#D6EAF5]/40 transition-colors gap-3 cursor-pointer min-h-[44px]"
                              >
                                <span className="flex items-start gap-2.5">
                                  <span className="rounded-full bg-[#112250] px-2.5 py-0.5 text-xs font-bold text-white uppercase shrink-0 mt-0.5">
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
                                <div className="p-4 sm:p-5 pt-0 border-t border-[#112250]/10 bg-white space-y-2">
                                  <div className="rounded-xl bg-[#D6EAF5]/40 p-4 border border-[#BCE0F5]">
                                    <div className="flex items-center gap-2 mb-1">
                                      <CheckCircle className="h-4 w-4 text-[#112250]" />
                                      <span className="font-heading font-black text-xs uppercase tracking-wider text-[#112250]">
                                        Verified Medical Fact
                                      </span>
                                    </div>
                                    <p className="text-base text-[#112250] font-medium leading-relaxed">
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

              {/* ── SPECIALISTS TAB ── */}
              {activeTab === "specialists" && (
                <motion.div
                  key="specialists"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div id="sec-specialists-list" className="rounded-2xl border border-[#112250]/15 bg-white p-5 sm:p-6 shadow-xs">
                    <h3 className="font-heading font-black text-lg sm:text-xl text-[#112250] mb-4 flex items-center gap-2">
                      <Stethoscope className="h-5 w-5 text-[#112250]" />
                      <span>Verified Specialists & Centers</span>
                    </h3>

                    {specialistsBlocks && specialistsBlocks.length > 0 ? (
                      <BlocksRenderer blocks={specialistsBlocks} />
                    ) : specialistsList.length > 0 ? (
                      <div className="grid gap-4 sm:grid-cols-2">
                        {specialistsList.map((spec: any, idx: number) => (
                          <div key={idx} className="rounded-2xl border border-[#112250]/15 bg-[#F7FBFE] p-5 card-hover-lift flex flex-col justify-between space-y-3">
                            <div className="flex items-start gap-3">
                              <SpecialistAvatar name={spec.name} size="md" />
                              <div>
                                <h4 className="font-heading font-black text-base text-[#112250]">{spec.name}</h4>
                                <p className="text-xs font-bold text-[#3B507D] mt-0.5">{spec.profession || "Specialist"}</p>
                                {spec.organization && (
                                  <p className="text-xs text-[#112250] mt-1 flex items-center gap-1">
                                    <Building2 className="h-3.5 w-3.5 text-[#3B507D] shrink-0" />
                                    <span className="truncate">{spec.organization}</span>
                                  </p>
                                )}
                              </div>
                            </div>
                            {spec.specialization && (
                              <p className="text-xs text-[#112250] font-medium leading-relaxed pl-3 border-l-2 border-[#112250]">
                                {spec.specialization}
                              </p>
                            )}
                            {spec.contact && (
                              <a
                                href={spec.contact.startsWith("http") ? spec.contact : `https://${spec.contact}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#112250] px-4 py-2 text-xs font-bold text-white hover:bg-[#1a3365] transition-colors min-h-[44px]"
                              >
                                <span>Official Profile</span>
                                <ExternalLink className="h-3.5 w-3.5" />
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
          </div>

          {/* ================= RIGHT COLUMN: STICKY SIDEBAR (4 COLS) ================= */}
          <aside className="lg:col-span-4 space-y-5">
            <div className="lg:sticky lg:top-28 space-y-5">
              {/* Sidebar Box 1: Key Takeaway (Soft sky blue #D6EAF5) */}
              <div className="rounded-2xl border border-[#112250]/15 bg-[#D6EAF5] p-5 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white border border-[#112250]/15 text-[#112250]">
                      <Lightbulb className="h-4 w-4" />
                    </span>
                    <h3 className="font-heading font-black text-sm uppercase tracking-wider text-[#112250]">
                      Key Takeaway
                    </h3>
                  </div>
                  <BabyZebraBadge size={20} />
                </div>
                <div className="space-y-2 mt-2">
                  {keyTakeaways.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm text-[#112250] font-medium leading-relaxed">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#112250] mt-2 shrink-0" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sidebar Box 2: Contextual "Jump to" List */}
              {jumpLinks.length > 0 && (
                <div className="rounded-2xl border border-[#112250]/15 bg-white p-5 shadow-xs">
                  <h4 className="font-heading font-black text-sm uppercase tracking-wider text-[#112250] mb-3 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-[#112250]" />
                    <span>Jump to in this tab</span>
                  </h4>
                  <div className="space-y-1.5">
                    {jumpLinks.map((link, idx) => (
                      <a
                        key={idx}
                        href={link.href}
                        className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-bold text-[#112250] bg-[#F7FBFE] hover:bg-[#D6EAF5] transition-colors min-h-[44px]"
                      >
                        <span>{link.label}</span>
                        <ChevronRight className="h-4 w-4 text-[#3B507D]" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Sidebar Box 3: Rare-Ze Chat Button */}
              <div className="rounded-2xl border border-[#112250]/15 bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-[#112250]" />
                    <span className="font-heading font-black text-sm text-[#112250]">Rare-Ze Assistant</span>
                  </div>
                  <BabyZebraBadge size={22} />
                </div>
                <p className="text-xs text-[#3B507D] font-medium leading-relaxed mb-3.5">
                  Have questions about symptoms, therapies, or clinical research for <strong>{disease.name}</strong>?
                </p>
                <button
                  type="button"
                  onClick={openRareZeChat}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#112250] hover:bg-[#1a3365] px-4 py-3 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 min-h-[44px] cursor-pointer"
                >
                  <MessageCircle className="h-4 w-4 text-[#D6EAF5]" />
                  <span>Chat with Rare-Ze</span>
                </button>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
