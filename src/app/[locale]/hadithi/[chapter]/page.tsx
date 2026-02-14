import type { Metadata } from 'next';
import { chapters } from '@/data/chapters';
import ChapterPageClient from '@/components/ChapterPageClient';

const SITE_URL = 'https://jamboscript.org';

const chapterMetaSw: Record<string, { title: string; description: string }> = {
  'sura-1': {
    title: 'Sura 1 — Amri za Kwanza',
    description: 'Jifunze kuandika amri za kwanza kwa JamboScript! Fungua lango la kijiji kwa kusema maneno ya uchawi.',
  },
  'sura-2': {
    title: 'Sura 2 — Kukumbuka Vitu',
    description: 'Jifunze kutumia variables kwa JamboScript! Mwambie mzee jina lako kwa kutumia "acha".',
  },
  'sura-3': {
    title: 'Sura 3 — Kuchagua Njia',
    description: 'Jifunze masharti kwa JamboScript! Chagua njia sahihi kwa kutumia "kama".',
  },
  'sura-4': {
    title: 'Sura 4 — Kurudia Vitu',
    description: 'Jifunze loops kwa JamboScript! Vuka daraja kwa kurudia hatua kwa kutumia "rudia".',
  },
  'sura-5': {
    title: 'Sura 5 — Kutengeneza Recipe',
    description: 'Jifunze functions kwa JamboScript! Tengeneza spell ya uponyaji kwa kutumia "kazi".',
  },
  'sura-6': {
    title: 'Sura 6 — Sherehe Kubwa',
    description: 'Tumia kila kitu ulichojifunza kwa JamboScript! Andaa sherehe kuu kwa kutumia coding skills zako zote.',
  },
};

const chapterMetaEn: Record<string, { title: string; description: string }> = {
  'sura-1': {
    title: 'Chapter 1 — First Commands',
    description: 'Learn to write your first JamboScript commands! Open the village gate by saying magic words.',
  },
  'sura-2': {
    title: 'Chapter 2 — Remember Things',
    description: 'Learn to use variables in JamboScript! Tell the old man your name using "acha".',
  },
  'sura-3': {
    title: 'Chapter 3 — Make Choices',
    description: 'Learn conditionals in JamboScript! Pick the right path using "kama".',
  },
  'sura-4': {
    title: 'Chapter 4 — Repeat Things',
    description: 'Learn loops in JamboScript! Cross the bridge by repeating steps with "rudia".',
  },
  'sura-5': {
    title: 'Chapter 5 — Make Recipes',
    description: 'Learn functions in JamboScript! Create a healing spell using "kazi".',
  },
  'sura-6': {
    title: 'Chapter 6 — Grand Finale',
    description: 'Use everything you learned in JamboScript! Throw a grand party using all your coding skills.',
  },
};

export function generateStaticParams() {
  return chapters.map((ch) => ({ chapter: ch.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; chapter: string }>;
}): Promise<Metadata> {
  const { locale, chapter } = await params;
  const metaMap = locale === 'sw' ? chapterMetaSw : chapterMetaEn;
  const meta = metaMap[chapter] ?? {
    title: `Chapter — ${chapter}`,
    description: 'A JamboScript coding adventure chapter.',
  };

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/hadithi/${chapter}`,
      languages: {
        sw: `${SITE_URL}/sw/hadithi/${chapter}`,
        en: `${SITE_URL}/en/hadithi/${chapter}`,
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `${SITE_URL}/${locale}/hadithi/${chapter}`,
    },
  };
}

export default function ChapterPage() {
  return <ChapterPageClient />;
}
