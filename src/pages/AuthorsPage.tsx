import React from 'react';
import { BookOpen, ArrowRight } from 'lucide-react';
import { AUTHORS, BOOKS } from '../data/books';
import { EditorialImage } from '../components/EditorialImage';
import { BookCover } from '../components/BookCover';

interface AuthorsPageProps {
  onSelectBook: (bookId: string) => void;
  onReadBook: (bookId: string) => void;
  onFilterByAuthor: (authorId: string) => void;
}

export const AuthorsPage: React.FC<AuthorsPageProps> = ({
  onSelectBook,
  onReadBook,
  onFilterByAuthor
}) => {
  // Gather additional catalogue authors not in the featured portrait list
  const featuredIds = new Set(AUTHORS.map((a) => a.id));
  const otherAuthors = Array.from(
    new Map(
      BOOKS.filter((b) => !featuredIds.has(b.authorId)).map((b) => [
        b.authorId,
        {
          id: b.authorId,
          name: b.author,
          category: b.category,
          books: BOOKS.filter((item) => item.authorId === b.authorId)
        }
      ])
    ).values()
  );

  return (
    <div className="authors-page">
      <section className="explore-header-banner">
        <div className="container">
          <span className="section-eyebrow">LITERARY &amp; SCIENTIFIC BIOGRAPHIES</span>
          <h1 className="explore-page-title">Authors &amp; Contributors</h1>
          <p className="explore-page-description">
            Verified biographical profiles, archival portraits, and complete bibliographies for the novelists, philosophers, naturalists, and computer scientists in our collection.
          </p>
        </div>
      </section>

      <div className="container authors-profiles-stack">
        {AUTHORS.map((author) => {
          const authorBooks = BOOKS.filter((b) => b.authorId === author.id);
          return (
            <article key={author.id} className="author-directory-card">
              <div className="author-dir-left">
                <div className="author-dir-portrait">
                  <EditorialImage
                    src={author.portraitUrl}
                    alt={author.portraitAlt}
                    aspectRatio="portrait"
                  />
                </div>
                <p className="author-dir-credit">{author.portraitCredit}</p>
              </div>

              <div className="author-dir-right">
                <div className="author-dir-header">
                  <div>
                    <span className="section-eyebrow">
                      {author.nationality.toUpperCase()} • {author.lifespan}
                    </span>
                    <h2 className="author-dir-name">{author.name}</h2>
                  </div>
                  <button
                    type="button"
                    className="btn-secondary-outline"
                    onClick={() => onFilterByAuthor(author.id)}
                  >
                    <span>Filter in Catalogue ({authorBooks.length})</span>
                    <ArrowRight size={14} />
                  </button>
                </div>

                <blockquote className="author-dir-quote">
                  “{author.notableQuote}”
                  <cite>— {author.quoteSource}</cite>
                </blockquote>

                <div className="author-dir-bio">
                  {author.fullBiography.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>

                <div className="author-dir-bibliography">
                  <h3 className="author-bib-heading">
                    Editions by {author.name} in Catalogue
                  </h3>
                  <div className="author-bib-grid">
                    {authorBooks.map((book) => (
                      <div key={book.id} className="author-bib-item">
                        <button
                          type="button"
                          className="author-bib-cover"
                          onClick={() => onSelectBook(book.id)}
                        >
                          <BookCover book={book} size="sm" />
                        </button>
                        <div className="author-bib-meta">
                          <span className="author-bib-year">
                            {book.publishedYear < 0
                              ? `${Math.abs(book.publishedYear)} BC`
                              : book.publishedYear}
                          </span>
                          <h4 className="author-bib-title">
                            <button type="button" onClick={() => onSelectBook(book.id)}>
                              {book.title}
                            </button>
                          </h4>
                          <p className="author-bib-synopsis">{book.shortSynopsis}</p>
                          <div className="author-bib-links">
                            <button
                              type="button"
                              className="author-work-btn"
                              onClick={() => onSelectBook(book.id)}
                            >
                              Edition Details
                            </button>
                            <button
                              type="button"
                              className="author-work-read-btn"
                              onClick={() => onReadBook(book.id)}
                            >
                              <BookOpen size={13} /> Read
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          );
        })}

        {/* Complete Index of Other Catalogue Authors */}
        <section className="other-authors-index" aria-labelledby="other-authors-heading">
          <div className="section-header-row">
            <div>
              <span className="section-eyebrow">ADDITIONAL CATALOGUE AUTHORS</span>
              <h2 id="other-authors-heading" className="section-title">
                Index of Represented Writers &amp; Scholars
              </h2>
            </div>
          </div>

          <div className="other-authors-grid">
            {otherAuthors.map((entry) => (
              <div key={entry.id} className="other-author-box">
                <span className="other-author-cat">{entry.category}</span>
                <h3 className="other-author-name">{entry.name}</h3>
                <ul className="other-author-books">
                  {entry.books.map((b) => (
                    <li key={b.id}>
                      <button type="button" onClick={() => onSelectBook(b.id)}>
                        {b.title} ({b.publishedYear < 0 ? `${Math.abs(b.publishedYear)} BC` : b.publishedYear})
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
