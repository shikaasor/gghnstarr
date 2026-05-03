import type { Metadata } from 'next';
import { Montserrat, Inter } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ConferenceBar } from '@/components/layout/ConferenceBar';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-montserrat',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://gghnstarr.vercel.app'),
  title: {
    default: 'GGHN STARR | AMR Policy Intelligence for Africa',
    template: '%s | GGHN STARR',
  },
  description: 'Evidence-backed AMR policy briefs for African health decision-makers.',
  openGraph: {
    siteName: 'GGHN STARR',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${montserrat.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className="bg-slate-50 dark:bg-navy-950 font-sans antialiased flex flex-col min-h-screen">
        <ConferenceBar />
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
      {process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID} />
      )}
    </html>
  );
}
