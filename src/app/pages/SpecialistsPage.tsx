import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Building2,
  Search,
  X,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  CheckCircle2,
  Stethoscope,
} from "lucide-react";

import { apiService, Specialist } from "../services/api.service";
import type { ContentNode, Disease as ApiDisease } from "../services/api.service";
import { fetchDiseasesFromAPI, DISEASES } from "../data";
import { renderTextWithLinks, RichTextRunsRenderer } from "../utils/link-helper";
import SpecialistAvatar from "../components/common/SpecialistAvatar";
import { EdelweissFlower, FourPointStar } from "../components/common/Visuals";
import {
  fadeUpVariants,
  staggerContainerVariants,
  modalPanelVariants,
  overlayBackdropVariants,
} from "../utils/animations";

export interface UnifiedSpecialist extends Specialist {
  disease: string;
  diseaseNumber: string;
  diseases: Array<{ name: string; diseaseNumber: string }>;
}

const SPECIALISTS_PER_PAGE = 9;

function normalizeDoctorKey(name: string, org?: string): string {
  const cleanName = (name || '')
    .toLowerCase()
    .replace(/^dr\.?\s+|^prof\.?\s+/i, '')
    .replace(/,\s*m\.?d\.?.*$/i, '')
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const cleanOrg = (org || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return `${cleanName}|${cleanOrg}`;
}

function renderAdditionalContent(nodes?: ContentNode[]): React.ReactNode {
  if (!nodes?.length) return null;

  return nodes.map((node, index) => {
    const title = node.title?.map((run) => run.text).join("").trim();
    return (
      <div key={`${title || node.type}-${index}`} className="space-y-2">
        {title && <h4 className="text-sm font-bold text-[#112250]"><RichTextRunsRenderer runs={node.title} /></h4>}
        {node.content && <div className="break-words text-sm leading-relaxed text-[#3B507D]"><RichTextRunsRenderer runs={node.content} /></div>}
        {renderAdditionalContent(node.children)}
      </div>
    );
  });
}

export default function SpecialistsPage() {
  const [specialists, setSpecialists] = useState<UnifiedSpecialist[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [retryToken, setRetryToken] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSpecialist, setSelectedSpecialist] = useState<UnifiedSpecialist | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadSpecialists = async () => {
      try {
        setLoading(true);
        setLoadError(false);
        let diseases: any[] = [];
        try {
          const apiDiseases = await apiService.getDiseases();
          if (Array.isArray(apiDiseases) && apiDiseases.length > 0) {
            diseases = apiDiseases;
          } else {
            diseases = await fetchDiseasesFromAPI();
          }
        } catch {
          diseases = await fetchDiseasesFromAPI();
        }

        if (!diseases || diseases.length === 0) {
          diseases = DISEASES as any[];
        }

        const extracted = new Map<string, UnifiedSpecialist>();

        diseases.forEach((disease) => {
          if (!disease || typeof disease !== "object") return;
          if (Array.isArray(disease.specialists)) {
            disease.specialists.forEach((spec) => {
              if (!spec || typeof spec !== "object" || typeof spec.name !== "string" || !spec.name.trim()) {
                return;
              }
              const diseaseName = (disease.name || "").trim();
              const diseaseNum = disease.diseaseNumber || "";
              const key = normalizeDoctorKey(spec.name, spec.organization);

              if (extracted.has(key)) {
                const existing = extracted.get(key)!;
                // Add disease if not present
                if (diseaseName && !existing.diseases.some((d) => d.name.toLowerCase() === diseaseName.toLowerCase())) {
                  existing.diseases.push({ name: diseaseName, diseaseNumber: diseaseNum });
                }
                // Merge missing contact info
                if (!existing.contact && spec.contact) existing.contact = spec.contact;
                if (!existing.location && spec.location) existing.location = spec.location;
                if (!existing.publications && spec.publications) existing.publications = spec.publications;
                if (Array.isArray(spec.sources) && spec.sources.length > 0) {
                  const currSources = new Set(existing.sources || []);
                  spec.sources.forEach((s) => currSources.add(s));
                  existing.sources = Array.from(currSources);
                }
              } else {
                const record: UnifiedSpecialist = {
                  ...spec,
                  disease: diseaseName,
                  diseaseNumber: diseaseNum,
                  diseases: diseaseName ? [{ name: diseaseName, diseaseNumber: diseaseNum }] : [],
                };
                extracted.set(key, record);
              }
            });
          }
        });

        if (isMounted) {
          setSpecialists(Array.from(extracted.values()));
          setCurrentPage(1);
        }
      } catch (err) {
        console.error("Failed to load specialists:", err);
        if (isMounted) setLoadError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadSpecialists();
    return () => {
      isMounted = false;
    };
  }, [retryToken]);

  const cleanSpecialistInfo = (spec: UnifiedSpecialist) => {
    return {
      rawName: spec.name,
      profession: spec.profession?.trim() || "",
      specialization: spec.specialization?.trim() || "",
    };
  };

  const filteredSpecialists = specialists.filter((s) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      s.name?.toLowerCase().includes(q) ||
      s.profession?.toLowerCase().includes(q) ||
      s.organization?.toLowerCase().includes(q) ||
      s.specialization?.toLowerCase().includes(q) ||
      s.location?.toLowerCase().includes(q) ||
      s.disease?.toLowerCase().includes(q) ||
      s.diseases?.some((d) => d.name.toLowerCase().includes(q)) ||
      s.publications?.toLowerCase().includes(q);

    return matchSearch;
  });
  const totalPages = Math.ceil(filteredSpecialists.length / SPECIALISTS_PER_PAGE);
  const displayedPage = totalPages > 0 ? Math.min(currentPage, totalPages) : 1;
  const firstVisibleIndex = filteredSpecialists.length === 0
    ? 0
    : (displayedPage - 1) * SPECIALISTS_PER_PAGE;
  const paginatedSpecialists = filteredSpecialists.slice(
    firstVisibleIndex,
    firstVisibleIndex + SPECIALISTS_PER_PAGE,
  );
  const lastVisibleIndex = Math.min(firstVisibleIndex + SPECIALISTS_PER_PAGE, filteredSpecialists.length);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);
    if (totalPages === 0 && currentPage !== 1) setCurrentPage(1);
  }, [currentPage, totalPages]);

  const changePage = (nextPage: number) => {
    setCurrentPage(nextPage);
    requestAnimationFrame(() => {
      document.getElementById("specialist-directory")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <div className="relative z-10 min-h-screen bg-transparent pb-24 text-[#112250] selection:bg-[#DDF0FA] selection:text-[#112250]">
      {/* ================= HERO SECTION WITH BACKGROUND IMAGE ================= */}
      <section className="relative overflow-hidden mx-4 sm:mx-6 lg:mx-8 mt-2 mb-6 rounded-[2rem] sm:rounded-[2.75rem] border border-[#112250]/15 shadow-xl bg-[#070D1E]">
        {/* Background Photo & Dark Gradient Overlays */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1600&q=80"
            alt="Clinical specialist physician consulting in pediatric medical center"
            className="h-full w-full object-cover object-center"
          />
          {/* Multi-layer gradient overlays to guarantee WCAG AAA text legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#070D1E]/85 via-[#0D1B3E]/80 to-[#070D1E]/92 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#070D1E]/40 to-[#070D1E]/80 pointer-events-none" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20 text-center">
          {/* Centered Pill Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-4 py-1.5 text-xs font-semibold text-white shadow-xs mb-5">
            <FourPointStar size={11} className="text-[#7DD3FC] shrink-0" />
            <span className="uppercase tracking-wider text-[11px] font-bold">Specialist Directory</span>
          </div>

          {/* Centered Large Headline */}
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-black leading-[1.18] tracking-tight text-white max-w-4xl mx-auto drop-shadow-sm">
            Connect with Certified Geneticists &amp; Rare Care Centers.
          </h1>

          {/* Centered Subtitle */}
          <p className="font-sans mt-4 max-w-3xl mx-auto text-base sm:text-lg leading-relaxed text-[#D6E0F5] font-normal">
            Find board-certified genetic counselors, pediatric rare disease clinics, and academic medical centers dedicated to rare conditions.
          </p>

          {/* Centered Search Bar */}
          <div className="mt-8 max-w-2xl mx-auto">
            <label htmlFor="specialist-search" className="sr-only">Search specialists</label>
            <div className="flex items-center rounded-full border-2 border-white/30 bg-white p-2 shadow-2xl transition-all focus-within:border-white focus-within:ring-2 focus-within:ring-[#38BDF8]">
              <Search className="ml-3 h-5 w-5 shrink-0 text-[#3B507D]" aria-hidden="true" />
              <input
                id="specialist-search"
                type="text"
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by name, expertise, organization, location, or condition..."
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                className="min-w-0 w-full bg-transparent px-3 py-2 text-sm font-medium text-[#112250] border-0 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none shadow-none focus:shadow-none placeholder:text-[#3B507D]/70 sm:text-base"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setCurrentPage(1);
                  }}
                  aria-label="Clear specialist search"
                  className="mr-1 rounded-full p-2 text-[#112250] hover:bg-[#EDF6FC] cursor-pointer"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ================= SPECIALIST LISTING ================= */}
      <section id="specialist-directory" className="scroll-mt-24 mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        {/* Counter */}
        <div className="mb-6 flex items-center justify-between px-1">
          <p className="font-sans text-sm font-semibold text-[#3B507D]" aria-live="polite">
            {filteredSpecialists.length > 0 ? (
              <>Showing <strong className="text-[#112250] font-black">{firstVisibleIndex + 1}–{lastVisibleIndex}</strong> of <strong className="text-[#112250] font-black">{filteredSpecialists.length}</strong> disease-linked records</>
            ) : (
              <>Showing <strong className="text-[#112250] font-black">0</strong> disease-linked records</>
            )}
          </p>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-52 animate-pulse rounded-2xl bg-white border border-[#BCE0F5]"
              />
            ))}
          </div>
        ) : loadError ? (
          <div role="alert" className="rounded-3xl border border-[#BCE0F5] bg-white p-8 text-center shadow-xs">
            <h2 className="font-heading text-lg font-bold text-[#112250]">Specialist records are unavailable</h2>
            <p className="mt-2 text-sm text-[#3B507D]">The directory could not load its source data. Please try again.</p>
            <button
              type="button"
              onClick={() => setRetryToken((token) => token + 1)}
              className="mt-4 rounded-full bg-[#112250] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#1e3a7a] cursor-pointer shadow-xs"
            >
              Try again
            </button>
          </div>
        ) : filteredSpecialists.length > 0 ? (
          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {paginatedSpecialists.map((spec) => {
              const { rawName, profession, specialization } = cleanSpecialistInfo(spec);

              return (
                <motion.article
                  key={`${spec.name}-${spec.organization}`}
                  variants={fadeUpVariants}
                  className="flex min-w-0 flex-col rounded-2xl border border-[#BCE0F5] bg-white p-5 transition-all hover:border-[#112250] hover:shadow-[0_8px_24px_rgba(17,34,80,0.06)] sm:p-6 shadow-xs"
                >
                  <div>
                    <div className="mb-4 flex min-w-0 items-start gap-4">
                      <SpecialistAvatar name={rawName} photoUrl={spec.photoUrl} />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap gap-1.5 mb-1.5">
                          {spec.diseases && spec.diseases.length > 0 ? (
                            spec.diseases.map((d, dIdx) => (
                              <span
                                key={dIdx}
                                className="inline-block max-w-full break-words rounded-full bg-[#EDF6FC] px-2.5 py-0.5 text-[10px] font-bold text-[#112250] border border-[#BCE0F5]"
                              >
                                {d.name}
                              </span>
                            ))
                          ) : (
                            <span className="inline-block max-w-full break-words rounded-full bg-[#EDF6FC] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#112250] border border-[#BCE0F5]">
                              {spec.disease}
                            </span>
                          )}
                        </div>
                        <h2 className="break-words font-heading text-lg font-bold leading-snug text-[#112250]">
                          {rawName}
                        </h2>
                        {profession && <p className="mt-1 break-words text-sm font-semibold text-[#3B507D]">{profession}</p>}
                      </div>
                    </div>

                    <div className="space-y-2 border-t border-[#EDF6FC] pt-3 text-xs text-[#3B507D] font-medium">
                      {specialization && (
                        <div>
                          <p className="font-bold text-[#112250]">Specialty / expertise</p>
                          <p className="mt-0.5 break-words leading-relaxed">{specialization}</p>
                        </div>
                      )}
                      {spec.organization && (
                        <div className="flex items-center gap-2">
                          <Building2 className="h-3.5 w-3.5 text-[#112250] shrink-0" />
                          <span className="break-words">{spec.organization}</span>
                        </div>
                      )}
                      {spec.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5 text-[#112250] shrink-0" />
                          <span className="break-words">{spec.location}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedSpecialist(spec)}
                    className="mt-5 flex min-h-11 items-center justify-between border-t border-[#EDF6FC] pt-3 text-left text-sm font-bold text-[#112250] hover:text-[#243B6B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#112250] cursor-pointer"
                  >
                    <span>View profile details</span>
                    <ChevronRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                  </button>
                </motion.article>
              );
            })}
          </motion.div>
        ) : (
          <div className="rounded-3xl border border-[#BCE0F5] bg-white p-12 text-center shadow-xs">
            <h3 className="font-heading text-xl font-bold text-[#112250]">No specialists found</h3>
            <p className="text-sm text-[#3B507D] mt-1">Try clearing your search terms.</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setCurrentPage(1);
              }}
              className="mt-4 rounded-full bg-[#112250] px-6 py-3 text-sm font-bold text-white hover:bg-[#1e3a7a] transition-colors cursor-pointer shadow-xs"
            >
              Reset Filters
            </button>
          </div>
        )}

        {!loading && !loadError && totalPages > 1 && (
          <nav aria-label="Specialist directory pagination" className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => changePage(displayedPage - 1)}
              disabled={displayedPage === 1}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#BCE0F5] bg-white px-5 py-2 text-sm font-bold text-[#112250] transition-colors hover:bg-[#EDF6FC] disabled:cursor-not-allowed disabled:opacity-45 shadow-xs cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              Previous
            </button>
            <span className="min-w-24 text-center text-sm font-semibold text-[#3B507D]" aria-current="page">
              Page {displayedPage} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => changePage(displayedPage + 1)}
              disabled={displayedPage === totalPages}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#BCE0F5] bg-white px-5 py-2 text-sm font-bold text-[#112250] transition-colors hover:bg-[#EDF6FC] disabled:cursor-not-allowed disabled:opacity-45 shadow-xs cursor-pointer"
            >
              Next
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </nav>
        )}
      </section>

      {/* ================= SPECIALIST DETAILS MODAL ================= */}
      <AnimatePresence>
        {selectedSpecialist && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 md:p-8 overflow-y-auto">
            <motion.div
              variants={overlayBackdropVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={() => setSelectedSpecialist(null)}
              className="fixed inset-0 bg-[#112250]/65 backdrop-blur-sm"
            />

            <motion.div
              variants={modalPanelVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="relative w-full max-w-3xl lg:max-w-4xl max-h-[90vh] flex flex-col rounded-[2rem] sm:rounded-[2.5rem] border-2 border-[#112250]/15 bg-white shadow-2xl z-10 my-auto overflow-hidden"
            >
              {(() => {
                const { rawName, profession, specialization } = cleanSpecialistInfo(selectedSpecialist);

                return (
                  <>
                    {/* Modal Header */}
                    <div className="relative px-6 sm:px-8 pt-6 sm:pt-8 pb-5 border-b border-[#EDF6FC] bg-[#FAF9F5] shrink-0">
                      <button
                        type="button"
                        onClick={() => setSelectedSpecialist(null)}
                        className="absolute top-5 right-5 sm:top-6 sm:right-6 rounded-full bg-white border border-[#112250]/15 p-2.5 text-[#112250] hover:bg-[#EDF6FC] hover:border-[#112250] transition-colors cursor-pointer shadow-xs z-10"
                        aria-label="Close specialist modal"
                      >
                        <X className="h-5 w-5" />
                      </button>

                      <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 pr-12">
                        <SpecialistAvatar
                          name={rawName}
                          photoUrl={selectedSpecialist.photoUrl}
                          className="h-20 w-20 sm:h-24 sm:w-24 shrink-0 rounded-2xl shadow-sm border-2 border-white"
                        />
                        <div className="min-w-0 flex-1">
                          {/* Disease Badges */}
                          <div className="flex flex-wrap gap-1.5 mb-2.5">
                            {selectedSpecialist.diseases && selectedSpecialist.diseases.length > 0 ? (
                              selectedSpecialist.diseases.map((d, dIdx) => (
                                <span
                                  key={dIdx}
                                  className="inline-flex items-center gap-1.5 rounded-full bg-[#EDF6FC] px-3 py-1 text-xs font-bold text-[#112250] border border-[#BCE0F5]"
                                >
                                  <FourPointStar size={9} className="text-[#112250] shrink-0" />
                                  <span>{d.name}</span>
                                </span>
                              ))
                            ) : (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EDF6FC] px-3 py-1 text-xs font-bold text-[#112250] border border-[#BCE0F5]">
                                <FourPointStar size={9} className="text-[#112250] shrink-0" />
                                <span>{selectedSpecialist.disease}</span>
                              </span>
                            )}
                          </div>

                          <h2 className="break-words font-heading text-2xl sm:text-3xl font-black text-[#112250] tracking-tight">
                            {rawName}
                          </h2>
                          {profession && (
                            <p className="mt-1 break-words text-sm sm:text-base font-semibold text-[#3B507D] leading-snug">
                              {profession}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Scrollable Content Body */}
                    <div className="overflow-y-auto px-6 sm:px-8 py-6 space-y-5 flex-1">
                      {/* Specialty / Clinical Focus Box */}
                      {specialization && (
                        <div className="rounded-2xl bg-[#EDF6FC]/70 p-5 sm:p-6 border border-[#BCE0F5]">
                          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#243B6B] mb-2">
                            <Stethoscope className="h-4 w-4 text-[#243B6B] shrink-0" />
                            <span>Clinical Focus &amp; Specialty</span>
                          </div>
                          <p className="text-sm sm:text-base text-[#112250] leading-relaxed font-medium">
                            {specialization}
                          </p>
                        </div>
                      )}

                      {/* Organization & Location 2-Column Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {selectedSpecialist.organization && (
                          <div className="rounded-2xl border border-[#BCE0F5] bg-[#FAF9F5] p-5 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#243B6B] mb-2">
                                <Building2 className="h-4 w-4 text-[#243B6B] shrink-0" />
                                <span>Medical Center / Institution</span>
                              </div>
                              <p className="text-sm sm:text-base font-bold text-[#112250] leading-snug">
                                {selectedSpecialist.organization}
                              </p>
                            </div>
                          </div>
                        )}

                        {selectedSpecialist.location && (
                          <div className="rounded-2xl border border-[#BCE0F5] bg-[#FAF9F5] p-5 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#243B6B] mb-2">
                                <MapPin className="h-4 w-4 text-[#243B6B] shrink-0" />
                                <span>Practice Location</span>
                              </div>
                              <p className="text-sm sm:text-base font-bold text-[#112250] leading-snug">
                                {selectedSpecialist.location}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Appointments & Direct Contact */}
                      {selectedSpecialist.contact && (
                        <div className="rounded-2xl border border-[#BCE0F5] bg-white p-5 sm:p-6 shadow-xs">
                          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#243B6B] mb-2.5">
                            <ExternalLink className="h-4 w-4 text-[#243B6B] shrink-0" />
                            <span>Appointments &amp; Direct Contact Guidance</span>
                          </div>
                          <div className="text-sm sm:text-base text-[#3B507D] leading-relaxed font-medium">
                            {renderTextWithLinks(selectedSpecialist.contact)}
                          </div>
                        </div>
                      )}

                      {/* Publications & Clinical Trials */}
                      {selectedSpecialist.publications && (
                        <div className="rounded-2xl border border-[#BCE0F5] bg-[#FAF9F5] p-5 sm:p-6">
                          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#243B6B] mb-2.5">
                            <BookOpen className="h-4 w-4 text-[#243B6B] shrink-0" />
                            <span>Key Publications &amp; Active Clinical Trials</span>
                          </div>
                          <div className="text-sm sm:text-base text-[#112250] leading-relaxed">
                            {renderTextWithLinks(selectedSpecialist.publications)}
                          </div>
                        </div>
                      )}

                      {/* Additional Content */}
                      {selectedSpecialist.additionalContent && selectedSpecialist.additionalContent.length > 0 && (
                        <div className="space-y-4 rounded-2xl border border-[#BCE0F5] bg-white p-5 sm:p-6">
                          {renderAdditionalContent(selectedSpecialist.additionalContent)}
                        </div>
                      )}

                      {/* Verified Sources & External References */}
                      {selectedSpecialist.sources && selectedSpecialist.sources.length > 0 && (
                        <div className="rounded-2xl border border-[#BCE0F5]/80 bg-[#EDF6FC]/40 p-5">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-[#243B6B] mb-2.5 flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            <span>Verified Medical Literature &amp; Consortium Sources</span>
                          </h4>
                          <ul className="space-y-2">
                            {selectedSpecialist.sources.map((source, sIdx) => (
                              <li key={sIdx} className="break-all text-xs sm:text-sm text-[#3B507D] flex items-start gap-2">
                                <span className="text-[#243B6B] font-bold">•</span>
                                <span>{renderTextWithLinks(source)}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Modal Footer */}
                    <div className="px-6 sm:px-8 py-4 border-t border-[#EDF6FC] bg-[#FAF9F5] flex flex-wrap items-center justify-end gap-3 shrink-0">
                      <button
                        type="button"
                        onClick={() => setSelectedSpecialist(null)}
                        className="rounded-full bg-[#112250] hover:bg-[#1C376F] px-8 py-3 text-sm font-bold text-white shadow-md hover:shadow-lg transition-all cursor-pointer"
                      >
                        Close Details
                      </button>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}