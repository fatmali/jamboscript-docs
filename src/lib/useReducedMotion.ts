'use client';

import { useState, useEffect } from 'react';

/**
 * Hook that detects the user's `prefers-reduced-motion` OS setting.
 * Returns `true` when the user prefers reduced motion.
 *
 * Usage with Framer Motion:
 * ```tsx
 * const reduced = useReducedMotion();
 * <motion.div animate={reduced ? {} : { y: [0, -10, 0] }} />
 * ```
 */
export function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mql.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return prefersReduced;
}
