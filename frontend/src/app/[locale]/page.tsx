'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { toast } from 'sonner';

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
}

export default function HomePage() {
  const t = useTranslations('Navigation');
  const tPost = useTranslations('Post');
  const tToasts = useTranslations('Toasts');
  
  // Extraemos el locale activo ('es' o 'en') para formatear la fecha
  const locale = useLocale(); 
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/posts`);
        setPosts(response.data);
      } catch (err) {
        setError(tToasts('errorFetch'));
        toast.error(tToasts('errorFetch'));
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, [tToasts]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 text-red-500 font-semibold">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* 1. Cabecera (Hero Section) con degradado sutil */}
      <div className="bg-gradient-to-b from-white to-[#f8fafc] border-b border-gray-100">
        <header className="max-w-6xl mx-auto px-6 py-12 md:py-16 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-2">
              {t('home')}
            </h1>
            <p className="text-gray-500 text-lg">
              {t('textHome')}
            </p>
          </div>
          <Link 
            href="/create" 
            className="group relative inline-flex items-center justify-center px-8 py-3.5 text-base font-bold text-white transition-all duration-200 bg-blue-600 border border-transparent rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
          >
            <span className="mr-2">+</span> {t('create')}
          </Link>
        </header>
      </div>

      {/* 2. Contenedor Principal */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {posts.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl shadow-sm border border-gray-100 border-dashed">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l1 1h4a2 2 0 012 2v10a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <p className="text-gray-500 text-lg font-medium">{tPost('empty')}</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => {
              // Formateo de fecha dinámico según el idioma actual (es-ES o en-US)
              const dateObj = new Date(post.createdAt);
              const formattedDate = dateObj.toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' });

              return (
                <article key={post.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col">
                  
                  {/* Zona de la Imagen (Con Fallback) */}
                  <Link href={`/posts/${post.slug}`} className="relative h-52 w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                    {post.imageUrl ? (
                      <img 
                        src={post.imageUrl} 
                        alt={post.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          // Si la imagen se rompe (URL inválida), la ocultamos y mostramos el fondo por defecto
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      // Ícono por defecto si no hay imagen
                      <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                    )}
                  </Link>

                  {/* Contenido de la Tarjeta */}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-50 rounded-full">
                        Blog
                      </span>
                      <span className="text-xs font-medium text-gray-400 capitalize">
                        {formattedDate}
                      </span>
                    </div>
                    
                    <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h2>
                    
                    <p className="text-gray-600 mb-6 line-clamp-3 text-sm flex-grow">
                      {post.content}
                    </p>
                    
                    <Link 
                      href={`/posts/${post.slug}`} 
                      className="inline-flex items-center font-semibold text-blue-600 hover:text-blue-700 mt-auto"
                    >
                      {tPost('readMore')}
                      <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </Link>
                  </div>

                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}