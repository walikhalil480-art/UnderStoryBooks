import React from 'react';
import { ArrowRight, BookOpen, Library } from 'lucide-react';
import { BOOKS, CURATED_COLLECTIONS, LIBRARY_WINGS } from '../data/books';
import { CollectionTag } from '../types';
import { EditorialImage } from '../components/EditorialImage';
import { BookCover } from '../components/BookCover';
import { BookCard } from '../components/BookCard';
import { IMAGE_REGISTRY } from '../data/imageRegistry';

interface CollectionsPageProps {
  onSelectBook: (bookId: string) => void;
  onReadBook: (bookId: string) => void;
  onExploreCollection: (collection: CollectionTag) => void;
  bookmarkedIds: string[];
  onToggleBookmark: (bookId: string, e: React.MouseEvent) => void;
  purchasedBookIds?: string[];
}

export const CollectionsPage: React.FC<CollectionsPageProps> = ({
  onSelectBook,
  onReadBook,
  onExploreCollection,
  bookmarkedIds,
  onToggleBookmark,
  purchasedBookIds
}) => {
  const heroAsset = IMAGE_REGISTRY['collections-page-hero'];
  return (
    <div className="collections-page">
      {/* Editorial Hero Banner for Collections */}
      <section className="page-editorial-hero">
        <div className="container page-editorial-hero-grid">
          <div className="page-editorial-copy">
            <span className="section-eyebrow">CURATED READING ROOMS &amp; ARCHIVES</span>
            <h1 className="explore-page-title">
              Curated Collections &amp; The Library Stacks
            </h1>
            <p className="explore-page-description">
              Browse thematic collections assembled by Understory’s editors—pairing antique public-domain folios and nineteenth-century classics with landmark works of modern literature, science, and engineering.
            </p>
          </div>
          <div className="page-editorial-banner-photo">
            <EditorialImage
              src={heroAsset.url}
              alt={heroAsset.alt}
              subjectType={heroAsset.subjectType}
              aspectRatio="landscape"
              priority={true}
            />
          </div>
        </div>
      </section>

      {/* Architectural Library Wings Summary */}
      <section className="section-block library-wings-overview" aria-labelledby="wings-overview-heading">
        <div className="container">
          <div className="section-header-row">
            <div>
              <span className="section-eyebrow">ARCHITECTURAL STACKS</span>
              <h2 id="wings-overview-heading" className="section-title">
                Three Galleries of The Understory Library
              </h2>
            </div>
            <p className="section-subtitle">
              Inspired by the material permanence of oak bookshelves, leather bindings, and sunlit reading tables.
            </p>
          </div>

          <div className="wings-trio-grid">
            {LIBRARY_WINGS.map((wing) => {
              const wingBooks = wing.featuredBookIds
                .map((id) => BOOKS.find((b) => b.id === id))
                .filter(Boolean);
              return (
                <article key={wing.id} className="wing-summary-card">
                  <div className="wing-summary-photo">
                    <EditorialImage
                      src={wing.mainImageUrl}
                      alt={wing.mainImageAlt}
                      aspectRatio="landscape"
                    />
                    <span className="wing-code-pill">{wing.wingCode}</span>
                  </div>
                  <div className="wing-summary-body">
                    <h3 className="wing-summary-title">{wing.title}</h3>
                    <p className="wing-summary-desc">{wing.description}</p>
                    <div className="wing-mini-covers">
                      {wingBooks.map(
                        (b) =>
                          b && (
                            <button
                              key={b.id}
                              type="button"
                              className="wing-mini-cover-btn"
                              onClick={() => onSelectBook(b.id)}
                              title={`${b.title} by ${b.author}`}
                            >
                              <BookCover book={b} size="sm" />
                            </button>
                          )
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Curated Collections Stack */}
      <div className="container curated-collections-stack">
        {CURATED_COLLECTIONS.map((col, idx) => {
          const colBooks = col.bookIds
            .map((id) => BOOKS.find((b) => b.id === id))
            .filter((b): b is NonNullable<typeof b> => Boolean(b));

          return (
            <section
              key={col.id}
              className="curated-collection-block"
              aria-labelledby={`col-heading-${col.id}`}
            >
              <div className={`collection-editorial-lead ${idx % 2 === 1 ? 'reverse' : ''}`}>
                <div className="collection-lead-text">
                  <div className="collection-kicker-row">
                    <Library size={14} className="brass-icon" />
                    <span className="section-eyebrow">{col.kicker}</span>
                  </div>
                  <h2 id={`col-heading-${col.id}`} className="collection-lead-title">
                    {col.title}
                  </h2>
                  <p className="collection-lead-subtitle">{col.subtitle}</p>
                  <p className="collection-lead-desc">{col.description}</p>
                  <div className="collection-lead-actions">
                    <button
                      type="button"
                      className="btn-primary-solid"
                      onClick={() => onExploreCollection(col.slug)}
                    >
                      <span>Filter {col.title} in Catalogue</span>
                      <ArrowRight size={15} />
                    </button>
                    {colBooks[0] && (
                      <button
                        type="button"
                        className="btn-secondary-outline"
                        onClick={() => onReadBook(colBooks[0].id)}
                      >
                        <BookOpen size={15} />
                        <span>Read Lead Volume</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="collection-lead-visual">
                  <EditorialImage
                    src={col.heroImageUrl}
                    alt={col.heroImageAlt}
                    aspectRatio="landscape"
                  />
                  <div className="collection-visual-caption">
                    <span>{col.accentNote}</span>
                    <span>{colBooks.length} Featured Volumes</span>
                  </div>
                </div>
              </div>

              <div className="books-grid-3 collection-books-grid">
                {colBooks.slice(0, 3).map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    onSelectBook={onSelectBook}
                    onReadBook={onReadBook}
                    isBookmarked={bookmarkedIds.includes(book.id)}
                    onToggleBookmark={onToggleBookmark}
                    isPurchased={purchasedBookIds?.includes(book.id)}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};
