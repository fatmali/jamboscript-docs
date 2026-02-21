'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hint, ExerciseType } from '@/lib/types';
import { useGameStore, useStoreHydrated } from '@/lib/store';
import { useTranslations } from 'next-intl';
import { hapticLight, hapticWarning } from '@/lib/haptics';

interface ChallengePanelProps {
  riddle: string;
  hints: Hint[];
  chapterSlug: string;
  /** Error message from last run (if any) */
  error?: string;
  /** Whether the current exercise is solved */
  solved?: boolean;
  /** Current exercise index (0-based) */
  exerciseIndex?: number;
  /** Total number of exercises in this chapter */
  exerciseCount?: number;
  /** Exercise type — shown as a badge */
  exerciseType?: ExerciseType;
}

/** Emoji + label for each exercise type */
const exerciseTypeLabels: Record<ExerciseType, { emoji: string; label: string }> = {
  observe: { emoji: '👀', label: 'Angalia' },
  modify: { emoji: '✏️', label: 'Badilisha' },
  'fill-blank': { emoji: '📝', label: 'Jaza' },
  create: { emoji: '🚀', label: 'Tengeneza' },
  debug: { emoji: '🐛', label: 'Rekebisha' },
};

export default function ChallengePanel({
  riddle,
  hints,
  chapterSlug,
  error,
  solved,
  exerciseIndex = 0,
  exerciseCount = 1,
  exerciseType,
}: ChallengePanelProps) {
  const store = useGameStore();
  const hydrated = useStoreHydrated();
  const { getChapterProgress, unlockHint } = store;
  const progress = hydrated ? getChapterProgress(chapterSlug) : { hintsUsed: [], completed: false, starsEarned: 0, attempts: 0, lastCode: '' };
  const [showHints, setShowHints] = useState(false);
  const t = useTranslations('Challenge');

  const handleUnlockHint = (hint: Hint) => {
    if (progress.hintsUsed.includes(hint.id)) return;
    hapticWarning();
    unlockHint(chapterSlug, hint.id);
  };

  const typeInfo = exerciseType ? exerciseTypeLabels[exerciseType] : null;

  // Extract character from riddle (e.g., "🐢 Kito anasema:" or "✏️ Kito anasema:")
  const characterEmojis: Record<string, string> = {
    kito: '🐢',
    'mzee byte': '🧙',
    'mzee_byte': '🧙',
    shida: '🐛',
    narrator: '📖',
  };

  const parseRiddle = (text: string) => {
    // Match patterns like "🐢 Kito anasema:" or "✏️ Kito anasema:"
    const match = text.match(/^[^\w\s]*\s*(Kito|Mzee Byte|Shida)\s+(anasema|anajibu|anauliza):\s*(.+)$/i);
    if (match) {
      const characterName = match[1].toLowerCase().replace(' ', '_');
      const emoji = characterEmojis[characterName];
      const message = match[3];
      return { hasCharacter: true, emoji, message };
    }
    return { hasCharacter: false, emoji: null, message: text };
  };

  const riddleInfo = parseRiddle(riddle);

  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="px-3 sm:px-4 py-2 sm:py-3 bg-bg-card/80 backdrop-blur-md border-t border-white/5"
    >
      {/* Riddle */}
      <div className="flex items-start gap-2 sm:gap-3">
        {riddleInfo.hasCharacter && riddleInfo.emoji && (
          <div className="text-xl sm:text-2xl pt-0.5 sm:pt-1 filter drop-shadow-lg shrink-0">
            {riddleInfo.emoji}
          </div>
        )}
        <div className={`flex-1 min-w-0 ${riddleInfo.hasCharacter ? 'bg-primary/5 border border-primary/10 rounded-2xl rounded-tl-none p-2 sm:p-3' : ''}`}>
          <p className="text-xs sm:text-sm md:text-base text-text-primary font-semibold leading-relaxed">
            {riddleInfo.message}
          </p>
        </div>

        {/* Hints toggle */}
        <button
          onClick={() => {
            hapticLight();
            setShowHints(!showHints);
          }}
          className="shrink-0 px-3 py-2 sm:px-3 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold bg-bg-surface hover:bg-bg-surface/80 text-text-secondary transition-all flex items-center gap-1 min-h-[44px] sm:min-h-0"
        >
          <span>💡</span>
          <span className="hidden sm:inline">{t('hints')}</span>
          <span>({hints.length})</span>
        </button>
      </div>

      {/* Success display - Character Celebration */}
      <AnimatePresence>
        {solved && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-2 sm:mt-3 flex items-start gap-2 sm:gap-3"
          >
            <div className="text-xl sm:text-2xl pt-0.5 sm:pt-1 filter drop-shadow-lg animate-bounce">🧙</div>
            <div className="flex-1 min-w-0 bg-success/10 border border-success/20 rounded-2xl rounded-tl-none p-2 sm:p-3 shadow-md">
              <p className="text-sm text-success font-bold flex items-center gap-2">
                <span>🎉</span>
                <span>{t('congratulations')}</span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hints panel — all free now */}
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
              const isUnlocked = progress.hintsUsed.includes(hint.id);

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
                      className="flex-1 p-2 rounded-lg text-sm text-left transition-all bg-secondary/10 text-secondary hover:bg-secondary/20 cursor-pointer"
                    >
                      <span className="mr-1.5">💡</span>
                      {t('hintLabel', { number: idx + 1 })}
                      <span className="ml-2 text-xs text-secondary/60">{t('free') || '(bure)'}</span>
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
