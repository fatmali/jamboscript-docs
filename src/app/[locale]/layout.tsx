import { Nunito, JetBrains_Mono } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import '../globals.css';

const nunito = Nunito({
  variable: '--font-nunito',
  subsets: ['latin'],
  weight: ['400', '600', '700', '800', '900'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
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

  return (
    <html lang={locale} className="dark">
      <body
        className={`${nunito.variable} ${jetbrainsMono.variable} antialiased`}
        style={{ fontFamily: 'var(--font-nunito), system-ui, sans-serif' }}
      >
        <NextIntlClientProvider messages={messages}>
          {children}
          <footer className="w-full py-3 text-center text-xs text-white/40">
            Made with ❤️ by Fatma &amp; Claude Code
          </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
