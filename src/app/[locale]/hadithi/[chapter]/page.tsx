import { chapters } from '@/data/chapters';
import ChapterPageClient from '@/components/ChapterPageClient';

export function generateStaticParams() {
  return chapters.map((ch) => ({ chapter: ch.slug }));
}

export default function ChapterPage() {
  return <ChapterPageClient />;
}
