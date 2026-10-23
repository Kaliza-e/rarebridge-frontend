import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EdelweissFlower, FourPointStar } from "../components/common/Visuals";
import {
  Users,
  Heart,
  MessageSquare,
  Shield,
  ArrowRight,
  CheckCircle2,
  X,
  Send,
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

  // Discussions state
  const [discussions, setDiscussions] = useState(RECENT_DISCUSSIONS);
  const [isCreatingTopic, setIsCreatingTopic] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [newTopicAuthor, setNewTopicAuthor] = useState("");
  const [newTopicTag, setNewTopicTag] = useState("Caregiver Tips");
  const [selectedDiscussion, setSelectedDiscussion] = useState<typeof RECENT_DISCUSSIONS[0] | null>(null);
  const [replyText, setReplyText] = useState("");
  const [joinedSuccess, setJoinedSuccess] = useState(false);
  const [joinEmail, setJoinEmail] = useState("");

  const toggleLike = (index: number) => {
    if (hasLiked[index]) {
      setLikes((prev) => ({ ...prev, [index]: prev[index] - 1 }));
      setHasLiked((prev) => ({ ...prev, [index]: false }));
    } else {
      setLikes((prev) => ({ ...prev, [index]: prev[index] + 1 }));
      setHasLiked((prev) => ({ ...prev, [index]: true }));
    }
  };

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicTitle.trim()) return;
    const author = newTopicAuthor.trim() || "Caregiver Community Member";
    const newEntry = {
      topic: newTopicTitle.trim(),
      author,
      replies: 0,
      tag: newTopicTag,
    };
    setDiscussions((prev) => [newEntry, ...prev]);
    setNewTopicTitle("");
    setNewTopicAuthor("");
    setIsCreatingTopic(false);
  };

  const handleAddReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedDiscussion) return;
    setDiscussions((prev) =>
      prev.map((d) => (d.topic === selectedDiscussion.topic ? { ...d, replies: d.replies + 1 } : d))
    );
    setSelectedDiscussion((prev) => (prev ? { ...prev, replies: prev.replies + 1 } : null));
    setReplyText("");
  };

  const handleJoinCircle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinEmail.trim()) return;
    setJoinedSuccess(true);
    setTimeout(() => {
      setJoinedSuccess(false);
      setSelectedFeature(null);
      setJoinEmail("");
    }, 2000);
  };

  return (
    <div className="relative min-h-screen bg-transparent pb-24 text-[#112250] selection:bg-[#BCE0F5] selection:text-[#112250]">
      {/* ================= CENTERED HERO BANNER (TOUR ARCHITECTURE) ================= */}
      {/* ================= HERO SECTION WITH BACKGROUND IMAGE ================= */}
      <section className="relative overflow-hidden mx-4 sm:mx-6 lg:mx-8 mt-2 mb-6 rounded-[2rem] sm:rounded-[2.75rem] border border-[#112250]/15 shadow-xl bg-[#070D1E]">
        {/* Background Photo & Dark Gradient Overlays */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&w=1600&q=80"
            alt="Caregivers and parents sharing supportive connection and encouragement"
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
            <span className="uppercase tracking-wider text-[11px] font-bold">Caregiver &amp; Peer Community</span>
          </motion.div>

          {/* Centered Large Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-black leading-[1.18] tracking-tight text-white max-w-4xl mx-auto drop-shadow-sm"
          >
            You Are Never Alone On Your Rare Journey.
          </motion.h1>

          {/* Centered Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="font-sans mt-4 max-w-3xl mx-auto text-base sm:text-lg leading-relaxed text-[#D6E0F5] font-normal"
          >
            RareBridge connects parents, caregivers, and pediatric advocates to share wisdom, emotional support, and practical caregiving advice in a safe, compassionate environment.
          </motion.p>

          {/* Centered Action Button */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mt-8 flex flex-wrap justify-center gap-3"
          >
            <button
              onClick={() => setSelectedFeature(COMMUNITY_FEATURES[0])}
              className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-xs sm:text-sm font-bold text-[#112250] shadow-xl hover:bg-[#EDF6FC] transition-all cursor-pointer"
            >
              <Users className="h-4 w-4 text-[#112250]" />
              <span>Join Parent Support Circle</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* ================= WAYS TO CONNECT ================= */}
      <section className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#EDF6FC] border border-[#BCE0F5] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#112250] mb-3 shadow-xs">
            <span>Community Resources</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#112250] font-heading">
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
                className="group cursor-pointer rounded-2xl border border-[#BCE0F5] bg-white p-6 shadow-xs hover:border-[#112250] hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EDF6FC] border border-[#BCE0F5] text-[#112250] mb-4 group-hover:bg-[#D4E8F8] group-hover:border-[#112250]/30 group-hover:scale-105 transition-all shadow-xs">
                    <IconComp className="h-6 w-6 text-[#112250]" />
                  </div>
                  <span className="rounded-full bg-[#EDF6FC] px-3 py-1 text-[10px] font-bold text-[#112250] uppercase tracking-wider border border-[#BCE0F5]">
                    {feat.tag}
                  </span>
                  <h3 className="font-heading font-black text-xl text-[#112250] mt-3 group-hover:text-[#243B6B]">
                    {feat.title}
                  </h3>
                  <p className="mt-2 text-xs text-[#243B6B]/80 font-medium leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-[#EDF6FC] flex items-center justify-between text-xs font-bold text-[#112250]">
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
        <div className="rounded-3xl bg-white p-8 sm:p-12 border border-[#BCE0F5] shadow-xs">
          <div className="mb-10 text-center max-w-xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#EDF6FC] border border-[#BCE0F5] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#112250] mb-3 shadow-xs">
              <span>Real Experiences</span>
            </div>
            <h2 className="font-heading text-3xl font-black text-[#112250]">
              Family & Caregiver Voices
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {MEMBER_STORIES.map((story, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -4 }}
                className="rounded-2xl border border-[#BCE0F5] bg-[#F8FBFE] p-6 flex flex-col justify-between hover:bg-white hover:border-[#112250] hover:shadow-sm transition-all"
              >
                <p className="text-xs text-[#243B6B]/85 font-medium leading-relaxed italic mb-4">
                  "{story.quote}"
                </p>

                <div className="flex items-center justify-between border-t border-[#EDF6FC] pt-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={story.avatar}
                      alt={story.name}
                      className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-xs"
                    />
                    <div>
                      <h4 className="font-black text-xs text-[#112250]">{story.name}</h4>
                      <p className="text-[10px] text-[#243B6B]/70 font-bold">{story.condition}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleLike(i)}
                    className={`flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full border transition-all cursor-pointer ${hasLiked[i]
                      ? "bg-[#D4183D] text-white border-[#D4183D] shadow-xs animate-pulse"
                      : "bg-white text-[#243B6B] border-[#BCE0F5] hover:border-[#112250]"
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
        <div className="rounded-3xl bg-white p-8 sm:p-10 border border-[#BCE0F5] shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-[#EDF6FC] pb-5">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#EDF6FC] border border-[#BCE0F5] px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#112250] mb-2 shadow-xs">
                <span>Active Conversations</span>
              </div>
              <h3 className="font-heading font-black text-2xl text-[#112250]">
                Trending Caregiver Discussions
              </h3>
            </div>
            <button
              onClick={() => setIsCreatingTopic(true)}
              className="inline-flex items-center gap-2 rounded-full bg-[#112250] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#243B6B] transition-colors shadow-xs cursor-pointer self-start sm:self-auto"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Start New Topic</span>
            </button>
          </div>

          <div className="space-y-4">
            {discussions.map((disc, idx) => (
              <div
                key={idx}
                role="button"
                tabIndex={0}
                aria-label={`Open discussion: ${disc.topic}`}
                onClick={() => setSelectedDiscussion(disc)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedDiscussion(disc);
                  }
                }}
                className="flex items-center justify-between gap-4 rounded-2xl bg-[#F8FBFE] p-4 sm:p-5 border border-[#BCE0F5] hover:bg-white hover:border-[#112250] hover:shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#112250] transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-[#112250] p-2.5 text-white shrink-0">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="rounded-full bg-white px-3 py-0.5 text-[10px] font-bold text-[#112250] uppercase border border-[#BCE0F5]">
                      {disc.tag}
                    </span>
                    <h4 className="font-black text-sm text-[#112250] mt-1.5">{disc.topic}</h4>
                    <p className="text-xs text-[#243B6B]/70 font-medium">Posted by {disc.author}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-[#243B6B] shrink-0">
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
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 md:p-8 overflow-y-auto">
            <motion.div
              variants={overlayBackdropVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={() => {
                setSelectedFeature(null);
                setJoinedSuccess(false);
              }}
              className="fixed inset-0 bg-[#112250]/65 backdrop-blur-sm"
            />

            <motion.div
              variants={modalPanelVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="relative w-full max-w-lg rounded-3xl border border-[#BCE0F5] bg-white p-6 sm:p-8 shadow-2xl z-10 my-auto"
            >
              <button
                onClick={() => {
                  setSelectedFeature(null);
                  setJoinedSuccess(false);
                }}
                className="absolute top-5 right-5 rounded-full bg-[#EDF6FC] p-2 text-[#112250] hover:bg-[#BCE0F5] transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>

              <span className="rounded-full bg-[#EDF6FC] border border-[#BCE0F5] px-3.5 py-1 text-xs font-bold text-[#112250]">
                {selectedFeature.tag}
              </span>

              <h3 className="font-heading font-black text-2xl text-[#112250] mt-3">
                {selectedFeature.title}
              </h3>

              <p className="mt-3 text-sm text-[#243B6B]/80 leading-relaxed font-medium">
                {selectedFeature.detail}
              </p>

              {joinedSuccess ? (
                <div className="mt-6 flex items-center gap-3 rounded-2xl bg-emerald-50 p-4 border border-emerald-200 text-emerald-800 text-sm font-bold">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  <span>Thank you! Your invitation to join this circle has been sent.</span>
                </div>
              ) : (
                <form onSubmit={handleJoinCircle} className="mt-6 space-y-4">
                  <div className="space-y-2 rounded-2xl bg-[#F8FBFE] p-4 border border-[#BCE0F5]">
                    <h4 className="text-xs font-black uppercase text-[#112250]">Express Interest to Join</h4>
                    <input
                      type="email"
                      required
                      value={joinEmail}
                      onChange={(e) => setJoinEmail(e.target.value)}
                      placeholder="Enter your email address..."
                      className="w-full rounded-xl border border-[#BCE0F5] bg-white px-3.5 py-2.5 text-xs text-[#112250] outline-none font-medium focus:border-[#112250]"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 rounded-full bg-[#112250] px-6 py-3.5 text-sm font-bold text-white hover:bg-[#243B6B] transition-colors shadow-md cursor-pointer"
                    >
                      Join Circle
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= MODAL FOR CREATING TOPIC ================= */}
      <AnimatePresence>
        {isCreatingTopic && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 md:p-8 overflow-y-auto">
            <motion.div
              variants={overlayBackdropVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={() => setIsCreatingTopic(false)}
              className="fixed inset-0 bg-[#112250]/65 backdrop-blur-sm"
            />

            <motion.div
              variants={modalPanelVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="relative w-full max-w-lg rounded-3xl border border-[#BCE0F5] bg-white p-6 sm:p-8 shadow-2xl z-10 my-auto"
            >
              <button
                onClick={() => setIsCreatingTopic(false)}
                className="absolute top-5 right-5 rounded-full bg-[#EDF6FC] p-2 text-[#112250] hover:bg-[#BCE0F5] transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>

              <h3 className="font-heading font-black text-2xl text-[#112250]">
                Start a New Discussion
              </h3>
              <p className="mt-1 text-xs text-[#243B6B]/80 font-medium">
                Share questions, tips, or experiences with rare disease caregivers worldwide.
              </p>

              <form onSubmit={handleCreateTopic} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#112250] mb-1">Topic Title</label>
                  <input
                    type="text"
                    required
                    value={newTopicTitle}
                    onChange={(e) => setNewTopicTitle(e.target.value)}
                    placeholder="e.g. Tips for managing daily therapy schedules..."
                    className="w-full rounded-xl border border-[#BCE0F5] bg-[#F8FBFE] px-3.5 py-2.5 text-xs text-[#112250] outline-none font-medium focus:bg-white focus:border-[#112250]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#112250] mb-1">Your Name</label>
                    <input
                      type="text"
                      value={newTopicAuthor}
                      onChange={(e) => setNewTopicAuthor(e.target.value)}
                      placeholder="e.g. Elena M."
                      className="w-full rounded-xl border border-[#BCE0F5] bg-[#F8FBFE] px-3.5 py-2.5 text-xs text-[#112250] outline-none font-medium focus:bg-white focus:border-[#112250]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#112250] mb-1">Category Tag</label>
                    <select
                      value={newTopicTag}
                      onChange={(e) => setNewTopicTag(e.target.value)}
                      className="w-full rounded-xl border border-[#BCE0F5] bg-[#F8FBFE] px-3.5 py-2.5 text-xs text-[#112250] outline-none font-medium focus:bg-white focus:border-[#112250]"
                    >
                      <option value="Caregiver Tips">Caregiver Tips</option>
                      <option value="School & Advocacy">School & Advocacy</option>
                      <option value="Practical Guides">Practical Guides</option>
                      <option value="Diagnosis Journey">Diagnosis Journey</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreatingTopic(false)}
                    className="flex-1 rounded-full border border-[#BCE0F5] bg-white px-4 py-3 text-xs font-bold text-[#243B6B] hover:bg-[#EDF6FC] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-full bg-[#112250] px-4 py-3 text-xs font-bold text-white hover:bg-[#243B6B] transition-colors shadow-md cursor-pointer"
                  >
                    Post Topic
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= MODAL FOR VIEWING DISCUSSION THREAD ================= */}
      <AnimatePresence>
        {selectedDiscussion && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 md:p-8 overflow-y-auto">
            <motion.div
              variants={overlayBackdropVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={() => setSelectedDiscussion(null)}
              className="fixed inset-0 bg-[#112250]/65 backdrop-blur-sm"
            />

            <motion.div
              variants={modalPanelVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="relative w-full max-w-lg rounded-3xl border border-[#BCE0F5] bg-white p-6 sm:p-8 shadow-2xl z-10 my-auto"
            >
              <button
                onClick={() => setSelectedDiscussion(null)}
                className="absolute top-5 right-5 rounded-full bg-[#EDF6FC] p-2 text-[#112250] hover:bg-[#BCE0F5] transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>

              <span className="rounded-full bg-[#EDF6FC] border border-[#BCE0F5] px-3.5 py-1 text-xs font-bold text-[#112250]">
                {selectedDiscussion.tag}
              </span>

              <h3 className="font-heading font-black text-xl text-[#112250] mt-3">
                {selectedDiscussion.topic}
              </h3>
              <p className="text-xs text-[#243B6B]/80 font-medium mt-1">
                Started by {selectedDiscussion.author} • {selectedDiscussion.replies} community responses
              </p>

              <div className="mt-4 rounded-2xl bg-[#F8FBFE] p-4 border border-[#BCE0F5] text-xs text-[#112250] leading-relaxed">
                "Our family found that having a clear daily checklist and staying in touch with other parents gave us the confidence to advocate effectively at each clinical visit."
              </div>

              <form onSubmit={handleAddReply} className="mt-6 space-y-3">
                <label className="block text-xs font-bold text-[#112250]">Share Advice or Reply</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your encouraging reply..."
                    className="flex-1 rounded-xl border border-[#BCE0F5] bg-[#F8FBFE] px-3.5 py-2.5 text-xs text-[#112250] outline-none font-medium focus:bg-white focus:border-[#112250]"
                  />
                  <button
                    type="submit"
                    className="rounded-full bg-[#112250] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#243B6B] transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Reply</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}