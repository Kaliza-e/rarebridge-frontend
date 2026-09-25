import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EdelweissFlower, OrganicWavyLine, ZebraMascot } from "../components/common/Visuals";
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
    name: "Salma Ibrahim",
    role: "Chief Executive Officer",
    detail: "Rare Disease Advocate & Researcher",
    bio: "Pioneered plain-language genetic reporting standards and led community outreach initiatives for rare disease families across 40+ medical centers.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Idara",
    role: "Head of Research",
    detail: "Genetics Specialist · Former NIH Fellow",
    bio: "Specializes in metabolic disorder research and ORPHA code categorization. Passionate about empowering families with clear science.",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Kaliza Esther",
    role: "Technical Lead",
    detail: "Platform Architecture & AI Systems",
    bio: "Architected RareBridge's child-friendly AI Zebra assistant and secure patient data integration workflows.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Ishema Shoulamite",
    role: "Technical Team",
    detail: "Frontend & Clinical Data Systems",
    bio: "Focuses on high-accessibility user experience, text-resizing tools, and responsive family-first UI design.",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
  },
];

const MILESTONES = [
  {
    year: "2023",
    title: "Platform Conception",
    description: "Founded by rare disease parents and genetic researchers seeking to replace jargon with hope.",
  },
  {
    year: "2024",
    title: "ORPHA & Specialist Integration",
    description: "Mapped 7,000+ rare conditions and connected top university medical centers.",
  },
  {
    year: "2025",
    title: "Child-Friendly AI Launch",
    description: "Introduced Zebra AI Assistant to break down complex medical reports for families.",
  },
  {
    year: "2026",
    title: "Global Caregiver Expansion",
    description: "Reached 120,000+ families with peer support circles and clinical trial tracking.",
  },
];

export default function AboutPage({ onNav }: AboutPageProps) {
  const [selectedMember, setSelectedMember] = useState<typeof TEAM[0] | null>(null);

  return (
    <main className="relative min-h-screen bg-transparent pb-24 text-[#112250] selection:bg-[#E7E2CE] selection:text-[#112250] overflow-hidden">
      <OrganicWavyLine side="left" />
      <OrganicWavyLine side="right" />

      {/* ================= HERO BANNER ================= */}
      <section className="relative overflow-hidden bg-transparent pt-12 pb-16 lg:pt-16 lg:pb-20">
        {/* Background ambient blobs matching Homepage */}
        <div className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-[#E7E2CE]/70 blur-3xl" />
        <div className="pointer-events-none absolute top-1/3 -left-20 h-56 w-56 rounded-full bg-[#3B507D]/10 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7"
            >
              <span className="font-callout text-xs font-bold uppercase tracking-widest text-[#3B507D] mb-2 block">
                Our Purpose & Mission
              </span>

              <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight text-[#112250]">
                Connecting Knowledge, Families & Care
              </h1>

              <p className="font-sans mt-3 max-w-xl text-sm sm:text-base leading-relaxed text-[#3B507D] font-medium">
                RareBridge was created to replace intimidating medical jargon with plain-language guidance, direct specialist connections, and a warm community for parents and children.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  onClick={() => onNav?.("directory")}
                  className="inline-flex items-center gap-2.5 rounded-lg bg-[#112250] px-6 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-[#3B507D] transition-all"
                >
                  <span>Browse Conditions</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onNav?.("community")}
                  className="inline-flex items-center gap-2.5 rounded-lg border-2 border-[#112250] bg-transparent px-6 py-3.5 text-sm font-bold text-[#112250] hover:bg-[#112250]/10 transition-all"
                >
                  <span>Join Support Community</span>
                </button>
              </div>
            </motion.div>

            {/* Right Card Graphic */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-5"
            >
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative overflow-hidden rounded-xl border-2 border-[#E7E2CE] bg-white p-8 text-[#112250] shadow-xl">
                  <div className="flex items-center justify-between mb-6">
                    <div className="rounded-lg bg-[#F5F4F0] p-3 text-[#112250] shadow-sm">
                      <Target className="h-6 w-6 text-[#112250]" />
                    </div>
                    <EdelweissFlower size={36} />
                  </div>

                  <span className="inline-flex items-center gap-2 rounded-md bg-[#E7E2CE]/60 px-3.5 py-1 text-xs font-bold text-[#112250] mb-3">
                    <Sparkles className="h-3.5 w-3.5 text-[#112250]" />
                    100% Free & Open Access
                  </span>

                  <h3 className="font-heading font-black text-2xl text-[#112250]">
                    Built for Families First
                  </h3>
                  <p className="font-sans text-sm text-[#3B507D] mt-2 font-medium leading-relaxed">
                    Combining certified genetic research with empathetic peer networks so no caregiver walks alone.
                  </p>

                  <div className="mt-6 space-y-2.5 border-t border-[#E7E2CE] pt-4 text-xs font-bold text-[#112250]">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#3B507D]" />
                      <span>7,000+ Rare Diseases documented</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#3B507D]" />
                      <span>Zero medical jargon barriers</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <SectionDivider variant="wave" className="-mt-1 text-[#F5F4F0]" />

      {/* ================= OUR CORE VALUES ================= */}
      <section className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center max-w-xl mx-auto">
          <span className="font-callout text-xs font-bold uppercase tracking-widest text-[#3B507D]">
            Guiding Principles
          </span>
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
                className="rounded-xl border-2 border-[#E7E2CE] bg-white p-6 shadow-sm hover:border-[#112250] hover:shadow-[0_12px_35px_rgba(17,34,80,0.12)] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#F5F4F0] text-[#112250] mb-4 shadow-xs">
                    <IconComp className="h-6 w-6" />
                  </div>
                  <h3 className="font-heading text-lg font-black text-[#112250]">{val.title}</h3>
                  <p className="mt-2 text-xs text-[#3B507D] font-medium leading-relaxed">{val.desc}</p>
                </div>
                <div className="mt-6 pt-3 border-t border-[#F5F4F0] flex justify-end">
                  <EdelweissFlower size={20} />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* ================= TEAM SECTION ================= */}
      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        <div className="rounded-xl bg-white p-8 sm:p-12 border-2 border-[#E7E2CE] shadow-sm">
          <div className="mb-10 text-center max-w-xl mx-auto">
            <span className="font-callout text-xs font-bold uppercase tracking-widest text-[#3B507D]">
              Leadership & Care
            </span>
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
                whileHover={{ y: -6 }}
                onClick={() => setSelectedMember(member)}
                className="group cursor-pointer overflow-hidden rounded-xl border-2 border-[#E7E2CE] bg-[#F5F4F0] p-6 text-center hover:bg-white hover:border-[#112250] hover:shadow-[0_12px_35px_rgba(17,34,80,0.12)] transition-all flex flex-col justify-between"
              >
                <div>
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="mx-auto h-24 w-24 rounded-full object-cover border-4 border-white shadow-[0_0_15px_rgba(231,226,206,0.6)] mb-3 group-hover:scale-105 transition-transform"
                  />
                  <h3 className="font-heading font-black text-[#112250] text-lg">{member.name}</h3>
                  <p className="text-xs font-bold text-[#3B507D] mt-0.5">{member.role}</p>
                  <p className="mt-2 text-xs text-[#3B507D]/80 font-medium">{member.detail}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E7E2CE] text-xs font-bold text-[#112250] group-hover:text-[#3B507D] flex items-center justify-center gap-1">
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
          <span className="font-callout text-xs font-bold uppercase tracking-widest text-[#3B507D]">
            Impact & Journey
          </span>
          <h2 className="mt-1 font-heading text-3xl font-black text-[#112250]">
            Our Milestone Roadmap
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {MILESTONES.map((ms, idx) => (
            <div
              key={idx}
              className="relative rounded-xl border-2 border-[#E7E2CE] bg-white p-6 shadow-sm hover:border-[#112250] hover:shadow-[0_10px_30px_rgba(17,34,80,0.1)] transition-all"
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
              className="relative w-full max-w-lg rounded-xl border-2 border-[#E7E2CE] bg-white p-6 sm:p-8 shadow-2xl z-10 my-auto text-center"
            >
              <button
                onClick={() => setSelectedMember(null)}
                className="absolute top-5 right-5 rounded-lg bg-[#F5F4F0] p-2 text-[#112250] hover:bg-[#E7E2CE] transition-colors"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>

              <img
                src={selectedMember.avatar}
                alt={selectedMember.name}
                className="mx-auto h-28 w-28 rounded-full object-cover border-4 border-[#E7E2CE] shadow-md mb-4"
              />

              <h3 className="font-heading font-black text-2xl text-[#112250]">{selectedMember.name}</h3>
              <p className="text-sm font-bold text-[#3B507D]">{selectedMember.role}</p>
              <p className="text-xs font-semibold text-[#3B507D]/80 mt-0.5">{selectedMember.detail}</p>

              <p className="mt-4 text-xs leading-relaxed text-[#112250] bg-[#F5F4F0] p-4 rounded-lg border border-[#E7E2CE] font-medium text-left">
                {selectedMember.bio}
              </p>

              <button
                onClick={() => setSelectedMember(null)}
                className="mt-6 w-full rounded-lg bg-[#112250] px-6 py-3.5 text-sm font-bold text-white hover:bg-[#3B507D] transition-colors shadow-md"
              >
                Close Profile
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}