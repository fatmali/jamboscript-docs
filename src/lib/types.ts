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
  starCost: number;
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
  /** The puzzle / coding challenge */
  puzzle: PuzzleConfig;
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
export interface ChapterProgress {
  completed: boolean;
  starsEarned: number;
  attempts: number;
  hintsUsed: string[];
  lastCode: string;
  lastResult?: ExecutionResult;
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
