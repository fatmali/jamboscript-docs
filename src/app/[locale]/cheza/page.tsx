'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { execute } from '@/lib/jamboscript';
import { playSound, initAudio } from '@/lib/sound';
import { useGameStore } from '@/lib/store';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import dynamic from 'next/dynamic';

const CodeEditorPanel = dynamic(() => import('@/components/ui/CodeEditorPanel'), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center bg-bg-deep">
      <div className="text-text-muted text-sm animate-pulse">⚡ Loading editor...</div>
    </div>
  ),
});

const EXAMPLES = [
  {
    title: '👋 Salamu',
    code: '# Sema salamu!\n\nandika("Habari Dunia!")\nandika("Karibu JamboScript!")\n',
  },
  {
    title: '🔢 Hesabu',
    code: '# Fanya hesabu\n\nacha a = 10\nacha b = 5\n\nandika(a + b)\nandika(a * b)\nandika(a - b)\n',
  },
  {
    title: '🔀 Masharti',
    code: '# Masharti\n\nacha umri = 12\n\nkama (umri angalau 10) {\n  andika("Uko mkubwa!")\n} la sivyo {\n  andika("Uko mdogo")\n}\n',
  },
  {
    title: '🔄 Kitanzi',
    code: '# Hesabu hadi 5\n\nrudia (acha i = 1; i mpaka 5; i++) {\n  andika("Hatua " + i)\n}\n\nandika("Nimefika!")\n',
  },
  {
    title: '⚡ Kazi',
    code: '# Unda kazi\n\nkazi salamu(jina) {\n  rudisha "Habari " + jina + "!"\n}\n\nacha ujumbe = salamu("Amani")\nandika(ujumbe)\n',
  },
];

export default function PlaygroundPage() {
  const { soundEnabled } = useGameStore();
  const [code, setCode] = useState(EXAMPLES[0].code);
  const [output, setOutput] = useState<string[]>([]);
  const [error, setError] = useState<string | undefined>();
  const [isRunning, setIsRunning] = useState(false);
  const [audioInit, setAudioInit] = useState(false);
  const t = useTranslations('Playground');
  const tc = useTranslations('Common');

  const handleRun = useCallback(() => {
    if (isRunning) return;

    if (!audioInit) {
      initAudio();
      setAudioInit(true);
    }

    setIsRunning(true);
    setOutput([]);
    setError(undefined);

    if (soundEnabled) playSound('run');

    setTimeout(() => {
      const result = execute(code);
      setOutput(result.output);
      if (!result.success) {
        setError(result.error);
        if (soundEnabled) playSound('error');
      } else if (result.output.length > 0) {
        if (soundEnabled) playSound('success');
      }
      setIsRunning(false);
    }, 300);
  }, [code, isRunning, soundEnabled, audioInit]);

  return (
    <div className="h-screen flex flex-col bg-bg-deep">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-bg-card/60 backdrop-blur-md border-b border-white/5">
        <Link
          href="/"
          className="text-text-secondary hover:text-secondary transition-colors text-sm font-semibold flex items-center gap-2"
        >
          ← {tc('home')}
        </Link>
        <h1 className="text-base font-bold text-text-primary">{t('title')}</h1>
        <LanguageSwitcher />
      </header>

      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
        {/* Left: Examples sidebar */}
        <motion.aside
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="lg:w-56 xl:w-64 bg-bg-card/30 border-b lg:border-b-0 lg:border-r border-white/5 overflow-y-auto"
        >
          <div className="p-3">
            <h2 className="text-xs text-text-muted font-bold uppercase tracking-wider mb-3">
              {t('examples')}
            </h2>
            <div className="space-y-1.5">
              {EXAMPLES.map((example, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCode(example.code);
                    setOutput([]);
                    setError(undefined);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-bg-surface/50 transition-all"
                >
                  {example.title}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 border-t border-white/5">
            <h2 className="text-xs text-text-muted font-bold uppercase tracking-wider mb-2">
              {t('keywords')}
            </h2>
            <div className="grid grid-cols-2 gap-1 text-xs">
              {[
                ['andika', 'print'],
                ['acha', 'let'],
                ['kama', 'if'],
                ['la sivyo', 'else'],
                ['rudia', 'for'],
                ['kazi', 'function'],
                ['rudisha', 'return'],
                ['kweli', 'true'],
              ].map(([sw, en]) => (
                <div key={sw} className="px-2 py-1 rounded bg-bg-surface/30 text-text-muted">
                  <span className="text-secondary font-mono">{sw}</span>
                  <span className="text-text-muted/50 ml-1">({en})</span>
                </div>
              ))}
            </div>
          </div>
        </motion.aside>

        {/* Right: Editor */}
        <div className="flex-1 min-h-0">
          <CodeEditorPanel
            value={code}
            onChange={setCode}
            onRun={handleRun}
            output={output}
            error={error}
            isRunning={isRunning}
          />
        </div>
      </div>
    </div>
  );
}
