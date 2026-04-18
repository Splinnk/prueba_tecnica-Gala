import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Toaster } from 'sonner';
import '../globals.css';

export const metadata = {
  title: 'Blog Manager',
  description: 'Technical Test Fullstack',
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // In Next.js 15, params is a Promise and must be awaited
  const resolvedParams = await params;
  const { locale } = resolvedParams;

  // Validate that the incoming locale is supported
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Fetch the dictionary for the active locale
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="bg-gray-50 text-gray-900 min-h-screen">
        <NextIntlClientProvider messages={messages}>
          {children}
          {/* Global Toaster for UX notifications */}
          <Toaster richColors position="top-right" />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}