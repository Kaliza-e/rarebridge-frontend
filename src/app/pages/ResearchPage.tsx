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
  Sparkles,
  Filter,
  BrainCircuit,
  CheckCircle2,
  X,
  Building2,
  Calendar,
  Layers,
  ArrowRight,
} from "lucide-react";

import { EdelweissFlower, OrganicWavyLine, ZebraMascot } from "../components/common/Visuals";
import SectionDivider from "../components/common/SectionDivider";
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
    <main className="relative min-h-screen bg-transparent pb-24 text-[#112250] selection:bg-[#E7E2CE] selection:text-[#112250] overflow-hidden">
      <OrganicWavyLine side="left" />
      <OrganicWavyLine side="right" />

      {/* ================= HERO BANNER ================= */}
      <section className="relative overflow-hidden bg-transparent pt-12 pb-16 lg:pt-16 lg:pb-20">
        {/* Background ambient blobs matching Homepage */}
        <div className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-[#E7E2CE]/70 blur-3xl" />
        <div className="pointer-events-none absolute top-1/3 -left-20 h-56 w-56 rounded-full bg-[#3B507D]/10 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7"
            >
              <span className="font-callout text-xs font-bold uppercase tracking-widest text-[#3B507D] mb-2 block">
                Pioneering Medical Science
              </span>

              <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight text-[#112250]">
                Rare Disease Research & Trial Updates
              </h1>

              <p className="font-sans mt-3 max-w-xl text-sm sm:text-base leading-relaxed text-[#3B507D] font-medium">
                Track active gene replacement therapies, enzyme replacement pipelines, and clinical trial milestones in clear, encouraging, family-friendly terms.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#programs"
                  className="inline-flex items-center gap-2.5 rounded-2xl bg-[#112250] px-6 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-[#3B507D] transition-all"
                >
                  <Microscope className="h-5 w-5 text-white" />
                  <span>Browse Active Trials</span>
                </a>
              </div>
            </motion.div>

            {/* Right Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-5"
            >
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative overflow-hidden rounded-[2.5rem] border-2 border-[#E7E2CE] bg-white p-8 text-[#112250]">
                  <div className="flex items-center justify-between mb-6">
                    <div className="rounded-2xl bg-[#F5F4F0] p-3 text-[#112250]">
                      <FlaskConical className="h-6 w-6 text-[#112250]" />
                    </div>
                    <EdelweissFlower size={36} />
                  </div>

                  <span className="inline-flex items-center gap-2 rounded-full bg-[#E7E2CE]/60 px-3.5 py-1 text-xs font-bold text-[#112250] mb-3">
                    <Sparkles className="h-3.5 w-3.5 text-[#112250]" />
                    850+ Active Trials Tracked
                  </span>

                  <h3 className="font-heading font-black text-2xl text-[#112250]">
                    Hope Through Science
                  </h3>
                  <p className="font-sans text-sm text-[#3B507D] mt-2 font-medium leading-relaxed">
                    Connecting rare disease families with certified research registries and patient trial opportunities worldwide.
                  </p>

                  <div className="mt-6 space-y-2.5 border-t border-[#E7E2CE] pt-4 text-xs font-bold text-[#112250]">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#3B507D]" />
                      <span>Phase I, II, & III Gene Therapy updates</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#3B507D]" />
                      <span>Plain-language scientific abstract summaries</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= RESEARCH PROGRAMS LISTING ================= */}
      <section id="programs" className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        {/* Research Filter Tabs */}
        <div className="mb-8 rounded-3xl border-2 border-[#E7E2CE] bg-white p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-callout mr-2 text-xs font-black uppercase tracking-wider text-[#3B507D] flex items-center gap-1.5">
              <Filter className="h-4 w-4" />
              Focus Area:
            </span>
            {RESEARCH_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-2xl px-4 py-2 text-xs font-bold transition-all ${
                  activeTab === tab
                    ? "bg-[#112250] text-white"
                    : "border border-[#E7E2CE] bg-[#F5F4F0] text-[#3B507D] hover:bg-[#E7E2CE]/50 hover:text-[#112250]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 sm:p-10 border-2 border-[#E7E2CE]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-[#F5F4F0] pb-6">
            <div>
              <span className="font-callout text-xs font-bold uppercase tracking-widest text-[#3B507D]">
                Clinical Trials & Registries
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#112250] mt-1 font-heading">
                Active Research Programs by Condition
              </h2>
            </div>
            <span className="text-xs font-bold text-[#3B507D] bg-[#F5F4F0] px-4 py-2 rounded-2xl border border-[#E7E2CE] self-start">
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
                    className="group cursor-pointer rounded-3xl border-2 border-[#E7E2CE] bg-[#F5F4F0] p-6 transition-all duration-200 hover:bg-white hover:border-[#112250] flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="rounded-full bg-white px-3 py-1 text-[10px] font-black text-[#112250] border border-[#E7E2CE] uppercase tracking-wider">
                          {phaseBadge}
                        </span>
                        <Dna className="h-5 w-5 text-[#112250] shrink-0" />
                      </div>

                      <h3 className="mt-4 font-heading text-xl font-black text-[#112250] group-hover:text-[#3B507D]">
                        {d.name}
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-[#3B507D] font-medium line-clamp-2">
                        {d.shortDesc}
                      </p>

                      <div className="mt-4 border-t border-[#E7E2CE] pt-3">
                        <p className="text-xs font-black text-[#112250]">Lead Center:</p>
                        <p className="text-xs font-bold text-[#3B507D] mt-0.5">{leadResearch.name}</p>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-[#E7E2CE] flex items-center justify-between text-xs font-bold text-[#112250]">
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
        <div className="relative overflow-hidden rounded-3xl bg-white p-8 sm:p-10 border-2 border-[#E7E2CE] flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Glowing Aura */}
          <div className="pointer-events-none absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-[#E7E2CE]/60 blur-3xl animate-pulse" />

          <div className="relative z-10 flex items-center gap-6">
            <img
              src="/rarebridge_zebra_reading.png"
              alt="Zebra mascot reading paper"
              className="h-24 w-24 object-contain animate-float shrink-0"
            />
            <div>
              <span className="font-callout text-xs font-bold uppercase tracking-wider text-[#3B507D]">
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
            onClick={() => {}}
            className="relative z-10 rounded-2xl bg-[#112250] px-6 py-3.5 text-sm font-bold text-white hover:bg-[#3B507D] transition-colors shrink-0 flex items-center gap-2"
          >
            <BrainCircuit className="h-5 w-5 text-[#E7E2CE]" />
            <span>Summarize Research Paper</span>
          </button>
        </div>
      </section>

      {/* ================= RESEARCH DETAIL MODAL ================= */}
      <AnimatePresence>
        {selectedResearch && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              variants={overlayBackdropVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={() => setSelectedResearch(null)}
              className="fixed inset-0 bg-[#112250]/60 backdrop-blur-xs"
            />

            <motion.div
              variants={modalPanelVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="relative w-full max-w-xl rounded-3xl border-2 border-[#E7E2CE] bg-white p-6 sm:p-8 z-10 my-auto"
            >
              <button
                onClick={() => setSelectedResearch(null)}
                className="absolute top-5 right-5 rounded-xl bg-[#F5F4F0] p-2 text-[#112250] hover:bg-[#E7E2CE] transition-colors"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>

              <span className="rounded-full bg-[#E7E2CE]/60 px-3 py-1 text-xs font-bold text-[#112250]">
                {selectedResearch.stage}
              </span>

              <h3 className="font-heading font-black text-2xl text-[#112250] mt-2">
                {selectedResearch.diseaseName} Research
              </h3>

              <div className="mt-5 space-y-4 rounded-2xl bg-[#F5F4F0] p-5 border border-[#E7E2CE]">
                <div>
                  <h4 className="text-xs font-black uppercase text-[#3B507D]">Lead Research Institution</h4>
                  <p className="text-base font-black text-[#112250] mt-0.5">{selectedResearch.researchName}</p>
                </div>

                {selectedResearch.why && (
                  <div>
                    <h4 className="text-xs font-black uppercase text-[#3B507D]">Study Objectives & Focus</h4>
                    <p className="text-sm font-medium text-[#112250] mt-0.5 leading-relaxed">
                      "{selectedResearch.why}"
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={() => setSelectedResearch(null)}
                  className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#112250] px-6 py-3.5 text-sm font-bold text-white hover:bg-[#3B507D] transition-colors shadow-md"
                >
                  <span>Close Details</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}