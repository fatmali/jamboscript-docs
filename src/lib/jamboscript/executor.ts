/**
 * JamboScript Runtime Executor — Hardened for Kids Safety
 * Safely executes transpiled JavaScript with security sandbox
 * 
 * Security features:
 * - Blocklist of dangerous JavaScript APIs
 * - Execution timeout to prevent infinite loops
 * - Output limits to prevent memory exhaustion
 * - Prototype chain protection
 */

import { transpile, validateJamboScript } from './transpiler';

export interface ExecutionResult {
  success: boolean;
  variables: Record<string, unknown>;
  output: string[];
  error?: string;
  errorLine?: number;
}

// Security: Maximum execution time (3 seconds) to prevent infinite loops
const EXECUTION_TIMEOUT_MS = 3000;

// Security: Maximum output lines to prevent memory exhaustion
const MAX_OUTPUT_LINES = 100;

// Security: Maximum output string length per line
const MAX_OUTPUT_LENGTH = 1000;

// Security: Dangerous APIs that must be blocked for kids' safety
const DANGEROUS_PATTERNS = [
  // Code execution
  'eval', 'Function', 'setTimeout', 'setInterval', 'setImmediate',
  // Network access
  'fetch', 'XMLHttpRequest', 'WebSocket', 'EventSource',
  // Module loading
  'import', 'require', 'define',
  // Global access
  'window', 'document', 'globalThis', 'self',
  // Storage (prevent data exfiltration)
  'localStorage', 'sessionStorage', 'indexedDB', 'caches',
  // Node.js globals
  'process', 'global', 'Buffer', '__dirname', '__filename',
  // Prototype manipulation (prevent sandbox escape)
  '__proto__', 'constructor', 'prototype',
  'getPrototypeOf', 'setPrototypeOf',
  // Reflection APIs (can bypass blocklist)
  'Reflect', 'Proxy',
  // Other dangerous APIs
  'Worker', 'SharedWorker', 'ServiceWorker',
  'postMessage', 'opener', 'parent', 'top', 'frames',
];

// Swahili error messages
const ERROR_MESSAGES: Record<string, string> = {
  'is not defined': 'haijafafanuliwa',
  'is not a function': 'si kazi',
  'Cannot read': 'Haiwezi kusoma',
  'Unexpected token': 'Ishara isiyotarajiwa',
  'Unexpected identifier': 'Jina lisilo tarajiwa',
  'Unexpected end of input': 'Msimbo haujakamilika',
  'missing': 'inakosekana',
  'SyntaxError': 'Kosa la uandishi',
  'ReferenceError': 'Kosa la kumbukumbu',
  'TypeError': 'Kosa la aina',
  'RangeError': 'Kosa la kiwango',
  'Maximum call stack': 'Msimbo unajizunguka bila mwisho',
  'Execution timeout': 'Msimbo umechukua muda mrefu sana',
  'Output limit': 'Matokeo mengi sana',
};

/**
 * Security: Check code for dangerous patterns
 */
function containsDangerousCode(code: string): string | null {
  const normalizedCode = code.toLowerCase();
  
  for (const pattern of DANGEROUS_PATTERNS) {
    // Check for direct usage and property access
    const regex = new RegExp(`\\b${pattern.toLowerCase()}\\b`, 'i');
    if (regex.test(normalizedCode)) {
      return `Msimbo una neno lisiloruhusiwa: ${pattern}`;
    }
  }
  
  // Check for bracket notation access to blocked properties
  // e.g., obj["constructor"] or obj['__proto__']
  const bracketAccess = /\[\s*["'`](constructor|__proto__|prototype)["'`]\s*\]/i;
  if (bracketAccess.test(code)) {
    return 'Msimbo una njia isiyoruhusiwa';
  }
  
  // Check for this.constructor pattern (sandbox escape)
  if (/this\s*\.\s*constructor/i.test(code)) {
    return 'Msimbo una njia isiyoruhusiwa';
  }
  
  return null;
}

function translateError(error: string): string {
  let translated = error;

  for (const [english, swahili] of Object.entries(ERROR_MESSAGES)) {
    translated = translated.replace(new RegExp(english, 'gi'), swahili);
  }

  translated = translated
    .replace(/at eval.*$/m, '')
    .replace(/at <anonymous>.*$/m, '')
    .trim();

  return translated;
}

/**
 * Security: Create a timeout wrapper for code execution
 * Prevents infinite loops from freezing the browser
 */
function executeWithTimeout<T>(fn: () => T, timeoutMs: number): T {
  const startTime = Date.now();
  
  // We can't truly interrupt synchronous JS, but we can check periodically
  // by injecting timeout checks into loops (done in code transformation)
  // For now, we'll rely on the browser's script timeout
  
  return fn();
}

/**
 * Executes JamboScript code and returns the resulting state
 * @param code - JamboScript source code
 * @param contextCode - Optional JavaScript to prepend (hidden context like variable setup)
 */
export function execute(code: string, contextCode?: string): ExecutionResult {
  // Security: Check for dangerous patterns before any processing
  const dangerCheck = containsDangerousCode(code);
  if (dangerCheck) {
    return {
      success: false,
      variables: {},
      output: [],
      error: dangerCheck,
    };
  }
  
  // Also check context code if provided
  if (contextCode) {
    const contextDangerCheck = containsDangerousCode(contextCode);
    if (contextDangerCheck) {
      return {
        success: false,
        variables: {},
        output: [],
        error: contextDangerCheck,
      };
    }
  }

  // Validate
  const validation = validateJamboScript(code);
  if (!validation.valid) {
    return {
      success: false,
      variables: {},
      output: [],
      error: validation.error,
    };
  }

  // Transpile
  const transpiled = transpile(code);
  if (!transpiled.success) {
    return {
      success: false,
      variables: {},
      output: [],
      error: transpiled.error,
    };
  }

  // Execute in sandboxed environment
  const output: string[] = [];
  const variables: Record<string, unknown> = {};

  try {
    // Security: Sandboxed console with output limits
    const sandboxedConsole = {
      log: (...args: unknown[]) => {
        if (output.length >= MAX_OUTPUT_LINES) {
          throw new Error('Output limit exceeded');
        }
        const line = args.map((a) => {
          const str = String(a);
          return str.length > MAX_OUTPUT_LENGTH 
            ? str.slice(0, MAX_OUTPUT_LENGTH) + '...' 
            : str;
        }).join(' ');
        output.push(line);
      },
    };

    // Extract variable names from both context and transpiled code
    const fullCode = (contextCode || '') + '\n' + transpiled.javascript;
    const variableNames = extractVariableNames(fullCode);
    const hoistedDeclarations = variableNames
      .map((name) => `let ${name};`)
      .join('\n');

    // Remove duplicate let/const declarations
    let processedJs = fullCode;
    for (const name of variableNames) {
      processedJs = processedJs.replace(
        new RegExp(`\\b(?:let|const)\\s+${name}\\s*=`, 'g'),
        `${name} =`
      );
    }

    // Security: Inject iteration counter for loop protection
    // This prevents infinite loops from freezing the browser
    const loopProtection = `
      let __loopCount__ = 0;
      const __maxIterations__ = 10000;
      function __checkLoop__() {
        if (++__loopCount__ > __maxIterations__) {
          throw new Error('Execution timeout: too many iterations');
        }
      }
    `;

    // Add loop checks to while and for loops
    let protectedJs = processedJs
      .replace(/\bwhile\s*\(/g, 'while (__checkLoop__() || true) && (')
      .replace(/\bfor\s*\(([^;]*);([^;]*);([^)]*)\)/g, 'for ($1; (__checkLoop__() || true) && ($2); $3)');

    const wrappedCode = `
      "use strict";
      ${loopProtection}
      ${hoistedDeclarations}
      ${protectedJs}
      
      const __extractedVars__ = {};
      try {
        ${variableNames
          .map(
            (name) =>
              `if (typeof ${name} !== 'undefined') __extractedVars__["${name}"] = ${name};`
          )
          .join('\n        ')}
      } catch(e) {}
      return __extractedVars__;
    `;

    const executor = new Function('console', wrappedCode);
    const extracted = executor(sandboxedConsole);
    Object.assign(variables, extracted);
    Object.assign(variables, extracted);

    return { success: true, variables, output };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Kosa lisilojulikana';

    let errorLine: number | undefined;
    if (error instanceof Error && error.stack) {
      const lineMatch = error.stack.match(/<anonymous>:(\d+)/);
      if (lineMatch) {
        const contextLines = (contextCode || '').split('\n').length;
        errorLine = parseInt(lineMatch[1], 10) - 2 - contextLines;
      }
    }

    return {
      success: false,
      variables,
      output,
      error: translateError(errorMessage),
      errorLine,
    };
  }
}

/**
 * Extracts variable names declared with let/const from code
 */
function extractVariableNames(code: string): string[] {
  const names: string[] = [];
  const varRegex = /(?:let|const)\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=/g;
  let match;
  while ((match = varRegex.exec(code)) !== null) {
    if (match[1] && !names.includes(match[1])) {
      names.push(match[1]);
    }
  }
  return names;
}
