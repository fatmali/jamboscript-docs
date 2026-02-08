/**
 * JamboScript Transpiler — Improved
 * Converts JamboScript (Swahili-based) code to JavaScript
 *
 * Fixes:
 * - Preserves string literals during keyword replacement
 * - Strips # comments before transpilation
 * - Proper word-boundary matching
 */

// Keyword mappings (ordered: longer patterns first)
// [swahili, english, useWordBoundary]
const ORDERED_REPLACEMENTS: [string, string, boolean][] = [
  // Multi-word (must come first)
  ['la sivyo', 'else', false],
  // Comparison (space-padded)
  [' angalau ', ' >= ', false],
  [' mpaka ', ' <= ', false],
  [' chini ', ' < ', false],
  [' zaidi ', ' > ', false],
  [' ni ', ' == ', false],
  // Logical (space-padded)
  [' na ', ' && ', false],
  [' au ', ' || ', false],
  // Word-boundary keywords
  ['wakati', 'while', true],
  ['thabiti', 'const', true],
  ['rudisha', 'return', true],
  ['endelea', 'continue', true],
  ['kawaida', 'default', true],
  ['andika', 'console.log', true],
  ['chagua', 'switch', true],
  ['kweli', 'true', true],
  ['sivyo', 'false', true],
  ['rudia', 'for', true],
  ['vunja', 'break', true],
  ['acha', 'let', true],
  ['kama', 'if', true],
  ['kazi', 'function', true],
  ['hali', 'case', true],
  ['tupu', 'null', true],
  ['si ', '!', false],
];

export interface TranspileResult {
  success: boolean;
  javascript: string;
  error?: string;
}

/**
 * Strips # comments (but not inside strings)
 */
function stripComments(code: string): string {
  const lines = code.split('\n');
  return lines
    .map((line) => {
      let inString = false;
      let stringChar = '';
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (inString) {
          if (ch === stringChar && line[i - 1] !== '\\') {
            inString = false;
          }
        } else {
          if (ch === '"' || ch === "'") {
            inString = true;
            stringChar = ch;
          } else if (ch === '#') {
            return line.substring(0, i).trimEnd();
          }
        }
      }
      return line;
    })
    .join('\n');
}

/**
 * Extracts string literals, replaces them with placeholders,
 * performs keyword replacement, then restores strings
 */
function protectStrings(
  code: string,
  fn: (code: string) => string
): string {
  const strings: string[] = [];
  const placeholder = '___JSTR_';

  // Extract all string literals
  let result = '';
  let inString = false;
  let stringChar = '';
  let currentString = '';

  for (let i = 0; i < code.length; i++) {
    const ch = code[i];
    if (inString) {
      currentString += ch;
      if (ch === stringChar && code[i - 1] !== '\\') {
        strings.push(currentString);
        result += `${placeholder}${strings.length - 1}___`;
        currentString = '';
        inString = false;
      }
    } else {
      if (ch === '"' || ch === "'") {
        inString = true;
        stringChar = ch;
        currentString = ch;
      } else {
        result += ch;
      }
    }
  }

  // If string wasn't closed, append whatever we have
  if (inString) {
    result += currentString;
  }

  // Apply transformation to non-string code
  result = fn(result);

  // Restore strings
  for (let i = 0; i < strings.length; i++) {
    result = result.replace(`${placeholder}${i}___`, strings[i]);
  }

  return result;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Transpiles JamboScript code to JavaScript
 */
export function transpile(jamboScript: string): TranspileResult {
  try {
    // Step 1: Strip comments
    let code = stripComments(jamboScript);

    // Step 2: Replace keywords (protecting strings)
    code = protectStrings(code, (safeCode) => {
      let js = safeCode;
      for (const [swahili, english, useWordBoundary] of ORDERED_REPLACEMENTS) {
        if (useWordBoundary) {
          const regex = new RegExp(`\\b${escapeRegex(swahili)}\\b`, 'g');
          js = js.replace(regex, english);
        } else {
          const regex = new RegExp(escapeRegex(swahili), 'g');
          js = js.replace(regex, english);
        }
      }
      return js;
    });

    return {
      success: true,
      javascript: code,
    };
  } catch (error) {
    return {
      success: false,
      javascript: '',
      error: error instanceof Error ? error.message : 'Hitilafu ya kubadilisha msimbo',
    };
  }
}

/**
 * Valid JamboScript keywords for autocomplete / highlighting
 */
export const JAMBOSCRIPT_KEYWORDS = [
  'acha',
  'thabiti',
  'kweli',
  'sivyo',
  'tupu',
  'kama',
  'la sivyo',
  'chagua',
  'hali',
  'kawaida',
  'wakati',
  'rudia',
  'vunja',
  'endelea',
  'kazi',
  'rudisha',
  'andika',
  'ni',
  'chini',
  'zaidi',
  'mpaka',
  'angalau',
  'na',
  'au',
  'si',
];

/**
 * Validates that code only uses allowed JamboScript constructs
 */
export function validateJamboScript(
  code: string
): { valid: boolean; error?: string } {
  const dangerous = [
    'eval',
    'Function',
    'setTimeout',
    'setInterval',
    'fetch',
    'XMLHttpRequest',
    'import',
    'require',
    'window',
    'document',
    'localStorage',
    'sessionStorage',
    'process',
    'global',
    '__proto__',
    'constructor',
  ];

  for (const keyword of dangerous) {
    if (code.includes(keyword)) {
      return {
        valid: false,
        error: `Neno "${keyword}" haliruhusiwi katika JamboScript`,
      };
    }
  }

  return { valid: true };
}
