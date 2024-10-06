

/**
 * Finds and returns all slugs from articles inside the /blog folder
 */

import { readdirSync } from 'fs';
import { readFile} from 'fs/promises';
import { join } from 'path';

import { serialize } from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

import matter from 'gray-matter'

/**
 * Fetches the front matter of a single blog post by slug
 * @param {string} slug - The slug of the blog post
 */
export async function getArticleFrontMatter(slug) {
    const fullPath = join(process.cwd(), 'src', 'app', 'blog', `${slug}.mdx`);
    const fileContents = await readFile(fullPath, 'utf8');
    const { data } = matter(fileContents);
    
    return data;
  }

/**
 * Retrieves front matter for all blog posts
 */
export async function getAllArticles() {
    const slugs = getAllBlogSlugs();
    
    const articles = await Promise.all(
      slugs.map(async (slug) => {
        const data = await getArticleFrontMatter(slug);
        return {
          slug,
          ...data,
        };
      })
    );
    
    // Sort articles by date in descending order (newest first)
    articles.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    return articles;
  }

export function getAllBlogSlugs() {
  const files = readdirSync(join(process.cwd(), 'src', 'app', 'blog'));

  return files.filter((file) => file.endsWith('.mdx')).map((file) => file.replace(/\.mdx$/, ''));
}


/**
 * Returns the content of the article with the given slug
 */
export async function getArticleContent(slug) {
    const fullPath = join(process.cwd(), 'src', 'app', 'blog', `${slug}.mdx`);
    console.log("Reading file: ", fullPath);
  
    const fileContents = await readFile(fullPath, 'utf8');
  
    // Use gray-matter to parse the front matter
    const { content, data } = matter(fileContents);
  
    // Serialize the MDX content
    const mdxSource = await serialize(content, {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeHighlight],
      },
      scope: data,
    });
  
    return { mdxSource, ...data };
  }