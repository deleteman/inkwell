'use client';

import { MDXRemote } from 'next-mdx-remote';
import RelatedArticles from '@/app/components/RelatedArticles';

export default function MDXContent({ source, articles}) {
  return <MDXRemote {...source} 
            components={{RelatedArticles: RelatedArticles(articles)}}
          />;
}