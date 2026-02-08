'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/lib/store';
import { chapters } from '@/data/chapters';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export default function StoryMapPage() {
  const router = useRouter();
  const { chapters: progress, player } = useGameStore();
  const t = useTranslations('StoryMap');
  const tc = useTranslations('Common');
  const tch = useTranslations('Chapters');

  const stars = useMemo(
    () =>
      Array.from({ length: 30 }).map((_, i) => ({
        w: seededRandom(i * 5 + 1) * 2 + 1,
        h: seededRandom(i * 5 + 2) * 2 + 1,
        left: seededRandom(i * 5 + 3) * 100,
        top: seededRandom(i * 5 + 4) * 60,
        dur: 2 + seededRandom(i * 5 + 5) * 2,
        del: seededRandom(i * 5 + 6) * 2,
      })),
    []
  );

  const isUnlocked = (chapterIndex: number) => {
    if (chapterIndex === 0) return true;
    const prevChapter = chapters[chapterIndex - 1];
    return progress[prevChapter.slug]?.completed || false;
  };

  return (
    <div className="min-h-screen bg-bg-deep relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-linear-to-b from-indigo-950 via-bg-deep to-bg-deep" />

      {/* Stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {stars.map((s, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: s.w,
              height: s.h,
              left: `${s.left}%`,
              top: `${s.top}%`,
            }}
            animate={{ opacity: [0.2, 0.7, 0.2] }}
            transition={{
              duration: s.dur,
              repeat: Infinity,
              delay: s.del,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-text-secondary hover:text-secondary transition-colors text-sm font-semibold flex items-center gap-2"
        >
          ← {tc('home')}
        </Link>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <div className="flex items-center gap-2 text-secondary">
            <span className="text-lg">⭐</span>
            <span className="font-bold">{player.totalStars}</span>
          </div>
        </div>
      </header>

      {/* Title */}
      <div className="relative z-10 text-center pt-4 pb-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl font-black text-text-primary"
        >
          {t('title')}
        </motion.h1>
        <p className="text-text-muted text-sm mt-2">
          {t('subtitle')}
        </p>
      </div>

      {/* Chapter Map */}
      <div className="relative z-10 max-w-lg mx-auto px-6 pb-16">
        {/* Path SVG connecting nodes */}
        <svg
          className="absolute left-1/2 top-0 -translate-x-1/2 w-4 h-full pointer-events-none"
          preserveAspectRatio="none"
        >
          <line
            x1="50%"
            y1="0"
            x2="50%"
            y2="100%"
            stroke="rgba(196, 181, 253, 0.15)"
            strokeWidth="2"
            strokeDasharray="8 8"
          />
        </svg>

        <div className="space-y-6">
          {chapters.map((chapter, index) => {
            const unlocked = isUnlocked(index);
            const chapterProgress = progress[chapter.slug];
            const completed = chapterProgress?.completed || false;
            const stars = chapterProgress?.starsEarned || 0;

            return (
              <motion.div
                key={chapter.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`chapter-node ${!unlocked ? 'locked' : ''}`}
              >
                <button
                  onClick={() => unlocked && router.push(`/hadithi/${chapter.slug}`)}
                  disabled={!unlocked}
                  className={`w-full glass-card p-5 text-left transition-all ${
                    completed
                      ? 'border-success/30 hover:border-success/50'
                      : unlocked
                      ? 'border-secondary/20 hover:border-secondary/40'
                      : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Chapter number circle */}
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-black shrink-0 ${
                        completed
                          ? 'bg-success/20 text-success'
                          : unlocked
                          ? 'bg-secondary/20 text-secondary'
                          : 'bg-bg-surface text-text-muted'
                      }`}
                    >
                      {completed ? '✓' : unlocked ? chapter.number : '🔒'}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base text-text-primary truncate">
                        {t('chapterLabel')} {chapter.number}: {tch(chapter.title)}
                      </h3>
                      <p className="text-xs text-text-muted mt-0.5">
                        {tch(chapter.subtitle)}
                      </p>
                      {completed && (
                        <div className="flex gap-0.5 mt-1">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <span key={i} className={`text-xs ${i < stars ? '' : 'opacity-20'}`}>
                              ⭐
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Scene icon */}
                    <div className="text-2xl shrink-0">
                      {chapter.scene === 'village' && '🏠'}
                      {chapter.scene === 'forest' && '🌲'}
                      {chapter.scene === 'bridge' && '🌉'}
                      {chapter.scene === 'mountain' && '⛰️'}
                      {chapter.scene === 'cave' && '🕳️'}
                    </div>
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
