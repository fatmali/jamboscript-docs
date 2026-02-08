/**
 * JamboScript Runtime Executor — Improved
 * Safely executes transpiled JavaScript and captures state
 */

import { transpile, validateJamboScript } from './transpiler';

export interface ExecutionResult {
  success: boolean;
  variables: Record<string, unknown>;
  output: string[];
  error?: string;
  errorLine?: number;
}

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
};

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
 * Executes JamboScript code and returns the resulting state
 * @param code - JamboScript source code
 * @param contextCode - Optional JavaScript to prepend (hidden context like variable setup)
 */
export function execute(code: string, contextCode?: string): ExecutionResult {
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
    const sandboxedConsole = {
      log: (...args: unknown[]) => {
        output.push(args.map((a) => String(a)).join(' '));
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

    const wrappedCode = `
      "use strict";
      ${hoistedDeclarations}
      ${processedJs}
      
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
