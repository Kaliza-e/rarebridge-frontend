import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DISEASES,
  fetchDiseasesFromAPI,
  type Disease,
} from "../data";

import {
  DiseaseCard,
  EdelweissFlower,
  OrganicWavyLine,
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
    image: "/rarebridge_zebra_with_book.png",
    alt: "Friendly Zebra mascot sitting with open book",
    badge: "100% Free & Family-Centered",
  },
  {
    tag: "Plain-Language Medical Education",
    title: "Simplifying complex genetic reports into everyday guidance.",
    subtitle: "Our zebra mascot helps families break down ORPHA codes, symptoms, and inheritance patterns into clear, encouraging steps.",
    image: "/rarebridge_hero_child.png",
    alt: "Child playing with friendly zebra friend",
    badge: "Sourced from Certified Geneticists",
  },
  {
    tag: "Caregiver & Family Network",
    title: "Connecting parents & caregivers through real experience.",
    subtitle: "You are never alone. Join parent support circles, practical caregiver wellness guides, and peer advocacy networks.",
    image: "/rarebridge_family_photo.png",
    alt: "RareBridge supportive family illustration",
    badge: "Compassionate Support Circles",
  },
];

export const HomePage = ({ onNav, onDisease }: HomePageProps) => {
  const [diseases, setDiseases] = useState<Disease[]>(DISEASES);
  const [isLoading, setIsLoading] = useState(false);

  // Hero Image Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    let isMounted = true;

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

  const featuredDiseases = diseases.slice(0, 3);
  const activeSlide = HERO_SLIDES[currentSlide];

  return (
    <main className="relative min-h-screen overflow-hidden bg-transparent text-[#112250] selection:bg-[#E7E2CE] selection:text-[#112250]">
      <OrganicWavyLine side="left" />
      <OrganicWavyLine side="right" />

      {/* ================= HERO SECTION ================= */}
      <section className="relative overflow-hidden bg-transparent pt-12 pb-16 lg:pt-16 lg:pb-20">
        {/* Zebra Reading Book Hero Background Backdrop */}
        <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 opacity-20 max-w-lg hidden lg:block z-0">
          <img src="/rarebridge_zebra_with_book.png" alt="Zebra Reading Book Background" className="h-auto w-full object-contain" />
        </div>

        {/* Ambient blobs matching site canvas */}
        <div className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-[#E7E2CE]/70 blur-3xl" />
        <div className="pointer-events-none absolute top-1/3 -left-20 h-56 w-56 rounded-full bg-[#3B507D]/10 blur-3xl" />

        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:items-center lg:px-8">
          {/* Left: Copy panel */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
              >
                <span className="font-callout text-xs font-bold uppercase tracking-widest text-[#3B507D] mb-2 block">
                  {activeSlide.tag}
                </span>

                <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight text-[#112250]">
                  {activeSlide.title}
                </h1>

                <p className="font-sans mt-3 max-w-xl text-sm sm:text-base leading-relaxed text-[#3B507D] font-medium">
                  {activeSlide.subtitle}
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onNav("directory")}
                    className="inline-flex items-center gap-2.5 rounded-lg bg-[#112250] px-6 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-[#3B507D] transition-all"
                  >
                    <BookOpen className="h-5 w-5 text-white" />
                    <span>Browse Disease Library</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onNav("community")}
                    className="inline-flex items-center gap-2.5 rounded-lg border-2 border-[#112250] bg-transparent px-6 py-3.5 text-sm font-bold text-[#112250] hover:bg-[#112250]/10 transition-all"
                  >
                    <Users className="h-5 w-5 text-[#112250]" />
                    <span>Join Caregiver Community</span>
                  </motion.button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: Integrated Hero Image Container */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-none lg:col-span-5">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl border-2 border-[#E7E2CE] bg-white p-2 sm:aspect-[5/4]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentSlide}
                  src={activeSlide.image}
                  alt={activeSlide.alt}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="h-full w-full rounded-lg object-cover"
                />
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ================= IMPACT & KNOWLEDGE RIBBON ================= */}
      <section className="relative py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                number: "7,000+",
                label: "Rare Conditions",
                subtext: "Plain-language medical guides",
                icon: BookOpen,
                bg: "bg-[#112250]",
                text: "text-white",
              },
              {
                number: "2,400+",
                label: "Verified Specialists",
                subtext: "Top metabolic & genetic experts",
                icon: Stethoscope,
                bg: "bg-white border-2 border-[#E7E2CE]",
                text: "text-[#112250]",
              },
              {
                number: "850+",
                label: "Research Trials",
                subtext: "Gene therapy & pipeline updates",
                icon: Microscope,
                bg: "bg-white border-2 border-[#E7E2CE]",
                text: "text-[#112250]",
              },
              {
                number: "120K+",
                label: "Families Supported",
                subtext: "Compassionate peer advocacy",
                icon: HeartHandshake,
                bg: "bg-[#3B507D]",
                text: "text-white",
              },
            ].map((stat, i) => {
              const IconComp = stat.icon;
              return (
                <motion.div
                  key={i}
                  whileHover={{ y: -3, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className={`rounded-xl p-5 border-2 border-[#E7E2CE] transition-all duration-200 cursor-pointer ${stat.bg} ${stat.text}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="rounded-lg bg-[#E7E2CE]/30 p-2 text-[#E7E2CE]">
                      <IconComp className="h-5 w-5 text-current" />
                    </div>
                    <EdelweissFlower size={20} />
                  </div>
                  <h3 className="font-heading font-black text-3xl tracking-tight">{stat.number}</h3>
                  <p className="font-heading font-bold text-sm mt-1">{stat.label}</p>
                  <p className="font-sans text-xs opacity-80 mt-0.5">{stat.subtext}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= THE 4 PILLARS OF RAREBRIDGE ================= */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#E7E2CE]/60 px-4 py-1 text-xs font-bold text-[#112250] mb-3">
            <Sparkles className="h-3.5 w-3.5 text-[#3B507D]" />
            <span>Designed for Families & Children</span>
          </div>
          <h2 className="font-heading font-black text-3xl sm:text-4xl text-[#112250]">
            Everything your family needs, in one friendly space
          </h2>
          <p className="font-sans text-base text-[#3B507D] font-medium mt-2">
            No medical jargon wall. Just reliable, easy-to-understand guidance created with empathy.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Card 1 */}
          <motion.div
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-xl bg-white p-6 border-2 border-[#E7E2CE] hover:border-[#112250] transition-all flex flex-col justify-between cursor-pointer"
            onClick={() => onNav("directory")}
          >
            <div>
              <div className="rounded-lg bg-[#F5F4F0] w-12 h-12 flex items-center justify-center text-[#112250] mb-4">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="font-heading font-extrabold text-xl text-[#112250]">Disease Library</h3>
              <p className="font-sans text-sm text-[#3B507D] mt-2 font-medium leading-relaxed">
                7,000+ conditions simplified with symptoms, genetic causes, and plain-language summaries.
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-[#F5F4F0] pt-3">
              <span className="font-bold text-xs text-[#112250] uppercase tracking-wider">Explore Library</span>
              <ArrowRight className="h-4 w-4 text-[#112250]" />
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-xl bg-white p-6 border-2 border-[#E7E2CE] hover:border-[#112250] transition-all flex flex-col justify-between cursor-pointer"
            onClick={() => onNav("specialists")}
          >
            <div>
              <div className="rounded-lg bg-[#F5F4F0] w-12 h-12 flex items-center justify-center text-[#112250] mb-4">
                <Stethoscope className="h-6 w-6" />
              </div>
              <h3 className="font-heading font-extrabold text-xl text-[#112250]">Find Specialists</h3>
              <p className="font-sans text-sm text-[#3B507D] mt-2 font-medium leading-relaxed">
                Direct connections to top pediatric geneticists, metabolic doctors, and specialized hospitals.
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-[#F5F4F0] pt-3">
              <span className="font-bold text-xs text-[#112250] uppercase tracking-wider">Find Experts</span>
              <ArrowRight className="h-4 w-4 text-[#112250]" />
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-xl bg-white p-6 border-2 border-[#E7E2CE] hover:border-[#112250] transition-all flex flex-col justify-between cursor-pointer"
            onClick={() => onNav("research")}
          >
            <div>
              <div className="rounded-lg bg-[#F5F4F0] w-12 h-12 flex items-center justify-center text-[#112250] mb-4">
                <Microscope className="h-6 w-6" />
              </div>
              <h3 className="font-heading font-extrabold text-xl text-[#112250]">Research & Trials</h3>
              <p className="font-sans text-sm text-[#3B507D] mt-2 font-medium leading-relaxed">
                Stay updated on groundbreaking enzyme therapies, gene editing, and active clinical trials.
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-[#F5F4F0] pt-3">
              <span className="font-bold text-xs text-[#112250] uppercase tracking-wider">View Trials</span>
              <ArrowRight className="h-4 w-4 text-[#112250]" />
            </div>
          </motion.div>

          {/* Card 4 */}
          <motion.div
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-xl bg-white p-6 border-2 border-[#E7E2CE] hover:border-[#112250] transition-all flex flex-col justify-between cursor-pointer"
            onClick={() => onNav("community")}
          >
            <div>
              <div className="rounded-lg bg-[#F5F4F0] w-12 h-12 flex items-center justify-center text-[#112250] mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="font-heading font-extrabold text-xl text-[#112250]">Caregiver Community</h3>
              <p className="font-sans text-sm text-[#3B507D] mt-2 font-medium leading-relaxed">
                Connect with parents and caregivers sharing real experiences, emotional support, and advice.
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-[#F5F4F0] pt-3">
              <span className="font-bold text-xs text-[#112250] uppercase tracking-wider">Join Circle</span>
              <ArrowRight className="h-4 w-4 text-[#112250]" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= FEATURED CONDITIONS SECTION ================= */}
      <section className="py-14 bg-white border-y border-[#E7E2CE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <span className="font-callout text-xs font-bold uppercase tracking-widest text-[#3B507D]">
                Knowledge Base
              </span>
              <h2 className="font-heading font-black text-3xl text-[#112250] mt-1">
                Featured Rare Diseases
              </h2>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNav("directory")}
              className="inline-flex items-center gap-2 rounded-lg bg-[#F5F4F0] px-5 py-2.5 text-sm font-bold text-[#112250] hover:bg-[#E7E2CE] transition-colors self-start"
            >
              <span>View All Conditions</span>
              <ArrowRight className="h-4 w-4" />
            </motion.button>
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

      {/* ================= FAMILY & CAREGIVER STORY BANNER ================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-xl p-8 sm:p-12 text-white overflow-hidden border-2 border-[#E7E2CE]">
          {/* Background Image & Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="/rarebridge_family_photo.png"
              alt="RareBridge supportive family background"
              className="h-full w-full object-cover object-center opacity-35"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#112250] via-[#112250]/90 to-[#112250]/50" />
          </div>

          <div className="absolute top-4 right-6 opacity-70 pointer-events-none z-10">
            <EdelweissFlower size={56} />
          </div>

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-md bg-white/10 px-4 py-1.5 text-xs font-bold text-[#E7E2CE] mb-4 backdrop-blur-xs">
              <HeartHandshake className="h-4 w-4 text-[#E7E2CE]" />
              <span>You Are Not Alone</span>
            </div>
            <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl leading-tight text-white drop-shadow-xs">
              Built by families, for families affected by rare conditions.
            </h2>
            <p className="font-sans text-base sm:text-lg text-[#D6E0F5] mt-4 leading-relaxed font-medium">
              Receiving a rare diagnosis can feel overwhelming. RareBridge brings together medical truth, hopeful science, and empathetic families to ensure no caregiver walks this journey in the dark.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onNav("about")}
                className="rounded-lg bg-[#E7E2CE] px-6 py-3.5 text-sm font-black text-[#112250] hover:bg-white transition-all"
              >
                Our Story & Mission
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onNav("community")}
                className="rounded-lg border-2 border-white/20 bg-white/10 px-6 py-3.5 text-sm font-bold text-white hover:bg-white/20 backdrop-blur-sm transition-all"
              >
                Connect with Families
              </motion.button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= RAREBRIDGE AI ZEBRA HELPER BANNER ================= */}
      <section className="pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-xl bg-white p-8 sm:p-10 border-2 border-[#E7E2CE] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <img
              src="/rarebridge_zebra_reading.png"
              alt="Friendly Zebra Mascot reading a book"
              className="h-24 w-24 object-contain animate-float shrink-0"
            />
            <div>
              <span className="font-callout text-xs font-bold uppercase tracking-wider text-[#3B507D]">
                Child-Friendly AI Assistant
              </span>
              <h3 className="font-heading font-black text-2xl text-[#112250] mt-0.5">
                Have questions about a genetic report or symptom?
              </h3>
              <p className="font-sans text-sm text-[#3B507D] font-medium mt-1">
                Ask our friendly AI mascot to break down complex medical terms into simple, comforting language.
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onNav("directory")}
            className="rounded-lg bg-[#112250] px-6 py-3.5 text-sm font-bold text-white hover:bg-[#3B507D] transition-colors shrink-0 flex items-center gap-2"
          >
            <BrainCircuit className="h-5 w-5 text-[#E7E2CE]" />
            <span>Ask Zebra Assistant</span>
          </motion.button>
        </div>
      </section>
    </main>
  );
};

export default HomePage;