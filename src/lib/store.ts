/**
 * Game State Management — Multi-chapter with persistence
 * Tracks story progress, stars, hints, and code across chapters
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChapterProgress, PlayerProfile, ExerciseProgress } from './types';
import { useEffect, useState } from 'react';
import { ExecutionResult } from './jamboscript';

export interface GameState {
  // Player profile
  player: PlayerProfile;

  // Sound & music
  soundEnabled: boolean;

  // Narration (TTS)
  narrationEnabled: boolean;

  // Per-chapter progress
  chapters: Record<string, ChapterProgress>;

  // Dialogue advancement per chapter
  dialogueIndex: Record<string, number>;

  // Story variables that persist across chapters (e.g. player's chosen name)
  storyVariables: Record<string, string | number | boolean>;

  // Whether we are showing the outro for a chapter
  showingOutro: Record<string, boolean>;

  // Actions
  setPlayerName: (name: string) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setNarrationEnabled: (enabled: boolean) => void;

  // Chapter progress
  getChapterProgress: (slug: string) => ChapterProgress;
  completeChapter: (slug: string, starsEarned: number) => void;
  setCurrentChapter: (slug: string) => void;
  incrementAttempts: (slug: string) => void;
  setLastCode: (slug: string, code: string) => void;
  setLastResult: (slug: string, result: ExecutionResult) => void;

  // Exercise progress
  getExerciseProgress: (slug: string, exerciseId: string) => ExerciseProgress;
  completeExercise: (slug: string, exerciseId: string, stars: number, code: string) => void;
  setCurrentExerciseIndex: (slug: string, index: number) => void;
  getCurrentExerciseIndex: (slug: string) => number;
  incrementExerciseAttempts: (slug: string, exerciseId: string) => void;
  setExerciseLastCode: (slug: string, exerciseId: string, code: string) => void;

  // Hints
  unlockHint: (chapterSlug: string, hintId: string) => boolean;

  // Stars
  addStars: (count: number) => void;
  spendStar: () => boolean;

  // Dialogue
  advanceDialogue: (slug: string) => void;
  resetDialogue: (slug: string) => void;
  getDialogueIndex: (slug: string) => number;

  // Story variables (persist across chapters)
  setStoryVariable: (key: string, value: string | number | boolean) => void;
  getStoryVariable: (key: string) => string | number | boolean | undefined;

  // Outro management
  setShowingOutro: (slug: string, showing: boolean) => void;
  isShowingOutro: (slug: string) => boolean;

  // Full reset
  resetGame: () => void;
}

const defaultChapterProgress: ChapterProgress = {
  completed: false,
  starsEarned: 0,
  attempts: 0,
  hintsUsed: [],
  lastCode: '',
};

const defaultPlayer: PlayerProfile = {
  name: '',
  totalStars: 5, // Start with 5 stars
  chaptersCompleted: 0,
  currentChapter: 'sura-1',
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      player: { ...defaultPlayer },
      soundEnabled: true,
      narrationEnabled: false,
      chapters: {},
      dialogueIndex: {},
      storyVariables: {},
      showingOutro: {},

      setPlayerName: (name) =>
        set((state) => ({
          player: { ...state.player, name },
        })),

      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),

      setNarrationEnabled: (enabled) => set({ narrationEnabled: enabled }),

      getChapterProgress: (slug) => {
        return get().chapters[slug] || { ...defaultChapterProgress };
      },

      completeChapter: (slug, starsEarned) =>
        set((state) => {
          const existing = state.chapters[slug];
          const bestStars = Math.max(existing?.starsEarned || 0, starsEarned);
          const wasAlreadyComplete = existing?.completed || false;
          const previousBestStars = existing?.starsEarned || 0;
          // Only add the IMPROVEMENT in stars, not the full amount (fixes replay exploit)
          const starImprovement = Math.max(0, bestStars - previousBestStars);

          return {
            chapters: {
              ...state.chapters,
              [slug]: {
                ...(existing || defaultChapterProgress),
                completed: true,
                starsEarned: bestStars,
              },
            },
            player: {
              ...state.player,
              totalStars: state.player.totalStars + starImprovement,
              chaptersCompleted: wasAlreadyComplete
                ? state.player.chaptersCompleted
                : state.player.chaptersCompleted + 1,
            },
          };
        }),

      setCurrentChapter: (slug) =>
        set((state) => ({
          player: { ...state.player, currentChapter: slug },
        })),

      incrementAttempts: (slug) =>
        set((state) => {
          const existing = state.chapters[slug] || { ...defaultChapterProgress };
          return {
            chapters: {
              ...state.chapters,
              [slug]: {
                ...existing,
                attempts: existing.attempts + 1,
              },
            },
          };
        }),

      setLastCode: (slug, code) =>
        set((state) => {
          const existing = state.chapters[slug] || { ...defaultChapterProgress };
          return {
            chapters: {
              ...state.chapters,
              [slug]: { ...existing, lastCode: code },
            },
          };
        }),

      setLastResult: (slug, result) =>
        set((state) => {
          const existing = state.chapters[slug] || { ...defaultChapterProgress };
          return {
            chapters: {
              ...state.chapters,
              [slug]: { ...existing, lastResult: result },
            },
          };
        }),

      // ── Exercise Progress ────────────────────────────────────────

      getExerciseProgress: (slug, exerciseId) => {
        const chapter = get().chapters[slug];
        return chapter?.exerciseProgress?.[exerciseId] || {
          completed: false,
          starsEarned: 0,
          attempts: 0,
          lastCode: '',
        };
      },

      completeExercise: (slug, exerciseId, stars, code) =>
        set((state) => {
          const existing = state.chapters[slug] || { ...defaultChapterProgress };
          const existingEx = existing.exerciseProgress?.[exerciseId];
          const bestStars = Math.max(existingEx?.starsEarned || 0, stars);
          return {
            chapters: {
              ...state.chapters,
              [slug]: {
                ...existing,
                exerciseProgress: {
                  ...existing.exerciseProgress,
                  [exerciseId]: {
                    completed: true,
                    starsEarned: bestStars,
                    attempts: (existingEx?.attempts || 0) + 1,
                    lastCode: code,
                  },
                },
              },
            },
          };
        }),

      setCurrentExerciseIndex: (slug, index) =>
        set((state) => {
          const existing = state.chapters[slug] || { ...defaultChapterProgress };
          return {
            chapters: {
              ...state.chapters,
              [slug]: { ...existing, currentExerciseIndex: index },
            },
          };
        }),

      getCurrentExerciseIndex: (slug) => {
        return get().chapters[slug]?.currentExerciseIndex || 0;
      },

      incrementExerciseAttempts: (slug, exerciseId) =>
        set((state) => {
          const existing = state.chapters[slug] || { ...defaultChapterProgress };
          const existingEx = existing.exerciseProgress?.[exerciseId] || {
            completed: false, starsEarned: 0, attempts: 0, lastCode: '',
          };
          return {
            chapters: {
              ...state.chapters,
              [slug]: {
                ...existing,
                exerciseProgress: {
                  ...existing.exerciseProgress,
                  [exerciseId]: { ...existingEx, attempts: existingEx.attempts + 1 },
                },
              },
            },
          };
        }),

      setExerciseLastCode: (slug, exerciseId, code) =>
        set((state) => {
          const existing = state.chapters[slug] || { ...defaultChapterProgress };
          const existingEx = existing.exerciseProgress?.[exerciseId] || {
            completed: false, starsEarned: 0, attempts: 0, lastCode: '',
          };
          return {
            chapters: {
              ...state.chapters,
              [slug]: {
                ...existing,
                exerciseProgress: {
                  ...existing.exerciseProgress,
                  [exerciseId]: { ...existingEx, lastCode: code },
                },
              },
            },
          };
        }),

      unlockHint: (chapterSlug, hintId) => {
        const state = get();
        const progress = state.chapters[chapterSlug] || { ...defaultChapterProgress };

        if (progress.hintsUsed.includes(hintId)) return true; // Already unlocked

        // Hints are now always free — no star cost
        set({
          chapters: {
            ...state.chapters,
            [chapterSlug]: {
              ...progress,
              hintsUsed: [...progress.hintsUsed, hintId],
            },
          },
        });
        return true;
      },

      addStars: (count) =>
        set((state) => ({
          player: {
            ...state.player,
            totalStars: state.player.totalStars + count,
          },
        })),

      spendStar: () => {
        const state = get();
        if (state.player.totalStars <= 0) return false;
        set({
          player: {
            ...state.player,
            totalStars: state.player.totalStars - 1,
          },
        });
        return true;
      },

      advanceDialogue: (slug) =>
        set((state) => ({
          dialogueIndex: {
            ...state.dialogueIndex,
            [slug]: (state.dialogueIndex[slug] || 0) + 1,
          },
        })),

      resetDialogue: (slug) =>
        set((state) => ({
          dialogueIndex: {
            ...state.dialogueIndex,
            [slug]: 0,
          },
        })),

      getDialogueIndex: (slug) => get().dialogueIndex[slug] || 0,

      setStoryVariable: (key, value) =>
        set((state) => ({
          storyVariables: { ...state.storyVariables, [key]: value },
        })),

      getStoryVariable: (key) => get().storyVariables[key],

      setShowingOutro: (slug, showing) =>
        set((state) => ({
          showingOutro: { ...state.showingOutro, [slug]: showing },
        })),

      isShowingOutro: (slug) => get().showingOutro[slug] || false,

      resetGame: () =>
        set({
          player: { ...defaultPlayer },
          chapters: {},
          dialogueIndex: {},
          storyVariables: {},
          showingOutro: {},
          narrationEnabled: false,
        }),
    }),
    {
      name: 'jamboscript-game-state',
      version: 2,
      migrate: (persistedState: unknown, version: number) => {
        if (version < 2) {
          // v1 → v2: add exerciseProgress to existing chapter progress
          const state = persistedState as Record<string, unknown>;
          const chapters = (state.chapters || {}) as Record<string, ChapterProgress>;
          for (const slug of Object.keys(chapters)) {
            if (!chapters[slug].exerciseProgress) {
              chapters[slug].exerciseProgress = {};
              chapters[slug].currentExerciseIndex = 0;
            }
          }
        }
        return persistedState as GameState;
      },
    }
  )
);

/**
 * Returns `true` once the Zustand persist store has rehydrated from
 * localStorage on the client.  During SSR and the very first client
 * render this returns `false`, so components can fall back to safe
 * defaults and avoid a hydration mismatch.
 */
export function useStoreHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    // `onFinishHydration` fires once the persisted state has been
    // read from storage and merged into the store.
    const unsub = useGameStore.persist.onFinishHydration(() => setHydrated(true));
    // If rehydration already happened before this effect ran:
    if (useGameStore.persist.hasHydrated()) setHydrated(true);
    return unsub;
  }, []);
  return hydrated;
}
