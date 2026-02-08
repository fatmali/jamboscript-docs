/**
 * Game State Management — Multi-chapter with persistence
 * Tracks story progress, stars, hints, and code across chapters
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChapterProgress, PlayerProfile } from './types';
import { ExecutionResult } from './jamboscript';

export interface GameState {
  // Player profile
  player: PlayerProfile;

  // Sound
  soundEnabled: boolean;

  // Per-chapter progress
  chapters: Record<string, ChapterProgress>;

  // Dialogue advancement per chapter
  dialogueIndex: Record<string, number>;

  // Actions
  setPlayerName: (name: string) => void;
  setSoundEnabled: (enabled: boolean) => void;

  // Chapter progress
  getChapterProgress: (slug: string) => ChapterProgress;
  completeChapter: (slug: string, starsEarned: number) => void;
  setCurrentChapter: (slug: string) => void;
  incrementAttempts: (slug: string) => void;
  setLastCode: (slug: string, code: string) => void;
  setLastResult: (slug: string, result: ExecutionResult) => void;

  // Hints
  unlockHint: (chapterSlug: string, hintId: string) => boolean;

  // Stars
  addStars: (count: number) => void;
  spendStar: () => boolean;

  // Dialogue
  advanceDialogue: (slug: string) => void;
  resetDialogue: (slug: string) => void;
  getDialogueIndex: (slug: string) => number;

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
      chapters: {},
      dialogueIndex: {},

      setPlayerName: (name) =>
        set((state) => ({
          player: { ...state.player, name },
        })),

      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),

      getChapterProgress: (slug) => {
        return get().chapters[slug] || { ...defaultChapterProgress };
      },

      completeChapter: (slug, starsEarned) =>
        set((state) => {
          const existing = state.chapters[slug];
          const bestStars = Math.max(existing?.starsEarned || 0, starsEarned);
          const wasAlreadyComplete = existing?.completed || false;

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
              totalStars: state.player.totalStars + starsEarned,
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

      unlockHint: (chapterSlug, hintId) => {
        const state = get();
        const progress = state.chapters[chapterSlug] || { ...defaultChapterProgress };

        if (progress.hintsUsed.includes(hintId)) return true; // Already unlocked

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

      resetGame: () =>
        set({
          player: { ...defaultPlayer },
          chapters: {},
          dialogueIndex: {},
        }),
    }),
    {
      name: 'jamboscript-game-state',
      version: 1,
    }
  )
);
