import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Toaster } from 'sonner';
import '../globals.css';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Link } from '@/i18n/routing';

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
  const resolvedParams = await params;
  const { locale } = resolvedParams;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="bg-[#f8fafc] text-gray-900 min-h-screen flex flex-col">
        <NextIntlClientProvider messages={messages}>
          
          {/* BARRA DE NAVEGACIÓN GLOBAL */}
          <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-40">
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
              <Link 
                href="/" 
                className="font-extrabold text-xl text-blue-600 tracking-tight hover:opacity-80 transition-opacity"
              >
                BlogManager<span className="text-gray-900">.</span>
              </Link>
              <LanguageSwitcher />
            </div>
          </nav>

          {/* CONTENIDO DINÁMICO DE LAS PÁGINAS */}
          <div className="flex-grow">
            {children}
          </div>

          <Toaster richColors position="top-right" />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}