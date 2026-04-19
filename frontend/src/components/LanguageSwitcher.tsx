'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { useParams } from 'next/navigation';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value;
    // Cambia el idioma manteniendo la ruta exacta en la que estás (incluso en [slug])
    router.replace(
      // @ts-expect-error - next-intl maneja los params dinámicos
      { pathname, params }, 
      { locale: nextLocale }
    );
  };

  return (
    <select 
      value={locale} 
      onChange={handleLanguageChange}
      className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-3 py-2 outline-none cursor-pointer shadow-sm hover:bg-gray-50 transition-colors"
    >
      <option value="es">🇪🇸 Español</option>
      <option value="en">🇺🇸 English</option>
    </select>
  );
}