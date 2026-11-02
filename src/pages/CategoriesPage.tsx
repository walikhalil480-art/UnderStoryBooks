import React from 'react';
import { ArrowRight } from 'lucide-react';
import { BOOKS, CATEGORIES } from '../data/books';
import { CategorySlug } from '../types';
import { EditorialImage } from '../components/EditorialImage';
import { BookCover } from '../components/BookCover';

interface CategoriesPageProps {
  onSelectCategory: (slug: CategorySlug) => void;
  onSelectBook: (bookId: string) => void;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({
  onSelectCategory,
  onSelectBook
}) => {
  return (
    <div className="categories-page">
      <section className="explore-header-banner">
        <div className="container">
          <span className="section-eyebrow">CURATED SUBJECT ROOMS</span>
          <h1 className="explore-page-title">Browse by Subject &amp; Discipline</h1>
          <p className="explore-page-description">
            Explore our curated departments—from classic Somali literature and poetry to science, philosophy, and history. Each room brings together landmark unabridged works and foundational contemporary studies.
          </p>
        </div>
      </section>

      <div className="container categories-directory-list">
        {CATEGORIES.map((category, idx) => {
          const catBooks = BOOKS.filter((b) => b.categorySlug === category.slug);
          return (
            <section
              key={category.slug}
              className="category-showcase-row"
              aria-labelledby={`cat-heading-${category.slug}`}
            >
              <div className="category-showcase-left">
                <div className="category-showcase-num">
                  ROOM {String(idx + 1).padStart(2, '0')}
                </div>
                <h2 id={`cat-heading-${category.slug}`} className="category-showcase-title">
                  {category.name}
                </h2>
                <p className="category-showcase-note">{category.editorialNote}</p>

                <div className="category-showcase-photo">
                  <EditorialImage
                    src={category.imageUrl}
                    alt={category.imageAlt}
                    aspectRatio="landscape"
                  />
                </div>

                <button
                  type="button"
                  className="btn-primary-solid"
                  onClick={() => onSelectCategory(category.slug)}
                >
                  <span>Filter All {catBooks.length} {category.name} Editions</span>
                  <ArrowRight size={16} />
                </button>
              </div>

              <div className="category-showcase-right">
                <h3 className="category-shelf-label">
                   Editions in {category.name} ({catBooks.length})
                </h3>
                <div className="category-mini-shelf">
                  {catBooks.map((book) => (
                    <div key={book.id} className="category-shelf-book">
                      <button
                        type="button"
                        className="category-shelf-cover-btn"
                        onClick={() => onSelectBook(book.id)}
                      >
                        <BookCover book={book} size="sm" />
                      </button>
                      <div className="category-shelf-book-info">
                        <span className="shelf-book-year">
                          {book.publishedYear < 0
                            ? `${Math.abs(book.publishedYear)} BC`
                            : book.publishedYear}{' '}
                          • {book.priceDisplay}
                        </span>
                        <h4 className="shelf-book-title">
                          <button type="button" onClick={() => onSelectBook(book.id)}>
                            {book.title}
                          </button>
                        </h4>
                        <p className="shelf-book-author">{book.author}</p>
                        <p className="shelf-book-desc">{book.shortSynopsis}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};
