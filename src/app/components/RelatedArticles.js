import React from 'react';
import styles from './RelatedArticles.module.css'; // Add CSS for styling

let articles = null;
const RelatedArticles = ({ currentTags }) => {
  const filteredArticles = articles.filter(
    (art) =>
      art.frontMatter.tags &&
      art.frontMatter.tags.some((tag) => currentTags.includes(tag)) &&
      !currentTags.every((tag) => art.frontMatter.tags.includes(tag))
  );

  if (filteredArticles.length === 0) {
    return <p>No related articles available.</p>;
  }

  return (
    <div className={styles.relatedComparisonsContainer}>
      <h2>Keep reading...</h2>
      <ul className={styles.comparisonsGrid}>
        {filteredArticles.map((art) => (
          <li key={art._id}>
            <Link href={`/blog/${art.slug}`}>
              <a>{art.frontMatter.title}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default function(ids) {
    articles = ids;
    return RelatedArticles;
}
