import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  X,
} from "lucide-react";
import { EdelweissFlower, OrganicWavyLine } from "../components/common/Visuals";

interface SignInPageProps {
  onNav?: (view: string) => void;
}

export default function SignInPage({ onNav }: SignInPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"parent" | "specialist">("parent");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      if (onNav) onNav("home");
    }, 600);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setForgotSuccess(true);
    setTimeout(() => {
      setForgotSuccess(false);
      setShowForgotModal(false);
      setForgotEmail("");
    }, 2500);
  };

  return (
    <div className="relative min-h-screen bg-transparent py-12 px-4 sm:px-6 lg:px-8 text-[#112250] selection:bg-[#E7E2CE] selection:text-[#112250] flex items-center justify-center overflow-hidden">
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
          <div className="relative rounded-xl border-2 border-[#E7E2CE] bg-white p-8 sm:p-10 shadow-xl shadow-[#112250]/10">
            {/* Background image accent */}
            <div className="pointer-events-none absolute right-4 bottom-4 opacity-10">
              <img src="/rarebridge_zebra_with_book.png" alt="" className="h-28 w-28 object-contain" />
            </div>

            {/* Role Switcher */}
            <div className="flex rounded-lg bg-[#F5F4F0] p-1.5 border border-[#E7E2CE] mb-6">
              <button
                type="button"
                onClick={() => setRole("parent")}
                className={`flex-1 rounded-md py-2.5 text-xs font-bold transition-all ${
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
                className={`flex-1 rounded-md py-2.5 text-xs font-bold transition-all ${
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
                <label htmlFor="signin-email" className="block text-xs font-bold text-[#112250] mb-1.5">
                  Email Address
                </label>
                <div className="relative flex items-center rounded-lg border-2 border-[#E7E2CE] bg-[#F5F4F0] px-3.5 py-3 focus-within:border-[#112250] focus-within:bg-white focus-within:shadow-[0_0_20px_rgba(59,80,125,0.15)] transition-all">
                  <Mail className="h-4 w-4 text-[#3B507D] mr-2.5 shrink-0" aria-hidden="true" />
                  <input
                    id="signin-email"
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
                <label htmlFor="signin-password" className="block text-xs font-bold text-[#112250] mb-1.5">
                  Password
                </label>
                <div className="relative flex items-center rounded-lg border-2 border-[#E7E2CE] bg-[#F5F4F0] px-3.5 py-3 focus-within:border-[#112250] focus-within:bg-white focus-within:shadow-[0_0_20px_rgba(59,80,125,0.15)] transition-all">
                  <Lock className="h-4 w-4 text-[#3B507D] mr-2.5 shrink-0" aria-hidden="true" />
                  <input
                    id="signin-password"
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
                <label htmlFor="signin-remember" className="flex items-center gap-2 cursor-pointer text-[#3B507D]">
                  <input id="signin-remember" type="checkbox" className="rounded text-[#112250]" />
                  Remember me
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[#112250] hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-[#112250] px-6 py-3.5 text-sm font-bold text-white hover:bg-[#3B507D] transition-all shadow-md cursor-pointer disabled:opacity-70"
              >
                <span>{isSubmitting ? "Signing In..." : "Sign In to Account"}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="mt-6 border-t border-[#F5F4F0] pt-4 text-center text-xs font-medium text-[#3B507D]">
              Don't have a RareBridge account yet?{" "}
              <button
                onClick={() => onNav?.("signup")}
                className="font-bold text-[#112250] hover:underline cursor-pointer"
              >
                Create Account
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <div
              onClick={() => {
                setShowForgotModal(false);
                setForgotSuccess(false);
              }}
              className="fixed inset-0 bg-[#112250]/60 backdrop-blur-xs"
            />

            <div className="relative w-full max-w-md rounded-xl border-2 border-[#E7E2CE] bg-white p-6 sm:p-8 shadow-2xl z-10 my-auto">
              <button
                onClick={() => {
                  setShowForgotModal(false);
                  setForgotSuccess(false);
                }}
                className="absolute top-5 right-5 rounded-lg bg-[#F5F4F0] p-2 text-[#112250] hover:bg-[#E7E2CE] transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>

              <h3 className="font-heading font-black text-2xl text-[#112250]">Reset Password</h3>
              <p className="mt-1 text-xs text-[#3B507D] font-medium leading-relaxed">
                Enter your account email address. We'll send instructions to safely recover and reset your credentials.
              </p>

              {forgotSuccess ? (
                <div className="mt-6 flex items-center gap-3 rounded-lg bg-emerald-50 p-4 border border-emerald-200 text-emerald-800 text-sm font-bold">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  <span>Password reset link sent! Please check your inbox.</span>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="mt-6 space-y-4">
                  <div>
                    <label htmlFor="forgot-email" className="block text-xs font-bold text-[#112250] mb-1.5">Email Address</label>
                    <div className="flex items-center rounded-lg border-2 border-[#E7E2CE] bg-[#F5F4F0] px-3.5 py-3 focus-within:border-[#112250] focus-within:bg-white transition-all">
                      <Mail className="h-4 w-4 text-[#3B507D] mr-2.5 shrink-0" aria-hidden="true" />
                      <input
                        id="forgot-email"
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="name@familycare.org"
                        className="w-full bg-transparent text-sm text-[#112250] outline-none font-medium placeholder:text-[#3B507D]/60"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(false)}
                      className="flex-1 rounded-lg border border-[#E7E2CE] bg-white px-4 py-3 text-xs font-bold text-[#3B507D] hover:bg-[#F5F4F0] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 rounded-lg bg-[#112250] px-4 py-3 text-xs font-bold text-white hover:bg-[#3B507D] transition-colors shadow-md cursor-pointer"
                    >
                      Send Reset Link
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}