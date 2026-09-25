import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Bot, Star,
  AlertCircle, Stethoscope, ClipboardList, Syringe, Users as UsersIcon, Microscope as MicroscopeIcon,
  Thermometer, HeartPulse, Pill, Users, FlaskConical, UserCircle, BookOpen, Sparkles, Zap, Trophy, Target,
  Flame, Award, CheckCircle, XCircle, Lock, Download, Heart, Brain, Dna, Activity
} from "lucide-react";
import { Disease } from "../../data";
import { generateDiseasePDF } from "../../utils/pdf-generator";



export function ZebraMascot({ size = 80, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" className={className} fill="none">
      <ellipse cx="40" cy="54" rx="26" ry="20" fill="var(--secondary)" />
      <ellipse cx="40" cy="38" rx="16" ry="20" fill="var(--background)" stroke="var(--switch-background)" strokeWidth="1.5" />
      <path d="M30 22 Q36 19 40 20 Q44 19 50 22" stroke="var(--accent)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <circle cx="33" cy="30" r="3" fill="var(--primary)" />
      <circle cx="47" cy="30" r="3" fill="var(--primary)" />
    </svg>
  );
}

export function OrganicWavyLine({
  className = "",
  strokeColor = "#BEB7A7",
  side = "left",
}: {
  className?: string;
  strokeColor?: string;
  side?: "left" | "right";
}) {
  return null;
}

export function ZebraDoodle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 120" className={className} fill="none" aria-hidden="true">
      <path d="M10 25 C30 5 50 45 70 25 S110 5 130 25" stroke="var(--primary)" strokeWidth="4" strokeLinecap="round" />
      <path d="M12 35 C32 55 52 15 72 35 S112 55 132 35" stroke="var(--accent)" strokeWidth="4" strokeLinecap="round" opacity="0.65" />
      <circle cx="28" cy="80" r="10" fill="var(--secondary)" />
      <circle cx="88" cy="92" r="6" fill="var(--switch-background)" />
      <circle cx="118" cy="54" r="8" fill="var(--secondary)" />
      <path d="M20 100 Q40 85 60 100 T100 100" stroke="var(--primary)" strokeWidth="3" fill="none" opacity="0.6" />
    </svg>
  );
}

export function ZebraWithButterfly({ size = 120, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" className={className} fill="none" aria-hidden="true">
      {/* Zebra body */}
      <ellipse cx="60" cy="75" rx="35" ry="25" fill="var(--secondary)" />
      {/* Zebra head */}
      <ellipse cx="60" cy="50" rx="22" ry="28" fill="var(--background)" stroke="var(--switch-background)" strokeWidth="2" />
      {/* Zebra stripes */}
      <path d="M45 35 Q52 32 58 33 Q62 32 68 35" stroke="var(--accent)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M42 45 Q52 42 60 43 Q68 42 78 45" stroke="var(--primary)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Zebra eyes */}
      <circle cx="50" cy="42" r="4" fill="var(--primary)" />
      <circle cx="70" cy="42" r="4" fill="var(--primary)" />
      <circle cx="51" cy="41" r="1.5" fill="white" />
      <circle cx="71" cy="41" r="1.5" fill="white" />
      {/* Zebra ears */}
      <ellipse cx="42" cy="28" rx="6" ry="8" fill="var(--secondary)" transform="rotate(-20 42 28)" />
      <ellipse cx="78" cy="28" rx="6" ry="8" fill="var(--secondary)" transform="rotate(20 78 28)" />
      {/* Zebra legs */}
      <rect x="40" y="90" width="8" height="20" rx="4" fill="var(--secondary)" />
      <rect x="55" y="90" width="8" height="20" rx="4" fill="var(--secondary)" />
      <rect x="70" y="90" width="8" height="20" rx="4" fill="var(--secondary)" />

      {/* Butterfly */}
      <g className="animate-float" style={{ animationDelay: '0.5s' }}>
        {/* Left wing */}
        <ellipse cx="95" cy="35" rx="12" ry="8" fill="var(--primary)" opacity="0.8" transform="rotate(-30 95 35)" />
        <ellipse cx="92" cy="42" rx="8" ry="6" fill="var(--accent)" opacity="0.7" transform="rotate(-20 92 42)" />
        {/* Right wing */}
        <ellipse cx="105" cy="35" rx="12" ry="8" fill="var(--primary)" opacity="0.8" transform="rotate(30 105 35)" />
        <ellipse cx="108" cy="42" rx="8" ry="6" fill="var(--accent)" opacity="0.7" transform="rotate(20 108 42)" />
        {/* Butterfly body */}
        <ellipse cx="100" cy="38" rx="2" ry="6" fill="var(--switch-background)" />
        {/* Butterfly antennae */}
        <path d="M98 33 Q95 30 96 28" stroke="var(--switch-background)" strokeWidth="1" fill="none" />
        <path d="M102 33 Q105 30 104 28" stroke="var(--switch-background)" strokeWidth="1" fill="none" />
      </g>

      {/* Sparkles around butterfly */}
      <circle cx="88" cy="28" r="2" fill="var(--secondary)" className="animate-sparkle" />
      <circle cx="112" cy="30" r="1.5" fill="var(--primary)" className="animate-sparkle" style={{ animationDelay: '0.3s' }} />
      <circle cx="100" cy="25" r="1" fill="var(--accent)" className="animate-sparkle" style={{ animationDelay: '0.6s' }} />
    </svg>
  );
}

export function ZebraEmptyState({ message, sub }: { message: string; sub?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="relative mb-4">
        <img src="/rarebridge_zebra_with_book.png" alt="Zebra Mascot" className="h-24 w-24 object-contain" />
      </div>
      <p className="font-bold text-primary text-lg">{message}</p>
      {sub && <p className="text-sm text-taupe mt-1 max-w-xs">{sub}</p>}
    </div>
  );
}

export function EdelweissFlower({ size = 80, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} fill="none" aria-hidden="true">
      {/* Stem */}
      <path d="M50 70 Q52 80 50 95" stroke="var(--switch-background)" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Leaves */}
      <path d="M50 75 Q35 70 30 60 Q40 65 50 72" fill="var(--secondary)" opacity="0.7" />
      <path d="M50 78 Q65 73 70 63 Q60 68 50 75" fill="var(--secondary)" opacity="0.7" />
      {/* Petals - star-shaped edelweiss */}
      <g className="animate-sparkle">
        <ellipse cx="50" cy="35" rx="8" ry="20" fill="var(--background)" stroke="var(--switch-background)" strokeWidth="1.5" transform="rotate(0 50 50)" />
        <ellipse cx="50" cy="35" rx="8" ry="20" fill="var(--background)" stroke="var(--switch-background)" strokeWidth="1.5" transform="rotate(45 50 50)" />
        <ellipse cx="50" cy="35" rx="8" ry="20" fill="var(--background)" stroke="var(--switch-background)" strokeWidth="1.5" transform="rotate(90 50 50)" />
        <ellipse cx="50" cy="35" rx="8" ry="20" fill="var(--background)" stroke="var(--switch-background)" strokeWidth="1.5" transform="rotate(135 50 50)" />
        <ellipse cx="50" cy="35" rx="8" ry="20" fill="var(--background)" stroke="var(--switch-background)" strokeWidth="1.5" transform="rotate(180 50 50)" />
        <ellipse cx="50" cy="35" rx="8" ry="20" fill="var(--background)" stroke="var(--switch-background)" strokeWidth="1.5" transform="rotate(225 50 50)" />
        <ellipse cx="50" cy="35" rx="8" ry="20" fill="var(--background)" stroke="var(--switch-background)" strokeWidth="1.5" transform="rotate(270 50 50)" />
        <ellipse cx="50" cy="35" rx="8" ry="20" fill="var(--background)" stroke="var(--switch-background)" strokeWidth="1.5" transform="rotate(315 50 50)" />
      </g>
      {/* Center */}
      <circle cx="50" cy="50" r="12" fill="var(--primary)" opacity="0.9" />
      <circle cx="50" cy="50" r="8" fill="var(--accent)" opacity="0.8" />
      {/* Fuzzy texture dots */}
      <circle cx="50" cy="45" r="1.5" fill="var(--secondary)" opacity="0.6" />
      <circle cx="46" cy="50" r="1.5" fill="var(--secondary)" opacity="0.6" />
      <circle cx="54" cy="50" r="1.5" fill="var(--secondary)" opacity="0.6" />
      <circle cx="50" cy="55" r="1.5" fill="var(--secondary)" opacity="0.6" />
    </svg>
  );
}

export function ButterflyDoodle({ size = 60, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" className={`${className} animate-float`} fill="none" aria-hidden="true">
      {/* Left wings */}
      <ellipse cx="25" cy="30" rx="15" ry="12" fill="var(--primary)" opacity="0.8" transform="rotate(-25 25 30)" />
      <ellipse cx="22" cy="42" rx="10" ry="8" fill="var(--accent)" opacity="0.7" transform="rotate(-15 22 42)" />
      {/* Right wings */}
      <ellipse cx="55" cy="30" rx="15" ry="12" fill="var(--primary)" opacity="0.8" transform="rotate(25 55 30)" />
      <ellipse cx="58" cy="42" rx="10" ry="8" fill="var(--accent)" opacity="0.7" transform="rotate(15 58 42)" />
      {/* Body */}
      <ellipse cx="40" cy="38" rx="3" ry="10" fill="var(--switch-background)" />
      {/* Antennae */}
      <path d="M38 30 Q35 25 36 22" stroke="var(--switch-background)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M42 30 Q45 25 44 22" stroke="var(--switch-background)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Wing patterns */}
      <circle cx="20" cy="28" r="3" fill="var(--secondary)" opacity="0.5" />
      <circle cx="60" cy="28" r="3" fill="var(--secondary)" opacity="0.5" />
      <circle cx="25" cy="40" r="2" fill="var(--primary)" opacity="0.4" />
      <circle cx="55" cy="40" r="2" fill="var(--primary)" opacity="0.4" />
    </svg>
  );
}

export function usePopSound() {
  const audioContextRef = useRef<AudioContext | null>(null);

  return useCallback(() => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;

      let ctx = audioContextRef.current;
      if (!ctx) {
        ctx = new AudioContext();
        audioContextRef.current = ctx;
      }

      if (ctx.state === "suspended") {
        void ctx.resume();
      }

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.15);
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    } catch (error) {
      console.warn("Pop sound failed to play", error);
    }
  }, []);
}

export function useChimeSound() {
  const audioContextRef = useRef<AudioContext | null>(null);

  return useCallback(() => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;

      let ctx = audioContextRef.current;
      if (!ctx) {
        ctx = new AudioContext();
        audioContextRef.current = ctx;
      }

      if (ctx.state === "suspended") {
        void ctx.resume();
      }

      const now = ctx.currentTime;

      // Create a very soft, gentle chime
      const frequencies = [523.25, 659.25]; // C5, E5 (softer chord)
      frequencies.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.02, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.6);
      });
    } catch (error) {
      console.warn("Chime sound failed to play", error);
    }
  }, []);
}

export function useSparkleSound() {
  const audioContextRef = useRef<AudioContext | null>(null);

  return useCallback(() => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;

      let ctx = audioContextRef.current;
      if (!ctx) {
        ctx = new AudioContext();
        audioContextRef.current = ctx;
      }

      if (ctx.state === "suspended") {
        void ctx.resume();
      }

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.08);
      gain.gain.setValueAtTime(0.015, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    } catch (error) {
      console.warn("Sparkle sound failed to play", error);
    }
  }, []);
}

// Small helper that attaches mousemove to update particle CSS vars
if (typeof window !== "undefined") {
  try {
    let throttle = 0;
    window.addEventListener("mousemove", (e) => {
      if (Date.now() < throttle) return;
      throttle = Date.now() + 40;
      const root = document.getElementById("rb-particles");
      if (!root) return;
      const rect = root.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      // Spread a few offsets
      root.style.setProperty("--p-x", `${(x - rect.width * 0.2) * 0.02}px`);
      root.style.setProperty("--p-y", `${(y - rect.height * 0.3) * 0.02}px`);
      root.style.setProperty("--p-x2", `${(x - rect.width * 0.7) * 0.03}px`);
      root.style.setProperty("--p-y2", `${(y - rect.height * 0.1) * 0.03}px`);
      root.style.setProperty("--p-x3", `${(x - rect.width * 0.84) * 0.025}px`);
      root.style.setProperty("--p-y3", `${(y - rect.height * 0.72) * 0.025}px`);
      root.style.setProperty("--p-x4", `${(x - rect.width * 0.2) * 0.04}px`);
      root.style.setProperty("--p-y4", `${(y - rect.height * 0.68) * 0.04}px`);
      root.style.setProperty("--p-x5", `${(x - rect.width * 0.54) * 0.035}px`);
      root.style.setProperty("--p-y5", `${(y - rect.height * 0.36) * 0.035}px`);
    });
  } catch (e) {
    // silent
  }
}

/**
 * Reusable ZebraGridDoodle component
 * Provides a soft, decorative background with delicate lavender & warm beige grid lines,
 * hand-drawn zebra faces, and stripe accents.
 */
/**
 * Reusable ZebraGridDoodle component
 * Provides a crisp, stylish decorative background with clean square grid lines,
 * hand-drawn zebra faces, stripe ribbons, crosshairs, and doodle accents.
 */
export function ZebraGridDoodle({
  className = "",
  gridColorLavender = "#A7A9C6",
  gridColorBeige = "#D8D3C8",
  gridColorNavy = "#3B507D",
  opacity = 0.22,
  patternId = "zebra-grid-doodle-pattern"
}: {
  className?: string;
  gridColorLavender?: string;
  gridColorBeige?: string;
  gridColorNavy?: string;
  opacity?: number;
  patternId?: string;
}) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 z-0 overflow-hidden ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      <svg className="h-full w-full" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id={patternId} width="120" height="120" patternUnits="userSpaceOnUse">
            {/* --- Square Grid Structure (60px x 60px squares) --- */}
            {/* Outer Square Grid Lines */}
            <path d="M 120 0 H 0 V 120 H 120 Z" fill="none" stroke={gridColorNavy} strokeWidth="0.8" opacity="0.4" />
            
            {/* Interior Center Sub-grid Division Lines */}
            <path d="M 60 0 V 120" fill="none" stroke={gridColorLavender} strokeWidth="0.75" strokeDasharray="4 3" opacity="0.6" />
            <path d="M 0 60 H 120" fill="none" stroke={gridColorLavender} strokeWidth="0.75" strokeDasharray="4 3" opacity="0.6" />
            
            {/* Fine Inner Accent Lines */}
            <path d="M 120 0 L 0 0 0 120" fill="none" stroke={gridColorBeige} strokeWidth="1" opacity="0.8" />
            
            {/* --- Grid Intersection Crosshairs (+) & Nodes --- */}
            {/* Primary Center Intersection (60, 60) Crosshair */}
            <path d="M 54 60 H 66 M 60 54 V 66" stroke={gridColorNavy} strokeWidth="1.2" opacity="0.8" />
            <circle cx="60" cy="60" r="2.5" fill="none" stroke={gridColorNavy} strokeWidth="1" />

            {/* Corner Nodes (0, 0), (120, 0), (0, 120), (120, 120) */}
            <path d="M 0 6 H 6 M 0 -6 H 6 M -6 0 V 6 M 6 0 V 6" stroke={gridColorNavy} strokeWidth="1" opacity="0.7" />
            <circle cx="0" cy="0" r="2" fill={gridColorLavender} opacity="0.9" />

            {/* Midpoint Intersection Nodes (60, 0) & (0, 60) */}
            <circle cx="60" cy="0" r="2" fill={gridColorBeige} stroke={gridColorNavy} strokeWidth="0.5" />
            <circle cx="0" cy="60" r="2" fill={gridColorBeige} stroke={gridColorNavy} strokeWidth="0.5" />

            {/* --- Zebra Doodle Elements in Pattern Cells --- */}

            {/* DOODLE 1: Zebra Head Mascot Doodle in Top-Left Square (28, 28) */}
            <g transform="translate(30, 28) scale(0.7)" opacity="0.85">
              {/* Ears */}
              <ellipse cx="-9" cy="-15" rx="3.5" ry="7" fill={gridColorBeige} stroke={gridColorNavy} strokeWidth="0.8" transform="rotate(-18 -9 -15)" />
              <ellipse cx="9" cy="-15" rx="3.5" ry="7" fill={gridColorBeige} stroke={gridColorNavy} strokeWidth="0.8" transform="rotate(18 9 -15)" />
              <path d="M -7 -14 L -4 -8 M 7 -14 L 4 -8" stroke={gridColorNavy} strokeWidth="0.8" />
              {/* Head Outline */}
              <path d="M -12 -6 C -13 5 -8 15 0 16 C 8 15 13 5 12 -6 C 12 -12 -12 -12 -12 -6 Z" fill="none" stroke={gridColorNavy} strokeWidth="1.2" />
              {/* Zebra forehead stripes */}
              <path d="M -7 -7 Q 0 -10 7 -7" stroke={gridColorNavy} strokeWidth="1.2" fill="none" strokeLinecap="round" />
              <path d="M -8 -2 Q 0 -5 8 -2" stroke={gridColorNavy} strokeWidth="1.2" fill="none" strokeLinecap="round" />
              <path d="M -6 3 Q 0 1 6 3" stroke={gridColorNavy} strokeWidth="1.2" fill="none" strokeLinecap="round" />
              {/* Eyes */}
              <circle cx="-4" cy="-2" r="1.3" fill={gridColorNavy} />
              <circle cx="4" cy="-2" r="1.3" fill={gridColorNavy} />
              {/* Muzzle */}
              <ellipse cx="0" cy="9" rx="6" ry="4" fill={gridColorBeige} stroke={gridColorNavy} strokeWidth="0.8" />
              <circle cx="-2" cy="9" r="0.8" fill={gridColorNavy} />
              <circle cx="2" cy="9" r="0.8" fill={gridColorNavy} />
            </g>

            {/* DOODLE 2: Zebra Wavy Stripe Ribbons in Top-Right Square (90, 30) */}
            <g transform="translate(90, 30)" opacity="0.8">
              {/* Flowing zebra stripe curves */}
              <path d="M -18 -10 C -8 -18 8 10 18 2" fill="none" stroke={gridColorNavy} strokeWidth="1.5" strokeLinecap="round" />
              <path d="M -14 -2 C -4 -10 12 18 22 10" fill="none" stroke={gridColorLavender} strokeWidth="1.4" strokeLinecap="round" />
              <path d="M -10 6 C 0 -2 16 24 24 16" fill="none" stroke={gridColorNavy} strokeWidth="1.2" strokeLinecap="round" />
              {/* Sparkle Star */}
              <path d="M 0 -18 L 1.5 -15 L 4.5 -13.5 L 1.5 -12 L 0 -9 L -1.5 -12 L -4.5 -13.5 L -1.5 -15 Z" fill="#F59E0B" opacity="0.9" />
            </g>

            {/* DOODLE 3: Zebra Hoofprint & Diamond Square in Bottom-Left Square (30, 90) */}
            <g transform="translate(30, 90)" opacity="0.8">
              {/* Zebra Hoofprint */}
              <path d="M 0 -6 A 5 5 0 0 1 6 0 L -6 0 A 5 5 0 0 1 0 -6 Z" fill={gridColorLavender} stroke={gridColorNavy} strokeWidth="0.8" />
              <path d="M 0 0 L 0 3" stroke={gridColorNavy} strokeWidth="0.8" />
              {/* Wavy accent lines */}
              <path d="M -16 12 Q 0 4 16 12" fill="none" stroke={gridColorNavy} strokeWidth="1.2" strokeLinecap="round" strokeDasharray="3 3" />
              {/* Diamond Node */}
              <rect x="-3" y="-18" width="6" height="6" fill="none" stroke={gridColorNavy} strokeWidth="1" transform="rotate(45 0 -15)" />
            </g>

            {/* DOODLE 4: Cute Heart & Zebra Stripe Accent in Bottom-Right Square (90, 90) */}
            <g transform="translate(90, 90)" opacity="0.85">
              {/* Hand-drawn Zebra Stripes Accent */}
              <path d="M -12 -12 Q 0 -4 12 -14" fill="none" stroke={gridColorNavy} strokeWidth="1.4" strokeLinecap="round" />
              <path d="M -10 -4 Q 0 4 10 -6" fill="none" stroke={gridColorLavender} strokeWidth="1.4" strokeLinecap="round" />
              {/* Cute Doodle Heart */}
              <path d="M 0 6 C -2 3 -7 4 -7 7.5 C -7 10.5 0 14 0 14 C 0 14 7 10.5 7 7.5 C 7 4 2 3 0 6 Z" fill="#EF4444" opacity="0.75" />
              {/* Micro star */}
              <circle cx="-12" cy="10" r="1.5" fill="#F59E0B" />
              <circle cx="12" cy="10" r="1.5" fill={gridColorNavy} />
            </g>

          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
    </div>
  );
}

export function BackgroundParticles() {
  return (
    <div id="rb-particles" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Keyframe animation definitions */}
      <style>{`
        @keyframes rbFloatParticle {
          0%, 100% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) translateX(8px) rotate(10deg);
          }
        }
        @keyframes rbFloatParticleRev {
          0%, 100% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
          }
          50% {
            transform: translateY(18px) translateX(-10px) rotate(-12deg);
          }
        }
        @keyframes rbSparkleShimmer {
          0%, 100% {
            opacity: 0.3;
            transform: scale(0.8) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1.35) rotate(45deg);
          }
        }
        @keyframes rbDriftSlow {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-12px) scale(1.04); }
        }
      `}</style>

      {/* Crisp Zebra Square Grid Doodle Background Layer */}
      <ZebraGridDoodle opacity={0.25} />

      {/* Dynamic Animated Particles Layer (36+ Sparkles, Orbs, Micro Squares, Zebra Curves) */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[...Array(36)].map((_, i) => {
          const type = i % 4; // 0: Sparkle Star, 1: Soft Glowing Orb, 2: Zebra Curve, 3: Micro Grid Square
          const topPct = (i * 13 + 7) % 95;
          const leftPct = (i * 19 + 5) % 96;
          const animDur = 4 + (i % 5) * 1.5;
          const animDelay = (i % 7) * 0.5;
          const animName = i % 2 === 0 ? "rbFloatParticle" : "rbFloatParticleRev";

          if (type === 0) {
            // 4-Point Vector Sparkle Star (✦)
            return (
              <div
                key={i}
                className="absolute"
                style={{
                  top: `${topPct}%`,
                  left: `${leftPct}%`,
                  animation: `rbSparkleShimmer ${animDur}s ease-in-out infinite ${animDelay}s, ${animName} ${animDur * 2}s ease-in-out infinite`,
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"
                    fill={i % 3 === 0 ? "#F59E0B" : i % 3 === 1 ? "#8B5CF6" : "#3B507D"}
                    opacity={0.8}
                  />
                </svg>
              </div>
            );
          } else if (type === 1) {
            // Soft Glowing Color Orb
            const size = 6 + (i % 4) * 4;
            const colors = [
              "bg-[#F59E0B]/50",
              "bg-[#3B507D]/40",
              "bg-[#8B5CF6]/50",
              "bg-[#06B6D4]/45",
              "bg-[#E7E2CE]/80"
            ];
            return (
              <div
                key={i}
                className={`absolute rounded-full blur-[0.5px] ${colors[i % colors.length]}`}
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  top: `${topPct}%`,
                  left: `${leftPct}%`,
                  animation: `${animName} ${animDur}s ease-in-out infinite ${animDelay}s`,
                }}
              />
            );
          } else if (type === 2) {
            // Floating Zebra Stripe Curve Accent
            return (
              <div
                key={i}
                className="absolute opacity-70"
                style={{
                  top: `${topPct}%`,
                  left: `${leftPct}%`,
                  animation: `${animName} ${animDur * 1.5}s ease-in-out infinite ${animDelay}s`,
                }}
              >
                <svg width="22" height="12" viewBox="0 0 28 14" fill="none">
                  <path
                    d="M 2 12 Q 14 0 26 12"
                    stroke={i % 2 === 0 ? "#3B507D" : "#A7A9C6"}
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            );
          } else {
            // Micro Grid Square Accent Tile
            return (
              <div
                key={i}
                className="absolute border border-[#3B507D]/40 bg-[#E7E2CE]/30 rounded-xs"
                style={{
                  width: "8px",
                  height: "8px",
                  top: `${topPct}%`,
                  left: `${leftPct}%`,
                  animation: `${animName} ${animDur * 1.8}s ease-in-out infinite ${animDelay}s`,
                }}
              />
            );
          }
        })}
      </div>

      {/* Ambient Glassmorphism Background Orbs */}
      <div className="absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-[#E7E2CE]/50 blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute top-1/3 -right-20 h-96 w-96 rounded-full bg-[#3B507D]/15 blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute top-2/3 left-10 h-80 w-80 rounded-full bg-[#EAECFD]/60 blur-3xl opacity-60 pointer-events-none" />
    </div>
  );
}


export function FlyingZebra() {
  const [position, setPosition] = useState({ x: -150, y: 100 });
  const [greeting, setGreeting] = useState("");
  const [showGreeting, setShowGreeting] = useState(false);
  const [direction, setDirection] = useState(1);


  useEffect(() => {
    let animationFrame: number;
    let lastTime = Date.now();
    let x = -150;
    let y = 100;
    let targetY = 100;
    let dir = 1;

    const animate = () => {
      const now = Date.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      // Move horizontally
      x += dir * 80 * delta;

      // Smooth vertical movement with some randomness
      if (Math.random() < 0.02) {
        targetY = 50 + Math.random() * 200;
      }
      y += (targetY - y) * 2 * delta;

      // Bounce off edges
      if (x > window.innerWidth + 150) {
        x = -150;
        dir = 1;
        setDirection(1);
      } else if (x < -150) {
        x = window.innerWidth + 150;
        dir = -1;
        setDirection(-1);
      }

      setPosition({ x, y });
      setDirection(dir);
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
  }, []);

  return (
    <div
      className="fixed pointer-events-none z-50 transition-transform duration-100"
      style={{
        left: position.x,
        top: position.y,
        transform: direction === -1 ? 'scaleX(-1)' : 'scaleX(1)'
      }}
    >
      <div className="relative">
        <ZebraWithButterfly size={80} />
      </div>
    </div>
  );
}

export function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([
    { role: "ai", text: "Hi! I'm your RareBridge AI guide. Ask me anything about rare diseases, symptoms, research, or how to use the platform." }
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  const QUICK = ["What is Krabbe disease?", "How do I find a specialist?", "What are common rare disease symptoms?"];

  function send(text: string) {
    if (!text.trim()) return;
    const userMsg = text.trim();
    setMessages(m => [...m, { role: "user", text: userMsg }]);
    setInput("");
    setTimeout(() => {
      const lower = userMsg.toLowerCase();
      let reply = "I can help with that! For detailed information on this topic, try searching the disease directory or browsing our specialist listings.";
      if (lower.includes("krabbe")) reply = "Krabbe disease is a rare inherited disorder that destroys the myelin sheath protecting nerve cells. It's caused by mutations in the GALC gene and most often appears in early infancy.";
      else if (lower.includes("specialist")) reply = "You can find specialists by clicking 'Specialists' in the navigation. You can filter by disease type, location, and expertise.";
      else if (lower.includes("symptom")) reply = "Common signs that may indicate a rare disease include developmental delays, unexplained muscle weakness, vision or hearing changes, and unusual lab results. Always consult a physician for evaluation.";
      else if (lower.includes("research")) reply = "Head to the Research section for the latest gene therapy breakthroughs, clinical trials, and pharmaceutical pipeline news for rare diseases.";
      setMessages(m => [...m, { role: "ai", text: reply }]);
    }, 800);
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {/* Floating button */}
      {/* <button
        onClick={() => setOpen(o => !o)}
        className="ai-assistant-control fixed right-5 bottom-24 md:bottom-8 z-50 flex items-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-bold text-ivory shadow-xl hover:bg-accent transition-all duration-200 hover:-translate-y-0.5 group"
        aria-label="Open AI Assistant"
      >
        <Bot className="w-5 h-5" />
        <span className="hidden sm:inline">RareBridge</span>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary" />
        </span>
      </button> */}

      {/* Popup panel */}
      {open && (
        <div className="fixed right-5 bottom-36 md:bottom-24 z-50 w-[340px] sm:w-[380px] rounded-xl bg-white border border-[#E5E0D6] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 bg-primary px-5 py-4">
            <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center shrink-0">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-ivory text-sm leading-none">RareBridge AI</p>
              <p className="text-taupe text-xs mt-0.5">Ask anything about rare diseases</p>
            </div>
            <button onClick={() => setOpen(false)} className="text-taupe hover:text-ivory transition-colors p-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 max-h-64 scrollbar-none">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${m.role === "user"
                  ? "bg-primary text-ivory rounded-br-sm"
                  : "bg-secondary text-primary rounded-bl-sm"
                  }`}>
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Quick questions */}
          <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-none">
            {QUICK.map(q => (
              <button key={q} onClick={() => send(q)} className="shrink-0 px-3 py-1.5 rounded-full bg-secondary text-primary text-xs font-semibold hover:bg-primary hover:text-ivory transition-colors whitespace-nowrap">
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="px-4 pb-4 pt-2">
            <div className="flex items-center gap-2 bg-ivory rounded-xl border border-taupe-40 px-3 py-2 focus-within:border-primary transition-colors">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && send(input)}
                placeholder="Ask a question…"
                className="flex-1 bg-transparent text-sm text-primary placeholder-taupe outline-none font-medium"
              />
              <button onClick={() => send(input)} className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center hover:bg-accent transition-colors shrink-0">
                <svg className="w-3.5 h-3.5 text-ivory" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function HeroIllustration() {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-72 h-72 rounded-full bg-gradient-to-br from-secondary to-taupe-30 blur-3xl" />
      </div>
      <svg viewBox="0 0 340 260" className="relative w-full max-w-md" fill="none">
        <circle cx="60" cy="40" r="3" fill="var(--switch-background)" opacity="0.5" />
        <circle cx="170" cy="20" r="4" fill="var(--secondary)" opacity="0.7" />
        <path d="M10 195 Q170 135 330 195" stroke="var(--primary)" strokeWidth="5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

// (imports consolidated at top)

export const JOURNEY_STEPS = [
  { icon: Thermometer, label: "Meet the Disease", desc: "Unusual signs appear — unexplained delays, weakness, or changes in behavior.", color: "bg-red-100 text-red-600", pinColor: "#EF4444" },
  { icon: Stethoscope, label: "What Happens?", desc: "Your family doctor refers you to a specialist for further evaluation.", color: "bg-blue-100 text-blue-600", pinColor: "#3B82F6" },
  { icon: ClipboardList, label: "Diagnosis", desc: "Genetic tests, enzyme panels, or imaging confirm the rare disease.", color: "bg-purple-100 text-purple-600", pinColor: "#8B5CF6" },
  { icon: Pill, label: "Treatment", desc: "A care team creates a personalized management and therapy plan.", color: "bg-green-100 text-green-600", pinColor: "#10B981" },
  { icon: Users, label: "Living & Support", desc: "Connect with families and organizations who share your experience.", color: "bg-yellow-100 text-yellow-600", pinColor: "#F59E0B" },
];

export function PatientJourney() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="py-14 md:py-20 bg-gradient-to-b from-white to-taupe-20/50 relative overflow-hidden">
      {/* Elegant Background Curvy Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-60 z-0">
        <svg className="w-full h-full text-accent" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1440 800" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M-100 600 C 300 400, 600 800, 1000 500 C 1300 300, 1500 600, 1600 500" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.15" fill="none" />
          <path d="M-100 650 C 400 300, 700 900, 1100 450 C 1400 200, 1500 700, 1600 600" stroke="var(--primary)" strokeWidth="2" strokeOpacity="0.08" fill="none" />
          <path d="M-100 550 C 200 500, 500 700, 900 600 C 1200 500, 1400 800, 1600 650" stroke="currentColor" strokeWidth="1" strokeOpacity="0.1" fill="none" />
          <path d="M-100 200 C 300 400, 700 50, 1100 250 C 1300 350, 1500 150, 1600 200" stroke="currentColor" strokeWidth="1" strokeOpacity="0.15" fill="none" />
          <path d="M-100 150 C 400 100, 800 300, 1200 150 C 1400 50, 1500 250, 1600 150" stroke="var(--primary)" strokeWidth="0.5" strokeOpacity="0.1" fill="none" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 md:mb-14">
          <h2 className="text-xs font-bold text-accent tracking-[0.2em] uppercase mb-3">Diagnostic Journey</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-primary mb-4 tracking-tight">Understanding the Path</h3>
          <p className="text-accent text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Navigating the complexities of a rare disease can be overwhelming. Here is a guide to what the journey often looks like, step by step.
          </p>
        </div>

        {/* Modern Stepper */}
        <div className="relative max-w-5xl mx-auto mb-14">
          {/* Connecting Line (Desktop) */}
          <div className="absolute top-8 left-0 w-full h-1 bg-taupe-20 -translate-y-1/2 rounded-full hidden md:block"></div>
          <div
            className="absolute top-8 left-0 h-1 bg-accent -translate-y-1/2 rounded-full hidden md:block transition-all duration-700 ease-in-out"
            style={{ width: `${(activeStep / (JOURNEY_STEPS.length - 1)) * 100}%` }}
          ></div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-0 relative z-10">
            {JOURNEY_STEPS.map((step, i) => {
              const Icon = step.icon as any;
              const isActive = activeStep === i;
              const isPast = i < activeStep;

              return (
                <button
                  key={step.label}
                  onClick={() => setActiveStep(i)}
                  className={`group relative flex flex-col items-center gap-4 transition-all duration-300 w-full md:w-32 focus:outline-none`}
                >
                  {/* Icon Circle */}
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 z-10 ${isActive
                      ? 'bg-accent text-white scale-110 shadow-lg ring-4 ring-white'
                      : isPast
                        ? 'bg-primary text-white hover:bg-primary-dark ring-4 ring-white'
                        : 'bg-white text-taupe border-2 border-taupe-40 hover:border-accent hover:text-accent ring-4 ring-white'
                      }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  {/* Label */}
                  <div className="text-center w-full">
                    <span className={`block text-xs font-bold uppercase tracking-wider mb-1 transition-colors ${isActive ? 'text-accent' : isPast ? 'text-primary' : 'text-taupe'}`}>
                      Step {i + 1}
                    </span>
                    <span className={`block text-sm font-bold transition-colors ${isActive ? 'text-primary' : 'text-accent'}`}>
                      {step.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modern Detail Card */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl p-6 md:p-8 border border-[#E5E0D6] transition-all duration-300 hover:border-accent/40">
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
              <div className="flex-shrink-0">
                {(() => {
                  const Icon = JOURNEY_STEPS[activeStep].icon as any;
                  return (
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl bg-accent-10 flex items-center justify-center transform rotate-1">
                      <Icon className="w-10 h-10 md:w-12 md:h-12 text-accent" />
                    </div>
                  );
                })()}
              </div>
              <div className="text-center md:text-left flex-1">
                <div className="inline-block px-4 py-1.5 bg-secondary/30 text-primary text-xs font-bold tracking-widest uppercase rounded-full mb-4">
                  Phase {activeStep + 1}
                </div>
                <h4 className="text-2xl md:text-3xl font-bold text-primary mb-3 leading-tight">
                  {JOURNEY_STEPS[activeStep].label}
                </h4>
                <p className="text-accent text-base md:text-lg leading-relaxed">
                  {JOURNEY_STEPS[activeStep].desc}
                </p>
              </div>
            </div>

            {/* Quick Navigation */}
            <div className="flex justify-center md:justify-start gap-2 mt-7 md:mt-6 md:ml-34">
              {JOURNEY_STEPS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveStep(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${i === activeStep ? 'w-10 bg-accent' : 'w-2 bg-taupe hover:bg-accent/50'
                    }`}
                  aria-label={`Go to step ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Accordion({ items }: { items: { title: string; content: React.ReactNode }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="border border-taupe-40 rounded-2xl overflow-hidden bg-white">
          <button className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-primary hover:bg-ivory transition-colors" onClick={() => setOpen(open === i ? null : i)}>
            <span>{item.title}</span>
            {open === i ? <svg className="w-4 h-4" /> : <svg className="w-4 h-4" />}
          </button>
          {open === i && <div className="px-5 pb-5 text-accent leading-relaxed text-sm border-t border-secondary"><div className="pt-3">{item.content}</div></div>}
        </div>
      ))}
    </div>
  );
}

export function DiseaseCard({ disease, onClick }: { disease: Disease; onClick: () => void }) {
  const getCardVisual = (category?: string, name?: string) => {
    const text = (category || "").toLowerCase() + " " + (name || "").toLowerCase();

    if (text.includes("heart") || text.includes("cardio") || text.includes("vascular")) {
      return {
        image: "/rarebridge_family_photo.png",
        icon: Heart,
        gradient: "from-[#112250] via-[#1F3366] to-[#3B507D]",
        categoryLabel: "Heart & Vascular",
      };
    }
    if (text.includes("neuro") || text.includes("brain") || text.includes("leuko") || text.includes("dystrophy") || text.includes("alexander") || text.includes("canavan")) {
      return {
        image: "/rarebridge_zebra_reading.png",
        icon: Brain,
        gradient: "from-[#112250] via-[#1A2E63] to-[#2C3E6B]",
        categoryLabel: "Neurological & Brain",
      };
    }
    if (text.includes("genet") || text.includes("dna") || text.includes("adreno") || text.includes("cancer") || text.includes("carcinoma")) {
      return {
        image: "/rarebridge_zebra_with_book.png",
        icon: Dna,
        gradient: "from-[#112250] via-[#1A3A4B] to-[#254F5E]",
        categoryLabel: "Genetic & Cell",
      };
    }
    if (text.includes("metabol") || text.includes("storage") || text.includes("syndrome") || text.includes("gaucher") || text.includes("fabry")) {
      return {
        image: "/rarebridge_hero_child.png",
        icon: HeartPulse,
        gradient: "from-[#112250] via-[#243B6B] to-[#3B507D]",
        categoryLabel: "Metabolic Care",
      };
    }
    return {
      image: "/rarebridge_zebra_with_book.png",
      icon: Stethoscope,
      gradient: "from-[#112250] via-[#1A2E63] to-[#20345F]",
      categoryLabel: disease.category || "Rare Condition",
    };
  };

  const visual = getCardVisual(disease.category, disease.name);
  const IconComp = visual.icon;

  return (
    <div
      className="group relative overflow-hidden rounded-3xl border-2 border-[#E7E2CE] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#112250] cursor-pointer flex flex-col justify-between"
      onClick={onClick}
    >
      {/* Child-friendly illustrated header */}
      <div className={`relative h-40 w-full overflow-hidden bg-gradient-to-r ${visual.gradient}`}>
        <img
          src={visual.image}
          alt={disease.name}
          className="h-full w-full object-cover opacity-35 transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#112250] via-[#112250]/40 to-transparent" />

        {/* Category Icon Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-[#112250] shadow-xs border border-white/60">
          <IconComp className="h-3.5 w-3.5 text-[#112250]" />
          <span>{visual.categoryLabel}</span>
        </div>

        <div className="absolute bottom-3 left-4 right-4">
          <span className="inline-block rounded-lg bg-white/20 px-2.5 py-0.5 text-[10px] font-bold text-[#E7E2CE] border border-white/30 backdrop-blur-xs mb-1">
            {(disease as any).researchStatus || "Active Research"}
          </span>
          <h3 className="font-heading font-black text-white text-lg leading-tight truncate">
            {disease.name}
          </h3>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <p className="font-sans text-xs text-[#3B507D] leading-relaxed line-clamp-2 mb-4 font-medium">
          {disease.shortDesc || disease.overview?.simple || (typeof disease.overview === "string" ? disease.overview : "Plain-language medical summary.")}
        </p>

        <div className="font-sans flex items-center justify-between border-t border-[#E7E2CE] pt-3 text-xs font-black text-[#112250] group-hover:text-[#3B507D]">
          <span>View Overview & Research</span>
          <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
        </div>
      </div>
    </div>
  );
}

const zebraDefaultCursor = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><polygon points="2,2 18,10 11,13 14,22 10,24 7,15 2,18" fill="%233B507D" stroke="%23FFFFFF" stroke-width="1.5"/><g transform="translate(15,13) scale(0.65)"><ellipse cx="-7" cy="-10" rx="3" ry="6" fill="%23E7E2CE" stroke="%23112250" stroke-width="1" transform="rotate(-20 -7 -10)"/><ellipse cx="7" cy="-10" rx="3" ry="6" fill="%23E7E2CE" stroke="%23112250" stroke-width="1" transform="rotate(20 7 -10)"/><path d="M -9 -4 C -10 4 -6 12 0 13 C 6 12 10 4 9 -4 C 9 -9 -9 -9 -9 -4 Z" fill="%23FFFFFF" stroke="%23112250" stroke-width="1.5"/><path d="M -6 -5 Q 0 -8 6 -5" stroke="%23112250" stroke-width="1.2" fill="none"/><path d="M -7 -1 Q 0 -4 7 -1" stroke="%23112250" stroke-width="1.2" fill="none"/><path d="M -5 3 Q 0 1 5 3" stroke="%23112250" stroke-width="1.2" fill="none"/><circle cx="-3" cy="-1" r="1.2" fill="%23112250"/><circle cx="3" cy="-1" r="1.2" fill="%23112250"/><ellipse cx="0" cy="7" rx="5" ry="3" fill="%23E7E2CE" stroke="%23112250" stroke-width="1"/><circle cx="-1.5" cy="7" r="0.6" fill="%23112250"/><circle cx="1.5" cy="7" r="0.6" fill="%23112250"/></g></svg>`;

const zebraPointerCursor = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34"><polygon points="2,2 19,11 12,14 15,24 11,26 8,16 2,20" fill="%23F59E0B" stroke="%23FFFFFF" stroke-width="1.5"/><g transform="translate(17,15) scale(0.8)"><path d="M 0 -7 A 6 6 0 0 1 7 0 L -7 0 A 6 6 0 0 1 0 -7 Z" fill="%233B507D" stroke="%23FFFFFF" stroke-width="1"/><path d="M 0 0 L 0 4" stroke="%23FFFFFF" stroke-width="1"/><circle cx="-3" cy="5" r="1.2" fill="%23F59E0B"/><circle cx="3" cy="5" r="1.2" fill="%23F59E0B"/></g></svg>`;

export function ZebraCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isPointer, setIsPointer] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [trails, setTrails] = useState<Array<{ id: number; x: number; y: number }>>([]);

  useEffect(() => {
    let count = 0;
    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });

      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable = !!target.closest('button, a, [role="button"], input, select, textarea, .cursor-pointer');
        setIsPointer(isClickable);
      }

      count++;
      if (count % 3 === 0) {
        const newTrail = { id: Date.now() + Math.random(), x: e.clientX, y: e.clientY };
        setTrails((prev) => [...prev.slice(-7), newTrail]);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <>
      <style>{`
        body, html, div, main, p, span, section, header, footer, nav {
          cursor: url('${zebraDefaultCursor}') 2 2, auto !important;
        }
        button, a, [role="button"], input, select, textarea, .cursor-pointer, button *, a * {
          cursor: url('${zebraPointerCursor}') 2 2, pointer !important;
        }
      `}</style>

      <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
        {trails.map((t) => (
          <div
            key={t.id}
            className="absolute rounded-full bg-[#F59E0B] opacity-80 animate-ping"
            style={{
              left: `${t.x + 10}px`,
              top: `${t.y + 14}px`,
              width: "6px",
              height: "6px",
              animationDuration: "0.5s",
            }}
          />
        ))}

        <div
          className="absolute transition-transform duration-75 ease-out"
          style={{
            transform: `translate3d(${pos.x + 14}px, ${pos.y + 14}px, 0) scale(${isClicking ? 0.75 : isPointer ? 1.25 : 1})`,
            opacity: pos.x < 0 ? 0 : 0.95,
          }}
        >
          <div className="flex items-center justify-center rounded-full bg-white/95 p-1 shadow-md border border-[#3B507D]/40 backdrop-blur-xs">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <ellipse cx="6" cy="4" rx="2" ry="4" fill="#E7E2CE" transform="rotate(-15 6 4)" />
              <ellipse cx="18" cy="4" rx="2" ry="4" fill="#E7E2CE" transform="rotate(15 18 4)" />
              <path d="M 4 8 C 3 17 8 22 12 23 C 16 22 21 17 20 8 Z" fill="#112250" />
              <path d="M 8 9 Q 12 7 16 9 M 7 12 Q 12 10 17 12 M 9 15 Q 12 13 15 15" stroke="#FFFFFF" strokeWidth="1.2" fill="none" />
              <circle cx="9" cy="12" r="1" fill="#FFFFFF" />
              <circle cx="15" cy="12" r="1" fill="#FFFFFF" />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
}

