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
} from "lucide-react";

import { apiService, Specialist } from "../services/api.service";
import type { ContentNode, Disease as ApiDisease } from "../services/api.service";
import { renderTextWithLinks, RichTextRunsRenderer } from "../utils/link-helper";
import SpecialistAvatar from "../components/common/SpecialistAvatar";
import { EdelweissFlower } from "../components/common/Visuals";
import {
  fadeUpVariants,
  staggerContainerVariants,
  modalPanelVariants,
  overlayBackdropVariants,
} from "../utils/animations";

interface SpecialistWithDisease extends Specialist {
  disease: string;
  diseaseNumber: string;
}

const SPECIALISTS_PER_PAGE = 9;

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
  const [specialists, setSpecialists] = useState<SpecialistWithDisease[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [retryToken, setRetryToken] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSpecialist, setSelectedSpecialist] = useState<SpecialistWithDisease | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadSpecialists = async () => {
      try {
        setLoading(true);
        setLoadError(false);
        const diseases = await apiService.getDiseases();
        const extracted = new Map<string, SpecialistWithDisease>();

        diseases.forEach((disease) => {
          if (!disease || typeof disease !== "object") {
            console.error("Ignoring malformed disease record while loading specialists", disease);
            return;
          }
          if (disease.specialists != null && !Array.isArray(disease.specialists)) {
            console.error("Ignoring malformed specialist list for disease record", {
              diseaseNumber: disease.diseaseNumber,
              disease: disease.name,
            });
            return;
          }
          if (Array.isArray(disease.specialists)) {
            disease.specialists.forEach((spec) => {
              if (!spec || typeof spec !== "object" || typeof spec.name !== "string" ||
                  !spec.name.trim() || typeof disease.name !== "string" || !disease.name.trim()) {
                console.error("Ignoring malformed source specialist record", {
                  diseaseNumber: disease.diseaseNumber,
                  specialist: spec,
                });
                return;
              }
              const record: SpecialistWithDisease = {
                ...spec,
                disease: disease.name.trim(),
                diseaseNumber: disease.diseaseNumber,
              };
              const identity = JSON.stringify([
                record.diseaseNumber || record.disease,
                record.name,
                record.profession,
                record.specialization,
                record.organization,
                record.location,
                record.contact,
                record.publications,
                record.photoUrl,
                record.sources,
                record.links,
                record.additionalContent,
              ]);
              if (extracted.has(identity)) {
                console.warn("Ignoring exact duplicate source specialist record", {
                  diseaseNumber: record.diseaseNumber,
                  name: record.name,
                });
                return;
              }
              extracted.set(identity, record);
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

  const cleanSpecialistInfo = (spec: SpecialistWithDisease) => {
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
    <main className="relative z-10 min-h-screen bg-transparent pb-24 text-[#112250] selection:bg-[#E7E2CE] selection:text-[#112250]">
      {/* ================= HERO SECTION ================= */}
      <section className="relative overflow-hidden bg-transparent pt-12 pb-16 lg:pt-16 lg:pb-20">
        <div className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-[#E7E2CE]/70 blur-3xl" />
        <div className="pointer-events-none absolute top-1/3 -left-20 h-56 w-56 rounded-full bg-[#3B507D]/10 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-[#3B507D]">
                Specialist Directory
              </span>
              <h1 className="font-heading text-2xl font-extrabold leading-tight tracking-tight text-[#112250] sm:text-3xl lg:text-4xl">
                Specialists by condition
              </h1>
              <p className="mt-3 max-w-xl text-sm font-medium leading-relaxed text-[#3B507D] sm:text-base">
                Browse specialist records and disease associations from the source data. Optional profile details appear only when provided.
              </p>

              <div className="mt-7 max-w-2xl">
                <label htmlFor="specialist-search" className="sr-only">Search specialists</label>
                <div className="flex items-center rounded-xl border border-[#D9D5C8] bg-white p-2 transition-colors focus-within:border-[#3B507D] focus-within:ring-2 focus-within:ring-[#3B507D]/20">
                  <Search className="ml-3 h-5 w-5 shrink-0 text-[#3B507D]" aria-hidden="true" />
                  <input
                    id="specialist-search"
                    type="search"
                    value={searchQuery}
                    onChange={(event) => {
                      setSearchQuery(event.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search by name, expertise, organization, location, or condition"
                    className="min-w-0 w-full bg-transparent px-3 py-2 text-sm font-medium text-[#112250] outline-none placeholder:text-[#3B507D]/70 sm:text-base"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setCurrentPage(1);
                      }}
                      aria-label="Clear specialist search"
                      className="mr-1 rounded-lg p-2 text-[#112250] hover:bg-[#F5F4F0]"
                    >
                      <X className="h-4 w-4" aria-hidden="true" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="mx-auto max-w-md rounded-xl border-2 border-[#E7E2CE] bg-white p-7 text-[#112250] sm:p-8 lg:max-w-none">
                <div className="mb-6 flex items-center justify-between">
                  <div className="rounded-lg bg-[#F5F4F0] p-3">
                    <Building2 className="h-6 w-6 text-[#112250]" aria-hidden="true" />
                  </div>
                  <EdelweissFlower size={36} />
                </div>
                <span className="mb-3 inline-flex rounded-md bg-[#E7E2CE]/60 px-3.5 py-1 text-xs font-bold text-[#112250]">
                  Explore the directory
                </span>
                <h2 className="font-heading text-2xl font-black text-[#112250]">
                  Find care with clarity
                </h2>
                <p className="mt-2 text-sm font-medium leading-relaxed text-[#3B507D]">
                  Search condition-linked specialist records and review the profile details available in the source data.
                </p>
                <div className="mt-6 space-y-2.5 border-t border-[#E7E2CE] pt-4 text-xs font-bold text-[#112250]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#3B507D]" aria-hidden="true" />
                    <span>Search by expertise, organization, and location</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#3B507D]" aria-hidden="true" />
                    <span>Browse records associated with conditions</span>
                  </div>
                </div>
              </div>
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
                className="h-52 animate-pulse rounded-xl bg-white border-2 border-[#E7E2CE]"
              />
            ))}
          </div>
        ) : loadError ? (
          <div role="alert" className="rounded-xl border border-[#D9D5C8] bg-white p-8 text-center">
            <h2 className="font-heading text-lg font-bold text-[#112250]">Specialist records are unavailable</h2>
            <p className="mt-2 text-sm text-[#3B507D]">The directory could not load its source data. Please try again.</p>
            <button
              type="button"
              onClick={() => setRetryToken((token) => token + 1)}
              className="mt-4 rounded-lg bg-[#112250] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#3B507D]"
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
                  key={JSON.stringify([
                    spec.diseaseNumber,
                    spec.name,
                    spec.profession,
                    spec.specialization,
                    spec.organization,
                    spec.location,
                    spec.contact,
                    spec.publications,
                    spec.sources,
                  ])}
                  variants={fadeUpVariants}
                  className="flex min-w-0 flex-col rounded-xl border border-[#E3E0D7] bg-white p-5 transition-colors hover:border-[#A9B2C5] sm:p-6"
                >
                  <div>
                    <div className="mb-4 flex min-w-0 items-start gap-4">
                      <SpecialistAvatar name={rawName} photoUrl={spec.photoUrl} />
                      <div className="min-w-0 flex-1">
                        <span className="inline-block max-w-full break-words rounded-md bg-[#F5F4F0] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#112250]">
                          {spec.disease}
                        </span>
                        <h2 className="mt-2 break-words font-heading text-lg font-bold leading-snug text-[#112250]">
                          {rawName}
                        </h2>
                        {profession && <p className="mt-1 break-words text-sm font-semibold text-[#3B507D]">{profession}</p>}
                      </div>
                    </div>

                    <div className="space-y-2 border-t border-[#F5F4F0] pt-3 text-xs text-[#3B507D] font-medium">
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
                    className="mt-5 flex min-h-11 items-center justify-between border-t border-[#F5F4F0] pt-3 text-left text-sm font-bold text-[#112250] hover:text-[#3B507D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B507D]"
                  >
                    <span>View profile details</span>
                    <ChevronRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                  </button>
                </motion.article>
              );
            })}
          </motion.div>
        ) : (
          <div className="rounded-xl border-2 border-[#E7E2CE] bg-white p-12 text-center">
            <h3 className="font-heading text-xl font-bold text-[#112250]">No specialists found</h3>
            <p className="text-sm text-[#3B507D] mt-1">Try clearing your search terms.</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setCurrentPage(1);
              }}
              className="mt-4 rounded-lg bg-[#112250] px-6 py-3 text-sm font-bold text-white hover:bg-[#3B507D] transition-colors"
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
              className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#D9D5C8] bg-white px-4 py-2 text-sm font-bold text-[#112250] transition-colors hover:bg-[#F5F4F0] disabled:cursor-not-allowed disabled:opacity-45"
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
              className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#D9D5C8] bg-white px-4 py-2 text-sm font-bold text-[#112250] transition-colors hover:bg-[#F5F4F0] disabled:cursor-not-allowed disabled:opacity-45"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              variants={overlayBackdropVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={() => setSelectedSpecialist(null)}
              className="fixed inset-0 bg-[#112250]/40 backdrop-blur-xs"
            />

            <motion.div
              variants={modalPanelVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="relative w-full max-w-xl rounded-xl border-2 border-[#E7E2CE] bg-white p-6 sm:p-8 z-10 my-auto shadow-xl"
            >
              <button
                onClick={() => setSelectedSpecialist(null)}
                className="absolute top-5 right-5 rounded-lg bg-[#F5F4F0] p-2 text-[#112250] hover:bg-[#E7E2CE] transition-colors"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>

              {(() => {
                const { rawName, profession, specialization } = cleanSpecialistInfo(selectedSpecialist);

                return (
                  <div>
                    <div className="flex items-start gap-4">
                      <SpecialistAvatar name={rawName} photoUrl={selectedSpecialist.photoUrl} className="h-20 w-20" />
                      <div className="min-w-0">
                        <span className="rounded-md bg-[#E7E2CE]/70 px-3 py-1 text-xs font-bold text-[#112250]">
                          {selectedSpecialist.disease}
                        </span>
                        <h2 className="mt-1.5 break-words font-heading text-2xl font-bold text-[#112250]">{rawName}</h2>
                        {profession && <p className="mt-1 break-words text-sm font-semibold text-[#3B507D]">{profession}</p>}
                      </div>
                    </div>

                    <div className="mt-6 space-y-3 rounded-lg bg-[#F5F4F0] p-5 border border-[#E7E2CE] text-sm text-[#112250]">
                      {specialization && <div className="break-words"><strong>Specialty / expertise:</strong> {specialization}</div>}
                      {selectedSpecialist.organization && <div className="flex items-center gap-3 font-semibold">
                        <Building2 className="h-5 w-5 text-[#3B507D] shrink-0" />
                        <span>{selectedSpecialist.organization}</span>
                      </div>}
                      {selectedSpecialist.location && <div className="flex items-center gap-3 font-semibold">
                        <MapPin className="h-5 w-5 text-[#3B507D] shrink-0" />
                        <span>{selectedSpecialist.location}</span>
                      </div>}
                      {selectedSpecialist.contact && <div className="flex items-start gap-3 font-semibold">
                        <ExternalLink className="h-5 w-5 text-[#3B507D] shrink-0" />
                        <span className="text-[#3B507D] break-words">{renderTextWithLinks(selectedSpecialist.contact)}</span>
                      </div>}
                      {selectedSpecialist.publications && <div className="flex items-start gap-3 font-semibold">
                        <BookOpen className="h-5 w-5 shrink-0 text-[#3B507D]" />
                        <span className="text-[#3B507D] break-words">{renderTextWithLinks(selectedSpecialist.publications)}</span>
                      </div>}
                    </div>
                    {selectedSpecialist.additionalContent && selectedSpecialist.additionalContent.length > 0 && (
                      <div className="mt-4 space-y-4">
                        {renderAdditionalContent(selectedSpecialist.additionalContent)}
                      </div>
                    )}
                    {selectedSpecialist.sources && selectedSpecialist.sources.length > 0 && (
                      <div className="mt-4">
                        <h3 className="text-sm font-bold text-[#112250]">Sources</h3>
                        <ul className="mt-2 space-y-1">
                          {selectedSpecialist.sources.map((source) => (
                            <li key={source} className="break-all text-sm text-[#3B507D]">
                              {renderTextWithLinks(source)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
                      <button
                        onClick={() => setSelectedSpecialist(null)}
                        className="w-full rounded-lg border-2 border-[#E7E2CE] bg-white px-6 py-3.5 text-sm font-bold text-[#112250] hover:bg-[#F5F4F0] transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}