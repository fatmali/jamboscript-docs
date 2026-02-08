'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hint } from '@/lib/types';
import { useGameStore } from '@/lib/store';
import { useTranslations } from 'next-intl';

interface ChallengePanelProps {
  riddle: string;
  hints: Hint[];
  chapterSlug: string;
  /** Error message from last run (if any) */
  error?: string;
  /** Whether the puzzle is solved */
  solved?: boolean;
}

export default function ChallengePanel({
  riddle,
  hints,
  chapterSlug,
  error,
  solved,
}: ChallengePanelProps) {
  const { getChapterProgress, unlockHint, spendStar, player } = useGameStore();
  const progress = getChapterProgress(chapterSlug);
  const [showHints, setShowHints] = useState(false);
  const t = useTranslations('Challenge');

  const handleUnlockHint = (hint: Hint) => {
    if (progress.hintsUsed.includes(hint.id)) return; // Already unlocked
    if (hint.starCost === 0) {
      unlockHint(chapterSlug, hint.id);
      return;
    }
    if (player.totalStars < hint.starCost) return;
    // Spend stars
    for (let i = 0; i < hint.starCost; i++) {
      spendStar();
    }
    unlockHint(chapterSlug, hint.id);
  };

  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="px-4 py-3 bg-bg-card/80 backdrop-blur-md border-t border-white/5"
    >
      {/* Riddle */}
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <p className="text-sm sm:text-base text-text-primary font-semibold leading-relaxed">
            {riddle}
          </p>
        </div>

        {/* Hints toggle */}
        <button
          onClick={() => setShowHints(!showHints)}
          className="shrink-0 px-3 py-1.5 rounded-full text-xs font-bold bg-bg-surface hover:bg-bg-surface/80 text-text-secondary transition-all flex items-center gap-1"
        >
          <span>💡</span>
          <span>{t('hints')} ({hints.length})</span>
        </button>
      </div>

      {/* Error display */}
      <AnimatePresence>
        {error && !solved && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 p-2.5 rounded-lg bg-error/10 border border-error/20"
          >
            <p className="text-xs text-error flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success display */}
      <AnimatePresence>
        {solved && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-2 p-2.5 rounded-lg bg-success/10 border border-success/20"
          >
            <p className="text-xs text-success font-bold flex items-center gap-2">
              <span>🎉</span>
              <span>{t('congratulations')}</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hints panel */}
      <AnimatePresence>
        {showHints && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-3 space-y-2"
          >
            {hints.map((hint, idx) => {
              const isUnlocked = hint.starCost === 0 || progress.hintsUsed.includes(hint.id);
              const canAfford = player.totalStars >= hint.starCost;

              return (
                <motion.div
                  key={hint.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-start gap-2"
                >
                  {isUnlocked ? (
                    <div className="flex-1 p-2 rounded-lg bg-bg-deep/50 text-sm text-text-secondary">
                      <span className="text-secondary mr-1.5">💡</span>
                      {hint.text}
                    </div>
                  ) : (
                    <button
                      onClick={() => handleUnlockHint(hint)}
                      disabled={!canAfford}
                      className={`flex-1 p-2 rounded-lg text-sm text-left transition-all ${
                        canAfford
                          ? 'bg-secondary/10 text-secondary hover:bg-secondary/20 cursor-pointer'
                          : 'bg-bg-deep/30 text-text-muted cursor-not-allowed'
                      }`}
                    >
                      <span className="mr-1.5">🔒</span>
                      {t('hintLabel', { number: idx + 1 })}
                      {hint.starCost > 0 && (
                        <span className="ml-2 text-xs">
                          (⭐ {hint.starCost})
                        </span>
                      )}
                    </button>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
