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
  ChevronLeft,
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
  const [query, setQuery] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("rb_search_query");
      if (saved) {
        sessionStorage.removeItem("rb_search_query");
        return saved;
      }
    }
    return "";
  });
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

  function matchesCategory(d: any, category: string): boolean {
    if (category === "All") return true;
    const target = category.toLowerCase().trim();

    if (Array.isArray(d.categories)) {
      if (d.categories.some((c: string) => String(c).toLowerCase().trim() === target)) return true;
    }
    if (Array.isArray(d.categoryBadges)) {
      if (d.categoryBadges.some((c: string) => String(c).toLowerCase().trim() === target)) return true;
    }
    if (typeof d.category === "string") {
      const parts = d.category.split(/[,/]+/).map((s: string) => s.trim().toLowerCase());
      if (parts.includes(target) || d.category.toLowerCase().trim() === target) return true;
    }

    return false;
  }

  const filtered = diseases.filter((d) => {
    const q = query.trim().toLowerCase();

    const matchQ =
      !q ||
      String(d.name || "").toLowerCase().includes(q) ||
      String(d.category || "").toLowerCase().includes(q) ||
      (Boolean(d.shortDesc) && String(d.shortDesc).toLowerCase().includes(q)) ||
      (Boolean(d.orphaCode) && String(d.orphaCode).toLowerCase().includes(q));

    const matchC = matchesCategory(d, cat);

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
    <div className="relative min-h-screen bg-transparent pb-24 text-[#112250] selection:bg-[#DDF0FA] selection:text-[#112250] overflow-hidden">
      {/* ================= HERO BANNER ================= */}
      <section className="relative overflow-hidden bg-transparent pt-10 pb-14 lg:pt-14 lg:pb-16">
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            {/* Left Content */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#EDF6FC] border border-[#BCE0F5] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#112250] mb-4 shadow-xs">
                <Sparkles className="h-3.5 w-3.5 text-[#243B6B]" />
                <span>Comprehensive Knowledge Base</span>
              </div>

              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black leading-[1.15] tracking-tight text-[#112250]">
                Rare Disease Library & Medical Guides
              </h1>

              <p className="font-sans mt-3 text-base sm:text-lg leading-relaxed text-[#3B507D] font-medium max-w-2xl">
                Explore 7,000+ conditions simplified into plain language with symptoms, genetic causes, approved treatments, and active trial updates.
              </p>

              {/* Search Box */}
              <div className="mt-8 max-w-2xl">
                <div className="relative flex items-center rounded-full border border-[#BCE0F5] bg-white p-2 shadow-sm focus-within:border-[#112250] transition-all">
                  <Search className="ml-3 h-5 w-5 text-[#3B507D] shrink-0" />
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by condition name, symptom, or ORPHA code..."
                    aria-label="Search conditions by name, symptom, or ORPHA code"
                    className="w-full bg-transparent px-3 py-2 text-sm text-[#112250] outline-none placeholder:text-[#3B507D]/60 font-medium sm:text-base"
                  />
                  {query && (
                    <button
                      onClick={() => setQuery("")}
                      className="mr-2 rounded-full bg-[#EDF6FC] p-2 text-xs font-bold text-[#112250] hover:bg-[#DDF0FA] transition-colors cursor-pointer"
                      aria-label="Clear search query"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => { }}
                    className="hidden sm:inline-flex items-center gap-2 rounded-full bg-[#112250] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#1e3a7a] transition-colors shrink-0 shadow-xs cursor-pointer"
                  >
                    <span>Search</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Card with Genuine Medical Photograph */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] rounded-[2.25rem] overflow-hidden border border-[#112250]/15 shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80"
                  alt="Clinical specialist reviewing medical guides and diagnostic literature"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070D1E]/90 via-[#070D1E]/30 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <span className="rounded-full bg-[#112250] border border-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#BCE0F5]">
                    Source-Based Library
                  </span>
                  <p className="mt-2 font-heading text-lg font-bold leading-snug">
                    7,000+ conditions curated with certified genetic precision.
                  </p>
                </div>
              </div>

              {/* Floating Badge Widget */}
              <div className="absolute -bottom-4 -right-3 hidden sm:flex items-center gap-3 rounded-2xl border border-[#112250]/15 bg-white/95 backdrop-blur-md p-3.5 shadow-xl text-[#112250]">
                <div className="w-9 h-9 rounded-xl bg-[#EDF6FC] text-[#112250] flex items-center justify-center font-bold">
                  ✓
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider">ORPHA &amp; OMIM Sourced</p>
                  <p className="text-[11px] text-[#3B507D]">Plain-Language Medical Summaries</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-2 mb-2">
        <SectionDivider variant="scallop" color="blue" className="opacity-80" />
      </div>

      {/* ================= FILTERS & LISTING SECTION ================= */}
      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        {/* Category Pills & Status Select */}
        <div className="mb-8 rounded-3xl border border-[#BCE0F5] bg-white p-6 shadow-xs">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            {/* Categories scrollable */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-callout mr-2 text-xs font-bold uppercase tracking-wider text-[#3B507D] flex items-center gap-1.5">
                <Filter className="h-4 w-4" />
                Category:
              </span>
              {CATEGORY_FILTERS.map((category) => {
                const count = category === "All"
                  ? diseases.length
                  : diseases.filter((d) => matchesCategory(d, category)).length;
                const isActive = cat === category;
                return (
                  <button
                    key={category}
                    onClick={() => setCat(category)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${isActive
                        ? "bg-[#112250] text-white font-bold shadow-xs"
                        : "text-[#112250] bg-[#EDF6FC] hover:bg-[#DDF0FA]"
                      }`}
                  >
                    <span>{category}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${isActive ? "bg-white/20 text-white" : "bg-black/5 text-[#3B507D]"
                        }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Status Select & Reset */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                aria-label="Filter conditions by research status"
                className="rounded-full border border-[#BCE0F5] bg-[#FAF9F5] px-4 py-2 text-xs font-bold text-[#112250] outline-none hover:border-[#112250] transition-colors cursor-pointer"
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
                  className="rounded-full border border-[#D4183D]/30 bg-[#FDE8E8] px-4 py-2 text-xs font-bold text-[#D4183D] hover:bg-[#D4183D] hover:text-white transition-all cursor-pointer"
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
                className="h-64 animate-pulse rounded-2xl bg-white border border-[#BCE0F5]"
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
                className="h-full rounded-2xl transition-all"
              >
                <DiseaseCard
                  disease={disease}
                  onClick={() => onDisease(disease.id)}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="rounded-3xl border border-[#BCE0F5] bg-white p-8 sm:p-12 text-center shadow-xs">
            <ZebraEmptyState
              message="No conditions match your search criteria"
              sub="Try broadening your keywords or clearing selected category filters."
            />
            <button
              onClick={clearFilters}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#112250] px-6 py-3 text-sm font-bold text-white hover:bg-[#1e3a7a] transition-colors cursor-pointer shadow-xs"
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
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#BCE0F5] bg-white text-sm font-bold text-[#112250] disabled:opacity-30 hover:bg-[#EDF6FC] transition-colors cursor-pointer disabled:cursor-not-allowed shadow-xs"
              aria-label="Previous Page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                aria-label={`Go to page ${page}`}
                aria-current={safeCurrentPage === page ? "page" : undefined}
                className={`flex h-11 min-w-[2.75rem] items-center justify-center rounded-full border px-3 text-sm font-black transition-all cursor-pointer shadow-xs ${safeCurrentPage === page
                    ? "border-[#112250] bg-[#112250] text-white shadow-md shadow-[#112250]/20"
                    : "border-[#BCE0F5] bg-white text-[#112250] hover:bg-[#EDF6FC]"
                  }`}
              >
                {page}
              </button>
            ))}

            <button
              disabled={safeCurrentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#BCE0F5] bg-white text-sm font-bold text-[#112250] disabled:opacity-30 hover:bg-[#EDF6FC] transition-colors cursor-pointer disabled:cursor-not-allowed shadow-xs"
              aria-label="Next Page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </section>
    </div>
  );
}