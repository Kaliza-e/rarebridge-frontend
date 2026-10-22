import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiService } from "../services/api.service";
import {
  DISEASES,
  fetchDiseasesFromAPI,
  type Disease,
} from "../data";

import {
  DiseaseCard,
  EdelweissFlower,
} from "../components/common/Visuals";

import {
  BookOpen,
  Stethoscope,
  Microscope,
  HeartHandshake,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  BrainCircuit,
  Users,
  Search,
  CheckCircle2,
  ShieldCheck,
  Heart,
  Activity,
} from "lucide-react";

interface HomePageProps {
  onNav: (view: string) => void;
  onDisease: (id: string) => void;
}

const HERO_SLIDES = [
  {
    tag: "A Warm Safe Place for Rare Families",
    title: "Understanding rare conditions with clarity, care & hope.",
    subtitle: "Plain-language medical guides, world-class specialist directories, and compassionate family support for children, parents, and caregivers.",
    image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1920&q=80",
    alt: "Healthcare specialist offering compassionate medical support to family",
    badge: "100% Free & Family-Centered",
  },
  {
    tag: "Plain-Language Medical Education",
    title: "Simplifying complex genetic reports into everyday guidance.",
    subtitle: "Our certified clinical networks break down ORPHA codes, symptoms, and inheritance patterns into clear, encouraging steps.",
    image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=1920&q=80",
    alt: "Medical researcher and geneticist studying molecular pathology under microscope",
    badge: "Sourced from Certified Geneticists",
  },
  {
    tag: "Caregiver & Family Network",
    title: "Connecting parents & caregivers through real experience.",
    subtitle: "You are never alone. Join parent support circles, practical caregiver wellness guides, and peer advocacy networks.",
    image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1920&q=80",
    alt: "Supportive family walking together with care and hope",
    badge: "Compassionate Support Circles",
  },
];

export const HomePage = ({ onNav, onDisease }: HomePageProps) => {
  const [diseases, setDiseases] = useState<Disease[]>(DISEASES);
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<"checking" | "online" | "offline">("checking");

  // Hero Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let isMounted = true;

    apiService.getHealth()
      .then(() => {
        if (isMounted) setApiStatus("online");
      })
      .catch(() => {
        if (isMounted) setApiStatus("offline");
      });

    const loadDiseases = async () => {
      try {
        setIsLoading(true);
        const result = await fetchDiseasesFromAPI();
        if (isMounted && Array.isArray(result) && result.length > 0) {
          setDiseases(result as Disease[]);
        }
      } catch (error) {
        console.error("Unable to load diseases:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadDiseases();

    return () => {
      isMounted = false;
    };
  }, []);

  // Auto-advance hero carousel every 6 seconds
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined" && searchQuery.trim()) {
      sessionStorage.setItem("rb_search_query", searchQuery.trim());
    }
    onNav("directory");
  };

  const featuredDiseases = diseases.slice(0, 3);
  const activeSlide = HERO_SLIDES[currentSlide];

  return (
    <div className="relative min-h-screen overflow-hidden bg-transparent text-[#112250] selection:bg-[#DDF0FA] selection:text-[#112250]">
      {/* ================= HERO SECTION (TOUR-INSPIRED CURVED BOTTOM HERO) ================= */}
      <section className="relative min-h-[680px] lg:min-h-[780px] flex flex-col justify-between pt-24 sm:pt-32 lg:pt-36 pb-12 sm:pb-16 overflow-hidden rounded-b-[2.5rem] sm:rounded-b-[4.5rem] shadow-2xl relative z-20 bg-[#070D1E]">
        {/* Background Visual Slides with Crossfade */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {HERO_SLIDES.map((slide, idx) => (
            <div
              key={slide.tag}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                currentSlide === idx ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <img
                src={slide.image}
                alt={slide.alt}
                className="h-full w-full object-cover object-center transition-transform duration-[7000ms] ease-out scale-105"
              />
              {/* Deep navy atmospheric gradient overlays matching Tour */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#070D1E]/92 via-[#070D1E]/80 to-[#070D1E]/95" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#070D1E]/40 to-[#070D1E]/90 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[42rem] h-64 bg-[#1A3365]/30 blur-[130px] pointer-events-none z-10" />

        {/* Centered Hero Content */}
        <div className="max-w-7xl mx-auto w-full relative z-10 my-auto text-center px-4 sm:px-6 pt-6 sm:pt-10 pb-8 sm:pb-12">
          <div className="max-w-3xl mx-auto space-y-4 sm:space-y-5">
            {/* Pill Badge with Pulsing Ping Dot */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-light text-white/90 backdrop-blur-md shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#BCE0F5] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#BCE0F5]" />
              </span>
              <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#BCE0F5]">
                {activeSlide.tag}
              </span>
              <span className="text-white/30 hidden sm:inline">·</span>
              <span className="text-[11px] text-white/80 font-light hidden sm:inline">
                {activeSlide.badge}
              </span>
            </div>

            {/* Headline */}
            <div className="relative">
              <div className="absolute -inset-x-8 -top-6 -bottom-6 bg-gradient-to-r from-[#1A3365]/30 via-[#3B507D]/20 to-[#1A3365]/30 blur-2xl pointer-events-none rounded-full opacity-70 animate-pulse" />
              <h1 className="relative font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight sm:leading-snug md:leading-[1.18] drop-shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
                {activeSlide.title}
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm md:text-base text-white/85 max-w-xl mx-auto font-light leading-relaxed drop-shadow-sm">
              {activeSlide.subtitle}
            </p>

            {/* Central Search Bar (Tour's signature search input flow) */}
            <div className="w-full max-w-xl mx-auto pt-2">
              <form
                onSubmit={handleSearchSubmit}
                className="group relative flex items-center rounded-full bg-white/95 border-2 border-white/20 shadow-2xl p-1.5 sm:p-2 backdrop-blur-xl transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.35)] hover:border-white/40 focus-within:bg-white focus-within:shadow-[0_20px_60px_rgba(0,0,0,0.45)] focus-within:border-white focus-within:ring-2 focus-within:ring-[#BCE0F5]/50"
              >
                <div className="flex items-center pl-3.5 sm:pl-4 pr-2 pointer-events-none text-[#112250]/50 transition-colors group-focus-within:text-[#112250]">
                  <Search className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search 7,000+ conditions, genes, symptoms, or specialists..."
                  aria-label="Search conditions"
                  className="w-full bg-transparent py-2 sm:py-2.5 pr-4 text-xs sm:text-sm md:text-base text-[#112250] placeholder:text-[#112250]/45 focus:outline-none font-medium"
                />
                <button
                  type="submit"
                  aria-label="Search RareBridge"
                  className="shrink-0 flex items-center gap-1.5 rounded-full bg-[#112250] hover:bg-[#1A3365] px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-95"
                >
                  <span>Search</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>

            {/* Primary Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => onNav("directory")}
                className="inline-flex items-center gap-2 rounded-full bg-white text-[#112250] hover:bg-[#EDF6FC] px-6 sm:px-8 py-3 text-xs sm:text-sm font-bold shadow-xl transition-all duration-200 active:scale-95 cursor-pointer"
              >
                <BookOpen className="h-4 w-4 text-[#112250]" />
                <span>Browse Disease Library</span>
              </button>

              <button
                type="button"
                onClick={() => onNav("community")}
                className="inline-flex items-center gap-2 rounded-full border-2 border-white/40 bg-white/10 text-white hover:bg-white hover:text-[#112250] px-6 sm:px-8 py-3 text-xs sm:text-sm font-bold backdrop-blur-sm transition-all duration-200 active:scale-95 cursor-pointer"
              >
                <Users className="h-4 w-4" />
                <span>Join Caregiver Community</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Status Bar inside the Hero container */}
        <div className="max-w-7xl mx-auto w-full relative z-20 flex flex-col sm:flex-row items-center sm:justify-between gap-3 pt-4 px-4 sm:px-6">
          {/* Status Capsule */}
          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-xs text-white/85 shadow-sm">
            <span
              className={`h-2 w-2 rounded-full ${
                apiStatus === "online"
                  ? "bg-emerald-400 animate-pulse"
                  : apiStatus === "offline"
                  ? "bg-amber-400"
                  : "bg-[#BCE0F5] animate-pulse"
              }`}
            />
            <span className="font-semibold text-[#BCE0F5]">
              {apiStatus === "online"
                ? "Live Clinical API Connected"
                : "Verified Clinical Knowledge Base"}
            </span>
            <span className="text-white/30 hidden md:inline">·</span>
            <span className="font-light text-white/80 hidden md:inline text-[11px]">
              {activeSlide.badge}
            </span>
          </div>

          {/* Carousel Slide Indicators & Controls */}
          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 shadow-sm">
            <button
              type="button"
              onClick={handlePrevSlide}
              aria-label="Previous slide"
              className="text-white/60 hover:text-white transition p-1 cursor-pointer"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>

            <div className="flex items-center gap-1.5 mx-1">
              {HERO_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`transition-all duration-300 rounded-full cursor-pointer h-2 ${
                    currentSlide === idx ? "w-6 bg-[#BCE0F5] shadow-xs" : "w-2 bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={handleNextSlide}
              aria-label="Next slide"
              className="text-white/60 hover:text-white transition p-1 cursor-pointer"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>

            <div className="h-3 w-[1px] bg-white/20 mx-0.5" />

            <button
              type="button"
              onClick={() => setIsAutoPlaying((prev) => !prev)}
              aria-label={isAutoPlaying ? "Pause carousel" : "Resume carousel"}
              className="text-white/60 hover:text-white transition p-1 cursor-pointer"
            >
              {isAutoPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
            </button>
          </div>
        </div>
      </section>

      {/* ================= IMPACT & METRICS SECTION ================= */}
      <section className="pt-16 sm:pt-20 pb-10 sm:pb-14 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                number: "7,000+",
                label: "Rare Conditions",
                subtext: "Plain-language medical guides",
                icon: BookOpen,
                bg: "bg-[#112250] text-white",
                iconBox: "bg-white/10 text-white",
              },
              {
                number: "2,400+",
                label: "Verified Specialists",
                subtext: "Top metabolic & genetic experts",
                icon: Stethoscope,
                bg: "bg-white/95 border border-[#112250]/10 text-[#112250]",
                iconBox: "bg-[#EDF6FC] text-[#112250]",
              },
              {
                number: "850+",
                label: "Research Trials",
                subtext: "Gene therapy & pipeline updates",
                icon: Microscope,
                bg: "bg-white/95 border border-[#112250]/10 text-[#112250]",
                iconBox: "bg-[#EDF6FC] text-[#112250]",
              },
              {
                number: "120K+",
                label: "Families Supported",
                subtext: "Compassionate peer advocacy",
                icon: HeartHandshake,
                bg: "bg-[#EDF6FC] border border-[#BCE0F5] text-[#112250]",
                iconBox: "bg-white text-[#112250]",
              },
            ].map((stat, i) => {
              const IconComp = stat.icon;
              return (
                <motion.div
                  key={i}
                  whileHover={{ y: -3, scale: 1.01 }}
                  className={`rounded-2xl sm:rounded-3xl p-6 sm:p-7 transition-all duration-300 shadow-card hover:shadow-xl ${stat.bg}`}
                >
                  <div className="flex items-center justify-between mb-3.5">
                    <div className={`rounded-xl p-2.5 ${stat.iconBox}`}>
                      <IconComp className="h-5 w-5 text-current" />
                    </div>
                    <EdelweissFlower size={20} />
                  </div>
                  <h3 className="font-heading font-black text-3xl sm:text-4xl tracking-tight">
                    {stat.number}
                  </h3>
                  <p className="font-sans font-bold text-sm mt-1">{stat.label}</p>
                  <p className="font-sans text-xs opacity-75 mt-0.5">{stat.subtext}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= THE 4 PILLARS OF RAREBRIDGE ("WHAT WE OFFER" IN TOUR) ================= */}
      <section className="py-20 sm:py-28 relative overflow-hidden">
        {/* Subtle radial lighting backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[55rem] h-[35rem] bg-gradient-to-tr from-[#112250]/5 via-[#BCE0F5]/15 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="mx-auto max-w-3xl text-center space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-white border border-[#112250]/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#112250] shadow-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-[#112250] animate-pulse" />
              Core Disciplines
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-[#112250] tracking-tight">
              Everything your family needs, in one friendly space
            </h2>
            <p className="text-[#3B507D] leading-relaxed text-base md:text-lg max-w-2xl mx-auto font-light">
              No medical jargon wall. Just reliable, easy-to-understand guidance created with empathy, helping families gain an early and worthwhile start in understanding rare conditions.
            </p>
          </div>

          {/* Tour's 2x2 Signature Numbered Card Grid ("01", "02", "03", "04") */}
          <div className="mt-14 grid gap-6 sm:gap-8 md:grid-cols-2">
            {/* Card 01: Disease Library */}
            <div
              onClick={() => onNav("directory")}
              className="group relative flex flex-col justify-between rounded-[2rem] border border-[#112250]/10 bg-white/95 backdrop-blur-md p-7 sm:p-9 shadow-card hover:shadow-2xl hover:border-[#112250]/40 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-[#112250]/[0.05] text-[#112250] border border-[#112250]/15 flex items-center justify-center group-hover:bg-[#E8F2FB] group-hover:border-[#112250]/30 group-hover:scale-105 transition-all duration-300 shadow-xs">
                    <BookOpen className="h-7 w-7 text-[#112250]" />
                  </div>
                  <span className="font-sans text-3xl font-light text-[#112250]/25 group-hover:text-[#112250]/50 transition-colors">
                    01
                  </span>
                </div>

                <h3 className="mt-5 font-heading text-2xl font-bold text-[#112250] group-hover:text-[#1e3a7a] transition-colors">
                  Disease Library
                </h3>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="rounded-full bg-[#112250]/[0.05] border border-[#112250]/15 px-2.5 py-0.5 text-[11px] font-semibold text-[#112250]">
                    7,000+ Conditions
                  </span>
                  <span className="rounded-full bg-[#112250]/[0.05] border border-[#112250]/15 px-2.5 py-0.5 text-[11px] font-semibold text-[#112250]">
                    Genetic Causes
                  </span>
                  <span className="rounded-full bg-[#112250]/[0.05] border border-[#112250]/15 px-2.5 py-0.5 text-[11px] font-semibold text-[#112250]">
                    Plain-Language Summaries
                  </span>
                </div>

                <p className="mt-4 text-sm text-[#3B507D] leading-relaxed font-light">
                  Comprehensive conditions simplified with symptoms, genetic inheritance patterns, and everyday medical guidance for parents and children.
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-[#112250]/5">
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#112250]/60 group-hover:text-[#112250] group-hover:gap-3 transition-all">
                  <span>Explore Disease Library</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>

            {/* Card 02: Specialists Directory */}
            <div
              onClick={() => onNav("specialists")}
              className="group relative flex flex-col justify-between rounded-[2rem] border border-[#112250]/10 bg-white/95 backdrop-blur-md p-7 sm:p-9 shadow-card hover:shadow-2xl hover:border-[#112250]/40 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-[#112250]/[0.05] text-[#112250] border border-[#112250]/15 flex items-center justify-center group-hover:bg-[#E8F2FB] group-hover:border-[#112250]/30 group-hover:scale-105 transition-all duration-300 shadow-xs">
                    <Stethoscope className="h-7 w-7 text-[#112250]" />
                  </div>
                  <span className="font-sans text-3xl font-light text-[#112250]/25 group-hover:text-[#112250]/50 transition-colors">
                    02
                  </span>
                </div>

                <h3 className="mt-5 font-heading text-2xl font-bold text-[#112250] group-hover:text-[#1e3a7a] transition-colors">
                  Find Specialists
                </h3>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="rounded-full bg-[#112250]/[0.05] border border-[#112250]/15 px-2.5 py-0.5 text-[11px] font-semibold text-[#112250]">
                    Pediatric Geneticists
                  </span>
                  <span className="rounded-full bg-[#112250]/[0.05] border border-[#112250]/15 px-2.5 py-0.5 text-[11px] font-semibold text-[#112250]">
                    Metabolic Clinics
                  </span>
                  <span className="rounded-full bg-[#112250]/[0.05] border border-[#112250]/15 px-2.5 py-0.5 text-[11px] font-semibold text-[#112250]">
                    Global Centers
                  </span>
                </div>

                <p className="mt-4 text-sm text-[#3B507D] leading-relaxed font-light">
                  Direct connections to top pediatric geneticists, metabolic doctors, and specialized academic medical centers worldwide.
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-[#112250]/5">
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#112250]/60 group-hover:text-[#112250] group-hover:gap-3 transition-all">
                  <span>Find Medical Experts</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>

            {/* Card 03: Research & Trials */}
            <div
              onClick={() => onNav("research")}
              className="group relative flex flex-col justify-between rounded-[2rem] border border-[#112250]/10 bg-white/95 backdrop-blur-md p-7 sm:p-9 shadow-card hover:shadow-2xl hover:border-[#112250]/40 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-[#112250]/[0.05] text-[#112250] border border-[#112250]/15 flex items-center justify-center group-hover:bg-[#E8F2FB] group-hover:border-[#112250]/30 group-hover:scale-105 transition-all duration-300 shadow-xs">
                    <Microscope className="h-7 w-7 text-[#112250]" />
                  </div>
                  <span className="font-sans text-3xl font-light text-[#112250]/25 group-hover:text-[#112250]/50 transition-colors">
                    03
                  </span>
                </div>

                <h3 className="mt-5 font-heading text-2xl font-bold text-[#112250] group-hover:text-[#1e3a7a] transition-colors">
                  Research & Trials
                </h3>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="rounded-full bg-[#112250]/[0.05] border border-[#112250]/15 px-2.5 py-0.5 text-[11px] font-semibold text-[#112250]">
                    Gene Therapies
                  </span>
                  <span className="rounded-full bg-[#112250]/[0.05] border border-[#112250]/15 px-2.5 py-0.5 text-[11px] font-semibold text-[#112250]">
                    Enzyme Replacements
                  </span>
                  <span className="rounded-full bg-[#112250]/[0.05] border border-[#112250]/15 px-2.5 py-0.5 text-[11px] font-semibold text-[#112250]">
                    Active Registries
                  </span>
                </div>

                <p className="mt-4 text-sm text-[#3B507D] leading-relaxed font-light">
                  Stay updated on groundbreaking enzyme therapies, gene editing, and active clinical trials providing real clinical hope.
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-[#112250]/5">
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#112250]/60 group-hover:text-[#112250] group-hover:gap-3 transition-all">
                  <span>View Clinical Trials</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>

            {/* Card 04: Caregiver Community */}
            <div
              onClick={() => onNav("community")}
              className="group relative flex flex-col justify-between rounded-[2rem] border border-[#112250]/10 bg-white/95 backdrop-blur-md p-7 sm:p-9 shadow-card hover:shadow-2xl hover:border-[#112250]/40 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-[#112250]/[0.05] text-[#112250] border border-[#112250]/15 flex items-center justify-center group-hover:bg-[#E8F2FB] group-hover:border-[#112250]/30 group-hover:scale-105 transition-all duration-300 shadow-xs">
                    <Users className="h-7 w-7 text-[#112250]" />
                  </div>
                  <span className="font-sans text-3xl font-light text-[#112250]/25 group-hover:text-[#112250]/50 transition-colors">
                    04
                  </span>
                </div>

                <h3 className="mt-5 font-heading text-2xl font-bold text-[#112250] group-hover:text-[#1e3a7a] transition-colors">
                  Caregiver Community
                </h3>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="rounded-full bg-[#112250]/[0.05] border border-[#112250]/15 px-2.5 py-0.5 text-[11px] font-semibold text-[#112250]">
                    Parent Support
                  </span>
                  <span className="rounded-full bg-[#112250]/[0.05] border border-[#112250]/15 px-2.5 py-0.5 text-[11px] font-semibold text-[#112250]">
                    Caregiver Wellness
                  </span>
                  <span className="rounded-full bg-[#112250]/[0.05] border border-[#112250]/15 px-2.5 py-0.5 text-[11px] font-semibold text-[#112250]">
                    Moderated Circles
                  </span>
                </div>

                <p className="mt-4 text-sm text-[#3B507D] leading-relaxed font-light">
                  Connect with parents and caregivers sharing real experiences, emotional support, school advocacy tips, and advice.
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-[#112250]/5">
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#112250]/60 group-hover:text-[#112250] group-hover:gap-3 transition-all">
                  <span>Join Support Circles</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FAMILY & CAREGIVER SPLIT SECTION ("BEFORE SUBMITTING" IN TOUR) ================= */}
      <section className="py-20 sm:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 items-center">
            {/* Left: 5 Cols Photo Card with Floating Corner Badge */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-[#112250]/15 shadow-2xl">
                <img
                  src="/rarebridge_family_photo.png"
                  alt="RareBridge supportive family photo"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#112250]/90 via-[#112250]/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="rounded-full bg-[#112250] border border-white/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-white">
                    You Are Not Alone
                  </span>
                  <p className="mt-3 font-heading text-xl font-bold leading-snug">
                    &quot;Compassionate guidance &amp; community for every rare family journey.&quot;
                  </p>
                </div>
              </div>

              {/* Overlapping Floating Badge */}
              <div className="absolute -bottom-5 -right-5 hidden sm:flex items-center gap-3 rounded-2xl border border-[#112250]/15 bg-white/95 backdrop-blur-md p-4 shadow-xl text-[#112250]">
                <div className="w-10 h-10 rounded-xl bg-[#EDF6FC] text-[#112250] flex items-center justify-center font-bold">
                  ✓
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider">Family Verified</p>
                  <p className="text-[11px] text-[#3B507D]">Certified Clinical Sourcing</p>
                </div>
              </div>
            </div>

            {/* Right: 7 Cols Feature Cards Grid */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#112250]">
                  Family Support &amp; Guidance
                </span>
                <h2 className="mt-2 font-heading text-3xl sm:text-4xl font-bold text-[#112250]">
                  Built by families, for families affected by rare conditions
                </h2>
                <p className="mt-3 text-[#3B507D] text-base leading-relaxed font-light">
                  Receiving a rare diagnosis can feel overwhelming. RareBridge brings together medical truth, hopeful science, and empathetic families to ensure no caregiver walks this journey in the dark.
                </p>
              </div>

              {/* 2x2 Feature Cards Grid */}
              <div className="grid gap-4 sm:grid-cols-2 pt-2">
                <div className="rounded-2xl border border-[#112250]/10 bg-white/90 backdrop-blur-sm p-5 space-y-2 hover:border-[#112250]/30 hover:shadow-card transition-all duration-300">
                  <div className="flex items-center gap-2.5 text-[#112250] font-bold">
                    <Heart className="h-4 w-4 text-[#112250]" />
                    <h4 className="font-heading text-base">Family-Centered Care</h4>
                  </div>
                  <ul className="space-y-1.5 text-xs text-[#3B507D] list-disc pl-4 leading-relaxed">
                    <li>Plain-language summaries designed for parents &amp; kids.</li>
                    <li>Symptom management and school advocacy tips.</li>
                    <li>No intimidating medical jargon walls.</li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-[#112250]/10 bg-white/90 backdrop-blur-sm p-5 space-y-2 hover:border-[#112250]/30 hover:shadow-card transition-all duration-300">
                  <div className="flex items-center gap-2.5 text-[#112250] font-bold">
                    <ShieldCheck className="h-4 w-4 text-[#112250]" />
                    <h4 className="font-heading text-base">Medical Integrity</h4>
                  </div>
                  <ul className="space-y-1.5 text-xs text-[#3B507D] list-disc pl-4 leading-relaxed">
                    <li>Sourced directly from certified medical geneticists.</li>
                    <li>ORPHA and OMIM diagnostic code cross-referencing.</li>
                    <li>Source transparency on all disease entries.</li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-[#112250]/10 bg-white/90 backdrop-blur-sm p-5 space-y-2 hover:border-[#112250]/30 hover:shadow-card transition-all duration-300">
                  <div className="flex items-center gap-2.5 text-[#112250] font-bold">
                    <Users className="h-4 w-4 text-[#112250]" />
                    <h4 className="font-heading text-base">Peer Support Circles</h4>
                  </div>
                  <ul className="space-y-1.5 text-xs text-[#3B507D] list-disc pl-4 leading-relaxed">
                    <li>Safe, confidential discussions with other families.</li>
                    <li>Caregiver wellness and burnout prevention guides.</li>
                    <li>Connecting families worldwide with similar conditions.</li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-[#112250]/10 bg-white/90 backdrop-blur-sm p-5 space-y-2 hover:border-[#112250]/30 hover:shadow-card transition-all duration-300">
                  <div className="flex items-center gap-2.5 text-[#112250] font-bold">
                    <Activity className="h-4 w-4 text-[#112250]" />
                    <h4 className="font-heading text-base">Research &amp; Hope</h4>
                  </div>
                  <ul className="space-y-1.5 text-xs text-[#3B507D] list-disc pl-4 leading-relaxed">
                    <li>Active gene editing and enzyme therapy pipeline tracks.</li>
                    <li>Clear guides on clinical trial enrollment.</li>
                    <li>Regular medical updates explained simply.</li>
                  </ul>
                </div>
              </div>

              {/* Bottom Reassurance Banner */}
              <div className="rounded-2xl border border-[#BCE0F5] bg-[#EDF6FC] px-6 py-4 flex items-center gap-3 shadow-xs">
                <Sparkles className="h-5 w-5 text-[#112250] shrink-0" />
                <p className="text-sm font-semibold text-[#112250]">
                  Our commitment is clear: plain language, zero barriers, and supportive community for every caregiver.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={() => onNav("about")}
                  className="rounded-full bg-[#112250] px-6 sm:px-7 py-3 text-xs sm:text-sm font-bold text-white hover:bg-[#1e3a7a] transition-all cursor-pointer shadow-sm"
                >
                  Our Story &amp; Mission
                </button>
                <button
                  type="button"
                  onClick={() => onNav("community")}
                  className="rounded-full border-2 border-[#112250] bg-white px-6 sm:px-7 py-3 text-xs sm:text-sm font-bold text-[#112250] hover:bg-[#EDF6FC] transition-all cursor-pointer"
                >
                  Connect with Families
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURED CONDITIONS SECTION ("RECENT PUBLICATIONS" IN TOUR) ================= */}
      <section className="py-20 sm:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#112250]">
                Knowledge Base
              </span>
              <h2 className="mt-2 font-heading text-3xl font-bold text-[#112250] md:text-4xl">
                Featured Rare Diseases
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNav("directory")}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#112250] hover:text-[#1e3a7a] transition-colors cursor-pointer"
            >
              <span>Explore all conditions</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredDiseases.map((disease) => (
              <DiseaseCard
                key={disease.id}
                disease={disease}
                onClick={() => onDisease(disease.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ================= CHILD-FRIENDLY AI ZEBRA ASSISTANT BANNER ("CTA BANNER" IN TOUR) ================= */}
      <section className="py-16 sm:py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="px-8 py-14 sm:py-16 md:py-20 text-center rounded-[2.5rem] sm:rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden border border-white/20 bg-gradient-to-r from-[#112250] via-[#1A3365] to-[#112250]">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 rounded-full bg-[#3B507D]/30 blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
              {/* Mascot Image */}
              <div className="flex justify-center">
                <img
                  src="/rarebridge_zebra_with_book.png"
                  alt="Friendly Zebra Mascot"
                  className="h-24 w-24 object-contain animate-float"
                />
              </div>

              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold text-[#BCE0F5] backdrop-blur-xs border border-white/15">
                <BrainCircuit className="h-3.5 w-3.5 text-[#BCE0F5]" />
                <span>Child-Friendly AI Assistant</span>
              </div>

              <h2 className="font-heading text-3xl font-bold text-white md:text-5xl leading-tight">
                Have questions about a genetic report or symptom?
              </h2>

              <p className="text-white/85 text-base md:text-lg font-light leading-relaxed">
                Ask our friendly AI mascot to break down complex medical terms into simple, comforting language.
              </p>

              <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent("open-ai-assistant"))}
                  className="inline-flex items-center justify-center gap-2 h-14 rounded-full bg-white text-[#112250] hover:bg-[#EDF6FC] px-9 py-4 font-bold text-base transition-all duration-200 shadow-xl cursor-pointer active:scale-95"
                >
                  <BrainCircuit className="h-5 w-5 text-[#112250]" />
                  <span>Ask Zebra Assistant</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNav("directory")}
                  className="inline-flex items-center justify-center gap-2 h-14 rounded-full border-2 border-white/40 bg-white/10 text-white hover:bg-white hover:text-[#112250] px-8 py-4 font-bold text-base transition-all duration-200 cursor-pointer backdrop-blur-sm active:scale-95"
                >
                  <span>Explore Plain-Language Guides</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;