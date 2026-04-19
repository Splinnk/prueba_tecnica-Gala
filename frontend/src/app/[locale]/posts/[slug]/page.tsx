'use client';
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { useRouter, Link } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import { toast } from 'sonner';

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  version: number;
}

export default function PostDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();
  const locale = useLocale(); // Extraemos el idioma activo para la fecha
  
  const tNav = useTranslations('Navigation');
  const tPost = useTranslations('Post');
  const tToasts = useTranslations('Toasts');

  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/posts/${slug}`);
        setPost(response.data);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setError(tToasts('errorNotFound'));
        } else {
          setError(tToasts('errorFetch'));
        }
      } finally {
        setIsLoading(false);
      }
    };
    if (slug) fetchPost();
  }, [slug, tToasts]);

  const executeDelete = async () => {
    if (!post) return;
    setIsDeleting(true);

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/posts/${post.id}`);
      toast.success(tToasts('deleteSuccess'));
      setShowDeleteModal(false);
      router.push('/'); 
      router.refresh();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        toast.error(tToasts('errorNotFound'));
        router.push('/');
      } else {
        toast.error(tToasts('errorDelete'));
      }
      setShowDeleteModal(false);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-3xl mx-auto p-6 mt-20 text-center bg-white rounded-3xl shadow-sm border border-gray-100 py-12">
        <h1 className="text-2xl font-bold text-red-600 mb-6">{error}</h1>
        <Link href="/" className="px-6 py-2.5 bg-blue-50 text-blue-600 rounded-xl font-medium hover:bg-blue-100 transition-colors">
          &larr; {tNav('back')}
        </Link>
      </div>
    );
  }

  // Fecha internacionalizada dinámicamente
  const formattedDate = new Date(post.createdAt).toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="pb-12 relative min-h-screen">
      
      {/* 1. SECCIÓN HERO (Imagen gigante de fondo) */}
      <div className="w-full h-[40vh] md:h-[50vh] bg-gray-900 relative">
        {post.imageUrl ? (
          <img 
            src={post.imageUrl} 
            alt={post.title} 
            className="w-full h-full object-cover opacity-70" 
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-600 to-indigo-700 opacity-90"></div>
        )}
        
        {/* Botón de volver flotante sobre la imagen */}
        <div className="absolute top-6 left-6 z-10">
          <Link 
            href="/" 
            className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-xl transition-all inline-flex items-center text-sm font-medium shadow-lg"
          >
            &larr; {tNav('back')}
          </Link>
        </div>
      </div>

      {/* 2. CONTENIDO PRINCIPAL (Tarjeta superpuesta) */}
      <main className="max-w-4xl mx-auto px-6 -mt-32 relative z-20">
        <article className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <div className="p-8 md:p-14">
            
            <header className="mb-10 text-center">
              <span className="text-blue-600 font-semibold tracking-wider uppercase text-xs mb-4 block">
                Blog Post
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                {post.title}
              </h1>
              <p className="text-gray-500 font-medium capitalize">
                {formattedDate}
              </p>
            </header>

            <div className="prose prose-lg max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
              {post.content}
            </div>
            
            {/* Botones de Acción (Editar / Eliminar) */}
            <div className="mt-16 pt-8 border-t border-gray-100 flex flex-wrap gap-4 justify-center">
               <Link 
                 href={`/posts/${post.slug}/edit`} 
                 className="px-8 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors shadow-md"
               >
                 {tPost('edit')}
               </Link>
               <button 
                 onClick={() => setShowDeleteModal(true)} 
                 className="px-8 py-3 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-colors"
               >
                 {tPost('delete')}
               </button>
            </div>
          </div>
        </article>
      </main>

      {/* 3. MODAL DE ELIMINACIÓN (Mantenido intacto y funcional) */}
      {showDeleteModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={() => !isDeleting && setShowDeleteModal(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{tPost('deleteConfirmTitle')}</h3>
              <p className="text-gray-500 mb-6">{tPost('deleteConfirmText')}</p>
              <div className="flex gap-3 justify-end">
                <button 
                  onClick={() => setShowDeleteModal(false)} 
                  disabled={isDeleting} 
                  className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-medium disabled:opacity-50 transition-colors"
                >
                  {tPost('cancel')}
                </button>
                <button 
                  onClick={executeDelete} 
                  disabled={isDeleting} 
                  className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg font-medium flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                >
                  {isDeleting ? (
                    <><span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>{tPost('saving')}</>
                  ) : tPost('deleteConfirmYes')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}