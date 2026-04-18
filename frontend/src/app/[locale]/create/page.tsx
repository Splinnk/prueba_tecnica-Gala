'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter, Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

export default function CreatePostPage() {
  const t = useTranslations('Post');
  const tNav = useTranslations('Navigation');
  const router = useRouter();

  // Form States
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  
  // UX States
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Frontend Pre-Validation (Fails fast before hitting the server)
    if (title.trim().length < 3) {
      toast.error('Title must be at least 3 characters long');
      return;
    }
    if (content.trim().length < 10) {
      toast.error('Content must be at least 10 characters long');
      return;
    }

    // 2. Lock UI
    setIsLoading(true);

    try {
      // 3. Send to our Express Backend
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
        title: title.trim(),
        content: content.trim(),
        // Only send imageUrl if it's not empty, otherwise let the backend make it null
        imageUrl: imageUrl.trim() || undefined, 
      });

      // 4. Success feedback and redirection
      toast.success('Post created successfully!');
      router.push('/'); 
      
    } catch (error) {
      // 5. Error Handling
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        toast.error('Validation error from server. Please check your inputs.');
      } else {
        toast.error('An error occurred while creating the post.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto p-6 mt-10">
      <header className="mb-8">
        <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
          &larr; {tNav('back')}
        </Link>
        <h1 className="text-4xl font-bold text-gray-900">{tNav('create')}</h1>
      </header>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-6">
        
        {/* Title Input */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            {t('title')} <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isLoading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="e.g. The Future of Architecture"
            required
          />
        </div>

        {/* Content Input */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            {t('content')} <span className="text-red-500">*</span>
          </label>
          <textarea
            id="content"
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isLoading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="Write the full body of your post here..."
            required
          />
        </div>

        {/* Image URL Input */}
        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
            {t('imageUrl')}
          </label>
          <input
            id="imageUrl"
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            disabled={isLoading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
          <Link 
            href="/"
            className="px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
          >
            {t('cancel')}
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                {t('saving')}
              </>
            ) : (
              t('save')
            )}
          </button>
        </div>

      </form>
    </main>
  );
}