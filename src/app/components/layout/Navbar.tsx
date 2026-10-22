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
      aria-label="Go to home"
      className="group flex shrink-0 items-center text-left outline-none transition-transform duration-200 hover:scale-105 pr-1 cursor-pointer"
    >
      <img
        src="/logo-transparent.png"
        alt="RareBridge Logo"
        className={`block object-contain ${mobile ? "h-8 w-auto sm:h-9" : "h-8 sm:h-9 w-auto"}`}
      />
    </button>
  );

  const renderDesktopLink = (link: string) => {
    const view = NAV_MAP[link] ?? "home";
    const isActive = activeView === view;
    const Icon = NAV_ICONS[link];

    return (
      <button
        key={link}
        type="button"
        onClick={() => handleNavigation(view)}
        aria-current={isActive ? "page" : undefined}
        className={`group relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-[13px] font-heading font-medium transition-all duration-200 whitespace-nowrap cursor-pointer select-none active:scale-95 ${
          isActive
            ? "bg-[#E3F2FD] text-[#112250] font-bold shadow-xs border border-[#BCE0F5]"
            : "text-[#3B507D] hover:text-[#112250] hover:bg-[#112250]/5"
        }`}
      >
        {Icon && (
          <Icon
            size={14}
            strokeWidth={isActive ? 2.3 : 1.9}
            className={`shrink-0 transition-colors ${
              isActive ? "text-[#112250]" : "text-[#556D9B] group-hover:text-[#112250]"
            }`}
            aria-hidden="true"
          />
        )}
        <span>{link}</span>
        {isActive && (
          <span
            className="h-1.5 w-1.5 rounded-full bg-[#112250]"
            aria-hidden="true"
          />
        )}
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
            ? "bg-[#112250] font-bold text-white shadow-xs"
            : "font-semibold text-[#3B507D] hover:bg-[#112250]/[0.05] hover:text-[#112250]"
        }`}
      >
        {Icon && (
          <Icon
            size={18}
            strokeWidth={isActive ? 2.2 : 1.8}
            className={isActive ? "text-white" : "text-[#3B507D]"}
            aria-hidden="true"
          />
        )}

        <span className="flex-1 text-xs sm:text-sm">{link}</span>

        {isActive ? (
          <span
            className="h-2 w-2 rounded-full bg-white"
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
        {/* Centered Floating Capsule Bar - snugly sized, perfectly centered */}
        <div className="pointer-events-auto relative flex items-center justify-between lg:justify-center gap-2 sm:gap-3 lg:gap-3.5 h-13 sm:h-14 px-3.5 sm:px-4.5 rounded-full bg-white/95 border-2 border-[#112250]/15 shadow-[0_8px_32px_rgba(17,34,80,0.12)] backdrop-blur-md transition-all duration-300 w-full lg:w-auto overflow-hidden">
          {/* Subtle zebra stripe background pattern ("not make it too much") */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.05] rounded-full"
            style={{
              backgroundImage: 'url("/zebra-stripe-pattern.svg")',
              backgroundSize: "240px 240px",
              backgroundRepeat: "repeat",
            }}
            aria-hidden="true"
          />

          {/* Brand & Desktop Links */}
          <div className="relative z-10 flex items-center gap-2 sm:gap-2.5 shrink-0">
            {renderBrand()}
            <div className="hidden lg:block h-5 w-[1px] bg-[#112250]/15 mx-0.5 shrink-0" aria-hidden="true" />
            <nav
              aria-label="Primary navigation"
              className="hidden lg:flex items-center gap-1 sm:gap-1.5"
            >
              {NAV_LINKS.map(renderDesktopLink)}
            </nav>
          </div>

          {/* Friendly Divider before Action Button */}
          <div className="relative z-10 hidden lg:block h-5 w-[1px] bg-[#112250]/15 mx-0.5 shrink-0" aria-hidden="true" />

          {/* Right Actions: Friendly Disease Guide button & Mobile Menu */}
          <div className="relative z-10 flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Quick Disease Guide button */}
            <button
              type="button"
              onClick={() => handleNavigation("directory")}
              aria-label="Explore Disease Guide"
              title="Explore Disease Guide"
              className="flex items-center gap-1.5 rounded-full bg-[#112250] hover:bg-[#1C376F] text-white px-3 sm:px-3.5 py-1.5 text-xs font-heading font-semibold shadow-xs hover:shadow transition-all duration-150 active:scale-95 cursor-pointer shrink-0"
            >
              <BookOpen size={14} className="text-[#BCE0F5] shrink-0" />
              <span className="hidden sm:inline">Disease Guide</span>
              <span className="sm:hidden">Guide</span>
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
              className="pointer-events-auto relative mt-2 w-full rounded-3xl border-2 border-[#112250]/15 bg-white/95 p-3.5 shadow-2xl backdrop-blur-xl lg:hidden overflow-hidden"
            >
              {/* Subtle zebra background */}
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.04]"
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