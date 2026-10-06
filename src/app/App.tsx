import React, { useEffect, useState } from "react";
import { MotionConfig } from "framer-motion";

import Navbar from "./components/layout/Navbar";
import MobileNav from "./components/layout/MobileNav";
import Footer from "./components/layout/Footer";

import HomePage from "./pages/HomePage"
import DirectoryPage from "./pages/DirectoryPage";
import DiseasePage from "./pages/DiseasePage";
import AboutPage from "./pages/AboutPage";
import ResearchPage from "./pages/ResearchPage";
import SpecialistsPage from "./pages/SpecialistsPage";
import CommunityPage from "./pages/CommunityPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";

import {
  ZebraStripeBackground,
  usePopSound,
  useChimeSound,
  useSparkleSound,
  AIAssistant,
} from "./components/common/Visuals";

import { DISEASES, type Disease } from "./data";

type View =
  | "home"
  | "directory"
  | "disease"
  | "about"
  | "research"
  | "specialists"
  | "community"
  | "signin"
  | "signup";

export default function App() {
  const [view, setView] = useState<View>("home");

  const [selectedDisease, setSelectedDisease] =
    useState<string | null>(null);

  const playPopSound = usePopSound();
  const playChimeSound = useChimeSound();
  const playSparkleSound = useSparkleSound();


  useEffect(() => {
    const handleGlobalClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;

      // Don't trigger sound for the dedicated sound control
      if (event.target.closest(".hoof-sound-control")) {
        return;
      }

      // Pop sound
      if (event.target.closest(".sound-effect-pop")) {
        playPopSound();
        return;
      }

      // Chime sound
      if (event.target.closest(".sound-effect-chime")) {
        playChimeSound();
        return;
      }

      // Sparkle sound
      if (event.target.closest(".sound-effect-sparkle")) {
        playSparkleSound();
        return;
      }

      // No default sound - removed hoof sound to avoid scaring users
    };

    document.addEventListener("click", handleGlobalClick);

    return () => {
      document.removeEventListener("click", handleGlobalClick);
    };
  }, [
    playPopSound,
    playChimeSound,
    playSparkleSound,
  ]);

  /*
   * Navigation
   */
  function handleNav(v: string) {
    const allowedViews: View[] = [
      "home",
      "directory",
      "about",
      "research",
      "specialists",
      "community",
      "signin",
      "signup",
    ];

    if (allowedViews.includes(v as View)) {
      setView(v as View);
    } else {
      setView("home");
    }

    // Scroll back to the top when navigating
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  /*
   * Disease selection
   */
  function handleDisease(id: string) {
    setSelectedDisease(id);
    setView("disease");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  /*
   * Return to directory from disease page
   */
  function handleBackToDirectory() {
    setSelectedDisease(null);
    setView("directory");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // Accessibility Text-Size Control State ('default' | 'larger' | 'largest')
  const [textSize, setTextSize] = useState<"default" | "larger" | "largest">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("rb_text_size_preference");
      if (saved === "larger" || saved === "largest" || saved === "default") {
        return saved;
      }
    }
    return "default";
  });

  useEffect(() => {
    const scaleMap = {
      default: "100%",
      larger: "112.5%",
      largest: "125%",
    };
    document.documentElement.style.fontSize = scaleMap[textSize];
    try {
      localStorage.setItem("rb_text_size_preference", textSize);
    } catch (e) {
      // Ignore storage errors
    }
  }, [textSize]);

  return (
    <MotionConfig reducedMotion="user">
      <div className="rb-app-shell relative isolate min-h-screen bg-[#F8F7F2] text-[#112250] font-body">
        {/* Global styles */}
        <style>{`
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        @keyframes ribbon {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }

        .animate-ribbon {
          animation: ribbon 28s linear infinite;
        }

        .animate-ribbon:hover {
          animation-play-state: paused;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(6px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.25s ease-out both;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }

          50% {
            transform: translateY(-10px);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        @keyframes wiggle {
          0%,
          100% {
            transform: rotate(-3deg);
          }

          50% {
            transform: rotate(3deg);
          }
        }

        .animate-wiggle {
          animation: wiggle 2s ease-in-out infinite;
        }

        @keyframes sparkle {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }

          50% {
            opacity: 0.5;
            transform: scale(1.2);
          }
        }

        .animate-sparkle {
          animation: sparkle 1.5s ease-in-out infinite;
        }

        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-5px);
          }
        }

        .animate-bounce {
          animation: bounce 1s ease-in-out infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }

          50% {
            transform: scale(1.05);
          }
        }

        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }

        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        ::selection {
          background: var(--secondary);
          color: var(--primary);
        }
          `}</style>

          <ZebraStripeBackground />

          {/* Navbar */}
          <Navbar
            onNav={handleNav}
            activeView={view}
            textSize={textSize}
            setTextSize={setTextSize}
          />

          {/* Main content */}
          <main className="rb-content-layer pb-20 md:pb-0">
            {view === "home" && (
              <HomePage
                onNav={handleNav}
                onDisease={handleDisease}
              />
            )}

            {view === "directory" && (
              <DirectoryPage onDisease={handleDisease} />
            )}

            {view === "about" && <AboutPage onNav={handleNav} />}

            {view === "research" && <ResearchPage />}

            {view === "specialists" && <SpecialistsPage />}

            {view === "community" && <CommunityPage />}

            {view === "signin" && <SignInPage onNav={handleNav} />}

            {view === "signup" && <SignUpPage onNav={handleNav} />}

            {view === "disease" && selectedDisease && (
              <DiseasePage
                diseaseId={selectedDisease}
                onBack={handleBackToDirectory}
              />
            )}
          </main>

          {/* AI Assistant */}
          <div className="relative z-20">
            <AIAssistant />
          </div>

          {/* Bottom navigation and footer */}
          <MobileNav
            onNav={handleNav}
            activeView={view}
          />

          <div className="relative z-10">
            <Footer onNav={handleNav} />
          </div>
        </div>
    </MotionConfig>
  );
}