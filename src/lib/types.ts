/**
 * Core Types for JamboScript Story Adventure
 */

import { ExecutionResult } from './jamboscript';

// ─── Chapter & Curriculum ────────────────────────────────────────────
export interface Dialogue {
  speaker: 'kito' | 'mzee_byte' | 'shida' | 'narrator';
  text: string;
  /** Whether this dialogue should show the code hint */
  showCodeHint?: boolean;
  /** Code example to show when showCodeHint is true */
  codeExample?: string;
}

export interface Hint {
  id: string;
  text: string;
  /** @deprecated — hints are now free. Kept for backwards compat. */
  starCost: number;
}

// ─── Exercise System ─────────────────────────────────────────────────

/**
 * Exercise types control scaffolding level and UI behavior:
 * - observe:    Code pre-filled, just press Run (maximum scaffolding)
 * - modify:     Working code, change specific values (medium)
 * - fill-blank: Starter code with ___ blanks to complete (medium-high)
 * - create:     Write from scratch with minimal starter (low)
 * - debug:      Broken code, find and fix the bug (low)
 */
export type ExerciseType = 'observe' | 'modify' | 'fill-blank' | 'create' | 'debug';

export interface ExerciseConfig {
  /** Unique exercise ID, e.g. "ch1-ex1" */
  id: string;
  /** Exercise number within chapter (1-based) */
  order: number;
  /** Exercise type — controls UI scaffolding */
  type: ExerciseType;
  /** Starter code shown in editor (i18n key) */
  starterCode: string;
  /** Short task description (i18n key) */
  task: string;
  /** Riddle / challenge text (i18n key) */
  riddle: string;
  /** Progressive hints — always free, escalating specificity */
  hints: Hint[];
  /** Code that should be prepended (invisible context) */
  contextCode?: string;
  /** Validate the execution result. Return error string or null if correct */
  validate: (result: ExecutionResult, code: string) => string | null;
  /** Expected output for display (optional) */
  expectedOutput?: string;
  /**
   * Map of common mistake patterns → specific feedback messages.
   * Keys are tested as regex against the child's code.
   * Values are i18n keys or raw feedback strings.
   */
  mistakeFeedback?: Record<string, string>;
  /** Short bridging narrative shown before this exercise (i18n key). Skipped for ex1. */
  bridgeText?: string;
  /** Speaker for the bridge text */
  bridgeSpeaker?: 'kito' | 'mzee_byte' | 'shida' | 'narrator';
}

export interface PuzzleConfig {
  id: string;
  /** Starter code shown in editor */
  starterCode: string;
  /** Swahili task description */
  task: string;
  /** Riddle / challenge text */
  riddle: string;
  /** Hints that can be unlocked with stars */
  hints: Hint[];
  /** Code that should be prepended (invisible context) */
  contextCode?: string;
  /** Validate the execution result. Return error string or null if correct */
  validate: (result: ExecutionResult, code: string) => string | null;
  /** Expected output for display (optional) */
  expectedOutput?: string;
}

export type DifficultyTier = 'guided' | 'scaffolded' | 'independent';

export interface ChapterData {
  id: string;
  /** e.g. "sura-1" */
  slug: string;
  /** Display number */
  number: number;
  /** Swahili title */
  title: string;
  /** Swahili subtitle / concept */
  subtitle: string;
  /** Programming concept taught */
  concept: string;
  /** Main character for this chapter */
  character: 'kito' | 'mzee_byte';
  /** Story dialogues */
  dialogues: Dialogue[];
  /** Outro dialogues shown after solving the puzzle (narrative reward) */
  outroDialogues?: Dialogue[];
  /** The puzzle / coding challenge — LEGACY, kept for migration */
  puzzle: PuzzleConfig;
  /** Ordered list of exercises. If present, used instead of puzzle. */
  exercises?: ExerciseConfig[];
  /** Scene / visual theme */
  scene: 'village' | 'forest' | 'bridge' | 'mountain' | 'cave' | 'waterfall' | 'garden' | 'market' | 'library' | 'celebration';
  /** Stars available (1-3) */
  maxStars: number;
  /** Whether chapter is free or premium */
  isFree: boolean;
  /** Previous chapter slug (null for first) */
  prevChapter: string | null;
  /** Next chapter slug (null for last) */
  nextChapter: string | null;
  /** Difficulty tier — controls how much starter code / scaffolding is provided */
  difficulty?: DifficultyTier;
  /** Overarching quest text connecting this chapter to the larger story */
  questHook?: string;
}

// ─── Game State ──────────────────────────────────────────────────────

export interface ExerciseProgress {
  completed: boolean;
  starsEarned: number;
  attempts: number;
  lastCode: string;
}

export interface ChapterProgress {
  completed: boolean;
  starsEarned: number;
  attempts: number;
  hintsUsed: string[];
  lastCode: string;
  lastResult?: ExecutionResult;
  /** Per-exercise progress — keyed by exercise ID */
  exerciseProgress?: Record<string, ExerciseProgress>;
  /** Index of the current exercise the child is on (0-based) */
  currentExerciseIndex?: number;
}

export interface PlayerProfile {
  name: string;
  totalStars: number;
  chaptersCompleted: number;
  currentChapter: string;
}

// ─── UI ──────────────────────────────────────────────────────────────
export type DialogueState = {
  currentIndex: number;
  isTyping: boolean;
  completed: boolean;
};

export type SoundEnabled = boolean;

export type GameScreen = 'landing' | 'map' | 'chapter' | 'playground';
