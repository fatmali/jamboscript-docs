'use client';

import React, { useRef, KeyboardEvent, useCallback } from 'react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  onRun: () => void;
  disabled?: boolean;
  placeholder?: string;
}

// JamboScript keywords for highlighting only
const KEYWORDS = [
  'acha', 'thabiti', 'kweli', 'sivyo', 'tupu', 'kama', 'la sivyo',
  'chagua', 'hali', 'kawaida', 'wakati', 'rudia', 'vunja', 'endelea',
  'kazi', 'rudisha', 'andika', 'ni', 'chini', 'zaidi', 'mpaka', 'angalau', 'na', 'au', 'si'
];

export default function CodeEditor({
  value,
  onChange,
  onRun,
  disabled = false,
  placeholder = '# Andika code yako hapa...',
}: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Run code with Cmd/Ctrl + Enter
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      onRun();
      return;
    }
    
    // Tab for indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;
      
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newValue);
      
      // Set cursor position after the inserted spaces
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = start + 2;
          textareaRef.current.selectionEnd = start + 2;
        }
      });
    }
  }, [onRun, value, onChange]);

  // Simple handler - just update the value
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  // Syntax highlighting for display
  const highlightCode = useCallback((code: string): React.ReactNode[] => {
    if (!code) return [];
    
    const lines = code.split('\n');
    return lines.map((line, lineIndex) => {
      // Build highlighted line
      const parts: React.ReactNode[] = [];
      let remaining = line;
      let partIndex = 0;
      
      while (remaining.length > 0) {
        let matched = false;
        
        // Check for comments first
        const commentMatch = remaining.match(/^(#.*)$/);
        if (commentMatch) {
          parts.push(
            <span key={`${lineIndex}-${partIndex++}`} className="text-stone-500">
              {commentMatch[1]}
            </span>
          );
          remaining = '';
          matched = true;
          continue;
        }
        
        // Check for strings
        const stringMatch = remaining.match(/^("[^"]*")/);
        if (stringMatch) {
          parts.push(
            <span key={`${lineIndex}-${partIndex++}`} className="text-emerald-400">
              {stringMatch[1]}
            </span>
          );
          remaining = remaining.substring(stringMatch[1].length);
          matched = true;
          continue;
        }
        
        // Check for keywords (with word boundary)
        for (const keyword of KEYWORDS) {
          const keywordRegex = new RegExp(`^(${keyword.replace(/ /g, '\\s+')})(?=[\\s(){}\\[\\]=+\\-*/<>!,;:]|$)`);
          const keywordMatch = remaining.match(keywordRegex);
          if (keywordMatch) {
            parts.push(
              <span key={`${lineIndex}-${partIndex++}`} className="text-amber-400">
                {keywordMatch[1]}
              </span>
            );
            remaining = remaining.substring(keywordMatch[1].length);
            matched = true;
            break;
          }
        }
        
        if (matched) continue;
        
        // Check for numbers
        const numberMatch = remaining.match(/^(\d+)/);
        if (numberMatch) {
          parts.push(
            <span key={`${lineIndex}-${partIndex++}`} className="text-sky-400">
              {numberMatch[1]}
            </span>
          );
          remaining = remaining.substring(numberMatch[1].length);
          continue;
        }
        
        // Check for operators
        const operatorMatch = remaining.match(/^([=+\-*/<>!]+)/);
        if (operatorMatch) {
          parts.push(
            <span key={`${lineIndex}-${partIndex++}`} className="text-stone-400">
              {operatorMatch[1]}
            </span>
          );
          remaining = remaining.substring(operatorMatch[1].length);
          continue;
        }
        
        // Take one character at a time for anything else
        parts.push(
          <span key={`${lineIndex}-${partIndex++}`} className="text-stone-300">
            {remaining[0]}
          </span>
        );
        remaining = remaining.substring(1);
      }
      
      return (
        <div key={lineIndex} className="leading-6 min-h-[24px]">
          {parts.length > 0 ? parts : '\u00A0'}
        </div>
      );
    });
  }, []);

  return (
    <div className="relative font-mono text-sm">
      {/* Syntax highlighted display layer */}
      <div
        className="absolute inset-0 p-4 pointer-events-none overflow-hidden whitespace-pre-wrap break-words"
        aria-hidden="true"
      >
        {value ? highlightCode(value) : (
          <span className="text-stone-500">{placeholder}</span>
        )}
      </div>
      
      {/* Editable textarea - transparent text, visible caret */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        data-gramm="false"
        data-gramm_editor="false"
        data-enable-grammarly="false"
        className={`
          w-full h-48 p-4 bg-transparent text-transparent caret-amber-400
          resize-none outline-none
          selection:bg-amber-500/30
          ${disabled ? 'cursor-not-allowed opacity-50' : ''}
        `}
        style={{ 
          caretColor: '#fbbf24',
          WebkitTextFillColor: 'transparent',
        }}
      />
    </div>
  );
}
