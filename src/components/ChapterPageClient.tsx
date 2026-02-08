'use client';

import { useParams } from 'next/navigation';
import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getChapterBySlug, chapters } from '@/data/chapters';
import { useGameStore } from '@/lib/store';
import { execute } from '@/lib/jamboscript';
import { playSound } from '@/lib/sound';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
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

  const {
    getChapterProgress,
    setLastCode,
    incrementAttempts,
    completeChapter,
    setCurrentChapter,
    soundEnabled,
    resetDialogue,
  } = useGameStore();

  const [code, setCode] = useState('');
  const [output, setOutput] = useState<string[]>([]);
  const [error, setError] = useState<string | undefined>();
  const [isRunning, setIsRunning] = useState(false);
  const [solved, setSolved] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [dialogueComplete, setDialogueComplete] = useState(false);

  // Initialize — reset dialogue so story replays from the beginning
  useEffect(() => {
    if (!chapter) return;

    setCurrentChapter(slug);
    resetDialogue(slug);
    const progress = getChapterProgress(slug);
    setCode(progress.lastCode || tc(chapter.puzzle.starterCode));
    setSolved(progress.completed);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

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
  }, [chapter, code, isRunning, solved, slug, soundEnabled, getChapterProgress, incrementAttempts, setLastCode, completeChapter]);

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
    <div className="h-screen flex flex-col bg-bg-deep overflow-hidden">
      {/* Top Bar */}
      <TopBar chapter={chapter} totalChapters={chapters.length} />

      {/* Main Content — 3 zones */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
        {/* Left: Story Panel */}
        <motion.div
          className="lg:w-[40%] xl:w-[38%] h-[40vh] lg:h-full border-b lg:border-b-0 lg:border-r border-white/5 flex-shrink-0"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <StoryPanel
            chapter={chapter}
            onDialogueComplete={() => setDialogueComplete(true)}
            solved={solved}
          />
        </motion.div>

        {/* Right: Code Editor */}
        <motion.div
          className={`flex-1 min-h-0 ${shaking ? 'animate-shake' : ''}`}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
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
      </div>

      {/* Bottom: Challenge Panel */}
      <ChallengePanel
        riddle={tc(chapter.puzzle.riddle)}
        hints={chapter.puzzle.hints.map(h => ({ ...h, text: tc(h.text) }))}
        chapterSlug={slug}
        error={error}
        solved={solved}
      />

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
