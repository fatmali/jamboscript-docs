'use client';

import { useGameStore } from '@/lib/store';
import { ChapterData } from '@/lib/types';
import { playSound, initAudio } from '@/lib/sound';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

interface TopBarProps {
  chapter?: ChapterData;
  totalChapters?: number;
}

export default function TopBar({ chapter, totalChapters = 5 }: TopBarProps) {
  const { player, soundEnabled, setSoundEnabled } = useGameStore();
  const t = useTranslations('TopBar');
  const tc = useTranslations('Chapters');

  const toggleSound = () => {
    if (!soundEnabled) {
      initAudio();
      playSound('run');
    }
    setSoundEnabled(!soundEnabled);
  };

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex items-center justify-between px-4 py-3 bg-bg-card/60 backdrop-blur-md border-b border-white/5 z-50"
    >
      {/* Left: Logo / Back */}
      <div className="flex items-center gap-3">
        <Link
          href="/hadithi"
          className="flex items-center gap-2 text-text-secondary hover:text-secondary transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M12 15L7 10L12 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-sm font-semibold hidden sm:inline">{t('map')}</span>
        </Link>
      </div>

      {/* Center: Chapter title + progress */}
      <div className="flex flex-col items-center">
        {chapter && (
          <>
            <span className="text-xs text-text-muted font-semibold uppercase tracking-wider">
              {t('chapterOf', { number: chapter.number, total: totalChapters })}
            </span>
            <h1 className="text-sm sm:text-base font-bold text-text-primary">
              {tc(chapter.title)}
            </h1>
          </>
        )}

        {/* Progress dots */}
        {chapter && (
          <div className="flex gap-1.5 mt-1">
            {Array.from({ length: totalChapters }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i < chapter.number
                    ? 'bg-secondary scale-100'
                    : i === chapter.number - 1
                    ? 'bg-secondary animate-pulse'
                    : 'bg-bg-surface'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Right: Stars + Sound */}
      <div className="flex items-center gap-3">
        {/* Language Switcher */}
        <LanguageSwitcher />

        {/* Stars */}
        <div className="flex items-center gap-1 text-secondary">
          <span className="text-lg">⭐</span>
          <span className="text-sm font-bold">{player.totalStars}</span>
        </div>

        {/* Sound Toggle */}
        <button
          onClick={toggleSound}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-bg-surface/50 hover:bg-bg-surface text-text-secondary hover:text-text-primary transition-all"
          aria-label={soundEnabled ? t('muteSound') : t('enableSound')}
        >
          {soundEnabled ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M11 5L6 9H2v6h4l5 4V5z"
                fill="currentColor"
                opacity="0.3"
              />
              <path
                d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M11 5L6 9H2v6h4l5 4V5z"
                fill="currentColor"
                opacity="0.2"
              />
              <path
                d="M11 5L6 9H2v6h4l5 4V5z"
                stroke="currentColor"
                strokeWidth="2"
              />
              <line
                x1="23"
                y1="9"
                x2="17"
                y2="15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1="17"
                y1="9"
                x2="23"
                y2="15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>
      </div>
    </motion.header>
  );
}
