import React from "react";
import { Users, MessageCircle, Microscope } from "lucide-react";
import { ZebraMascot, ZebraDoodle } from "../components/common/Visuals";

export default function CommunityPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Left side curvy lines */}
      <svg className="fixed left-0 top-0 h-full w-32 pointer-events-none opacity-10" viewBox="0 0 100 1000" preserveAspectRatio="none">
        <path d="M20 0 Q50 100 20 200 T20 400 T20 600 T20 800 T20 1000" stroke="var(--primary)" strokeWidth="3" fill="none" />
        <path d="M40 0 Q70 150 40 300 T40 600 T40 900 T40 1000" stroke="var(--purple)" strokeWidth="2" fill="none" />
        <path d="M60 0 Q90 200 60 400 T60 800 T60 1000" stroke="var(--green)" strokeWidth="2" fill="none" />
        <path d="M10 100 Q40 150 10 200 T10 300 T10 400" stroke="var(--accent)" strokeWidth="2" fill="none" />
        <path d="M80 200 Q50 250 80 300 T80 400 T80 500" stroke="var(--secondary)" strokeWidth="2" fill="none" />
      </svg>

      {/* Right side curvy lines */}
      <svg className="fixed right-0 top-0 h-full w-32 pointer-events-none opacity-10" viewBox="0 0 100 1000" preserveAspectRatio="none">
        <path d="M80 0 Q50 100 80 200 T80 400 T80 600 T80 800 T80 1000" stroke="var(--primary)" strokeWidth="3" fill="none" />
        <path d="M60 0 Q30 150 60 300 T60 600 T60 900 T60 1000" stroke="var(--purple)" strokeWidth="2" fill="none" />
        <path d="M40 0 Q10 200 40 400 T40 800 T40 1000" stroke="var(--green)" strokeWidth="2" fill="none" />
        <path d="M90 100 Q60 150 90 200 T90 300 T90 400" stroke="var(--accent)" strokeWidth="2" fill="none" />
        <path d="M20 200 Q50 250 20 300 T20 400 T20 500" stroke="var(--secondary)" strokeWidth="2" fill="none" />
      </svg>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="relative overflow-hidden rounded-3xl bg-secondary p-10 mb-10 border border-taupe-40">
        <div className="absolute left-6 top-6 opacity-10 pointer-events-none"><ZebraDoodle className="w-48 h-32" /></div>
        <div className="absolute right-6 bottom-6 opacity-10 pointer-events-none"><ZebraMascot size={140} /></div>
        <div className="relative text-center">
          <h1 className="font-black text-3xl text-primary mb-4">Community Support</h1>
          <p className="text-accent max-w-3xl mx-auto">Discover groups, forums, and family networks built for rare disease journeys.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mb-10">
        {[
          { title: "Support Groups", description: "Local and online groups where families share advice, resources, and encouragement.", icon: Users },
          { title: "Caregiver Resources", description: "Practical tools, self-care tips, and help navigating medical appointments.", icon: MessageCircle },
          { title: "Research Networks", description: "Patient-led networks that support clinical trial awareness and advocacy.", icon: Microscope },
        ].map(item => (
          <div key={item.title} className="relative overflow-hidden rounded-3xl border border-secondary bg-white p-6 shadow-sm transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-secondary-30 blur-2xl" />
            <div className="relative">
              <div className="mb-4 inline-flex items-center gap-2 text-accent">
                <item.icon className="w-4 h-4" />
                <h3 className="font-bold text-primary mb-0">{item.title}</h3>
              </div>
              <p className="text-sm text-accent leading-relaxed">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-secondary bg-white p-8 shadow-sm">
        <div className="pointer-events-none absolute -right-8 bottom-8 h-24 w-24 rounded-full bg-secondary-20 blur-2xl" />
        <h2 className="font-black text-2xl text-primary mb-4">Connect with others</h2>
        <p className="text-accent leading-relaxed mb-6">Whether you are caring for a child, living with a rare disease, or supporting a family member, community connections make the journey easier.</p>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl bg-ivory p-5 transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
            <h3 className="font-bold text-primary mb-2">Live events</h3>
            <p className="text-sm text-accent">Webinars, Q&amp;As, and support circles with experts and families.</p>
          </div>
          <div className="rounded-3xl bg-ivory p-5 transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
            <h3 className="font-bold text-primary mb-2">Private forums</h3>
            <p className="text-sm text-accent">Safe spaces to ask questions, share wins, and exchange resources.</p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
