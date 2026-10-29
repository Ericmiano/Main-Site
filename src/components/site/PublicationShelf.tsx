import type { CSSProperties } from "react";
import { shelfPublications, type ShelfPublication } from "@/data/report-archives";

/** How thick each kind of publication stands, from its page count: magazines
 * are thin even when long (glossy paper), reports thicken with their pages,
 * booklets are a few folded sheets. */
const thickness = ({ kind, pages }: ShelfPublication) =>
  kind === "magazine"
    ? Math.round(Math.min(10, 3 + pages / 20))
    : kind === "report"
      ? Math.round(Math.min(22, 5 + pages / 6))
      : 3;

const KIND_LABEL: Record<ShelfPublication["kind"], string> = {
  magazine: "Magazine",
  report: "Report",
  booklet: "Booklet",
};

/**
 * AAK's publications as books on a shelf that glides past in a loop. The
 * books stand angled, spines showing; hovering the shelf stops it, and
 * hovering or focusing a book turns it to face the reader and lifts it off
 * the shelf. It opens the PDF. Each book is a CSS 3D box (cover, spine, page
 * edges, back) made to look like what it is: a thin glossy magazine, a
 * matte softcover report, or a stapled booklet; see `.shelf` in styles.css.
 *
 * The loop: the books are listed twice and the row slides left by one
 * list's width, then starts again, seamlessly. The second list is a visual
 * copy only (hidden from screen readers, skipped by Tab). With reduced
 * motion the shelf stands still and scrolls sideways instead.
 */
export function PublicationShelf() {
  return (
    <div className="shelf-viewport">
      <ul
        className="shelf"
        aria-label="Featured publications"
        style={{ "--books": shelfPublications.length } as CSSProperties}
      >
        {shelfPublications.map((pub) => (
          <Book key={pub.href} pub={pub} />
        ))}
        {shelfPublications.map((pub) => (
          <Book key={`copy-${pub.href}`} pub={pub} copy />
        ))}
      </ul>
    </div>
  );
}

function Book({ pub, copy = false }: { pub: ShelfPublication; copy?: boolean }) {
  return (
    <li className="shelf-item" aria-hidden={copy || undefined} data-copy={copy || undefined}>
      <a
        href={pub.href}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={copy ? -1 : undefined}
        className="book"
        data-kind={pub.kind}
        aria-label={`${pub.title} (${pub.year}, PDF, ${pub.pages} pages)`}
        style={
          {
            "--t": `${thickness(pub)}px`,
            "--ratio": `${pub.cover.width} / ${pub.cover.height}`,
            "--cover": `url(${pub.cover.src})`,
          } as CSSProperties
        }
      >
        <span className="book-stand" aria-hidden="true">
          <span className="book-body">
            <img
              src={pub.cover.src}
              width={pub.cover.width}
              height={pub.cover.height}
              alt=""
              loading="lazy"
              decoding="async"
              className="book-cover"
            />
            <span className="book-gloss" />
            <span className="book-spine" />
            <span className="book-pages" />
            <span className="book-back" />
          </span>
        </span>
        <span className="book-caption" aria-hidden="true">
          <span className="book-label">{pub.label}</span>
          <span className="book-meta">
            {KIND_LABEL[pub.kind]} &middot; {pub.year} &middot; {pub.pages} pages
          </span>
        </span>
      </a>
    </li>
  );
}
