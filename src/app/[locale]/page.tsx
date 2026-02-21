'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore, useStoreHydrated } from '@/lib/store';
import { initAudio } from '@/lib/sound';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { Link } from '@/i18n/navigation';
import KitoCharacter from '@/components/characters/KitoCharacter';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { useReducedMotion } from '@/lib/useReducedMotion';

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export default function LandingPage() {
  const router = useRouter();
  const { player } = useGameStore();
  const hydrated = useStoreHydrated();
  const [showContent, setShowContent] = useState(false);
  const [showCTA, setShowCTA] = useState(false);
  const t = useTranslations('Landing');
  const reduced = useReducedMotion();

  const stars = useMemo(
    () =>
      Array.from({ length: 60 }).map((_, i) => ({
        size: seededRandom(i * 7 + 1) * 3 + 1,
        left: seededRandom(i * 7 + 3) * 100,
        top: seededRandom(i * 7 + 4) * 100,
        dur: 2 + seededRandom(i * 7 + 5) * 3,
        del: seededRandom(i * 7 + 6) * 3,
      })),
    []
  );

  useEffect(() => {
    setTimeout(() => setShowContent(true), 200);
    setTimeout(() => setShowCTA(true), 800);
  }, []);

  const handleStart = () => {
    initAudio();
    if (player.chaptersCompleted > 0) {
      router.push('/hadithi');
    } else {
      router.push('/hadithi/sura-1');
    }
  };

  return (
    <div className="min-h-[100dvh] bg-bg-deep relative overflow-hidden flex flex-col items-center justify-center px-4 safe-area-all">
      {/* Language Switcher — safe inset on mobile */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20">
        <LanguageSwitcher />
      </div>

      {/* Animated background stars */}
      <div className="absolute inset-0 overflow-hidden">
        {stars.map((s, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-twinkle"
            style={{
              width: s.size,
              height: s.size,
              left: `${s.left}%`,
              top: `${s.top}%`,
              animationDuration: `${s.dur}s`,
              animationDelay: `${s.del}s`,
            }}
          />
        ))}
      </div>

      {/* Gradient orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      {/* Main content */}
      <div className="relative z-10 text-center max-w-2xl w-full">
        {/* Kito character */}
        <AnimatePresence>
          {showContent && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="w-36 h-36 sm:w-44 sm:h-44 mx-auto mb-6"
            >
              <KitoCharacter />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Title */}
        <AnimatePresence>
          {showContent && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black mb-4 leading-tight">
                <span className="gradient-text">JamboScript</span>
              </h1>
              <p className="text-xl sm:text-2xl text-text-secondary font-semibold mb-2">
                {t('subtitle')}
              </p>
              <p className="text-sm sm:text-base text-text-muted max-w-md mx-auto leading-relaxed">
                {t('description')}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA Button */}
        <AnimatePresence>
          {showCTA && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="mt-10"
            >
              <button
                onClick={handleStart}
                className="glow-button px-10 py-4 text-lg sm:text-xl animate-pulse-glow"
              >
                {hydrated && player.chaptersCompleted > 0 ? t('continueSafari') : t('startSafari')}
              </button>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut', delay: 0.3 }}
                className="mt-6 text-xs text-text-muted"
              >
                {t('clickToStart')}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom nav links */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: reduced ? 0 : 1.3 }}
        className="relative z-10 mt-8 pb-6 safe-bottom flex flex-wrap justify-center gap-4 sm:gap-6 text-xs text-text-muted">
        <Link href="/cheza" className="hover:text-secondary transition-colors py-2 px-3 min-h-[44px] flex items-center">
          {t('playgroundLink')}
        </Link>
        <Link href="/mzazi" className="hover:text-accent transition-colors py-2 px-3 min-h-[44px] flex items-center">
          {t('parentsLink')}
        </Link>
        <Link href="/mzazi/faragha" className="hover:text-text-secondary transition-colors py-2 px-3 min-h-[44px] flex items-center">
          🔒 {t('privacyLink')}
        </Link>
      </motion.div>
    </div>
  );
}
