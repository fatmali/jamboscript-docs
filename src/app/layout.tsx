import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JamboScript — Safari ya Msimbo',
  description:
    'Jifunze kupanga kwa JamboScript kupitia hadithi ya kushangaza! Mchezo wa kusimba kwa watoto.',
  keywords: ['JamboScript', 'Swahili', 'programming', 'kids', 'coding', 'game'],
  authors: [{ name: 'JamboScript' }],
  openGraph: {
    title: 'JamboScript — Safari ya Msimbo',
    description: 'Mchezo wa kujifunza kupanga kwa Kiswahili',
    type: 'website',
  },
};

// Since all pages are now under [locale], this root layout
// simply passes through children. The locale-specific layout handles fonts, etc.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
