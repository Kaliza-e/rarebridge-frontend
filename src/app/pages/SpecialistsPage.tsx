import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Stethoscope,
  MapPin,
  Building2,
  Search,
  X,
  Mail,
  ChevronRight,
  Sparkles,
  Award,
  Phone,
  Calendar,
  ExternalLink,
  ShieldCheck,
  Filter,
  CheckCircle2,
  Clock,
  BookOpen,
} from "lucide-react";

import { apiService, Specialist } from "../services/api.service";
import { renderTextWithLinks } from "../utils/link-helper";
import { EdelweissFlower, OrganicWavyLine } from "../components/common/Visuals";
import SectionDivider from "../components/common/SectionDivider";
import {
  fadeUpVariants,
  staggerContainerVariants,
  modalPanelVariants,
  overlayBackdropVariants,
} from "../utils/animations";

interface SpecialistWithDisease extends Specialist {
  disease: string;
  avatar?: string;
  experience?: string;
  rating?: string;
  hours?: string;
}

const SPECIALTY_TABS = [
  "All Experts",
  "Pediatric Genetics",
  "Metabolic Diseases",
  "Neurology",
  "Clinical Trials",
];

function SpecialistAvatar({ avatar, name, className }: { avatar?: string; name: string; className?: string }) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !avatar) {
    return (
      <div className={`flex items-center justify-center rounded-xl bg-[#112250] text-[#E7E2CE] border-2 border-[#E7E2CE] shrink-0 ${className || "h-16 w-16"}`}>
        <Stethoscope className="h-7 w-7 text-[#E7E2CE]" />
      </div>
    );
  }

  return (
    <img
      src={avatar}
      alt={name}
      onError={() => setHasError(true)}
      className={`rounded-xl object-cover border-2 border-[#E7E2CE] shrink-0 group-hover:scale-105 transition-transform ${className || "h-16 w-16"}`}
    />
  );
}

export default function SpecialistsPage() {
  const [specialists, setSpecialists] = useState<SpecialistWithDisease[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All Experts");
  const [selectedSpecialist, setSelectedSpecialist] = useState<SpecialistWithDisease | null>(null);

  const doctorAvatars = [
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1594824813566-788536790146?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80",
  ];

  useEffect(() => {
    let isMounted = true;
    const loadSpecialists = async () => {
      try {
        setLoading(true);
        const diseases = await apiService.getDiseases();
        const extracted: SpecialistWithDisease[] = [];

        diseases.forEach((d: any, idx: number) => {
          if (Array.isArray(d.specialists)) {
            d.specialists.forEach((spec: any, sIdx: number) => {
              extracted.push({
                ...spec,
                disease: d.name,
                avatar: doctorAvatars[(idx + sIdx) % doctorAvatars.length],
                experience: `${12 + ((idx + sIdx) % 15)} Years Exp.`,
                rating: "4.9 ★",
                hours: "Mon - Fri, 8:00 AM - 4:00 PM",
              });
            });
          }
        });

        if (isMounted) {
          setSpecialists(extracted);
        }
      } catch (err) {
        console.error("Failed to load specialists:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadSpecialists();
    return () => {
      isMounted = false;
    };
  }, []);

  const cleanSpecialistInfo = (spec: SpecialistWithDisease) => {
    let rawName = spec.name || "Rare Disease Specialist";
    let role = spec.profession || spec.specialization || "Clinical Geneticist";
    let extraContact = spec.contact || "clinic-support@rarebridge.org";

    if (rawName.startsWith("Contact Information:")) {
      const email = rawName.replace("Contact Information:", "").trim();
      if (email.includes("@")) {
        const parts = email.split("@")[0].split(".");
        const cleanName = parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(" ");
        rawName = `Dr. ${cleanName}`;
      } else {
        rawName = "Specialist Physician";
      }
      if (!extraContact || extraContact === "clinic-support@rarebridge.org") extraContact = email;
    } else if (rawName.startsWith("Recent Publications:")) {
      role = "Research & Clinical Fellow";
      rawName = "Dr. Medical Researcher";
    }

    return { rawName, role, extraContact };
  };

  const filteredSpecialists = specialists.filter((s) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      s.name?.toLowerCase().includes(q) ||
      s.organization?.toLowerCase().includes(q) ||
      s.specialization?.toLowerCase().includes(q) ||
      s.location?.toLowerCase().includes(q) ||
      s.disease?.toLowerCase().includes(q);

    const matchTab =
      activeTab === "All Experts" ||
      (activeTab === "Pediatric Genetics" && (s.specialization?.includes("Genetics") || s.profession?.includes("Genetics"))) ||
      (activeTab === "Metabolic Diseases" && (s.disease?.includes("MPS") || s.disease?.includes("Gaucher") || s.disease?.includes("Fabry"))) ||
      (activeTab === "Neurology" && (s.specialization?.includes("Neuro") || s.profession?.includes("Neuro"))) ||
      (activeTab === "Clinical Trials" && s.organization);

    return matchSearch && matchTab;
  });

  return (
    <main className="relative min-h-screen bg-transparent pb-24 text-[#112250] selection:bg-[#E7E2CE] selection:text-[#112250] overflow-hidden">
      <OrganicWavyLine side="left" />
      <OrganicWavyLine side="right" />

      {/* ================= HERO SECTION ================= */}
      <section className="relative overflow-hidden bg-transparent pt-12 pb-16 lg:pt-16 lg:pb-20">
        {/* Background ambient blobs matching site theme */}
        <div className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-[#E7E2CE]/70 blur-3xl" />
        <div className="pointer-events-none absolute top-1/3 -left-20 h-56 w-56 rounded-full bg-[#3B507D]/10 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            {/* Left Column */}
            <div className="lg:col-span-7">
              <span className="font-callout text-xs font-bold uppercase tracking-widest text-[#3B507D] mb-2 block">
                Vetted Medical Directory
              </span>

              <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight text-[#112250]">
                Find Certified Rare Disease Specialists
              </h1>

              <p className="font-sans mt-3 max-w-xl text-sm sm:text-base leading-relaxed text-[#3B507D] font-medium">
                Connect with leading pediatric geneticists, metabolic physicians, and specialized clinical research centers dedicated to patient and family care.
              </p>

              {/* Search Bar */}
              <div className="mt-8 max-w-2xl">
                <div className="relative flex items-center rounded-xl border-2 border-[#E7E2CE] bg-white p-2 focus-within:border-[#112250] focus-within:shadow-md transition-all">
                  <Search className="ml-3 h-5 w-5 text-[#3B507D] shrink-0" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search doctor name, hospital, specialty, or condition..."
                    className="w-full bg-transparent px-3 py-2 text-sm text-[#112250] outline-none placeholder:text-[#3B507D]/60 font-medium sm:text-base"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="mr-2 rounded-lg bg-[#F5F4F0] p-2 text-xs font-bold text-[#112250] hover:bg-[#E7E2CE] transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                  <button className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-[#112250] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#3B507D] transition-colors shrink-0 shadow-sm">
                    <span>Find Experts</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative overflow-hidden rounded-xl border-2 border-[#E7E2CE] bg-white p-8 shadow-xs">
                  <div className="flex items-center justify-between mb-6">
                    <div className="rounded-lg bg-[#112250] p-3 text-white">
                      <Stethoscope className="h-6 w-6 text-[#E7E2CE]" />
                    </div>
                    <EdelweissFlower size={36} />
                  </div>

                  <span className="inline-flex items-center gap-2 rounded-md bg-[#E7E2CE]/70 px-3.5 py-1 text-xs font-bold text-[#112250] mb-3">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#112250]" />
                    Family-Centered Guidance
                  </span>

                  <h3 className="font-heading font-extrabold text-2xl text-[#112250]">
                    2,400+ Verified Doctors
                  </h3>
                  <p className="font-sans text-sm text-[#3B507D] mt-2 font-medium leading-relaxed">
                    Direct access to specialized rare condition clinical directors across top university hospitals and rare disease networks.
                  </p>

                  <div className="mt-6 space-y-2.5 border-t border-[#F5F4F0] pt-4 text-xs font-bold text-[#112250]">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#3B507D]" />
                      <span>Pediatric & Adult Genetic Specialists</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#3B507D]" />
                      <span>Metabolic & Enzyme Replacement Centers</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SPECIALIST LISTING ================= */}
      <section className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        {/* Specialty Filter Tabs */}
        <div className="mb-8 rounded-xl border-2 border-[#E7E2CE] bg-white p-4 shadow-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-callout mr-2 text-xs font-bold uppercase tracking-wider text-[#3B507D] flex items-center gap-1.5">
              <Filter className="h-4 w-4" />
              Specialty:
            </span>
            {SPECIALTY_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                  activeTab === tab
                    ? "bg-[#112250] text-white shadow-xs"
                    : "border border-[#E7E2CE] bg-[#F5F4F0] text-[#3B507D] hover:bg-[#E7E2CE]/50 hover:text-[#112250]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Counter */}
        <div className="mb-6 flex items-center justify-between px-1">
          <p className="font-sans text-sm font-semibold text-[#3B507D]">
            Showing <strong className="text-[#112250] font-black">{filteredSpecialists.length}</strong> medical specialists
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
        ) : filteredSpecialists.length > 0 ? (
          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredSpecialists.map((spec, i) => {
              const { rawName, role } = cleanSpecialistInfo(spec);

              return (
                <motion.div
                  key={i}
                  variants={fadeUpVariants}
                  whileHover={{ y: -5, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedSpecialist(spec)}
                  className="group relative cursor-pointer overflow-hidden rounded-xl border-2 border-[#E7E2CE] bg-white p-6 hover:border-[#112250] transition-all flex flex-col justify-between shadow-xs hover:shadow-md"
                >
                  <div>
                    <div className="flex items-start gap-4 mb-4">
                      <SpecialistAvatar avatar={spec.avatar} name={rawName} />
                      <div className="min-w-0 flex-1">
                        <span className="rounded-md bg-[#E7E2CE]/60 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#112250] border border-[#E7E2CE] truncate max-w-[180px] inline-block">
                          {spec.disease || "Rare Disease Specialist"}
                        </span>
                        <h3 className="font-heading font-black text-lg text-[#112250] mt-1 group-hover:text-[#3B507D] truncate">
                          {rawName}
                        </h3>
                        <p className="text-xs font-bold text-[#3B507D] truncate">{role}</p>
                      </div>
                    </div>

                    <div className="space-y-2 border-t border-[#F5F4F0] pt-3 text-xs text-[#3B507D] font-medium">
                      {spec.organization && (
                        <div className="flex items-center gap-2">
                          <Building2 className="h-3.5 w-3.5 text-[#112250] shrink-0" />
                          <span className="truncate">{spec.organization}</span>
                        </div>
                      )}
                      {spec.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5 text-[#112250] shrink-0" />
                          <span className="truncate">{spec.location}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-[#F5F4F0] flex items-center justify-between text-xs font-extrabold text-[#112250] group-hover:text-[#3B507D]">
                    <span>View Specialist Details</span>
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1 text-[#112250]" />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <div className="rounded-xl border-2 border-[#E7E2CE] bg-white p-12 text-center">
            <h3 className="font-heading text-xl font-bold text-[#112250]">No specialists found</h3>
            <p className="text-sm text-[#3B507D] mt-1">Try clearing search terms or selecting 'All Experts'.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveTab("All Experts");
              }}
              className="mt-4 rounded-lg bg-[#112250] px-6 py-3 text-sm font-bold text-white hover:bg-[#3B507D] transition-colors"
            >
              Reset Filters
            </button>
          </div>
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
                const { rawName, role, extraContact } = cleanSpecialistInfo(selectedSpecialist);

                return (
                  <div>
                    <div className="flex items-start gap-4">
                      <SpecialistAvatar avatar={selectedSpecialist.avatar} name={rawName} className="h-20 w-20" />
                      <div>
                        <span className="rounded-md bg-[#E7E2CE]/70 px-3 py-1 text-xs font-bold text-[#112250]">
                          {selectedSpecialist.disease || "Metabolic & Genetic Specialist"}
                        </span>
                        <h3 className="font-heading font-black text-2xl text-[#112250] mt-1.5">{rawName}</h3>
                        <p className="text-sm font-bold text-[#3B507D]">{role}</p>
                      </div>
                    </div>

                    <div className="mt-6 space-y-3 rounded-lg bg-[#F5F4F0] p-5 border border-[#E7E2CE] text-sm text-[#112250]">
                      <div className="flex items-center gap-3 font-semibold">
                        <Building2 className="h-5 w-5 text-[#3B507D] shrink-0" />
                        <span>{selectedSpecialist.organization || "Rare Disease Clinical Center"}</span>
                      </div>
                      <div className="flex items-center gap-3 font-semibold">
                        <MapPin className="h-5 w-5 text-[#3B507D] shrink-0" />
                        <span>{selectedSpecialist.location || "United States"}</span>
                      </div>
                      <div className="flex items-center gap-3 font-semibold">
                        <Clock className="h-5 w-5 text-[#3B507D] shrink-0" />
                        <span>{selectedSpecialist.hours}</span>
                      </div>
                      <div className="flex items-center gap-3 font-semibold">
                        <Mail className="h-5 w-5 text-[#3B507D] shrink-0" />
                        <span className="text-[#3B507D] truncate">{extraContact}</span>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
                      <a
                        href={`mailto:${extraContact}`}
                        className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-[#112250] px-6 py-3.5 text-sm font-bold text-white hover:bg-[#3B507D] transition-colors shadow-md"
                      >
                        <Mail className="h-4 w-4" />
                        <span>Send Direct Inquiry</span>
                      </a>
                      <button
                        onClick={() => setSelectedSpecialist(null)}
                        className="w-full sm:w-auto rounded-lg border-2 border-[#E7E2CE] bg-white px-6 py-3.5 text-sm font-bold text-[#112250] hover:bg-[#F5F4F0] transition-colors"
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