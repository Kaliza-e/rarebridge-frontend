import React, { useState, useEffect } from "react";
import { Search, SlidersHorizontal, X, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { DISEASES, CATEGORY_FILTERS, STATUS_FILTERS, fetchDiseasesFromAPI } from "../data";
import { ZebraEmptyState, DiseaseCard, ButterflyDoodle, EdelweissFlower } from "../components/common/Visuals";

export default function DirectoryPage({ onDisease }: { onDisease: (id: string) => void }) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("All");
  const [status, setStatus] = useState("All Status");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [diseases, setDiseases] = useState(DISEASES);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    async function loadDiseases() {
      setLoading(true);
      try {
        const apiDiseases = await fetchDiseasesFromAPI(query, cat === "All" ? undefined : cat);
        setDiseases(apiDiseases);
        setCurrentPage(1); // Reset to page 1 when data changes
      } catch (error) {
        console.error('Failed to load diseases:', error);
        setDiseases(DISEASES);
      } finally {
        setLoading(false);
      }
    }
    loadDiseases();
  }, [query, cat]);

  const filtered = diseases.filter(d => {
    const q = query.toLowerCase();
    const matchQ = !q || d.name.toLowerCase().includes(q) || d.category.toLowerCase().includes(q);
    const matchC = cat === "All" || d.categoryBadges?.includes(cat);
    const matchS = status === "All Status" || (d as any).researchStatus === status;
    return matchQ && matchC && matchS;
  });

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filtered.slice(startIndex, endIndex);

  // Reset to page 1 if current page exceeds total pages
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  const hasActiveFilters = cat !== "All" || status !== "All Status";

  function clearFilters() {
    setCat("All");
    setStatus("All Status");
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Left side curvy lines */}
      <svg className="fixed left-0 top-0 h-full w-32 pointer-events-none opacity-10" viewBox="0 0 100 1000" preserveAspectRatio="none">
        <path d="M20 0 Q50 100 20 200 T20 400 T20 600 T20 800 T20 1000" stroke="var(--primary)" strokeWidth="3" fill="none" />
        <path d="M40 0 Q70 150 40 300 T40 600 T40 900 T40 1000" stroke="var(--purple)" strokeWidth="2" fill="none" />
        <path d="M60 0 Q90 200 60 400 T60 800 T60 1000" stroke="var(--green)" strokeWidth="2" fill="none" />
        <path d="M10 100 Q40 150 10 200 T10 300 T10 400" stroke="var(--accent)" strokeWidth="2" fill="none" />
        <path d="M80 200 Q50 250 80 300 T80 400 T80 500" stroke="var(--secondary)" strokeWidth="2" fill="none" />
      </svg>

      {/* Right side curvy lines */}
      <svg className="fixed right-0 top-0 h-full w-32 pointer-events-none opacity-10" viewBox="0 0 100 1000" preserveAspectRatio="none">
        <path d="M80 0 Q50 100 80 200 T80 400 T80 600 T80 800 T80 1000" stroke="var(--primary)" strokeWidth="3" fill="none" />
        <path d="M60 0 Q30 150 60 300 T60 600 T60 900 T60 1000" stroke="var(--purple)" strokeWidth="2" fill="none" />
        <path d="M40 0 Q10 200 40 400 T40 800 T40 1000" stroke="var(--green)" strokeWidth="2" fill="none" />
        <path d="M90 100 Q60 150 90 200 T90 300 T90 400" stroke="var(--accent)" strokeWidth="2" fill="none" />
        <path d="M20 200 Q50 250 20 300 T20 400 T20 500" stroke="var(--secondary)" strokeWidth="2" fill="none" />
      </svg>
      {/* ── Page header ── */}
      <div className="relative overflow-hidden bg-primary py-6 sm:py-8">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-secondary opacity-10 blur-[80px]" />
          <div className="absolute top-0 right-0 w-[200px] h-[200px] rounded-full bg-accent opacity-5 blur-[60px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-7 h-7 rounded-xl bg-secondary/20 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-secondary" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-secondary/70">Disease Library</span>
            </div>
            <h1 className="font-black text-2xl md:text-3xl text-ivory tracking-tight">Explore Diseases</h1>
            <p className="text-taupe text-sm max-w-xl mt-1">Browse our comprehensive library of rare conditions with plain-language explanations and expert-reviewed details.</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* ── Search + filter bar ── */}
        <div className="bg-white rounded-3xl border border-taupe-40/60 shadow-sm overflow-hidden mb-8">
          {/* Search row */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-taupe-40/40">
            <Search className="w-5 h-5 text-taupe shrink-0" />
            <input
              className="flex-1 bg-transparent text-primary placeholder-taupe text-base font-medium outline-none"
              placeholder="Search by name, category, or symptom…"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            {query && (
              <button onClick={() => setQuery("")} className="p-1 rounded-lg hover:bg-secondary transition-colors">
                <X className="w-4 h-4 text-taupe" />
              </button>
            )}
            <div className="w-px h-6 bg-taupe-40/40" />
            <button
              onClick={() => setFiltersOpen(o => !o)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 ${filtersOpen || hasActiveFilters ? "bg-primary text-ivory" : "bg-secondary text-primary hover:bg-primary hover:text-ivory"
                }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <span className="w-4 h-4 rounded-full bg-secondary text-primary text-[10px] font-black flex items-center justify-center">
                  {(cat !== "All" ? 1 : 0) + (status !== "All Status" ? 1 : 0)}
                </span>
              )}
            </button>
          </div>

          {/* Expandable filter panel */}
          {filtersOpen && (
            <div className="px-5 py-5 bg-ivory/50 flex flex-wrap gap-8">
              <div>
                <p className="text-xs text-taupe mb-3 font-bold uppercase tracking-widest">Category</p>
                <div className="flex flex-wrap gap-2">
                  {CATEGORY_FILTERS.map(f => (
                    <button
                      key={f}
                      onClick={() => setCat(f)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${cat === f
                          ? "bg-primary text-ivory shadow-sm"
                          : "bg-white border border-taupe-40 text-accent hover:border-primary hover:text-primary"
                        }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-taupe mb-3 font-bold uppercase tracking-widest">Research Status</p>
                <div className="flex flex-wrap gap-2">
                  {STATUS_FILTERS.map(f => (
                    <button
                      key={f}
                      onClick={() => setStatus(f)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${status === f
                          ? "bg-primary text-ivory shadow-sm"
                          : "bg-white border border-taupe-40 text-accent hover:border-primary hover:text-primary"
                        }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              {hasActiveFilters && (
                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1.5 text-xs font-semibold text-accent hover:text-primary transition-colors"
                  >
                    <X className="w-3.5 h-3.5" /> Clear filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Active filter chips ── */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs text-taupe font-medium">Active:</span>
            {cat !== "All" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                {cat}
                <button onClick={() => setCat("All")}><X className="w-3 h-3" /></button>
              </span>
            )}
            {status !== "All Status" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                {status}
                <button onClick={() => setStatus("All Status")}><X className="w-3 h-3" /></button>
              </span>
            )}
          </div>
        )}

        {/* ── Results count ── */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-taupe font-medium">
            <span className="font-black text-primary text-base">{filtered.length}</span> disease{filtered.length !== 1 ? "s" : ""} found
          </p>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-taupe-40 hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4 text-primary" />
              </button>
              <span className="text-sm font-medium text-primary">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-taupe-40 hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-4 h-4 text-primary" />
              </button>
            </div>
          )}
        </div>

        {/* ── Grid ── */}
        {currentItems.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentItems.map(d => (
              <DiseaseCard key={d.id} disease={d} onClick={() => onDisease(d.id)} />
            ))}
          </div>
        ) : (
          <ZebraEmptyState
            message="No diseases found"
            sub="Try adjusting your filters or search terms"
          />
        )}
      </div>
    </div>
  );
}
