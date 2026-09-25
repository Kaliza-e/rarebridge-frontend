import React from "react";
import { SmartIcon as Icon } from "./Icon";

interface SectionDividerProps {
  label?: string;
  icon?: string;
  variant?: "line" | "wave" | "gradient" | "curve";
  className?: string;
}

/**
 * Innovative & Modern Section Separator
 * Replaces plain borders with elegant organic curves, glowing nodes, and subtle pattern transitions.
 */
export function SectionDivider({
  label,
  icon,
  variant = "line",
  className = "",
}: SectionDividerProps) {
  if (variant === "wave" || variant === "curve") {
    return null;
  }

  return (
    <div className={`relative my-8 flex items-center justify-center ${className}`}>
      {/* Gradient glowing line */}
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#3B507D]/25 to-transparent" />
      </div>

      {/* Floating innovative center node badge */}
      {label && (
        <div className="relative z-10 flex items-center gap-2 rounded-full border border-[#D8D3C8] bg-[#F8F7F2] px-4 py-1.5 text-xs font-bold text-[#3B507D]">
          {icon && <Icon name={icon} className="text-sm text-[#7A8A70]" />}
          <span className="font-callout text-[11px] uppercase tracking-widest">{label}</span>
        </div>
      )}
    </div>
  );
}

export default SectionDivider;
