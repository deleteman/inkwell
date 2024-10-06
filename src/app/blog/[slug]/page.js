// src/pages/blog/[slug].js

import { getAllBlogSlugs, getArticleContent } from '@/app/lib/blogUtils';
import { formatDate } from '@/app/lib/date';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import 'highlight.js/styles/github.css'; // We'll update this later

import { WEBSITE_URL, WEBSITE_TITLE } from '@/app/lib/constants';

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

export default async function BlogPage({ params }) {
  const articleData = await getArticleContent(params.slug);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 bg-background text-foreground">
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
      </header>
      <main className="prose dark:prose-dark">
        <img src={articleData.header_image_url} alt={articleData.title} className="mb-8" />
        <MDXContent source={articleData.mdxSource} articles={getAllBlogSlugs()} />
      </main>
    </div>
  );
}
