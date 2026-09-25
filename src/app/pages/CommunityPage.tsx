import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EdelweissFlower, OrganicWavyLine, ZebraMascot } from "../components/common/Visuals";
import SectionDivider from "../components/common/SectionDivider";
import {
  Users,
  Heart,
  MessageSquare,
  Shield,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  X,
  Send,
  ThumbsUp,
  MessageCircle,
} from "lucide-react";
import { fadeUpVariants, staggerContainerVariants, modalPanelVariants, overlayBackdropVariants } from "../utils/animations";

const COMMUNITY_FEATURES = [
  {
    icon: Users,
    title: "Parent Support Circles",
    description: "Encouragement and shared experiences from families navigating similar rare condition journeys.",
    tag: "Find connection",
    detail: "Weekly virtual meetups moderated by experienced rare family mentors. Safe, confidential, and empathetic.",
  },
  {
    icon: Heart,
    title: "Caregiver Wellness Guides",
    description: "Practical emotional and mental wellness guidance for supporting yourself while caring for your child.",
    tag: "Care for yourself",
    detail: "Self-care checklists, stress management strategies, and peer counseling designed specifically for rare disease parents.",
  },
  {
    icon: Shield,
    title: "Family Research Advocates",
    description: "Learn how families participate in clinical registries, gene therapy trials, and patient advocacy.",
    tag: "Drive progress",
    detail: "Step-by-step toolkits for sharing patient registry data, advocating at hospital appointments, and connecting with foundation chapters.",
  },
  {
    icon: MessageSquare,
    title: "Moderated Forums",
    description: "Ask questions, share advice, and connect in safe, family-friendly discussion spaces.",
    tag: "Share stories",
    detail: "Searchable discussion boards grouped by condition category, school accommodation tips, and specialist recommendations.",
  },
];

const MEMBER_STORIES = [
  {
    name: "Sarah & Liam",
    condition: "Amyloidosis Advocate",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
    quote: "Finding a community that truly understood our daily struggles changed everything for our family.",
    hearts: 48,
  },
  {
    name: "David M.",
    condition: "Parent & Caregiver",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    quote: "Connecting with other families gave us practical advice on specialist appointments and genetic testing.",
    hearts: 62,
  },
  {
    name: "Elena R.",
    condition: "Patient Advocate",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
    quote: "Rare diseases can feel isolating, but here we stand together to advocate for research and better care.",
    hearts: 75,
  },
];

const RECENT_DISCUSSIONS = [
  {
    topic: "Preparing a toddler for genetic blood draw tests without fear",
    author: "Maria K.",
    replies: 14,
    tag: "Caregiver Tips",
  },
  {
    topic: "Navigating school IEP accommodations for metabolic energy fatigue",
    author: "Robert T.",
    replies: 22,
    tag: "School & Advocacy",
  },
  {
    topic: "How we organized our child's 50-page medical binder for ER visits",
    author: "Jessica P.",
    replies: 39,
    tag: "Practical Guides",
  },
];

export default function CommunityPage() {
  const [selectedFeature, setSelectedFeature] = useState<typeof COMMUNITY_FEATURES[0] | null>(null);
  const [likes, setLikes] = useState<Record<number, number>>({ 0: 48, 1: 62, 2: 75 });
  const [hasLiked, setHasLiked] = useState<Record<number, boolean>>({});

  const toggleLike = (index: number) => {
    if (hasLiked[index]) {
      setLikes((prev) => ({ ...prev, [index]: prev[index] - 1 }));
      setHasLiked((prev) => ({ ...prev, [index]: false }));
    } else {
      setLikes((prev) => ({ ...prev, [index]: prev[index] + 1 }));
      setHasLiked((prev) => ({ ...prev, [index]: true }));
    }
  };

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
                A Safe Haven for Families
              </span>

              <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight text-[#112250]">
                You Are Never Alone On Your Rare Journey
              </h1>

              <p className="font-sans mt-3 max-w-xl text-sm sm:text-base leading-relaxed text-[#3B507D] font-medium">
                RareBridge connects parents, caregivers, and pediatric advocates to share wisdom, emotional support, and practical caregiving advice.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  onClick={() => setSelectedFeature(COMMUNITY_FEATURES[0])}
                  className="inline-flex items-center gap-2.5 rounded-lg bg-[#112250] px-6 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-[#3B507D] transition-all"
                >
                  <Users className="h-5 w-5 text-white" />
                  <span>Join Parent Support Circle</span>
                </button>
              </div>
            </motion.div>

            {/* Right Graphic Card */}
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
                      <Heart className="h-6 w-6 text-[#112250]" />
                    </div>
                    <EdelweissFlower size={36} />
                  </div>

                  <span className="inline-flex items-center gap-2 rounded-md bg-[#E7E2CE]/60 px-3.5 py-1 text-xs font-bold text-[#112250] mb-3">
                    <Sparkles className="h-3.5 w-3.5 text-[#112250]" />
                    120K+ Families Supported
                  </span>

                  <h3 className="font-heading font-black text-2xl text-[#112250]">
                    Compassionate Peer Support
                  </h3>
                  <p className="font-sans text-sm text-[#3B507D] mt-2 font-medium leading-relaxed">
                    Built by rare disease parents for rare disease parents. Safe, moderated, and focused on practical hope.
                  </p>

                  <div className="mt-6 space-y-2.5 border-t border-[#E7E2CE] pt-4 text-xs font-bold text-[#112250]">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#3B507D]" />
                      <span>Moderated support circles</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#3B507D]" />
                      <span>Caregiver mental health & wellness toolkits</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= WAYS TO CONNECT ================= */}
      <section className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center max-w-xl mx-auto">
          <span className="font-callout text-xs font-bold uppercase tracking-widest text-[#3B507D]">
            Community Resources
          </span>
          <h2 className="mt-1 text-3xl font-black text-[#112250] sm:text-4xl font-heading">
            Ways to Connect & Participate
          </h2>
        </div>

        <motion.div
          variants={staggerContainerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {COMMUNITY_FEATURES.map((feat, i) => {
            const IconComp = feat.icon;
            return (
              <motion.div
                key={i}
                variants={fadeUpVariants}
                whileHover={{ y: -6, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedFeature(feat)}
                className="group cursor-pointer rounded-xl border-2 border-[#E7E2CE] bg-white p-6 shadow-sm hover:border-[#112250] hover:shadow-[0_12px_35px_rgba(17,34,80,0.12)] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#F5F4F0] text-[#112250] mb-4 group-hover:bg-[#112250] group-hover:text-[#E7E2CE] transition-colors shadow-xs">
                    <IconComp className="h-6 w-6" />
                  </div>
                  <span className="rounded-md bg-[#F5F4F0] px-3 py-1 text-[10px] font-bold text-[#3B507D] uppercase tracking-wider border border-[#E7E2CE]">
                    {feat.tag}
                  </span>
                  <h3 className="font-heading font-black text-xl text-[#112250] mt-3 group-hover:text-[#3B507D]">
                    {feat.title}
                  </h3>
                  <p className="mt-2 text-xs text-[#3B507D] font-medium leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-[#F5F4F0] flex items-center justify-between text-xs font-bold text-[#112250]">
                  <span>Explore Circle</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* ================= MEMBER STORIES ================= */}
      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        <div className="rounded-xl bg-white p-8 sm:p-12 border-2 border-[#E7E2CE] shadow-sm">
          <div className="mb-10 text-center max-w-xl mx-auto">
            <span className="font-callout text-xs font-bold uppercase tracking-widest text-[#3B507D]">
              Real Experiences
            </span>
            <h2 className="mt-1 font-heading text-3xl font-black text-[#112250]">
              Family & Caregiver Voices
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {MEMBER_STORIES.map((story, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -4 }}
                className="rounded-xl border-2 border-[#E7E2CE] bg-[#F5F4F0] p-6 flex flex-col justify-between hover:bg-white hover:border-[#112250] hover:shadow-[0_10px_30px_rgba(17,34,80,0.1)] transition-all"
              >
                <p className="text-xs text-[#3B507D] font-medium leading-relaxed italic mb-4">
                  "{story.quote}"
                </p>

                <div className="flex items-center justify-between border-t border-[#E7E2CE] pt-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={story.avatar}
                      alt={story.name}
                      className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-xs"
                    />
                    <div>
                      <h4 className="font-black text-xs text-[#112250]">{story.name}</h4>
                      <p className="text-[10px] text-[#3B507D] font-bold">{story.condition}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleLike(i)}
                    className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-md border transition-all ${hasLiked[i]
                      ? "bg-[#D4183D] text-white border-[#D4183D] shadow-xs animate-pulse"
                      : "bg-white text-[#3B507D] border-[#E7E2CE] hover:border-[#112250]"
                      }`}
                  >
                    <Heart className="h-3.5 w-3.5 fill-current" />
                    <span>{likes[i]}</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= RECENT DISCUSSIONS FEED ================= */}
      <section className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
        <div className="rounded-xl bg-white p-8 sm:p-10 border-2 border-[#E7E2CE] shadow-sm">
          <div className="flex items-center justify-between mb-6 border-b border-[#F5F4F0] pb-4">
            <div>
              <span className="font-callout text-xs font-bold uppercase tracking-widest text-[#3B507D]">
                Active Conversations
              </span>
              <h3 className="font-heading font-black text-2xl text-[#112250]">
                Trending Caregiver Discussions
              </h3>
            </div>
            <button className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-[#F5F4F0] px-4 py-2 text-xs font-bold text-[#112250] hover:bg-[#E7E2CE] transition-colors shadow-xs">
              <MessageCircle className="h-4 w-4" />
              <span>Start New Topic</span>
            </button>
          </div>

          <div className="space-y-4">
            {RECENT_DISCUSSIONS.map((disc, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-4 rounded-lg bg-[#F5F4F0] p-4 border border-[#E7E2CE] hover:bg-white hover:border-[#112250] transition-all cursor-pointer shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-[#112250] p-2 text-[#E7E2CE] shrink-0">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="rounded-md bg-white px-2.5 py-0.5 text-[10px] font-bold text-[#3B507D] uppercase border border-[#E7E2CE]">
                      {disc.tag}
                    </span>
                    <h4 className="font-black text-sm text-[#112250] mt-1">{disc.topic}</h4>
                    <p className="text-xs text-[#3B507D]">Posted by {disc.author}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-[#3B507D] shrink-0">
                  <MessageCircle className="h-4 w-4" />
                  <span>{disc.replies} replies</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= MODAL FOR JOINING CIRCLE ================= */}
      <AnimatePresence>
        {selectedFeature && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              variants={overlayBackdropVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={() => setSelectedFeature(null)}
              className="fixed inset-0 bg-[#112250]/60 backdrop-blur-xs"
            />

            <motion.div
              variants={modalPanelVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="relative w-full max-w-lg rounded-xl border-2 border-[#E7E2CE] bg-white p-6 sm:p-8 shadow-2xl z-10 my-auto"
            >
              <button
                onClick={() => setSelectedFeature(null)}
                className="absolute top-5 right-5 rounded-lg bg-[#F5F4F0] p-2 text-[#112250] hover:bg-[#E7E2CE] transition-colors"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>

              <span className="rounded-md bg-[#E7E2CE]/60 px-3 py-1 text-xs font-bold text-[#112250]">
                {selectedFeature.tag}
              </span>

              <h3 className="font-heading font-black text-2xl text-[#112250] mt-2">
                {selectedFeature.title}
              </h3>

              <p className="mt-3 text-sm text-[#3B507D] leading-relaxed font-medium">
                {selectedFeature.detail}
              </p>

              <div className="mt-6 space-y-3 rounded-lg bg-[#F5F4F0] p-4 border border-[#E7E2CE]">
                <h4 className="text-xs font-black uppercase text-[#112250]">Express Interest to Join</h4>
                <input
                  type="email"
                  placeholder="Enter your email address..."
                  className="w-full rounded-lg border border-[#E7E2CE] bg-white px-3.5 py-2.5 text-xs text-[#112250] outline-none font-medium"
                />
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setSelectedFeature(null)}
                  className="flex-1 rounded-lg bg-[#112250] px-6 py-3.5 text-sm font-bold text-white hover:bg-[#3B507D] transition-colors shadow-md"
                >
                  Join Circle
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}