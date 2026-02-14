/**
 * Shared Animation Design System for JamboScript
 *
 * Centralizes all spring presets, SVG palettes, and animation helpers
 * so characters + scenes feel cohesive and professional.
 *
 * Design principles:
 * - Spring physics over keyframe arrays (organic, never robotic)
 * - Overlapping action: body leads → head follows → accessories trail
 * - Squash & stretch: subtle, never more than ±8%
 * - Celebrations decay and settle (no infinite chaos)
 * - Reduced motion fully respected
 */

import type { Transition } from 'framer-motion';

// ─── Spring Presets ──────────────────────────────────────────────────
// Named after feel, not after where they're used.

/** Slow, dreamy sway — idle breathing, floating */
export const springGentle: Transition = {
  type: 'spring',
  stiffness: 18,
  damping: 6,
  mass: 1.6,
  restDelta: 0.01,
};

/** Quick, responsive — speaking gestures, eye darting */
export const springSnappy: Transition = {
  type: 'spring',
  stiffness: 280,
  damping: 18,
  mass: 0.6,
};

/** Overshoot then settle — celebrate bounce, entrance pop */
export const springBouncy: Transition = {
  type: 'spring',
  stiffness: 160,
  damping: 10,
  mass: 0.8,
};

/** Very soft, like fabric or hair — beard, robe trim */
export const springDrapey: Transition = {
  type: 'spring',
  stiffness: 12,
  damping: 4,
  mass: 2,
};

/** Crisp snap — UI elements, badges, panels */
export const springUI: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 30,
  mass: 0.5,
};

// ─── Repeating Spring Helpers ────────────────────────────────────────

/** Creates a smooth looping transition (uses tween for loops, springs can't repeat) */
export function loopSmooth(duration: number, delay = 0): Transition {
  return {
    duration,
    repeat: Infinity,
    repeatType: 'mirror' as const,
    ease: [0.45, 0.05, 0.55, 0.95], // sine-like, softer than easeInOut
    delay,
  };
}

/** Creates a subtle idle loop — very gentle */
export function idleLoop(duration: number, delay = 0): Transition {
  return {
    duration,
    repeat: Infinity,
    repeatType: 'mirror' as const,
    ease: [0.37, 0, 0.63, 1], // cubic-ease-in-out, natural breathing
    delay,
  };
}

/** One-shot settle (celebration that decays) */
export function settleOnce(delay = 0): Transition {
  return {
    type: 'spring' as const,
    stiffness: 200,
    damping: 12,
    mass: 0.7,
    delay,
  };
}

/** Stagger delay helper — overlapping action with body-part hierarchy */
export function stagger(partIndex: number, baseDelay = 0): number {
  return baseDelay + partIndex * 0.08;
}

// ─── Blink Timing ────────────────────────────────────────────────────
// Blink: hold open → quick close → quick open. Natural = 4-6s cycle.
export const blinkTiming = {
  duration: 5,
  repeat: Infinity,
  times: [0, 0.92, 0.96, 1], // long open, quick shut, quick open
};

// ─── Character Color Palettes (matching character-designs.json) ─────

export const kitoPalette = {
  skin: '#8BC34A',
  skinLight: '#A5D66F',
  skinDark: '#6B9B37',
  shell: '#3DA85C',
  shellDark: '#2D8B47',
  shellLight: '#4ABA6A',
  belly: '#FEF08A',
  bellyDark: '#EAB308',
  hat: '#D4A017',
  hatBand: '#8B6914',
  eyes: '#1E1B4B',
  stroke: '#2D5A1E',
  accent: '#FACC15', // kanga gold diamonds
} as const;

export const mzeePalette = {
  skin: '#A07D1C',
  skinLight: '#C4A033',
  robe: '#3B3875',
  robeDark: '#312E81',
  robeLight: '#4F4B8F',
  kofia: '#14B8A6',
  kofiaBand: '#FACC15',
  beard: '#F0EBE0',
  beardStroke: '#D4CFC4',
  eyes: '#F59E0B',
  eyesDark: '#1E1B4B',
  staff: '#78350F',
  staffOrb: '#14B8A6',
  staffOrbGlow: '#2DD4BF',
  trimGold: '#FACC15',
  stroke: '#28265A',
} as const;

export const shidaPalette = {
  body: '#DC2626',
  bodyDark: '#991B1B',
  bodyLight: '#EF4444',
  legs: '#B91C1C',
  legsDark: '#7F1D1D',
  eyes: '#FBBF24',
  eyesSclera: '#1E1B4B',
  antennae: '#FBBF24',
  antennaGlow: '#FDE68A',
  mouth: '#1E1B4B',
  glitchBlue: '#3B82F6',
  glitchGreen: '#10B981',
  stroke: '#7F1D1D',
} as const;

// ─── Shared SVG Constants ────────────────────────────────────────────

export const SVG_DEFAULTS = {
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  strokeWidth: 2.5,
};

/** Thinner stroke for delicate details — use explicitly, not via spread */
export const THIN_STROKE = 1.5;

// ─── Accent / UI Colors ─────────────────────────────────────────────

export const accentGold = '#FACC15';
export const accentTeal = '#14B8A6';
