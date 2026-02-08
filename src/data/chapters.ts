/**
 * Chapter Data — The JamboScript Story Curriculum
 * Each chapter is a self-contained story + coding challenge.
 *
 * All user-facing strings are translation keys resolved via next-intl.
 * Keys live under "Chapters" namespace, e.g. "ch1.title" → Chapters.ch1.title
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
    concept: 'Commands & Output (andika)',
    character: 'kito',
    scene: 'village',
    maxStars: 3,
    isFree: true,
    prevChapter: null,
    nextChapter: 'sura-2',
    dialogues: [
      { speaker: 'kito', text: 'ch1.d1' },
      { speaker: 'kito', text: 'ch1.d2' },
      {
        speaker: 'kito',
        text: 'ch1.d3',
        showCodeHint: true,
        codeExample: 'andika("Fungua lango!")',
      },
      { speaker: 'kito', text: 'ch1.d4' },
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
    concept: 'Variables (acha)',
    character: 'kito',
    scene: 'village',
    maxStars: 3,
    isFree: true,
    prevChapter: 'sura-1',
    nextChapter: 'sura-3',
    dialogues: [
      { speaker: 'kito', text: 'ch2.d1' },
      { speaker: 'kito', text: 'ch2.d2' },
      {
        speaker: 'kito',
        text: 'ch2.d3',
        showCodeHint: true,
        codeExample: 'acha jina = "Amani"\nandika(jina)',
      },
      { speaker: 'kito', text: 'ch2.d4' },
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

  // ─── Chapter 3: Conditionals ────────────────────────────────────
  {
    id: 'ch3',
    slug: 'sura-3',
    number: 3,
    title: 'ch3.title',
    subtitle: 'ch3.subtitle',
    concept: 'Conditionals (kama / la sivyo)',
    character: 'mzee_byte',
    scene: 'forest',
    maxStars: 3,
    isFree: true,
    prevChapter: 'sura-2',
    nextChapter: 'sura-4',
    dialogues: [
      { speaker: 'mzee_byte', text: 'ch3.d1' },
      { speaker: 'mzee_byte', text: 'ch3.d2' },
      {
        speaker: 'mzee_byte',
        text: 'ch3.d3',
        showCodeHint: true,
        codeExample: 'kama (hewa ni "mvua") {\n  acha njia = "pango"\n} la sivyo {\n  acha njia = "mto"\n}',
      },
      { speaker: 'mzee_byte', text: 'ch3.d4' },
    ],
    puzzle: {
      id: 'ch3-conditional',
      starterCode: 'ch3.starterCode',
      task: 'ch3.task',
      riddle: 'ch3.riddle',
      contextCode: 'let hewa = Math.random() > 0.5 ? "mvua" : "jua";\n',
      hints: [
        { id: 'h1', text: 'ch3.hint1', starCost: 0 },
        { id: 'h2', text: 'ch3.hint2', starCost: 1 },
        { id: 'h3', text: 'ch3.hint3', starCost: 1 },
      ],
      validate: (result) => {
        if (!result.success) return result.error || 'ch3.errorGeneric';
        const njia = result.variables['njia'];
        if (!njia) return 'ch3.errorNoPath';
        if (njia !== 'pango' && njia !== 'mto') {
          return 'ch3.errorInvalidPath';
        }
        return null;
      },
    },
  },

  // ─── Chapter 4: Loops ──────────────────────────────────────────
  {
    id: 'ch4',
    slug: 'sura-4',
    number: 4,
    title: 'ch4.title',
    subtitle: 'ch4.subtitle',
    concept: 'Loops (rudia / wakati)',
    character: 'mzee_byte',
    scene: 'bridge',
    maxStars: 3,
    isFree: true,
    prevChapter: 'sura-3',
    nextChapter: 'sura-5',
    dialogues: [
      { speaker: 'mzee_byte', text: 'ch4.d1' },
      { speaker: 'mzee_byte', text: 'ch4.d2' },
      {
        speaker: 'mzee_byte',
        text: 'ch4.d3',
        showCodeHint: true,
        codeExample: 'acha hatua = 0\nrudia (acha i = 0; i chini 5; i++) {\n  hatua = hatua + 1\n}',
      },
      { speaker: 'mzee_byte', text: 'ch4.d4' },
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
        const hatua = result.variables['hatua'];
        if (hatua === undefined) return 'ch4.errorNoVar';
        if (typeof hatua === 'number' && hatua === 5) return null;
        if (typeof hatua === 'number' && hatua > 5) return 'ch4.errorTooMany';
        if (typeof hatua === 'number' && hatua < 5) return 'ch4.errorTooFew';
        return 'ch4.errorNotNumber';
      },
    },
  },

  // ─── Chapter 5: Functions ──────────────────────────────────────
  {
    id: 'ch5',
    slug: 'sura-5',
    number: 5,
    title: 'ch5.title',
    subtitle: 'ch5.subtitle',
    concept: 'Functions (kazi / rudisha)',
    character: 'kito',
    scene: 'mountain',
    maxStars: 3,
    isFree: true,
    prevChapter: 'sura-4',
    nextChapter: null,
    dialogues: [
      { speaker: 'kito', text: 'ch5.d1' },
      { speaker: 'kito', text: 'ch5.d2' },
      {
        speaker: 'kito',
        text: 'ch5.d3',
        showCodeHint: true,
        codeExample: 'kazi maraMbili(n) {\n  rudisha n * 2\n}\n\nandika(maraMbili(7))',
      },
      { speaker: 'kito', text: 'ch5.d4' },
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
        const jibu = result.variables['jibu'];
        if (jibu === undefined) return 'ch5.errorNoVar';
        if (jibu === 14) return null;
        return 'ch5.errorWrongAnswer';
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
