import type { Metadata, Viewport } from 'next';
import { Nunito, JetBrains_Mono } from 'next/font/google';
import './globals.css';

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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://jamboscript.org'),
  title: {
    default: 'JamboScript — Learn to Code in Swahili',
    template: '%s | JamboScript',
  },
  description:
    'Learn to code through an exciting adventure — in Swahili! A fun, story-driven coding game that teaches kids aged 8–14 programming through stories and challenges.',
  keywords: [
    'JamboScript',
    'Swahili',
    'programming',
    'kids',
    'coding',
    'game',
    'learn to code',
    'Kiswahili',
    'coding for kids',
    'programming language',
    'educational game',
    'learn programming',
    'Swahili programming',
    'African coding',
    'watoto',
    'kuprogramu',
    'lugha ya programu',
  ],
  authors: [{ name: 'JamboScript' }],
  creator: 'JamboScript',
  publisher: 'JamboScript',
  category: 'education',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
    ],
    apple: '/apple-touch-icon.svg',
  },
  openGraph: {
    title: 'JamboScript — Learn to Code in Swahili',
    description:
      'A fun, story-driven coding adventure for kids — in Swahili! 🌍 Learn programming through stories and challenges.',
    type: 'website',
    siteName: 'JamboScript',
    url: 'https://jamboscript.org',
    locale: 'sw_TZ',
    alternateLocale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JamboScript — Learn to Code in Swahili',
    description:
      'A fun, story-driven coding adventure for kids — in Swahili! 🌍',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://jamboscript.org',
    languages: {
      sw: 'https://jamboscript.org/sw',
      en: 'https://jamboscript.org/en',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sw" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
        {/* WebView optimizations */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="format-detection" content="telephone=no" />
        {/* Disable iOS text size adjustment */}
        <meta name="apple-mobile-web-app-title" content="JamboScript" />
        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#0F0D2E" />
        <meta name="msapplication-navbutton-color" content="#0F0D2E" />
      </head>
      <body
        className={`${nunito.variable} ${jetbrainsMono.variable} antialiased`}
        style={{ fontFamily: 'var(--font-nunito), system-ui, sans-serif' }}
      >
        {children}
      </body>
    </html>
  );
}
