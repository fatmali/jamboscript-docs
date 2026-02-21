import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

const SITE_URL = 'https://jamboscript.org';

const localeMetadata: Record<string, { title: string; description: string }> = {
  sw: {
    title: 'JamboScript — Jifunze Kuprogramu kwa Kiswahili',
    description:
      'Jifunze kuprogramu kupitia adventure ya kusisimua kwa Kiswahili! Mchezo wa coding unaofundisha watoto wa miaka 8–14 kuprogramu kwa hadithi na changamoto.',
  },
  en: {
    title: 'JamboScript — Learn to Code in Swahili',
    description:
      'Learn to code through an exciting adventure — in Swahili! A fun, story-driven coding game that teaches kids aged 8–14 programming through stories and challenges.',
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const meta = localeMetadata[locale] ?? localeMetadata.sw;

  const alternates: Record<string, string> = {};
  for (const loc of routing.locales) {
    alternates[loc] = `${SITE_URL}/${loc}`;
  }

  return {
    title: {
      default: meta.title,
      template: `%s | JamboScript`,
    },
    description: meta.description,
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: alternates,
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `${SITE_URL}/${locale}`,
      siteName: 'JamboScript',
      locale: locale === 'sw' ? 'sw_TZ' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate locale
  if (!routing.locales.includes(locale as 'sw' | 'en')) {
    notFound();
  }

  setRequestLocale(locale);

  // Provide all messages to the client side
  const messages = await getMessages();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'JamboScript',
    url: `${SITE_URL}/${locale}`,
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web Browser',
    inLanguage: locale === 'sw' ? 'sw' : 'en',
    audience: {
      '@type': 'EducationalAudience',
      educationalRole: 'student',
      suggestedMinAge: 8,
      suggestedMaxAge: 14,
    },
    description:
      locale === 'sw'
        ? 'Jifunze kuprogramu kupitia adventure ya kusisimua kwa Kiswahili!'
        : 'Learn to code through an exciting adventure — in Swahili!',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    creator: {
      '@type': 'Organization',
      name: 'JamboScript',
      url: SITE_URL,
    },
  };

  return (
    <NextIntlClientProvider messages={messages}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
      <footer className="w-full py-3 text-center text-xs text-white/40">
        Open Source Made with ❤️ by Fatma &amp; Github Copilot.
      </footer>
    </NextIntlClientProvider>
  );
}
