import React, { useEffect, useState } from "react";
import {
  Search,
  ArrowRight,
  BookOpen,
  Sparkles,
  Trophy,
  Target,
  Zap,
  Users,
  ChevronRight,
  Heart,
} from "lucide-react";

import {
  DISEASES,
  SUGGESTED_SEARCHES,
  STATS,
  FEATURES,
  fetchDiseasesFromAPI,
  type Disease,
} from "../data";

import {
  ZebraMascot,
  ButterflyDoodle,
  EdelweissFlower,
  DiseaseCard,
  PatientJourney,
} from "../components/common/Visuals";

/* =========================================================
   ANIMATED HEADLINE
========================================================= */

function AnimatedHeadline() {
  const line1 = ["Understanding"];
  const line2 = ["Rare", "Diseases"];
  const line3 = ["Starts", "Here"];

  const allWords = [...line1, ...line2, ...line3];
  const [visible, setVisible] = useState<number[]>([]);

  useEffect(() => {
    const timers = allWords.map((_, i) =>
      window.setTimeout(() => {
        setVisible((prev) => (prev.includes(i) ? prev : [...prev, i]));
      }, 100 + i * 120)
    );

    return () => {
      timers.forEach(clearTimeout);
    };
  }, []);

  const wordClass = (i: number) =>
    `inline-block transition-all duration-500 ease-out ${
      visible.includes(i)
        ? "opacity-100 translate-y-0 blur-0"
        : "opacity-0 translate-y-6 blur-sm"
    }`;

  let idx = 0;

  return (
    <h1 className="font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.08] tracking-tight text-primary mb-6">
      {line1.map((word) => {
        const i = idx++;
        return (
          <span key={word} className={wordClass(i)}>
            {word}
          </span>
        );
      })}

      <br />

      {line2.map((word, wi) => {
        const i = idx++;
        return (
          <span
            key={word}
            className={`${wordClass(i)} mr-3 ${wi === 0 ? "text-accent" : ""}`}
          >
            {word}
          </span>
        );
      })}

      <br />

      {line3.map((word) => {
        const i = idx++;
        return (
          <span key={word} className={`${wordClass(i)} mr-3`}>
            {word}
          </span>
        );
      })}
    </h1>
  );
}

/* =========================================================
   HOME PAGE
========================================================= */

export default function HomePage({
  onNav,
  onDisease,
}: {
  onNav: (v: string) => void;
  onDisease: (id: string) => void;
}) {
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroVisible, setHeroVisible] = useState(false);

  /* -------------------------------------------------------
     Fetch diseases from API on mount
  ------------------------------------------------------- */

  useEffect(() => {
    async function loadDiseases() {
      try {
        const apiDiseases = await fetchDiseasesFromAPI();
        setDiseases(apiDiseases as Disease[]);
      } catch (error) {
        console.error("Failed to load diseases from API, using fallback:", error);
        setDiseases(DISEASES);
      } finally {
        setLoading(false);
      }
    }
    loadDiseases();
  }, []);

  /* -------------------------------------------------------
     Hero entrance animation
  ------------------------------------------------------- */

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setHeroVisible(true);
    }, 60);

    return () => clearTimeout(timer);
  }, []);

  const fadeUp = (delay: string) =>
    `transition-all duration-700 ${delay} ${
      heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
    }`;

  const featureIcons = [
    BookOpen,
    Search,
    Users,
    Target,
    Trophy,
    Sparkles,
  ];

  const ribbonIcons = [
    <ZebraMascot key="zebra" size={24} />,
    <ButterflyDoodle key="butterfly" size={24} />,
    <EdelweissFlower key="flower" size={24} />,
    <Heart key="heart" className="w-6 h-6" />,
    <Users key="users" className="w-6 h-6" />,
    <Trophy key="trophy" className="w-6 h-6" />,
    <Sparkles key="sparkles" className="w-6 h-6" />,
    <Target key="target" className="w-6 h-6" />,
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-ivory text-primary">
      {/* Curved background SVG side accents */}
      <svg className="fixed left-0 top-0 h-full w-32 pointer-events-none opacity-10" viewBox="0 0 100 1000" preserveAspectRatio="none">
        <path d="M20 0 Q50 100 20 200 T20 400 T20 600 T20 800 T20 1000" stroke="var(--primary)" strokeWidth="3" fill="none" />
        <path d="M40 0 Q70 150 40 300 T40 600 T40 900 T40 1000" stroke="var(--purple)" strokeWidth="2" fill="none" />
        <path d="M60 0 Q90 200 60 400 T60 800 T60 1000" stroke="var(--green)" strokeWidth="2" fill="none" />
      </svg>
      <svg className="fixed right-0 top-0 h-full w-32 pointer-events-none opacity-10" viewBox="0 0 100 1000" preserveAspectRatio="none">
        <path d="M80 0 Q50 100 80 200 T80 400 T80 600 T80 800 T80 1000" stroke="var(--primary)" strokeWidth="3" fill="none" />
        <path d="M60 0 Q30 150 60 300 T60 600 T60 900 T60 1000" stroke="var(--purple)" strokeWidth="2" fill="none" />
        <path d="M40 0 Q10 200 40 400 T40 800 T40 1000" stroke="var(--green)" strokeWidth="2" fill="none" />
      </svg>

      {/* =====================================================
          1. CENTERED HERO SECTION WITH AMBIENT GLOWS
      ===================================================== */}

      <section
        className="relative overflow-hidden border-b border-taupe/20"
        style={{
          background:
            "linear-gradient(160deg, #EEF3FB 0%, #F4F7FD 40%, #FAFBFF 70%, #ffffff 100%)",
        }}
      >
        {/* Ambient Radial Glow Spots */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute animate-pulse"
            style={{
              top: "-15%",
              left: "50%",
              transform: "translateX(-50%)",
              width: "750px",
              height: "550px",
              background:
                "radial-gradient(ellipse at center, rgba(17,34,80,0.12) 0%, rgba(231,226,206,0.2) 40%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />
          <div
            className="absolute animate-float"
            style={{
              bottom: "-5%",
              left: "5%",
              width: "450px",
              height: "400px",
              background:
                "radial-gradient(ellipse at center, rgba(59,80,125,0.1) 0%, transparent 70%)",
              filter: "blur(50px)",
            }}
          />
          <div
            className="absolute animate-float"
            style={{
              top: "10%",
              right: "5%",
              width: "400px",
              height: "350px",
              background:
                "radial-gradient(ellipse at center, rgba(231,226,206,0.35) 0%, transparent 65%)",
              filter: "blur(40px)",
            }}
          />
        </div>

        {/* Diagonal Shimmer Grid Lines */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ opacity: 0.04 }}
          viewBox="0 0 1440 700"
          preserveAspectRatio="none"
        >
          <line x1="-100" y1="200" x2="700" y2="-100" stroke="#112250" strokeWidth="1.5" />
          <line x1="200" y1="800" x2="1100" y2="-100" stroke="#112250" strokeWidth="1" />
          <line x1="700" y1="800" x2="1600" y2="-100" stroke="#3b507d" strokeWidth="1" />
        </svg>

        {/* Main Centered Hero Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-14 md:pt-20 md:pb-20 flex flex-col items-center text-center relative z-10">
          
          {/* Trust Badge */}
          <div
            className={`
              inline-flex items-center gap-2
              px-5 py-2 rounded-full
              bg-white/90 backdrop-blur-md
              text-primary text-xs font-bold
              mb-6
              border border-[#D8E3F0]
              shadow-[0_4px_20px_rgba(17,34,80,0.08)]
              ${fadeUp("delay-0")}
            `}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-50" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
            </span>
            Trusted by 120,000+ families worldwide
          </div>

          {/* Animated Headline */}
          <AnimatedHeadline />

          {/* Decorative Mini Floating Doodles */}
          <div className={`flex items-center justify-center gap-6 mb-6 ${fadeUp("delay-[700ms]")}`}>
            <div className="animate-bounce" style={{ animationDelay: "0.2s" }}>
              <ButterflyDoodle size={32} />
            </div>
            <div
              className="w-px h-6 rounded-full"
              style={{
                background:
                  "linear-gradient(to bottom, transparent, rgba(17,34,80,0.2), transparent)",
              }}
            />
            <div className="animate-bounce" style={{ animationDelay: "0.5s" }}>
              <EdelweissFlower size={32} />
            </div>
          </div>

          {/* Centered Description */}
          <p
            className={`
              text-base md:text-xl text-accent leading-relaxed
              mb-8 max-w-xl
              ${fadeUp("delay-[750ms]")}
            `}
          >
            RareBridge helps families understand rare diseases, discover trusted information, connect with specialists, and find supportive communities.
          </p>

          {/* Centered Action Buttons with Shimmer & Glow */}
          <div className={`flex flex-wrap justify-center gap-4 ${fadeUp("delay-[900ms]")}`}>
            <button
              onClick={() => onNav("directory")}
              className="
                group
                px-7 py-3.5 rounded-2xl
                bg-primary text-ivory font-bold text-sm md:text-base
                hover:bg-accent hover:scale-105 hover:shadow-xl
                transition-all duration-200
                flex items-center gap-2 shadow-md relative overflow-hidden
              "
              style={{ boxShadow: "0 6px 28px rgba(17,34,80,0.25)" }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <BookOpen className="w-4 h-4 relative z-10" />
              Explore Diseases
              <ArrowRight className="w-4 h-4 relative z-10" />
            </button>

            <button
              onClick={() => onNav("signin")}
              className="
                group
                px-7 py-3.5 rounded-2xl
                bg-white border-2 border-primary text-primary font-bold text-sm md:text-base
                hover:bg-secondary/40 hover:border-primary hover:scale-105 hover:shadow-md
                transition-all duration-200
                flex items-center gap-2 shadow-sm relative overflow-hidden
              "
            >
              <Users className="w-4 h-4 relative z-10" />
              Find Support
              <ChevronRight className="w-4 h-4 relative z-10 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Floating Background Doodles */}
          <div className={`absolute inset-0 pointer-events-none ${fadeUp("delay-[1100ms]")}`}>
            <div className="absolute top-16 left-6 animate-float" style={{ animationDelay: "0s" }}>
              <ButterflyDoodle size={36} className="opacity-40" />
            </div>
            <div className="absolute top-24 right-10 animate-float" style={{ animationDelay: "1s" }}>
              <EdelweissFlower size={42} className="opacity-40" />
            </div>
            <div className="absolute bottom-16 left-12 animate-float" style={{ animationDelay: "2s" }}>
              <ButterflyDoodle size={28} className="opacity-30" />
            </div>
            <div className="absolute bottom-12 right-6 animate-float" style={{ animationDelay: "0.5s" }}>
              <EdelweissFlower size={36} className="opacity-35" />
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          2. ANIMATED STATS RIBBON
      ===================================================== */}

      <section className="relative z-20 w-full overflow-hidden bg-[#112250] py-4 select-none shadow-md">
        <div className="pointer-events-none absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-[#112250] to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-[#112250] to-transparent z-10" />

        <div className="flex w-max animate-ribbon gap-0">
          {[...STATS, ...STATS, ...STATS, ...STATS].map((s, i) => (
            <div key={i} className="flex items-center gap-8 px-10">
              <div className="flex items-center gap-3">
                {ribbonIcons[i % ribbonIcons.length]}
                <span className="font-bold text-2xl text-[#F5F7FA] tracking-tight">
                  {s.value}
                </span>
                <span className="text-xs font-bold text-[#B8C3D6] uppercase tracking-widest whitespace-nowrap">
                  {s.label}
                </span>
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-[#8EA2C2] opacity-60" />
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================
          3. PATIENT JOURNEY SECTION
      ===================================================== */}

      <section className="bg-[#F7F9FC] py-14 md:py-20 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
        <PatientJourney />
      </section>

      {/* =====================================================
          4. PLATFORM FEATURES ("EVERYTHING YOU NEED")
      ===================================================== */}

      <section className="bg-ivory py-20 md:py-28 relative overflow-hidden border-t border-taupe/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="max-w-2xl mx-auto text-center mb-14">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/50 text-primary text-xs font-bold uppercase tracking-widest mb-4 border border-taupe/40">
              <Sparkles className="w-3.5 h-3.5" />
              Platform
            </span>
            <h2 className="font-bold text-3xl md:text-4xl text-primary mb-4 leading-snug">
              Everything You Need, <span className="block text-accent font-medium">In One Place</span>
            </h2>
            <p className="text-accent text-base md:text-lg max-w-xl mx-auto leading-relaxed">
              From diagnosis support to research breakthroughs — RareBridge is your trusted companion at every step.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => {
              const Icon = featureIcons[i % featureIcons.length];

              return (
                <div
                  key={f.title}
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-3xl
                    border border-taupe/40
                    bg-white
                    p-7
                    shadow-sm
                    transition-all duration-300
                    hover:-translate-y-1.5
                    hover:border-primary/40
                    hover:shadow-xl
                  "
                >
                  <div className="pointer-events-none absolute -right-12 -top-12 w-32 h-32 rounded-full bg-secondary/40 opacity-0 group-hover:opacity-100 blur-2xl transition-all duration-500" />

                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-secondary/30 border border-taupe/40 flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-ivory transition-colors duration-300">
                      <Icon className="w-5 h-5 text-primary group-hover:text-ivory transition-colors duration-300" />
                    </div>
                    <h3 className="font-bold text-primary text-lg mb-2">{f.title}</h3>
                    <p className="text-sm text-accent leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          5. FEATURED DISEASES SECTION
      ===================================================== */}

      <section className="bg-white py-20 md:py-24 relative overflow-hidden border-t border-taupe/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/40 text-primary text-xs font-bold uppercase tracking-widest mb-3">
                <BookOpen className="w-3 h-3" />
                Directory
              </span>
              <h2 className="font-bold text-2xl md:text-3xl lg:text-4xl text-primary">
                Featured Diseases
              </h2>
              <p className="text-accent mt-1 text-sm md:text-base font-medium">
                Explore conditions in our database
              </p>
            </div>

            <button
              onClick={() => onNav("directory")}
              className="hidden sm:flex items-center gap-1.5 text-sm font-bold text-primary border border-taupe/40 rounded-xl px-4 py-2 hover:bg-ivory transition-all duration-200"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-12">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <span className="text-sm text-taupe font-medium">Loading diseases...</span>
              </div>
            ) : diseases.length > 0 ? (
              diseases.slice(0, 6).map((d) => (
                <DiseaseCard key={d.id} disease={d} onClick={() => onDisease(d.id)} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-taupe font-medium">No diseases available</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          6. ZEBRA MASCOT MESSAGE
      ===================================================== */}

      <section className="bg-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 relative overflow-hidden">
        <div className="flex items-center justify-center gap-6 py-8 border-y border-taupe/20 relative z-10">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-taupe/30" />
          <div className="flex items-center gap-3 text-accent text-center">
            <ZebraMascot size={28} />
            <span className="text-xs md:text-sm font-semibold max-w-xl">
              The zebra symbolizes rare diseases — when you hear hoofbeats, think zebras.
            </span>
            <ZebraMascot size={28} className="scale-x-[-1]" />
          </div>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-taupe/30" />
        </div>
      </section>

      {/* =====================================================
          7. FINAL CALL-TO-ACTION SECTION
      ===================================================== */}

      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-ivory">
        <div
          className="
            max-w-4xl
            mx-auto
            relative
            overflow-hidden
            rounded-[32px]
            p-10
            md:p-16
            text-center
            shadow-2xl
            relative z-10
          "
          style={{
            background:
              "linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)",
          }}
        >
          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="w-14 h-14 mx-auto mb-6 bg-white/15 rounded-2xl flex items-center justify-center border border-white/20">
              <Heart className="w-7 h-7 text-secondary" />
            </div>

            <h2 className="font-bold text-3xl md:text-4xl text-ivory mb-4 leading-snug">
              You Are Not Alone
            </h2>

            <p className="text-secondary/90 text-base md:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
              Thousands of families are walking the same road. RareBridge is here to help you find answers, specialists, and community.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => onNav("signup")}
                className="
                  px-8 py-3.5
                  rounded-2xl
                  bg-secondary
                  text-primary
                  font-bold text-sm md:text-base
                  hover:bg-white
                  transition-all duration-200
                  shadow-lg
                  flex items-center gap-2
                "
              >
                <Zap className="w-4 h-4" />
                Get Started Free
              </button>

              <button
                onClick={() => onNav("specialists")}
                className="
                  px-8 py-3.5
                  rounded-2xl
                  border-2 border-white/30
                  text-ivory
                  font-bold text-sm md:text-base
                  hover:bg-white/10
                  transition-all duration-200
                  flex items-center gap-2
                "
              >
                <Users className="w-4 h-4" />
                Talk to a Specialist
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}