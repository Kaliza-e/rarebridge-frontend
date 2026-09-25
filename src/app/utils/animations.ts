import { Variants, Transition } from "framer-motion";

/**
 * RareBridge Standard Transition Curves
 * Calibrated for warmth, hope, calmness, and clarity.
 */
export const TransitionCurve = {
  softSpring: { type: "spring", stiffness: 350, damping: 25 },
  gentleEase: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1.0] },
  quickEase: { duration: 0.25, ease: "easeOut" },
};

/**
 * Page Entrance & Section Reveal Variants
 */
export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1.0] },
  },
};

export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

/**
 * Grid Stagger Container Variant
 */
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
};

/**
 * Interactive Card Hover & Tap Variants
 * Restrained upward movement (2px) and clean border focus.
 */
export const cardInteractiveVariants: Variants = {
  rest: { y: 0, opacity: 1 },
  hover: {
    y: -2,
    transition: { duration: 0.25, ease: "easeOut" },
  },
  tap: {
    y: 0,
    scale: 0.99,
    transition: { duration: 0.1 },
  },
};

/**
 * Button Hover & Tap Micro-Interactions
 */
export const buttonInteractionVariants: Variants = {
  rest: { y: 0, scale: 1 },
  hover: {
    y: -1,
    scale: 1.01,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  tap: {
    y: 0,
    scale: 0.98,
    transition: { duration: 0.1 },
  },
};

/**
 * Overlay & Modal Variants (Backdrop + Panel)
 */
export const overlayBackdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export const modalPanelVariants: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: 8,
    scale: 0.97,
    transition: { duration: 0.2 },
  },
};

/**
 * Dropdown Menu Variants
 */
export const dropdownVariants: Variants = {
  hidden: { opacity: 0, y: -6, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -4,
    scale: 0.97,
    transition: { duration: 0.15 },
  },
};
