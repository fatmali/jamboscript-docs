'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { motion } from 'framer-motion';

const localeLabels: Record<string, string> = {
  sw: '🇰🇪 KI',
  en: '🇬🇧 EN',
};

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('LanguageSwitcher');

  const handleSwitch = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale as 'sw' | 'en' });
  };

  return (
    <div className="flex items-center gap-1">
      {routing.locales.map((loc) => (
        <motion.button
          key={loc}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleSwitch(loc)}
          className={`px-2 py-1 rounded-md text-xs font-bold transition-all ${
            locale === loc
              ? 'bg-secondary/20 text-secondary'
              : 'text-text-muted hover:text-text-secondary hover:bg-bg-surface/50'
          }`}
          aria-label={`${t('label')}: ${localeLabels[loc]}`}
        >
          {localeLabels[loc]}
        </motion.button>
      ))}
    </div>
  );
}
