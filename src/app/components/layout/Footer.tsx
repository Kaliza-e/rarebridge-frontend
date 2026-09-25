import React, { useState } from "react";
import {
  ArrowUpRight,
  Heart,
  ShieldCheck,
  Sparkles,
  Mail,
  CheckCircle2,
  BookOpen,
  Microscope,
  Stethoscope,
  Users,
  ArrowUp,
} from "lucide-react";
import { ZebraMascot, ZebraGridDoodle } from "../common/Visuals";
import { SectionDivider } from "../common/SectionDivider";

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

  const footerColumns = [
    {
      title: "Explore Library",
      links: [
        { name: "Disease Directory", view: "directory" },
        { name: "Specialist Directory", view: "specialists" },
        { name: "Research & Clinical Trials", view: "research" },
        { name: "Caregiver Community", view: "community" },
      ],
    },
    {
      title: "Medical & Mission",
      links: [
        { name: "Our Mission & Story", view: "about" },
        { name: "Plain-Language Integrity", view: "about" },
        { name: "Genetics Education", view: "directory" },
        { name: "Frequently Asked Questions", view: "directory" },
      ],
    },
  ];

  return (
    <footer className="relative isolate overflow-hidden bg-[#112250] text-white pt-6 font-body">
      {/* Decorative Zebra Grid Pattern in Footer Background */}
      <ZebraGridDoodle opacity={0.12} gridColorLavender="#8B5CF6" gridColorBeige="#E7E2CE" gridColorNavy="#FFFFFF" />

      {/* Top Organic Sweeping Divider */}
      <SectionDivider variant="wave" className="-mt-7 mb-6 text-[#112250]" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 pb-8 pt-4 sm:px-8 lg:px-12">
        {/* ================= FOOTER NEWSLETTER BANNER ================= */}
        <div className="relative overflow-hidden rounded-xl border-2 border-white/20 bg-white/10 p-6 sm:p-8 mb-10 backdrop-blur-md shadow-lg">
          <div className="grid items-center gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-md bg-white/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#E7E2CE] font-heading border border-white/20">
                <Mail className="w-3.5 h-3.5 text-[#E7E2CE]" /> Stay Connected
              </div>
              <h3 className="font-heading text-xl font-black text-white sm:text-2xl">
                Clinical Updates & Research Digest
              </h3>
              <p className="font-body mt-1.5 text-xs leading-relaxed text-[#D6E0F5] max-w-md font-medium">
                Monthly plain-language trial summaries, specialist updates, and compassionate caregiver wellness guides.
              </p>
            </div>

            <div>
              {subscribed ? (
                <div className="flex items-center gap-2 rounded-lg bg-[#E7E2CE] p-3.5 text-xs font-bold text-[#112250] font-heading shadow-md">
                  <CheckCircle2 className="w-5 h-5 text-[#112250] shrink-0" />
                  <span>Subscribed! Thank you for staying connected with RareBridge.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2.5">
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Enter your email address..."
                    className="font-body flex-1 rounded-lg border border-white/25 bg-white/15 px-4 py-3 text-xs text-white outline-none font-medium placeholder:text-[#A0ADC6] focus:border-[#E7E2CE] transition-colors"
                  />
                  <button
                    type="submit"
                    className="font-heading shrink-0 rounded-lg bg-[#E7E2CE] px-6 py-3 text-xs font-black text-[#112250] hover:bg-white transition-all shadow-md cursor-pointer"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* ================= MAIN NAVIGATION & BRAND GRID ================= */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-10">
          {/* Brand & Mission Column */}
          <div className="lg:col-span-6 space-y-4">
            <a
              href="/"
              onClick={(e) => handleLinkClick(e, "home")}
              aria-label="RareBridge home"
              className="group inline-flex items-center gap-3 rounded-lg outline-none"
            >
              <img
                src="/logo-transparent.png"
                alt="RareBridge Logo"
                className="h-20 sm:h-24 w-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </a>

            <p className="font-body max-w-md text-xs leading-relaxed text-[#D6E0F5] font-medium">
              RareBridge connects families, researchers, and pediatric specialists with plain-language medical guidance, verified doctor directories, and supportive peer networks.
            </p>

            {/* Care Message & Medical Integrity Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="inline-flex items-center gap-2.5 rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 backdrop-blur-xs">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#E7E2CE]/30 text-[#E7E2CE]">
                  <Heart size={14} />
                </div>
                <div>
                  <p className="font-heading text-xs font-extrabold text-white">Made with Care</p>
                  <p className="font-body text-[11px] text-[#D6E0F5]/80 font-medium">For rare families everywhere</p>
                </div>
              </div>

              <div className="inline-flex items-center gap-2.5 rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 backdrop-blur-xs">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#E7E2CE]/30 text-[#E7E2CE]">
                  <ShieldCheck size={14} />
                </div>
                <div>
                  <p className="font-heading text-xs font-extrabold text-white">Medical Integrity</p>
                  <p className="font-body text-[11px] text-[#D6E0F5]/80 font-medium">Plain-language verified</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="grid grid-cols-2 gap-8 lg:col-span-6">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <h4 className="font-heading mb-4 text-xs font-black uppercase tracking-wider text-[#E7E2CE]">
                  {column.title}
                </h4>
                <ul className="space-y-3 font-body text-xs font-medium">
                  {column.links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={`#${link.view}`}
                        onClick={(e) => handleLinkClick(e, link.view)}
                        className="group inline-flex items-center gap-1.5 text-[#D6E0F5] transition-all duration-200 hover:text-white"
                      >
                        <span>{link.name}</span>
                        <ArrowUpRight
                          size={13}
                          className="opacity-60 transition-opacity duration-200 group-hover:opacity-100 text-[#E7E2CE]"
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 h-px bg-white/20" />

        {/* ================= COPYRIGHT & FOOTER BAR ================= */}
        <div className="flex flex-col items-center justify-between gap-4 pt-2 sm:flex-row">
          <p className="font-body text-center text-xs text-[#D6E0F5]/80 sm:text-left font-medium">
            © {new Date().getFullYear()} RareBridge. Educational platform for rare condition guidance & caregiver support.
          </p>
          <div className="flex items-center gap-3">
            <span className="font-heading text-xs font-bold text-[#E7E2CE]">
              Every rare journey matters
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 shadow-xs">
              <ZebraMascot size={20} />
            </div>
            <button
              onClick={scrollToTop}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E7E2CE] text-[#112250] hover:bg-white transition-colors cursor-pointer shadow-xs"
              aria-label="Scroll to top"
            >
              <ArrowUp size={16} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}