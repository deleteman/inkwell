import Link from 'next/link';
import { getAllArticles } from '@/app/lib/blogUtils';
import { formatDate } from '@/app/lib/date';
import Head from 'next/head';
import { WEBSITE_TITLE, WEBSITE_URL } from '@/app/lib/constants';

export const metadata = {
  title: `${WEBSITE_TITLE} - Blog`,
  description: 'Read the latest articles and insights about how to write effective technical articles.',
};

export default async function BlogPage() {
  const articles = await getAllArticles();

  return (
    <div className="flex flex-col min-h-screen max-w-5xl mx-auto px-4 py-12 bg-background text-foreground">
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </Head>
      
      <header className="mb-16">
        <div className="flex items-center space-x-1">
          <img src="/logo.png" alt="InkwellAI Logo" className="w-20 h-20" />
          <h1 className="text-5xl font-bold text-blue-600">
            Inkwell<span className="text-green-500">AI</span>'s Blog
          </h1>
        </div>

        <p className="text-xl text-gray-600 dark:text-gray-400">
          Learn everything you need to become a better writer.
        </p>
      </header>
      
      <main className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-8">
        {articles.map((article) => (
          <article
            key={article.slug}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800 transition-transform transform hover:scale-105"
          >
            <img src={article.header_image_url} alt={article.title} className="mb-4 rounded-t-lg" />
            <h2 className="text-2xl font-semibold text-blue-500 hover:text-blue-700 transition-colors">
              <Link href={`/blog/${article.slug}`}>{article.title}</Link>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
              {formatDate(article.date)}
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {article.description}
            </p>
            
            {/* Tags Section */}
            <div className="mb-4">
              {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
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
            </div>
            
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
