import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'JamboScript — Jifunze Kuprogramu kwa Kiswahili',
  description:
    'Jifunze kuprogramu kupitia adventure ya kusisimua kwa Kiswahili! Mchezo wa coding unaofundisha watoto wa miaka 8–14 kuprogramu kwa hadithi na changamoto.',
  alternates: {
    canonical: 'https://jamboscript.org/sw',
  },
};

export default function RootPage() {
  redirect('/sw');
}
