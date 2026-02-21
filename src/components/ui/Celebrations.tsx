'use client';

import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { playSound } from '@/lib/sound';
import { useGameStore } from '@/lib/store';
import { useTranslations } from 'next-intl';
import { ArrowRight } from '@/components/ui/icons';
import { hapticSuccess, hapticHeavy } from '@/lib/haptics';

/**
 * Fires a celebration confetti burst + sound + haptics
 */
export function fireCelebration() {
  const { soundEnabled } = useGameStore.getState();

  // Haptic feedback
  hapticSuccess();

  // Confetti burst
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 9999,
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, { spread: 26, startVelocity: 55, colors: ['#FACC15', '#14B8A6'] });
  fire(0.2, { spread: 60, colors: ['#FACC15', '#22C55E'] });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8, colors: ['#14B8A6', '#A78BFA'] });
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2, colors: ['#FACC15'] });
  fire(0.1, { spread: 120, startVelocity: 45, colors: ['#22C55E', '#14B8A6'] });

  // Sound
  if (soundEnabled) {
    playSound('complete');
  }
}

/**
 * Star earned animation component
 */
export function StarEarned({ count, delay = 0 }: { count: number; delay?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const { soundEnabled } = useGameStore.getState();
      if (soundEnabled) playSound('success');
    }, delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  return (
    <div ref={containerRef} className="flex items-center gap-2 justify-center">
      {Array.from({ length: 3 }).map((_, i) => (
        <span
          key={i}
          className={`text-3xl sm:text-4xl ${i < count ? 'animate-star-pop' : 'opacity-20'}`}
          style={{ animationDelay: `${delay + i * 200}ms`, animationFillMode: 'both' }}
        >
          ⭐
        </span>
      ))}
    </div>
  );
}

/**
 * Chapter complete overlay
 */
export function ChapterCompleteOverlay({
  starsEarned,
  chapterTitle,
  onNext,
  onReplay,
  hasNext,
}: {
  starsEarned: number;
  chapterTitle: string;
  onNext?: () => void;
  onReplay?: () => void;
  hasNext: boolean;
}) {
  const t = useTranslations('Celebrations');

  useEffect(() => {
    fireCelebration();
    // Extra heavy haptic for chapter completion
    hapticHeavy();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-deep/90 backdrop-blur-sm">
      <div className="glass-card p-8 sm:p-12 text-center max-w-md mx-4 animate-fade-in-up">
        <div className="text-5xl mb-4">🎊</div>
        <h2 className="text-2xl sm:text-3xl font-black text-text-primary mb-2">
          {t('congratulations')}
        </h2>
        <p className="text-text-secondary text-sm sm:text-base mb-6">
          {t('completed', { title: chapterTitle })}
        </p>

        <StarEarned count={starsEarned} delay={600} />

        <div className="flex flex-col sm:flex-row gap-3 mt-8 justify-center">
          {hasNext && (
            <button
              onClick={onNext}
              className="glow-button px-8 py-3 text-base flex items-center gap-2 justify-center"
            >
              {t('nextChapter').replace(' →', '')}
              <ArrowRight size={18} />
            </button>
          )}
          <button
            onClick={onReplay}
            className="px-6 py-3 rounded-full text-sm font-semibold bg-bg-surface text-text-secondary hover:text-text-primary transition-all"
          >
            {t('playAgain')}
          </button>
        </div>
      </div>
    </div>
  );
}
