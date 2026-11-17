import React, { useState } from "react";
import {
  BookOpen,
  Users,
  HeartPulse,
  Mail,
  Linkedin,
  Youtube,
  Twitter,
  ArrowRight,
  CheckCircle2,
  HeartHandshake,
} from "lucide-react";
import { BabyZebraBadge } from "../common/Visuals";

interface FooterProps {
  onNav?: (view: string) => void;
}

export default function Footer({ onNav }: FooterProps) {
  const [emailInput, setEmailInput] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setEmailInput("");
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const handleLinkClick = (e: React.MouseEvent, view?: string) => {
    if (view && onNav) {
      e.preventDefault();
      onNav(view);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="relative bg-transparent pt-6 sm:pt-10 pb-0 select-none font-body">
      {/* ================= FLOATING PRE-FOOTER 3-CARD BANNER ================= */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 relative z-20 -mb-10 sm:-mb-12">
        <div className="rounded-3xl bg-white border border-[#112250]/10 shadow-[0_14px_38px_rgba(7,13,30,0.12)] p-4 sm:p-6 backdrop-blur-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 divide-y md:divide-y-0 md:divide-x divide-[#112250]/10">
            {/* 1. Reliable Information */}
            <div
              onClick={() => onNav && onNav("directory")}
              className="flex items-center gap-3.5 p-2 sm:p-3 cursor-pointer group transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#E8F2FA] text-[#112250] flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-[#D6EAF5] transition-all">
                <BookOpen className="h-6 w-6 text-[#112250]" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm sm:text-base text-[#112250] group-hover:text-[#1e3a7a] transition-colors">
                  Reliable Information
                </h4>
                <p className="text-xs text-[#3B507D] font-normal">
                  Accurate and up-to-date resources
                </p>
              </div>
            </div>

            {/* 2. Supportive Community */}
            <div
              onClick={() => onNav && onNav("community")}
              className="flex items-center gap-3.5 p-2 sm:p-3 cursor-pointer group transition-all pt-3 md:pt-0"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#DDF4E6] text-emerald-800 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-[#C8EED4] transition-all">
                <Users className="h-6 w-6 text-emerald-700" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm sm:text-base text-[#112250] group-hover:text-[#1e3a7a] transition-colors">
                  Supportive Community
                </h4>
                <p className="text-xs text-[#3B507D] font-normal">
                  Connect with others who care
                </p>
              </div>
            </div>

            {/* 3. Better Outcomes */}
            <div
              onClick={() => onNav && onNav("research")}
              className="flex items-center gap-3.5 p-2 sm:p-3 cursor-pointer group transition-all pt-3 md:pt-0"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#EFEAF9] text-purple-800 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-[#E2D8F4] transition-all">
                <HeartPulse className="h-6 w-6 text-purple-700" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm sm:text-base text-[#112250] group-hover:text-[#1e3a7a] transition-colors">
                  Better Outcomes
                </h4>
                <p className="text-xs text-[#3B507D] font-normal">
                  Together for a healthier tomorrow
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= DARK FOOTER BODY ================= */}
      <div className="w-full bg-[#07132B] text-white pt-16 sm:pt-20 pb-8 sm:pb-12 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Main Footer Links Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-10 border-b border-white/10">
            {/* Column 1: Brand (4 cols on lg) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-white/10 border border-white/20 overflow-hidden shadow-xs shrink-0">
                  <img
                    src="/logo-icon.png"
                    alt="RareBridge Mascot Emblem"
                    className="h-full w-full object-contain p-0.5"
                  />
                </div>
                <span className="font-heading font-black text-xl text-white tracking-tight">
                  RareBridge
                </span>
              </div>

              <p className="text-xs sm:text-[13px] text-white/75 font-light leading-relaxed max-w-sm">
                Building bridges to better health for every rare disease journey. Plain-language guidance, certified clinical networks, and compassionate family support.
              </p>

              {/* Social Icon Buttons */}
              <div className="flex items-center gap-2.5 pt-2">
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Youtube className="h-4 w-4" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Twitter className="h-4 w-4" />
                </a>
                <a
                  href="mailto:support@rarebridge.org"
                  aria-label="Email"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Mail className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Column 2: Explore (2 cols on lg) */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="font-heading font-bold text-sm text-white tracking-wide">
                Explore
              </h4>
              <ul className="space-y-2 text-xs sm:text-[13px] text-white/75">
                <li>
                  <a
                    href="#directory"
                    onClick={(e) => handleLinkClick(e, "directory")}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Diseases
                  </a>
                </li>
                <li>
                  <a
                    href="#directory"
                    onClick={(e) => handleLinkClick(e, "directory")}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Resources
                  </a>
                </li>
                <li>
                  <a
                    href="#community"
                    onClick={(e) => handleLinkClick(e, "community")}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Community
                  </a>
                </li>
                <li>
                  <a
                    href="#research"
                    onClick={(e) => handleLinkClick(e, "research")}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    News & Updates
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Support (2 cols on lg) */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="font-heading font-bold text-sm text-white tracking-wide">
                Support
              </h4>
              <ul className="space-y-2 text-xs sm:text-[13px] text-white/75">
                <li>
                  <a
                    href="#about"
                    onClick={(e) => handleLinkClick(e, "about")}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#about"
                    onClick={(e) => handleLinkClick(e, "about")}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="#directory"
                    onClick={(e) => handleLinkClick(e, "directory")}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    FAQs
                  </a>
                </li>
                <li>
                  <a
                    href="#about"
                    onClick={(e) => handleLinkClick(e, "about")}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Report an Issue
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Stay Connected (4 cols on lg) */}
            <div className="lg:col-span-4 space-y-3">
              <h4 className="font-heading font-bold text-sm text-white tracking-wide">
                Stay Connected
              </h4>
              <p className="text-xs sm:text-[13px] text-white/75 font-light leading-relaxed">
                Get the latest updates, resources and support delivered to your inbox.
              </p>

              {subscribed ? (
                <div className="flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-2 text-xs font-bold text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Subscribed! Thank you for staying connected.</span>
                </div>
              ) : (
                <form
                  onSubmit={handleSubscribe}
                  className="relative flex items-center rounded-full bg-white/10 border border-white/20 p-1 pl-3.5 focus-within:bg-white focus-within:border-white transition-all group"
                >
                  <Mail className="h-4 w-4 text-white/60 group-focus-within:text-[#112250] shrink-0 mr-2 transition-colors" />
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Enter your email address"
                    aria-label="Enter your email address"
                    className="w-full bg-transparent text-xs sm:text-sm text-white group-focus-within:text-[#112250] placeholder:text-white/50 group-focus-within:placeholder:text-[#112250]/40 focus:outline-none font-medium"
                  />
                  <button
                    type="submit"
                    className="shrink-0 rounded-full bg-white text-[#112250] hover:bg-[#D6EAF5] group-focus-within:bg-[#112250] group-focus-within:text-white group-focus-within:hover:bg-[#1A3365] px-4 py-2 text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Bottom Copyright & Legal Links */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-white/55 gap-3">
            <p>© 2026 RareBridge. All rights reserved.</p>
            <div className="flex items-center gap-4 sm:gap-6">
              <a
                href="#about"
                onClick={(e) => handleLinkClick(e, "about")}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Privacy Policy
              </a>
              <span>·</span>
              <a
                href="#about"
                onClick={(e) => handleLinkClick(e, "about")}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Terms of Service
              </a>
              <span>·</span>
              <a
                href="#about"
                onClick={(e) => handleLinkClick(e, "about")}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Accessibility
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
