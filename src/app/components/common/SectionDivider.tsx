import React from "react";
import { SmartIcon as Icon } from "./Icon";
import { DrippingScallopDivider } from "./DrippingScallopDivider";

export { DrippingScallopDivider };

interface SectionDividerProps {
  label?: string;
  icon?: string;
  variant?: "line" | "wave" | "gradient" | "curve" | "scallop" | "drip";
  color?: "navy" | "blue" | "ice" | "white" | string;
  flip?: boolean;
  className?: string;
}

/**
 * SectionDivider
 * Supports both glowing gradient line dividers with badges and the brand scalloped/dripping divider.
 */
export function SectionDivider({
  label,
  icon,
  variant = "line",
  color = "blue",
  flip = false,
  className = "",
}: SectionDividerProps) {
  if (variant === "wave" || variant === "curve" || variant === "scallop" || variant === "drip") {
    return (
      <div className={`relative w-full ${className}`}>
        <DrippingScallopDivider color={color} flip={flip} />
        {label && (
          <div className="relative -mt-6 flex justify-center z-10">
            <div className="flex items-center gap-2 rounded-full border border-[#BCE0F5] bg-white px-4 py-1.5 text-xs font-bold text-[#112250] shadow-sm">
              {icon && <Icon name={icon} className="text-sm text-[#112250]" />}
              <span className="font-callout text-[11px] uppercase tracking-widest">{label}</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative my-8 flex items-center justify-center ${className}`}>
      {/* Gradient glowing line */}
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#BCE0F5] to-transparent" />
      </div>

      {/* Floating center node badge */}
      {label && (
        <div className="relative z-10 flex items-center gap-2 rounded-full border border-[#BCE0F5] bg-[#EDF6FC] px-4 py-1.5 text-xs font-bold text-[#112250] shadow-xs">
          {icon && <Icon name={icon} className="text-sm text-[#112250]" />}
          <span className="font-callout text-[11px] uppercase tracking-widest">{label}</span>
        </div>
      )}
    </div>
  );
}

export default SectionDivider;
