/**
 * Chapter Data — The JamboScript Story
 *
 * THE ADVENTURE: Save the Magic Tree! 🌳🐛
 * ─────────────────────────────────────────
 * 6 chapters — each with 4 graduated exercises per concept.
 * Designed for 8-year-olds: progressive scaffolding from
 * "press Run" → "modify" → "fill in" → "write from scratch".
 *
 *   Ch1:  andika (say things)       — 4 exercises
 *   Ch2:  acha (remember things)    — 4 exercises
 *   Ch3:  kama (make choices)       — 4 exercises
 *   Ch4:  rudia (repeat things)     — 4 exercises
 *   Ch5:  kazi (make recipes)       — 4 exercises
 *   Ch6:  grand finale              — 4 exercises
 *
 * EXERCISE TYPES (progressive scaffolding):
 *   observe    — code pre-filled, just press Run
 *   modify     — working code, change specific values
 *   fill-blank — starter code with ___ blanks to complete
 *   create     — write from scratch
 *   debug      — broken code, find and fix the bug
 *
 * Text keys use next-intl: "ch1.title" → Chapters.ch1.title
 */

import { ChapterData, ExerciseConfig } from '@/lib/types';

// ─── Helper: check if code uses a specific JamboScript keyword ──────
function codeUses(code: string, keyword: string): boolean {
  // Match keyword as a standalone word (not inside strings)
  // Simple heuristic: check if keyword appears outside of quoted strings
  const stripped = code.replace(/"[^"]*"|'[^']*'/g, '""');
  return new RegExp(`\\b${keyword}\\b`).test(stripped);
}

// ─── Chapter 1: andika (Print / Output) ─────────────────────────────

const ch1Exercises: ExerciseConfig[] = [
  // Ex 1: OBSERVE — just press Run to see andika work
  {
    id: 'ch1-ex1',
    order: 1,
    type: 'observe',
    starterCode: 'ch1.starterCode',
    task: 'ch1.task',
    riddle: 'ch1.riddle',
    hints: [
      { id: 'h1', text: 'ch1.hint1', starCost: 0 },
    ],
    validate: (result) => {
      if (!result.success) return result.error || 'ch1.errorGeneric';
      if (result.output.length === 0) return 'ch1.errorNoOutput';
      return null;
    },
    expectedOutput: 'Fungua lango!',
  },
  // Ex 2: MODIFY — change the message to your own words
  {
    id: 'ch1-ex2',
    order: 2,
    type: 'modify',
    starterCode: 'ch1.ex2.starterCode',
    task: 'ch1.ex2.task',
    riddle: 'ch1.ex2.riddle',
    bridgeText: 'ch1.ex2.bridge',
    bridgeSpeaker: 'kito',
    hints: [
      { id: 'h1', text: 'ch1.ex2.hint1', starCost: 0 },
      { id: 'h2', text: 'ch1.ex2.hint2', starCost: 0 },
    ],
    validate: (result, code) => {
      if (!result.success) return result.error || 'ch1.errorGeneric';
      if (result.output.length === 0) return 'ch1.errorNoOutput';
      if (!codeUses(code, 'andika')) return 'ch1.ex2.errorNoAndika';
      // Must have changed the message from default
      if (result.output[0] === 'Fungua lango!') return 'ch1.ex2.errorSameMessage';
      return null;
    },
    mistakeFeedback: {
      '^\\s*$': 'ch1.ex2.errorEmpty',
    },
  },
  // Ex 3: FILL-BLANK — print TWO lines
  {
    id: 'ch1-ex3',
    order: 3,
    type: 'fill-blank',
    starterCode: 'ch1.ex3.starterCode',
    task: 'ch1.ex3.task',
    riddle: 'ch1.ex3.riddle',
    bridgeText: 'ch1.ex3.bridge',
    bridgeSpeaker: 'kito',
    hints: [
      { id: 'h1', text: 'ch1.ex3.hint1', starCost: 0 },
      { id: 'h2', text: 'ch1.ex3.hint2', starCost: 0 },
    ],
    validate: (result, code) => {
      if (!result.success) return result.error || 'ch1.errorGeneric';
      if (!codeUses(code, 'andika')) return 'ch1.ex2.errorNoAndika';
      if (result.output.length < 2) return 'ch1.ex3.errorNeedTwo';
      return null;
    },
  },
  // Ex 4: DEBUG — Shida broke the code! fix missing quotes
  {
    id: 'ch1-ex4',
    order: 4,
    type: 'debug',
    starterCode: 'ch1.ex4.starterCode',
    task: 'ch1.ex4.task',
    riddle: 'ch1.ex4.riddle',
    bridgeText: 'ch1.ex4.bridge',
    bridgeSpeaker: 'shida',
    hints: [
      { id: 'h1', text: 'ch1.ex4.hint1', starCost: 0 },
      { id: 'h2', text: 'ch1.ex4.hint2', starCost: 0 },
      { id: 'h3', text: 'ch1.ex4.hint3', starCost: 0 },
    ],
    validate: (result, code) => {
      if (!result.success) return result.error || 'ch1.errorGeneric';
      if (!codeUses(code, 'andika')) return 'ch1.ex2.errorNoAndika';
      if (result.output.length === 0) return 'ch1.errorNoOutput';
      const hasQuotes = /andika\s*\(\s*"[^"]+"\s*\)/.test(code) || /andika\s*\(\s*'[^']+'\s*\)/.test(code);
      if (!hasQuotes) return 'ch1.ex4.errorNoQuotes';
      return null;
    },
    mistakeFeedback: {
      'andika\\([^"\']*\\)': 'ch1.ex4.hintQuotes',
    },
  },
];

// ─── Chapter 2: acha (Variables) ─────────────────────────────────────

const ch2Exercises: ExerciseConfig[] = [
  // Ex 1: MODIFY — change the name variable to YOUR name
  {
    id: 'ch2-ex1',
    order: 1,
    type: 'modify',
    starterCode: 'ch2.starterCode',
    task: 'ch2.task',
    riddle: 'ch2.riddle',
    hints: [
      { id: 'h1', text: 'ch2.hint1', starCost: 0 },
      { id: 'h2', text: 'ch2.hint2', starCost: 0 },
    ],
    validate: (result, code) => {
      if (!result.success) return result.error || 'ch2.errorGeneric';
      if (!codeUses(code, 'acha')) return 'ch2.ex2.errorNoAcha';
      const jina = result.variables['jina'];
      if (!jina || typeof jina !== 'string' || jina.trim() === '' || jina === 'Your Name' || jina === 'Jina Lako') {
        return 'ch2.errorNoName';
      }
      return null;
    },
  },
  // Ex 2: FILL-BLANK — store your age and print it
  {
    id: 'ch2-ex2',
    order: 2,
    type: 'fill-blank',
    starterCode: 'ch2.ex2.starterCode',
    task: 'ch2.ex2.task',
    riddle: 'ch2.ex2.riddle',
    bridgeText: 'ch2.ex2.bridge',
    bridgeSpeaker: 'kito',
    hints: [
      { id: 'h1', text: 'ch2.ex2.hint1', starCost: 0 },
      { id: 'h2', text: 'ch2.ex2.hint2', starCost: 0 },
    ],
    validate: (result, code) => {
      if (!result.success) return result.error || 'ch2.errorGeneric';
      if (!codeUses(code, 'acha')) return 'ch2.ex2.errorNoAcha';
      const umri = result.variables['umri'];
      if (umri === undefined || typeof umri !== 'number') return 'ch2.ex2.errorNoUmri';
      if (result.output.length === 0) return 'ch2.ex2.errorNoOutput';
      return null;
    },
  },
  // Ex 3: CREATE — make two variables and print both
  {
    id: 'ch2-ex3',
    order: 3,
    type: 'create',
    starterCode: 'ch2.ex3.starterCode',
    task: 'ch2.ex3.task',
    riddle: 'ch2.ex3.riddle',
    bridgeText: 'ch2.ex3.bridge',
    bridgeSpeaker: 'mzee_byte',
    hints: [
      { id: 'h1', text: 'ch2.ex3.hint1', starCost: 0 },
      { id: 'h2', text: 'ch2.ex3.hint2', starCost: 0 },
      { id: 'h3', text: 'ch2.ex3.hint3', starCost: 0 },
    ],
    validate: (result, code) => {
      if (!result.success) return result.error || 'ch2.errorGeneric';
      if (!codeUses(code, 'acha')) return 'ch2.ex2.errorNoAcha';
      if (!codeUses(code, 'andika')) return 'ch1.ex2.errorNoAndika';
      // Must have at least 2 variables
      const achaCount = (code.match(/\bacha\b/g) || []).length;
      if (achaCount < 2) return 'ch2.ex3.errorNeedTwo';
      if (result.output.length < 2) return 'ch2.ex3.errorPrintBoth';
      return null;
    },
  },
  // Ex 4: DEBUG — fix variable name typo
  {
    id: 'ch2-ex4',
    order: 4,
    type: 'debug',
    starterCode: 'ch2.ex4.starterCode',
    task: 'ch2.ex4.task',
    riddle: 'ch2.ex4.riddle',
    bridgeText: 'ch2.ex4.bridge',
    bridgeSpeaker: 'shida',
    hints: [
      { id: 'h1', text: 'ch2.ex4.hint1', starCost: 0 },
      { id: 'h2', text: 'ch2.ex4.hint2', starCost: 0 },
      { id: 'h3', text: 'ch2.ex4.hint3', starCost: 0 },
    ],
    validate: (result, code) => {
      if (!result.success) return result.error || 'ch2.errorGeneric';
      if (!codeUses(code, 'acha')) return 'ch2.ex2.errorNoAcha';
      if (result.output.length === 0) return 'ch2.ex2.errorNoOutput';
      return null;
    },
    mistakeFeedback: {
      'andika\\(wanyama\\)': 'ch2.ex4.hintSpelling',
    },
  },
];

// ─── Chapter 3: kama (Conditionals) ──────────────────────────────────

const ch3Exercises: ExerciseConfig[] = [
  // Ex 1: FILL-BLANK — write a kama condition (weather check)
  {
    id: 'ch3-ex1',
    order: 1,
    type: 'fill-blank',
    starterCode: 'ch3.starterCode',
    task: 'ch3.task',
    riddle: 'ch3.riddle',
    contextCode: 'let hewa = "mvua";\n',
    hints: [
      { id: 'h1', text: 'ch3.hint1', starCost: 0 },
      { id: 'h2', text: 'ch3.hint2', starCost: 0 },
    ],
    validate: (result, code) => {
      if (!result.success) return result.error || 'ch3.errorGeneric';
      if (!codeUses(code, 'kama')) return 'ch3.ex2.errorNoKama';
      if (result.output.length === 0) return 'ch3.errorNoOutput';
      return null;
    },
  },
  // Ex 2: MODIFY — add "la sivyo" (else) branch
  {
    id: 'ch3-ex2',
    order: 2,
    type: 'modify',
    starterCode: 'ch3.ex2.starterCode',
    task: 'ch3.ex2.task',
    riddle: 'ch3.ex2.riddle',
    contextCode: 'let hewa = "mvua";\n',
    bridgeText: 'ch3.ex2.bridge',
    bridgeSpeaker: 'mzee_byte',
    hints: [
      { id: 'h1', text: 'ch3.ex2.hint1', starCost: 0 },
      { id: 'h2', text: 'ch3.ex2.hint2', starCost: 0 },
    ],
    validate: (result, code) => {
      if (!result.success) return result.error || 'ch3.errorGeneric';
      if (!codeUses(code, 'kama')) return 'ch3.ex2.errorNoKama';
      // Must have "la sivyo" (else)
      if (!code.includes('la sivyo')) return 'ch3.ex2.errorNoElse';
      if (result.output.length === 0) return 'ch3.errorNoOutput';
      return null;
    },
  },
  // Ex 3: CREATE — write your own kama/la sivyo from scratch
  {
    id: 'ch3-ex3',
    order: 3,
    type: 'create',
    starterCode: 'ch3.ex3.starterCode',
    task: 'ch3.ex3.task',
    riddle: 'ch3.ex3.riddle',
    bridgeText: 'ch3.ex3.bridge',
    bridgeSpeaker: 'kito',
    hints: [
      { id: 'h1', text: 'ch3.ex3.hint1', starCost: 0 },
      { id: 'h2', text: 'ch3.ex3.hint2', starCost: 0 },
      { id: 'h3', text: 'ch3.ex3.hint3', starCost: 0 },
    ],
    validate: (result, code) => {
      if (!result.success) return result.error || 'ch3.errorGeneric';
      if (!codeUses(code, 'kama')) return 'ch3.ex2.errorNoKama';
      if (!codeUses(code, 'acha')) return 'ch2.ex2.errorNoAcha';
      if (result.output.length === 0) return 'ch3.errorNoOutput';
      return null;
    },
  },
  // Ex 4: DEBUG — wrong condition (checking jua instead of mvua)
  {
    id: 'ch3-ex4',
    order: 4,
    type: 'debug',
    starterCode: 'ch3.ex4.starterCode',
    task: 'ch3.ex4.task',
    riddle: 'ch3.ex4.riddle',
    contextCode: 'let hewa = "mvua";\n',
    bridgeText: 'ch3.ex4.bridge',
    bridgeSpeaker: 'shida',
    hints: [
      { id: 'h1', text: 'ch3.ex4.hint1', starCost: 0 },
      { id: 'h2', text: 'ch3.ex4.hint2', starCost: 0 },
      { id: 'h3', text: 'ch3.ex4.hint3', starCost: 0 },
    ],
    validate: (result, code) => {
      if (!result.success) return result.error || 'ch3.errorGeneric';
      if (!codeUses(code, 'kama')) return 'ch3.ex2.errorNoKama';
      if (result.output.length === 0) return 'ch3.errorNoOutput';
      // Must check for mvua (rain), not jua (sun) — since it IS raining
      const checksMvua = /hewa\s*ni\s*"mvua"/.test(code);
      if (!checksMvua) return 'ch3.ex4.errorWrongCondition';
      return null;
    },
    mistakeFeedback: {
      'hewa\\s*ni\\s*"jua"': 'ch3.ex4.hintWrongWeather',
    },
  },
];

// ─── Chapter 4: rudia (Loops) ────────────────────────────────────────

const ch4Exercises: ExerciseConfig[] = [
  // Ex 1: OBSERVE — press Run to see the loop count to 5
  {
    id: 'ch4-ex1',
    order: 1,
    type: 'observe',
    starterCode: 'ch4.starterCode',
    task: 'ch4.task',
    riddle: 'ch4.riddle',
    hints: [
      { id: 'h1', text: 'ch4.hint1', starCost: 0 },
    ],
    validate: (result) => {
      if (!result.success) return result.error || 'ch4.errorGeneric';
      if (result.output.length === 0) return 'ch4.errorNoOutput';
      if (result.output.length < 5) return 'ch4.errorTooFew';
      return null;
    },
  },
  // Ex 2: MODIFY — change the loop to run 3 times only
  {
    id: 'ch4-ex2',
    order: 2,
    type: 'modify',
    starterCode: 'ch4.ex2.starterCode',
    task: 'ch4.ex2.task',
    riddle: 'ch4.ex2.riddle',
    bridgeText: 'ch4.ex2.bridge',
    bridgeSpeaker: 'mzee_byte',
    hints: [
      { id: 'h1', text: 'ch4.ex2.hint1', starCost: 0 },
      { id: 'h2', text: 'ch4.ex2.hint2', starCost: 0 },
    ],
    validate: (result, code) => {
      if (!result.success) return result.error || 'ch4.errorGeneric';
      if (!codeUses(code, 'rudia')) return 'ch4.ex2.errorNoRudia';
      if (result.output.length === 0) return 'ch4.errorNoOutput';
      if (result.output.length !== 3) return 'ch4.ex2.errorNeedThree';
      return null;
    },
  },
  // Ex 3: FILL-BLANK — print the counter variable i
  {
    id: 'ch4-ex3',
    order: 3,
    type: 'fill-blank',
    starterCode: 'ch4.ex3.starterCode',
    task: 'ch4.ex3.task',
    riddle: 'ch4.ex3.riddle',
    bridgeText: 'ch4.ex3.bridge',
    bridgeSpeaker: 'kito',
    hints: [
      { id: 'h1', text: 'ch4.ex3.hint1', starCost: 0 },
      { id: 'h2', text: 'ch4.ex3.hint2', starCost: 0 },
      { id: 'h3', text: 'ch4.ex3.hint3', starCost: 0 },
    ],
    validate: (result, code) => {
      if (!result.success) return result.error || 'ch4.errorGeneric';
      if (!codeUses(code, 'rudia')) return 'ch4.ex2.errorNoRudia';
      if (result.output.length < 3) return 'ch4.ex3.errorNeedNumbers';
      // Check that output contains numbers (using counter variable)
      const hasNumbers = result.output.some(line => /\d/.test(line));
      if (!hasNumbers) return 'ch4.ex3.errorNoNumbers';
      return null;
    },
  },
  // Ex 4: CREATE — write a loop that prints 4 animal sounds
  {
    id: 'ch4-ex4',
    order: 4,
    type: 'create',
    starterCode: 'ch4.ex4.starterCode',
    task: 'ch4.ex4.task',
    riddle: 'ch4.ex4.riddle',
    bridgeText: 'ch4.ex4.bridge',
    bridgeSpeaker: 'kito',
    hints: [
      { id: 'h1', text: 'ch4.ex4.hint1', starCost: 0 },
      { id: 'h2', text: 'ch4.ex4.hint2', starCost: 0 },
      { id: 'h3', text: 'ch4.ex4.hint3', starCost: 0 },
    ],
    validate: (result, code) => {
      if (!result.success) return result.error || 'ch4.errorGeneric';
      if (!codeUses(code, 'rudia')) return 'ch4.ex2.errorNoRudia';
      if (result.output.length < 4) return 'ch4.ex4.errorNeedFour';
      return null;
    },
  },
];

// ─── Chapter 5: kazi (Functions) ─────────────────────────────────────

const ch5Exercises: ExerciseConfig[] = [
  // Ex 1: FILL-BLANK — complete a function and call it
  {
    id: 'ch5-ex1',
    order: 1,
    type: 'fill-blank',
    starterCode: 'ch5.starterCode',
    task: 'ch5.task',
    riddle: 'ch5.riddle',
    hints: [
      { id: 'h1', text: 'ch5.hint1', starCost: 0 },
      { id: 'h2', text: 'ch5.hint2', starCost: 0 },
    ],
    validate: (result, code) => {
      if (!result.success) return result.error || 'ch5.errorGeneric';
      if (!codeUses(code, 'kazi')) return 'ch5.ex2.errorNoKazi';
      if (result.output.length === 0) return 'ch5.errorNoOutput';
      return null;
    },
  },
  // Ex 2: MODIFY — call the function twice
  {
    id: 'ch5-ex2',
    order: 2,
    type: 'modify',
    starterCode: 'ch5.ex2.starterCode',
    task: 'ch5.ex2.task',
    riddle: 'ch5.ex2.riddle',
    bridgeText: 'ch5.ex2.bridge',
    bridgeSpeaker: 'kito',
    hints: [
      { id: 'h1', text: 'ch5.ex2.hint1', starCost: 0 },
      { id: 'h2', text: 'ch5.ex2.hint2', starCost: 0 },
    ],
    validate: (result, code) => {
      if (!result.success) return result.error || 'ch5.errorGeneric';
      if (!codeUses(code, 'kazi')) return 'ch5.ex2.errorNoKazi';
      if (result.output.length < 2) return 'ch5.ex2.errorCallTwice';
      return null;
    },
  },
  // Ex 3: CREATE — write TWO functions from scratch
  {
    id: 'ch5-ex3',
    order: 3,
    type: 'create',
    starterCode: 'ch5.ex3.starterCode',
    task: 'ch5.ex3.task',
    riddle: 'ch5.ex3.riddle',
    bridgeText: 'ch5.ex3.bridge',
    bridgeSpeaker: 'mzee_byte',
    hints: [
      { id: 'h1', text: 'ch5.ex3.hint1', starCost: 0 },
      { id: 'h2', text: 'ch5.ex3.hint2', starCost: 0 },
      { id: 'h3', text: 'ch5.ex3.hint3', starCost: 0 },
    ],
    validate: (result, code) => {
      if (!result.success) return result.error || 'ch5.errorGeneric';
      if (!codeUses(code, 'kazi')) return 'ch5.ex2.errorNoKazi';
      // Count function definitions
      const kaziCount = (code.replace(/"[^"]*"|'[^']*'/g, '""').match(/\bkazi\b/g) || []).length;
      if (kaziCount < 2) return 'ch5.ex3.errorNeedTwo';
      if (result.output.length < 2) return 'ch5.ex3.errorCallBoth';
      return null;
    },
  },
  // Ex 4: FILL-BLANK — function with a parameter (salimia)
  {
    id: 'ch5-ex4',
    order: 4,
    type: 'fill-blank',
    starterCode: 'ch5.ex4.starterCode',
    task: 'ch5.ex4.task',
    riddle: 'ch5.ex4.riddle',
    bridgeText: 'ch5.ex4.bridge',
    bridgeSpeaker: 'kito',
    hints: [
      { id: 'h1', text: 'ch5.ex4.hint1', starCost: 0 },
      { id: 'h2', text: 'ch5.ex4.hint2', starCost: 0 },
      { id: 'h3', text: 'ch5.ex4.hint3', starCost: 0 },
    ],
    validate: (result, code) => {
      if (!result.success) return result.error || 'ch5.errorGeneric';
      if (!codeUses(code, 'kazi')) return 'ch5.ex2.errorNoKazi';
      if (result.output.length < 2) return 'ch5.ex4.errorCallWithNames';
      // Check function was called with different arguments
      const calls = code.match(/salimia\s*\(/g) || [];
      if (calls.length < 2) return 'ch5.ex4.errorCallWithNames';
      return null;
    },
  },
];

// ─── Chapter 6: Grand Finale (Everything Together) ───────────────────

const ch6Exercises: ExerciseConfig[] = [
  // Ex 1: MODIFY — change the guest's name in the party code
  {
    id: 'ch6-ex1',
    order: 1,
    type: 'modify',
    starterCode: 'ch6.starterCode',
    task: 'ch6.task',
    riddle: 'ch6.riddle',
    hints: [
      { id: 'h1', text: 'ch6.hint1', starCost: 0 },
    ],
    validate: (result, code) => {
      if (!result.success) return result.error || 'ch6.errorGeneric';
      if (!codeUses(code, 'acha')) return 'ch2.ex2.errorNoAcha';
      if (result.output.length === 0) return 'ch6.errorNoOutput';
      const hasKaribu = result.output.some(line => line.toLowerCase().includes('karibu'));
      if (!hasKaribu) return 'ch6.errorNoKaribu';
      return null;
    },
  },
  // Ex 2: MODIFY — add a kama condition to the party
  {
    id: 'ch6-ex2',
    order: 2,
    type: 'modify',
    starterCode: 'ch6.ex2.starterCode',
    task: 'ch6.ex2.task',
    riddle: 'ch6.ex2.riddle',
    bridgeText: 'ch6.ex2.bridge',
    bridgeSpeaker: 'kito',
    hints: [
      { id: 'h1', text: 'ch6.ex2.hint1', starCost: 0 },
      { id: 'h2', text: 'ch6.ex2.hint2', starCost: 0 },
    ],
    validate: (result, code) => {
      if (!result.success) return result.error || 'ch6.errorGeneric';
      if (!codeUses(code, 'kama')) return 'ch3.ex2.errorNoKama';
      if (result.output.length < 2) return 'ch6.ex2.errorNeedTwo';
      return null;
    },
  },
  // Ex 3: CREATE — use a loop to invite friends
  {
    id: 'ch6-ex3',
    order: 3,
    type: 'create',
    starterCode: 'ch6.ex3.starterCode',
    task: 'ch6.ex3.task',
    riddle: 'ch6.ex3.riddle',
    bridgeText: 'ch6.ex3.bridge',
    bridgeSpeaker: 'mzee_byte',
    hints: [
      { id: 'h1', text: 'ch6.ex3.hint1', starCost: 0 },
      { id: 'h2', text: 'ch6.ex3.hint2', starCost: 0 },
      { id: 'h3', text: 'ch6.ex3.hint3', starCost: 0 },
    ],
    validate: (result, code) => {
      if (!result.success) return result.error || 'ch6.errorGeneric';
      if (!codeUses(code, 'rudia')) return 'ch4.ex2.errorNoRudia';
      if (!codeUses(code, 'andika')) return 'ch1.ex2.errorNoAndika';
      if (result.output.length < 3) return 'ch6.ex3.errorNeedThree';
      return null;
    },
  },
  // Ex 4: CREATE — write a function for the celebration
  {
    id: 'ch6-ex4',
    order: 4,
    type: 'create',
    starterCode: 'ch6.ex4.starterCode',
    task: 'ch6.ex4.task',
    riddle: 'ch6.ex4.riddle',
    bridgeText: 'ch6.ex4.bridge',
    bridgeSpeaker: 'kito',
    hints: [
      { id: 'h1', text: 'ch6.ex4.hint1', starCost: 0 },
      { id: 'h2', text: 'ch6.ex4.hint2', starCost: 0 },
      { id: 'h3', text: 'ch6.ex4.hint3', starCost: 0 },
    ],
    validate: (result, code) => {
      if (!result.success) return result.error || 'ch6.errorGeneric';
      if (!codeUses(code, 'kazi')) return 'ch5.ex2.errorNoKazi';
      if (!codeUses(code, 'andika')) return 'ch1.ex2.errorNoAndika';
      if (result.output.length < 2) return 'ch6.ex4.errorNeedFunction';
      return null;
    },
  },
];

// ─── Chapter Definitions ─────────────────────────────────────────────

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
    exercises: ch1Exercises,
    puzzle: {
      id: 'ch1-gate',
      starterCode: 'ch1.starterCode',
      task: 'ch1.task',
      riddle: 'ch1.riddle',
      hints: [
        { id: 'h1', text: 'ch1.hint1', starCost: 0 },
        { id: 'h2', text: 'ch1.hint2', starCost: 0 },
        { id: 'h3', text: 'ch1.hint3', starCost: 0 },
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
    exercises: ch2Exercises,
    puzzle: {
      id: 'ch2-naming',
      starterCode: 'ch2.starterCode',
      task: 'ch2.task',
      riddle: 'ch2.riddle',
      hints: [
        { id: 'h1', text: 'ch2.hint1', starCost: 0 },
        { id: 'h2', text: 'ch2.hint2', starCost: 0 },
        { id: 'h3', text: 'ch2.hint3', starCost: 0 },
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

  // ─── Chapter 3: Conditionals ───────────────────────────────────
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
    exercises: ch3Exercises,
    puzzle: {
      id: 'ch3-conditional',
      starterCode: 'ch3.starterCode',
      task: 'ch3.task',
      riddle: 'ch3.riddle',
      contextCode: 'let hewa = "mvua";\n',
      hints: [
        { id: 'h1', text: 'ch3.hint1', starCost: 0 },
        { id: 'h2', text: 'ch3.hint2', starCost: 0 },
        { id: 'h3', text: 'ch3.hint3', starCost: 0 },
      ],
      validate: (result) => {
        if (!result.success) return result.error || 'ch3.errorGeneric';
        if (result.output.length === 0) return 'ch3.errorNoOutput';
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
    exercises: ch4Exercises,
    puzzle: {
      id: 'ch4-loop',
      starterCode: 'ch4.starterCode',
      task: 'ch4.task',
      riddle: 'ch4.riddle',
      hints: [
        { id: 'h1', text: 'ch4.hint1', starCost: 0 },
        { id: 'h2', text: 'ch4.hint2', starCost: 0 },
        { id: 'h3', text: 'ch4.hint3', starCost: 0 },
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

  // ─── Chapter 5: Functions ──────────────────────────────────────
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
    exercises: ch5Exercises,
    puzzle: {
      id: 'ch5-function',
      starterCode: 'ch5.starterCode',
      task: 'ch5.task',
      riddle: 'ch5.riddle',
      hints: [
        { id: 'h1', text: 'ch5.hint1', starCost: 0 },
        { id: 'h2', text: 'ch5.hint2', starCost: 0 },
        { id: 'h3', text: 'ch5.hint3', starCost: 0 },
      ],
      validate: (result) => {
        if (!result.success) return result.error || 'ch5.errorGeneric';
        if (result.output.length === 0) return 'ch5.errorNoOutput';
        return null;
      },
    },
  },

  // ─── Chapter 6: Grand Finale ───────────────────────────────────
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
    exercises: ch6Exercises,
    puzzle: {
      id: 'ch6-finale',
      starterCode: 'ch6.starterCode',
      task: 'ch6.task',
      riddle: 'ch6.riddle',
      hints: [
        { id: 'h1', text: 'ch6.hint1', starCost: 0 },
        { id: 'h2', text: 'ch6.hint2', starCost: 0 },
        { id: 'h3', text: 'ch6.hint3', starCost: 0 },
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
