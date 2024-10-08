// src/pages/blog/tag/[tag].js

import Link from 'next/link';
import { getAllArticles } from '@/app/lib/blogUtils';
import { formatDate } from '@/app/lib/date';
import Head from 'next/head';
import { WEBSITE_TITLE, WEBSITE_URL } from '@/app/lib/constants';

export async function generateStaticParams() {
  const articles = await getAllArticles();
  const tags = new Set();
  articles.forEach(article => {
    article.tags.forEach(tag => tags.add(tag.toLowerCase()));
  });
  return Array.from(tags).map(tag => ({
    tag: tag,
  }));
}

export async function generateMetadata({ params }) {
  const tag = params.tag;
  return {
    title: `${WEBSITE_TITLE} - ${tag.charAt(0).toUpperCase() + tag.slice(1)} Articles`,
    description: `Browse all articles tagged with "${tag}".`,
    openGraph: {
      title: `${WEBSITE_TITLE} - ${tag.charAt(0).toUpperCase() + tag.slice(1)} Articles`,
      description: `Browse all articles tagged with "${tag}".`,
      url: `${WEBSITE_URL}/blog/tag/${params.tag}`,
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

export default async function TagPage({ params }) {
  const articles = await getAllArticles();
  console.log("Articles: ", articles)
  console.log("tag: ", params.tag)
  const filteredArticles = articles.filter(article =>
    article.tags.map(t => t.toLowerCase()).includes(decodeURIComponent(params.tag))
  );

  return (
    <div className="flex flex-col min-h-screen max-w-5xl mx-auto px-4 py-12 bg-background text-foreground">
      <Head>
        <title>{`${WEBSITE_TITLE} - ${params.tag.charAt(0).toUpperCase() + params.tag.slice(1)} Articles`}</title>
        <meta name="description" content={`Browse all articles tagged with "${params.tag}".`} />
      </Head>

      <header className="mb-16">
        <Link href="/blog" className="text-blue-500 hover:text-blue-700 mb-4 inline-block">
          ← Back to Blog
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Articles Tagged: {decodeURI(params.tag.charAt(0).toUpperCase() + params.tag.slice(1))}
        </h1>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredArticles.map((article) => (
          <article
            key={article.slug}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800 transition-transform transform hover:scale-105"
          >
            <h2 className="text-2xl font-semibold text-blue-500 hover:text-blue-700 transition-colors">
              <Link href={`/blog/${article.slug}`}>{article.title}</Link>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
              {formatDate(article.date)}
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {article.description}
            </p>
            <Link href={`/blog/${article.slug}`} className="text-blue-500 hover:text-blue-700 font-medium">
              Read More &rarr;
            </Link>
          </article>
        ))}
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
