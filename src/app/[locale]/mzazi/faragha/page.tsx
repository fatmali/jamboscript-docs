'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

export default function PrivacyPage() {
  const t = useTranslations('Privacy');
  const tc = useTranslations('Common');

  return (
    <div className="min-h-screen bg-bg-deep">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 safe-area-top">
        <Link
          href="/mzazi"
          className="text-text-secondary hover:text-secondary transition-colors text-sm font-semibold"
        >
          ← {tc('back')}
        </Link>
        <LanguageSwitcher />
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl sm:text-4xl font-black text-text-primary mb-2">
            {t('title')}
          </h1>
          
          <p className="text-text-secondary text-sm mb-8">
            {t('lastUpdated')}
          </p>

          <div className="space-y-8 text-text-secondary">
            {/* Summary Box */}
            <div className="bg-secondary/10 border border-secondary/20 rounded-xl p-6">
              <h2 className="text-lg font-bold text-secondary mb-3 flex items-center gap-2">
                ✨ {t('summaryTitle')}
              </h2>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span>{t('summaryItems.0')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span>{t('summaryItems.1')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span>{t('summaryItems.2')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span>{t('summaryItems.3')}</span>
                </li>
              </ul>
            </div>

            {/* What We Collect */}
            <section>
              <h2 className="text-xl font-bold text-text-primary mb-3 flex items-center gap-2">
                📦 {t('collectTitle')}
              </h2>
              <p className="leading-relaxed mb-4">
                {t('collectIntro')}
              </p>
              <div className="bg-bg-medium rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-accent">🏷️</span>
                  <div>
                    <span className="font-semibold text-text-primary">{t('dataItems.name.label')}</span>
                    <p className="text-sm">{t('dataItems.name.description')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-accent">⭐</span>
                  <div>
                    <span className="font-semibold text-text-primary">{t('dataItems.progress.label')}</span>
                    <p className="text-sm">{t('dataItems.progress.description')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-accent">💻</span>
                  <div>
                    <span className="font-semibold text-text-primary">{t('dataItems.code.label')}</span>
                    <p className="text-sm">{t('dataItems.code.description')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-accent">🔊</span>
                  <div>
                    <span className="font-semibold text-text-primary">{t('dataItems.settings.label')}</span>
                    <p className="text-sm">{t('dataItems.settings.description')}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* How Data is Stored */}
            <section>
              <h2 className="text-xl font-bold text-text-primary mb-3 flex items-center gap-2">
                💾 {t('storageTitle')}
              </h2>
              <p className="leading-relaxed">
                {t('storageText')}
              </p>
            </section>

            {/* Text-to-Speech */}
            <section>
              <h2 className="text-xl font-bold text-text-primary mb-3 flex items-center gap-2">
                🗣️ {t('ttsTitle')}
              </h2>
              <p className="leading-relaxed">
                {t('ttsText')}
              </p>
            </section>

            {/* What We DON'T Do */}
            <section>
              <h2 className="text-xl font-bold text-text-primary mb-3 flex items-center gap-2">
                🚫 {t('dontTitle')}
              </h2>
              <ul className="space-y-2">
                {(['0', '1', '2', '3', '4', '5'] as const).map((idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-red-400 mt-0.5">✗</span>
                    <span>{t(`dontItems.${idx}`)}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-xl font-bold text-text-primary mb-3 flex items-center gap-2">
                👶 {t('childrenTitle')}
              </h2>
              <p className="leading-relaxed">
                {t('childrenText')}
              </p>
            </section>

            {/* Delete Data */}
            <section>
              <h2 className="text-xl font-bold text-text-primary mb-3 flex items-center gap-2">
                🗑️ {t('deleteTitle')}
              </h2>
              <p className="leading-relaxed mb-4">
                {t('deleteText')}
              </p>
              <div className="bg-bg-medium rounded-lg p-4 font-mono text-sm text-accent">
                localStorage.removeItem(&apos;jamboscript-store&apos;)
              </div>
            </section>

            {/* Disclaimer */}
            <section className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6">
              <h2 className="text-xl font-bold text-text-primary mb-3 flex items-center gap-2">
                ⚠️ {t('disclaimerTitle')}
              </h2>
              <p className="leading-relaxed text-sm">
                {t('disclaimerText')}
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-xl font-bold text-text-primary mb-3 flex items-center gap-2">
                💬 {t('contactTitle')}
              </h2>
              <p className="leading-relaxed">
                {t('contactText')}{' '}
                <a
                  href="https://jamboscript.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  jamboscript.org
                </a>
              </p>
            </section>
          </div>

          {/* Back to Parents */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center"
          >
            <Link href="/mzazi" className="glow-button inline-block px-8 py-3 text-base">
              ← {t('backButton')}
            </Link>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
