/**
 * Game State Management
 * Tracks story progress, puzzle state, and code execution results
 */

import { create } from 'zustand';
import { ExecutionResult } from './jamboscript';

export type PuzzleId = 'naming' | 'path' | 'bridge';

export interface PuzzleState {
  completed: boolean;
  attempts: number;
  lastResult?: ExecutionResult;
}

export interface GameState {
  // Current puzzle
  currentPuzzle: PuzzleId;
  
  // Puzzle states
  puzzles: Record<PuzzleId, PuzzleState>;
  
  // Variables from code execution that affect the story
  storyVariables: {
    jina?: string;       // Player's chosen name
    wakati?: string;     // Time of day (mchana/usiku)
    njia?: string;       // Chosen path
    hatua?: number;      // Bridge steps taken
  };
  
  // Bridge-specific state
  bridgeState: {
    currentStep: number;
    maxSteps: number;
    collapsed: boolean;
  };
  
  // Chapter complete
  chapterComplete: boolean;
  
  // Last code entered per puzzle
  lastCode: Record<PuzzleId, string>;
  
  // Actions
  setCurrentPuzzle: (puzzle: PuzzleId) => void;
  updatePuzzleState: (puzzle: PuzzleId, state: Partial<PuzzleState>) => void;
  setStoryVariable: <K extends keyof GameState['storyVariables']>(
    key: K,
    value: GameState['storyVariables'][K]
  ) => void;
  updateBridgeState: (state: Partial<GameState['bridgeState']>) => void;
  completeChapter: () => void;
  setLastCode: (puzzle: PuzzleId, code: string) => void;
  resetGame: () => void;
}

const initialPuzzleState: PuzzleState = {
  completed: false,
  attempts: 0,
};

const initialState = {
  currentPuzzle: 'naming' as PuzzleId,
  puzzles: {
    naming: { ...initialPuzzleState },
    path: { ...initialPuzzleState },
    bridge: { ...initialPuzzleState },
  },
  storyVariables: {},
  bridgeState: {
    currentStep: 0,
    maxSteps: 5,
    collapsed: false,
  },
  chapterComplete: false,
  lastCode: {
    naming: '',
    path: '',
    bridge: '',
  },
};

export const useGameState = create<GameState>((set) => ({
  ...initialState,
  
  setCurrentPuzzle: (puzzle) => set({ currentPuzzle: puzzle }),
  
  updatePuzzleState: (puzzle, state) => set((prev) => ({
    puzzles: {
      ...prev.puzzles,
      [puzzle]: { ...prev.puzzles[puzzle], ...state },
    },
  })),
  
  setStoryVariable: (key, value) => set((prev) => ({
    storyVariables: { ...prev.storyVariables, [key]: value },
  })),
  
  updateBridgeState: (state) => set((prev) => ({
    bridgeState: { ...prev.bridgeState, ...state },
  })),
  
  completeChapter: () => set({ chapterComplete: true }),
  
  setLastCode: (puzzle, code) => set((prev) => ({
    lastCode: { ...prev.lastCode, [puzzle]: code },
  })),
  
  resetGame: () => set(initialState),
}));
