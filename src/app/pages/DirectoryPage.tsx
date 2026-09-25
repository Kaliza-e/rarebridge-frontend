import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DISEASES,
  CATEGORY_FILTERS,
  STATUS_FILTERS,
  fetchDiseasesFromAPI,
  type Disease,
} from "../data";

import {
  ZebraEmptyState,
  DiseaseCard,
  EdelweissFlower,
  OrganicWavyLine,
} from "../components/common/Visuals";

import { SectionDivider } from "../components/common/SectionDivider";
import {
  Search,
  Sparkles,
  BookOpen,
  Filter,
  X,
  Stethoscope,
  Microscope,
  BrainCircuit,
  ArrowRight,
  ChevronRight,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { fadeUpVariants, staggerContainerVariants } from "../utils/animations";

type DirectoryPageProps = {
  onDisease: (id: string) => void;
};

const SEARCH_SUGGESTIONS = [
  "MPS I",
  "Alagille Syndrome",
  "Fabry Disease",
  "Gaucher Disease",
  "Phelan-McDermid",
  "Enzyme Deficiency",
  "Metabolic",
];

export default function DirectoryPage({ onDisease }: DirectoryPageProps) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("All");
  const [status, setStatus] = useState("All Status");
  const [diseases, setDiseases] = useState<Disease[]>(DISEASES);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 6;

  useEffect(() => {
    let cancelled = false;

    async function loadDiseases() {
      setLoading(true);
      try {
        const apiDiseases = await fetchDiseasesFromAPI(
          query,
          cat === "All" ? undefined : cat
        );

        if (!cancelled) {
          setDiseases(apiDiseases as typeof DISEASES);
        }
      } catch (error) {
        console.error("Failed to load diseases:", error);
        if (!cancelled) {
          setDiseases(DISEASES);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadDiseases();

    return () => {
      cancelled = true;
    };
  }, [query, cat]);

  const filtered = diseases.filter((d) => {
    const q = query.trim().toLowerCase();

    const matchQ =
      !q ||
      String(d.name || "").toLowerCase().includes(q) ||
      String(d.category || "").toLowerCase().includes(q) ||
      (Boolean(d.shortDesc) && String(d.shortDesc).toLowerCase().includes(q)) ||
      (Boolean(d.orphaCode) && String(d.orphaCode).toLowerCase().includes(q));

    const matchC =
      cat === "All" || (d as any).categoryBadges?.includes(cat) || d.category === cat;

    const matchS =
      status === "All Status" || (d as any).researchStatus === status;

    return matchQ && matchC && matchS;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const safeCurrentPage = Math.min(currentPage, Math.max(totalPages, 1));
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const currentItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [query, cat, status]);

  function clearFilters() {
    setCat("All");
    setStatus("All Status");
    setQuery("");
  }

  return (
    <main className="relative min-h-screen bg-transparent pb-24 text-[#112250] selection:bg-[#E7E2CE] selection:text-[#112250] overflow-hidden">
      <OrganicWavyLine side="left" />
      <OrganicWavyLine side="right" />

      {/* ================= HERO BANNER ================= */}
      <section className="relative overflow-hidden bg-transparent pt-12 pb-16 lg:pt-16 lg:pb-20">
        {/* Background ambient blobs matching Homepage */}
        <div className="pointer-events-none absolute -top-20 -right-12 h-72 w-72 rounded-full bg-[#E7E2CE]/70 blur-3xl" />
        <div className="pointer-events-none absolute top-1/3 -left-20 h-56 w-56 rounded-full bg-[#3B507D]/10 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            {/* Left Content */}
            <div className="lg:col-span-7">
              <span className="font-callout text-xs font-bold uppercase tracking-widest text-[#3B507D] mb-2 block">
                Comprehensive Knowledge Base
              </span>

              <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight text-[#112250]">
                Rare Disease Library & Medical Guides
              </h1>

              <p className="font-sans mt-3 text-sm sm:text-base leading-relaxed text-[#3B507D] font-medium max-w-2xl">
                Explore 7,000+ conditions simplified into plain language with symptoms, genetic causes, approved treatments, and active trial updates.
              </p>

              {/* Search Box */}
              <div className="mt-8 max-w-2xl">
                <div className="relative flex items-center rounded-2xl border-2 border-[#E7E2CE] bg-white p-2 focus-within:border-[#112250] transition-all">
                  <Search className="ml-3 h-5 w-5 text-[#3B507D] shrink-0" />
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by condition name, symptom, or ORPHA code..."
                    className="w-full bg-transparent px-3 py-2 text-sm text-[#112250] outline-none placeholder:text-[#3B507D]/60 font-medium sm:text-base"
                  />
                  {query && (
                    <button
                      onClick={() => setQuery("")}
                      className="mr-2 rounded-xl bg-[#F5F4F0] p-2 text-xs font-bold text-[#112250] hover:bg-[#E7E2CE] transition-colors"
                      aria-label="Clear search query"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => {}}
                    className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-[#112250] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#3B507D] transition-colors shrink-0"
                  >
                    <span>Search</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Card / Graphic */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="absolute -inset-4 -z-10 rounded-[3rem] bg-gradient-to-br from-[#E7E2CE] via-[#F5F4F0] to-[#3B507D]/15" />
                <div className="relative overflow-hidden rounded-[2.5rem] border-2 border-[#E7E2CE] bg-white p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="rounded-2xl bg-[#112250] p-3 text-white">
                      <BookOpen className="h-6 w-6 text-[#E7E2CE]" />
                    </div>
                    <EdelweissFlower size={36} />
                  </div>

                  <span className="inline-flex items-center gap-2 rounded-full bg-[#E7E2CE]/60 px-3.5 py-1 text-xs font-bold text-[#112250] mb-3">
                    <Sparkles className="h-3.5 w-3.5 text-[#3B507D]" />
                    Verified Medical Data
                  </span>

                  <h3 className="font-heading font-black text-2xl text-[#112250]">
                    7,000+ Conditions
                  </h3>
                  <p className="font-sans text-sm text-[#3B507D] mt-2 font-medium leading-relaxed">
                    Reviewed by pediatric geneticists and metabolic specialists to ensure medical clarity for families.
                  </p>

                  <div className="mt-6 space-y-2.5 border-t border-[#F5F4F0] pt-4 text-xs font-bold text-[#112250]">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#3B507D]" />
                      <span>Plain-language medical breakdowns</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#3B507D]" />
                      <span>Gene Therapy & Clinical Trial updates</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider variant="wave" className="-mt-1 text-[#F5F4F0]" />

      {/* ================= FILTERS & LISTING SECTION ================= */}
      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        {/* Category Pills & Status Select */}
        <div className="mb-8 rounded-3xl border-2 border-[#E7E2CE] bg-white p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            {/* Categories scrollable */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-callout mr-2 text-xs font-bold uppercase tracking-wider text-[#3B507D] flex items-center gap-1.5">
                <Filter className="h-4 w-4" />
                Category:
              </span>
              {CATEGORY_FILTERS.map((category) => (
                <button
                  key={category}
                  onClick={() => setCat(category)}
                  className={`px-3 py-1.5 text-xs font-semibold transition-all ${
                    cat === category
                      ? "border-b-2 border-[#112250] text-[#112250] bg-transparent font-bold"
                      : "border-b-2 border-transparent text-[#3B507D] bg-transparent hover:text-[#112250] hover:border-[#E7E2CE]"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Status Select & Reset */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="rounded-2xl border-2 border-[#E7E2CE] bg-[#F5F4F0] px-4 py-2 text-xs font-bold text-[#112250] outline-none hover:border-[#112250] transition-colors"
              >
                {STATUS_FILTERS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              {(cat !== "All" || status !== "All Status" || query) && (
                <button
                  onClick={clearFilters}
                  className="rounded-2xl border border-[#D4183D]/30 bg-[#FDE8E8] px-3.5 py-2 text-xs font-bold text-[#D4183D] hover:bg-[#D4183D] hover:text-white transition-all"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="mb-6 flex items-center justify-between px-1">
          <p className="font-sans text-sm font-bold text-[#3B507D]">
            Showing <strong className="text-[#112250] font-black">{filtered.length}</strong> conditions cataloged
          </p>
        </div>

        {/* DISEASE CARDS GRID WITH STAGGER ANIMATIONS & GLOW HOVER */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-64 animate-pulse rounded-3xl bg-white border-2 border-[#E7E2CE]"
              />
            ))}
          </div>
        ) : currentItems.length > 0 ? (
          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {currentItems.map((disease) => (
              <motion.div
                key={disease.id}
                variants={fadeUpVariants}
                whileHover={{ y: -6, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="h-full rounded-3xl transition-all"
              >
                <DiseaseCard
                  disease={disease}
                  onClick={() => onDisease(disease.id)}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="rounded-3xl border-2 border-[#E7E2CE] bg-white p-8 sm:p-12 text-center">
            <ZebraEmptyState
              message="No conditions match your search criteria"
              sub="Try broadening your keywords or clearing selected category filters."
            />
            <button
              onClick={clearFilters}
              className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-[#112250] px-6 py-3 text-sm font-bold text-white hover:bg-[#3B507D] transition-colors"
            >
              <span>Reset All Filters</span>
            </button>
          </div>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            <button
              disabled={safeCurrentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-[#E7E2CE] bg-white text-sm font-bold text-[#112250] disabled:opacity-30 hover:bg-[#F5F4F0] transition-colors"
              aria-label="Previous Page"
            >
              ←
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`flex h-11 min-w-[2.75rem] items-center justify-center rounded-2xl border-2 px-3 text-sm font-black transition-all ${
                  safeCurrentPage === page
                    ? "border-[#112250] bg-[#112250] text-white shadow-md shadow-[#112250]/20"
                    : "border-[#E7E2CE] bg-white text-[#112250] hover:bg-[#F5F4F0]"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              disabled={safeCurrentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-[#E7E2CE] bg-white text-sm font-bold text-[#112250] disabled:opacity-30 hover:bg-[#F5F4F0] transition-colors"
              aria-label="Next Page"
            >
              →
            </button>
          </div>
        )}
      </section>
    </main>
  );
}