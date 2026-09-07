import React, { useEffect, useState } from "react";

import Navbar from "./components/layout/Navbar";
import MobileNav from "./components/layout/MobileNav";
import Footer from "./components/layout/Footer";

import HomePage from "./pages/HomePage";
import DirectoryPage from "./pages/DirectoryPage";
import DiseasePage from "./pages/DiseasePage";
import AboutPage from "./pages/AboutPage";
import ResearchPage from "./pages/ResearchPage";
import SpecialistsPage from "./pages/SpecialistsPage";
import CommunityPage from "./pages/CommunityPage";

import {
  BackgroundParticles,
  usePopSound,
  useChimeSound,
  useSparkleSound,
  AIAssistant,
} from "./components/common/Visuals";

import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";

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

  /*
   * Sound hooks
   */
  const playPopSound = usePopSound();
  const playChimeSound = useChimeSound();
  const playSparkleSound = useSparkleSound();

  /*
   * Global sound effects
   */
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

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-ivory"
      style={{
        fontFamily: "'Comic Neue', cursive, sans-serif",
      }}
    >
      {/* Global styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&family=Nunito:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap');

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

          cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><ellipse cx="16" cy="20" rx="10" ry="7" fill="%234A5568"/><ellipse cx="16" cy="12" rx="7" ry="9" fill="white" stroke="%234A5568" stroke-width="1"/><circle cx="13" cy="10" r="2" fill="%232D3748"/><circle cx="19" cy="10" r="2" fill="%232D3748"/><circle cx="13.5" cy="9.5" r="0.8" fill="white"/><circle cx="19.5" cy="9.5" r="0.8" fill="white"/></svg>') 16 16, auto;
        }

        a,
        button,
        .cursor-pointer {
          cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path d="M16 8 Q20 4 24 8 Q28 12 24 16 Q20 20 16 16 Q12 20 8 16 Q4 12 8 8 Q12 4 16 8" fill="white" stroke="%234A5568" stroke-width="1.5"/><circle cx="16" cy="12" r="4" fill="%23ECC94B" opacity="0.9"/><circle cx="16" cy="12" r="2" fill="%23D69E2E"/></svg>') 16 16, pointer;
        }

        .flower-cursor {
          cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path d="M16 8 Q20 4 24 8 Q28 12 24 16 Q20 20 16 16 Q12 20 8 16 Q4 12 8 8 Q12 4 16 8" fill="white" stroke="%234A5568" stroke-width="1.5"/><circle cx="16" cy="12" r="4" fill="%23ECC94B" opacity="0.9"/><circle cx="16" cy="12" r="2" fill="%23D69E2E"/></svg>') 16 16, pointer;
        }

        ::selection {
          background: var(--secondary);
          color: var(--primary);
        }
      `}</style>

      {/* Decorative background */}
      <BackgroundParticles />

      {/* Navbar */}
      {view !== "signin" && view !== "signup" && (
        <Navbar onNav={handleNav} activeView={view} />
      )}

      {/* Main content */}
      <main className="pb-20 md:pb-0">
        {view === "home" && (
          <HomePage
            onNav={handleNav}
            onDisease={handleDisease}
          />
        )}

        {view === "signin" && (
          <SignInPage onNav={handleNav} />
        )}

        {view === "signup" && (
          <SignUpPage onNav={handleNav} />
        )}

        {view === "directory" && (
          <DirectoryPage onDisease={handleDisease} />
        )}

        {view === "about" && <AboutPage />}

        {view === "research" && <ResearchPage />}

        {view === "specialists" && <SpecialistsPage />}

        {view === "community" && <CommunityPage />}

        {view === "disease" && selectedDisease && (
          <DiseasePage
            diseaseId={selectedDisease}
            onBack={handleBackToDirectory}
          />
        )}
      </main>

      {/* AI Assistant */}
      <AIAssistant />

      {/* Bottom navigation and footer */}
      {view !== "signin" && view !== "signup" && (
        <>
          <MobileNav
            onNav={handleNav}
            activeView={view}
          />

          <Footer />
        </>
      )}
    </div>
  );
}