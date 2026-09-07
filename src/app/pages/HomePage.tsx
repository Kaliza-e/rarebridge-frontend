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
        setVisible((prev) =>
          prev.includes(i) ? prev : [...prev, i]
        );
      }, 100 + i * 120)
    );

    return () => {
      timers.forEach(clearTimeout);
    };
  }, []);

  const wordClass = (i: number) =>
    `inline-block transition-all duration-500 ease-out ${visible.includes(i)
      ? "opacity-100 translate-y-0 blur-0"
      : "opacity-0 translate-y-6 blur-sm"
    }`;

  let idx = 0;

  return (
    <h1
      className="
        font-black
        text-4xl
        sm:text-5xl
        md:text-6xl
        lg:text-7xl
        leading-[1.05]
        tracking-tight
        text-primary
        mb-6
      "
      style={{
        fontFamily: "'Comic Neue', cursive, sans-serif",
      }}
    >
      {/* Understanding */}
      {line1.map((word) => {
        const i = idx++;

        return (
          <span key={word} className={wordClass(i)}>
            {word}
          </span>
        );
      })}

      <br />

      {/* Rare Diseases */}
      {line2.map((word, wi) => {
        const i = idx++;

        return (
          <span
            key={word}
            className={`${wordClass(i)} mr-3 ${wi === 0 ? "text-accent" : ""
              }`}
          >
            {word}
          </span>
        );
      })}

      <br />

      {/* Starts Here */}
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
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Disease[]>([]);
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [suggestedSearches, setSuggestedSearches] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [heroVisible, setHeroVisible] = useState(false);

  /* -------------------------------------------------------
     Fetch diseases from API on mount
  ------------------------------------------------------- */

  useEffect(() => {
    async function loadDiseases() {
      try {
        const apiDiseases = await fetchDiseasesFromAPI();
        setDiseases(apiDiseases);
        // Set suggested searches from actual disease names
        setSuggestedSearches(apiDiseases.slice(0, 4).map(d => d.name));
      } catch (error) {
        console.error('Failed to load diseases from API, using fallback:', error);
        setDiseases(DISEASES);
        setSuggestedSearches(SUGGESTED_SEARCHES);
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

  /* -------------------------------------------------------
     Search
  ------------------------------------------------------- */

  function handleSearch(q: string) {
    setQuery(q);

    setResults(
      q.trim().length > 1
        ? diseases.filter(
          (d) =>
            d.name
              .toLowerCase()
              .includes(q.toLowerCase()) ||
            d.category
              .toLowerCase()
              .includes(q.toLowerCase())
        )
        : []
    );
  }

  /* -------------------------------------------------------
     Fade animation helper
  ------------------------------------------------------- */

  const fadeUp = (delay: string) =>
    `transition-all duration-700 ${delay} ${heroVisible
      ? "opacity-100 translate-y-0"
      : "opacity-0 translate-y-8"
    }`;

  /* -------------------------------------------------------
     Feature icons
  ------------------------------------------------------- */

  const featureIcons = [
    BookOpen,
    Search,
    Users,
    Target,
    Trophy,
    Sparkles,
  ];

  /* -------------------------------------------------------
     Ribbon icons
  ------------------------------------------------------- */

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

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden bg-gradient-to-b from-[#F8FAFD] via-[#F8FAFD] to-white">
        {/* Curvy decorative lines in hero */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10" viewBox="0 0 1000 600">
          <path d="M0 100 Q250 50 500 100 T1000 100" stroke="var(--primary)" strokeWidth="3" fill="none" />
          <path d="M0 200 Q250 150 500 200 T1000 200" stroke="var(--purple)" strokeWidth="2" fill="none" />
          <path d="M0 300 Q250 250 500 300 T1000 300" stroke="var(--green)" strokeWidth="2" fill="none" />
          <path d="M0 400 Q250 350 500 400 T1000 400" stroke="var(--accent)" strokeWidth="2" fill="none" />
          <path d="M0 500 Q250 450 500 500 T1000 500" stroke="var(--secondary)" strokeWidth="2" fill="none" />
          <path d="M100 0 Q150 150 100 300 T100 600" stroke="var(--primary)" strokeWidth="2" fill="none" />
          <path d="M900 0 Q850 150 900 300 T900 600" stroke="var(--purple)" strokeWidth="2" fill="none" />
        </svg>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10 md:pt-28 md:pb-14 flex flex-col items-center text-center relative z-10">

          {/* Floating doodles in hero */}
          <div className="absolute top-10 left-10 animate-float opacity-20" style={{ animationDelay: '0s' }}>
            <ButterflyDoodle size={40} />
          </div>
          <div className="absolute top-20 right-16 animate-float opacity-20" style={{ animationDelay: '1s' }}>
            <EdelweissFlower size={50} />
          </div>
          <div className="absolute bottom-20 left-20 animate-float opacity-20" style={{ animationDelay: '2s' }}>
            <ButterflyDoodle size={35} />
          </div>
          <div className="absolute bottom-32 right-10 animate-float opacity-20" style={{ animationDelay: '0.5s' }}>
            <EdelweissFlower size={45} />
          </div>

          {/* Trust badge */}

          <div
            className={`
              inline-flex
              items-center
              gap-2
              px-4
              py-2
              rounded-full
              bg-white/90
              backdrop-blur-sm
              text-primary
              text-xs
              font-bold
              mb-8
              border
              border-[#E5EAF2]
              shadow-sm
              ${fadeUp("delay-0")}
            `}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-40" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>

            Trusted by 120,000+ families worldwide
          </div>

          {/* Headline */}

          <AnimatedHeadline />

          {/* Decorative mini illustrations */}

          <div
            className={`flex items-center justify-center gap-4 mb-6 ${fadeUp(
              "delay-[700ms]"
            )}`}
          >
            <div
              className="animate-bounce"
              style={{ animationDelay: "0.2s" }}
            >
              <ButterflyDoodle size={32} />
            </div>

            <div
              className="animate-bounce"
              style={{ animationDelay: "0.5s" }}
            >
              <EdelweissFlower size={32} />
            </div>
          </div>

          {/* Description */}

          <p
            className={`
              text-lg
              md:text-xl
              text-accent
              leading-relaxed
              mb-10
              max-w-2xl
              ${fadeUp("delay-[750ms]")}
            `}
          >
            RareBridge helps families understand rare diseases,
            discover trusted information, connect with specialists,
            and find supportive communities.
          </p>

          {/* =================================================
              SEARCH
          ================================================= */}

          <div
            className={`w-full max-w-2xl mb-4 ${fadeUp(
              "delay-[900ms]"
            )}`}
          >
            <div
              className="
                relative
                flex
                items-center
                bg-white
                border-2
                border-[#E1E7F0]
                rounded-2xl
                shadow-[0_8px_30px_rgba(17,34,80,0.07)]
                focus-within:border-primary
                focus-within:shadow-[0_12px_35px_rgba(17,34,80,0.12)]
                transition-all
                duration-300
              "
            >
              <Search className="absolute left-4 w-5 h-5 text-taupe pointer-events-none" />

              <input
                type="text"
                value={query}
                onChange={(e) =>
                  handleSearch(e.target.value)
                }
                placeholder="Search a disease, symptom, or condition…"
                className="
                  w-full
                  bg-transparent
                  pl-12
                  pr-36
                  py-4
                  text-primary
                  placeholder-taupe
                  text-base
                  font-medium
                  outline-none
                  rounded-2xl
                "
              />

              <button
                onClick={() => onNav("directory")}
                className="
                  absolute
                  right-2
                  px-5
                  py-2.5
                  rounded-xl
                  bg-primary
                  text-ivory
                  text-sm
                  font-bold
                  hover:bg-accent
                  hover:scale-105
                  hover:shadow-lg
                  transition-all
                  duration-200
                  shadow
                  flex
                  items-center
                  gap-1.5
                "
              >
                Explore
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Search results */}

            {results.length > 0 && (
              <div className="mt-2 bg-white border border-[#E1E7F0] rounded-2xl shadow-xl overflow-hidden text-left">
                {results.slice(0, 5).map((d) => (
                  <button
                    key={d.id}
                    onClick={() => {
                      handleSearch("");
                      onDisease(d.id);
                    }}
                    className="
                      w-full
                      flex
                      items-center
                      gap-3
                      px-4
                      py-3
                      hover:bg-[#F4F7FB]
                      transition-colors
                      border-b
                      border-[#E8ECF2]
                      last:border-0
                    "
                  >
                    <d.icon className="w-4 h-4 text-accent shrink-0" />

                    <span className="text-sm font-semibold text-primary">
                      {d.name}
                    </span>

                    <span className="text-xs text-taupe ml-auto">
                      {d.category}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* =================================================
              SUGGESTED SEARCHES
          ================================================= */}

          <div
            className={`flex flex-wrap justify-center gap-2 mb-10 ${fadeUp(
              "delay-[1000ms]"
            )}`}
          >
            <span className="text-xs text-taupe font-medium self-center flex items-center gap-1">
              <Search className="w-3 h-3" />
              Try:
            </span>

            {suggestedSearches.map((s, i) => (
              <button
                key={s}
                onClick={() => handleSearch(s)}
                className="
                  sound-effect-pop
                  px-3
                  py-1.5
                  rounded-full
                  bg-white
                  border
                  border-[#E1E7F0]
                  text-xs
                  font-semibold
                  text-accent
                  hover:bg-primary
                  hover:border-primary
                  hover:text-ivory
                  transition-all
                  duration-200
                  shadow-sm
                  flex
                  items-center
                  gap-1
                "
              >
                {
                  [
                    <BookOpen
                      key="book"
                      className="w-3 h-3"
                    />,
                    <Target
                      key="target"
                      className="w-3 h-3"
                    />,
                    <Zap
                      key="zap"
                      className="w-3 h-3"
                    />,
                    <Heart
                      key="heart"
                      className="w-3 h-3"
                    />,
                    <Users
                      key="users"
                      className="w-3 h-3"
                    />,
                  ][i % 5]
                }

                {s}
              </button>
            ))}
          </div>

          {/* =================================================
              CTA BUTTONS
          ================================================= */}

          <div
            className={`flex flex-wrap justify-center gap-3 mb-14 ${fadeUp(
              "delay-[1100ms]"
            )}`}
          >
            <button
              onClick={() => onNav("signin")}
              className="
                sound-effect-chime
                group
                px-6
                py-3
                rounded-2xl
                border-2
                border-primary
                text-primary
                font-bold
                hover:text-ivory
                hover:scale-105
                hover:shadow-lg
                transition-all
                duration-200
                flex
                items-center
                gap-2
                shadow-sm
                relative
                overflow-hidden
              "
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <Users className="w-4 h-4 relative z-10" />

              Find Support

              <ChevronRight
                className="
                  w-3.5
                  h-3.5
                  opacity-0
                  -translate-x-1
                  group-hover:opacity-100
                  group-hover:translate-x-0
                  transition-all
                  duration-200
                  relative z-10
                "
              />
            </button>

            <button
              onClick={() => onNav("signup")}
              className="
                sound-effect-chime
                group
                px-7
                py-3
                rounded-2xl
                bg-primary
                text-ivory
                font-bold
                hover:bg-accent
                hover:scale-105
                hover:shadow-lg
                transition-all
                duration-200
                flex
                items-center
                gap-2
                shadow-md
                relative
                overflow-hidden
              "
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <Sparkles className="w-4 h-4 relative z-10" />

              Get Started Free

              <ChevronRight
                className="
                  w-3.5
                  h-3.5
                  opacity-0
                  -translate-x-1
                  group-hover:opacity-100
                  group-hover:translate-x-0
                  transition-all
                  duration-200
                  relative z-10
                "
              />
            </button>
          </div>

          {/* =================================================
              FLOATING DECORATIONS
          ================================================= */}

          <div
            className={`absolute inset-0 pointer-events-none ${fadeUp(
              "delay-[1300ms]"
            )}`}
          >
            <div
              className="absolute top-20 left-10 animate-float"
              style={{ animationDelay: "0s" }}
            >
              <ButterflyDoodle
                size={40}
                className="opacity-60"
              />
            </div>

            <div
              className="absolute top-32 right-16 animate-float"
              style={{ animationDelay: "1s" }}
            >
              <EdelweissFlower
                size={50}
                className="opacity-50"
              />
            </div>

            <div
              className="absolute bottom-40 left-20 animate-float"
              style={{ animationDelay: "2s" }}
            >
              <ButterflyDoodle
                size={35}
                className="opacity-40"
              />
            </div>

            <div
              className="absolute bottom-32 right-10 animate-float"
              style={{ animationDelay: "0.5s" }}
            >
              <EdelweissFlower
                size={45}
                className="opacity-50"
              />
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          ANIMATED STATS RIBBON
      ===================================================== */}

      <section className="relative z-20 w-full overflow-hidden bg-[#112250] py-4 select-none shadow-sm">
        {/* Left fade */}

        <div className="pointer-events-none absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-[#112250] to-transparent z-10" />

        {/* Right fade */}

        <div className="pointer-events-none absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-[#112250] to-transparent z-10" />

        {/* Scrolling track */}

        <div className="flex w-max animate-ribbon gap-0">
          {[...STATS, ...STATS, ...STATS, ...STATS].map(
            (s, i) => (
              <div
                key={i}
                className="flex items-center gap-8 px-10"
              >
                <div className="flex items-center gap-3">
                  {ribbonIcons[i % ribbonIcons.length]}

                  <span className="font-black text-2xl text-[#F5F7FA] tracking-tight">
                    {s.value}
                  </span>

                  <span className="text-xs font-bold text-[#B8C3D6] uppercase tracking-widest whitespace-nowrap">
                    {s.label}
                  </span>
                </div>

                <span className="w-1.5 h-1.5 rounded-full bg-[#8EA2C2] opacity-60" />
              </div>
            )
          )}
        </div>
      </section>

      {/* =====================================================
          BREATHING SPACE
      ===================================================== */}

      <div className="h-3 md:h-5 bg-white" />

      {/* =====================================================
          PATIENT JOURNEY
      ===================================================== */}

      <section className="bg-[#F7F9FC] py-20 md:py-24 relative overflow-hidden">
        {/* Subtle glow effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
        <PatientJourney />
      </section>

      {/* =====================================================
          EVERYTHING YOU NEED
      ===================================================== */}

      <section className="bg-[#F7F9FC] py-24 md:py-28 relative overflow-hidden">
        {/* Subtle glow effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Section heading */}

          <div className="max-w-2xl mx-auto text-center mb-14">
            <span
              className="
                inline-flex
                items-center
                gap-2
                px-3.5
                py-1.5
                rounded-full
                bg-[#EAF0F8]
                text-[#112250]
                text-[11px]
                font-bold
                uppercase
                tracking-[0.16em]
                mb-5
              "
            >
              <Sparkles className="w-3.5 h-3.5" />

              Platform
            </span>

            <h2
              className="
                font-black
                text-3xl
                md:text-4xl
                lg:text-5xl
                text-[#112250]
                mb-5
                leading-tight
              "
              style={{
                fontFamily: "'Comic Neue', cursive, sans-serif",
              }}
            >
              Everything You Need,

              <span className="block text-[#50658A]">
                In One Place
              </span>
            </h2>

            <p className="text-[#718096] max-w-xl mx-auto text-base md:text-lg leading-relaxed">
              From diagnosis support to research breakthroughs —
              RareBridge is your trusted companion at every step.
            </p>
          </div>

          {/* Feature cards */}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {FEATURES.map((f, i) => {
              const Icon =
                featureIcons[i % featureIcons.length];

              return (
                <div
                  key={f.title}
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-[24px]
                    border
                    border-[#E5EAF2]
                    bg-white
                    p-6
                    md:p-7
                    shadow-[0_4px_20px_rgba(17,34,80,0.05)]
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-[#C9D5E7]
                    hover:shadow-[0_12px_30px_rgba(17,34,80,0.10)]
                  "
                >
                  {/* Decorative glow */}

                  <div
                    className="
                      pointer-events-none
                      absolute
                      -right-12
                      -top-12
                      w-32
                      h-32
                      rounded-full
                      bg-[#EAF0F8]
                      opacity-60
                      blur-2xl
                      transition-all
                      duration-500
                      group-hover:opacity-100
                    "
                  />

                  <div className="relative z-10">

                    {/* Icon */}

                    <div
                      className="
                        w-12
                        h-12
                        rounded-2xl
                        bg-[#EEF3F9]
                        border
                        border-[#E1E8F2]
                        flex
                        items-center
                        justify-center
                        mb-5
                        transition-all
                        duration-300
                        group-hover:border-[#112250]
                      "
                    >
                      <Icon
                        className="
                          w-5
                          h-5
                          text-[#112250]
                          transition-colors
                          duration-300
                          group-hover:text-white
                        "
                      />
                    </div>

                    {/* Title */}

                    <h3
                      className="font-bold text-[#112250] text-lg mb-2.5"
                      style={{
                        fontFamily:
                          "'Comic Neue', cursive, sans-serif",
                      }}
                    >
                      {f.title}
                    </h3>

                    {/* Description */}

                    <p className="text-sm text-[#718096] leading-6">
                      {f.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          FEATURED DISEASES
      ===================================================== */}

      <section className="bg-white py-24 relative overflow-hidden">
        {/* Subtle glow effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          <div className="flex items-end justify-between mb-10">

            <div>
              <span
                className="
                  inline-flex
                  items-center
                  gap-1.5
                  px-3
                  py-1
                  rounded-full
                  bg-[#EAF0F8]
                  text-primary
                  text-xs
                  font-bold
                  uppercase
                  tracking-widest
                  mb-3
                "
              >
                <BookOpen className="w-3 h-3" />
                Directory
              </span>

              <h2
                className="font-black text-3xl md:text-4xl text-primary"
                style={{
                  fontFamily:
                    "'Comic Neue', cursive, sans-serif",
                }}
              >
                Featured Diseases
              </h2>

              <p className="text-taupe mt-1.5 font-medium">
                Explore conditions in our database
              </p>
            </div>

            <button
              onClick={() => onNav("directory")}
              className="
                hidden
                sm:flex
                items-center
                gap-1.5
                text-sm
                font-bold
                text-primary
                border
                border-[#DDE4EE]
                rounded-xl
                px-4
                py-2
                hover:bg-[#F4F7FB]
                transition-all
                duration-200
              "
            >
              View all

              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-12">
                <div className="inline-flex items-center gap-2 text-taupe">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm font-medium">Loading diseases...</span>
                </div>
              </div>
            ) : diseases.length > 0 ? (
              diseases.slice(0, 6).map((d) => (
                <DiseaseCard
                  key={d.id}
                  disease={d}
                  onClick={() => onDisease(d.id)}
                />
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
          ZEBRA MESSAGE
      ===================================================== */}

      <section className="bg-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 relative overflow-hidden">
        {/* Sparkle effects */}
        <div className="absolute top-4 left-10 w-2 h-2 bg-primary rounded-full animate-ping opacity-30" />
        <div className="absolute top-8 right-16 w-1.5 h-1.5 bg-accent rounded-full animate-ping opacity-40" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-4 left-1/3 w-2 h-2 bg-secondary rounded-full animate-ping opacity-30" style={{ animationDelay: '1s' }} />

        <div className="flex items-center justify-center gap-6 py-8 border-y border-[#E8ECF2] relative z-10">

          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#D9E0EA]" />

          <div className="flex items-center gap-3 text-taupe text-center">
            <ZebraMascot size={32} />

            <span className="text-sm font-semibold max-w-xl">
              The zebra symbolizes rare diseases — when you
              hear hoofbeats, think zebras.
            </span>

            <ZebraMascot
              size={32}
              className="scale-x-[-1]"
            />
          </div>

          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#D9E0EA]" />
        </div>
      </section>

      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
        {/* Sparkle effects */}
        <div className="absolute top-10 left-20 w-2 h-2 bg-primary rounded-full animate-ping opacity-20" />
        <div className="absolute top-16 right-32 w-1.5 h-1.5 bg-accent rounded-full animate-ping opacity-30" style={{ animationDelay: '0.3s' }} />
        <div className="absolute bottom-20 left-1/4 w-2 h-2 bg-secondary rounded-full animate-ping opacity-20" style={{ animationDelay: '0.6s' }} />
        <div className="absolute bottom-32 right-16 w-1.5 h-1.5 bg-primary rounded-full animate-ping opacity-25" style={{ animationDelay: '0.9s' }} />

        <div
          className="
            max-w-4xl
            mx-auto
            relative
            overflow-hidden
            rounded-[28px]
            p-10
            md:p-16
            text-center
            shadow-[0_20px_60px_rgba(17,34,80,0.18)]
            relative z-10
          "
          style={{
            background:
              "linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)",
          }}
        >

          {/* Zebra decoration */}

          <div className="absolute -bottom-6 right-8 opacity-10">
            <ZebraMascot size={140} />
          </div>

          {/* Glow */}

          <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white/5 blur-2xl" />

          {/* Icon */}

          <div className="relative z-10">
            <div className="w-14 h-14 mx-auto mb-6 bg-white/15 rounded-2xl flex items-center justify-center">
              <Heart className="w-7 h-7 text-secondary" />
            </div>

            <h2
              className="font-black text-3xl md:text-4xl text-ivory mb-4"
              style={{
                fontFamily:
                  "'Comic Neue', cursive, sans-serif",
              }}
            >
              You Are Not Alone
            </h2>

            <p className="text-secondary/80 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
              Thousands of families are walking the same road.
              RareBridge is here to help you find answers,
              specialists, and community.
            </p>

            {/* CTA buttons */}

            <div className="flex flex-wrap gap-4 justify-center">

              <button
                onClick={() => onNav("signup")}
                className="
                  px-8
                  py-3
                  rounded-2xl
                  bg-secondary
                  text-primary
                  font-bold
                  hover:bg-white
                  transition-all
                  duration-200
                  shadow-lg
                  flex
                  items-center
                  gap-2
                "
              >
                <Zap className="w-4 h-4" />

                Get Started Free
              </button>

              <button
                onClick={() => onNav("specialists")}
                className="
                  px-8
                  py-3
                  rounded-2xl
                  border-2
                  border-white/30
                  text-ivory
                  font-bold
                  hover:bg-white/10
                  transition-all
                  duration-200
                  flex
                  items-center
                  gap-2
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