import React, { useState } from "react";
import { Eye, EyeOff, ArrowLeft, Mail, Lock, User, Users, Stethoscope, Microscope } from "lucide-react";
import { ZebraMascot } from "../components/common/Visuals";

const ROLES = [
  { id: "family", label: "Family", sub: "/ Caregiver", Icon: Users },
  { id: "clinician", label: "Clinician", sub: "", Icon: Stethoscope },
  { id: "researcher", label: "Researcher", sub: "", Icon: Microscope },
];

export default function SignUpPage({ onNav }: { onNav: (v: string) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("family");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); onNav("home"); }, 900);
  }

  const strength = Math.min(4, Math.floor(password.length / 3));
  const strengthColor = password.length >= 12 ? "bg-emerald-400" : password.length >= 6 ? "bg-primary" : "bg-amber-400";

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">

      {/* ── Brand panel ── */}
      <div className="hidden lg:flex flex-col justify-between w-[44%] bg-primary px-14 py-16 relative overflow-hidden shrink-0">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-secondary opacity-10 blur-[90px]" />
          <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-accent opacity-10 blur-[80px]" />
          <div className="absolute bottom-4 right-10 opacity-[0.06] pointer-events-none">
            <ZebraMascot size={220} />
          </div>
        </div>

        <div className="relative z-10">
          <button onClick={() => onNav("home")}
            className="inline-flex items-center gap-2 text-sm text-taupe hover:text-secondary transition-colors mb-14">
            <ArrowLeft className="w-4 h-4" /> Back to RareBridge
          </button>
          <div className="inline-flex items-center gap-2 bg-white/95 rounded-2xl p-3 shadow-md mb-7">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
              R
            </div>
            <span className="text-lg font-bold text-primary tracking-tight pr-2">RareBridge</span>
          </div>
          <h2 className="font-black text-4xl text-ivory leading-[1.1] mb-5">
            Join 120,000+<br />families on<br />RareBridge
          </h2>
          <p className="text-taupe leading-relaxed text-base max-w-xs">
            Create your free account to save resources, follow research, connect with specialists, and find community support.
          </p>
        </div>

        <div className="relative z-10 space-y-3">
          {["Free forever — no credit card needed", "Medically reviewed content", "Connect with verified specialists"].map(s => (
            <div key={s} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
                <div className="w-2 h-2 rounded-full bg-secondary" />
              </div>
              <span className="text-sm text-taupe">{s}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Form panel ── */}
      <div className="flex-1 flex items-center justify-center bg-[#f4f5f7] px-5 py-14">
        <div className="w-full max-w-[420px]">

          {/* Mobile back */}
          <button onClick={() => onNav("home")}
            className="lg:hidden inline-flex items-center gap-1.5 text-sm text-accent hover:text-primary transition-colors mb-10">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          {/* Card */}
          <div className="bg-white rounded-3xl shadow-xl shadow-black/[0.06] border border-black/[0.05] px-8 py-10">

            {/* Header */}
            <div className="mb-7">
              <div 
                className="inline-flex items-center gap-2 mb-4 cursor-pointer hover:scale-105 transition-transform"
                onClick={() => onNav("home")}
              >
                <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-sm">
                  R
                </div>
                <span className="text-2xl font-bold text-primary tracking-tight">RareBridge</span>
              </div>
              <h1 className="font-black text-2xl text-primary mb-1.5">Create your account</h1>
              <p className="text-sm text-accent">
                Already have one?{" "}
                <button onClick={() => onNav("signin")}
                  className="font-semibold text-primary hover:underline">
                  Sign in
                </button>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Role selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-primary uppercase tracking-wider">I am a…</label>
                <div className="grid grid-cols-3 gap-2">
                  {ROLES.map(r => (
                    <button key={r.id} type="button" onClick={() => setRole(r.id)}
                      className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border-2 text-center
                        transition-all duration-200
                        ${role === r.id
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-taupe-40 bg-[#f8f8f9] text-accent hover:border-primary/40 hover:bg-white"
                        }`}>
                      <r.Icon className={`w-5 h-5 ${role === r.id ? "text-primary" : "text-taupe"}`} />
                      <span className="text-[11px] font-bold leading-tight">{r.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Full name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-primary uppercase tracking-wider">Full name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-taupe pointer-events-none" />
                  <input type="text" value={name} onChange={e => setName(e.target.value)}
                    required placeholder="Your name"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-taupe-40 bg-[#f8f8f9]
                      text-primary placeholder-taupe text-sm outline-none
                      focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10
                      transition-all duration-200" />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-primary uppercase tracking-wider">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-taupe pointer-events-none" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    required placeholder="you@example.com"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-taupe-40 bg-[#f8f8f9]
                      text-primary placeholder-taupe text-sm outline-none
                      focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10
                      transition-all duration-200" />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-primary uppercase tracking-wider">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-taupe pointer-events-none" />
                  <input type={showPw ? "text" : "password"} value={password}
                    onChange={e => setPassword(e.target.value)}
                    required placeholder="Create a strong password"
                    className="w-full pl-11 pr-11 py-3 rounded-xl border border-taupe-40 bg-[#f8f8f9]
                      text-primary placeholder-taupe text-sm outline-none
                      focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10
                      transition-all duration-200" />
                  <button type="button" onClick={() => setShowPw(s => !s)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-taupe hover:text-primary transition-colors">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {/* Strength bar */}
                {password.length > 0 && (
                  <div className="flex gap-1 mt-1.5">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthColor : "bg-taupe-40"}`} />
                    ))}
                  </div>
                )}
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading}
                className="w-full mt-2 py-3 rounded-xl bg-primary text-ivory font-bold text-sm
                  hover:bg-accent transition-all duration-200 shadow-sm
                  disabled:opacity-60 disabled:cursor-not-allowed
                  flex items-center justify-center gap-2">
                {loading ? (
                  <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg> Creating account…</>
                ) : "Create free account"}
              </button>
            </form>

            <p className="text-[11px] text-taupe text-center mt-7 leading-relaxed">
              By continuing you agree to our{" "}
              <a href="#" className="underline hover:text-primary transition-colors">Terms</a> &amp;{" "}
              <a href="#" className="underline hover:text-primary transition-colors">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
