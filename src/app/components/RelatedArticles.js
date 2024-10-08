import React from 'react';
import Link from 'next/link';
import styles from './RelatedArticles.module.css'; // Add CSS for styling

let articles = null;
const RelatedArticles = () => {
  if (articles.length === 0) {
    return <p>No related articles available.</p>;
  }

  return (
    <div className={styles.relatedComparisonsContainer}>
      <h2>You might also enjoy...</h2>
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-4`}>
        {articles
          .slice(0, 2)
          .map((art) => (
            <div key={art._id} className={styles.comparisonBox}>
              <Link href={`/blog/${art.slug}`}>
                <img src={art.header_image_url} alt={art.title} className={styles.thumbnail} />
                <h3 className={styles.comparisonTitle}>{art.title}</h3>
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
};

export default function(ids) {
    articles = ids;
    return RelatedArticles;
}
