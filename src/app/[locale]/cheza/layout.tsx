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
          title: 'Playground — Jaribu JamboScript',
          description:
            'Andika na ujaribu code ya JamboScript moja kwa moja kwenye browser yako! Playground ya bure ya kuprogramu kwa Kiswahili.',
        }
      : {
          title: 'Playground — Try JamboScript',
          description:
            'Write and test JamboScript code directly in your browser! A free playground for programming in Swahili.',
        };

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/cheza`,
      languages: {
        sw: `${SITE_URL}/sw/cheza`,
        en: `${SITE_URL}/en/cheza`,
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `${SITE_URL}/${locale}/cheza`,
    },
  };
}

export default function ChezaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
