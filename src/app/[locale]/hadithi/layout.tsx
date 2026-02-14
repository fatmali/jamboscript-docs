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
          title: 'Hadithi — Safari ya Kuprogramu',
          description:
            'Chagua sura na uanze adventure yako ya kuprogramu kwa JamboScript! Sura 6 za hadithi zenye changamoto za coding.',
        }
      : {
          title: 'Story Map — Coding Adventure',
          description:
            'Choose a chapter and begin your JamboScript coding adventure! 6 story-driven chapters with coding challenges.',
        };

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/hadithi`,
      languages: {
        sw: `${SITE_URL}/sw/hadithi`,
        en: `${SITE_URL}/en/hadithi`,
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `${SITE_URL}/${locale}/hadithi`,
    },
  };
}

export default function HadithiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
