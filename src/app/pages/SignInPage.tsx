import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  HeartPulse,
  User,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { EdelweissFlower, OrganicWavyLine } from "../components/common/Visuals";

interface SignInPageProps {
  onNav?: (view: string) => void;
}

export default function SignInPage({ onNav }: SignInPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"parent" | "specialist">("parent");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onNav) onNav("home");
  };

  return (
    <main className="relative min-h-screen bg-transparent py-12 px-4 sm:px-6 lg:px-8 text-[#112250] selection:bg-[#E7E2CE] selection:text-[#112250] flex items-center justify-center overflow-hidden">
      <OrganicWavyLine side="left" />
      <OrganicWavyLine side="right" />

      {/* Ambient Pulsing Glowing Lights */}
      <div className="pointer-events-none absolute -top-24 -right-16 h-80 w-80 rounded-full bg-[#E7E2CE]/70 blur-3xl animate-pulse" />
      <div className="pointer-events-none absolute top-1/3 -left-20 h-72 w-72 rounded-full bg-[#3B507D]/20 blur-3xl animate-pulse" />

      <div className="relative z-10 w-full max-w-4xl grid gap-8 lg:grid-cols-12 items-center">
        {/* Left Welcome Card with Background Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-5 text-center lg:text-left"
        >
          <button
            onClick={() => onNav?.("home")}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#3B507D] hover:text-[#112250] mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to RareBridge Home
          </button>

          <span className="font-callout text-xs font-bold uppercase tracking-widest text-[#3B507D] mb-2 block">
            Welcome Back
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight text-[#112250]">
            Sign In To Your Care Portal
          </h1>
          <p className="font-sans mt-3 max-w-xl text-sm sm:text-base leading-relaxed text-[#3B507D] font-medium">
            Access saved medical guides, parent support circles, and specialist consultation records.
          </p>

          <div className="mt-8 hidden lg:block space-y-3 text-xs font-bold text-[#112250]">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-[#3B507D]" />
              <span>Encrypted & Privacy-First</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-[#3B507D]" />
              <span>Direct access to Zebra AI assistant</span>
            </div>
          </div>
        </motion.div>

        {/* Right Form Card with Glowing Halo */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-7"
        >
          <div className="relative rounded-3xl border-2 border-[#E7E2CE] bg-white p-8 sm:p-10 shadow-xl shadow-[#112250]/10">
            {/* Background image accent */}
            <div className="pointer-events-none absolute right-4 bottom-4 opacity-10">
              <img src="/rarebridge_zebra_with_book.png" alt="" className="h-28 w-28 object-contain" />
            </div>

            {/* Role Switcher */}
            <div className="flex rounded-2xl bg-[#F5F4F0] p-1.5 border border-[#E7E2CE] mb-6">
              <button
                type="button"
                onClick={() => setRole("parent")}
                className={`flex-1 rounded-xl py-2.5 text-xs font-bold transition-all ${
                  role === "parent"
                    ? "bg-[#112250] text-white shadow-sm"
                    : "text-[#3B507D] hover:text-[#112250]"
                }`}
              >
                Parent / Caregiver
              </button>
              <button
                type="button"
                onClick={() => setRole("specialist")}
                className={`flex-1 rounded-xl py-2.5 text-xs font-bold transition-all ${
                  role === "specialist"
                    ? "bg-[#112250] text-white shadow-sm"
                    : "text-[#3B507D] hover:text-[#112250]"
                }`}
              >
                Specialist / Researcher
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#112250] mb-1.5">
                  Email Address
                </label>
                <div className="relative flex items-center rounded-2xl border-2 border-[#E7E2CE] bg-[#F5F4F0] px-3.5 py-3 focus-within:border-[#112250] focus-within:bg-white focus-within:shadow-[0_0_20px_rgba(59,80,125,0.15)] transition-all">
                  <Mail className="h-4 w-4 text-[#3B507D] mr-2.5 shrink-0" />
                  <input
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
                <label className="block text-xs font-bold text-[#112250] mb-1.5">
                  Password
                </label>
                <div className="relative flex items-center rounded-2xl border-2 border-[#E7E2CE] bg-[#F5F4F0] px-3.5 py-3 focus-within:border-[#112250] focus-within:bg-white focus-within:shadow-[0_0_20px_rgba(59,80,125,0.15)] transition-all">
                  <Lock className="h-4 w-4 text-[#3B507D] mr-2.5 shrink-0" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-transparent text-sm text-[#112250] outline-none font-medium placeholder:text-[#3B507D]/60"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-bold">
                <label className="flex items-center gap-2 cursor-pointer text-[#3B507D]">
                  <input type="checkbox" className="rounded text-[#112250]" />
                  Remember me
                </label>
                <a href="#forgot" className="text-[#112250] hover:underline">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#112250] px-6 py-3.5 text-sm font-bold text-white hover:bg-[#3B507D] transition-all shadow-md"
              >
                <span>Sign In to Account</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="mt-6 border-t border-[#F5F4F0] pt-4 text-center text-xs font-medium text-[#3B507D]">
              Don't have a RareBridge account yet?{" "}
              <button
                onClick={() => onNav?.("signup")}
                className="font-bold text-[#112250] hover:underline"
              >
                Create Account
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}