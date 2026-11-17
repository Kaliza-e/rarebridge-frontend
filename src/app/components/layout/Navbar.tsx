import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Menu,
  Search,
  BookOpen,
  FlaskConical,
  Stethoscope,
  Users,
  Info,
  Home,
  ChevronRight,
  HeartPulse,
} from "lucide-react";

import { NAV_LINKS } from "../../data";

const NAV_MAP: Record<string, string> = {
  Home: "home",
  About: "about",
  "Explore Diseases": "directory",
  Research: "research",
  Specialists: "specialists",
  Community: "community",
};

const NAV_ICONS: Record<string, React.ElementType> = {
  Home,
  About: Info,
  "Explore Diseases": Search,
  Research: FlaskConical,
  Specialists: Stethoscope,
  Community: Users,
};

interface NavbarProps {
  onNav: (view: string) => void;
  activeView: string;
}

export default function Navbar({
  onNav,
  activeView,
}: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [activeView]);

  useEffect(() => {
    if (!menuOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  const handleNavigation = (view: string) => {
    onNav(view);
    setMenuOpen(false);
  };

  const renderBrand = (mobile = false) => (
    <button
      type="button"
      onClick={() => handleNavigation("home")}
      aria-label="RareBridge Home"
      className="group flex shrink-0 items-center gap-2 sm:gap-2.5 text-left outline-none transition-transform duration-200 hover:scale-[1.02] cursor-pointer select-none"
    >
      <div className="relative flex items-center justify-center h-8 w-8 sm:h-9 sm:w-9 rounded-xl overflow-hidden shrink-0 border border-[#112250]/15 bg-[#E8F2FA] shadow-xs group-hover:border-[#112250]/30 transition-colors">
        <img
          src="/logo-icon.png"
          alt="RareBridge Mascot Emblem"
          className="h-full w-full object-contain p-0.5"
        />
      </div>
    </button>
  );

  const renderDesktopLink = (link: string) => {
    const view = NAV_MAP[link] ?? "home";
    const isActive = activeView === view;
    const displayText = link === "Explore Diseases" ? "Diseases" : link;
    return (
      <button
        key={link}
        type="button"
        onClick={() => handleNavigation(view)}
        aria-current={isActive ? "page" : undefined}
        className={`relative px-3 sm:px-3.5 py-1.5 rounded-xl text-xs sm:text-[13px] font-heading transition-all duration-150 whitespace-nowrap cursor-pointer select-none active:scale-95 ${
          isActive
            ? "text-[#112250] font-bold bg-[#112250]/10"
            : "text-[#3B507D] font-medium hover:text-[#112250] hover:bg-[#112250]/5"
        }`}
      >
        <span>{displayText}</span>
      </button>
    );
  };

  const renderMobileLink = (link: string) => {
    const view = NAV_MAP[link] ?? "home";
    const isActive = activeView === view;
    const Icon = NAV_ICONS[link];

    return (
      <button
        key={link}
        type="button"
        onClick={() => handleNavigation(view)}
        aria-current={isActive ? "page" : undefined}
        className={`flex min-h-11 w-full items-center gap-3 rounded-2xl px-4 py-2.5 text-left transition-all duration-150 outline-none cursor-pointer font-heading ${
          isActive
            ? "font-bold text-[#112250]"
            : "font-semibold text-[#3B507D] hover:text-[#112250]"
        }`}
      >
        {Icon && (
          <Icon
            size={18}
            strokeWidth={isActive ? 2.2 : 1.8}
            className={isActive ? "text-[#112250]" : "text-[#3B507D]"}
            aria-hidden="true"
          />
        )}

        <span className="flex-1 text-xs sm:text-sm">{link}</span>

        {isActive ? (
          <span
            className="h-2 w-2 rounded-full bg-[#112250]"
            aria-hidden="true"
          />
        ) : (
          <ChevronRight
            size={16}
            className="text-[#667591]"
            aria-hidden="true"
          />
        )}
      </button>
    );
  };

  return (
    <header className="fixed top-3 sm:top-5 left-0 right-0 z-50 w-full pointer-events-none font-heading flex justify-center px-3 sm:px-6">
      <div className="flex flex-col items-center w-full max-w-lg lg:w-auto lg:max-w-none">
        {/* Floating Bar - spacious, well-aligned, refined modern corners */}
        <div className="pointer-events-auto relative flex items-center justify-between lg:justify-center gap-2.5 sm:gap-4 lg:gap-5 h-13 sm:h-14 px-3 sm:px-5 lg:px-6 rounded-2xl bg-white/95 border border-[#112250]/15 shadow-[0_8px_32px_rgba(17,34,80,0.12)] backdrop-blur-md transition-all duration-300 w-full lg:w-auto overflow-hidden">
          {/* Subtle zebra stripe background pattern (minimal whisper texture) */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.015] rounded-2xl"
            style={{
              backgroundImage: 'url("/zebra-stripe-pattern.svg")',
              backgroundSize: "240px 240px",
              backgroundRepeat: "repeat",
            }}
            aria-hidden="true"
          />

          {/* Brand & Desktop Links */}
          <div className="relative z-10 flex items-center gap-2 sm:gap-3 shrink-0">
            {renderBrand()}
            <div className="hidden lg:block h-5 w-[1px] bg-[#112250]/15 mx-1 shrink-0" aria-hidden="true" />
            <nav
              aria-label="Primary navigation"
              className="hidden lg:flex items-center gap-1.5 sm:gap-2"
            >
              {NAV_LINKS.map(renderDesktopLink)}
            </nav>
          </div>

          {/* Friendly Divider before Action Button */}
          <div className="relative z-10 hidden lg:block h-5 w-[1px] bg-[#112250]/15 mx-1 shrink-0" aria-hidden="true" />

          {/* Right Actions: Disease Guide button & Mobile Menu */}
          <div className="relative z-10 flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Quick Disease Guide button */}
            <button
              type="button"
              onClick={() => handleNavigation("directory")}
              aria-label="Explore Disease Guide"
              title="Explore Disease Guide"
              className="flex items-center gap-1.5 sm:gap-2 rounded-xl bg-[#112250] hover:bg-[#1C376F] text-white px-2.5 sm:px-4 py-2 min-h-[38px] sm:min-h-[40px] text-xs font-heading font-bold shadow-xs hover:shadow transition-all duration-150 active:scale-95 cursor-pointer shrink-0"
            >
              <BookOpen size={13} className="text-[#BCE0F5] shrink-0" />
              <span className="hidden sm:inline">Disease Guide</span>
              <span className="sm:hidden text-[11px]">Guide</span>
            </button>

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              aria-controls="rarebridge-mobile-menu"
              className={`grid h-9 w-9 place-items-center rounded-full transition-colors lg:hidden cursor-pointer ${
                menuOpen
                  ? "bg-[#112250] text-white"
                  : "text-[#112250]/80 hover:text-[#112250] hover:bg-[#112250]/5"
              }`}
            >
              {menuOpen ? (
                <X size={18} strokeWidth={2.5} />
              ) : (
                <Menu size={18} strokeWidth={2.5} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Panel */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              id="rarebridge-mobile-menu"
              initial={{ opacity: 0, scale: 0.97, y: -6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -6 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-auto relative mt-2 w-full rounded-2xl border border-[#112250]/15 bg-white/95 p-3.5 shadow-2xl backdrop-blur-xl lg:hidden overflow-hidden"
            >
              {/* Subtle zebra background */}
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.015]"
                style={{
                  backgroundImage: 'url("/zebra-stripe-pattern.svg")',
                  backgroundSize: "240px 240px",
                  backgroundRepeat: "repeat",
                }}
                aria-hidden="true"
              />

              <div className="relative z-10 space-y-1">
                {NAV_LINKS.map(renderMobileLink)}
              </div>

              <div className="relative z-10 mt-3 pt-3 border-t border-[#112250]/10">
                <button
                  type="button"
                  onClick={() => handleNavigation("directory")}
                  className="flex min-h-10 w-full items-center justify-center gap-2 rounded-2xl bg-[#112250] px-4 text-xs font-bold text-white transition-colors hover:bg-[#1D376B] cursor-pointer font-heading"
                >
                  <Search size={15} aria-hidden="true" />
                  <span>Explore Diseases</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}