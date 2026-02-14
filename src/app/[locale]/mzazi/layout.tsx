import type { Metadata } from 'next';

const SITE_URL = 'https://jamboscript.org';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const meta =
    locale === 'sw'
      ? {
          title: 'Kwa Wazazi na Walimu',
          description:
            'Maelezo kwa wazazi na walimu kuhusu JamboScript — lugha ya programu kwa Kiswahili kwa watoto wa miaka 8–14. Salama, bila malipo, na ya kufurahisha.',
        }
      : {
          title: 'For Parents & Teachers',
          description:
            'Information for parents and teachers about JamboScript — a Swahili programming language for kids aged 8–14. Safe, free, and fun.',
        };

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/mzazi`,
      languages: {
        sw: `${SITE_URL}/sw/mzazi`,
        en: `${SITE_URL}/en/mzazi`,
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `${SITE_URL}/${locale}/mzazi`,
    },
  };
}

export default function MzaziLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
