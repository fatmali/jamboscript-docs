'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

export default function ParentPage() {
  const t = useTranslations('Parents');
  const tc = useTranslations('Common');

  return (
    <div className="min-h-screen bg-bg-deep">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 safe-area-top">
        <Link
          href="/"
          className="text-text-secondary hover:text-secondary transition-colors text-sm font-semibold"
        >
          ← {tc('home')}
        </Link>
        <LanguageSwitcher />
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl sm:text-4xl font-black text-text-primary mb-6">
            {t('title')}
          </h1>

          <div className="space-y-8 text-text-secondary">
            <section>
              <h2 className="text-xl font-bold text-text-primary mb-3 flex items-center gap-2">
                {t('whatIsTitle')}
              </h2>
              <p className="leading-relaxed">
                {t('whatIsText')}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text-primary mb-3 flex items-center gap-2">
                {t('ageTitle')}
              </h2>
              <p className="leading-relaxed">
                {t('ageText')}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text-primary mb-3 flex items-center gap-2">
                {t('learnTitle')}
              </h2>
              <ul className="space-y-2">
                {(['0', '1', '2', '3', '4'] as const).map((idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-secondary mt-0.5">✦</span>
                    <span>{t(`learnItems.${idx}`)}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text-primary mb-3 flex items-center gap-2">
                {t('safetyTitle')}
              </h2>
              <p className="leading-relaxed">
                {t('safetyText')}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text-primary mb-3 flex items-center gap-2">
                {t('contactTitle')}
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

            {/* Privacy Policy Link */}
            <section className="bg-secondary/10 border border-secondary/20 rounded-xl p-6">
              <Link
                href="/mzazi/faragha"
                className="flex items-center gap-3 text-secondary hover:text-secondary/80 transition-colors font-semibold"
              >
                <span className="text-2xl">🔒</span>
                <span>{t('privacyLink')}</span>
                <span className="ml-auto">→</span>
              </Link>
            </section>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center"
          >
            <Link href="/hadithi" className="glow-button inline-block px-8 py-3 text-base">
              {t('ctaButton')}
            </Link>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
