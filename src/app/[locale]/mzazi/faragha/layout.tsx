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
          title: 'Sera ya Faragha',
          description:
            'Sera ya faragha ya JamboScript — jinsi tunavyolinda data ya watoto wako. Hakuna data inayotumwa kwa seva, hakuna tracking, hakuna ads.',
        }
      : {
          title: 'Privacy Policy',
          description:
            'JamboScript privacy policy — how we protect your child\'s data. No data sent to servers, no tracking, no ads.',
        };

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/mzazi/faragha`,
      languages: {
        en: `${SITE_URL}/en/mzazi/faragha`,
        sw: `${SITE_URL}/sw/mzazi/faragha`,
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `${SITE_URL}/${locale}/mzazi/faragha`,
      siteName: 'JamboScript',
      locale: locale === 'sw' ? 'sw_KE' : 'en_US',
      type: 'website',
    },
  };
}

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
