import React, { useState } from "react";
import {
  ArrowUp,
  Instagram,
  Twitter,
  Linkedin,
  Facebook,
  CheckCircle2,
  MapPin,
  HeartHandshake,
  ArrowRight,
} from "lucide-react";

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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const quickLinks = [
    { name: "Disease Directory", view: "directory" },
    { name: "Specialist Directory", view: "specialists" },
    { name: "Research & Clinical Trials", view: "research" },
    { name: "Caregiver Community", view: "community" },
  ];

  const supportLinks = [
    { name: "Plain-Language Integrity", view: "about" },
    { name: "Medical Advisory Board", view: "about" },
    { name: "Source Transparency", view: "about" },
    { name: "Caregiver Wellness", view: "community" },
  ];

  const serviceLinks = [
    { name: "Genetics Education", view: "directory" },
    { name: "Subtypes & Symptoms", view: "directory" },
    { name: "Approved Therapies", view: "research" },
    { name: "Frequently Asked Questions", view: "directory" },
  ];

  const aboutLinks = [
    { name: "Our Mission & Story", view: "about" },
    { name: "Leadership & Team", view: "about" },
    { name: "Family Stories", view: "community" },
    { name: "Contact Us", view: "about" },
  ];

  return (
    <footer className="relative bg-transparent pt-4 sm:pt-6 pb-0 select-none overflow-hidden font-body">
      {/* ================= TOP DISCLAIMER & NOTICE STRIP ================= */}
      <div className="mx-auto max-w-7xl mb-4 sm:mb-5 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 rounded-2xl bg-white/95 border border-[#112250]/15 px-4 py-2.5 sm:py-3 text-[#112250] shadow-xs backdrop-blur-md">
          <div className="flex min-w-0 flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#112250]/10 border border-[#112250]/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#112250] shrink-0">
              <HeartHandshake size={13} className="text-[#112250]" />
              Educational Platform Note
            </span>
            <p className="text-xs sm:text-[13px] text-[#112250]/80 leading-relaxed font-normal">
              RareBridge is an educational platform providing plain-language rare condition guidance. Always consult certified medical geneticists and licensed physicians for clinical diagnosis.
            </p>
          </div>
          <a
            href="#about"
            onClick={(e) => handleLinkClick(e, "about")}
            className="text-xs sm:text-[13px] font-semibold text-[#112250] hover:text-[#1e3a7a] transition-colors underline underline-offset-4 shrink-0 inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>Medical Guidelines</span>
            <ArrowRight size={13} />
          </a>
        </div>
      </div>

      {/* ================= REFINED ARCHITECTURAL SECTION DIVIDER ================= */}
      <div className="w-full relative z-10">
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#3B507D]/40 to-transparent" />
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#BCE0F5]/30 to-transparent" />
      </div>

      {/* ================= DARK FOOTER BODY ================= */}
      <div className="w-full bg-[#070D1E] text-white pt-6 sm:pt-8 pb-10 sm:pb-14 relative">
        {/* Subtle Aurora Ambient Lights */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="absolute -top-20 left-1/4 w-[32rem] h-[32rem] rounded-full bg-[#112250]/40 blur-[130px]" />
          <div className="absolute -bottom-16 right-1/4 w-[28rem] h-[28rem] rounded-full bg-[#3B507D]/20 blur-[120px]" />
        </div>

        <div className="mx-auto max-w-7xl relative z-10 px-4 sm:px-6 lg:px-8">
          {/* Newsletter Box (Streamlined & Reduced Height) */}
          <div className="mb-8 sm:mb-10">
            <div className="rounded-2xl bg-gradient-to-r from-[#112250] via-[#1A3365] to-[#112250] border border-white/15 py-4 sm:py-5 px-5 sm:px-7 md:px-8 shadow-[0_10px_30px_rgba(7,13,30,0.3)] relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-44 h-44 rounded-full bg-[#3B507D]/25 blur-3xl pointer-events-none" />
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
                <div className="max-w-lg space-y-1">
                  <h3 className="font-heading text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
                    Subscribe to our newsletter
                  </h3>
                  <p className="text-xs sm:text-[13px] text-white/75 font-light leading-relaxed">
                    Monthly plain-language trial summaries, specialist updates, and compassionate caregiver guides from RareBridge.
                  </p>
                </div>

                <div className="w-full lg:max-w-md">
                  {subscribed ? (
                    <div className="flex items-center gap-2.5 rounded-full bg-white px-4 py-2 text-xs sm:text-sm font-bold text-[#112250] shadow-md">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Subscribed! Thank you for staying connected.</span>
                    </div>
                  ) : (
                    <form
                      onSubmit={handleSubscribe}
                      className="relative flex items-center rounded-full bg-white p-1 shadow-md transition-all focus-within:ring-2 focus-within:ring-[#BCE0F5]"
                    >
                      <input
                        type="email"
                        required
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="Enter your email address"
                        aria-label="Enter your email address"
                        className="w-full bg-transparent px-3.5 sm:px-4 py-1.5 text-xs sm:text-sm text-[#112250] placeholder:text-[#112250]/45 focus:outline-none font-medium"
                      />
                      <button
                        type="submit"
                        className="shrink-0 rounded-full bg-[#112250] hover:bg-[#1e3a7a] text-white px-4 sm:px-5 py-1.5 text-xs font-semibold transition-all duration-200 shadow-sm active:scale-95 cursor-pointer"
                      >
                        Subscribe
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Footer Links Grid: 4 cols brand + 8 cols links */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-8 border-b border-white/10">
            {/* Brand Column */}
            <div className="lg:col-span-4 space-y-3.5">
              <div className="flex items-center gap-2.5">
                <a
                  href="/"
                  onClick={(e) => handleLinkClick(e, "home")}
                  aria-label="RareBridge Home"
                  className="flex items-center shrink-0 hover:opacity-90 transition-opacity"
                >
                  <img
                    src="/logo-transparent.png"
                    alt="RareBridge Logo"
                    className="h-9 sm:h-10 w-auto object-contain brightness-0 invert drop-shadow-[0_2px_8px_rgba(255,255,255,0.2)]"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </a>
                <span className="rounded-full border border-[#BCE0F5]/30 bg-[#112250]/40 px-2.5 py-0.5 text-[10px] font-mono font-semibold text-[#BCE0F5]">
                  Open Care
                </span>
              </div>

              <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-light max-w-sm">
                RareBridge is an educational platform providing plain-language rare condition guidance, source-listed specialist records, and compassionate caregiver support.
              </p>

              <div className="flex items-center gap-2 text-xs text-[#E7E2CE] font-semibold pt-1">
                <MapPin size={13} className="text-[#E7E2CE]" aria-hidden="true" />
                <span>Rwanda, Africa</span>
              </div>
            </div>

            {/* Links Columns (8 cols) */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
              {/* Quick links */}
              <div className="space-y-3">
                <h4 className="text-xs sm:text-sm font-semibold text-white tracking-wider uppercase">
                  Quick links
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-white/65">
                  {quickLinks.map((link) => (
                    <li key={link.name}>
                      <a
                        href={`#${link.view}`}
                        onClick={(e) => handleLinkClick(e, link.view)}
                        className="hover:text-white transition-colors duration-150 block"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support */}
              <div className="space-y-3">
                <h4 className="text-xs sm:text-sm font-semibold text-white tracking-wider uppercase">
                  Support
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-white/65">
                  {supportLinks.map((link) => (
                    <li key={link.name}>
                      <a
                        href={`#${link.view}`}
                        onClick={(e) => handleLinkClick(e, link.view)}
                        className="hover:text-white transition-colors duration-150 block"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Service */}
              <div className="space-y-3">
                <h4 className="text-xs sm:text-sm font-semibold text-white tracking-wider uppercase">
                  Service
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-white/65">
                  {serviceLinks.map((link) => (
                    <li key={link.name}>
                      <a
                        href={`#${link.view}`}
                        onClick={(e) => handleLinkClick(e, link.view)}
                        className="hover:text-white transition-colors duration-150 block"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* About us */}
              <div className="space-y-3">
                <h4 className="text-xs sm:text-sm font-semibold text-white tracking-wider uppercase">
                  About us
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-white/65">
                  {aboutLinks.map((link) => (
                    <li key={link.name}>
                      <a
                        href={`#${link.view}`}
                        onClick={(e) => handleLinkClick(e, link.view)}
                        className="hover:text-white transition-colors duration-150 block"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* ================= BOTTOM BAR ================= */}
          <div className="mt-8 sm:mt-12 pt-6 sm:pt-7 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-white/50">
            <p>© {new Date().getFullYear()} RareBridge. All rights reserved.</p>

            <div className="flex items-center gap-3">
              {/* Social Capsule */}
              <div className="flex items-center gap-2.5 rounded-full bg-white/[0.08] border border-white/15 px-3.5 py-1.5 backdrop-blur-md">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="text-white/65 hover:text-white transition-colors duration-150 p-1"
                >
                  <Facebook size={14} />
                </a>
                <a
                  href="https://twitter.com/rarebridge"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  className="text-white/65 hover:text-white transition-colors duration-150 p-1"
                >
                  <Twitter size={14} />
                </a>
                <a
                  href="https://www.instagram.com/rarebridge_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="text-white/65 hover:text-white transition-colors duration-150 p-1"
                >
                  <Instagram size={14} />
                </a>
                <a
                  href="https://linkedin.com/company/rarebridge"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="text-white/65 hover:text-white transition-colors duration-150 p-1"
                >
                  <Linkedin size={14} />
                </a>
              </div>

              {/* Scroll to Top */}
              <button
                type="button"
                onClick={scrollToTop}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/[0.08] text-white/70 hover:bg-white hover:text-[#112250] transition cursor-pointer shrink-0"
                aria-label="Scroll to top"
              >
                <ArrowUp size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}