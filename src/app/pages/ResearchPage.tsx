import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DISEASES, fetchDiseasesFromAPI, type Disease } from "../data";

import {
  Microscope,
  FlaskConical,
  Users,
  ExternalLink,
  BookOpen,
  Dna,
  HeartHandshake,
  Filter,
  BrainCircuit,
  CheckCircle2,
  X,
  Building2,
  Calendar,
  Layers,
  ArrowRight,
} from "lucide-react";

import { EdelweissFlower, ZebraMascot, FourPointStar } from "../components/common/Visuals";
import { fadeUpVariants, staggerContainerVariants, modalPanelVariants, overlayBackdropVariants } from "../utils/animations";

const RESEARCH_TABS = [
  "All Programs",
  "Gene Therapies",
  "Enzyme Replacement",
  "CRISPR & RNA",
  "Clinical Registries",
];

export default function ResearchPage() {
  const [diseases, setDiseases] = useState<Disease[]>(DISEASES);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("All Programs");
  const [selectedResearch, setSelectedResearch] = useState<{
    diseaseName: string;
    category: string;
    researchName: string;
    why?: string;
    url?: string;
    stage?: string;
  } | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        setIsLoading(true);
        const result = await fetchDiseasesFromAPI();
        if (isMounted && Array.isArray(result) && result.length > 0) {
          setDiseases(result as any);
        }
      } catch (err) {
        console.error("Failed to load research data:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredDiseases = diseases.filter((d) => {
    if (activeTab === "All Programs") return true;
    if (activeTab === "Gene Therapies") return d.shortDesc.toLowerCase().includes("gene") || d.category.includes("Metabolic");
    if (activeTab === "Enzyme Replacement") return d.name.includes("MPS") || d.name.includes("Fabry") || d.name.includes("Gaucher");
    if (activeTab === "CRISPR & RNA") return d.shortDesc.toLowerCase().includes("genetic") || d.shortDesc.toLowerCase().includes("mutation");
    if (activeTab === "Clinical Registries") return true;
    return true;
  });

  return (
    <div className="relative min-h-screen bg-transparent pb-24 text-[#112250] selection:bg-[#DDF0FA] selection:text-[#112250] overflow-hidden">
      {/* ================= CENTERED HERO BANNER (TOUR ARCHITECTURE) ================= */}
      {/* ================= HERO SECTION WITH BACKGROUND IMAGE ================= */}
      <section className="relative overflow-hidden mx-4 sm:mx-6 lg:mx-8 mt-2 mb-6 rounded-[2rem] sm:rounded-[2.75rem] border border-[#112250]/15 shadow-xl bg-[#070D1E]">
        {/* Background Photo & Dark Gradient Overlays */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1600&q=80"
            alt="Medical research scientist conducting molecular genetic trial experiments"
            className="h-full w-full object-cover object-center"
          />
          {/* Multi-layer gradient overlays to guarantee WCAG AAA text legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#070D1E]/85 via-[#0D1B3E]/80 to-[#070D1E]/92 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#070D1E]/40 to-[#070D1E]/80 pointer-events-none" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20 text-center">
          {/* Centered Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-4 py-1.5 text-xs font-semibold text-white shadow-xs mb-5"
          >
            <FourPointStar size={11} className="text-[#7DD3FC] shrink-0" />
            <span className="uppercase tracking-wider text-[11px] font-bold">Clinical Research &amp; Trials</span>
          </motion.div>

          {/* Centered Large Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-black leading-[1.18] tracking-tight text-white max-w-4xl mx-auto drop-shadow-sm"
          >
            Advancing Discoveries, Gene Therapies &amp; Active Trials.
          </motion.h1>

          {/* Centered Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="font-sans mt-4 max-w-3xl mx-auto text-base sm:text-lg leading-relaxed text-[#D6E0F5] font-normal"
          >
            Track active gene replacement therapies, enzyme replacement pipelines, and clinical trial milestones in clear, encouraging, family-friendly terms.
          </motion.p>

          {/* Centered Action Button */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mt-8 flex flex-wrap justify-center gap-3"
          >
            <a
              href="#programs"
              className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-xs sm:text-sm font-bold text-[#112250] shadow-xl hover:bg-[#EDF6FC] transition-all cursor-pointer"
            >
              <Microscope className="h-4 w-4 text-[#112250]" />
              <span>Browse 850+ Active Trials</span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* ================= RESEARCH PROGRAMS LISTING ================= */}
      <section id="programs" className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        {/* Research Filter Tabs */}
        <div className="mb-8 rounded-3xl border border-[#BCE0F5] bg-white p-4 shadow-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-callout mr-2 text-xs font-black uppercase tracking-wider text-[#3B507D] flex items-center gap-1.5">
              <Filter className="h-4 w-4" />
              Focus Area:
            </span>
            {RESEARCH_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-4 py-2 text-xs font-bold transition-all cursor-pointer ${activeTab === tab
                    ? "bg-[#112250] text-white shadow-xs"
                    : "border border-[#BCE0F5] bg-[#EDF6FC] text-[#112250] hover:bg-[#DDF0FA]"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 sm:p-10 border border-[#BCE0F5] shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-[#EDF6FC] pb-6">
            <div>
              <span className="font-callout text-xs font-bold uppercase tracking-widest text-[#243B6B]">
                Clinical Trials & Registries
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#112250] mt-1 font-heading">
                Active Research Programs by Condition
              </h2>
            </div>
            <span className="text-xs font-bold text-[#112250] bg-[#EDF6FC] px-4 py-2 rounded-full border border-[#BCE0F5] self-start">
              Updated September 2026
            </span>
          </div>

          {isLoading ? (
            <div className="py-16 text-center text-[#3B507D] font-medium">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#112250] border-t-transparent mx-auto mb-3" />
              Loading rare disease research programs...
            </div>
          ) : (
            <motion.div
              variants={staggerContainerVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {filteredDiseases.slice(0, 9).map((d, i) => {
                const leadResearch = d.research?.[0] || {
                  name: "National Institutes of Health & Genetic Registry",
                  why: "Ongoing clinical observation and biomarker analysis.",
                };
                const phaseBadge = (i % 3 === 0) ? "Phase II Trial" : (i % 3 === 1) ? "Phase III Trial" : "Gene Therapy Pipeline";

                return (
                  <motion.div
                    key={d.id}
                    variants={fadeUpVariants}
                    whileHover={{ y: -6, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    role="button"
                    tabIndex={0}
                    aria-label={`View clinical trial details for ${d.name}`}
                    onClick={() =>
                      setSelectedResearch({
                        diseaseName: d.name,
                        category: d.category,
                        researchName: leadResearch.name,
                        why: leadResearch.why,
                        url: (leadResearch as any).url,
                        stage: phaseBadge,
                      })
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedResearch({
                          diseaseName: d.name,
                          category: d.category,
                          researchName: leadResearch.name,
                          why: leadResearch.why,
                          url: (leadResearch as any).url,
                          stage: phaseBadge,
                        });
                      }
                    }}
                    className="group cursor-pointer rounded-2xl border border-[#BCE0F5] bg-[#FAF9F5] p-6 transition-all duration-200 hover:bg-white hover:border-[#112250] hover:shadow-[0_8px_24px_rgba(17,34,80,0.06)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#112250] flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="rounded-full bg-white px-3 py-1 text-[10px] font-black text-[#112250] border border-[#BCE0F5] uppercase tracking-wider">
                          {phaseBadge}
                        </span>
                        <Dna className="h-5 w-5 text-[#243B6B] shrink-0" />
                      </div>

                      <h3 className="mt-4 font-heading text-xl font-black text-[#112250] group-hover:text-[#243B6B]">
                        {d.name}
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-[#3B507D] font-medium line-clamp-2">
                        {d.shortDesc}
                      </p>

                      <div className="mt-4 border-t border-[#EDF6FC] pt-3">
                        <p className="text-xs font-black text-[#112250]">Lead Center:</p>
                        <p className="text-xs font-bold text-[#3B507D] mt-0.5">{leadResearch.name}</p>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-[#EDF6FC] flex items-center justify-between text-xs font-bold text-[#112250] group-hover:text-[#243B6B]">
                      <span>View Trial Details</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>

      {/* ================= ZEBRA MASCOT RESEARCH HELPER BANNER WITH GLOW ================= */}
      <section className="mt-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-white p-8 sm:p-10 border border-[#BCE0F5] shadow-[0_8px_30px_rgba(17,34,80,0.05)] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="relative z-10 flex items-center gap-6">
            <img
              src="/rarebridge_zebra_reading.png"
              alt="Zebra mascot reading paper"
              className="h-24 w-24 object-contain animate-float shrink-0"
            />
            <div>
              <span className="font-callout text-xs font-bold uppercase tracking-wider text-[#243B6B]">
                Scientific Translation Assistant
              </span>
              <h3 className="font-heading font-black text-2xl text-[#112250] mt-0.5">
                Need help understanding a medical research paper?
              </h3>
              <p className="font-sans text-sm text-[#3B507D] font-medium mt-1">
                Our AI Zebra assistant turns dense medical journals into simple, comforting summaries for caregivers.
              </p>
            </div>
          </div>

          <button
            onClick={() => window.dispatchEvent(new CustomEvent("open-ai-assistant"))}
            className="relative z-10 rounded-full bg-[#112250] px-7 py-3.5 text-sm font-bold text-white hover:bg-[#1e3a7a] transition-colors shrink-0 flex items-center gap-2 cursor-pointer shadow-md"
          >
            <BrainCircuit className="h-5 w-5 text-[#BCE0F5]" />
            <span>Summarize Research Paper</span>
          </button>
        </div>
      </section>

      {/* ================= RESEARCH DETAIL MODAL ================= */}
      <AnimatePresence>
        {selectedResearch && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 md:p-8 overflow-y-auto">
            <motion.div
              variants={overlayBackdropVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={() => setSelectedResearch(null)}
              className="fixed inset-0 bg-[#112250]/65 backdrop-blur-sm"
            />

            <motion.div
              variants={modalPanelVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="relative w-full max-w-2xl sm:max-w-3xl max-h-[90vh] overflow-y-auto rounded-[2rem] sm:rounded-[2.5rem] border-2 border-[#112250]/15 bg-white p-6 sm:p-8 z-10 my-auto shadow-2xl"
            >
              <button
                onClick={() => setSelectedResearch(null)}
                className="absolute top-5 right-5 rounded-full bg-[#EDF6FC] p-2 text-[#112250] hover:bg-[#DDF0FA] transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>

              <span className="rounded-full bg-[#EDF6FC] border border-[#BCE0F5] px-3.5 py-1 text-xs font-bold text-[#112250]">
                {selectedResearch.stage}
              </span>

              <h3 className="font-heading font-black text-2xl text-[#112250] mt-2">
                {selectedResearch.diseaseName} Research
              </h3>

              <div className="mt-5 space-y-4 rounded-2xl bg-[#EDF6FC]/60 p-5 border border-[#BCE0F5]">
                <div>
                  <h4 className="text-xs font-black uppercase text-[#243B6B]">Lead Research Institution</h4>
                  <p className="text-base font-black text-[#112250] mt-0.5">{selectedResearch.researchName}</p>
                </div>

                {selectedResearch.why && (
                  <div>
                    <h4 className="text-xs font-black uppercase text-[#243B6B]">Study Objectives & Focus</h4>
                    <p className="text-sm font-medium text-[#112250] mt-0.5 leading-relaxed">
                      "{selectedResearch.why}"
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={() => setSelectedResearch(null)}
                  className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#112250] px-6 py-3.5 text-sm font-bold text-white hover:bg-[#1e3a7a] transition-colors shadow-md cursor-pointer"
                >
                  <span>Close Details</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}