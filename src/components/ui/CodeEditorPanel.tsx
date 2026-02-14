'use client';

import { useRef, useCallback, useState, useEffect, useMemo } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { JAMBOSCRIPT_KEYWORDS } from '@/lib/jamboscript';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import type { editor } from 'monaco-editor';

/** Reactive hook that tracks window width and updates on resize / orientation change */
function useWindowWidth() {
  const [width, setWidth] = useState(1024);

  useEffect(() => {
    const update = () => setWidth(window.innerWidth);
    update(); // sync to actual width on mount
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
  }, []);

  return width;
}

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  onRun: () => void;
  output: string[];
  error?: string;
  isRunning?: boolean;
  solved?: boolean;
}

export default function CodeEditorPanel({
  value,
  onChange,
  onRun,
  output,
  error,
  isRunning = false,
  solved = false,
}: CodeEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [showOutput, setShowOutput] = useState(false);
  const t = useTranslations('Editor');
  const windowWidth = useWindowWidth();

  // Reactive editor options that update on resize / orientation change
  // Note: Keep fontSize >= 16 to prevent iOS Safari auto-zoom on input focus
  const editorOptions = useMemo(() => ({
    fontSize: 16,
    lineHeight: windowWidth < 640 ? 22 : 28,
    lineNumbers: (windowWidth < 480 ? 'off' : 'on') as editor.IStandaloneEditorConstructionOptions['lineNumbers'],
    lineDecorationsWidth: windowWidth < 480 ? 4 : undefined,
    lineNumbersMinChars: windowWidth < 640 ? 2 : 3,
  }), [windowWidth]);

  // Push reactive options to Monaco whenever they change
  useEffect(() => {
    editorRef.current?.updateOptions(editorOptions);
  }, [editorOptions]);

  // Show output panel when there's output or error
  useEffect(() => {
    if (output.length > 0 || error) {
      setShowOutput(true);
    }
  }, [output, error]);

  const handleEditorMount: OnMount = useCallback((editor, monaco) => {
    editorRef.current = editor;

    // Register JamboScript language
    monaco.languages.register({ id: 'jamboscript' });

    // Tokenizer
    monaco.languages.setMonarchTokensProvider('jamboscript', {
      keywords: [
        'acha', 'thabiti', 'kweli', 'sivyo', 'tupu',
        'kama', 'chagua', 'hali', 'kawaida',
        'wakati', 'rudia', 'vunja', 'endelea',
        'kazi', 'rudisha', 'andika',
      ],
      operators: ['ni', 'chini', 'zaidi', 'mpaka', 'angalau', 'na', 'au', 'si'],
      multiword: ['la sivyo'],
      tokenizer: {
        root: [
          // Comments
          [/#.*$/, 'comment'],
          // Strings
          [/"([^"\\]|\\.)*$/, 'string.invalid'],
          [/"/, 'string', '@string_double'],
          [/'([^'\\]|\\.)*$/, 'string.invalid'],
          [/'/, 'string', '@string_single'],
          // Numbers
          [/\d+(\.\d+)?/, 'number'],
          // Multi-word keywords
          [/la\s+sivyo/, 'keyword'],
          // Keywords and operators
          [/[a-zA-Z_]\w*/, {
            cases: {
              '@keywords': 'keyword',
              '@operators': 'operator.word',
              '@default': 'identifier',
            },
          }],
          // Operators
          [/[=!<>]=?/, 'operator'],
          [/[+\-*/%]/, 'operator'],
          // Brackets
          [/[{}()]/, 'delimiter.bracket'],
          [/[;,]/, 'delimiter'],
        ],
        string_double: [
          [/[^\\"]+/, 'string'],
          [/\\./, 'string.escape'],
          [/"/, 'string', '@pop'],
        ],
        string_single: [
          [/[^\\']+/, 'string'],
          [/\\./, 'string.escape'],
          [/'/, 'string', '@pop'],
        ],
      },
    });

    // Custom theme
    monaco.editor.defineTheme('jamboscript-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: 'FACC15', fontStyle: 'bold' },
        { token: 'operator.word', foreground: '14B8A6' },
        { token: 'string', foreground: '34D399' },
        { token: 'number', foreground: '60A5FA' },
        { token: 'comment', foreground: '6B7280', fontStyle: 'italic' },
        { token: 'identifier', foreground: 'E2E8F0' },
        { token: 'operator', foreground: 'C4B5FD' },
        { token: 'delimiter.bracket', foreground: 'A78BFA' },
        { token: 'delimiter', foreground: '8B83B8' },
      ],
      colors: {
        'editor.background': '#0F0D2E',
        'editor.foreground': '#E2E8F0',
        'editor.lineHighlightBackground': '#1E1B4B40',
        'editorCursor.foreground': '#FACC15',
        'editor.selectionBackground': '#FACC1530',
        'editorLineNumber.foreground': '#4C4880',
        'editorLineNumber.activeForeground': '#8B83B8',
        'editorIndentGuide.background': '#2D2A5E40',
        'editorWidget.background': '#1E1B4B',
        'editorSuggestWidget.background': '#1E1B4B',
        'editorSuggestWidget.border': '#3B3875',
        'editorSuggestWidget.selectedBackground': '#3B3875',
      },
    });

    monaco.editor.setTheme('jamboscript-dark');

    // Autocomplete
    monaco.languages.registerCompletionItemProvider('jamboscript', {
      provideCompletionItems: (model: editor.ITextModel, position: { lineNumber: number; column: number }) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };

        const suggestions = JAMBOSCRIPT_KEYWORDS.map((kw) => ({
          label: kw,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: kw,
          range,
          detail: 'JamboScript',
        }));

        // Add common snippets
        suggestions.push(
          {
            label: 'andika("")',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'andika("${1}")',
            range,
            detail: 'Andika kwa skrini',
          } as typeof suggestions[0],
          {
            label: 'kama (...) { }',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'kama (${1}) {\n  ${2}\n}',
            range,
            detail: 'Sharti (if)',
          } as typeof suggestions[0],
          {
            label: 'rudia (...) { }',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'rudia (acha i = 0; i chini ${1:5}; i++) {\n  ${2}\n}',
            range,
            detail: 'Kitanzi (for loop)',
          } as typeof suggestions[0],
          {
            label: 'kazi ... { }',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'kazi ${1:jina}(${2}) {\n  ${3}\n}',
            range,
            detail: 'Kazi (function)',
          } as typeof suggestions[0]
        );

        return { suggestions };
      },
    });

    // Key binding: Ctrl/Cmd + Enter to run
    editor.addAction({
      id: 'run-jamboscript',
      label: 'Run JamboScript',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
      run: () => onRun(),
    });

    // Focus editor
    editor.focus();
  }, [onRun]);

  const insertCode = (template: string) => {
    const editor = editorRef.current;
    if (!editor) return;

    // Use snippet controller for smart cursor placement and tab stops
    const contribution = editor.getContribution('snippetController2');
    if (contribution) {
      // @ts-ignore - snippetController2 is standard but sometimes hidden in types
      contribution.insert(template);
      editor.focus();
    }
  };

  const TOOLBOX_ITEMS = [
    { label: 'acha', code: 'acha ${1:jina} = ${2:0};' },
    { label: 'andika', code: 'andika("${1:ujumbe}");' },
    { label: 'kama', code: 'kama (${1:sharti}) {\n\t$0\n}' },
    { label: 'rudia', code: 'rudia (acha i=0; i chini ${1:5}; i++) {\n\t$0\n}' },
    { label: 'kweli', code: 'kweli' },
    { label: 'sivyo', code: 'sivyo' },
  ];

  return (
    <div className="h-full flex flex-col bg-bg-deep">
      {/* Code Toolbox for Kids */}
      <div className="flex gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-bg-deep border-b border-white/5 overflow-x-auto scrollbar-none">
         {TOOLBOX_ITEMS.map((item) => (
           <button
             key={item.label}
             onClick={() => insertCode(item.code)}
             className="px-2.5 sm:px-3 py-1.5 sm:py-1 rounded-md bg-white/5 hover:bg-white/10 text-[11px] sm:text-xs font-mono text-emerald-400 border border-white/5 transition-colors whitespace-nowrap min-h-[36px] sm:min-h-0"
             title={`Insert ${item.label}`}
           >
             {item.label}
           </button>
         ))}
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          defaultLanguage="jamboscript"
          language="jamboscript"
          value={value}
          onChange={(v) => onChange(v || '')}
          onMount={handleEditorMount}
          theme="jamboscript-dark"
          options={{
            fontSize: editorOptions.fontSize,
            fontFamily: 'var(--font-jetbrains-mono), JetBrains Mono, monospace',
            lineHeight: editorOptions.lineHeight,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            renderLineHighlight: 'line',
            roundedSelection: true,
            padding: { top: 8, bottom: 8 },
            suggest: {
              showKeywords: true,
              showSnippets: true,
            },
            quickSuggestions: true,
            wordWrap: 'on',
            tabSize: 2,
            bracketPairColorization: { enabled: true },
            autoClosingBrackets: 'always',
            autoClosingQuotes: 'always',
            formatOnPaste: true,
            lineNumbers: editorOptions.lineNumbers,
            folding: false,
            glyphMargin: false,
            overviewRulerLanes: 0,
            hideCursorInOverviewRuler: true,
            overviewRulerBorder: false,
            contextmenu: false,
            lineDecorationsWidth: editorOptions.lineDecorationsWidth,
            lineNumbersMinChars: editorOptions.lineNumbersMinChars,
          }}
          loading={
            <div className="h-full flex items-center justify-center bg-bg-deep">
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-text-muted text-sm"
              >
                ⚡ {t('running')}
              </motion.div>
            </div>
          }
        />
      </div>

      {/* Output Panel */}
      {showOutput && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="border-t border-white/5 bg-bg-deep"
        >
          <div className="flex items-center justify-between px-2 sm:px-3 py-1 sm:py-1.5 bg-bg-card/30">
            <span className="text-[10px] sm:text-xs text-text-muted font-mono">
              {error ? t('outputError') : t('output')}
            </span>
            <button
              onClick={() => setShowOutput(false)}
              className="text-text-muted hover:text-text-primary text-[10px] sm:text-xs p-1"
            >
              ✕
            </button>
          </div>
          <div className="px-2 sm:px-3 py-1.5 sm:py-2 max-h-28 sm:max-h-32 overflow-y-auto font-mono text-[11px] sm:text-xs">
            {output.map((line, i) => (
              <div key={i} className="text-accent-light">{line}</div>
            ))}
            {error && (
              <div className="text-error">{error}</div>
            )}
            {!error && output.length === 0 && (
              <div className="text-text-muted italic">{t('noOutput')}</div>
            )}
          </div>
        </motion.div>
      )}

      {/* Run Button — always at the bottom */}
      <div className="flex items-center justify-center px-3 py-2 bg-bg-card/50 border-t border-white/5">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onRun}
          disabled={isRunning || solved}
          className={`w-full max-w-xs px-4 py-2.5 rounded-full text-sm font-bold flex items-center justify-center gap-2 transition-all min-h-[44px] ${
            solved
              ? 'bg-success/20 text-success cursor-default'
              : isRunning
              ? 'bg-secondary/20 text-secondary cursor-wait'
              : 'bg-secondary text-primary hover:bg-secondary-dark shadow-md shadow-secondary/20'
          }`}
        >
          {solved ? (
            <>{t('success')}</>
          ) : isRunning ? (
            <>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                ⚡
              </motion.span>
              {t('running')}
            </>
          ) : (
            <>{t('run')}</>
          )}
        </motion.button>
      </div>
    </div>
  );
}
