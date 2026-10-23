import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";

interface SignUpPageProps {
  onNav?: (view: string) => void;
}

export default function SignUpPage({ onNav }: SignUpPageProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"parent" | "specialist">("parent");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      if (onNav) onNav("home");
    }, 600);
  };

  return (
    <div className="relative min-h-screen bg-transparent py-12 px-4 sm:px-6 lg:px-8 text-[#112250] selection:bg-[#BCE0F5] selection:text-[#112250] flex items-center justify-center">

      <div className="relative z-10 w-full max-w-4xl grid gap-8 lg:grid-cols-12 items-center">
        {/* Left Welcome Card with Real Clinical Photograph */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-5 text-center lg:text-left space-y-4"
        >
          <button
            onClick={() => onNav?.("home")}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#3B507D] hover:text-[#112250] mb-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" /> Back to RareBridge Home
          </button>

          <div className="relative aspect-[16/10] rounded-[2rem] overflow-hidden border border-[#112250]/15 shadow-xl hidden lg:block">
            <img
              src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80"
              alt="Compassionate healthcare provider consulting with patient"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070D1E]/85 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="rounded-full bg-[#112250] border border-white/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#BCE0F5]">
                Caregiver Network
              </span>
              <p className="mt-1 font-heading text-sm font-bold">
                Join our supportive global community today.
              </p>
            </div>
          </div>

          <div>
            <span className="font-callout text-xs font-bold uppercase tracking-widest text-[#3B507D] mb-1 block">
              Join Our Network
            </span>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold leading-tight tracking-tight text-[#112250]">
              Create Your Free Account
            </h1>
            <p className="font-sans mt-2 max-w-xl text-xs sm:text-sm leading-relaxed text-[#3B507D] font-medium">
              Join thousands of families, parents, and caregivers benefiting from plain-language medical guides and peer support.
            </p>
          </div>

          <div className="pt-2 hidden lg:block space-y-2.5 text-xs font-bold text-[#112250]">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-[#3B507D]" />
              <span>100% Free &amp; Family-Centered</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-[#3B507D]" />
              <span>Personalized condition library bookmarks</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-[#3B507D]" />
              <span>Direct access to Zebra AI assistant</span>
            </div>
          </div>
        </motion.div>

        {/* Right Form Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-7"
        >
          <div className="relative rounded-[2.25rem] border border-[#112250]/15 bg-white/95 p-8 sm:p-10 shadow-2xl backdrop-blur-md">
            {/* Background image accent */}
            <div className="pointer-events-none absolute right-4 bottom-4 opacity-[0.035]">
              <img src="/rarebridge_zebra_with_book.png" alt="" className="h-28 w-28 object-contain" />
            </div>

            {/* Role Switcher */}
            <div className="flex rounded-xl bg-[#F5F4F0] p-1.5 border border-[#112250]/15 mb-6">
              <button
                type="button"
                onClick={() => setRole("parent")}
                className={`flex-1 rounded-lg py-2.5 text-xs font-bold transition-all cursor-pointer ${role === "parent"
                    ? "bg-[#112250] text-white shadow-sm"
                    : "text-[#3B507D] hover:text-[#112250]"
                  }`}
              >
                Parent / Caregiver
              </button>
              <button
                type="button"
                onClick={() => setRole("specialist")}
                className={`flex-1 rounded-lg py-2.5 text-xs font-bold transition-all cursor-pointer ${role === "specialist"
                    ? "bg-[#112250] text-white shadow-sm"
                    : "text-[#3B507D] hover:text-[#112250]"
                  }`}
              >
                Specialist / Researcher
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="signup-name" className="block text-xs font-bold text-[#112250] mb-1.5">
                  Full Name
                </label>
                <div className="relative flex items-center rounded-xl border border-[#112250]/20 bg-[#F5F4F0]/60 px-3.5 py-3 focus-within:border-[#112250] focus-within:bg-white focus-within:shadow-[0_0_20px_rgba(59,80,125,0.15)] transition-all">
                  <User className="h-4 w-4 text-[#3B507D] mr-2.5 shrink-0" aria-hidden="true" />
                  <input
                    id="signup-name"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Sarah Jenkins"
                    className="w-full bg-transparent text-sm text-[#112250] outline-none font-medium placeholder:text-[#3B507D]/60"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="signup-email" className="block text-xs font-bold text-[#112250] mb-1.5">
                  Email Address
                </label>
                <div className="relative flex items-center rounded-xl border border-[#112250]/20 bg-[#F5F4F0]/60 px-3.5 py-3 focus-within:border-[#112250] focus-within:bg-white focus-within:shadow-[0_0_20px_rgba(59,80,125,0.15)] transition-all">
                  <Mail className="h-4 w-4 text-[#3B507D] mr-2.5 shrink-0" aria-hidden="true" />
                  <input
                    id="signup-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@familycare.org"
                    className="w-full bg-transparent text-sm text-[#112250] outline-none font-medium placeholder:text-[#3B507D]/60"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="signup-password" className="block text-xs font-bold text-[#112250] mb-1.5">
                  Password
                </label>
                <div className="relative flex items-center rounded-xl border border-[#112250]/20 bg-[#F5F4F0]/60 px-3.5 py-3 focus-within:border-[#112250] focus-within:bg-white focus-within:shadow-[0_0_20px_rgba(59,80,125,0.15)] transition-all">
                  <Lock className="h-4 w-4 text-[#3B507D] mr-2.5 shrink-0" aria-hidden="true" />
                  <input
                    id="signup-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create password (8+ characters)"
                    className="w-full bg-transparent text-sm text-[#112250] outline-none font-medium placeholder:text-[#3B507D]/60"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-[#112250] px-6 py-3.5 text-sm font-bold text-white hover:bg-[#3B507D] transition-all shadow-md cursor-pointer disabled:opacity-70"
              >
                <span>{isSubmitting ? "Creating Account..." : "Create Free Account"}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="mt-6 border-t border-[#F5F4F0] pt-4 text-center text-xs font-medium text-[#3B507D]">
              Already have an account?{" "}
              <button
                onClick={() => onNav?.("signin")}
                className="font-bold text-[#112250] hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}