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
  FourPointStar,
  BabyZebraBadge,
  ZebraStripeDivider,
} from "../components/common/Visuals";

import {
  BookOpen,
  Stethoscope,
  Microscope,
  HeartHandshake,
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
    tag: "THE SYMBOL OF RARE CONDITIONS",
    badge: "When You Hear Hoofbeats, Think Zebras",
    title: "In medicine, when you hear hoofbeats, think of zebras.",
    subtitle: "Zebras represent rare diseases worldwide. We bring clinical clarity, empathetic guidance, and compassionate community to families navigating rare conditions.",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1920&q=80",
    alt: "Hopeful smiling child looking towards a brighter future",
    cornerTopic: "The Zebra Metaphor",
    cornerDesc: "In Medicine, When You Hear Hoofbeats, Think of Rare Diseases",
  },
  {
    tag: "CHILD-FRIENDLY & FAMILY-CENTERED",
    badge: "Plain-Language Medicine",
    title: "Understanding rare conditions with clarity, care & hope.",
    subtitle: "Plain-language medical guides, world-class specialist directories, and compassionate family support for children, parents, and caregivers.",
    image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1920&q=80",
    alt: "Happy child smiling warmly in natural sunlight",
    cornerTopic: "Family Health Guides",
    cornerDesc: "Plain-Language Guidance Sourced from Certified Pediatric Networks",
  },
  {
    tag: "CAREGIVER & PEER SUPPORT",
    badge: "Compassionate Support Circles",
    title: "Connecting parents & caregivers through real experience.",
    subtitle: "You are never alone. Join parent support circles, practical caregiver wellness guides, and peer advocacy networks.",
    image: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1920&q=80",
    alt: "Smiling child surrounded by supportive family",
    cornerTopic: "Caregiver Circles",
    cornerDesc: "Peer Advocacy & Practical Caregiver Wellness Support",
  },
  {
    tag: "PLAIN-LANGUAGE MEDICAL EDUCATION",
    badge: "7,000+ Verified Conditions",
    title: "Simplifying complex genetic reports into everyday guidance.",
    subtitle: "Our certified clinical networks break down ORPHA codes, symptoms, and inheritance patterns into clear, encouraging steps.",
    image: "https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=1920&q=80",
    alt: "Hopeful child with a gentle smile in open daylight",
    cornerTopic: "Clinical Clarity",
    cornerDesc: "Turning Complex Genetics into Clear Everyday Steps",
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

  // Auto-advance hero carousel every 6.5 seconds
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6500);
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

  const featuredDiseases = diseases.slice(0, 6);
  const activeSlide = HERO_SLIDES[currentSlide];

  return (
    <div className="relative min-h-screen overflow-hidden bg-transparent text-[#112250] selection:bg-[#DDF0FA] selection:text-[#112250]">
      {/* ================= HERO SECTION (Tour Architecture - Full Width Edge-to-Edge with Curved Bottom) ================= */}
      <section className="relative overflow-hidden w-full m-0 rounded-b-[2.5rem] sm:rounded-b-[4.5rem] shadow-2xl bg-[#070D1E] min-h-[660px] lg:min-h-[740px] flex flex-col justify-between pt-24 sm:pt-32 lg:pt-36 pb-8 sm:pb-12">
        {/* Background Visual Carousel with Gentle Ken-Burns Crossfade */}
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
                className="h-full w-full object-cover object-[center_35%] transition-transform duration-[8500ms] ease-out scale-105 select-none"
              />
              {/* Deep atmospheric gradient overlays guaranteeing WCAG AAA contrast */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#070D1E]/90 via-[#0D1B3E]/80 to-[#070D1E]/95 pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#070D1E]/40 to-[#070D1E]/85 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[42rem] h-64 bg-[#1A3365]/30 blur-[130px] pointer-events-none z-10" />

        {/* Centered Hero Content with Wordings Animations */}
        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 text-center my-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="space-y-4 sm:space-y-5"
            >
              {/* Centered Pill Badge with Pulsing Ping Dot */}
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-4 py-1.5 text-xs font-semibold text-white shadow-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#BCE0F5] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#BCE0F5]" />
                </span>
                <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#BCE0F5]">
                  {activeSlide.tag}
                </span>
                <span className="text-white/30 hidden sm:inline">·</span>
                <span className="text-[11px] text-white/80 font-light hidden sm:inline">
                  {activeSlide.badge}
                </span>
              </div>

              {/* Large Animated Headline */}
              <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-black leading-[1.15] tracking-tight text-white max-w-4xl mx-auto drop-shadow-md">
                {activeSlide.title}
              </h1>

              {/* Animated Subtitle */}
              <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg leading-relaxed text-[#D6E0F5] font-light">
                {activeSlide.subtitle}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Central Sleek Search Bar (Tour signature search architecture) */}
          <div className="w-full max-w-xl mx-auto pt-6 sm:pt-7">
            <form
              onSubmit={handleSearchSubmit}
              className="group relative flex items-center rounded-full bg-white border-2 border-white/40 shadow-2xl p-1.5 sm:p-2 backdrop-blur-xl transition-all duration-300 hover:border-white/70 focus-within:border-white focus-within:shadow-[0_12px_36px_rgba(0,0,0,0.35)]"
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
                autoComplete="off"
                spellCheck="false"
                className="w-full bg-transparent py-2 sm:py-2.5 pr-3 text-xs sm:text-sm md:text-base text-[#112250] placeholder:text-[#112250]/45 font-medium border-0 outline-none focus:outline-none focus:ring-0 shadow-none"
              />
              <button
                type="submit"
                aria-label="Search RareBridge"
                className="shrink-0 flex items-center gap-1.5 rounded-full bg-[#112250] hover:bg-[#1A3365] px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-heading font-bold text-white shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-95"
              >
                <span>Search</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </form>

            {/* Quick Action Shortcut Pills */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={() => onNav("directory")}
                className="inline-flex items-center gap-2 rounded-full bg-white/15 hover:bg-white/25 border border-white/25 px-4.5 py-2 text-xs font-heading font-semibold text-white backdrop-blur-md transition-all active:scale-95 cursor-pointer shadow-xs"
              >
                <BookOpen className="h-3.5 w-3.5 text-[#BCE0F5]" />
                <span>Browse Disease Library</span>
              </button>

              <button
                type="button"
                onClick={() => onNav("community")}
                className="inline-flex items-center gap-2 rounded-full bg-white/15 hover:bg-white/25 border border-white/25 px-4.5 py-2 text-xs font-heading font-semibold text-white backdrop-blur-md transition-all active:scale-95 cursor-pointer shadow-xs"
              >
                <Users className="h-3.5 w-3.5 text-[#BCE0F5]" />
                <span>Join Caregiver Community</span>
              </button>
            </div>
          </div>
        </div>

        {/* ================= CORNERS CAROUSEL OF IMAGES AND WORDINGS (Matching Tour) ================= */}
        <div className="max-w-7xl mx-auto w-full relative z-20 flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 px-4 sm:px-6">
          {/* Bottom-Left Corner: Animated Wordings Pill */}
          <div className="flex items-center gap-2.5">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-2.5 bg-black/45 backdrop-blur-md px-4 py-2 rounded-full border border-white/15 text-xs text-white/90 shadow-sm"
              >
                <span className="h-2 w-2 rounded-full bg-[#BCE0F5] shrink-0 animate-pulse" />
                <span className="font-heading font-bold text-white tracking-wide text-xs">
                  {activeSlide.cornerTopic}
                </span>
                <span className="text-white/30 hidden sm:inline">·</span>
                <span className="text-white/80 font-light hidden sm:inline text-[11px] truncate max-w-xs md:max-w-sm">
                  {activeSlide.cornerDesc}
                </span>
              </motion.div>
            </AnimatePresence>

            {/* Mascot Badge */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white shadow-xs">
              <BabyZebraBadge size={18} className="border-white/30 shadow-xs" />
              <span className="text-[10px] font-heading font-semibold text-white/90">Rare-Ze</span>
            </div>
          </div>

          {/* Bottom-Right Corner: Sleek Tour-Style Dot Scrubber Capsule (< ● ● ▬ ● >) */}
          <div className="flex items-center gap-2 bg-black/45 backdrop-blur-md px-3.5 py-2 rounded-full border border-white/15 text-white shadow-lg">
            {/* Prev Arrow */}
            <button
              type="button"
              onClick={handlePrevSlide}
              aria-label="Previous slide"
              className="text-white/60 hover:text-white transition-colors p-0.5 cursor-pointer active:scale-90"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>

            {/* Micro Dot Indicators with Active Pill Elongation */}
            <div className="flex items-center gap-1.5 mx-1">
              {HERO_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`transition-all duration-300 rounded-full cursor-pointer h-2 ${
                    currentSlide === idx
                      ? "w-6 bg-[#BCE0F5] shadow-xs"
                      : "w-2 bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>

            {/* Next Arrow */}
            <button
              type="button"
              onClick={handleNextSlide}
              aria-label="Next slide"
              className="text-white/60 hover:text-white transition-colors p-0.5 cursor-pointer active:scale-90"
            >
              <ChevronRight className="h-3.5 w-3.5" />
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
                bg: "bg-[#112250] text-white card-hover-lift",
                iconBox: "bg-white/10 text-white",
              },
              {
                number: "2,400+",
                label: "Verified Specialists",
                subtext: "Top metabolic & genetic experts",
                icon: Stethoscope,
                bg: "bg-white border-2 border-[#112250]/15 text-[#112250] card-hover-lift shadow-xs",
                iconBox: "bg-[#EDF6FC] text-[#112250]",
              },
              {
                number: "850+",
                label: "Research Trials",
                subtext: "Gene therapy & pipeline updates",
                icon: Microscope,
                bg: "bg-[#D6EAF5] border-2 border-[#BCE0F5] text-[#112250] card-hover-lift shadow-xs",
                iconBox: "bg-white text-[#112250]",
              },
              {
                number: "120K+",
                label: "Families Supported",
                subtext: "Compassionate peer advocacy",
                icon: HeartHandshake,
                bg: "bg-[#EDF6FC] border-2 border-[#BCE0F5] text-[#112250] card-hover-lift shadow-xs",
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

      <ZebraStripeDivider />

      {/* ================= THE 4 PILLARS OF RAREBRIDGE ("WHAT WE OFFER" IN TOUR) ================= */}
      <section className="py-20 sm:py-28 relative overflow-hidden">
        {/* Subtle radial lighting backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[55rem] h-[35rem] bg-gradient-to-tr from-[#112250]/5 via-[#BCE0F5]/15 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="mx-auto max-w-3xl text-center space-y-4">
            <div className="relative inline-flex items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-white border border-[#112250]/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#112250] shadow-xs">
                <BabyZebraBadge size={18} className="shrink-0" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#112250] animate-pulse" />
                Core Disciplines
              </span>
            </div>
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
                <BabyZebraBadge size={22} className="shrink-0" />
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

      {/* ================= EXPLORE DISEASES PREVIEW SECTION ================= */}
      <section className="py-20 sm:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-heading font-bold uppercase tracking-widest text-[#112250] bg-[#112250]/5 px-3 py-1 rounded-full border border-[#112250]/10">
                <BookOpen className="h-3.5 w-3.5" />
                Featured Diseases
              </span>
              <h2 className="mt-3 font-heading text-3xl font-black text-[#112250] md:text-4xl tracking-tight">
                Explore Rare Diseases
              </h2>
              <p className="mt-1 text-sm sm:text-base text-[#3B507D] max-w-xl font-normal leading-relaxed">
                Clear, medically-vetted guides to help families, caregivers, and clinicians understand rare conditions with confidence.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNav("directory")}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#112250] hover:text-[#1C376F] transition-colors cursor-pointer shrink-0"
            >
              <span>Explore full library</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Clean 3-6 Disease Preview Cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredDiseases.map((disease) => (
              <DiseaseCard
                key={disease.id}
                disease={disease}
                onClick={() => onDisease(disease.id)}
              />
            ))}
          </div>

          {/* Prominent CTA: Explore the Disease Guide */}
          <div className="rounded-3xl border border-[#112250]/15 bg-gradient-to-br from-[#F7FBFE] via-white to-[#EDF6FC] p-8 sm:p-10 text-center shadow-xs">
            <div className="max-w-2xl mx-auto space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#112250]/5 border border-[#112250]/10 px-3.5 py-1 text-xs font-heading font-bold uppercase tracking-wider text-[#112250]">
                <BookOpen className="h-3.5 w-3.5" />
                Comprehensive Directory
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl font-black text-[#112250] tracking-tight">
                Explore the Disease Guide
              </h3>
              <p className="text-sm sm:text-base text-[#3B507D] font-normal leading-relaxed">
                Discover our growing library of rare diseases. Search by name, explore different categories, and access detailed information.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onNav("directory")}
                  className="inline-flex items-center gap-2 rounded-full bg-[#112250] hover:bg-[#1C376F] text-white px-7 py-3.5 text-sm font-heading font-bold shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 cursor-pointer"
                >
                  <BookOpen className="h-4 w-4 text-[#BCE0F5]" />
                  <span>Explore the Disease Guide</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
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