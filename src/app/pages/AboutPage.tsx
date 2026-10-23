import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EdelweissFlower, ZebraMascot, FourPointStar } from "../components/common/Visuals";
import {
  Heart,
  ShieldCheck,
  Users,
  Microscope,
  ArrowRight,
  CheckCircle2,
  X,
  Target,
  Globe,
  Award,
  Eye,
} from "lucide-react";
import { fadeUpVariants, staggerContainerVariants, modalPanelVariants, overlayBackdropVariants } from "../utils/animations";

interface AboutPageProps {
  onNav?: (view: string) => void;
}

const VALUES = [
  {
    icon: Heart,
    title: "Family-Centered Care",
    desc: "Clear, compassionate answers created for children, parents, and caregivers navigating rare conditions.",
  },
  {
    icon: ShieldCheck,
    title: "Medical Integrity",
    desc: "Vetted research and clinical information sourced directly from medical geneticists and scientific registries.",
  },
  {
    icon: Users,
    title: "Supportive Community",
    desc: "Connecting families with peer mentors, local support circles, and specialized advocacy groups.",
  },
  {
    icon: Microscope,
    title: "Hope & Research Progress",
    desc: "Real-time updates on active enzyme therapies, gene editing, and clinical trial opportunities.",
  },
];

const TEAM = [
  {
    name: "Esther Kaliza",
    role: "Technical Lead & Software Developer",
    detail: "Platform Architecture & AI Systems",
    bio: "Architected RareBridge's child-friendly AI Zebra assistant and secure patient data integration workflows.",
    avatar: "/team/esther.png",
  },
  {
    name: "Salma Ibrahim",
    role: "CEO Research & Content Lead",
    detail: "Rare Disease Research & Content Strategy",
    bio: "Pioneered plain-language genetic reporting standards and leads research and content strategy for rare disease families across 40+ medical centers.",
    avatar: "/team/salma.png",
  },
  {
    name: "Ishema Shoulamite",
    role: "Software Developer",
    detail: "Frontend & Clinical Data Systems",
    bio: "Focuses on high-accessibility user experience, text-resizing tools, and responsive family-first UI design.",
    avatar: "/team/shoula.png",
  },
  {
    name: "Idara",
    role: "Social Media & Communications Lead",
    detail: "Community Outreach & Communications",
    bio: "Drives community engagement, social media initiatives, and empowering rare disease families with clear science and accessible support.",
    avatar: "/team/idara.png",
  },
];

const MILESTONES = [
  {
    year: "July 2026",
    title: "RareBridge Begins",
    description: "Started by a team passionate about making rare disease information easier for families, caregivers, and patients to understand and access.",
  },
  {
    year: "2026",
    title: "Building the Disease Knowledge Base",
    description: "Began developing a structured database of rare diseases, with the long-term goal of covering 7,000+ conditions and making trusted information easier to explore.",
  },
  {
    year: "2026",
    title: "Family-Centered Platform",
    description: "Developed tools for families and caregivers to explore disease information, research, specialists, and frequently asked questions in simpler language.",
  },
  {
    year: "2026 →",
    title: "Growing the RareBridge Community",
    description: "Continuing to expand the platform, improve its resources, and work toward supporting families affected by rare diseases around the world.",
  },
];

export default function AboutPage({ onNav }: AboutPageProps) {
  const [selectedMember, setSelectedMember] = useState<typeof TEAM[0] | null>(null);

  return (
    <div className="relative min-h-screen bg-transparent pb-24 text-[#112250] selection:bg-[#DDF0FA] selection:text-[#112250] overflow-hidden">
      {/* ================= HERO SECTION WITH BACKGROUND IMAGE ================= */}
      <section className="relative overflow-hidden mx-4 sm:mx-6 lg:mx-8 mt-2 mb-6 rounded-[2rem] sm:rounded-[2.75rem] border border-[#112250]/15 shadow-xl bg-[#070D1E]">
        {/* Background Photo & Dark Gradient Overlays */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1600&q=80"
            alt="Caring family and community walking together with support"
            className="h-full w-full object-cover object-center"
          />
          {/* Multi-layer gradient overlays to guarantee WCAG AAA text legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#070D1E]/85 via-[#0D1B3E]/80 to-[#070D1E]/92 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#070D1E]/40 to-[#070D1E]/80 pointer-events-none" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20 text-center">
          {/* Centered Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-4 py-1.5 text-xs font-semibold text-white shadow-xs mb-5"
          >
            <FourPointStar size={11} className="text-[#7DD3FC] shrink-0" />
            <span className="uppercase tracking-wider text-[11px] font-bold">About RareBridge</span>
          </motion.div>

          {/* Centered Large Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-black leading-[1.18] tracking-tight text-white max-w-4xl mx-auto drop-shadow-sm"
          >
            A space where families, children &amp; researchers find clarity in rare disease care.
          </motion.h1>

          {/* Centered Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="font-sans mt-4 max-w-3xl mx-auto text-base sm:text-lg leading-relaxed text-[#D6E0F5] font-normal"
          >
            RareBridge is an educational and supportive non-profit platform that empowers families navigating rare conditions with plain-language genetic guidance, certified specialist connections, and active clinical trial discoveries. We believe no family should walk the rare journey alone.
          </motion.p>
        </div>
      </section>

      {/* ================= OUR MISSION & OUR VISION (TWO BALANCED CARDS) ================= */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mt-2 sm:mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Mission Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-[2rem] border-2 border-[#112250]/15 bg-white p-7 sm:p-10 shadow-xs hover:border-[#112250]/30 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="h-12 w-12 rounded-2xl bg-[#112250] text-white flex items-center justify-center mb-6 shadow-xs">
                <Eye className="h-6 w-6" />
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-black text-[#112250] tracking-tight">
                Our Mission
              </h2>
              <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#3B507D] font-normal">
                We endeavor to empower families, patients, and children navigating rare conditions by providing an accessible, jargon-free platform where they can understand genetics, explore clinical research, connect with specialists, and find hope freely.
              </p>
            </div>
          </motion.div>

          {/* Vision Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-[2rem] border-2 border-[#112250]/15 bg-white p-7 sm:p-10 shadow-xs hover:border-[#112250]/30 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="h-12 w-12 rounded-2xl bg-[#112250] text-white flex items-center justify-center mb-6 shadow-xs">
                <Eye className="h-6 w-6" />
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-black text-[#112250] tracking-tight">
                Our Vision
              </h2>
              <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#3B507D] font-normal">
                We strive to create opportunities for families and caregivers to make sense of complex medicine, find peer advocacy circles, and ensure no rare diagnosis goes unrepresented, unanswered, or forgotten.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= SIGNATURE DARK NAVY CARD: WHY RAREBRIDGE EXISTS ================= */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
        <div className="rounded-[2.25rem] sm:rounded-[2.75rem] bg-[#112250] text-white p-8 sm:p-12 lg:p-14 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-center">
            <div className="lg:col-span-7 space-y-4 sm:space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-white/90 backdrop-blur-md">
                <Heart className="h-3.5 w-3.5 text-[#BCE0F5]" />
                <span>Open Access For All Families</span>
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                Why RareBridge Exists
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-[#D6E0F5] font-light">
                Research and clinical guidance should not be reserved for elite institutions or buried behind impenetrable medical jargon. RareBridge exists to create an accessible space where families and young patients can ask questions, find verified specialists, track breakthrough therapies, and feel supported from day one.
              </p>
              <p className="text-sm sm:text-base leading-relaxed text-[#D6E0F5]/85 font-light">
                With over 7,000 documented rare conditions affecting 300 million people worldwide—75% of whom are children—we bridge the gap between complex genetic science and daily caregiver reality.
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  onClick={() => onNav?.("directory")}
                  className="inline-flex items-center gap-2 rounded-full bg-white text-[#112250] px-6 py-3 text-xs sm:text-sm font-bold shadow-md hover:bg-[#EDF6FC] transition cursor-pointer"
                >
                  <span>Browse Directory</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onNav?.("community")}
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 text-white px-6 py-3 text-xs sm:text-sm font-bold hover:bg-white hover:text-[#112250] transition cursor-pointer"
                >
                  <span>Join Caregiver Circle</span>
                </button>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="rounded-2xl sm:rounded-3xl overflow-hidden border border-white/15 shadow-xl aspect-[4/3] bg-white/5">
                <img
                  src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80"
                  alt="Compassionate genetic specialists collaborating on patient care"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= OUR CORE VALUES ================= */}
      <section className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#EDF6FC] border border-[#BCE0F5] px-4 py-1 text-xs font-bold text-[#112250] mb-3">
            <FourPointStar size={11} className="text-[#243B6B] shrink-0" />
            <span>Guiding Principles</span>
          </div>
          <h2 className="mt-1 font-heading text-3xl font-black text-[#112250] sm:text-4xl">
            What RareBridge Stands For
          </h2>
          <p className="font-sans text-sm text-[#3B507D] font-medium mt-2">
            A family-first approach to rare disease education and compassionate support.
          </p>
        </div>

        <motion.div
          variants={staggerContainerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {VALUES.map((val, i) => {
            const IconComp = val.icon;
            return (
              <motion.div
                key={i}
                variants={fadeUpVariants}
                whileHover={{ y: -6, scale: 1.01 }}
                className="rounded-2xl border border-[#BCE0F5] bg-white p-6 shadow-xs hover:border-[#112250] hover:shadow-[0_8px_24px_rgba(17,34,80,0.06)] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EDF6FC] text-[#112250] mb-4">
                    <IconComp className="h-6 w-6" />
                  </div>
                  <h3 className="font-heading text-lg font-black text-[#112250]">{val.title}</h3>
                  <p className="mt-2 text-xs text-[#3B507D] font-medium leading-relaxed">{val.desc}</p>
                </div>
                <div className="mt-6 pt-3 border-t border-[#EDF6FC] flex justify-end">
                  <EdelweissFlower size={20} />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* ================= TEAM SECTION ================= */}
      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white p-8 sm:p-12 border border-[#BCE0F5] shadow-xs">
          <div className="mb-10 text-center max-w-xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#EDF6FC] border border-[#BCE0F5] px-4 py-1 text-xs font-bold text-[#112250] mb-3">
              <FourPointStar size={11} className="text-[#243B6B] shrink-0" />
              <span>Leadership & Care</span>
            </div>
            <h2 className="mt-1 font-heading text-3xl font-black text-[#112250]">
              Our Dedicated Team
            </h2>
            <p className="font-sans text-sm text-[#3B507D] font-medium mt-1">
              Researchers, clinicians, and software engineers passionate about supporting rare families.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((member, i) => (
              <motion.div
                key={i}
                role="button"
                tabIndex={0}
                aria-label={`View full biography for ${member.name}, ${member.role}`}
                whileHover={{ y: -6 }}
                onClick={() => setSelectedMember(member)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedMember(member);
                  }
                }}
                className="group cursor-pointer overflow-hidden rounded-2xl border border-[#BCE0F5] bg-[#FAF9F5] p-6 text-center hover:bg-white hover:border-[#112250] hover:shadow-[0_8px_24px_rgba(17,34,80,0.06)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#112250] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="mx-auto h-28 w-28 rounded-full overflow-hidden border-4 border-white shadow-sm mb-3 group-hover:scale-105 transition-transform bg-white">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="h-full w-full object-cover object-top"
                    />
                  </div>
                  <h3 className="font-heading font-black text-[#112250] text-lg">{member.name}</h3>
                  <p className="text-xs font-bold text-[#3B507D] mt-0.5">{member.role}</p>
                  <p className="mt-2 text-xs text-[#3B507D]/80 font-medium">{member.detail}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#EDF6FC] text-xs font-bold text-[#112250] group-hover:text-[#3B507D] flex items-center justify-center gap-1">
                  <span>View Bio</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PLATFORM ROADMAP MILESTONES ================= */}
      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        <div className="mb-10 text-center max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#EDF6FC] border border-[#BCE0F5] px-4 py-1 text-xs font-bold text-[#112250] mb-3">
            <FourPointStar size={11} className="text-[#243B6B] shrink-0" />
            <span>Impact & Journey</span>
          </div>
          <h2 className="mt-1 font-heading text-3xl font-black text-[#112250]">
            Our Milestone Roadmap
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {MILESTONES.map((ms, idx) => (
            <div
              key={idx}
              className="relative rounded-2xl border border-[#BCE0F5] bg-white p-6 shadow-xs hover:border-[#112250] transition-all"
            >
              <span className="font-heading font-black text-3xl text-[#112250] opacity-30 block mb-2">
                {ms.year}
              </span>
              <h3 className="font-heading font-black text-lg text-[#112250]">{ms.title}</h3>
              <p className="mt-2 text-xs text-[#3B507D] font-medium leading-relaxed">
                {ms.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= MEMBER BIO MODAL ================= */}
      <AnimatePresence>
        {selectedMember && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 md:p-8 overflow-y-auto">
            <motion.div
              variants={overlayBackdropVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={() => setSelectedMember(null)}
              className="fixed inset-0 bg-[#112250]/65 backdrop-blur-sm"
            />

            <motion.div
              variants={modalPanelVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="relative w-full max-w-xl sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2rem] sm:rounded-[2.5rem] border-2 border-[#112250]/15 bg-white p-6 sm:p-8 shadow-2xl z-10 my-auto text-center"
            >
              <button
                onClick={() => setSelectedMember(null)}
                className="absolute top-5 right-5 rounded-full bg-[#EDF6FC] p-2 text-[#112250] hover:bg-[#DDF0FA] transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mx-auto h-32 w-32 rounded-full overflow-hidden border-4 border-[#BCE0F5] shadow-md mb-4 bg-white">
                <img
                  src={selectedMember.avatar}
                  alt={selectedMember.name}
                  className="h-full w-full object-cover object-top"
                />
              </div>

              <h3 className="font-heading font-black text-2xl text-[#112250]">{selectedMember.name}</h3>
              <p className="text-sm font-bold text-[#3B507D]">{selectedMember.role}</p>
              <p className="text-xs font-semibold text-[#3B507D]/80 mt-0.5">{selectedMember.detail}</p>

              <p className="mt-4 text-xs leading-relaxed text-[#112250] bg-[#EDF6FC]/60 p-4 rounded-2xl border border-[#BCE0F5] font-medium text-left">
                {selectedMember.bio}
              </p>

              <button
                onClick={() => setSelectedMember(null)}
                className="mt-6 w-full rounded-full bg-[#112250] px-6 py-3.5 text-sm font-bold text-white hover:bg-[#1e3a7a] transition-colors shadow-md cursor-pointer"
              >
                Close Profile
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}