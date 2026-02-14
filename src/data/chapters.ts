/**
 * Chapter Data — The JamboScript Story
 *
 * THE ADVENTURE: Save the Magic Tree! 🌳🐛
 * ─────────────────────────────────────────
 * 6 short chapters — one new trick per chapter.
 * Designed for 8-year-olds: lots of scaffolding, fill-in-the-blank,
 * generous validation, and short puzzles.
 *
 *   Ch1:  andika (say things)       — say magic words to open the locked gate
 *   Ch2:  acha (remember things)    — tell the old man your name
 *   Ch3:  kama (make choices)       — pick the right path (fill in one blank)
 *   Ch4:  rudia (repeat things)     — walk across the bridge (fill in the number)
 *   Ch5:  kazi (make recipes)       — create a healing spell (fill in the recipe)
 *   Ch6:  grand finale              — throw a party using everything! (heavily scaffolded)
 *
 * DIFFICULTY:
 *   guided     — almost done, fill in one blank (Ch1-4)
 *   scaffolded — half done, kid writes the important part (Ch5-6)
 *
 * Text keys use next-intl: "ch1.title" → Chapters.ch1.title
 */

import { ChapterData } from '@/lib/types';

export const chapters: ChapterData[] = [
  // ─── Chapter 1: First Commands ──────────────────────────────────
  {
    id: 'ch1',
    slug: 'sura-1',
    number: 1,
    title: 'ch1.title',
    subtitle: 'ch1.subtitle',
    concept: 'Say Things (andika)',
    character: 'kito',
    scene: 'village',
    maxStars: 3,
    isFree: true,
    prevChapter: null,
    nextChapter: 'sura-2',
    difficulty: 'guided',
    questHook: 'ch1.questHook',
    dialogues: [
      { speaker: 'narrator', text: 'ch1.d1' },
      { speaker: 'kito', text: 'ch1.d2' },
      { speaker: 'shida', text: 'ch1.d2b' },
      {
        speaker: 'kito',
        text: 'ch1.d3',
        showCodeHint: true,
        codeExample: 'andika("Fungua lango!")',
      },
      { speaker: 'kito', text: 'ch1.d4' },
    ],
    outroDialogues: [
      { speaker: 'narrator', text: 'ch1.outro1' },
      { speaker: 'kito', text: 'ch1.outro2' },
    ],
    puzzle: {
      id: 'ch1-gate',
      starterCode: 'ch1.starterCode',
      task: 'ch1.task',
      riddle: 'ch1.riddle',
      hints: [
        { id: 'h1', text: 'ch1.hint1', starCost: 0 },
        { id: 'h2', text: 'ch1.hint2', starCost: 1 },
        { id: 'h3', text: 'ch1.hint3', starCost: 1 },
      ],
      validate: (result) => {
        if (!result.success) return result.error || 'ch1.errorGeneric';
        if (result.output.length === 0) return 'ch1.errorNoOutput';
        return null;
      },
      expectedOutput: 'Fungua lango!',
    },
  },

  // ─── Chapter 2: Variables ───────────────────────────────────────
  {
    id: 'ch2',
    slug: 'sura-2',
    number: 2,
    title: 'ch2.title',
    subtitle: 'ch2.subtitle',
    concept: 'Remember Things (acha)',
    character: 'kito',
    scene: 'village',
    maxStars: 3,
    isFree: true,
    prevChapter: 'sura-1',
    nextChapter: 'sura-3',
    difficulty: 'guided',
    questHook: 'ch2.questHook',
    dialogues: [
      { speaker: 'narrator', text: 'ch2.d1' },
      { speaker: 'kito', text: 'ch2.d2' },
      {
        speaker: 'kito',
        text: 'ch2.d3',
        showCodeHint: true,
        codeExample: 'acha jina = "Amani"\nandika(jina)',
      },
      { speaker: 'kito', text: 'ch2.d4' },
    ],
    outroDialogues: [
      { speaker: 'narrator', text: 'ch2.outro1' },
      { speaker: 'shida', text: 'ch2.outro2' },
      { speaker: 'kito', text: 'ch2.outro3' },
    ],
    puzzle: {
      id: 'ch2-naming',
      starterCode: 'ch2.starterCode',
      task: 'ch2.task',
      riddle: 'ch2.riddle',
      hints: [
        { id: 'h1', text: 'ch2.hint1', starCost: 0 },
        { id: 'h2', text: 'ch2.hint2', starCost: 1 },
        { id: 'h3', text: 'ch2.hint3', starCost: 1 },
      ],
      validate: (result) => {
        if (!result.success) return result.error || 'ch2.errorGeneric';
        const jina = result.variables['jina'];
        if (!jina || typeof jina !== 'string' || jina.trim() === '') {
          return 'ch2.errorNoName';
        }
        return null;
      },
    },
  },

  // ─── Chapter 3: Conditionals (GUIDED) ──────────────────────────
  {
    id: 'ch3',
    slug: 'sura-3',
    number: 3,
    title: 'ch3.title',
    subtitle: 'ch3.subtitle',
    concept: 'Make Choices (kama)',
    character: 'mzee_byte',
    scene: 'forest',
    maxStars: 3,
    isFree: true,
    prevChapter: 'sura-2',
    nextChapter: 'sura-4',
    difficulty: 'guided',
    questHook: 'ch3.questHook',
    dialogues: [
      { speaker: 'narrator', text: 'ch3.d1' },
      { speaker: 'shida', text: 'ch3.d1b' },
      { speaker: 'mzee_byte', text: 'ch3.d2' },
      {
        speaker: 'mzee_byte',
        text: 'ch3.d3',
        showCodeHint: true,
        codeExample: 'kama (hewa ni "mvua") {\n  andika("Nenda pangoni!")\n}',
      },
      { speaker: 'mzee_byte', text: 'ch3.d4' },
    ],
    outroDialogues: [
      { speaker: 'narrator', text: 'ch3.outro1' },
      { speaker: 'mzee_byte', text: 'ch3.outro2' },
    ],
    puzzle: {
      id: 'ch3-conditional',
      starterCode: 'ch3.starterCode',
      task: 'ch3.task',
      riddle: 'ch3.riddle',
      contextCode: 'let hewa = "mvua";\n',
      hints: [
        { id: 'h1', text: 'ch3.hint1', starCost: 0 },
        { id: 'h2', text: 'ch3.hint2', starCost: 1 },
        { id: 'h3', text: 'ch3.hint3', starCost: 1 },
      ],
      validate: (result) => {
        if (!result.success) return result.error || 'ch3.errorGeneric';
        if (result.output.length === 0) return 'ch3.errorNoOutput';
        return null;
      },
    },
  },

  // ─── Chapter 4: Loops (GUIDED) ─────────────────────────────────
  {
    id: 'ch4',
    slug: 'sura-4',
    number: 4,
    title: 'ch4.title',
    subtitle: 'ch4.subtitle',
    concept: 'Repeat Things (rudia)',
    character: 'mzee_byte',
    scene: 'bridge',
    maxStars: 3,
    isFree: true,
    prevChapter: 'sura-3',
    nextChapter: 'sura-5',
    difficulty: 'guided',
    questHook: 'ch4.questHook',
    dialogues: [
      { speaker: 'narrator', text: 'ch4.d1' },
      { speaker: 'shida', text: 'ch4.d1b' },
      { speaker: 'mzee_byte', text: 'ch4.d2' },
      {
        speaker: 'mzee_byte',
        text: 'ch4.d3',
        showCodeHint: true,
        codeExample: 'rudia (acha i = 0; i chini 5; i++) {\n  andika("Hatua!")\n}',
      },
      { speaker: 'mzee_byte', text: 'ch4.d4' },
    ],
    outroDialogues: [
      { speaker: 'narrator', text: 'ch4.outro1' },
      { speaker: 'mzee_byte', text: 'ch4.outro2' },
      { speaker: 'shida', text: 'ch4.outro3' },
    ],
    puzzle: {
      id: 'ch4-loop',
      starterCode: 'ch4.starterCode',
      task: 'ch4.task',
      riddle: 'ch4.riddle',
      hints: [
        { id: 'h1', text: 'ch4.hint1', starCost: 0 },
        { id: 'h2', text: 'ch4.hint2', starCost: 1 },
        { id: 'h3', text: 'ch4.hint3', starCost: 1 },
      ],
      validate: (result) => {
        if (!result.success) return result.error || 'ch4.errorGeneric';
        if (result.output.length === 0) return 'ch4.errorNoOutput';
        if (result.output.length < 5) return 'ch4.errorTooFew';
        if (result.output.length > 10) return 'ch4.errorTooMany';
        return null;
      },
    },
  },

  // ─── Chapter 5: Functions (SCAFFOLDED) ─────────────────────────
  {
    id: 'ch5',
    slug: 'sura-5',
    number: 5,
    title: 'ch5.title',
    subtitle: 'ch5.subtitle',
    concept: 'Make Recipes (kazi)',
    character: 'kito',
    scene: 'mountain',
    maxStars: 3,
    isFree: true,
    prevChapter: 'sura-4',
    nextChapter: 'sura-6',
    difficulty: 'scaffolded',
    questHook: 'ch5.questHook',
    dialogues: [
      { speaker: 'narrator', text: 'ch5.d1' },
      { speaker: 'kito', text: 'ch5.d2' },
      {
        speaker: 'kito',
        text: 'ch5.d3',
        showCodeHint: true,
        codeExample: 'kazi ponyaMti() {\n  andika("Mti, pona!")\n}\n\nponyaMti()',
      },
      { speaker: 'kito', text: 'ch5.d4' },
    ],
    outroDialogues: [
      { speaker: 'narrator', text: 'ch5.outro1' },
      { speaker: 'kito', text: 'ch5.outro2' },
      { speaker: 'shida', text: 'ch5.outro3' },
      { speaker: 'narrator', text: 'ch5.outro4' },
    ],
    puzzle: {
      id: 'ch5-function',
      starterCode: 'ch5.starterCode',
      task: 'ch5.task',
      riddle: 'ch5.riddle',
      hints: [
        { id: 'h1', text: 'ch5.hint1', starCost: 0 },
        { id: 'h2', text: 'ch5.hint2', starCost: 1 },
        { id: 'h3', text: 'ch5.hint3', starCost: 1 },
      ],
      validate: (result) => {
        if (!result.success) return result.error || 'ch5.errorGeneric';
        if (result.output.length === 0) return 'ch5.errorNoOutput';
        return null;
      },
    },
  },

  // ─── Chapter 6: Grand Finale (SCAFFOLDED) ──────────────────────
  {
    id: 'ch6',
    slug: 'sura-6',
    number: 6,
    title: 'ch6.title',
    subtitle: 'ch6.subtitle',
    concept: 'Everything Together! 🎉',
    character: 'kito',
    scene: 'celebration',
    maxStars: 3,
    isFree: true,
    prevChapter: 'sura-5',
    nextChapter: null,
    difficulty: 'scaffolded',
    questHook: 'ch6.questHook',
    dialogues: [
      { speaker: 'narrator', text: 'ch6.d1' },
      { speaker: 'shida', text: 'ch6.d2' },
      { speaker: 'kito', text: 'ch6.d3' },
      {
        speaker: 'kito',
        text: 'ch6.d4',
        showCodeHint: true,
        codeExample: 'acha mgeni = "Kito"\nandika("Karibu " + mgeni + "!")',
      },
      { speaker: 'kito', text: 'ch6.d5' },
    ],
    outroDialogues: [
      { speaker: 'narrator', text: 'ch6.outro1' },
      { speaker: 'kito', text: 'ch6.outro2' },
      { speaker: 'shida', text: 'ch6.outro3' },
      { speaker: 'narrator', text: 'ch6.outro4' },
    ],
    puzzle: {
      id: 'ch6-finale',
      starterCode: 'ch6.starterCode',
      task: 'ch6.task',
      riddle: 'ch6.riddle',
      hints: [
        { id: 'h1', text: 'ch6.hint1', starCost: 0 },
        { id: 'h2', text: 'ch6.hint2', starCost: 1 },
        { id: 'h3', text: 'ch6.hint3', starCost: 1 },
      ],
      validate: (result) => {
        if (!result.success) return result.error || 'ch6.errorGeneric';
        if (result.output.length === 0) return 'ch6.errorNoOutput';
        const hasKaribu = result.output.some(line => line.toLowerCase().includes('karibu'));
        if (!hasKaribu) return 'ch6.errorNoKaribu';
        return null;
      },
    },
  },
];

export function getChapterBySlug(slug: string): ChapterData | undefined {
  return chapters.find(c => c.slug === slug);
}

export function getChapterById(id: string): ChapterData | undefined {
  return chapters.find(c => c.id === id);
}

export function getNextChapter(currentSlug: string): ChapterData | undefined {
  const current = getChapterBySlug(currentSlug);
  if (!current?.nextChapter) return undefined;
  return getChapterBySlug(current.nextChapter);
}
