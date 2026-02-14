'use client';

import { useGameStore, useStoreHydrated } from '@/lib/store';
import { ChapterData } from '@/lib/types';
import { playSound, initAudio } from '@/lib/sound';
import { preloadVoices, stop as stopNarration } from '@/lib/narration';
import { startMusic, stopMusic } from '@/lib/music';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

interface TopBarProps {
  chapter?: ChapterData;
  totalChapters?: number;
  /** Show a story-toggle button on mobile (lg:hidden) */
  showStoryButton?: boolean;
  onStoryToggle?: () => void;
}

export default function TopBar({ chapter, totalChapters = 10, showStoryButton, onStoryToggle }: TopBarProps) {
  const store = useGameStore();
  const hydrated = useStoreHydrated();
  // Until localStorage rehydration completes, use server-safe defaults
  const player = hydrated ? store.player : { totalStars: 5, chaptersCompleted: 0, currentChapter: 'sura-1', name: '' };
  const soundEnabled = hydrated ? store.soundEnabled : true;
  const narrationEnabled = hydrated ? store.narrationEnabled : false;
  const { setSoundEnabled, setNarrationEnabled } = store;
  const t = useTranslations('TopBar');
  const tc = useTranslations('Chapters');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  const toggleSound = () => {
    if (!soundEnabled) {
      initAudio();
      playSound('run');
      startMusic('village');
    } else {
      stopMusic();
    }
    setSoundEnabled(!soundEnabled);
  };

  // Stop music when sound is turned off
  useEffect(() => {
    if (!soundEnabled) {
      stopMusic();
    }
  }, [soundEnabled]);

  const toggleNarration = () => {
    if (!narrationEnabled) {
      preloadVoices();
    } else {
      stopNarration();
    }
    setNarrationEnabled(!narrationEnabled);
  };

  // Close settings dropdown when clicking outside
  useEffect(() => {
    if (!settingsOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [settingsOpen]);

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex items-center justify-between px-2 sm:px-4 py-2 sm:py-3 bg-bg-card/60 backdrop-blur-md border-b border-white/5 z-50"
    >
      {/* Left: Back + Story toggle */}
      <div className="flex items-center gap-1.5 sm:gap-3">
        <Link
          href="/hadithi"
          className="flex items-center gap-1.5 sm:gap-2 text-text-secondary hover:text-secondary transition-colors"
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

        {/* Mobile story toggle — sits naturally in the TopBar */}
        {showStoryButton && (
          <button
            onClick={onStoryToggle}
            className="lg:hidden flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-secondary/15 text-secondary hover:bg-secondary/25 transition-all text-xs font-bold min-h-[36px]"
          >
            <span>📖</span>
            <span className="hidden xs:inline">{t('story')}</span>
          </button>
        )}
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
          <div className="hidden sm:flex gap-1 sm:gap-1.5 mt-1">
            {Array.from({ length: totalChapters }).map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 ${
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

      {/* Right section */}
      <div className="flex items-center gap-1.5 sm:gap-3">
        {/* Stars */}
        <div className="flex items-center gap-1 text-secondary">
          <span className="text-base sm:text-lg">⭐</span>
          <span className="text-xs sm:text-sm font-bold">{player.totalStars}</span>
        </div>

        {/* ─── Desktop: all controls inline ─── */}
        <div className="hidden sm:flex items-center gap-2">
          <LanguageSwitcher />
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-bg-surface/50 hover:bg-bg-surface text-text-secondary hover:text-text-primary transition-all"
            aria-label={soundEnabled ? t('muteSound') : t('enableSound')}
            title={soundEnabled ? t('muteSound') : t('enableSound')}
          >
            {soundEnabled ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor" opacity="0.3" />
                <path d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor" opacity="0.2" />
                <path d="M11 5L6 9H2v6h4l5 4V5z" stroke="currentColor" strokeWidth="2" />
                <line x1="23" y1="9" x2="17" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="17" y1="9" x2="23" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </button>
          {/* Narration Toggle */}
          <button
            onClick={toggleNarration}
            className={`w-9 h-9 flex items-center justify-center rounded-full transition-all ${
              narrationEnabled
                ? 'bg-secondary/20 text-secondary hover:bg-secondary/30'
                : 'bg-bg-surface/50 hover:bg-bg-surface text-text-secondary hover:text-text-primary'
            }`}
            aria-label={narrationEnabled ? t('muteNarration') : t('enableNarration')}
            title={narrationEnabled ? t('muteNarration') : t('enableNarration')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" fill="currentColor" opacity={narrationEnabled ? 0.4 : 0.2} />
              <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              {!narrationEnabled && (
                <line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>

        {/* ─── Mobile: settings gear dropdown ─── */}
        <div className="relative sm:hidden" ref={settingsRef}>
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-bg-surface/50 hover:bg-bg-surface text-text-secondary hover:text-text-primary transition-all"
            aria-label={t('settings')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
            </svg>
          </button>

          <AnimatePresence>
            {settingsOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -4 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-52 bg-bg-card border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
              >
                {/* Sound */}
                <button
                  onClick={toggleSound}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-text-secondary hover:bg-bg-surface/50 transition-colors"
                >
                  <span className="text-base">{soundEnabled ? '🔊' : '🔇'}</span>
                  <span className="flex-1 text-left">{soundEnabled ? t('muteSound') : t('enableSound')}</span>
                  <span className={`w-2 h-2 rounded-full ${soundEnabled ? 'bg-success' : 'bg-text-muted/30'}`} />
                </button>

                {/* Narration */}
                <button
                  onClick={toggleNarration}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-text-secondary hover:bg-bg-surface/50 transition-colors border-t border-white/5"
                >
                  <span className="text-base">{narrationEnabled ? '🎙️' : '🎙️'}</span>
                  <span className="flex-1 text-left">{narrationEnabled ? t('muteNarration') : t('enableNarration')}</span>
                  <span className={`w-2 h-2 rounded-full ${narrationEnabled ? 'bg-success' : 'bg-text-muted/30'}`} />
                </button>

                {/* Language */}
                <div className="border-t border-white/5 px-4 py-3 flex items-center gap-3">
                  <span className="text-base">🌐</span>
                  <div className="flex-1">
                    <LanguageSwitcher />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  );
}
