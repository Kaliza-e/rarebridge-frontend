import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EdelweissFlower, ZebraMascot } from "../components/common/Visuals";
import SectionDivider from "../components/common/SectionDivider";
import {
  Heart,
  ShieldCheck,
  Users,
  Microscope,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  X,
  Target,
  Globe,
  Award,
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
      {/* ================= HERO BANNER ================= */}
      <section className="relative overflow-hidden bg-transparent pt-10 pb-14 lg:pt-14 lg:pb-16">
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-[#EDF6FC] border border-[#BCE0F5] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#112250] mb-4 shadow-xs">
                <Sparkles className="h-3.5 w-3.5 text-[#243B6B]" />
                <span>Our Purpose & Mission</span>
              </div>

              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black leading-[1.15] tracking-tight text-[#112250]">
                Connecting Knowledge, Families & Care
              </h1>

              <p className="font-sans mt-3 max-w-xl text-base sm:text-lg leading-relaxed text-[#3B507D] font-medium">
                RareBridge was created to replace intimidating medical jargon with plain-language guidance, direct specialist connections, and a warm community for parents and children.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  onClick={() => onNav?.("directory")}
                  className="inline-flex items-center gap-2.5 rounded-full bg-[#112250] px-7 py-3.5 text-sm font-bold text-white shadow-md hover:bg-[#1e3a7a] transition-all cursor-pointer"
                >
                  <span>Browse Conditions</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onNav?.("community")}
                  className="inline-flex items-center gap-2.5 rounded-full border-2 border-[#112250] bg-white px-7 py-3.5 text-sm font-bold text-[#112250] hover:bg-[#EDF6FC] transition-all cursor-pointer"
                >
                  <span>Join Support Community</span>
                </button>
              </div>
            </motion.div>

            {/* Right Card with Genuine Medical Photograph */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] rounded-[2.25rem] overflow-hidden border border-[#112250]/15 shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80"
                  alt="Compassionate healthcare specialist with stethoscope"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070D1E]/90 via-[#070D1E]/30 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <span className="rounded-full bg-[#112250] border border-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#BCE0F5]">
                    100% Free &amp; Open Access
                  </span>
                  <p className="mt-2 font-heading text-lg font-bold leading-snug">
                    Built for families first, driven by certified genetic medicine.
                  </p>
                </div>
              </div>

              {/* Floating Badge Widget */}
              <div className="absolute -bottom-4 -right-3 hidden sm:flex items-center gap-3 rounded-2xl border border-[#112250]/15 bg-white/95 backdrop-blur-md p-3.5 shadow-xl text-[#112250]">
                <div className="w-9 h-9 rounded-xl bg-[#EDF6FC] text-[#112250] flex items-center justify-center font-bold">
                  ✓
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider">Family-First Mission</p>
                  <p className="text-[11px] text-[#3B507D]">Zero Jargon Barriers</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-2 mb-2">
        <SectionDivider variant="scallop" color="blue" className="opacity-80" />
      </div>

      {/* ================= OUR CORE VALUES ================= */}
      <section className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#EDF6FC] border border-[#BCE0F5] px-4 py-1 text-xs font-bold text-[#112250] mb-3">
            <Sparkles className="h-3.5 w-3.5 text-[#243B6B]" />
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
              <Sparkles className="h-3.5 w-3.5 text-[#243B6B]" />
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
            <Sparkles className="h-3.5 w-3.5 text-[#243B6B]" />
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              variants={overlayBackdropVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={() => setSelectedMember(null)}
              className="fixed inset-0 bg-[#112250]/60 backdrop-blur-xs"
            />

            <motion.div
              variants={modalPanelVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="relative w-full max-w-lg rounded-3xl border border-[#BCE0F5] bg-white p-6 sm:p-8 shadow-2xl z-10 my-auto text-center"
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