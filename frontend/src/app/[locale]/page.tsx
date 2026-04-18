'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { toast } from 'sonner';

// Type definition based on our Prisma Schema
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
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/posts`);
        setPosts(response.data);
      } catch (err) {
        setError('Failed to load posts');
        toast.error('Error connecting to the server');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 font-semibold">
        {error}
      </div>
    );
  }

  return (
    <main className="max-w-5xl mx-auto p-6 mt-10">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold">{t('home')}</h1>
        <Link 
          href="/create" 
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
        >
          {t('create')}
        </Link>
      </header>

      {posts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-lg">{tPost('empty')}</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article key={post.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
              {post.imageUrl && (
                <img 
                  src={post.imageUrl} 
                  alt={post.title} 
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-5 flex flex-col flex-grow">
                <h2 className="text-xl font-bold mb-2 line-clamp-1">{post.title}</h2>
                <p className="text-gray-600 mb-4 line-clamp-3 text-sm flex-grow">
                  {post.content}
                </p>
                <Link 
                  href={`/posts/${post.slug}`} 
                  className="text-blue-600 font-medium hover:underline mt-auto"
                >
                  {tPost('readMore')} &rarr;
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}