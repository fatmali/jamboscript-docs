'use client';

import { useParams } from 'next/navigation';
import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getChapterBySlug, chapters } from '@/data/chapters';
import { useGameStore, useStoreHydrated } from '@/lib/store';
import { execute } from '@/lib/jamboscript';
import { playSound } from '@/lib/sound';
import { startMusic, stopMusic, changeScene } from '@/lib/music';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useReducedMotion } from '@/lib/useReducedMotion';
import TopBar from '@/components/ui/TopBar';
import StoryPanel from '@/components/ui/StoryPanel';
import ChallengePanel from '@/components/ui/ChallengePanel';
import { ChapterCompleteOverlay } from '@/components/ui/Celebrations';
import dynamic from 'next/dynamic';

// Dynamic import Monaco editor to avoid SSR issues
const CodeEditorPanel = dynamic(() => import('@/components/ui/CodeEditorPanel'), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center bg-bg-deep">
      <div className="text-text-muted text-sm animate-pulse">⚡ Loading editor...</div>
    </div>
  ),
});

export default function ChapterPageClient() {
  const params = useParams();
  const router = useRouter();
  const slug = params.chapter as string;
  const chapter = getChapterBySlug(slug);
  const t = useTranslations('Chapter');
  const tc = useTranslations('Chapters');
  const hydrated = useStoreHydrated();

  const {
    getChapterProgress,
    setLastCode,
    incrementAttempts,
    completeChapter,
    setCurrentChapter,
    soundEnabled: storeSoundEnabled,
    resetDialogue,
    setStoryVariable,
    setShowingOutro,
  } = useGameStore();
  
  // Use server-safe default until hydrated
  const soundEnabled = hydrated ? storeSoundEnabled : true;

  const [code, setCode] = useState('');
  const [output, setOutput] = useState<string[]>([]);
  const [error, setError] = useState<string | undefined>();
  const [isRunning, setIsRunning] = useState(false);
  const [solved, setSolved] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [dialogueComplete, setDialogueComplete] = useState(false);
  const [mobileStoryOpen, setMobileStoryOpen] = useState(false);
  const reduced = useReducedMotion();

  // Editor is visible once dialogue ends OR puzzle is already solved
  const editorReady = dialogueComplete || solved;

  // Initialize — reset dialogue so story replays from the beginning
  useEffect(() => {
    if (!chapter || !hydrated) return;

    setCurrentChapter(slug);
    resetDialogue(slug);
    setShowingOutro(slug, false);
    setDialogueComplete(false);
    const progress = getChapterProgress(slug);
    setCode(progress.lastCode || tc(chapter.puzzle.starterCode));
    setSolved(progress.completed);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, hydrated]);

  // Background music — start/stop based on soundEnabled + scene
  useEffect(() => {
    if (!chapter) return;
    if (soundEnabled) {
      startMusic(chapter.scene as Parameters<typeof startMusic>[0]);
    } else {
      stopMusic();
    }
    return () => { stopMusic(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [soundEnabled, chapter?.scene]);

  // Change music scene when chapter is solved (celebration feel)
  useEffect(() => {
    if (solved && soundEnabled) {
      changeScene('celebration');
    }
  }, [solved, soundEnabled]);

  // Handle code run
  const handleRun = useCallback(() => {
    if (!chapter || isRunning || solved) return;

    setIsRunning(true);
    setOutput([]);
    setError(undefined);

    if (soundEnabled) playSound('run');

    // Small delay for UX feel
    setTimeout(() => {
      const result = execute(code, chapter.puzzle.contextCode);
      setOutput(result.output);

      incrementAttempts(slug);
      setLastCode(slug, code);

      // Validate
      const validationError = chapter.puzzle.validate(result, code);

      if (validationError) {
        // Resolve translation key if it looks like one (contains a dot), otherwise show raw error
        const resolvedError = validationError.includes('.') ? tc(validationError) : validationError;
        setError(resolvedError);
        setIsRunning(false);
        setShaking(true);
        if (soundEnabled) playSound('error');
        setTimeout(() => setShaking(false), 500);
      } else {
        // Success!
        setSolved(true);
        setIsRunning(false);

        if (soundEnabled) playSound('success');

        // Save cross-chapter story variables
        if (result.variables['jina'] && typeof result.variables['jina'] === 'string') {
          setStoryVariable('jina', result.variables['jina']);
        }

        // Calculate stars (3 = first try, 2 = under 5 tries, 1 = more)
        const progress = getChapterProgress(slug);
        const attempts = progress.attempts + 1;
        const hintsUsed = progress.hintsUsed.length;
        let stars = 3;
        if (attempts > 3 || hintsUsed > 0) stars = 2;
        if (attempts > 5 || hintsUsed > 1) stars = 1;

        completeChapter(slug, stars);

        // Show completion overlay after a beat
        setTimeout(() => setShowComplete(true), 1500);
      }
    }, 400);
  }, [chapter, code, isRunning, solved, slug, soundEnabled, getChapterProgress, incrementAttempts, setLastCode, completeChapter, setStoryVariable, tc]);

  const handleNext = () => {
    if (chapter?.nextChapter) {
      resetDialogue(chapter.nextChapter);
      router.push(`/hadithi/${chapter.nextChapter}`);
    } else {
      router.push('/hadithi');
    }
  };

  const handleReplay = () => {
    if (!chapter) return;
    setSolved(false);
    setShowComplete(false);
    setShowingOutro(slug, false);
    setDialogueComplete(false);
    setCode(tc(chapter.puzzle.starterCode));
    setOutput([]);
    setError(undefined);
    resetDialogue(slug);
  };

  // Chapter not found
  if (!chapter) {
    return (
      <div className="min-h-screen bg-bg-deep flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-4">🤔</p>
          <h2 className="text-xl font-bold text-text-primary mb-2">{t('notFound')}</h2>
          <button
            onClick={() => router.push('/hadithi')}
            className="glow-button px-6 py-2 text-sm mt-4"
          >
            {t('backToMap')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] flex flex-col bg-bg-deep overflow-hidden">
      {/* Top Bar */}
      <TopBar
        chapter={chapter}
        totalChapters={chapters.length}
        showStoryButton={editorReady && !mobileStoryOpen}
        onStoryToggle={() => setMobileStoryOpen(true)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden relative">
        {/* Story Panel — full width before editor, side panel on desktop, collapsible drawer on mobile */}
        {/* Desktop: always visible as side panel */}
        <motion.div
          className={`${
            editorReady
              ? 'hidden lg:flex lg:w-[40%] xl:w-[38%] lg:h-full'
              : 'flex w-full h-full'
          } border-b lg:border-b-0 lg:border-r border-white/5 shrink-0 flex-col transition-all duration-500`}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <StoryPanel
            chapter={chapter}
            onDialogueComplete={() => {
              setDialogueComplete(true);
            }}
            solved={solved}
          />
        </motion.div>

        {/* Mobile: collapsible story drawer — slides down from top as overlay */}
        <AnimatePresence>
          {editorReady && mobileStoryOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileStoryOpen(false)}
              />
              {/* Drawer */}
              <motion.div
                className="fixed inset-x-0 top-0 z-50 lg:hidden flex flex-col bg-bg-deep rounded-b-2xl shadow-2xl border-b border-white/10"
                style={{ maxHeight: '75dvh' }}
                initial={{ y: '-100%' }}
                animate={{ y: 0 }}
                exit={{ y: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              >
                {/* Drawer header */}
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 bg-bg-card/80 backdrop-blur-sm rounded-t-none">
                  <div className="flex items-center gap-2">
                    <span>📖</span>
                    <span className="text-sm font-bold text-text-primary">{t('story')}</span>
                  </div>
                  <button
                    onClick={() => setMobileStoryOpen(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-text-secondary hover:text-text-primary transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
                {/* Story content */}
                <div className="flex-1 min-h-0 overflow-y-auto">
                  <StoryPanel
                    chapter={chapter}
                    onDialogueComplete={() => {
                      setDialogueComplete(true);
                      setMobileStoryOpen(false);
                    }}
                    solved={solved}
                  />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Code Editor — full width on mobile, right panel on desktop */}
        <AnimatePresence>
          {editorReady && (
            <motion.div
              className={`flex-1 min-h-0 flex flex-col ${
                shaking ? 'animate-shake' : ''
              }`}
              initial={{ x: 60, opacity: 0, scale: 0.95 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: 60, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <CodeEditorPanel
                value={code}
                onChange={setCode}
                onRun={handleRun}
                output={output}
                error={error}
                isRunning={isRunning}
                solved={solved}
              />
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Bottom: Challenge Panel — only visible when coding */}
      <AnimatePresence>
        {editorReady && (
          <motion.div
            initial={reduced ? {} : { y: 40, opacity: 0 }}
            animate={reduced ? {} : { y: 0, opacity: 1 }}
            exit={reduced ? {} : { y: 40, opacity: 0 }}
            transition={reduced ? {} : { duration: 0.4, delay: 0.2 }}
            className="safe-bottom"
          >
            <ChallengePanel
              riddle={tc(chapter.puzzle.riddle)}
              hints={chapter.puzzle.hints.map(h => ({ ...h, text: tc(h.text) }))}
              chapterSlug={slug}
              error={error}
              solved={solved}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chapter Complete Overlay */}
      <AnimatePresence>
        {showComplete && (
          <ChapterCompleteOverlay
            starsEarned={getChapterProgress(slug).starsEarned}
            chapterTitle={tc(chapter.title)}
            onNext={handleNext}
            onReplay={handleReplay}
            hasNext={!!chapter.nextChapter}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
