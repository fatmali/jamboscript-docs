'use client';

import { useParams } from 'next/navigation';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getChapterBySlug, chapters } from '@/data/chapters';
import { useGameStore, useStoreHydrated } from '@/lib/store';
import { execute } from '@/lib/jamboscript';
import { playSound } from '@/lib/sound';
import { startMusic, stopMusic, changeScene } from '@/lib/music';
import { hapticSuccess, hapticError } from '@/lib/haptics';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useReducedMotion } from '@/lib/useReducedMotion';
import TopBar from '@/components/ui/TopBar';
import StoryPanel from '@/components/ui/StoryPanel';
import ChallengePanel from '@/components/ui/ChallengePanel';
import { ChapterCompleteOverlay } from '@/components/ui/Celebrations';
import type { ExerciseConfig } from '@/lib/types';
import dynamic from 'next/dynamic';
import { ArrowRight, CloseIcon } from '@/components/ui/icons';

// Dynamic import Monaco editor to avoid SSR issues
const CodeEditorPanel = dynamic(() => import('@/components/ui/CodeEditorPanel'), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center bg-bg-deep">
      <div className="text-text-muted text-sm animate-pulse">⚡ Loading editor...</div>
    </div>
  ),
});

/**
 * Bridge text banner shown between exercises.
 * The character says something encouraging before the next challenge.
 */
function BridgeBanner({ text, speaker, onContinue }: {
  text: string;
  speaker?: string;
  onContinue: () => void;
}) {
  const speakerEmoji: Record<string, string> = {
    kito: '🐢',
    mzee_byte: '🧙',
    shida: '🐛',
    narrator: '📖',
  };
  return (
    <motion.div
      className="absolute inset-0 z-30 flex items-center justify-center bg-bg-deep/90 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-bg-card border border-white/10 rounded-2xl p-6 max-w-md mx-4 text-center shadow-xl"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20 }}
      >
        <div className="text-3xl mb-3">{speakerEmoji[speaker || 'narrator'] || '📖'}</div>
        <p className="text-text-primary text-base leading-relaxed mb-5">{text}</p>
        <button
          onClick={onContinue}
          className="glow-button px-6 py-2.5 text-sm font-semibold flex items-center gap-2"
        >
          Endelea
          <ArrowRight size={16} />
        </button>
      </motion.div>
    </motion.div>
  );
}

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
    // Exercise methods
    getExerciseProgress,
    completeExercise,
    setCurrentExerciseIndex,
    getCurrentExerciseIndex,
    incrementExerciseAttempts,
    setExerciseLastCode,
  } = useGameStore();
  
  // Use server-safe default until hydrated
  const soundEnabled = hydrated ? storeSoundEnabled : true;

  // ─── Exercise system ────────────────────────────────────────────
  // Get exercises array (fallback: wrap legacy puzzle as single exercise)
  const exercises: ExerciseConfig[] = useMemo(() => {
    if (!chapter) return [];
    if (chapter.exercises && chapter.exercises.length > 0) return chapter.exercises;
    // Legacy fallback: wrap the single puzzle as an exercise
    const p = chapter.puzzle;
    return [{
      id: p.id,
      order: 1,
      type: 'fill-blank' as const,
      starterCode: p.starterCode,
      task: p.task,
      riddle: p.riddle,
      hints: p.hints,
      contextCode: p.contextCode,
      validate: p.validate,
      expectedOutput: p.expectedOutput,
    }];
  }, [chapter]);

  const [exerciseIndex, setExerciseIndex] = useState(0);
  const currentExercise = exercises[exerciseIndex] || exercises[0];

  const [code, setCode] = useState('');
  const [output, setOutput] = useState<string[]>([]);
  const [error, setError] = useState<string | undefined>();
  const [errorLine, setErrorLine] = useState<number | undefined>();
  const [isRunning, setIsRunning] = useState(false);
  const [exerciseSolved, setExerciseSolved] = useState(false);
  const [allExercisesDone, setAllExercisesDone] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [showBridge, setShowBridge] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [dialogueComplete, setDialogueComplete] = useState(false);
  const [mobileStoryOpen, setMobileStoryOpen] = useState(false);
  const reduced = useReducedMotion();

  const isLastExercise = exerciseIndex >= exercises.length - 1;

  // Editor is visible once dialogue ends OR chapter is already completed
  const editorReady = dialogueComplete || allExercisesDone;

  // Initialize — reset dialogue so story replays from the beginning
  useEffect(() => {
    if (!chapter || !hydrated) return;

    setCurrentChapter(slug);
    resetDialogue(slug);
    setShowingOutro(slug, false);
    setDialogueComplete(false);
    const progress = getChapterProgress(slug);
    const savedIndex = getCurrentExerciseIndex(slug);
    const exs = chapter.exercises && chapter.exercises.length > 0
      ? chapter.exercises
      : [chapter.puzzle];
    const startEx = exs[savedIndex] || exs[0];
    const exProgress = chapter.exercises
      ? getExerciseProgress(slug, (startEx as ExerciseConfig).id || chapter.puzzle.id)
      : undefined;
    
    setExerciseIndex(savedIndex);
    setCode(exProgress?.lastCode || tc((startEx as ExerciseConfig).starterCode || chapter.puzzle.starterCode));
    setAllExercisesDone(progress.completed);
    setExerciseSolved(false);
    setShowBridge(false);

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
    if (allExercisesDone && soundEnabled) {
      changeScene('celebration');
    }
  }, [allExercisesDone, soundEnabled]);

  // ─── Check mistake feedback patterns ────────────────────────────
  const getMistakeFeedback = useCallback((exercise: ExerciseConfig, userCode: string): string | undefined => {
    if (!exercise.mistakeFeedback) return undefined;
    for (const [pattern, feedback] of Object.entries(exercise.mistakeFeedback)) {
      try {
        if (new RegExp(pattern).test(userCode)) {
          return feedback.includes('.') ? tc(feedback) : feedback;
        }
      } catch { /* skip invalid regex */ }
    }
    return undefined;
  }, [tc]);

  // Handle code run
  const handleRun = useCallback(() => {
    if (!chapter || isRunning || exerciseSolved) return;

    setIsRunning(true);
    setOutput([]);
    setError(undefined);
    setErrorLine(undefined);

    if (soundEnabled) playSound('run');

    // Small delay for UX feel
    setTimeout(() => {
      const contextCode = currentExercise.contextCode || chapter.puzzle.contextCode;
      const result = execute(code, contextCode);
      setOutput(result.output);
      if (result.errorLine) setErrorLine(result.errorLine);

      incrementAttempts(slug);
      setLastCode(slug, code);
      incrementExerciseAttempts(slug, currentExercise.id);
      setExerciseLastCode(slug, currentExercise.id, code);

      // Validate
      const validationError = currentExercise.validate(result, code);

      if (validationError) {
        // Check for common mistake patterns first
        const mistakeHint = getMistakeFeedback(currentExercise, code);
        const resolvedError = mistakeHint
          || (validationError.includes('.') ? tc(validationError) : validationError);
        setError(resolvedError);
        setIsRunning(false);
        setShaking(true);
        if (soundEnabled) playSound('error');
        hapticError();
        setTimeout(() => setShaking(false), 500);
      } else {
        // Exercise solved!
        setExerciseSolved(true);
        setIsRunning(false);

        if (soundEnabled) playSound('success');
        hapticSuccess();

        // Save cross-chapter story variables
        if (result.variables['jina'] && typeof result.variables['jina'] === 'string') {
          setStoryVariable('jina', result.variables['jina']);
        }

        // Calculate stars for this exercise
        const exProgress = getExerciseProgress(slug, currentExercise.id);
        const attempts = (exProgress?.attempts || 0) + 1;
        let stars = 3;
        if (attempts > 3) stars = 2;
        if (attempts > 5) stars = 1;

        completeExercise(slug, currentExercise.id, stars, code);

        if (isLastExercise) {
          // All exercises done — calculate overall chapter stars
          const chProgress = getChapterProgress(slug);
          const totalExStars = Object.values(chProgress.exerciseProgress || {})
            .reduce((sum, ep) => sum + ep.starsEarned, 0) + stars;
          const avgStars = Math.max(1, Math.round(totalExStars / exercises.length));
          completeChapter(slug, avgStars);
          setAllExercisesDone(true);
          setTimeout(() => setShowComplete(true), 1500);
        } else {
          // Show bridge text before next exercise (after a beat)
          setTimeout(() => setShowBridge(true), 1200);
        }
      }
    }, 400);
  }, [chapter, code, currentExercise, isRunning, exerciseSolved, slug, soundEnabled, isLastExercise,
      exercises.length, getChapterProgress, getExerciseProgress, incrementAttempts, setLastCode,
      incrementExerciseAttempts, setExerciseLastCode, completeExercise, completeChapter,
      setStoryVariable, getMistakeFeedback, tc]);

  // ─── Advance to next exercise ───────────────────────────────────
  const advanceExercise = useCallback(() => {
    if (!chapter) return;
    const nextIdx = exerciseIndex + 1;
    if (nextIdx >= exercises.length) return;

    const nextEx = exercises[nextIdx];
    setExerciseIndex(nextIdx);
    setCurrentExerciseIndex(slug, nextIdx);
    setExerciseSolved(false);
    setShowBridge(false);
    setOutput([]);
    setError(undefined);
    setErrorLine(undefined);
    const exProgress = getExerciseProgress(slug, nextEx.id);
    setCode(exProgress?.lastCode || tc(nextEx.starterCode));
  }, [chapter, exerciseIndex, exercises, slug, getExerciseProgress, setCurrentExerciseIndex, tc]);

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
    setExerciseIndex(0);
    setCurrentExerciseIndex(slug, 0);
    setExerciseSolved(false);
    setAllExercisesDone(false);
    setShowComplete(false);
    setShowBridge(false);
    setShowingOutro(slug, false);
    setDialogueComplete(false);
    const firstEx = exercises[0];
    setCode(tc(firstEx.starterCode));
    setOutput([]);
    setError(undefined);
    setErrorLine(undefined);
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
            solved={allExercisesDone}
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
                    <CloseIcon size={16} />
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
                    solved={allExercisesDone}
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
              {/* Mobile: Challenge Panel on top of editor */}
              <div className="lg:hidden">
                <ChallengePanel
                  riddle={tc(currentExercise.riddle)}
                  hints={currentExercise.hints.map(h => ({ ...h, text: tc(h.text) }))}
                  chapterSlug={slug}
                  error={error}
                  solved={exerciseSolved}
                  exerciseIndex={exerciseIndex}
                  exerciseCount={exercises.length}
                  exerciseType={currentExercise.type}
                />
              </div>

              <CodeEditorPanel
                value={code}
                onChange={setCode}
                onRun={handleRun}
                output={output}
                error={error}
                errorLine={errorLine}
                isRunning={isRunning}
                solved={exerciseSolved}
              />

              {/* Bridge text overlay between exercises */}
              <AnimatePresence>
                {showBridge && currentExercise && !isLastExercise && (
                  <BridgeBanner
                    text={exercises[exerciseIndex + 1]?.bridgeText
                      ? tc(exercises[exerciseIndex + 1].bridgeText!)
                      : '✨'}
                    speaker={exercises[exerciseIndex + 1]?.bridgeSpeaker}
                    onContinue={advanceExercise}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Bottom: Challenge Panel — only visible on desktop when coding */}
      <AnimatePresence>
        {editorReady && (
          <motion.div
            initial={reduced ? {} : { y: 40, opacity: 0 }}
            animate={reduced ? {} : { y: 0, opacity: 1 }}
            exit={reduced ? {} : { y: 40, opacity: 0 }}
            transition={reduced ? {} : { duration: 0.4, delay: 0.2 }}
            className="safe-bottom hidden lg:block"
          >
            <ChallengePanel
              riddle={tc(currentExercise.riddle)}
              hints={currentExercise.hints.map(h => ({ ...h, text: tc(h.text) }))}
              chapterSlug={slug}
              error={error}
              solved={exerciseSolved}
              exerciseIndex={exerciseIndex}
              exerciseCount={exercises.length}
              exerciseType={currentExercise.type}
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
