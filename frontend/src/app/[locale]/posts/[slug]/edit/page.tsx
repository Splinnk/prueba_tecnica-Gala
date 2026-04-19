'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { useRouter, Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl: string | null;
  version: number;
}

export default function EditPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();
  
  const t = useTranslations('Post');
  const tNav = useTranslations('Navigation');
  const tToasts = useTranslations('Toasts');

  const [post, setPost] = useState<Post | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/posts/${slug}`);
        setPost(data);
        setTitle(data.title);
        setContent(data.content);
        setImageUrl(data.imageUrl || '');
      } catch (err) {
        toast.error(tToasts('errorFetch'));
        router.push('/');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [slug, router, tToasts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post) return;

    setIsSaving(true);

    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/posts/${post.id}`, {
        title: title.trim(),
        content: content.trim(),
        imageUrl: imageUrl.trim() || null,
        version: post.version // Optimistic Concurrency Control
      });

      toast.success(tToasts('editSuccess'));
      router.push(`/posts/${slug}`);
      router.refresh(); 
      
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 409) {
          toast.error(tToasts('errorConflict'));
        } else {
          toast.error(tToasts('errorSave'));
        }
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6">
      <main className="max-w-3xl mx-auto">
        <header className="mb-8 text-center">
          <Link href={`/posts/${slug}`} className="text-blue-600 font-medium hover:text-blue-700 transition-colors mb-4 inline-block">
            &larr; {tNav('back')}
          </Link>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            {t('edit')}
          </h1>
        </header>

        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Title Input */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                {t('title')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isSaving}
                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none disabled:opacity-50 placeholder-gray-400"
                placeholder={t('placeholderTitle')}
                required
              />
            </div>

            {/* Content Textarea */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                {t('content')} <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={8}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={isSaving}
                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none disabled:opacity-50 placeholder-gray-400"
                placeholder={t('placeholderContent')}
                required
              />
            </div>

            {/* Image URL Input */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                {t('imageUrl')}
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                disabled={isSaving}
                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none disabled:opacity-50 placeholder-gray-400"
                placeholder={t('placeholderImageUrl')}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
              <Link href={`/posts/${slug}`} className="px-8 py-3 text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl font-medium transition-colors">
                {t('cancel')}
              </Link>
              <button
                type="submit"
                disabled={isSaving}
                className="px-8 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-xl font-medium shadow-md shadow-blue-200 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <><span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>{t('saving')}</>
                ) : t('save')}
              </button>
            </div>
            
          </form>
        </div>
      </main>
    </div>
  );
}