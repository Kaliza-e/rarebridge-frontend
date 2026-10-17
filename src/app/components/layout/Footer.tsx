import React, { useState } from "react";
import {
  ArrowUp,
  Instagram,
  Twitter,
  Linkedin,
  Facebook,
  CheckCircle2,
  MapPin,
} from "lucide-react";
import { DrippingScallopDivider } from "../common/DrippingScallopDivider";

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
    <footer className="relative isolate text-white font-body mt-24 sm:mt-28">
      {/* ================= FLOATING OVERLAPPING NEWSLETTER BANNER ================= */}
      <div className="relative z-20 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 -mb-16 sm:-mb-20">
        <div className="rounded-2xl sm:rounded-3xl bg-[#1E3B75] border border-white/20 px-6 py-8 sm:px-12 sm:py-10 shadow-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-6 backdrop-blur-md">
          <div className="max-w-md">
            <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Subscribe to our newsletter
            </h3>
            <p className="mt-1.5 text-xs sm:text-sm text-[#D6E0F5] font-medium leading-relaxed">
              Monthly plain-language trial summaries, specialist updates, and compassionate caregiver guides.
            </p>
          </div>

          <div className="w-full md:w-auto">
            {subscribed ? (
              <div className="flex items-center gap-2.5 rounded-full bg-white px-6 py-3 text-xs sm:text-sm font-bold text-[#112250] shadow-lg">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Subscribed! Thank you for staying connected.</span>
              </div>
            ) : (
              <form
                onSubmit={handleSubscribe}
                className="relative flex items-center w-full md:w-[400px] lg:w-[440px] rounded-full bg-white p-1.5 pl-5 shadow-lg"
              >
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Enter your email"
                  aria-label="Enter your email address"
                  className="w-full bg-transparent text-xs sm:text-sm text-[#112250] placeholder:text-[#3B507D]/60 outline-none font-medium pr-3"
                />
                <button
                  type="submit"
                  className="shrink-0 rounded-full bg-[#112250] px-6 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-[#3B507D] transition-colors shadow-sm cursor-pointer"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* ================= SCALLOPED DRIPPING TRANSITION ================= */}
      <div className="relative z-10 w-full overflow-hidden leading-none -mb-[1px]">
        <DrippingScallopDivider color="#0E1C42" flip={true} height={42} />
      </div>

      {/* ================= DARK FOOTER BODY ================= */}
      <div className="bg-[#0E1C42] pt-20 sm:pt-24 pb-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Main Grid: Brand + 4 Link Columns */}
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8 pb-12 border-b border-white/10">
            {/* Brand Column */}
            <div className="sm:col-span-2 lg:col-span-4 space-y-4">
              <a
                href="/"
                onClick={(e) => handleLinkClick(e, "home")}
                aria-label="RareBridge home"
                className="group inline-flex items-center gap-2 outline-none"
              >
                <img
                  src="/logo-transparent.png"
                  alt="RareBridge Logo"
                  className="h-14 sm:h-16 w-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </a>

              <p className="text-xs sm:text-sm leading-relaxed text-[#D6E0F5]/85 max-w-sm font-medium">
                RareBridge is an educational platform providing plain-language rare condition guidance, source-listed specialist records, and compassionate caregiver support.
              </p>

              <div className="flex items-center gap-2 text-xs text-[#E7E2CE] font-semibold pt-1">
                <MapPin size={14} className="text-[#E7E2CE]" aria-hidden="true" />
                <span>Rwanda, Africa</span>
              </div>
            </div>

            {/* Quick links */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="font-heading text-sm font-bold text-white tracking-wide">
                Quick links
              </h4>
              <ul className="space-y-2.5 text-xs text-[#D6E0F5]/80 font-medium">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={`#${link.view}`}
                      onClick={(e) => handleLinkClick(e, link.view)}
                      className="hover:text-white transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="font-heading text-sm font-bold text-white tracking-wide">
                Support
              </h4>
              <ul className="space-y-2.5 text-xs text-[#D6E0F5]/80 font-medium">
                {supportLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={`#${link.view}`}
                      onClick={(e) => handleLinkClick(e, link.view)}
                      className="hover:text-white transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Service */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="font-heading text-sm font-bold text-white tracking-wide">
                Service
              </h4>
              <ul className="space-y-2.5 text-xs text-[#D6E0F5]/80 font-medium">
                {serviceLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={`#${link.view}`}
                      onClick={(e) => handleLinkClick(e, link.view)}
                      className="hover:text-white transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* About us */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="font-heading text-sm font-bold text-white tracking-wide">
                About us
              </h4>
              <ul className="space-y-2.5 text-xs text-[#D6E0F5]/80 font-medium">
                {aboutLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={`#${link.view}`}
                      onClick={(e) => handleLinkClick(e, link.view)}
                      className="hover:text-white transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ================= BOTTOM BAR ================= */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#D6E0F5]/70 font-medium text-center sm:text-left">
              © {new Date().getFullYear()} RareBridge. All rights reserved.
            </p>

            <div className="flex items-center gap-3">
              {/* Social Capsule matching Image 2 */}
              <div className="flex items-center gap-3.5 rounded-full bg-white/10 border border-white/15 px-4 py-1.5 backdrop-blur-xs">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="text-[#D6E0F5] hover:text-white transition-colors"
                >
                  <Facebook size={14} />
                </a>
                <a
                  href="https://twitter.com/rarebridge"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  className="text-[#D6E0F5] hover:text-white transition-colors"
                >
                  <Twitter size={14} />
                </a>
                <a
                  href="https://www.instagram.com/rarebridge_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="text-[#D6E0F5] hover:text-white transition-colors"
                >
                  <Instagram size={14} />
                </a>
                <a
                  href="https://linkedin.com/company/rarebridge"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="text-[#D6E0F5] hover:text-white transition-colors"
                >
                  <Linkedin size={14} />
                </a>
              </div>

              {/* Scroll to Top */}
              <button
                type="button"
                onClick={scrollToTop}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E7E2CE] text-[#112250] hover:bg-white transition-colors cursor-pointer shadow-xs"
                aria-label="Scroll to top"
              >
                <ArrowUp size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}