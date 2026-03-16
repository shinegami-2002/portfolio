import type { Metadata } from 'next';
import { Space_Grotesk, DM_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['300', '400', '500', '700'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  title: 'Shanmukha Chatadi | Applied AI/ML Engineer',
  description:
    'Applied AI/ML Engineer building agentic AI systems, production LLM pipelines, and scalable cloud deployments. MS CS @ NC State. Published researcher.',
  openGraph: {
    title: 'Shanmukha Chatadi | AI/ML Engineer Portfolio',
    description:
      'Architected enterprise RAG platform serving 230+ users. Multi-agent LangGraph research assistant. Published in Springer & IEEE.',
    type: 'website',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-deep focus:text-cyan-accent focus:ring-2 focus:ring-cyan-accent focus:rounded"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
