import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Menu,
  Search,
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
  textSize?: "default" | "larger" | "largest";
  setTextSize?: (size: "default" | "larger" | "largest") => void;
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
      className="group flex shrink-0 items-center text-left outline-none transition-transform duration-200 hover:scale-105 py-1.5"
    >
      <img
        src="/logo-transparent.png"
        alt="RareBridge Logo"
        className={`block object-contain ${mobile ? "h-12 w-auto" : "h-16 sm:h-20 w-auto max-h-20 drop-shadow-xs"}`}
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
        className={`group relative inline-flex min-h-12 shrink-0 items-center justify-center gap-2 px-3.5 py-2 text-sm font-semibold transition-all duration-200 outline-none ${
          isActive
            ? "text-[#112250] font-black bg-transparent"
            : "text-[#3B507D] bg-transparent hover:text-[#112250]"
        }`}
      >
        {Icon && (
          <Icon
            size={16}
            strokeWidth={isActive ? 2.3 : 1.8}
            className={
              isActive
                ? "shrink-0 text-[#112250]"
                : "shrink-0 text-[#3B507D] group-hover:text-[#112250]"
            }
            aria-hidden="true"
          />
        )}

        <span className="whitespace-nowrap">{link}</span>

        {/* Bottom Line Underline Indicator for Active Tab */}
        {isActive && (
          <motion.div
            layoutId="navbar-active-underline"
            className="absolute bottom-0 left-1 right-1 h-[3px] rounded-full bg-[#112250]"
            transition={{ type: "spring", stiffness: 400, damping: 32 }}
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
        className={`flex min-h-12 w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-[#112250] ${
          isActive
            ? "bg-[#112250] font-bold text-white"
            : "font-semibold text-[#3B507D] hover:bg-[#112250]/[0.05] hover:text-[#112250]"
        }`}
      >
        {Icon && (
          <Icon
            size={19}
            strokeWidth={isActive ? 2.2 : 1.8}
            className={isActive ? "text-white" : "text-[#3B507D]"}
            aria-hidden="true"
          />
        )}

        <span className="flex-1 text-sm">{link}</span>

        {isActive ? (
          <span
            className="h-2 w-2 rounded-full bg-white"
            aria-hidden="true"
          />
        ) : (
          <ChevronRight
            size={17}
            className="text-[#667591]"
            aria-hidden="true"
          />
        )}
      </button>
    );
  };

  return (
    <header
      className={`sticky top-0 z-50 font-heading transition-[background-color,box-shadow] duration-200 ${
        scrolled
          ? "bg-[#F8F7F2]/90 shadow-[0_4px_20px_rgba(17,34,80,0.04)] backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        {/* Desktop navbar */}
        <div className="hidden min-h-[76px] items-center justify-between gap-6 lg:flex">
          {renderBrand()}

          <nav
            aria-label="Main navigation"
            className="flex min-w-0 items-center justify-center gap-1"
          >
            {NAV_LINKS.map(renderDesktopLink)}
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => handleNavigation("signin")}
              className="flex min-h-10 shrink-0 items-center justify-center rounded-xl bg-[#112250] px-4 text-xs font-bold text-white transition-colors hover:bg-[#3B507D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B507D] shadow-sm"
            >
              Sign In
            </button>
          </div>
        </div>

        {/* Mobile navbar */}
        <div className="flex min-h-[68px] items-center justify-between gap-3 lg:hidden">
          {renderBrand(true)}

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              aria-controls="rarebridge-mobile-menu"
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B507D] ${
                menuOpen
                  ? "border-[#112250] bg-[#112250] text-white"
                  : "border-[#112250]/10 bg-white text-[#112250] hover:bg-[#F5F4F0]"
              }`}
            >
              {menuOpen ? (
                <X size={20} strokeWidth={2.2} />
              ) : (
                <Menu size={20} strokeWidth={2.2} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              id="rarebridge-mobile-menu"
              initial={{ opacity: 0, height: 0, y: -6 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -6 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="overflow-hidden lg:hidden"
            >
              <nav
                aria-label="Mobile navigation"
                className="border-t border-[#112250]/10 py-3"
              >
                <div className="space-y-1">
                  {NAV_LINKS.map(renderMobileLink)}
                </div>

                <div className="mt-3 border-t border-[#112250]/10 pt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleNavigation("directory")}
                    className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#112250] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1D376B]"
                  >
                    <Search size={17} aria-hidden="true" />
                    <span>Explore Diseases</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNavigation("signin")}
                    className="flex min-h-12 items-center justify-center rounded-xl border border-[#112250]/20 bg-white px-4 py-3 text-sm font-bold text-[#112250] transition-colors hover:bg-[#F5F4F0]"
                  >
                    Sign In
                  </button>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}