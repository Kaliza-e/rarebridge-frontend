import React, { useEffect, useState } from "react";
import {
  X,
  Menu,
  Search,
  FlaskConical,
  Stethoscope,
  Users,
  Info,
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

export default function Navbar({ onNav, activeView }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [activeView]);

  const handleNavigation = (view: string) => {
    onNav(view);
    setMenuOpen(false);
  };

  const links = NAV_LINKS.filter((l) => l !== "Home");

  return (
    <nav className="sticky top-0 z-50 bg-ivory/95 backdrop-blur-sm">

      {/* ── Desktop layout ── */}
      <div className="relative mx-auto hidden h-24 max-w-[1440px] items-center justify-center px-6 md:flex">

        {/* Logo — prominent full size */}
        <button
          onClick={() => handleNavigation("home")}
          className="absolute left-5 top-1/2 shrink-0 -translate-y-1/2 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-transform duration-200 hover:scale-[1.03]"
          aria-label="Go to RareBridge home"
        >
          <img
            src="/logo-transparent.png"
            alt="RareBridge"
            className="h-20 md:h-24 lg:h-28 w-auto object-contain drop-shadow-md"
          />
        </button>

        {/* Pill — centered against the full header, independent of the logo */}
        <div className="flex max-w-full justify-center">
          <div className="flex items-center gap-0.5 rounded-2xl border border-[#E4E8F2] bg-white px-2 py-1.5 shadow-md">

            {/* Nav links */}
            {links.map((link) => {
              const view = NAV_MAP[link] ?? "home";
              const isActive = activeView === view;
              const Icon = NAV_ICONS[link];

              return (
                <button
                  key={link}
                  onClick={() => handleNavigation(view)}
                  className={`
                    relative flex items-center gap-2 px-4 py-2.5
                    text-[15px] font-semibold transition-all duration-200 rounded-xl
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-primary
                    ${isActive
                      ? "text-primary"
                      : "text-accent hover:text-primary"
                    }
                  `}
                  aria-current={isActive ? "page" : undefined}
                >
                  {Icon && <Icon className="w-[17px] h-[17px] shrink-0" />}
                  <span>{link}</span>
                  {isActive && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                </button>
              );
            })}



            {/* Auth buttons */}
            <button
              onClick={() => handleNavigation("")}
              className="px-4 py-2.5 text-[15px] font-semibold text-primary hover:bg-[#F4F6FB] transition-all duration-200 rounded-xl whitespace-nowrap"
            >
              Sign In
            </button>
            <button
              onClick={() => handleNavigation("")}
              className="mx-1.5 px-5 py-2.5 rounded-xl bg-primary text-ivory text-[15px] font-bold hover:bg-accent transition-all duration-200 shadow-sm hover:shadow-md whitespace-nowrap"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile bar ── */}
      <div className="flex md:hidden items-center justify-between mx-4 my-2 bg-white border border-[#E4E8F2] rounded-2xl shadow-sm px-4 py-3">
        <button
          onClick={() => handleNavigation("home")}
          className="shrink-0 focus:outline-none rounded-xl"
          aria-label="Go to RareBridge home"
        >
          <img
            src="/logo-transparent.png"
            alt="RareBridge"
            className="h-14 sm:h-16 w-auto object-contain"
          />
        </button>
        <button
          className="p-2.5 rounded-xl text-accent hover:bg-[#F4F6FB] transition-colors"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* ── Mobile dropdown ── */}
      {menuOpen && (
        <div className="md:hidden mt-1 mx-4 bg-white border border-[#E4E8F2] rounded-2xl shadow-md px-3 py-3 space-y-1">
          {NAV_LINKS.map((link) => {
            const view = NAV_MAP[link] ?? "home";
            const isActive = activeView === view;
            const Icon = NAV_ICONS[link];

            return (
              <button
                key={link}
                onClick={() => handleNavigation(view)}
                className={`
                  w-full text-left flex items-center gap-3
                  px-4 py-3 rounded-xl text-[15px] font-semibold transition-all duration-150
                  ${isActive
                    ? "text-primary font-bold"
                    : "text-accent hover:text-primary"
                  }
                `}
                aria-current={isActive ? "page" : undefined}
              >
                {Icon && <Icon className="w-5 h-5 shrink-0" />}
                {link}
                {isActive && <span className="ml-auto w-2 h-2 rounded-full bg-primary" />}
              </button>
            );
          })}

          <div className="flex gap-3 pt-3 mt-1 border-t border-[#E4E8F2]">
            <button
              onClick={() => handleNavigation("signin")}
              className="flex-1 py-3 rounded-xl border border-[#E4E8F2] text-[15px] font-semibold text-primary hover:bg-[#F4F6FB] transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => handleNavigation("signup")}
              className="flex-1 py-3 rounded-xl bg-primary text-ivory text-[15px] font-bold hover:bg-accent transition-colors shadow-sm"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
