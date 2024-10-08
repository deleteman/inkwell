// src/pages/blog/[slug].js

import Link from 'next/link';
import { getBlogSlugsByTags, getAllBlogSlugs, getArticleContent } from '@/app/lib/blogUtils';
import { formatDate } from '@/app/lib/date';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { WEBSITE_TITLE, WEBSITE_URL } from '@/app/lib/constants';

// Dynamic import for MDX content with SSR disabled
const MDXContent = dynamic(() => import('./MDXContent'), { ssr: false });

export async function generateStaticParams() {
  const paths = await getAllBlogSlugs();
  return paths.map((slug) => ({
    slug: slug,
  }));
}

export async function generateMetadata({ params }) {
  const articleData = await getArticleContent(params.slug);
  return {
    title: articleData.title,
    description: articleData.description,
    openGraph: {
      title: `${WEBSITE_TITLE} - ${articleData.title}`,
      description: articleData.description,
      url: `${WEBSITE_URL}/blog/${params.slug}`,
      siteName: WEBSITE_TITLE,
      type: 'website',
      images: [
        {
          url: '/og-image.png',
          secureUrl: `${WEBSITE_URL}/og-image.png`,
          width: 1500,
          height: 500,
          alt: WEBSITE_TITLE,
        },
      ],
    },
  };
}

export default async function BlogArticlePage({ params }) {
  const articleData = await getArticleContent(params.slug);
  const relatedArticles = await getBlogSlugsByTags(articleData.tags, params.slug);

  return (
    <div className="flex flex-col min-h-screen max-w-3xl mx-auto px-4 py-8 bg-background text-foreground">
      <Head>
        <title>{articleData.title}</title>
        <meta name="description" content={articleData.description} />
        <meta property="og:image" content={articleData.header_image_url} />
      </Head>

      <header className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-6">
        <Link href="/blog" className="text-blue-500 hover:text-blue-700 mb-4 inline-block">
          ← Back to Blog
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{articleData.title}</h1>
        <p className="text-gray-600 dark:text-gray-400">{formatDate(articleData.date)}</p>

        {/* Tags Section */}
        {articleData.tags && articleData.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {articleData.tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog/tag/${encodeURIComponent(tag.toLowerCase())}`}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm hover:bg-blue-200 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}
      </header>

      <main className="prose dark:prose-dark">
        <img src={articleData.header_image_url} alt={articleData.title} className="mb-8" />
        <MDXContent source={articleData.mdxSource} articles={relatedArticles} />
      </main>

      {/* Footer Section */}
      <footer className="mt-16 border-t border-gray-200 dark:border-gray-700 pt-6">
        <p className="text-center text-gray-600 dark:text-gray-400">
          &copy; {new Date().getFullYear()} {WEBSITE_TITLE}.{' '}
          <Link href="/" className="text-blue-500 hover:text-blue-700">
            Visit our homepage
          </Link>
          .
        </p>
      </footer>
    </div>
  );
}
