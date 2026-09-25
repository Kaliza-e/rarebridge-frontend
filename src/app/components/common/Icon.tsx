import React from "react";
import {
  Search,
  ArrowRight,
  ArrowLeft,
  ArrowUpRight,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Heart,
  ShieldCheck,
  Users,
  Stethoscope,
  Microscope,
  Dna,
  FlaskConical,
  Download,
  BookOpen,
  HelpCircle,
  Lightbulb,
  MapPin,
  Activity,
  MessageSquare,
  Sparkles,
  Bot,
  Zap,
  Thermometer,
  Pill,
  Syringe,
  HandHeart,
  AlertCircle,
  Lock,
  Mail,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react";

export type IconProp = string | React.ComponentType<{ className?: string }> | any;

export interface IconProps {
  name?: IconProp;
  icon?: IconProp;
  className?: string;
  size?: number | string;
}

// Complete lookup dictionary mapping icon string names directly to Lucide SVG components
const ICON_MAP: Record<string, LucideIcon> = {
  // Navigation & Actions
  search: Search,
  arrow_forward: ArrowRight,
  arrow_back: ArrowLeft,
  arrow_outward: ArrowUpRight,
  chevron_right: ChevronRight,
  chevron_left: ChevronLeft,
  download: Download,
  file_download: Download,
  menu: Menu,
  close: X,
  x: X,

  // Medical & Science
  stethoscope: Stethoscope,
  medical_services: Stethoscope,
  microscope: Microscope,
  biotech: Microscope,
  science: FlaskConical,
  flask: FlaskConical,
  dna: Dna,
  genetics: Dna,
  activity: Activity,
  thermometer: Thermometer,
  pill: Pill,
  syringe: Syringe,

  // Community & Care
  groups: Users,
  diversity_3: Users,
  users: Users,
  volunteer_activism: Heart,
  favorite: Heart,
  heart: Heart,
  hand_heart: HandHeart,

  // Info & Trust
  menu_book: BookOpen,
  book: BookOpen,
  auto_stories: BookOpen,
  verified_user: ShieldCheck,
  shield: ShieldCheck,
  lightbulb: Lightbulb,
  help: HelpCircle,
  help_outline: HelpCircle,
  alert_circle: AlertCircle,
  forum: MessageSquare,
  location_on: MapPin,
  map_pin: MapPin,
  check_circle: CheckCircle,
  sparkles: Sparkles,
  bot: Bot,
  zap: Zap,
  lock: Lock,
  mail: Mail,
};

/**
 * Universal Icon component that renders Lucide SVG icons cleanly, with 100% reliability for both:
 * 1. String icon names (mapped to SVG)
 * 2. Lucide React component objects
 */
export function SmartIcon({ name, icon, className = "", size }: IconProps) {
  const target = name ?? icon;

  if (!target) {
    return null;
  }

  // If target is a React Component object or function
  if (typeof target === "function" || (typeof target === "object" && target !== null && "$$typeof" in target)) {
    const Component = target;
    const style = size ? { width: size, height: size } : undefined;
    return <Component className={className} style={style} />;
  }

  // If target is a string name
  if (typeof target === "string" || typeof target === "number") {
    const key = String(target).trim().toLowerCase();
    const SVGIcon = ICON_MAP[key];

    if (SVGIcon) {
      const style = size ? { width: size, height: size } : undefined;
      return <SVGIcon className={className} style={style} />;
    }

    // Fallback if not found in dictionary
    const style = size ? { fontSize: typeof size === "number" ? `${size}px` : size } : undefined;
    return (
      <span
        className={`material-symbols-rounded select-none inline-block align-middle ${className}`}
        style={style}
        aria-hidden="true"
      >
        {String(target)}
      </span>
    );
  }

  return null;
}

export const MaterialIcon = SmartIcon;
export const Icon = SmartIcon;
export default SmartIcon;
