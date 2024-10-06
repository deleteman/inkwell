// app/sitemap.xml/route.js

import { getAllBlogSlugs } from '@/app/lib/blogUtils';
import { WEBSITE_URL } from '@/app/lib/constants';

export async function GET() {
  try {
    const slugs = await getAllBlogSlugs();

    const baseUrl = WEBSITE_URL; // e.g., 'https://www.inkwell.com'

    const urls = slugs.map((slug) => {
      return `
        <url>
          <loc>${baseUrl}/blog/${slug}</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>monthly</changefreq>
          <priority>0.8</priority>
        </url>
      `;
    }).join('');

    // Optionally, include the blog homepage
    const blogHome = `
      <url>
        <loc>${baseUrl}/blog</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
      </url>
    `;

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${blogHome}
      ${urls}
    </urlset>`;

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
